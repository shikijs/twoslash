import { readFileSync, writeFileSync } from "fs";

const index = readFileSync("./out/index.html", "utf8")
const newIndex = index.split('<script id="__NEXT_DATA__')[0] + index.split('_ssgManifest.js" async=""></script>')[1]
writeFileSync("./out/index.html", newIndex)
