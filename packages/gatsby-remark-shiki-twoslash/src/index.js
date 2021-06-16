// prettier-ignore
const visit = require("unist-util-visit")
const { setupForFile, remarkVisitor }  = require("remark-shiki-twoslash")

const remarkShiki = async function ({ markdownAST }, userConfig) {
  const {settings, highlighters} = await setupForFile(userConfig)
  visit(markdownAST, "code", remarkVisitor(highlighters, settings))
}

module.exports = remarkShiki
