import Head from "next/head";
import React, { useEffect } from "react";
import { remarkVisitor } from "remark-shiki-twoslash";
import type { Highlighter } from "shiki";
import { twoslasher } from "@typescript/twoslash";
import twoslashTheme from "../script/shiki-twoslash.json";

import { createDefaultMapFromCDN } from "@typescript/vfs";
import { debounce } from "ts-debounce";

import Queries from "../components/docs/Queries.mdx";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import { Resizable } from "re-resizable";

export default function Playground() {
  let codefence = "ts twoslash"

  useEffect(() => {
    let highlighter: Highlighter | undefined;
    
    // We have MANY async bits of work (mainly shiki/ts sandbox/twoslash-y/remarky ) so this is a
    // globalish alias to re-run the 'work' of transforming
    let reTriggerTwoslash

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
      highlighter.customName = "web";
      if (reTriggerTwoslash) reTriggerTwoslash()
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
                monacoSettings: {
                  renderLineHighlight: "none",
                  automaticLayout: true,
                },
              },
              main,
              ts
            );

            
            sandbox.monaco.editor.defineTheme("shiki-monaco", {
              base: "vs",
              inherit: true,
              // @ts-ignore
              rules: [{ background: "#F5EDD6" }],
              colors: {
                "editor.foreground": "#000000",
                "editor.background": "#F5EDD6",
                "editorCursor.foreground": "#183F66",
                "editor.lineHighlightBackground": "#0000FF20",
                "editorLineNumber.foreground": "#008800",
                "editor.selectionBackground": "#88000030",
                "editor.inactiveSelectionBackground": "#88000015",
              },
            });
            sandbox.monaco.editor.setTheme("shiki-monaco");
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

              const runner = remarkVisitor([highlighter], {
                // @ts-ignore
                theme: twoslashTheme,
                tsModule: ts,
                lzstringModule: sandbox.lzstring as any,
                fsMap: mapWithLibFiles,
              });

              const lang = codefence.split(" ")[0]
              const node = {
                lang:  lang as any,
                meta: codefence.replace(lang + " ", ""),
                type: "custom",
                value: newContent,
                children: [],
              };

              runner(node);
              document.getElementById("output").innerHTML = node.value;
            };
            reTriggerTwoslash = runTwoslash

            const debouncedTwoslash = debounce(runTwoslash, 800);
            sandbox.editor.onDidChangeModelContent(debouncedTwoslash);
            runTwoslash();

            sandbox.editor.onDidBlurEditorText(() => {
              const newURL = sandbox.createURLQueryWithCompilerOptions(sandbox);
              window.history.replaceState({}, "", newURL);
            });
          });
        }
      );
    };

    document.body.appendChild(getLoaderScript);
  }, []);

  const onResizeStop = (_e: Event, _dir, target: HTMLDivElement) => {
    const height = target.getBoundingClientRect().height
    localStorage.setItem("bottom-height", Math.round(height).toString())
  }

  useEffect(() => {
    const docs = document.getElementsByClassName("docs").item(0)
    const resizer = docs.children.item(0) as HTMLDivElement
    resizer.style.height = (typeof localStorage !== undefined && localStorage.getItem("bottom-height") || "300") + "px"
  })

  return (
    <>
      <Head>
        <title>Shiki Twoslash Playground: Experiment with creative code samples</title>
        <meta name="description" content="A REPL which takes some Shiki, adds a hint of the TypeScript compiler, and 🎉!" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <meta property="og:title" content="Shiki Twoslash: Static Code Samples for JS Projects" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://shikijs.github.io/twoslash/playground" />
        <meta property="og:image" content="https://shikijs.github.io/twoslash/img/ograph.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@orta" />
        <meta name="twitter:creator" content="@orta" />
        <meta name="theme-color" content="#fcf3d9" />
        <meta name="msapplication-TileColor" content="#fcf3d9" />
      </Head>
      <header className="nav">
        <svg width="23" height="32" viewBox="0 0 23 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.0673828 22.0295V19.2L11.2505 25.7347V28.3621L0.0673828 22.0295Z" fill="#183F66" fillOpacity="0.8"/>
          <path d="M11.251 2.62737V0L22.232 6.06316L22.2994 8.82526L11.251 2.62737Z" fill="#E23D1E" fillOpacity="0.8"/>
          <path d="M0.0673828 8.96001V6.19791L22.3663 19.0653V22.0295L0.0673828 8.96001Z" fill="#E5A604" fillOpacity="0.8"/>
          <path d="M0.0673828 25.6674V22.8379L11.2505 29.3726V32L0.0673828 25.6674Z" fill="#183F66" fillOpacity="0.8"/>
          <path d="M11.251 6.06316V3.43579L22.232 9.90316V12.5305L11.251 6.06316Z" fill="#E23D1E" fillOpacity="0.8"/>
          <path d="M0 12.5979L0.0673684 9.76843L22.5011 22.9053V25.5326L0 12.5979Z" fill="#E5A604" fillOpacity="0.8"/>
          <path d="M22.4336 22.0295V19.2L11.2504 25.7347V28.3621L22.4336 22.0295Z" fill="#183F66" fillOpacity="0.8"/>
          <path d="M11.251 2.62737V0L0.0678196 6.33263V8.96L11.251 2.62737Z" fill="#E23D1E" fillOpacity="0.8"/>
          <path d="M22.4336 25.6674V22.8379L11.2504 29.3726V32L22.4336 25.6674Z" fill="#183F66" fillOpacity="0.8"/>
          <path d="M11.1152 6.13053V3.43579L0.0668125 9.97053V12.5979L11.1152 6.13053Z" fill="#E23D1E" fillOpacity="0.8"/>
        </svg>
        <p className="subtitle">The playground concerning</p>
        <h1>Shiki-Twoslash</h1>
      </header>

      <main className="play">
        <div className="play-split">
          <div className="left">
            <h3 className="title">Input</h3>
            <code>```</code> <input className='codefence' type='text' defaultValue={codefence} onChange={(e) => codefence = e.target.value}></input>
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
                Downloading Playground...
              </p>
            </div>
            <div style={{ height: "300px", display: "none" }} id="monaco-editor-embed" />
            <code>```</code>
          </div>
          <div className="vertical-split" />
          <div className="right">
            <h3 className="title">Output</h3>
            <div>
              <div id="output" />
            </div>
          </div>
        </div>

        <div className="docs">
         

          <Resizable defaultSize={{ width: "100%", height: 300 }} minHeight={200} boundsByDirection enable={{ top:true, right:false, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }} onResizeStop={onResizeStop} >
            <div className="docs-content">
              <Tabs>
                <TabList>
                  <TitleTab>Features</TitleTab>
                  <Tab>Queries</Tab>
                  <Tab>Highlights</Tab>
                  <Tab>Emit</Tab>
                  <Tab>Cutting</Tab>
                  <Tab>Multi-file</Tab>
                  <Tab>DRY Samples</Tab>
                  <Tab>@types</Tab>
                  <Tab>Logging</Tab>

                  <TitleTab>Reference</TitleTab>
                  <Tab>Compiler Opts</Tab>
                  <Tab>Defaults</Tab>
                </TabList>

                {/* Blank for 'features */}
                <TabPanel></TabPanel>
                <TabPanel><Queries />
                </TabPanel>
                <TabPanel>
                  <h2>Highlights</h2>
                </TabPanel>
                <TabPanel>
                  <h2>Cutting</h2>
                </TabPanel>
                <TabPanel>
                  <h2>Multi-file</h2>
                </TabPanel>
                <TabPanel>
                  <h2>DRY Samples</h2>{" "}
                </TabPanel>
                <TabPanel>
                  <h2>@types</h2>
                </TabPanel>
                <TabPanel>
                  <h2>Logging</h2>
                </TabPanel>
                {/* Blank for 'Reference */}
                <TabPanel></TabPanel>
                <TabPanel>
                  <h2>compiler opts</h2>
                </TabPanel>
                <TabPanel>
                  <h2>Defaults</h2>
                </TabPanel>
              </Tabs>
            </div>
          </Resizable>
        </div>
      </main>
    </>
  );
}

const TitleTab = ({ children }) => (
  <Tab disabled>
    <h4>{children}</h4>
  </Tab>
);

TitleTab.tabsRole = "Tab"; // Required field to use your custom Tab
