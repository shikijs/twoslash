import { renderCodeToHTML, runTwoSlash, createShikiHighlighter } from "../src/index"
import { join } from "path"


  it("shows the right LSP results when a theme doesnt have unique tokens for identifiers", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark-plus" })

    const twoslash = runTwoSlash(
`type Result = "pass" | "fail"
//    ^^^^^^
`, "ts", {})
// console.log(twoslash)
    const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, { themeName: "nord" }, highlighter, twoslash)

    expect(html).toContain(`data-highlighted`)
  })
