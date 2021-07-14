import { renderCodeToHTML, runTwoSlash, createShikiHighlighter } from "../src/index"
import { join } from "path"

describe("with a simple example", () => {
  it("shows the right LSP results", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
    const code = `
// Hello
const a = "123"
const b = "345"
    `
    const twoslash = runTwoSlash(code, "ts", {})
    const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, {}, highlighter, twoslash)

    expect(html).toContain(`data-lsp`)
    expect(html).toContain(`<data-lsp lsp='const a:`)
    expect(html).toContain(`<data-lsp lsp='const b:`)
    expect(html.split("<data-lsp").length).toEqual(twoslash.staticQuickInfos.length + 1)
  })
})

describe("with a more complex example", () => {
  const file = `
// @errors: 2345
function longest<T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'string'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);

const hello = longest("alice", "bob");
console.log(hello);
`

  it("shows the right LSP results", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark-plus" })

    const twoslash = runTwoSlash(file, "ts", {})
    const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, {}, highlighter, twoslash)

    expect(html).toContain(`data-lsp`)
    expect(html).toContain(`<data-lsp lsp='function longest`)

    // Error message
    expect(html).toContain(`span class="error"`)
    expect(html).toContain(`span class="error-behind"`)
    // The error code
    expect(html).toContain(`<span class="code">2345</span>`)
  })

  it("shows the right LSP results when a theme doesnt have unique tokens for identifiers", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark-plus" })

    const twoslash = runTwoSlash(file, "ts", {})
    const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, {}, highlighter, twoslash)

    expect(html).toContain(`<data-lsp lsp='function longest`)

    // Error message
    expect(html).toContain(`span class="error"`)
    expect(html).toContain(`span class="error-behind"`)
    // The error code
    expect(html).toContain(`<span class="code">2345</span>`)

    expect(html.split("<data-lsp").length).toEqual(twoslash.staticQuickInfos.length + 1)
  })
})

describe("raw LSP details example", () => {
  const file = `
// @errors: 2345
function longest<T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'string'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);

const hello = longest("alice", "bob");
console.log(hello);
`

  it("shows the right LSP results when a theme doesnt have unique tokens for identifiers", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark-plus" })

    const twoslash = runTwoSlash(file, "ts", {})
    const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, {}, highlighter, twoslash)

    expect(html).toContain(`data-lsp`)
    expect(html).toContain(`<data-lsp lsp='function longest`)

    expect(html.split("<data-lsp").length).toEqual(twoslash.staticQuickInfos.length + 1)
  })

  it("shows the right LSP results with the typescript site theme", async () => {
    const highlighter = await createShikiHighlighter({
      theme: join(__dirname, "..", "..", "typescriptlang-org", "lib", "themes", "typescript-beta-light.json") as any,
    })

    const twoslash = runTwoSlash(file, "ts", {})
    const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, {}, highlighter, twoslash)

    expect(html).toContain(`data-lsp`)
    expect(html).toContain(`<data-lsp lsp='function longest`)
    expect(html.split("<data-lsp").length).toEqual(twoslash.staticQuickInfos.length + 1)
  })
})

it("handles multi-line queries with comments", async () => {
  const highlighter = await createShikiHighlighter({
    theme: join(__dirname, "..", "..", "typescriptlang-org", "lib", "themes", "typescript-beta-light.json") as any,
  })

  const file = `
  function f() {
    return { x: 10, y: 3 };
  }
  type P = ReturnType<typeof f>;
  //   ^?
`
  const twoslash = runTwoSlash(file, "ts", {})
  const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, {}, highlighter, twoslash)

  expect(html).toContain(`type P = {
    x: number;
    y: number;
}`)
})

it("it has the right ", async () => {
  const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
  const code = `
// Hello
const a = "123"
const b = "345"
//    ^?
    `
  const twoslash = runTwoSlash(code, "ts", {})
  const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, {}, highlighter, twoslash)
  expect(html).toContain(`<span class='popover-prefix'>     </span>`)
})

describe("implicit React import example", () => {
  it("works fine with the setting enabled (by default)", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
    const code = `const C: React.FC = ({children}) => <div>{children}</div>`
    const twoslash = runTwoSlash(code, "tsx", {})
    const html = renderCodeToHTML(twoslash.code, "tsx", { twoslash: true }, {}, highlighter, twoslash)

    expect(html).toContain(`data-lsp`)
    expect(html).toContain(`<data-lsp lsp='var children: React.ReactNode`) // children
    expect(html).toContain(`<data-lsp lsp='(property) JSX.IntrinsicElements.div`) // div
    expect(html.split("<data-lsp").length).toEqual(twoslash.staticQuickInfos.length + 1)
  })

  it("works fine with existing cut", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
    const code = `
const Tag = React.Fragment;
// --cut---
const C: React.FC = ({children}) => <Tag>{children}</Tag>
`
    const twoslash = runTwoSlash(code, "tsx", {})
    const html = renderCodeToHTML(twoslash.code, "tsx", { twoslash: true }, {}, highlighter, twoslash)

    expect(html).toContain(`data-lsp`)
    expect(html).toContain(`<data-lsp lsp='var children: React.ReactNode`) // children
    expect(html).toContain(`<data-lsp lsp='const Tag: React.ExoticComponent`) // Tag
    expect(html.split("<data-lsp").length).toEqual(twoslash.staticQuickInfos.length + 1)
  })

  it("error on setting disabled", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
    const code = `
// @errors: 2503 7031 7026 2304 7026
const C: React.FC = ({children}) => <div>{children}</div>
`
    const twoslash = runTwoSlash(code, "tsx", { disableImplicitReactImport: true })
    const html = renderCodeToHTML(twoslash.code, "tsx", { twoslash: true }, {}, highlighter, twoslash)

    expect(html).toContain(`data-lsp`)
    expect(html).toContain(`<data-lsp lsp='var children: any`) // children
    expect(html).toContain(`<data-lsp lsp='any`) // div
    expect(html).toContain(`<data-err`)
    expect(html.split("<data-lsp").length).toEqual(twoslash.staticQuickInfos.length + 1)
  })
})

// We were using "/n" instead of a new line, so CSS numbers didn't work - see #65
it("has the same number of div.lines as the lines in the code", async () => {
  const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
  const code = `function hello() {
  // to a thing
}

console.log("hi")`
  const twoslash = runTwoSlash(code, "ts", {})
  const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, {}, highlighter, twoslash)

  const codeLines = code.split("\n").length
  const divClassLines = html.split("'line").length

  // the +1 is because HTML _starts_ with a line, vs the newline which isn't the first character
  // effectively a fencepost problem
  expect(codeLines + 1).toEqual(divClassLines)
})

it("has uses div.meta-line for popovers", async () => {
  const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
  const code = `function hello() {
  const x = 123;
  //    ^?
}
`
  const twoslash = runTwoSlash(code, "ts", {})
  const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, {}, highlighter, twoslash)

  // Make sure that we have a div.meta-line that wraps our query popover.
  expect(html).toContain(`<div class='meta-line`)
})

it("has uses div.meta-line for completions", async () => {
  const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
  const code = `
// @noErrors
function hello() {
  const x = 123;
  console.l
//        ^|
}
`
  const twoslash = runTwoSlash(code, "ts", {})
  const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, {}, highlighter, twoslash)

  // Make sure that we have a div.meta-line that wraps our completion list.
  expect(html).toContain(`<div class='meta-line`)
  // Make sure the query offset is accounted for.
  expect(html).toContain("&nbsp;".repeat(10))
})
