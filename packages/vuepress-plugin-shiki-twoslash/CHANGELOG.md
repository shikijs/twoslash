# vuepress-plugin-shiki-twoslash

## 1.0.32

### Patch Changes

- remark-shiki-twoslash@3.0.6

## 1.0.31

### Patch Changes

- Updated dependencies [86d6214]
  - remark-shiki-twoslash@3.0.5

## 1.0.30

### Patch Changes

- Updated dependencies [e5ecfea]
  - remark-shiki-twoslash@3.0.4

## 1.0.29

### Patch Changes

- Updated dependencies [bc5330b]
  - remark-shiki-twoslash@3.0.3

## 1.0.28

### Patch Changes

- Updated dependencies [56b4e11]
  - remark-shiki-twoslash@3.0.2

## 1.0.26

### Patch Changes

- Updated dependencies [8fffcd9]
  - remark-shiki-twoslash@3.0.0

## 1.0.19

### Patch Changes

- Updated dependencies [bbba24f]
  - remark-shiki-twoslash@2.0.5

## 1.0.18

### Patch Changes

- remark-shiki-twoslash@2.0.4

## 1.0.17

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
  - remark-shiki-twoslash@2.0.3

## 1.0.15

### Patch Changes

- remark-shiki-twoslash@2.0.1

## 1.0.14

### Patch Changes

- Updated dependencies [8a0fcc0]
  - remark-shiki-twoslash@2.0.0

## 1.0.12

### Patch Changes

- Updated dependencies [f92d030]
  - remark-shiki-twoslash@1.5.6

## 1.0.11

### Patch Changes

- remark-shiki-twoslash@1.5.5
