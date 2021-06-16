---
sidebar_position: 1
---

## TS Twoslash Examples

This has twoslash:

```ts twoslash
const a = 123
const b = "OK"
// ---cut---
console.log(b)
```

This does not:

```ts
const a = 123
const b = "OK"
// ---cut---
console.log(b)
```

## TSX Twoslash Examples

With Twoslash:

```tsx twoslash
import React from "react"

export const MyTitle = () => (
    <h1>Title</h1>
)
```

Without Twoslash:

```tsx
import React from "react"

export const MyTitle = () => (
    <h1>Title</h1>
)
```

## JS Twoslash Example

This has twoslash:

```js twoslash
const a = 123
const b = "OK"
console.log(b)
```

Without 

```js
const a = 123
const b = "OK"
console.log(b)
```

## TSConfig

This is JSON:

```json
{
    "thing": 123
}
```

This is a TSConfig JSON:

```json tsconfig
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    "examples"
  ]
}
```

# Other langs

This is PHP:

```php
<!DOCTYPE html>
<html>
<body>

<h1>Developer News</h1>

<?php echo "The Best PHP Examples"; ?>

</body>
</html> 
```
