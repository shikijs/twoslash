// @ts-check
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs"
import remark from "remark"
import toHAST from "mdast-util-to-hast"
import hastToHTML from "hast-util-to-html"
import visit from "unist-util-visit"
import { join, dirname } from "path"
import remarkShikiTwoslash from "remark-shiki-twoslash"

/**
 * @param {{ from: string, to: string }} args
 */
export const runOnFile = async args => {
  const { from, to } = args

  const fileContent = readFileSync(from, "utf8")
  const settings = getSettingsFromMarkdown(fileContent, from) || {}
  console.log(settings)
  const markdownAST = remark().parse(fileContent)

  // @ts-ignore
  await remarkShikiTwoslash.default(settings)(markdownAST)

  // File vs folder
  if (to.endsWith(".html")) {
    // The dangerous bit is that we include the HTML
    const hAST = toHAST(markdownAST, { allowDangerousHtml: true })
    const html = hastToHTML(hAST, { allowDangerousHtml: true })

    if (!existsSync(dirname(to))) mkdirSync(dirname(to), { recursive: true })
    writeFileSync(to, html)
  } else {
    if (!existsSync(to)) mkdirSync(to, {recursive: true})
    if (!existsSync(join(to, "mds"))) mkdirSync(join(to, "mds"))

    let index = 1
    visit(markdownAST, "html", c => {
      const hAST = toHAST(c, { allowDangerousHtml: true })
      const html = hastToHTML(hAST, { allowDangerousHtml: true })
      writeFileSync(join(to, "mds", `code-${index}.html`), html)
      index++
    })
  }
}

function getSettingsFromMarkdown(fileContent, from) {
  if (fileContent.startsWith("<!-- twoslash: {")) {
    const code = fileContent.split("<!-- twoslash: ")[1].split(" -->")[0]
    try {
      return eval('const res = '+ code + '; res')
    } catch (error) {
      console.error(
        `Twoslash CLI: Setting custom theme settings in ${from} failed. The eval'd code is '${code}' which bailed:`
      )
      throw error
    }
  }
}
