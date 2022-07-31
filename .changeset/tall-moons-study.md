---
"shiki-twoslash": minor
---

Added support for highlighting errors that span multiple tokens.

Previously, error highlighting checked each token in a line to see if an error should be applied. This failed to apply an error highlight when the error spanned multiple tokens, like `T`+`[`+`Key`+`]` in the following example:

```ts
type MyPick<T, K> = {
  [Key in K]: T[Key];
};
```

`T[Key]` will now be correctly highlighted as an error.
