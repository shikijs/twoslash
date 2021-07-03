---
sidebar_position: 1
---

# Intro

## An example twoslash

```ts twoslash
const a = 123
const b = "OK"
// ---cut---
console.log(b)
```

## A big chunk of code

Code taken from [here](https://github.com/vuejs/petite-vue/blob/71aefbf2d79852cdc3ccd63b7d3c79221f7c5fb4/src/utils.ts).

```ts twoslash title="src/utils.ts"
export const checkAttr = (el: Element, name: string): string | null => {
  const val = el.getAttribute(name)
  if (val != null) el.removeAttribute(name)
  return val
}

export const listen = (el: Element, event: string, handler: any, options?: any) => {
  el.addEventListener(event, handler, options)
}
```

## Queries

```ts twoslash
// @module: esnext
// @filename: maths.ts
export function absolute(num: number) {
  if (num < 0) return num * -1
  return num
}

// @filename: index.ts
import { absolute } from "./maths"
const value = absolute(-1)
//    ^?
```

## Completions

```ts twoslash
// @noErrors
console.d
//       ^|
// woo
```

## Errors

```ts twoslash
// @errors: 2339
const welcome = "Tudo bem gente?"
const words = welcome.contains(" ")
```

## Line Highlighting

```ts twoslash {0, 6-7}
class Point {
  x: number
  y: number

  // Normal signature with defaults
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}
```
