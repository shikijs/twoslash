## Generics in the LSP

```ts twoslash
type A<B> = { 
    str: string
    b: B
}
```

## String union in the Generics in the LSP

```ts twoslash

type A<B> = { 
    str: "one" | "two"
    b: B
}
```
