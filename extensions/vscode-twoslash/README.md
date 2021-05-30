# vscode-twoslash README

This extension adds auto-complete for any Twoslash code samples in a markdown file, as well as a link to open the code sample in the Twoslash REPL on the TypeScript website.

<img src="https://github.com/shikijs/twoslash/blob/main/extensions/vscode-twoslash/web/sample.png?raw=true">

The auto-complete includes:

 - Twoslash specific commands (e.g. `@filename`)
 - TypeScript compiler options 

The compiler options uses the version of TypeScript in your `node_modules`, so it should be up-to-date.

### Deployment

Unlike all the rest of this repo, this is not automatically deployed. It can be deployed by Orta via:

```
npx vsce publish
```