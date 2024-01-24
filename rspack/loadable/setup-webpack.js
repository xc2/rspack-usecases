const NodePath = require("node:path");
const NodeFS = require("node:fs/promises");
const WebpackDevMiddleware = require("webpack-dev-middleware");
const WebpackHotMiddleware = require("webpack-hot-middleware");
const webpack = require("@rspack/core");
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");
const LoadablePlugin = require("@loadable/webpack-plugin");
const { setLoadableServerHot } = require("./lib/util");

setLoadableServerHot(true);

const Demo = {
  context: NodePath.resolve(__dirname, "src"),
  statsFilename: "stats.json",
};

function getWebpackConfig(server = false) {
  /** @type {webpack.Configuration} */
  const config = {
    mode: "development",
    devtool: false,

    entry: server
      ? ["./server"]
      : ["webpack-hot-middleware/client", "./client"],
    target: server ? "webworker" : "web",
    resolve: { extensions: ["...", ".jsx"] },
    context: Demo.context,
    output: {
      clean: true,
      path: NodePath.resolve(__dirname, "dist", server ? "server" : "web"),
      publicPath: "/",
      library: server ? { type: "commonjs" } : undefined,
      asyncChunks: !server,
    },
    plugins: [
      server ? null : new webpack.HotModuleReplacementPlugin(),
      server ? null : new ReactRefreshPlugin(),
      new LoadablePlugin({ filename: Demo.statsFilename }),
    ].filter(Boolean),
    builtins: {
      css: {
        modules: {
          localIdentName: "[name]__[local]",
          exportsOnly: server,
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: { plugins: ["postcss-modules-values"] },
              },
            },
            { loader: "sass-loader" },
          ],
          type: "css/module",
        },
        {
          test: /\.jsx$/,
          use: [
            server
              ? null
              : {
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
                      refresh: !server,
                    },
                  },
                },
              },
            },
          ].filter(Boolean),
        },
      ],
    },
  };
  return config;
}

function setupWebpack() {
  const clientCompiler = webpack(getWebpackConfig());

  const serverCompiler = webpack(getWebpackConfig(true));

  serverCompiler.watch({}, (err, stats) => {
    if (err) {
      console.error(err);
    } else {
      console.log(stats.toString());
    }
  });

  const devMiddleware = WebpackDevMiddleware(clientCompiler, {
    headers: { "Access-Control-Allow-Origin": "*" },
    serverSideRender: true,
    publicPath: clientCompiler.options.output?.publicPath || "/",
    index: true,
  });
  const hotMiddleware = WebpackHotMiddleware(clientCompiler, {
    path: "/__webpack_hmr",
    heartbeat: 10 * 1000,
  });

  const loadServerStats = () =>
    loadStats(
      NodePath.resolve(serverCompiler.options.output.path, Demo.statsFilename),
    );
  const loadClientStats = () => {
    return loadStats(
      NodePath.resolve(clientCompiler.options.output.path, Demo.statsFilename),
      devMiddleware.context.outputFileSystem.promises,
    );
  };
  return {
    clientCompiler,
    serverCompiler,
    devMiddleware,
    hotMiddleware,
    loadServerStats,
    loadClientStats,
  };
}

async function loadStats(filepath, fs = NodeFS) {
  const stats = JSON.parse(await fs.readFile(filepath, "utf-8"));
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

module.exports = {
  setupWebpack,
  getWebpackConfig,
};
