---
"shiki-twoslash": patch
"eleventy-plugin-shiki-twoslash": patch
"hexo-shiki-twoslash": patch
"markdown-it-shiki-twoslash": patch
"remark-shiki-twoslash": major
---

Switch to use a new package which we've extracted out from Shiki Twoslash for handling parsing the different potential formats for codefence attributes: [fenceparser](https://www.npmjs.com/package/fenceparser) which means a breaking change in the remark plugin API. The semver major shouldn't affect anyone using the library via another tool (e.g. via the docusaurus plugins etc).

