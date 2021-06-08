import { createHighlightedString } from "../src/utils"

describe(createHighlightedString, () => {
  it("handles passing the LSP info through in a way that the CSS renderer can understand", () => {
    const result = createHighlightedString(
      [
        {
          begin: 0,
          end: 7,
          classes: "lsp",
          lsp: "function longest<number[]>(a: number[], b: number[]): number[]",
        },
      ],
      "longest"
    )

    expect(result).toMatchInlineSnapshot(
      `"<data-lsp lsp='function longest&lt;number[]>(a: number[], b: number[]): number[]' >longest</data-lsp>"`
    )
  })

  it("doesn't accidentally close through a string union", () => {
    const result = createHighlightedString(
      [
        {
          begin: 0,
          end: 5,
          classes: "lsp",
          lsp: 'const hello: "alice" | "bob"',
        },
      ],
      "hello"
    )
    expect(result).toMatchInlineSnapshot(`"<data-lsp lsp='const hello: \\"alice\\" | \\"bob\\"' >hello</data-lsp>"`)
  })
})
