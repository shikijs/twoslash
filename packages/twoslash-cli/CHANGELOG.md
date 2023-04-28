# twoslash-cli

## 1.3.24

### Patch Changes

- remark-shiki-twoslash@3.1.3

## 1.3.23

### Patch Changes

- Updated dependencies [e133a03]
  - remark-shiki-twoslash@3.1.2

## 1.3.22

### Patch Changes

- Updated dependencies [e6b739c]
- Updated dependencies [bfca2ac]
  - remark-shiki-twoslash@3.1.1

## 1.3.21

### Patch Changes

- Updated dependencies [aa047ea]
- Updated dependencies [53d3730]
  - remark-shiki-twoslash@3.1.0

## 1.3.20

### Patch Changes

- Updated dependencies [a77a7c6]
  - remark-shiki-twoslash@3.0.9

## 1.3.19

### Patch Changes

- Updated dependencies [b041c61]
  - remark-shiki-twoslash@3.0.8

## 1.3.18

### Patch Changes

- Updated dependencies [f4d749f]
- Updated dependencies [b4570bb]
- Updated dependencies [2bc773e]
  - remark-shiki-twoslash@3.0.7

## 1.3.17

### Patch Changes

- remark-shiki-twoslash@3.0.6

## 1.3.16

### Patch Changes

- Updated dependencies [86d6214]
  - remark-shiki-twoslash@3.0.5

## 1.3.15

### Patch Changes

- Updated dependencies [e5ecfea]
  - remark-shiki-twoslash@3.0.4

## 1.3.14

### Patch Changes

- Updated dependencies [bc5330b]
  - remark-shiki-twoslash@3.0.3

## 1.3.13

### Patch Changes

- Updated dependencies [56b4e11]
  - remark-shiki-twoslash@3.0.2

## 1.3.10

### Patch Changes

- Updated dependencies [8fffcd9]
  - remark-shiki-twoslash@3.0.0

## 1.3.3

### Patch Changes

- Updated dependencies [bbba24f]
  - remark-shiki-twoslash@2.0.5

## 1.3.2

### Patch Changes

- remark-shiki-twoslash@2.0.4

## 1.3.1

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

- 277374b: Eleventy: mainly just docs updates
  CLI: Adds a flag to output TSX components from a JS/Markdown file
- Updated dependencies [61a6af5]
  - remark-shiki-twoslash@2.0.3

## 1.2.15

### Patch Changes

- remark-shiki-twoslash@2.0.1

## 1.2.14

### Patch Changes

- Updated dependencies [8a0fcc0]
  - remark-shiki-twoslash@2.0.0

## 1.2.12

### Patch Changes

- Updated dependencies [f92d030]
  - remark-shiki-twoslash@1.5.6

## 1.2.11

### Patch Changes

- remark-shiki-twoslash@1.5.5
