const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = /** @type {import('@rspack/core').Configuration} */ ({
  mode: "development",
  entry: "./src/index.ts",
  resolve: {
    extensions: ["...", ".ts"],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: "builtin:swc-loader" }],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
});
