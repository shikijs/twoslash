import type { parse } from "fenceparser"

export type Meta = NonNullable<ReturnType<typeof parse>>

type Range = {
  begin: number
  end: number
  text?: string
  count?: number
  tooltip?: string[]
  classes?: string
  lsp?: string
}

/**
 * We're given the text which lives inside the token, and this function will
 * annotate it with twoslash metadata
 */
export function createHighlightedString(ranges: Range[], text: string, targetedWord: string = "") {
  // Why the weird chars? We need to make sure that generic syntax isn't
  // interpreted as html tags - to do that we need to switch out < to &lt; - *but*
  // making that transition changes the indexes because it's gone from 1 char to 4 chars
  //
  // So, use an obscure character to indicate a real < for HTML, then switch it after
  const tag = (x: string) => `⇍${x}⇏`
  const makeTagFromRange = (r: Range, close?: true) => {
    switch (r.classes) {
      case "lsp":
        // The LSP response lives inside a dom attribute, which _can_ have < inside it, so switch them ahead of time.
        const lsp = htmlAttrReplacer(r.lsp || "")
        const underLineTargetedWord = r.lsp === targetedWord ? "style=⇯border-bottom: solid 2px lightgrey;⇯" : ""
        return close ? tag("/data-lsp") : tag(`data-lsp lsp=¿${lsp}¿ ${underLineTargetedWord}`)
      case "query":
        return tag(`${close ? "/" : ""}data-highlight`)
      // handle both unknown and err variant as error-tag
      // case "err": is not required, just to be useful for others
      case "err":
      default:
        return tag(`${close ? "/" : ""}data-err`)
    }
  }

  ranges.sort((a, b) => {
    // Order of precedence
    // if two same offset meet, the lsp will be put as innermost than err and query
    const precedenceOf = (x?: string) => ["err", "query", "lsp"].indexOf(x ?? "")

    let cmp = 0
    // Can be desugared into,
    // 1. compare based on smaller begin, !(cmp) means if it's 0 then
    // 2. compare based on bigger end, ^ same thing again then
    // 3. compare based on higher precedence
    // && is so that if a step made cmp to something other than 0, it stops
    /***1*/ !(cmp = a.begin - b.begin) &&
      /*2*/ !(cmp = b.end - a.end) &&
      /*3*/ !(cmp = precedenceOf(a.classes) - precedenceOf(b.classes))
    return cmp
  }) // `Array.sort` works in place

  // Marks how much of the text has been put into the output/html
  let cursor = 0
  // should be maximum of O(n) where n is length of ranges
  const nest = (data: typeof ranges) => {
    let stack = ""
    const top = data.shift()! // I have made sure data can't be empty

    // parse from cursor to top.begin to make sure
    // strings on the way are parsed
    stack += text.substring(cursor, top.begin)
    cursor = top.begin

    // open tag
    stack += makeTagFromRange(top)

    // if the data still have an element that's in the top's range
    if (data.some(x => x.begin < top.end)) {
      stack += nest(data)
    } else {
      // othewise slice the text and set cursor
      stack += text.substring(top.begin, top.end)
      cursor = top.end
    }

    // close tag
    stack += makeTagFromRange(top, true)

    // if the tag is complete but still have some data left in the range
    if (data.length !== 0) {
      stack += nest(data)
    }

    return stack
  }

  // cloned because I don't feel comfortable modifying this as a side-effect from recursion
  const data = JSON.parse(JSON.stringify(ranges))
  const html = nest(data) + text.substring(cursor) // nested + leftover texts

  return htmlAttrUnReplacer(replaceTripleArrow(stripHTML(html)))
}

// HTML attributes have different rules,
const htmlAttrReplacer = (str: string) => str.replace(/"/g, "⃟")
const htmlAttrUnReplacer = (str: string) => str.replace(/⃟/g, '"')

// Inline strings which are shown at HTML level
export const subTripleArrow = (str: string) => str.replace(/</g, "⇍").replace(/>/g, "⇏").replace(/'/g, "⇯")
export const replaceTripleArrow = (str: string) =>
  str.replace(/⇍/g, "<").replace(/⇏/g, ">").replace(/⇯/g, "'").replace(/¿/g, "'")
export const replaceTripleArrowEncoded = (str: string) =>
  str.replace(/⇍/g, "&lt;").replace(/⇏/g, "&gt;").replace(/⇯/g, "&apos;")

export function stripHTML(text: string) {
  var table: any = {
    "<": "lt",
    '"': "quot",
    "'": "apos",
    "&": "amp",
    "\r": "#13",
    "\n": "#10",
  }

  return text.toString().replace(/[<"'\r\n&]/g, function (chr) {
    return "&" + table[chr] + ";"
  })
}

export function escapeHtml(html: string) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** Does anything in the object imply that we should highlight any lines? */
export const shouldBeHighlightable = (highlight: any) => {
  return !!Object.keys(highlight || {}).find(key => {
    if (key.includes("-")) return true
    if (!isNaN(parseInt(key))) return true
    return false
  })
}

/** Returns a func for figuring out if this line should be highlighted */
export const shouldHighlightLine = (highlight: any) => {
  const lines: number[] = []
  Object.keys(highlight || {}).find(key => {
    if (!isNaN(parseInt(key))) lines.push(parseInt(key))
    if (key.includes("-")) {
      const [first, last] = key.split("-")
      const lastIndex = parseInt(last) + 1
      for (let i = parseInt(first); i < lastIndex; i++) {
        lines.push(i)
      }
    }
  })

  return (line: number) => lines.includes(line)
}
