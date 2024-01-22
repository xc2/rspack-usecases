const NodePath = require("node:path");
const NodeFS = require("node:fs/promises");
const express = require("express");
const webpack = require("@rspack/core");
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");
const _ = require("lodash");
const LoadablePlugin = require("@loadable/webpack-plugin");
const { ChunkExtractor } = require("@loadable/server");

function getWebpackConfig(server = false) {
  return {
    mode: "development",
    devtool: false,

    entry: server ? ["./server"] : ["webpack-hot-middleware/client", "./index"],
    target: server ? "node" : "web",
    resolve: { extensions: ["...", ".jsx"] },
    context: NodePath.resolve(__dirname, "src"),
    output: {
      clean: true,
      path: NodePath.resolve(__dirname, "dist", server ? "server" : "web"),
      publicPath: "/",
    },
    plugins: [
      server ? null : new webpack.HotModuleReplacementPlugin(),
      server ? null : new ReactRefreshPlugin(),
      new LoadablePlugin({
        filename: server ? "server.json" : "web.json",
        // writeToDisk: true,
        // outputAsset: false,
      }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [{ loader: "less-loader" }],
          type: "css/auto",
        },
        {
          test: /\.jsx$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                exclude: /node_modules/,
                babelrc: false,
                configFile: false,
                plugins: ["@loadable/babel-plugin"],
              },
            },
            {
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
          ],
        },
      ],
    },
  };
}
const compiler = webpack(getWebpackConfig());

webpack(getWebpackConfig(true)).watch({}, (err, stats) => {
  if (err) {
    console.error(err);
  } else {
    console.log(stats.toString());
  }
});

const devMiddleware = require("webpack-dev-middleware")(compiler, {
  headers: { "Access-Control-Allow-Origin": "*" },
  serverSideRender: true,
  publicPath: "/",
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

app.use(async (req, res) => {
  const { devMiddleware } = res.locals.webpack;
  const jsonWebpackStats = devMiddleware.stats.toJson();
  const { assetsByChunkName } = jsonWebpackStats;

  const serverExtractor = new ChunkExtractor({
    stats: await loadStats(
      NodePath.resolve(__dirname, "./dist/server/server.json"),
    ),
  });
  const webExtractor = new ChunkExtractor({
    stats: await loadStats(NodePath.resolve(__dirname, "./dist/web/web.json")),
  });

  console.log(
    webExtractor.getScriptTags(),
    webExtractor.getLinkTags(),
    webExtractor.getStyleTags(),
  );

  // const chunkName = "main";
  // const assets = _.groupBy(
  //   normalizeAssets(assetsByChunkName[chunkName]),
  //   (path) => NodePath.extname(path).slice(1),
  // );
  res.send(`<!Doctype html>
<meta charset="utf-8">
<title>It works</title>
${webExtractor.getLinkTags()}
${webExtractor.getStyleTags()}
<div id="react"></div>
${webExtractor.getScriptTags()}
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

async function loadStats(filepath) {
  const stats = JSON.parse(await NodeFS.readFile(filepath, "utf-8"));
  if (stats.namedChunkGroups) {
    for (const key in stats.namedChunkGroups) {
      if (stats.namedChunkGroups.hasOwnProperty(key)) {
        const item = stats.namedChunkGroups[key];
        item.childAssets = item.childAssets || {};
      }
    }
  }
  return stats;
}
