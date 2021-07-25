# Page header

You want to run:

```sh
cd examples/eleventy
yarn install
yarn start
```

then: http://localhost:8080/README - which loads this file, with this code sample below which should only show "b"


```ts twoslash
const a = () => ""
// ---cut---
const b = 123
```

_note_ the CSS is not included in this sample, so hovering will not work.