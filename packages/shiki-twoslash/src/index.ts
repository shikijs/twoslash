import { getHighlighter, Highlighter, HighlighterOptions, IThemedToken } from "shiki"
import { twoslasher, TwoSlashOptions, TwoSlashReturn } from "@typescript/twoslash"
import { twoslashRenderer } from "./renderers/twoslash"
import { HtmlRendererOptions, plainTextRenderer } from "./renderers/plain"
import { defaultShikiRenderer } from "./renderers/shiki"
import { tsconfigJSONRenderer } from "./renderers/tsconfig"
import { parseCodeFenceInfo } from "./parseCodeFenceInfo"

export interface TwoslashShikiOptions {
  /** A way too turn on the try buttons seen on the TS website */
  addTryButton?: true
}

/** The possible user config, a combination of all shiki, twoslash and twoslash-shiki options */
export type UserConfigSettings = HighlighterOptions & TwoSlashOptions & TwoslashShikiOptions

/**
 * This gets filled in by the promise below, then should
 * hopefully be more or less synchronous access by each parse
 * of the highlighter
 */
let storedHighlighter: Highlighter = null as any

/**
 * Creates a *cached singleton* Shiki highlighter, this is an async call because of the call to WASM to get
 * the regex parser set up.
 *
 * In other functions, passing a the result of this highlighter function is kind of optional but it's the author's
 * opinion that you should be in control of the highlighter, and not this library.
 *
 */
export const createShikiHighlighter = (options: HighlighterOptions) => {
  if (storedHighlighter) return Promise.resolve(storedHighlighter)

  return getHighlighter(options).then(newHighlighter => {
    storedHighlighter = newHighlighter
    return storedHighlighter
  })
}

/**
 * Renders a code sample to HTML, automatically taking into account:
 *
 *  - rendering overrides for twoslash and tsconfig
 *  - whether the language exists in shiki
 *
 * @param code the source code to render
 * @param lang the language to use in highlighting
 * @param info additional metadata which lives after the code-fence lang (e.g. ["twoslash"])
 * @param highlighter optional, but you should use it, highlighter
 * @param twoslash optional, but required when info contains 'twoslash' as a string
 */
export const renderCodeToHTML = (
  code: string,
  lang: string,
  info: string[],
  shikiOptions?: HtmlRendererOptions,
  highlighter?: Highlighter,
  twoslash?: TwoSlashReturn
) => {
  if (!highlighter && !storedHighlighter) {
    throw new Error("The highlighter object hasn't been initialised via `setupHighLighter` yet in shiki-twoslash")
  }

  // Shiki does know the lang, so tokenize
  const renderHighlighter = highlighter || storedHighlighter
  const metaInfo = info && typeof info === "string" ? info : info.join(" ")
  const codefenceMeta = parseCodeFenceInfo(lang, metaInfo || "")

  const renderOpts: HtmlRendererOptions = {
    fg: renderHighlighter.getForegroundColor(),
    bg: renderHighlighter.getBackgroundColor(),
    ...shikiOptions,
  }

  let tokens: IThemedToken[][]
  try {
    const tmpLang = lang === "jsx" ? "tsx" : lang
    tokens = renderHighlighter.codeToThemedTokens(code, tmpLang as any)
  } catch (error) {
    // Shiki doesn't know this lang, so render it as plain text, but
     // also add a note at the end as a HTML comment
     const note = `<!-- Note from shiki-twoslash: the language ${lang} was not set up for Shiki to use, and so there is no code highlighting --!>`
     return plainTextRenderer(code, renderOpts, codefenceMeta.meta) + note
  }

  // Twoslash specific renderer
  if (lang && info.includes("twoslash") && twoslash) {
    return twoslashRenderer(tokens, { ...renderOpts, langId: lang }, twoslash, codefenceMeta.meta)
  }

  // TSConfig renderer
  if (lang && lang.startsWith("json") && info.includes("tsconfig")) {
    return tsconfigJSONRenderer(tokens, renderOpts, codefenceMeta.meta)
  }

  // Otherwise just the normal shiki renderer
  return defaultShikiRenderer(tokens, { ...renderOpts, langId: lang }, codefenceMeta.meta)
}

/**
 * Runs Twoslash over the code passed in with a particular language as the default file.
 */
export const runTwoSlash = (code: string, lang: string, settings: UserConfigSettings = {}): TwoSlashReturn => {
  // Shiki doesn't handle a few filetype mappings, so do that ahead of time. Oddly enough, this also
  // gets re-done at remark-shiki level
  const replacer = {
    json5: "json",
    yml: "yaml",
  }

  // @ts-ignore
  if (replacer[lang]) lang = replacer[lang]

  const results = twoslasher(code, lang, settings)
  return results
}

export { parseCodeFenceInfo } from "./parseCodeFenceInfo"

/** Set of renderers if you want to explicitly call one instead of using renderCodeToHTML */
export const renderers = {
  plainTextRenderer,
  defaultShikiRenderer,
  twoslashRenderer,
  tsconfigJSONRenderer,
}
