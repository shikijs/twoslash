---
sidebar_position: 3
---

# Failing Twoslash Page

Not a twoslash code sample


```ts
    <div className="split-50-50">
    <div className="left-margin-1">
        <p>
        <span className="eu">V</span>isual Studio Code’s syntax highlighter packaged for running in a web browser and statically via Node.js.
        </p>
        <p>
        Supports all possible languages available on the VS Code extension marketplace. That’s over 200 languages. All you need is a
        <code> .tmlanguage</code> file for anything not shipped with{" "}
        <a href="https://github.com/shikijs/shiki" target="_blank">
            Shiki
        </a>
        .
        </p>
        <p>Shiki colours your code with any VS Code theme. That’s {Math.round(props.stats.themeCount / 100) * 100}+ last time we checked.</p>
    </div>
```

This is a failing example:

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// logs "12, 26"
const point = { x: 12, y: 26 };
logPoi nt(point);
```

And a second:

```ts twoslash
// @sdfsf: true
const hello = "123"
```

Oh, a third?


```ts twoslash
// @showEmit
// @showEmittedFile: asdad.ts
const hello = "123"
```