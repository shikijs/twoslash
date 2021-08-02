import { renderCodeToHTML, runTwoSlash, createShikiHighlighter } from "../src/index"

describe("logging", () => {
  it("an inline message for errors", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
    const code = `
// Hello
console.error("This is an error")
// @error: This is an error
`
    const twoslash = runTwoSlash(code, "ts", {})
    expect(twoslash.tags.length).toEqual(1)

    const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, { themeName: "nord" }, highlighter, twoslash)
    expect(html).toContain("svg")
    expect(html).toContain("meta-line logger error")
  })
})