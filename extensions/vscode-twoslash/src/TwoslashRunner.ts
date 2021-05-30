import { twoslasher } from "@typescript/twoslash";
import { Codeblock } from "./TwoslashCodeLens";
import * as vscode from 'vscode';
import { getCodeblocks } from "./getCodeblocks";

export enum RunState {
  NotRan,
  Running,
  Success,
  TwoslashErr
}

type StatefulCodeblock = {
  start: number
  end: number
  state: RunState
  knownErrors?: import("@typescript/twoslash").TwoSlashReturn["errors"]
  errMessage?: string
};

type RunOnBlock = (block: StatefulCodeblock) => void
export class TwoslashRunner {
  #runningTwoslashSamples: StatefulCodeblock[] = [];
  public codeLensDidChange!: vscode.EventEmitter<void>;

  forEachCodeBlock(block: RunOnBlock): void{
    this.#runningTwoslashSamples.forEach(block);
  }

  stateForSampleAtPosition(position: number): StatefulCodeblock | undefined {
    const sample = this.#runningTwoslashSamples.find((cb) => cb.start <= position && position <= cb.end);
    if(!sample) return
    return sample
  }

  addCodeblock(block: Codeblock) {
    const sample = { state: RunState.NotRan, start: block.start, end: block.end }
    this.#runningTwoslashSamples.push(sample);
  }

  removeCodeblock(block: Codeblock) {
    this.#runningTwoslashSamples = this.#runningTwoslashSamples.filter(cb => cb.start === block.start);
  }

  runSampleAt(cursorOffset: number) {
    if(!vscode.window.activeTextEditor) return 
    const doc = vscode.window.activeTextEditor.document

    // Get new codeblocks
    const blocks = getCodeblocks(doc)
    // Find the codeblock which the cursor is in
    const selectedCodeblock = blocks.find((cb) => cb.start < cursorOffset && cb.end > cursorOffset);
    if (!selectedCodeblock) return;

    // Is it one we are watching?
    const statefulCodeblock = this.#runningTwoslashSamples.find(cb => cb.start === selectedCodeblock?.start)
    if(!statefulCodeblock) return

    // Updates to running... before running
    // TODO: This doesn't seem to work?
    statefulCodeblock.state = RunState.Running
    this.codeLensDidChange.fire()

    const lang = selectedCodeblock.lang.split(" ")[0].trim()

    const workspace = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri)
    if (!workspace) return

    // TODO: use require.resolve isntead of hardcoding
    // const fsPath = workspace.uri.toString().replace("file://", "")  + "/node_modules"//
    // const theirTS = require.resolve("typescript", { paths: [ fsPath ]})
    
    
    const workspaceRoot = workspace.uri.toString().replace("file://", "")
    console.log("vs-twoslash, requiring: " + workspaceRoot +  "/node_modules/typescript")

    const theirTS = require(workspaceRoot +  "/node_modules/typescript")
    console.log("Got something: " + !!theirTS)

    if (!theirTS) {
      return vscode.window.showInformationMessage("Twoslash: Could not resolve project's TS version");
    } else {
      console.log("Their TS version " + (theirTS as typeof import("typescript")).version)
    }

    // Go
    try {
      const r = twoslasher(selectedCodeblock.code, lang, { tsModule: theirTS, vfsRoot: workspaceRoot, fsMap: new Map(),  defaultOptions: { noStaticSemanticInfo: false } })
      statefulCodeblock.state = RunState.Success
      statefulCodeblock.errMessage = undefined
      statefulCodeblock.knownErrors = r.errors
      // console.log(r)
    } catch (error) {
      // doesn't have errors for example
      statefulCodeblock.state = RunState.TwoslashErr
      statefulCodeblock.errMessage = error.message
      // console.log(error)
    }

    this.codeLensDidChange.fire()
  }

}
