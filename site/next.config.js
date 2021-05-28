let basePath = undefined;
let assetPrefix = undefined;

if (process.env.CI) {
  basePath = "/twoslash";
  assetPrefix = "/twoslash";
}

module.exports = {
  basePath,
  assetPrefix,
  a: 123
};
