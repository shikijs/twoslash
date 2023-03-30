type Lines = import("shiki").IThemedToken[][]
type TwoSlash = import("@typescript/twoslash").TwoSlashReturn

import { TwoslashShikiOptions } from ".."
import { htmlForTags } from "../annotations"
import {
  shouldBeHighlightable,
  shouldHighlightLine,
  createHighlightedString,
  subTripleArrow,
  replaceTripleArrowEncoded,
  escapeHtml,
  Meta,
} from "../utils"
import { HtmlRendererOptions, preOpenerFromRenderingOptsWithExtras } from "./plain"

// OK, so - this is just straight up complex code.

// What we're trying to do is merge two sets of information into a single tree for HTML

// 1: Syntax highlight info from shiki
// 2: Twoslash metadata like errors, identifiers etc

// Because shiki gives use a set of lines to work from, then the first thing which happens
// is converting twoslash data into the same format.

// Things which make it hard:
//
// - Twoslash results can be cut, so sometimes there is edge cases between twoslash results
// - Twoslash results can be multi-file
// - the DOM requires a flattened graph of html elements (e.g. spans can' be interspersed)
//

export function twoslashRenderer(lines: Lines, options: HtmlRendererOptions & TwoslashShikiOptions, twoslash: TwoSlash, meta: Meta) {
  let html = ""

  const hasHighlight = meta.highlight && shouldBeHighlightable(meta.highlight)
  const hl = shouldHighlightLine(meta.highlight)

  if (twoslash.tags && twoslash.tags.length) html += "<div class='tag-container'>"
  
  html += preOpenerFromRenderingOptsWithExtras(options, meta, ["twoslash", "lsp"])
  if (meta.title) {
    html += `<div class='code-title'>${meta.title}</div>`
  }

  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }

  html += `<div class='code-container'><code>`

  const errorsGroupedByLine = groupBy(twoslash.errors, e => e.line) || new Map()
  const staticQuickInfosGroupedByLine = groupBy(twoslash.staticQuickInfos, q => q.line) || new Map()
  // A query is always about the line above it!
  const queriesGroupedByLine = groupBy(twoslash.queries, q => q.line - 1) || new Map()
  const tagsGroupedByLine = groupBy(twoslash.tags, q => q.line - 1) || new Map()

  /**
   * This is the index of the original twoslash code reference, it is not
   * related to the HTML output
   */
  let filePos = 0

  lines.forEach((l, i) => {
    const errors = errorsGroupedByLine.get(i) || []
    const lspValues = staticQuickInfosGroupedByLine.get(i) || []
    const queries = queriesGroupedByLine.get(i) || []
    const tags = tagsGroupedByLine.get(i) || []

    const hiClass = hasHighlight ? (hl(i + 1) ? " highlight" : " dim") : ""
    const prefix = `<div class='line${hiClass}'>`

    if (l.length === 0 && i === 0) {
      // Skip the first newline if it's blank
      filePos += 1
    } else if (l.length === 0) {
      const emptyLine = `${prefix}&nbsp;</div>` 
      html += emptyLine
      filePos += 1
    } else {
      html += prefix

      // Keep track of the position of the current token in a line so we can match it up to the
      // errors and lang serv identifiers
      let tokenPos = 0

      l.forEach(token => {
        let targetedQueryWord: typeof twoslash.staticQuickInfos[number] | undefined

        let tokenContent = ""
        // Underlining particular words
        const findTokenFunc = (start: number) => (e: any) =>
          start <= e.character && start + token.content.length >= e.character + e.length

        const findTokenDebug = (start: number) => (e: any) => {
          const result = start <= e.character && start + token.content.length >= e.character + e.length
          // prettier-ignore
          console.log(result, start, '<=', e.character, '&&', start + token.content.length, '>=', e.character + e.length)
          if (result) {
            console.log("Found:", e)
            console.log("Inside:", token)
          }
          return result
        }

        const errorsInToken = errors.filter(findTokenFunc(tokenPos))
        const lspResponsesInToken = lspValues.filter(findTokenFunc(tokenPos))
        const queriesInToken = queries.filter(findTokenFunc(tokenPos))

        // Does this line have a word targeted by a query?
        targetedQueryWord = targetedQueryWord || lspResponsesInToken.find(response => response.text === (queries.length && queries[0].text))!

        const allTokens = [...errorsInToken, ...lspResponsesInToken, ...queriesInToken]
        const allTokensByStart = allTokens.sort((l, r) => {
          return (l.start || 0) - (r.start || 0)
        })

        if (allTokensByStart.length) {
          const ranges = allTokensByStart.map(token => {
            const range: any = {
              begin: token.start! - filePos,
              end: token.start! + token.length! - filePos,
            }

            // prettier-ignore
            if (range.begin < 0 || range.end < 0) {
              // prettier-ignore
              // throw new Error(`The begin range of a token is at a minus location, filePos:${filePos} current token: ${JSON.stringify(token, null, '  ')}\n result: ${JSON.stringify(range, null, '  ')}`)
            }

            if ("renderedMessage" in token) range.classes = "err"
            if ("kind" in token) range.classes = token.kind
            if ("targetString" in token) {
              range.classes = "lsp"
              const lspText = options.includeJSDocInHover && token.docs ? `${token.docs}\n\n${token.text}` : token.text
              range["lsp"] = lspText
            }
            return range
          })

          tokenContent += createHighlightedString(ranges, token.content, targetedQueryWord?.text)
        } else {
          tokenContent += subTripleArrow(token.content)
        }

        html += `<span style="color: ${token.color}">${tokenContent}</span>`
        tokenPos += token.content.length
        filePos += token.content.length
      })

      html += `</div>`
      // This is the \n which the </div> represents
      filePos += 1
    }

    // Adding error messages to the line after
    if (errors.length) {
      const messages = errors.map(e => escapeHtml(e.renderedMessage)).join("</br>")
      const codes = errors.map(e => e.code).join("<br/>")
      html += `<span class="error"><span>${messages}</span><span class="code">${codes}</span></span>`
      html += `<span class="error-behind">${messages}</span>`
    }

    // Add queries to the next line
    if (queries.length) {
      queries.forEach(query => {
        // This is used to wrap popovers and completions to improve styling options for users.
        html += `<div class='meta-line'>`

        switch (query.kind) {
          case "query": {
            const queryTextWithPrefix = escapeHtml(query.text!)
            const lspValues = staticQuickInfosGroupedByLine.get(i) || []
            const targetedWord = lspValues.find(response => response.text === (queries.length && queries[0].text))!
            const halfWayAcrossTheTargetedWord = ((targetedWord && targetedWord.character + targetedWord?.length / 2) - 1) || 0
            html +=
              `<span class='popover-prefix'>` +
              " ".repeat(halfWayAcrossTheTargetedWord) +
              "</span>" +
              `<span class='popover'><div class='arrow'></div>${queryTextWithPrefix}</span>`
            break
          }

          case "completions": {
            if (!query.completions) {
              html += `<span class='query'>${"//" + "".padStart(query.offset - 2) + "^ - No completions found"}</span>`
            } else {
              const prefixed = query.completions.filter(c => c.name.startsWith(query.completionsPrefix || "____"))

              const lis = prefixed
                .sort((l, r) => l.name.localeCompare(r.name))
                .map(c => {
                  const after = c.name.substr(query.completionsPrefix?.length || 0)
                  const name = `<span><span class='result-found'>${query.completionsPrefix || ""}</span>${after}</span>`
                  const isDeprecated = c.kindModifiers?.split(",").includes("deprecated")
                  const liClass = isDeprecated ? "deprecated" : ""
                  return `<li class='${liClass}'>${name}</li>`
                })
                .join("")
              html += `${"&nbsp;".repeat(query.offset)}<span class='inline-completions'><ul class='dropdown'>${lis}</ul></span>`
            }
          }
        }
        html += "</div>"
      })
    }

    // Any tags (currently that's warn/error/log)
    if (tags.length) {
      tags.forEach(tag => {
          if(!["error", "warn", "log"].includes(tag.name)) return

          // This is used to wrap popovers and completions to improve styling options for users.
          html += `<div class='meta-line logger ${tag.name}-log'>`
          switch(tag.name) {
            case "error": html += `${errorSVG}<span class='message'>${tag.annotation || "N/A"}</span>`; break;
            case "warn": html += `${warningSVG}<span class='message'>${tag.annotation || "N/A"}</span>`; break;
            case "log": html += `${logSVG}<span class='message'>${tag.annotation || "N/A"}</span>`; break;
          }
          html += "</div>"
      })
    }
  })
  html = replaceTripleArrowEncoded(html.replace(/\n*$/, "")) // Get rid of final new lines

  if (options.addTryButton) {
    const playgroundLink = `<a class='playground-link' href='${twoslash.playgroundURL}'>Try</a>`
    html += `</code>${playgroundLink}`
  } else {
    html += `</code>`
  }

  html += `</div></pre>`

  // Attach annotations which live above of the code
  if (twoslash.tags && twoslash.tags.length) {
    html += htmlForTags(twoslash.tags)
    html += "</div>"
  }

  return html
}

/** Returns a map where all the keys are the value in keyGetter  */
function groupBy<T>(list: T[], keyGetter: (obj: any) => number) {
  const map = new Map<number, T[]>()
  list.forEach(item => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}


const errorSVG = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.63018 1.29289L1.29289 4.63018C1.10536 4.81772 1 5.07207 1 5.33729V13.6627C1 13.9279 1.10536 14.1823 1.29289 14.3698L4.63018 17.7071C4.81772 17.8946 5.07207 18 5.33729 18H13.6627C13.9279 18 14.1823 17.8946 14.3698 17.7071L17.7071 14.3698C17.8946 14.1823 18 13.9279 18 13.6627V5.33729C18 5.07207 17.8946 4.81772 17.7071 4.63018L14.3698 1.29289C14.1823 1.10536 13.9279 1 13.6627 1H5.33729C5.07207 1 4.81772 1.10536 4.63018 1.29289Z" fill="#E72622" stroke="#E72622"/><rect x="8" y="4" width="3" height="7" fill="white"/><rect x="8" y="13" width="3" height="3" fill="white"/></svg>`
const warningSVG = `<svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.63401 0.5C10.0189 -0.166667 10.9812 -0.166667 11.3661 0.5L20.4593 16.25C20.8442 16.9167 20.3631 17.75 19.5933 17.75H1.40676C0.636965 17.75 0.15584 16.9167 0.54074 16.25L9.63401 0.5Z" fill="#E5A604"/><rect x="9" y="4" width="3" height="7" fill="white"/><rect x="9" y="13" width="3" height="3" fill="white"/></svg>`
const logSVG = `<svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.76822 0.359816C5.41466 -0.0644613 4.78409 -0.121785 4.35982 0.231779C3.93554 0.585343 3.87821 1.21591 4.23178 1.64018L5.76822 0.359816ZM10 7L10.7926 7.60971L11.2809 6.97499L10.7682 6.35982L10 7ZM4.20738 12.8903C3.87064 13.328 3.95254 13.9559 4.39029 14.2926C4.82804 14.6294 5.45589 14.5475 5.79262 14.1097L4.20738 12.8903ZM4.23178 1.64018L9.23178 7.64018L10.7682 6.35982L5.76822 0.359816L4.23178 1.64018ZM9.20738 6.39029L4.20738 12.8903L5.79262 14.1097L10.7926 7.60971L9.20738 6.39029Z" fill="#BDBDBD"/><line y1="3.5" x2="4" y2="3.5" stroke="#BDBDBD"/><path d="M0 7H4" stroke="#BDBDBD"/><line y1="10.5" x2="4" y2="10.5" stroke="#BDBDBD"/></svg>`