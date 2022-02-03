// twoslash: { themes: ["../../../../../../site/script/shiki-twoslash", 'dark-plus',  'github-dark',  'github-light',  'light-plus',  'material-default', 'material-lighter',  'min-light',  'min-dark',  'monokai', 'slack-ochin', 'solarized-light' , 'nord',  'slack-dark',    'material-ocean',  'solarized-dark',  'material-palenight' ] }
// @errors: 2540
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

todo.title = "Hello";
