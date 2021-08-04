import React, { useEffect } from "react";
import { remarkVisitor } from "remark-shiki-twoslash";
import type { Highlighter } from "shiki";
import { twoslasher } from "@typescript/twoslash";
import twoslashTheme from "../script/shiki-twoslash.json";

import { createDefaultMapFromCDN } from "@typescript/vfs";
import { debounce } from "ts-debounce";

import styles from './playground.module.css'

export default function Playground() {
  useEffect(() => {
    let highlighter: Highlighter | undefined;

    // Grab Shiki from unpkg and set up a shiki highlighter.
    const getShiki = document.createElement("script");
    getShiki.src = "https://unpkg.com/shiki";
    getShiki.async = true;
    getShiki.onload = async () => {
      // @ts-ignore
      const shiko: typeof import("shiki") = global.shiki;
      shiko.setCDN("https://unpkg.com/shiki/");
      highlighter = await shiko.getHighlighter({ themes: [twoslashTheme as any], langs: ["ts"] });
      // @ts-ignore - this is an implementation detail inside remark-shiki-twoslash
      highlighter.customName = "web"
    };

    document.body.appendChild(getShiki);

    const getLoaderScript = document.createElement("script");
    getLoaderScript.src = "https://www.typescriptlang.org/js/vs.loader.js";
    getLoaderScript.async = true;
    getLoaderScript.onload = () => {
      // @ts-ignore
      const re: any = global.require;

      re.config({
        paths: {
          vs: "https://typescript.azureedge.net/cdn/4.3.5/monaco/min/vs",
          sandbox: "https://www.typescriptlang.org/js/sandbox",
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
      });

      re(
        ["vs/editor/editor.main", "vs/language/typescript/tsWorker", "sandbox/index"],
        async (main: typeof import("monaco-editor"), ts: typeof import("typescript"), sandboxEnv: typeof import("../types/sandbox")) => {
          // This triggers making "ts" available in the global scope
          re(["vs/language/typescript/lib/typescriptServices"], async (_ts) => {
            const ts = (global as any).ts;
            const isOK = main && ts && sandboxEnv;

            if (isOK) {
              document.getElementById("loader")!.parentNode?.removeChild(document.getElementById("loader")!);
            } else {
              console.error("Error: main", !!main, "ts", !!ts, "sandbox", !!sandboxEnv);
            }

            document.getElementById("monaco-editor-embed")!.style.display = "block";
            const sandbox = await sandboxEnv.createTypeScriptSandbox(
              {
                text: "const a = 123",
                compilerOptions: {},
                domID: "monaco-editor-embed",
                supportTwoslashCompilerOptions: true,
              },
              main,
              ts
            );
            sandbox.editor.focus();

            // @ts-ignore
            window.sandbox = sandbox;

            const mapWithLibFiles = await createDefaultMapFromCDN({ target: 3 }, "4.3.5", true, ts, sandbox.lzstring as any);

            const runTwoslash = () => {
              const newContent = sandbox.getText();
              mapWithLibFiles.set("index.ts", newContent);

              if (!highlighter) return;

              try {
                const newResults = twoslasher(newContent, "tsx", {
                  tsModule: ts,
                  lzstringModule: sandbox.lzstring as any,
                  fsMap: mapWithLibFiles,
                });
                console.log(newResults);
              } catch (err) {
                console.error(err);
              }

              console.log("remark");
              const runner = remarkVisitor([highlighter], {
                // @ts-ignore
                theme: twoslashTheme,
                tsModule: ts,
                lzstringModule: sandbox.lzstring as any,
                fsMap: mapWithLibFiles,
              });

              const node = {
                lang: "ts" as any,
                meta: "twoslash",
                type: "custom",
                value: newContent,
                children: [],
              };

              runner(node);
              document.getElementById("output").innerHTML = node.value
            };

            const debouncedTwoslash = debounce(runTwoslash, 500);
            sandbox.editor.onDidChangeModelContent(debouncedTwoslash);
            runTwoslash();

            sandbox.editor.onDidBlurEditorText(() => {
              const newURL = sandbox.createURLQueryWithCompilerOptions(sandbox)
              window.history.replaceState({}, "", newURL)
            })
          });
        }
      );
    };

    document.body.appendChild(getLoaderScript);
  }, []);

  return (
    <div id="split" className={styles.split}>
      <div id="split-left">
        <div id="loader">
          <div className="lds-grid">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p id="loading-message" role="status">
            Downloading Sandbox...
          </p>
        </div>
        <div style={{ height: "600px", display: "none" }} id="monaco-editor-embed" />
      </div>
      <div id="split-right">
          <div className={styles.right}>
            <div id="output" />
          </div>
      </div>
    </div>
  );
}
