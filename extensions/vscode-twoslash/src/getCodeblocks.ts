import * as vscode from "vscode";
var codeBlocks = require("gfm-code-blocks");
import { Codeblock } from "./TwoslashCodeLens";

export const getCodeblocks = (document: vscode.TextDocument) => {
  const sourceCode = document.getText();
  const code = codeBlocks(sourceCode) as Codeblock[];
  return code.filter((c) => c.lang.includes("twoslash"));
};
