# shiki-twoslash

## 3.1.0

### Minor Changes

- 53d3730: Bump version of "shiki" to 0.10.1

## 3.0.2

### Patch Changes

- 4b83df9: Updates the twoslash dependency

## 3.0.1

### Patch Changes

- bc5330b: shiki-twoslash: fix HTML comment syntax when we can't find a language for the code sample.
  Use correct cache path after splitting based on `node_modules`

## 3.0.0

### Major Changes

- 8fffcd9: Three main things:

  - Playground: entirely new set of user-centered docs for understanding how to make a Shiki Twoslash code sample
  - Annotations: A way to provide meta-commentary on code in a code sample
  - Logging: Abuse the trust your users have in your code samples by using first-class primitives for showing logs

  The major bump is because I changed the codefence highlighting syntax to be similar to the IDE's line numbers, they start at 1, not 0.

  See the docs: in https://shikijs.github.io/twoslash/playground

## 2.1.3

### Patch Changes

- bbba24f: Adds inline errors for fenceparser errors - fixes #101

## 2.1.2

### Patch Changes

- 71b0697: Checks for existing `React` import before adding it automatically in TSX code blocks.

## 2.1.1

### Patch Changes

- 61a6af5: Adds support for an annotation system. This is still work in progress, but the goal is to allow you to provide a way to write meta-commentary on a code-sample from the outside of the code block by having an arrow and some comments.

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

  Would create a codeblock with:

  ```js
  function compact(arr) {
    if (orr.length > 10) return arr;
    return arr;
  }
  ```

  And a little SVG arrow and the text "No editor warnings in JavaScript files<br/><br/>This crashes at runtime." next to it.
  I'll be tweaking the syntax over time, but for now the syntax is `// @annotate: [left/right] [arrow degree rotatation] [text degree rotatation] - Text to show`

## 2.0.3

### Patch Changes

- 8a82e13: Remove `dom.ts` which is no longer in use.

## 2.0.2

### Patch Changes

- 8a0fcc0: Switch to use a new package which we've extracted out from Shiki Twoslash for handling parsing the different potential formats for codefence attributes: [fenceparser](https://www.npmjs.com/package/fenceparser) which means a breaking change in the remark plugin API. The semver major shouldn't affect anyone using the library via another tool (e.g. via the docusaurus plugins etc).

## 2.0.1

### Patch Changes

- f92d030: Instead of throwing the process when Shiki Twoslash gets a failing test, it will replace the code sample with information on the issue and recommendations on how to fix it. This also comes with an overhaul of the error messaging in @typescript/twoslash.

## 2.0.0

### Major Changes

- e0574f2: In the process of adding the option to have JSDoc comments included in the hovers, I changed the exposed types for `renderCodeToHTML` in `shiki-twoslash` this major sermver bump only really affects users who are using the `shiki-twoslash` API directly which I've not heard of any yet.
