let basePath = undefined;
let assetPrefix = undefined;

if (process.env.CI) {
  basePath = "/twoslash";
  assetPrefix = "/twoslash";
}

const withMDX = require('@next/mdx')()
module.exports = withMDX({
  webpack5: true,
  basePath,
  assetPrefix,
})
