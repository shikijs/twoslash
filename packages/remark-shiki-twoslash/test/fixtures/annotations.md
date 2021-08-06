### Some annotations

```ts twoslash
// @annotate: left { "arrowRot": "0 1 2", "textDegree": "3deg", "top": "20rem" } - (left) No editor warnings in JavaScript files<br/><br/>This crashes at runtime.
function compact(arr: string[]) {
  if (arr.length > 10) return arr
  return arr
// @annotate: right { "arrowRot": "45 5 2", "textDegree": "-2deg" } - (right)  This one should be a bit rotated
}
```