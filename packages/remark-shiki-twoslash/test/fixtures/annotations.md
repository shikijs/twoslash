### Some annotations

```ts twoslash
// @annotate: left 56 - (left) No editor warnings in JavaScript files<br/><br/>This crashes at runtime.
function compact(arr: string[]) {
  if (arr.length > 10) return arr
  return arr
// @annotate: right 309 5 - (right)  This one should be a bit rotated
}
```