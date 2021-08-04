import type { Node } from "unist"
import { TwoslashError, TwoSlashReturn } from "@typescript/twoslash"

import visit from "unist-util-visit"
import { lex, parse } from "fenceparser"
import { Lang, Highlighter, getHighlighter } from "shiki"
import { UserConfigSettings, renderCodeToHTML } from "shiki-twoslash"

import { cachedTwoslashCall } from "./caching"
import { addIncludes, replaceIncludesInCode } from "./includes"
import { setupNodeForTwoslashException } from "./exceptionMessageDOM"

type Fence = {
  lang: string
  meta: NonNullable<ReturnType<typeof parse>>
}

// A set of includes which can be pulled via a set ID
const includes = new Map<string, string>()

function getHTML(
  code: string,
  fence: Fence,
  highlighters: Highlighter[],
  twoslash: TwoSlashReturn | undefined,
  twoslashSettings: UserConfigSettings
) {
  // Shiki doesn't respect json5 as an input, so switch it
  // to json, which can handle comments in the syntax highlight
  const replacer: Record<string, string> = {
    json5: "json",
  }

  if (replacer[fence.lang]) fence.lang = replacer[fence.lang]

  let results
  // Support 'twoslash' includes
  if (fence.lang === "twoslash") {
    if (!fence.meta.include || typeof fence.meta.include !== "string") {
      throw new Error("A twoslash code block needs a pragma like 'twoslash include [name]'")
    }

    addIncludes(includes, fence.meta.include as string, code)
    results = twoslashSettings.wrapFragments ? `<div class="shiki-twoslash-fragment"></div>` : ""
  } else {
    // All good, get each highlighter and render the shiki output for it
    const output = highlighters.map(highlighter => {
      // @ts-ignore
      const themeName: string = highlighter.customName.split("/").pop().replace(".json", "")
      return renderCodeToHTML(code, fence.lang, fence.meta, { themeName, ...twoslashSettings }, highlighter, twoslash)
    })
    results = output.join("\n")
    if (highlighters.length > 1 && twoslashSettings.wrapFragments) {
      results = `<div class="shiki-twoslash-fragment">${results}</div>`
    }
  }
  return results
}

/**
 * Runs twoslash across an AST node, switching out the text content, and lang
 * and adding a `twoslash` property to the node.
 */
export const runTwoSlashOnNode = (code: string, { lang, meta }: Fence, settings: UserConfigSettings = {}) => {
  // Offer a way to do high-perf iterations, this is less useful
  // given that we cache the results of twoslash in the file-system
  const shouldDisableTwoslash = process && process.env && !!process.env.TWOSLASH_DISABLE
  if (shouldDisableTwoslash) return undefined

  // Only run twoslash when the meta has the attribute twoslash
  if (meta.twoslash) {
    const importedCode = replaceIncludesInCode(includes, code)
    return cachedTwoslashCall(importedCode, lang, settings)
  }

  return undefined
}

// To make sure we only have one highlighter per theme in a process
const highlighterCache = new Map<UserConfigSettings, Promise<Highlighter[]>>()

/** Sets up the highlighters, and cache's for recalls */
export const highlightersFromSettings = (settings: UserConfigSettings) => {
  // console.log("i should only log once per theme")
  // ^ uncomment this to debug if required
  const themes = settings.themes || (settings.theme ? [settings.theme] : ["light-plus"])

  return Promise.all(
    themes.map(async theme => {
      // You can put a string, a path, or the JSON theme obj
      const themeName = (theme as any).name || theme
      const highlighter = await getHighlighter({ ...settings, theme, themes: undefined })

      // @ts-ignore - https://github.com/shikijs/shiki/pull/162 will fix this
      highlighter.customName = themeName
      return highlighter
    })
  )
}

const amendSettingsForDefaults = (settings: UserConfigSettings) => {
  if (!settings["vfsRoot"]) {
    // Default to assuming you want vfs node_modules set up
    // but don't assume you're on node though
    try {
      // dist > remark-shiki-twoslash > node_modules
      settings.vfsRoot = require("path").join(__dirname, "..", "..", "..")
    } catch (error) {}
  }
}

const parsingNewFile = () => includes.clear()

const parseFence = (fence: string): Fence => {
  const [lang, ...tokens] = lex(fence)

  // if the language is twoslash and include key is found
  // insert an `=` after include to make it `include=[name]`
  // which yields better meta
  if (lang === "twoslash") {
    // Search for `include` in tokens
    const index = tokens.indexOf("include")
    if (index !== -1) {
      tokens.splice(index + 1, 0, "=")
    }
  }

  const meta = parse(tokens) ?? {}

  return {
    lang: (lang || "").toString(),
    meta,
  }
}

// --- The Remark API ---

/* A rich AST node for uninst with twoslash'd data */
type RemarkCodeNode = Node & {
  lang?: Lang
  meta?: string
  // ^ according to mdast
  type: string
  value: string
  children: Node[]
  twoslash?: TwoSlashReturn
}

/**
 * Synchronous outer function, async inner function, which is how the remark
 * async API works.
 */
function remarkTwoslash(settings: UserConfigSettings = {}) {
  amendSettingsForDefaults(settings)

  if (!highlighterCache.has(settings)) {
    highlighterCache.set(settings, highlightersFromSettings(settings))
  }

  const transform = async (markdownAST: any) => {
    const highlighters = await highlighterCache.get(settings)!
    parsingNewFile()
    visit(markdownAST, "code", remarkVisitor(highlighters, settings))
  }

  return transform
}

/**
 * The function doing the work of transforming any codeblock samples in a remark AST.
 */
export const remarkVisitor =
  (highlighters: Highlighter[], twoslashSettings: UserConfigSettings = {}) =>
  (node: RemarkCodeNode) => {
    const code = node.value
    let fence: Fence = undefined!

    try {
      fence = parseFence([node.lang, node.meta].filter(Boolean).join(" "))
    } catch (error) {
      const twoslashError = new TwoslashError("Codefence error", "Could not parse the codefence for this code sample", "It's usually an unclosed string", code)
      return setupNodeForTwoslashException(code, node, twoslashError)
    }

    // Do nothing if the node has an attribute to ignore
    if (Object.keys(fence.meta).filter(key => (twoslashSettings.ignoreCodeblocksWithCodefenceMeta || []).includes(key)).length > 0) {
      return
    }

    let twoslash: TwoSlashReturn | undefined
    try {
      // By allowing node.twoslash to already exist you can set it up yourself in a browser
      twoslash = node.twoslash || runTwoSlashOnNode(code, fence, twoslashSettings)
    } catch (error) {
      const shouldAlwaysRaise = process && process.env && !!process.env.CI
      const yeahButNotInTests = typeof jest === "undefined"

      if ((shouldAlwaysRaise && yeahButNotInTests) || twoslashSettings.alwayRaiseForTwoslashExceptions) {
        throw error
      } else {
        return setupNodeForTwoslashException(code, node, error)
      }
    }

    if (twoslash) {
      node.value = twoslash.code
      node.lang = twoslash.extension as Lang
      node.twoslash = twoslash
    }

    const shikiHTML = getHTML(node.value, fence, highlighters, twoslash, twoslashSettings)
    node.type = "html"
    node.value = shikiHTML
    node.children = []
  }

export default remarkTwoslash

// --- The Markdown-it API ---

/** Only the inner function exposed as a synchronous API for markdown-it */

export const setupForFile = async (settings: UserConfigSettings = {}) => {
  amendSettingsForDefaults(settings)
  parsingNewFile()

  if (!highlighterCache.has(settings)) {
    highlighterCache.set(settings, highlightersFromSettings(settings))
  }

  let highlighters = await highlighterCache.get(settings)!
  return { settings, highlighters }
}

export const transformAttributesToHTML = (
  code: string,
  fenceString: string,
  highlighters: Highlighter[],
  settings: UserConfigSettings
) => {
  const fence = parseFence(fenceString)

  const twoslash = runTwoSlashOnNode(code, fence, settings)
  const newCode = (twoslash && twoslash.code) || code
  return getHTML(newCode, fence, highlighters, twoslash, settings)
}
