import * as vscode from "vscode";
import { getCodeblocks } from "./getCodeblocks";
import { SnapshotCodeLensProvider } from "./TwoslashCodeLens";
import { RunState, TwoslashRunner } from "./TwoslashRunner";
import * as lzstring from "lz-string"

export function activate(context: vscode.ExtensionContext) {
  // Does the work of running twoslash on a particular code sample
  const runner = new TwoslashRunner();
  
  // Provides the buttons
  const codelens = new SnapshotCodeLensProvider(runner)
  const codelensD = vscode.languages.registerCodeLensProvider({ pattern: '**/*.md' }, codelens)
  
  // So that a runner can tell the code actions to update after a run
  runner.codeLensDidChange = codelens.onDidChange

  // Set up some commands which the buttons run
  // const  addTwoslashD = vscode.commands.registerCommand("vscode-twoslash.addTwoslashCodeblock", (codeblock) => {
  //   runner.addCodeblock(codeblock);
  //   codelens.onDidChange.fire()

  //   runner.runSampleAt(codeblock.start + 3);
  // });

  // const removeTwoslashD = vscode.commands.registerCommand("vscode-twoslash.removeTwoslashCodeblock", (codeblock) => {
  //   runner.removeCodeblock(codeblock);
  //   codelens.onDidChange.fire()
  // });

  const openTwoslash = vscode.commands.registerCommand("vscode-twoslash.openTwoslashCodeblock", (codeblock) => {
    const hash = `#code/${lzstring.compressToEncodedURIComponent(codeblock.code.trim())}`
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://shikijs.github.io/twoslash/playground/' + hash));
  });

  const clearD = vscode.commands.registerCommand("vscode-twoslash.clearAllMonitors", (codeblock) => {
    const starts: any[] = []
    runner.forEachCodeBlock(cb => {
      starts.push(cb)
    })
    starts.forEach(s => runner.removeCodeblock(s))
  });


  // Set up some commands which the buttons run
  const  monitorAll = vscode.commands.registerCommand("vscode-twoslash.runOnAll", () => {
    const document = vscode.window.activeTextEditor?.document
    if (!document) return

    const allBlocks = getCodeblocks(document)
    allBlocks.forEach(codeblock => {
      runner.addCodeblock(codeblock);
      runner.runSampleAt(codeblock.start + 3);
    });

    codelens.onDidChange.fire()
  });


  // Monitor when a user presses save to trigger running twoslash on the selected code sample
  const  saveD = vscode.workspace.onDidSaveTextDocument((e) => {
    const isMDDoc = e.fileName.includes(".md") || e.fileName.includes(".markdown");
    if (!isMDDoc) return;
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const cursorOffset = e.offsetAt(editor.selection.active)
    runner.runSampleAt(cursorOffset);
  });

  // Provides a hover with the full info for exceptions
  const hoverDispose = vscode.languages.registerHoverProvider('markdown', {
    provideHover(document, position, token) {
      const char = document.offsetAt(position)
      const codeblock = runner.stateForSampleAtPosition(char)

      if (!codeblock) return { contents: [] }

      if (codeblock.state === RunState.TwoslashErr) {
        return {
          contents: [codeblock.errMessage || "Twoslash Error"]
        };
      } else {
        return { contents: [] }
      }
    }
  });


  // Provides a hover with the full info for exceptions
  const completionDispose = vscode.languages.registerCompletionItemProvider('markdown', {
      provideCompletionItems: (document, position, cancel, context) => {

        const results: vscode.CompletionItem[] = []

        // Split everything the user has typed on the current line up at each space, and only look at the last word
        const range = new vscode.Range( new vscode.Position(position.line, 0) , new vscode.Position(position.line, position.character))
        const thisLine = document.getText(range)
        // Not a comment
        if (!thisLine.startsWith("//")) {
          return { items: [] }
        }
      
        const words = thisLine.replace("\t", "").split(" ")
      
        // Not the right amount of
        if (words.length !== 2) {
          return { items: [] }
        }
      
        const word = words[1]
        if (word.startsWith("-")) {
          return {
            items: [
              {
                label: "---cut---",
                kind: 14,
                detail: "Twoslash remove code above",
                insertText: "---cut---".replace(word, ""),
              },
              {
                label: "---cut-after---",
                kind: 14,
                detail: "Twoslash remove code below",
                insertText: "---cut-after---".replace(word, ""),
              },
            ],
          }
        }
      
        // Not a @ at the first word
        if (!word.startsWith("@")) {
          return { items: [] }
        }
      
        const knowns = [
          { name: "noErrors", description:{ message: "Don't show the UI for errors" }},
          { name: "errors", description:{ message: "Accepted error codes" }},
          { name: "showEmit", description:{ message: "Show the output for a file instead of the source" }},
          { name: "showEmittedFile", description:{ message: "Show a specific file" }},
          { name: "noStaticSemanticInfo", description:{ message: "Drop the popovers" }},
          { name: "emit", description:{ message: "Only useful if you are building tools on twoslash" }},
          { name: "noErrorValidation", description:{ message: "Never validate errors" }},
          { name: "filename", description:{ message: "Used for multi-file samples" }},
        ]
        const workspace = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor!.document.uri)
        if (!workspace) return
        
        const workspaceRoot = workspace.uri.toString().replace("file://", "")
        const theirTS = require(workspaceRoot +  "/node_modules/typescript")
        if (!theirTS) {
          vscode.window.showErrorMessage(`Twoslash: Could not find a copy of TypeScript at ${workspaceRoot + "/node_modules/typescript"}`)
          console.error("Could not find local copy of TS")
          return { items: [] }
        }
        
        // @ts-ignore - ts.optionDeclarations is private
        const optsNames = theirTS.optionDeclarations
        knowns.concat(optsNames).forEach(opt => {
          const name = opt.name
          if (name.startsWith(word.slice(1)) || word === "@") {
            // somehow adding the range seems to not give autocomplete results?
            results.push({
              label: name,
              kind: 14,
              detail: "Twoslash comment",
              insertText: name,
              documentation: opt.description?.message || ""
            })
          }
        })
      
        return {
          items: results,
        }
      }
  }, ".", "@", "/", "-", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  );


  // Essential faff
  // context.subscriptions.push(addTwoslashD, saveD, codelensD, removeTwoslashD, hoverDispose, monitorAll, clearD, openTwoslash, completionDispose);
  context.subscriptions.push(saveD, codelensD, hoverDispose, monitorAll, clearD, openTwoslash, completionDispose);
}

export function deactivate() {}
