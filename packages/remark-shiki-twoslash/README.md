### remark-shiki-twoslash

[You might first want to read the user docs first](https://shikijs.github.io/twoslash/).

This module sets up markdown code blocks to run through [shiki](https://shiki.matsu.io) which means it gets the VS Code quality
syntax highlighting, with optional inline TypeScript compiler-backed tooling.

Why Shiki? Shiki uses the same syntax highlighter engine as VS Code, which means no matter how complex your code is - it will syntax highlight correctly.

In addition to all the languages shiki handles (and [it's a lot](https://github.com/octref/shiki/blob/master/packages/languages/README.md#literal-values)), this module adds opt-in [@typescript/twoslash](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher) rendering for TypeScript code blocks and tsconfig JSON files.

This module powers the code samples on the TypeScript website.

![](https://user-images.githubusercontent.com/49038/78996047-ca7be880-7b11-11ea-9e6e-fa7ea8854993.png)

With Shiki Twoslash, you can explain complicated code in a way that lets people introspect at their own pace.

## Plugin Setup

#### Setup

1. **Install the dependency**: `yarn add remark-shiki-twoslash`
1. **Include `"remark-shiki-twoslash"` in the plugins section** of whatever you're using:

   ```diff
    const jsx = await mdx(content, {
      filepath: "file/path/file.mdx",
   -  remarkPlugins: [],
   +  remarkPlugins: [[remarkShikiTwoslash, { theme: "dark-plus" }]],
    }
   }
   ```

1. **Add the CSS**

   This CSS is based on from the [TypeScript website's scss](https://github.com/microsoft/TypeScript-website/blob/v2/packages/typescriptlang-org/src/templates/markdown-twoslash.scss)

   You should consider it a base to work from, rather than a perfect for every project reference.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=../../packages/shiki-twoslash/style.css) -->
<!-- The below code snippet is automatically added from ../../packages/shiki-twoslash/style.css -->
```css
/*  Start of Shiki Twoslash CSS:

Code blocks structurally look like: 

<pre class='shiki lsp twoslash [theme-name]'>
  <div class='language-id'>[lang-id]</div>
    <div class='code-container'>
      <code>[the code as a series of spans]</code>
      <a href='playground...'>Try</a> (optional)
    </div>
  </pre> 
*/

pre {
	/* In theory shiki will overwrite these, but this is to make sure there are defaults regardless */
	 background-color: white;
	 color: black;

	/* Give it some space to breathe */
	 padding: 12px;

	/* All code samples get a grey border, twoslash ones get a different color */
	 border-left: 1px solid #999;
	 border-bottom: 1px solid #999;

	 margin-bottom: 3rem;

    /* Important to allow the code to move horizontally; */
    overflow-x: auto;
    position: relative;
}
 pre.shiki {
    overflow-x: auto;
}
 pre.shiki:hover .dim {
	 opacity: 1;
}
 pre.shiki div.dim {
	 opacity: 0.5;
}
 pre.shiki div.dim, pre.shiki div.highlight {
	 margin: 0;
	 padding: 0;
}
 pre.shiki div.highlight {
	 opacity: 1;
	 background-color: #f1f8ff;
}
 pre.shiki div.line {
	 min-height: 1rem;
}

/** Don't show the language identifiers */
pre.shiki .language-id{
    display: none;
}

/* Visually differentiates twoslash code samples  */
 pre.twoslash {
	 border-color: #719af4;
}

/** When you mouse over the pre, show the underlines */
pre.twoslash:hover data-lsp {
    border-color: #747474;
}

/** The tooltip-like which provides the LSP response */
pre.twoslash data-lsp:hover::before {
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

pre .code-container {
	 overflow: auto;
}
/* The try button */
 pre .code-container > a {
	 position: absolute;
	 right: 8px;
	 bottom: 8px;
	 border-radius: 4px;
	 border: 1px solid #719af4;
	 padding: 0 8px;
	 color: #719af4;
	 text-decoration: none;
	 opacity: 0;
	 transition-timing-function: ease;
	 transition: opacity 0.3s;
}
/* Respect no animations */
@media (prefers-reduced-motion: reduce) {
	 pre .code-container > a {
		 transition: none;
	}
}
 pre .code-container > a:hover {
	 color: white;
	 background-color: #719af4;
}
 pre .code-container:hover a {
	 opacity: 1;
}

 pre code {
	 font-size: 15px;
	 font-family: "JetBrains Mono", Menlo, Monaco, Consolas, Courier New, monospace;;
	 white-space: pre;
	 -webkit-overflow-scrolling: touch;
}
 pre code a {
	 text-decoration: none;
}
 pre data-err {
    /* Extracted from VS Code */
	 background: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%206%203'%20enable-background%3D'new%200%200%206%203'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%23c94824'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") repeat-x bottom left;
	 padding-bottom: 3px;
}
 pre .query {
	 margin-bottom: 10px;
	 color: #137998;
	 display: inline-block;
}

  /* In order to have the 'popped out' style design and to not break the layout
  /* we need to place a fake and un-selectable copy of the error which _isn't_ broken out
  /* behind the actual error message.

  /* This sections keeps both of those two in in sync  */

 pre .error, pre .error-behind {
	 margin-left: -14px;
	 margin-top: 8px;
	 margin-bottom: 4px;
	 padding: 6px;
	 padding-left: 14px;
	 width: calc(100% - 20px);
	 white-space: pre-wrap;
	 display: block;
}
 pre .error {
	 position: absolute;
	 background-color: #fee;
	 border-left: 2px solid #bf1818;
	/* Give the space to the error code */
	 display: flex;
	 align-items: center;
	 color: black;
}
 pre .error .code {
	 display: none;
}
 pre .error-behind {
	 user-select: none;
	 visibility: transparent;
	 color: #fee;
}
/* Queries */
 pre .arrow {
	/* Transparent background */
	 background-color: #eee;
	 position: relative;
	 top: -7px;
	 margin-left: 0.1rem;
	/* Edges */
	 border-left: 1px solid #eee;
	 border-top: 1px solid #eee;
	 transform: translateY(25%) rotate(45deg);
	/* Size */
	 height: 8px;
	 width: 8px;
}
 pre .popover {
	 margin-bottom: 10px;
	 background-color: #eee;
	 display: inline-block;
	 padding: 0 0.5rem 0.3rem;
	 margin-top: 10px;
	 border-radius: 3px;
}
/* Completion */
 pre .inline-completions ul.dropdown {
	 display: inline-block;
	 position: absolute;
	 width: 240px;
	 background-color: gainsboro;
	 color: grey;
	 padding-top: 4px;
	 font-family: var(--code-font);
	 font-size: 0.8rem;
	 margin: 0;
	 padding: 0;
	 border-left: 4px solid #4b9edd;
}
 pre .inline-completions ul.dropdown::before {
	 background-color: #4b9edd;
	 width: 2px;
	 position: absolute;
	 top: -1.2rem;
	 left: -3px;
	 content: " ";
}
 pre .inline-completions ul.dropdown li {
	 overflow-x: hidden;
	 padding-left: 4px;
	 margin-bottom: 4px;
}
 pre .inline-completions ul.dropdown li.deprecated {
	 text-decoration: line-through;
}
 pre .inline-completions ul.dropdown li span.result-found {
	 color: #4b9edd;
}
 pre .inline-completions ul.dropdown li span.result {
	 width: 100px;
	 color: black;
	 display: inline-block;
}
 .dark-theme .markdown pre {
	 background-color: #d8d8d8;
	 border-color: #ddd;
	 filter: invert(98%) hue-rotate(180deg);
}
 data-lsp {
	/* Ensures there's no 1px jump when the hover happens */
	 border-bottom: 1px dotted transparent;
	/* Fades in unobtrusively */
	 transition-timing-function: ease;
	 transition: border-color 0.3s;
}
/* Respect people's wishes to not have animations */
 @media (prefers-reduced-motion: reduce) {
	 data-lsp {
		 transition: none;
	}
}

/** Annotations support, providing a tool for meta commentary */
.tag-container {
	position: relative;
}
.tag-container .twoslash-annotation {
	position: absolute;
	font-family: "JetBrains Mono", Menlo, Monaco, Consolas, Courier New, monospace;
	right: -10px;
   /** Default annotation text to 200px */
	width: 200px;
	color: #187abf;
	background-color: #fcf3d9 bb;
}
.tag-container .twoslash-annotation p {
	text-align: left;
	font-size: 0.8rem;
	line-height: 0.9rem;
}
.tag-container .twoslash-annotation svg {
	float: left;
	margin-left: -44px;
}
.tag-container .twoslash-annotation.left {
	right: auto;
	left: -200px;
}
.tag-container .twoslash-annotation.left svg {
	float: right;
	margin-right: -5px;
}

/** Support for showing console log/warn/errors inline */
pre .logger {
	display: flex;
	align-items: center;
	color: black;
	padding: 6px;
	padding-left: 8px;
	width: calc(100% - 19px);
	white-space: pre-wrap;
}
pre .logger svg {
	margin-right: 9px;
}
pre .logger.error-log {
	background-color: #fee;
	border-left: 2px solid #bf1818;
}
pre .logger.warn-log {
	background-color: #ffe;
	border-left: 2px solid #eae662;
}
pre .logger.log-log {
	background-color: #e9e9e9;
	border-left: 2px solid #ababab;
}
pre .logger.log-log svg {
	margin-left: 6px;
	margin-right: 9px;
}
```
<!-- AUTO-GENERATED-CONTENT:END -->


### Verify

With that set up, start up your server and add a codeblock to a markdown file to see if it renders with highlights:

````
```json
{ "json": true }
```
````

If that works, then add a twoslash example:

````
```ts twoslash
interface IdLabel {id: number, /* some fields */ }
interface NameLabel {name: string, /* other fields */ }
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented"
}

let a = createLabel("typescript");
```
````

If the code sample shows as

```ts
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented"
}

let a = createLabel("typescript")
```

Then it worked, and you should be able to hover over `createLabel` to see it's types.

### Plugin Config

This plugin passes the config options directly to Shiki and Twoslash. You probably will want to
[set `theme`](https://github.com/octref/shiki/blob/master/packages/themes/README.md#shiki-themes). The full reference for the plugin options [is available here](https://github.com/shikijs/twoslash/blob/main/packages/shiki-twoslash/README.md#user-settings).

### Learning Twoslash

The TypeScript website has a learning environment for twoslash in the [Bug Workbench](https://www.typescriptlang.org/dev/bug-workbench/).

### Light / Dark Modes

If you pass more than one theme into `themes` then a codeblock will render _for each theme_ into your HTML. This means that you can use CSS `display: none` on the one which shouldn't be seen.

```ts
const jsx = await mdx(content, {
  filepath: "file/path/file.mdx",
  remarkPlugins: [[remarkShikiTwoslash, { themes: ["dark-plus", "light-plus"] }]],
})
```

```css
@media (prefers-color-scheme: light) {
  .shiki.dark-plus {
    display: none;
  }
}

@media (prefers-color-scheme: dark) {
  .shiki.light-plus {
    display: none;
  }
}
```

### Code Sample Titles

A code sample can have a title, for example the filename via a codefence attribute:

````
```ts title="examples/index.ts"
for (let x in [0]) console.log(x)
```
````

## Power User Features

#### Cache Cleaning

To avoid re-running twoslash un-necessarily during dev mode, this plugin will cache all twoslash and only run the compilation when the code changes. You can find (and purge) the cache in `node_modules/.cache/twoslash`.

#### Twoslash Includes

Once you start writing long articles, you'll start to feel the desire to remove repetition in your code samples. This plugin adds the ability to import code into code samples. This is a string replacement before code is passed to twoslash. This is done by making a `twoslash include` code sample which is given a unique identifier.

Inside that code-block, you can use `// - [id]` to make sub-queries to the import, these will be stripped out in the code show. Here's an example markdown file using `includes`:

````markdown
# Hello, world!

```twoslash include main
const a = 1
// - 1
const b = 2
// - 2
const c= 3
```

Let's talk a bit about `a`:

```ts twoslash
// @include: main-1
```

`a` can be added to another number

```ts twoslash
// @include: main-1
// ---cut---
const nextA = a + 13
```

You can see what happens when you add `a + b`

```ts twoslash
// @include: main-2
// ---cut---
const result = a + b
//    ^?
```

Finally here is `c`:

```ts twoslash
// @include: main
// ---cut---
c.toString()
```
````

### Using your own VS Code theme with Shiki Twoslash

Every theme from VS Code comes down to a set of `.json` files which are what you pass to shiki. For example, we'll use the theme ["Pop 'n Lock'](https://vscodethemes.com/e/Luxcium.pop-n-lock-theme-vscode). If you look in [`/src/themes`](https://github.com/Luxcium/pop-n-lock-theme-vscode/blob/master/src/themes/) you'll see many theme JSON files. These are what you pass to `themes`. 

It's not normal for these themes to be available as npm modules, so you'll need to download the JSON (and handle the licensing!) into your project. Then set your settings like:

```ts
{
	remarkPlugins: [[remarkShikiTwoslash, { 
		themes: [
			"vendor/pop-n-lock/Pop-N-Lock.json",  "vendor/pop-n-lock/Pop-N-Lock.alexis-black.json"}]
	],
}
```

### Editor Experience

See [VSCode Twoslash](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-twoslash) to get auto-complete for twoslash markup and quick links to the Twoslash online REPL.

### CLI Tooling

See [twoslash-cli](https://www.npmjs.com/package/twoslash-cli) to have a CI which verifies your code samples.