### 1.4.0

## 2.0.3

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

  Would create a codeblocck with:

  ```js
  function compact(arr) {
    if (orr.length > 10) return arr
    return arr
  }
  ```

  And a little SVG arrow and the text "No editor warnings in JavaScript files<br/><br/>This crashes at runtime." next to it.
  I'll be tweaking the syntax over time, but for now the syntax is `// @annotate: [left/right] [arrow degree rotatation] [text degree rotatation] - Text to show`

- Updated dependencies [61a6af5]
  - shiki-twoslash@2.1.1

## 2.0.1

### Patch Changes

- Updated dependencies [8a82e13]
  - shiki-twoslash@2.0.3

## 2.0.0

### Major Changes

- 8a0fcc0: Switch to use a new package which we've extracted out from Shiki Twoslash for handling parsing the different potential formats for codefence attributes: [fenceparser](https://www.npmjs.com/package/fenceparser) which means a breaking change in the remark plugin API. The semver major shouldn't affect anyone using the library via another tool (e.g. via the docusaurus plugins etc).

### Patch Changes

- Updated dependencies [8a0fcc0]
  - shiki-twoslash@2.0.2

## 1.5.6

### Patch Changes

- f92d030: Instead of throwing the process when Shiki Twoslash gets a failing test, it will replace the code sample with information on the issue and recommendations on how to fix it. This also comes with an overhaul of the error messaging in @typescript/twoslash.
- Updated dependencies [f92d030]
  - shiki-twoslash@2.0.1

## 1.5.5

### Patch Changes

- Updated dependencies [e0574f2]

  - shiki-twoslash@2.0.0

- Removed the need to use JS at all, thanks to T6 - https://github.com/shikijs/twoslash/issues/7
- Turned off the 'try' link by default, it's now an option enable it

### 1.3.0

Ancient history
