const path = require("path")
const { default: twoslash } = require("remark-shiki-twoslash")

/**
 * @param {import("@docusaurus/types").DocusaurusContext} context
 * @param {import("remark-shiki-twoslash").Settings} pluginOptions
 * @returns {import("@docusaurus/types").Preset}
 */
function preset(context, pluginOptions) {
  const options = { ...pluginOptions, wrapFragments: true }

  // So, how do we hijack the code renderer? We mostly override the user's configuration for
  // the presets.

  if (!context.siteConfig.presets || !context.siteConfig.plugins) {
    throw Error("Couldn't find either a preset or a plugin")
  }

  // Available presets & plugins
  // We could parse out the repeated parts from the strings but
  // I think it's better this way as a way of showing that twoslash could
  // technically support all kinds of presets, not just official ones
  const presets = ["@docusaurus/preset-classic", "@docusaurus/preset-bootstrap"]
  const plugins = [
    "@docusaurus/plugin-content-docs",
    "@docusaurus/plugin-content-blog",
    "@docusaurus/plugin-content-pages",
  ]

  // Flag to keep track if at least one of the presets or the plugins are installed
  let flag = false

  // Checks if b is in a
  const contains = (a, b) => a.includes(typeof b === "string" ? b : b[0])

  // Structure a into proper [a, {}]
  // output is
  // [a, {}] if a is string
  // [a[0], {}] if a is [string]
  // a if a is already [string, {}]
  const structure = a => (typeof a === "string" ? [a, {}] : a.length === 1 ? [a[0], {}] : a)

  // Adds remark-shiki-twoslash into beforeDefaultRemarkPlugins
  const addTwoslash = a => {
    flag = true

    if (!a.beforeDefaultRemarkPlugins) {
      a.beforeDefaultRemarkPlugins = []
    }
    a.beforeDefaultRemarkPlugins.push([twoslash, options])
    return a
  }

  // if a preset is found
  // no need to search for plugins
  if (context.siteConfig.presets.find(p => contains(presets, p))) {
    context.siteConfig.presets = context.siteConfig.presets.map(preset => {
      if (!contains(presets, preset)) {
        return preset
      }

      const output = structure(preset)
      const sections = ["docs", "blog", "pages"]
      for (const section of sections) {
        if (!output[1][section]) output[1][section] = {}
        addTwoslash(output[1][section])
      }

      return output
    })
  } else {
    context.siteConfig.plugins = context.siteConfig.plugins.map(plugin => {
      // if the plugin is not supported
      if (!contains(plugins, plugin)) {
        return plugin
      }

      return addTwoslash(structure(plugin))
    })
  }

  if (!flag) {
    throw Error(`
    Couldn't find a preset or a plugin supported by twoslash
    Make sure you installed one of these presets [ ${presets.join(", ")} ],
    or one of these plugins [ ${plugins.join(", ")} ].\n`)
  }

  return {
    themes: [path.resolve(__dirname, "./docusaurus-theme-shiki-twoslash")],
  }
}

module.exports = preset
