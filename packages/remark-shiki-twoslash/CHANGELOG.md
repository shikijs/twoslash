### 1.4.0

## 3.0.2

### Patch Changes

- 56b4e11: Builds an hexadecimal cache key based code snippet plus `shiki-twoslash` current version.
  This is useful for cache busting when we add a new version of any shiki ecosystem and we have an old cache that should be revalidated.

## 3.0.0

### Major Changes

- 8fffcd9: Three main things:

  - Playground: entirely new set of user-centered docs for understanding how to make a Shiki Twoslash code sample
  - Annotations: A way to provide meta-commentary on code in a code sample
  - Logging: Abuse the trust your users have in your code samples by using first-class primitives for showing logs

  The major bump is because I changed the codefence highlighting syntax to be similar to the IDE's line numbers, they start at 1, not 0.

  See the docs: in https://shikijs.github.io/twoslash/playground

### Patch Changes

- Updated dependencies [8fffcd9]
  - shiki-twoslash@3.0.0

## 2.0.5

### Patch Changes

- bbba24f: Adds inline errors for fenceparser errors - fixes #101
- Updated dependencies [bbba24f]
  - shiki-twoslash@2.1.3

## 2.0.4

### Patch Changes

- Updated dependencies [71b0697]
  - shiki-twoslash@2.1.2

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
    if (orr.length > 10) return arr;
    return arr;
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
