# eleventy-plugin-shiki-twoslash

## 1.0.19

### Patch Changes

- 8a0fcc0: Switch to use a new package which we've extracted out from Shiki Twoslash for handling parsing the different potential formats for codefence attributes: [fenceparser](https://www.npmjs.com/package/fenceparser) which means a breaking change in the remark plugin API. The semver major shouldn't affect anyone using the library via another tool (e.g. via the docusaurus plugins etc).
- Updated dependencies [8a0fcc0]
  - remark-shiki-twoslash@2.0.0

## 1.0.17

### Patch Changes

- Updated dependencies [f92d030]
  - remark-shiki-twoslash@1.5.6

## 1.0.16

### Patch Changes

- remark-shiki-twoslash@1.5.5
