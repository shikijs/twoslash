// @ts-check
const { setupForFile, transformAttributesToHTML } = require("remark-shiki-twoslash")

/**
 * @param {*} eleventyConfig
 * @param {import("shiki-twoslash").UserConfigSettings} options
 */

let highlighters = undefined

module.exports = function (eleventyConfig, options = {}) {
  /** @type {import("shiki").Highlighter[]} */
  eleventyConfig.on("eleventy.before", async () => {
    const h = await setupForFile(options)
    highlighters = await h.highlighters;
  });

  eleventyConfig.addMarkdownHighlighter((code, lang, fence) => {
    code = code.replace(/\r?\n$/, "") // strip trailing newline fed during code block parsing
    return transformAttributesToHTML(code, [lang, fence].join(" "), highlighters, options)
  })
}