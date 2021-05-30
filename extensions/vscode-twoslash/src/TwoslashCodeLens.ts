import * as vscode from "vscode";
import { getCodeblocks } from "./getCodeblocks";
import { RunState, TwoslashRunner } from "./TwoslashRunner";

export type Codeblock = { lang: string; code: string; block: string; start: number; end: number };

const startTwoslashCommand = `vscode-twoslash.addTwoslashCodeblock`;
const removeTwoslashCommand = `vscode-twoslash.removeTwoslashCodeblock`;
const openTwoslashCommand = `vscode-twoslash.openTwoslashCodeblock`;

export class SnapshotCodeLensProvider implements vscode.CodeLensProvider {
  onDidChange: vscode.EventEmitter<void>;
  previousDecorators: ({ range: vscode.Range, decorator: vscode.TextEditorDecorationType })[] = [] 

  constructor(private runner: TwoslashRunner) {
    this.onDidChange = new vscode.EventEmitter();
  }

  get onDidChangeCodeLenses(): vscode.Event<void> {
    return this.onDidChange.event;
  }

  public provideCodeLenses(document: vscode.TextDocument, _token: vscode.CancellationToken) {
    if (!document.getText().includes("twoslash")) return [];

    // Clean up error decorators
    this.previousDecorators.forEach(d => d.decorator.dispose())
    this.previousDecorators = []

    const twoslashBlocks = getCodeblocks(document);

    const codeLenses = twoslashBlocks.map((snapshot) => {
      const l = snapshot;
      const startPosition = document.positionAt(l.start + 3 + l.lang.indexOf("twoslash"));
      const endPosition = document.positionAt(l.start + 3 + l.lang.length);

      const range = new vscode.Range(startPosition, endPosition);

      // let command: vscode.Command;
      // let runState = this.runner.stateForSampleAtPosition(l.start);
      // if (runState === undefined) {
      //   command = {
      //     title: "Start monitoring",
      //     command: startTwoslashCommand,
      //     arguments: [snapshot],
      //   };
      // } else {
      //   let title = ""
      //   switch (runState.state) {
      //     case RunState.TwoslashErr:
      //       title = "Twoslash Error"
      //       this.previousDecorators.push({
      //        decorator: inlineError(summary(runState.errMessage!)),
      //        range,
      //       })
      //       break;
      //     case RunState.Success:
      //       title = "Compiles fine"
      //       break;
      //     case RunState.Running:
      //       title = "Running..."
      //       break;
      //     case RunState.NotRan:
      //       title = "Monitoring, save with your cursor in the code sample to run"
      //       break;
      //   }
      //   command = {
      //     title,
      //     command: removeTwoslashCommand,
      //     arguments: [snapshot],
      //   };
      // }

      const workbench = {
          title: "Workbench",
          command: openTwoslashCommand,
          arguments: [snapshot],
      }
      // return [new vscode.CodeLens(range, workbench), new vscode.CodeLens(range, command)];
      return [new vscode.CodeLens(range, workbench)];
    });

    this.previousDecorators.forEach((pd => {
      vscode.window.activeTextEditor?.setDecorations(pd.decorator, [pd.range])
    }))
    
    
    return codeLenses.flat()
  }

}

const summary = (err: string) => {
  if (err.includes("Errors were thrown in the sample")) {
    return "Needs: // @errors: " + err.split("// @errors: ")[1].split("\n")[0]
  } else {
    return err
  }
}


const inlineError = (text: string): vscode.TextEditorDecorationType => {
  return vscode.window.createTextEditorDecorationType({
    isWholeLine: true,
    overviewRulerColor: 'red',
    overviewRulerLane: vscode.OverviewRulerLane.Left,
    light: {
      before: {
        color: '#FF564B',
      },
      after: {
        color: '#FF564B',
        contentText: ' // ' + text,
      },
    },
    dark: {
      before: {
        color: '#AD322D',
      },
      after: {
        color: '#AD322D',
        contentText: ' // ' + text,
      },
    },
  });
};

