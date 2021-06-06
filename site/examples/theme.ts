// twoslash: { themes: ["../../../script/shiki-twoslash", 'dark-plus',  'github-dark',  'github-light',  'light-plus',  'material-theme-darker',  'material-theme-default', 'material-theme-lighter',  'min-light',  'min-dark',  'monokai', 'slack-theme-ochin', 'solarized-light' , 'nord',  'slack-theme-dark-mode',    'material-theme-ocean',  'solarized-dark',  'material-theme-palenight' ] }
// @errors: 2540
interface Todo {
    title: string;
  }
  
  const todo: Readonly<Todo> = {
    title: "Delete inactive users",
  };
  
  todo.title = "Hello";