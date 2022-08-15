module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
  plugin: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
};
