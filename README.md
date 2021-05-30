<center><img src="./misc/repo-icon.png" /></center>

You take some Shiki, add a hint of TypeScript compiler, and 🎉 incredible statically generated code samples.

### This Repo

The majority of this repo uses pnpm, the rest yarn. There are four main areas of interest:
 
 - `packages`, the shiki meets twoslash plugins for markdown renderers and static site generators
 - `site`, the docs micro-site
 - `examples`, example static site generator projects which use the plugins
 - `extensions`, right now, just the vscode extension for twoslash code samples
 
### Packages

The `site` `extensions` and `examples` are excluded from the workspace. To work on those, `cd` to their folders and read instructions.

Otherwise:

```sh
git clone https://github.com/shikijs/twoslash
cd twoslash

pnpm i
pnpm bootstrap
pnpm test
```

#### Plugins 

- [`vuepress-plugin-shiki-twoslash`](packages/vuepress-plugin-shiki-twoslash) - For VuePress
- [`docusaurus-preset-shiki-twoslash`](packages/docusaurus-preset-shiki-twoslash) - for Docusaurus
- [`eleventy-plugin-shiki-twoslash`](packages/eleventy-plugin-shiki-twoslash) - For 11ty
- [`gatsby-remark-shiki-twoslash`](packages/gatsby-remark-shiki-twoslash) - For Gatsby
- [`hexo-shiki-twoslash`](packages/hexo-shiki-twoslash) - For Hexo

#### Markdown Renderers

- [`markdown-it-shiki-twoslash`](packages/markdown-it-shiki-twoslash) - For Markdown-It
- [`remark-shiki-twoslash`](packages/remark-shiki-twoslash) - For Remark

#### Root Abstractions

- [`shiki-twoslash`](packages/shiki-twoslash) - Provides all the building blocks for above
- [`twoslash-cli`](packages/twoslash-cli) - A CLI for converting md/ts/tsx/js/jsx files to HTML

### TODO

- Finish design on microsite
- Website
- Docusaurus support is broken
