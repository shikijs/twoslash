const remarkHtml = require('remark-html');
const remarkSlug = require('remark-slug');
const extractFrontmatter = require('remark-extract-frontmatter');
const remarkFrontmatter = require('remark-frontmatter');
const yaml = require('yaml').parse;

require('dotenv').config();
module.exports = {
  origin: '', // TODO: update this.
  lang: 'en',
  srcDir: 'src',
  distDir: 'public',
  rootDir: process.cwd(),
  build: {},
  prefix: '', // If you want your site to be built within a sub folder within your `distDir` you can use this.
  server: {},
  debug: {
    stacks: false, // output details of the stack consolidation process.
    hooks: false, // outputs the details of each hook as they are run.
    performance: false, // outputs a full performance report of how long it took to run each page.
    build: false, // gives additional details about the build process.
    automagic: false,
  },
  hooks: {
    // disable: ['elderWriteHtmlFileToPublic'], // this is used to disable internal hooks. Uncomment this hook to disabled writing your files during build.
  },
  plugins: {
    '@elderjs/plugin-markdown': {
      routes: ['blog'],
      remarkPlugins: [
        [require("remark-shiki-twoslash").default, { theme: "dark-plus"}],
        remarkFrontmatter,
        [extractFrontmatter, { name: 'frontmatter', yaml: yaml }],
        remarkSlug,
        remarkHtml,
      ],
      useSyntaxHighlighting: false
    },
    '@elderjs/plugin-browser-reload': {
      // this reloads your browser when nodemon restarts your server.
      port: 8080,
      reload: false, // if you are having issues with reloading not working, change to true.
    },
  },
  shortcodes: { closePattern: '}}', openPattern: '{{' },
};
