require('dotenv').config();

const { getRollupConfig } = require('@elderjs/elderjs');
const svelteConfig = require('./svelte.config');
module.exports = [...getRollupConfig({ svelteConfig })];
