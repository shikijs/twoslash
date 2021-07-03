const fs = require('fs')
const path = require('path')
const markdownMagic = require('markdown-magic')

const config = {
  transforms: {
    TYPE: require('markdown-magic-inline-types')
  }
}

markdownMagic("packages/*/README.md", config)