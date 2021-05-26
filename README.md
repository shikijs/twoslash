<center><img src="./misc/repo-icon.png" /></center>

You take some Shiki, add a hint of TypeScript compiler, and 🎉 incredible statically generated code samples.

### This Repo

This repo uses **npm workspaces - you need `npm@7.7` or above**. There are three main areas:
 
 - `packages`, the shiki meets twoslash plugins for markdown renderers and static site generators
 - `site`, the docs micro-site
 - `examples`, example static site generator projects which use the plugins

### Packages

The `site` and `examples` are excluded from the workspace. To work on those, `cd` to their folders and read instructions.

Otherwise:

```sh
git clone https://github.com/shiki/twoslash
cd twoslash

npm i
npm run build
npm run test
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

### TODO

- Finish design on microsite
- Website
- Docusaurus support is broken
