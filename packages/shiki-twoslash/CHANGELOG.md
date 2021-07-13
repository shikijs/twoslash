# shiki-twoslash

## 2.0.1

### Patch Changes

- f92d030: Instead of throwing the process when Shiki Twoslash gets a failing test, it will replace the code sample with information on the issue and recommendations on how to fix it. This also comes with an overhaul of the error messaging in @typescript/twoslash.

## 2.0.0

### Major Changes

- e0574f2: In the process of adding the option to have JSDoc comments included in the hovers, I changed the exposed types for `renderCodeToHTML` in `shiki-twoslash` this major sermver bump only really affects users who are using the `shiki-twoslash` API directly which I've not heard of any yet.
