module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: false,
    es2020: true,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],

  rules: {
    'prettier/prettier': 'error',
    semi: ['error', 'always'],
    'no-var': ['error'],
    'no-console': ['off'],
    'no-unused-vars': ['warn'],
    'no-mixed-spaces-and-tabs': ['warn'],
    'node/no-unpublished-require': ['off'],
  },
};
