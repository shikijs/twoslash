type Range = {
  begin: number
  end: number
  text?: string
  count?: number
  tooltip?: string[]
  classes?: string
  lsp?: string
}

const splice = (str: string, idx: number, rem: number, newString: string) =>
  str.slice(0, idx) + newString + str.slice(idx + Math.abs(rem))

/**
 * We're given the text which lives inside the token, and this function will
 * annotate it with twoslash metadata
 */
export function createHighlightedString(ranges: Range[], text: string, targetedWord: string = "") {
  const actions = [] as { text: string; index: number }[]

  // Why the weird chars? We need to make sure that generic syntax isn't
  // interpreted as html tags - to do that we need to switch out < to &lt; - *but*
  // making that transition changes the indexes because it's gone from 1 char to 4 chars

  // So, use an obscure character to indicate a real < for HTML, then switch it after

  ranges.forEach(r => {
    if (r.classes === "lsp") {
      // console.log(ranges, text, targetedWord)
      // The LSP response lives inside a dom attribute, which _can_ have < inside it, so switch them ahead of time.
      const lsp = htmlAttrReplacer(r.lsp || "")
      const underLineTargetedWord = r.lsp === targetedWord ? "style=⇯border-bottom: solid 2px lightgrey;⇯" : ""
      actions.push({ text: "⇍/data-lsp⇏", index: r.end })
      actions.push({ text: `⇍data-lsp lsp=¿${lsp}¿ ${underLineTargetedWord}⇏`, index: r.begin })
    } else if (r.classes === "err") {
      actions.push({ text: "⇍/data-err⇏", index: r.end })
      actions.push({ text: `⇍data-err⇏`, index: r.begin })
    } else if (r.classes === "query") {
      actions.push({ text: "⇍/data-highlight⇏", index: r.end })
      actions.push({ text: `⇍data-highlight'⇏`, index: r.begin })
    }
  })

  let html = (" " + text).slice(1)

  // Apply all the edits
  actions
    .sort((l, r) => r.index - l.index)
    .forEach(action => {
      html = splice(html, action.index, 0, action.text)
    })

  return htmlAttrUnReplacer(replaceTripleArrow(stripHTML(html)))
}

// HTML attributes have different rules,
const htmlAttrReplacer = (str: string) => str.replace(/"/g, "⃟")
const htmlAttrUnReplacer = (str: string) => str.replace(/⃟/g, '"')

// Inline strings which are shown at HTML level 
export const subTripleArrow = (str: string) => str.replace(/</g, "⇍").replace(/>/g, "⇏").replace(/'/g, "⇯")
export const replaceTripleArrow = (str: string) => str.replace(/⇍/g, "<").replace(/⇏/g, ">").replace(/⇯/g, "'").replace(/¿/g, "'")
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
