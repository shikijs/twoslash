## : Result should be highlighted

```ts twoslash
type Result = "pass" | "fail"

function verify(result: Result) {
//                    ^^^^^^^^
  if (result === "pass") {
    console.log("Passed")
  } else {
    console.log("Failed")
  }
}
```