const UnoCSS = require("@unocss/webpack").default;
const rspack = require("@rspack/core");
const NodePath = require("node:path");

module.exports = /** @type {import('@rspack/core').Configuration} */ ({
  mode: "development",
  entry: "./src/index.jsx",
  devtool: false,
  module: {
    rules: [
      { test: /\.css$/, type: "css" },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: { jsx: true, syntax: "ecmascript" },
                transform: { react: { runtime: "automatic" } },
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      // workaround for rspack
      "uno.css$": NodePath.resolve(__dirname, "__uno.css"),
    },
  },
  optimization: { realContentHash: true },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: NodePath.resolve(__dirname, "public", "index.html"),
    }),
    UnoCSS(),
  ],
});
