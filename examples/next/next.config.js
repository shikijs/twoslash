const remarkShikiTwoslash = require("remark-shiki-twoslash")

/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkShikiTwoslash, { theme: "dark-plus" }]],
    rehypePlugins: [],
  },
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
})