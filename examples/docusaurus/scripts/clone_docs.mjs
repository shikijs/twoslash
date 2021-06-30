// A script to generate a number of cloned ts files to test performance
// Not part of the example

import { promises as fs } from "fs"

const base = await fs.readFile("./docs/intro.md", "utf-8")
const count = parseInt(process.argv.slice(2)[0])

for (let i = 0; i < count; i++) {
  await fs.writeFile(`./docs/cloned_intro_${i}.md`, base, "utf-8")
}

console.log(`Generated ${count} file${count === 1 ? "" : "s"}.`)
