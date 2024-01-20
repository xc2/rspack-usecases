const NodePath = require("node:path");
const express = require("express");
const webpack = require("@rspack/core");
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");
const _ = require("lodash");

/** @type {import('@rspack/core').Configuration} */
const webpackConfig = {
  mode: "development",
  devtool: false,

  entry: ["webpack-hot-middleware/client", "./index"],
  resolve: { extensions: ["...", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [{ loader: "less-loader" }],
        type: "css/auto",
      },
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
  plugins: [new webpack.HotModuleReplacementPlugin(), new ReactRefreshPlugin()],
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

app.use((req, res) => {
  const { devMiddleware } = res.locals.webpack;
  const jsonWebpackStats = devMiddleware.stats.toJson();
  const { assetsByChunkName } = jsonWebpackStats;

  const chunkName = "main";
  const assets = _.groupBy(
    normalizeAssets(assetsByChunkName[chunkName]),
    (path) => NodePath.extname(path).slice(1),
  );
  res.send(`<!Doctype html>
<meta charset="utf-8">
<title>It works</title>
${(assets.css || [])
  .map((path) => `<link rel="stylesheet" href="${path}">`)
  .join("\n")}

<div id="react"></div>
${(assets.js || []).map((path) => `<script src="${path}"></script>`).join("\n")}
  `);
});

app.listen(3000, () => {
  console.log(`Go http://localhost:3000`);
});

function normalizeAssets(assets) {
  if (_.isPlainObject(assets)) {
    return Object.values(assets);
  }

  return Array.isArray(assets) ? assets : [assets];
}
