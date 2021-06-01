// twoslash: { themes: ["../../../script/theme", 'dark-plus',  'github-dark',  'github-light',  'light-plus',  'material-theme-darker',  'material-theme-default',  'material-theme-lighter',  'material-theme-ocean',  'material-theme-palenight',  'min-dark',  'min-light',  'monokai',  'nord',  'slack-theme-dark-mode',  'slack-theme-ochin',  'solarized-dark',  'solarized-light' ] }
// @errors: 2540
interface Todo {
    title: string;
  }
  
  const todo: Readonly<Todo> = {
    title: "Delete inactive users",
  };
  
  todo.title = "Hello";