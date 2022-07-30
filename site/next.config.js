let basePath = undefined;
let assetPrefix = undefined;

if (process.env.CI) {
  basePath = "/twoslash";
  assetPrefix = "/twoslash";
}


const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})
module.exports = withMDX({
  // Append the default value with md extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  basePath,
  assetPrefix,
})


// const withMDX = require('@next/mdx')()
// module.exports = withMDX({
//   // webpack5: true,
// })
