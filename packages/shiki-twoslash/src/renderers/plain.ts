import { stripHTML, escapeHtml, Meta } from "../utils"

// C&P'd from shiki
export interface HtmlRendererOptions {
  langId?: string
  fg?: string
  bg?: string
  themeName?: string
}

/** A func for setting a consistent <pre> */
export const preOpenerFromRenderingOptsWithExtras = (opts: HtmlRendererOptions, meta: Meta, classes?: string[]) => {
  const bg = opts.bg || "#fff"
  const fg = opts.fg || "black"
  const theme = opts.themeName || ""

  // shiki + `class` from fence + with-title if title exists + classes
  const classList = ["shiki", theme, meta.class, meta.title ? "with-title" : "", ...(classes || [])]
    .filter(Boolean)
    .join(" ")
    .trim()

  const style = [`background-color: ${bg}; color: ${fg}`, meta.style ?? ""]
    .filter(Boolean)
    .join("; ")
    .trim()

  const attributes = {
    ...meta,
    class: classList,
    style,
  }

  const attributesString = Object.entries(attributes)
    .filter(entry => {
      // exclude types other than string, number, boolean
      // exclude key twoslash
      // exclude falsy booleans
      return (
        ["string", "number", "boolean"].includes(typeof entry[1]) &&
        !["twoslash"].includes(entry[0]) &&
        entry[1] !== false
      )
    })
    .map(([key, value]) => `${key}="${stripHTML((value as string).toString())}"`)
    .join(" ")
    .trim()

  // prettier-ignore
  return `<pre ${attributesString}>`
}

/** You don't have a language which shiki twoslash can handle, make a DOM compatible version  */
export function plainTextRenderer(code: string, options: HtmlRendererOptions, meta: Meta) {
  let html = ""

  html += preOpenerFromRenderingOptsWithExtras(options, meta, [])
  if (meta.title) {
    html += `<div class='code-title'>${meta.title}</div>`
  }

  if (options.langId) {
    html += `<div class="language-id">${options.langId}</div>`
  }

  html += `<div class='code-container'><code>`
  html += escapeHtml(code)

  html = html.replace(/\n*$/, "") // Get rid of final new lines
  html += `</code></div></pre>`
  return html
}
