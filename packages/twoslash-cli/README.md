## Shiki Twoslash CLI

Lets you run Shiki Twoslash on arbitrary files via the terminal.


```sh
npm install -g twoslash-cli
```

```
❯ node twoslash packages/twoslash-cli/examples packages/twoslash-cli/examples/render
Twoslashifying 5 files:

  - packages/twoslash-cli/examples/another.js -> packages/twoslash-cli/examples/render/another.js.html 
  - packages/twoslash-cli/examples/basic.md -> packages/twoslash-cli/examples/render/basic.html 
  - packages/twoslash-cli/examples/file-with-settings.md -> packages/twoslash-cli/examples/render/file-with-settings.html 
  - packages/twoslash-cli/examples/single-with-settings.ts -> packages/twoslash-cli/examples/render/single-with-settings.ts.html 
  - packages/twoslash-cli/examples/single.ts -> packages/twoslash-cli/examples/render/single.ts.html 
```

#### Examples

> Take a bunch of .ts files and render them to HTML.

```sh
twoslash samples/*.ts renders 
```

> Take a bunch of .ts files and render them to HTML, but also render the source highlighted too.

```sh
twoslash --sourceAlso samples/*.ts renders 
```

> Render a few markdown files to HTML.

```sh
twoslash pages/one.md  pages/two.md build 
```

> Take a markdown file and split out each code sample into its own HTML. They get an index for a filename.

```sh
twoslash --samples pages/example_files.md renders
```

> Lint all the code samples in bunch of Markdown files.

```sh
twoslash --lint pages/example_files.md
```

> Create TSX files with a named `Code` export for a set of .ts files.

```sh
twoslash --reactAlso samples/*.ts components/twoslash 
```

#### Configuring Shiki Twoslash

You can specify the [TwoSlashOptions](https://github.com/shikijs/twoslash/tree/main/packages/shiki-twoslash#user-settings) settings for a render inside a HTML comment at the start of the file:

This markdown file would correctly render the code sample twice with each theme:

```md
<!-- twoslash: { themes: ["nord", "light-plus"]  } -->
## Hello

```ts twoslash
const a = 123
const b = 3456
```

This one would do the same for a TypeScript file:

```ts
// twoslash: { themes: ["nord", "light-plus"] }
const a = 123
const b = 3456
```

and you can set up the codefence settings like:

```ts
// twoslash: { themes: ["nord", "light-plus"] }
// highlight: {1}
const a = 123
const b = 3456
```
