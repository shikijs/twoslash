// @ts-check
const glob = require("glob")
const { readFileSync, writeFileSync } = require("fs")
const { format } = require("prettier")
const { execSync } = require("child_process")

const updateVersions = () => {

  // Make sure that all the versioning is accurate across the packages
  const pgkPaths = glob.sync("packages/*/package.json")
  pgkPaths.push("site/package.json")
  const packages = pgkPaths.map(p => ({ path: p, pkg: JSON.parse(readFileSync(p, "utf8")) }))
  const inWorkspace = dep => {
    return packages.find(p => p.pkg.name === dep)
  }
  
  const shikiTwoslash = packages.find(p => p.pkg.name === "shiki-twoslash")
  if(!shikiTwoslash) throw new Error("No shiki-twoslash package found")

  packages.forEach(d => {
    const p = d.pkg
    const deps = [p.devDependencies || {}, p.dependencies || {}]
    let write = false
    // Ensure intra packages have the right versions 
    deps.forEach(d => {
      const keysInWorkSpace = Object.keys(d).filter(dep => inWorkspace(dep))
      keysInWorkSpace.forEach(key => {
        const version = packages.find(p => p.pkg.name === key).pkg.version
        if (d[key] !== version) {
          console.error(`${p.name} has the wrong dependency for: ${key}. Expected ${version} got ${d[key]}`)
          process.exitCode = 1
          d[key] = version
          write = true
        }
      })
    })

    // Ensure deps defined in shiki-twoslash are consistent across other packages
    Object.keys(shikiTwoslash.pkg.dependencies).forEach(key => {
      if(shikiTwoslash.dependencies?.[key] && d[key] && d[key]  !== shikiTwoslash.dependencies[key]) {
        console.log(`Updating ${key} on ${d.name} to ${shikiTwoslash.dependencies[key]}`)
        d[key] = shikiTwoslash?.[d]?.[key]
        write = true
      }
    })
  
    if (write) {
      const [major, minor, patch] = p.version.split(".")
      p.version = `${major}.${minor}.${Number(patch) + 1}`
      writeFileSync(d.path, format(JSON.stringify(p), { filepath: d.path }))
    }
  })
}

// todo: add syncing fencesitter and shiki versions

updateVersions()
updateVersions()
execSync("pnpm i", { stdio: "pipe" })
