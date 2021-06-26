// Replace the dist build of shiki-twoslash with the dev build
jest.mock("shiki-twoslash", () => {
  return jest.requireActual("../../shiki-twoslash/src")
})

import gatsbyRemarkShiki from ".."

const toHAST = require(`mdast-util-to-hast`)
const hastToHTML = require(`hast-util-to-html`)
import { readdirSync, readFileSync, lstatSync } from "fs"
import { join, parse } from "path"
import { toMatchFile } from "jest-file-snapshot"
import { format } from "prettier"
const remark = require("remark")
expect.extend({ toMatchFile })

const getHTML = async (code: string, settings: any) => {
  const markdownAST = remark().parse(code)
  
  const customSettings = getSettingsFromMarkdown(code) || {}
  await gatsbyRemarkShiki({...settings, ...customSettings})(markdownAST)

  // @ts-ignore
  const twoslashes = markdownAST.children.filter(c => c.meta && c.meta.includes("twoslash")).map(c => c.twoslash)
  const hAST = toHAST(markdownAST, { allowDangerousHtml: true })
  return {
    html: hastToHTML(hAST, { allowDangerousHtml: true }),
    twoslashes,
  }
}

// To add a test, create a file in the fixtures folder and it will will run through
// as though it was the codeblock.

describe("with fixtures", () => {
  // Add all codefixes
  const fixturesFolder = join(__dirname, "fixtures")
  const resultsFolder = join(__dirname, "results")

  readdirSync(fixturesFolder).forEach(fixtureName => {
    const fixture = join(fixturesFolder, fixtureName)
    if (lstatSync(fixture).isDirectory()) {
      return
    }


    it("Fixture: " + fixtureName, async () => {
      const resultHTMLName = parse(fixtureName).name + ".html"
      const resultTwoSlashName = parse(fixtureName).name + ".json"

      const resultHTMLPath = join(resultsFolder, resultHTMLName)
      const resultTwoSlashPath = join(resultsFolder, resultTwoSlashName)

      const code = readFileSync(fixture, "utf8")

      const results = await getHTML(code, {
        theme: require("./ts-theme.json")
      })

      const htmlString = format(results.html + style, { parser: "html" })
      expect(cleanFixture(htmlString)).toMatchFile(resultHTMLPath)

      const twoString = format(JSON.stringify(results.twoslashes), { parser: "json" })
      expect(cleanFixture(twoString)).toMatchFile(resultTwoSlashPath)
    })
  })
})

const style = `

<style>
.shiki {
background-color: lightgrey;
padding: 8px;
}

.error,
.error-behind {
margin-left: -20px;
margin-right: -12px;
margin-top: 4px;
margin-bottom: 4px;
padding: 6px;
padding-left: 14px;

white-space: pre-wrap;
display: block;
}

.error {
position: absolute;
background-color: #ffeeee;
border-left: 2px solid #bf1818;
width: 100%;

display: flex;
align-items: center;
color: black;
}

.error-behind {
user-select: none;
color: #ffeeee;
}
.query {
  color: white;
}

/* To get them all hovering OOTB: .twoslash data-lsp::before { */

.twoslash data-lsp:hover::before {
   content: attr(lsp);
   position: absolute;
   transform: translate(0, 1rem);
   
   background-color: #3f3f3f;
   color: #fff;
   text-align: left;
   padding: 5px 8px;
   border-radius: 2px;
   font-family: "JetBrains Mono", Menlo, Monaco, Consolas, Courier New, monospace;
   font-size: 14px;
   white-space: pre-wrap;
   z-index: 100;
}

data-err {
  background: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%206%203'%20enable-background%3D'new%200%200%206%203'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%23c94824'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")
  repeat-x bottom left;
  padding-bottom: 3px;
}

</style>
`

const cleanFixture = (text: string) => {
  const wd = process.cwd()
  return text
    .replace(new RegExp(wd, "g"), "[home]")
    .replace(/\/home\/runner\/work\/TypeScript-Website\/TypeScript-Website/g, "[home]")
}


function getSettingsFromMarkdown(fileContent) {
  if (fileContent.startsWith("<!-- twoslash: {")) {
    const code = fileContent.split("<!-- twoslash: ")[1].split(" -->")[0]
    try {
      return eval("const res = " + code + "; res")
    } catch (error) {
      console.error(
        `Twoslash Fixture: Setting custom theme settings failed. The eval'd code is '${code}' which bailed:`
      )
      throw error
    }
  }
}
