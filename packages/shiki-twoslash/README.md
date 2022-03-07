### shiki-twoslash

> Documentation / made lovely by counting words / maybe we would read!

Provides the API primitives to mix [shiki](https://shiki.matsu.io) with [@typescript/twoslash](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher) to provide rich contextual code samples.

Things it handles:

- Shiki bootstrapping: `createShikiHighlighter`
- Running Twoslash over code, with caching and DTS lookups: `runTwoSlash`
- Rendering any code sample with Shiki: `renderCodeToHTML`

Generic libraries for common tools which use this generator:

- [remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash) - Any JS static site generator using Remark
- [markdown-it-shiki-twoslash](https://www.npmjs.com/package/markdown-it-shiki-twoslash) - A plugin for Docusaurus

Plugins for common Static Site Generators:

- [docusaurus-preset-shiki-twoslash](https://www.npmjs.com/package/docusaurus-preset-shiki-twoslash) - A plugin for Docusaurus
- [eleventy-plugin-shiki-twoslash](https://www.npmjs.com/package/eleventy-plugin-shiki-twoslash) - A plugin for 11ty
- [gatsby-remark-shiki-twoslash](https://www.npmjs.com/package/gatsby-remark-shiki-twoslash) - For instantly using with Gatsby
- [vuepress-plugin-shiki-twoslash](https://www.npmjs.com/package/vuepress-plugin-shiki-twoslash) - A plugin for Vuepress
- [hexo-shiki-twoslash](https://www.npmjs.com/package/hexo-shiki-twoslash) - A plugin for Hexo

Or you can use the API directly in a Node.js script:

```ts
import { renderCodeToHTML, runTwoSlash, createShikiHighlighter } from "shiki-twoslash"
import { writeFileSync } from "fs"

const go = async () => {
  const highlighter = await createShikiHighlighter({ theme: "dark-plus" })
  const code = `
// Hello world
const a = "123"
const b = "345"
    `
  const twoslash = runTwoSlash(code, "ts", {})
  const html = renderCodeToHTML(twoslash.code, "ts", { twoslash: true }, {}, highlighter, twoslash)

  fs.writeFileSync("output.html", html, "utf8")
}
```

### User Settings

The config which you pass in is a mix of Shiki's [`HighlighterOptions`](https://unpkg.com/shiki/dist/index.d.ts)

<!-- AUTO-GENERATED-CONTENT:START (TYPE:src=./packages/shiki-twoslash/node_modules/shiki/dist/index.d.ts&symbol=HighlighterOptions) -->
```ts
interface HighlighterOptions {
    /**
     * The theme to load upfront.
     */
    theme?: IThemeRegistration;
    /**
     * A list of themes to load upfront.
     *
     * Default to: `['dark-plus', 'light-plus']`
     */
    themes?: IThemeRegistration[];
    /**
     * A list of languages to load upfront.
     *
     * Default to `['html', 'css', 'javascript']`
     */
    langs?: (Lang | ILanguageRegistration)[];
    /**
     * Paths for loading themes and langs. Relative to the package's root.
     */
    paths?: IHighlighterPaths;
}
```
<!-- AUTO-GENERATED-CONTENT:END -->


With twoslash's [`TwoSlashOptions`](https://unpkg.com/@typescript/twoslash/dist/index.d.ts)

<!-- AUTO-GENERATED-CONTENT:START (TYPE:src=./node_modules/@typescript/twoslash/dist/index.d.ts&symbol=TwoSlashOptions) -->
```ts
export interface TwoSlashOptions {
    /** Allows setting any of the handbook options from outside the function, useful if you don't want LSP identifiers */
    defaultOptions?: Partial<ExampleOptions>;
    /** Allows setting any of the compiler options from outside the function */
    defaultCompilerOptions?: CompilerOptions;
    /** Allows applying custom transformers to the emit result, only useful with the showEmit output */
    customTransformers?: CustomTransformers;
    /** An optional copy of the TypeScript import, if missing it will be require'd. */
    tsModule?: TS;
    /** An optional copy of the lz-string import, if missing it will be require'd. */
    lzstringModule?: LZ;
    /**
     * An optional Map object which is passed into @typescript/vfs - if you are using twoslash on the
     * web then you'll need this to set up your lib *.d.ts files. If missing, it will use your fs.
     */
    fsMap?: Map<string, string>;
    /** The cwd for the folder which the virtual fs should be overlaid on top of when using local fs, opts to process.cwd() if not present */
    vfsRoot?: string;
    /** A set of known `// @[tags]` tags to extract and not treat as a comment */
    customTags?: string[];
}
```
<!-- AUTO-GENERATED-CONTENT:END -->

The Twoslash `ExampleOptions` looks like (these are things which can be set via `// @[flag]` in a code sample):

<!-- AUTO-GENERATED-CONTENT:START (TYPE:src=./node_modules/@typescript/twoslash/dist/index.d.ts&symbol=ExampleOptions) -->
```ts
/** Available inline flags which are not compiler flags */
export interface ExampleOptions {
    /** Lets the sample suppress all error diagnostics */
    noErrors: boolean;
    /** An array of TS error codes, which you write as space separated - this is so the tool can know about unexpected errors */
    errors: number[];
    /** Shows the JS equivalent of the TypeScript code instead */
    showEmit: boolean;
    /**
     * Must be used with showEmit, lets you choose the file to present instead of the source - defaults to index.js which
     * means when you just use `showEmit` above it shows the transpiled JS.
     */
    showEmittedFile: string;
    /** Whether to disable the pre-cache of LSP calls for interesting identifiers, defaults to false */
    noStaticSemanticInfo: boolean;
    /** Declare that the TypeScript program should edit the fsMap which is passed in, this is only useful for tool-makers, defaults to false */
    emit: boolean;
    /** Declare that you don't need to validate that errors have corresponding annotations, defaults to false */
    noErrorValidation: boolean;
}
```
<!-- AUTO-GENERATED-CONTENT:END -->


And one extra for good luck:

<!-- AUTO-GENERATED-CONTENT:START (TYPE:src=./packages/shiki-twoslash/src/index.ts&symbol=TwoslashShikiOptions) -->
```ts
export interface TwoslashShikiOptions {
    /** A way to turn on the try buttons seen on the TS website */
    addTryButton?: true;
    /** A way to disable implicit React imports on tsx/jsx language codeblocks */
    disableImplicitReactImport?: true;
    /** A way to add a div wrapper for multi-theme outputs */
    wrapFragments?: true;
    /** Include JSDoc comments in the hovers */
    includeJSDocInHover?: true;
    /** Instead of showing twoslash exceptions inline, throw the entire process like it will on CI */
    alwayRaiseForTwoslashExceptions?: true;
    /** Ignore transforming certain code blocks */
    ignoreCodeblocksWithCodefenceMeta?: string[];
}
```
<!-- AUTO-GENERATED-CONTENT:END -->

That said, most people will just want to set a `theme`:

```ts
{
  resolve: "gatsby-remark-shiki-twoslash",
  options: {
    theme: "github-light"
  },
}
```

You can find all [built-in themes here](https://github.com/shikijs/shiki/tree/master/packages/shiki/themes) and all [built-in languages here](https://github.com/shikijs/shiki/tree/master/packages/shiki/languages).

### Common Use Case

### Default Compiler Options

You can set a default set of TypeScript options via `defaultCompilerOptions`

```js
[
  require("remark-shiki-twoslash").default,
  {
    themes: ["min-light", "min-dark"],
    defaultCompilerOptions: {
      types: ["node"],
    },
  },
]
```

##### Node Types in a Code Sample

To set up globals for one-off cases, import them via [an inline triple-slash](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) reference:

````
```ts twoslash
/// <reference types="jest" />
import { createHighlightedString } from "../src/utils"

describe(createHighlightedString, () => {
  it("handles passing the LSP info through in a way that the CSS renderer can understand", () => {
    const result = createHighlightedString([], "longest")

    expect(result).toMatchInlineSnapshot(
      `"<data-lsp lsp='function longest&lt;number[]>(a: number[], b: number[]): number[]' >longest</data-lsp>"`
    )
  })
})
```
````


### API

The user-exposed parts of the API is a well documented single file, you might find it easier to just read that: [`src/index.ts`](https://github.com/shikijs/twoslash/blob/main/packages/shiki-twoslash/src/index.ts).

##### `createShikiHighlighter`

Sets up the highlighter for Shiki, accepts shiki options:

```ts
async function visitor(highlighterOpts) {
  const highlighter = await createShikiHighlighter(userOpts)
  visit(markdownAST, "code", visitor(highlighter, userOpts))
}
```

##### `renderCodeToHTML`



```ts
/**
 * Renders a code sample to HTML, automatically taking into account:
 *
 *  - rendering overrides for twoslash and tsconfig
 *  - whether the language exists in shiki
 *
 * @param code the source code to render
 * @param lang the language to use in highlighting
 * @param info additional metadata which lives after the codefence lang (e.g. ["twoslash"])
 * @param highlighter optional, but you should use it, highlighter
 * @param twoslash optional, but required when info contains 'twoslash' as a string
 */
export declare const renderCodeToHTML: (
  code: string,
  lang: string,
  info: string[],
  shikiOptions?: import("shiki/dist/renderer").HtmlRendererOptions | undefined,
  highlighter?: Highlighter | undefined,
  twoslash?: TwoSlashReturn | undefined
) => string
```

For example:

```ts
const results = renderCodeToHTML(node.value, lang, node.meta || [], {}, highlighter, node.twoslash)
node.type = "html"
node.value = results
node.children = []
```

Uses:

- `renderers.plainTextRenderer` for language which shiki cannot handle
- `renderers.defaultRenderer` for shiki highlighted code samples
- `renderers.twoslashRenderer` for twoslash powered TypeScript code samples
- `renderers.tsconfigJSONRenderer` for extra annotations to JSON which is known to be a TSConfig file

These will be used automatically for you, depending on whether the language is available or what the `info` param is set to.

To get access to the twoslash renderer, you'll need to pass in the results of a twoslash run to `renderCodeToHTML`:

```ts
const highlighter = await createShikiHighlighter(highlighterOpts)
const twoslashResults = runTwoSlash(code, lang)
const results = renderCodeToHTML(
  twoslashResults.code,
  twoslashResults.lang,
  node.meta || ["twoslash"],
  {},
  highlighter,
  node.twoslash
)
```

#### `runTwoSlash`

Used to run Twoslash on a code sample. In this case it's looking at a code AST node and switching out the HTML with the twoslash results:

```ts
if (node.meta && node.meta.includes("twoslash")) {
  const results = runTwoSlash(node.value, node.lang, settings)
  node.value = results.code
  node.lang = results.extension
  node.twoslash = results
}
```
