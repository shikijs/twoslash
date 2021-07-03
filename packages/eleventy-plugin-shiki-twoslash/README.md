### Eleventy Shiki Twoslash

Sets up markdown code blocks to run through [shiki](https://shiki.matsu.io) which means it gets the VS Code quality
syntax highlighting mixed with the twoslash JavaScript tooling from the TypeScript website.

#### Setup

1. **Check version of Eleventy**: this plugin requires Eleventy 1.0 or newer, see below for details
1. **Install the dependency**: `yarn add eleventy-plugin-shiki-twoslash`
1. **Include `"eleventy-plugin-shiki-twoslash"` in the plugins section** of `.eleventy.js`

   ```ts
   const shikiTwoslash = require("eleventy-plugin-shiki-twoslash")

   module.exports = function (eleventyConfig) {
     eleventyConfig.addPlugin(shikiTwoslash, { theme: "nord" })
   }
   ```

1. **Go read [npmjs.com/package/remark-shiki-twoslash](https://www.npmjs.com/package/remark-shiki-twoslash)** to see the next steps, and what is available, this module leaves all the heavy work to that module.

#### Requires Eleventy 1.0 or greater
This plugin makes use of features only available in Eleventy 1.0 or greater. It will not work with earlier versions of Eleventy. [See the related issue for context](https://github.com/shikijs/twoslash/issues/51). Until Eleventy 1.0 is has a general release, you may use canary releases with this plugin. See the project linked below as an example.

#### Example
An example usage of this plugin is [available in the Shiki Twoslash repository](https://github.com/shikijs/twoslash/tree/main/examples/eleventy). 
