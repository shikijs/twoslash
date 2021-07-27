---
"shiki-twoslash": patch
"docusaurus-preset-shiki-twoslash": patch
"eleventy-plugin-shiki-twoslash": patch
"gatsby-remark-shiki-twoslash": patch
"hexo-shiki-twoslash": patch
"markdown-it-shiki-twoslash": patch
"remark-shiki-twoslash": patch
"twoslash-cli": patch
"vuepress-plugin-shiki-twoslash": patch
---

Adds support for an annotation system. This is still work in progress, but the goal is to allow you to provide a way to write meta-commentary on a code-sample from the outside of the code block by having an arrow and some comments.

For example

````
```js twoslash
function compact(arr) {
// @annotate: left 56 - No editor warnings in JavaScript files<br/><br/>This crashes at runtime.
  if (orr.length > 10) return arr
  return arr
}
```
````

Would create a codeblocck with:

```js
function compact(arr) {
  if (orr.length > 10) return arr
  return arr
}
```

And a little SVG arrow and the text "No editor warnings in JavaScript files<br/><br/>This crashes at runtime." next to it. 
I'll be tweaking the syntax over time, but for now the syntax is `// @annotate: [left/right] [arrow degree rotatation] [text degree rotatation] - Text to show`
