// @ts-check
const shiki = require("eleventy-plugin-shiki-twoslash");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(shiki, { theme: "nord" });
}
