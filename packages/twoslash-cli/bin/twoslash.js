#!/usr/bin/env node
"use strict"

import { Command } from "commander"
import { readdirSync, statSync } from "fs"
import { join } from "path"
import chokidar from "chokidar"
const program = new Command()

program
  .description(
    `Converts md/ts/js/tsx/jsx files into HTML by running them through Shiki Twoslash.

Examples:    

    Converts a bunch of ts files in the samples dir and creates .html files in renders  
    
    $ twoslash samples/*.ts renders 

    Render a few markdown files to .html files in the build folder

    $ twoslash pages/one.md  pages/two.md build`
  )
  .option("-w, --watch", "Watch for file updates and rerun twoslash if necessary.")
  .option("-s, --samples", "Instead of rendering to HTML, spit out individual code blocks as files.")
  .option("--sourceAlso", "Also include a render of the source input. Only works on ts/tsx/js/jsx files.")
  .option("--reactAlso", "Also include a tsx file with the code embedded.")
  .option("--lint", "Don't actually render output files, just verify they work.")

  .on("--help", () => {
    console.log("\n")
    console.log("  Reference:")
    console.log("    - CLI Info:")
    console.log("      https://github.com/shikijs/twoslash/tree/main/packages/twoslash-cli")
    console.log("")
    console.log("    - Shiki Settings:")
    console.log("      https://github.com/shikijs/twoslash/tree/main/packages/shiki-twoslash#user-settings")
  })

program.parse(process.argv)

const options = program.opts()
if (options.debug) console.log(options)

const to = program.args.pop()

import { canConvert, runOnFile } from "../index.js"

const possibleFiles = program.args
  .flatMap(from => {
    const stat = statSync(from)
    return stat.isDirectory(from) ? readdirSync(from).map(p => join(from, p)) : [from]
  })
  .filter(canConvert)

if (possibleFiles.length == 0) {
  throw new Error("Could not find any md/ts/js/tsx/jsx files in the input")
}

const s = possibleFiles.length == 1 ? "" : "s"
console.log(`Twoslashifying ${possibleFiles.length} file${s} ${options.watch ? "(watch mode)" : ""}:\n`)

/** @param {string} from */
const run = from => {
  runOnFile({
    from,
    to,
    splitOutCodeSamples: options.samples,
    alsoRenderSource: options.sourceAlso,
    lint: options.lint,
    reactAlso: options.reactAlso
  })
}

if (options.watch) {
  chokidar.watch(possibleFiles).on("all", (_, from) => run(from))
} else {
  possibleFiles.forEach(run)
}
