const NodePath = require("node:path");
const express = require("express");
const webpack = require("@rspack/core");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");

/** @type {import('@rspack/core').Configuration} */
const webpackConfig = {
  mode: "development",
  devtool: false,

  entry: ["webpack-hot-middleware/client", "./index"],
  resolve: { extensions: ["...", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                  development: true,
                  refresh: true,
                },
              },
            },
          },
        },
      },
    ],
  },
  context: NodePath.resolve(__dirname, "src"),
  output: { clean: true, path: NodePath.resolve(__dirname, "dist") },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({
      template: NodePath.resolve(__dirname, "src/index.html"),
      filename: "index.html",
    }),
  ],
};
const compiler = webpack(webpackConfig);
const devMiddleware = require("webpack-dev-middleware")(compiler, {
  headers: { "Access-Control-Allow-Origin": "*" },
  serverSideRender: true,
  publicPath: webpackConfig.output.publicPath,
  index: true,
  writeToDisk: true,
});
const hotMiddleware = require("webpack-hot-middleware")(compiler, {
  log: false,
  path: "/__webpack_hmr",
  heartbeat: 10 * 1000,
});

const app = express();
app.use(devMiddleware);
app.use(hotMiddleware);

app.listen(3000, () => {
  console.log(`Go http://localhost:3000`);
});
