<!-- twoslash: { themes: ["github-dark", "light-plus"]  } -->

This should render two different codesamples, which have underlines just on the 'title'

```ts twoslash
// @errors: 2540

interface Todo {
title: string;
}

const todo: Readonly<Todo> = {
    title: "Delete inactive users",
};

todo.title = "Hello";
```