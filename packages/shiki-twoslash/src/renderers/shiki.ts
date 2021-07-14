import { shouldBeHighlightable, shouldHighlightLine, escapeHtml, Meta } from "../utils"
import { HtmlRendererOptions, preOpenerFromRenderingOptsWithExtras } from "./plain"

type Lines = import("shiki").IThemedToken[][]

export function defaultShikiRenderer(lines: Lines, options: HtmlRendererOptions, meta: Meta) {
  let html = ""

  const hasHighlight = meta.highlight && shouldBeHighlightable(meta.highlight)
  const hl = shouldHighlightLine(meta.highlight)

  html += preOpenerFromRenderingOptsWithExtras(options, meta, [])
  if (meta.title) {
    html += `<div class='code-title'>${meta.title}</div>`
  }

  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }

  html += `<div class='code-container'><code>`

  lines.forEach((l, i) => {
    if (l.length === 0) {
      html += `<div class='line'></div>`
    } else {
      const hiClass = hasHighlight ? (hl(i) ? " highlight" : " dim") : ""
      const prefix = `<div class='line${hiClass}'>`
      html += prefix

      l.forEach(token => {
        html += `<span style="color: ${token.color}">${escapeHtml(token.content)}</span>`
      })
      html += `</div>`
    }
  })

  html = html.replace(/\n*$/, "") // Get rid of final new lines
  html += `</code></div></pre>`
  return html
}
