const NodePath = require("node:path");

module.exports = function ({ WEBPACK_BUNDLE, WEBPACK_SERVE, WEBPACK_WATCH }) {
  const isWebpack = WEBPACK_BUNDLE || WEBPACK_SERVE || WEBPACK_WATCH;
  const scssLoader = { loader: "sass-loader" };
  const postcssLoader = {
    loader: "postcss-loader",
    options: {
      postcssOptions: { plugins: ["postcss-modules-values"] },
    },
  };
  const styleLoader = { loader: "style-loader" };

  const cssLoader = {
    loader: "css-loader",
    options: {
      importLoaders: 2,
      modules: {
        localIdentName: "[name]__[local]",
        exportOnlyLocals: true,
      },
    },
  };
  const rspackCssModule = {
    localIdentName: "[name]__[local]",
    exportsOnly: true,
  };
  const styleUse = isWebpack
    ? [styleLoader, cssLoader, postcssLoader, scssLoader]
    : [postcssLoader, scssLoader];
  /** @type {import('@rspack/core').Configuration} */
  const config = {
    mode: "development",
    devtool: false,
    context: NodePath.resolve(__dirname, "src"),
    entry: "./index.js",
    output: {
      clean: true,
      path: NodePath.resolve(
        __dirname,
        isWebpack ? "dist/webpack" : "dist/rspack",
      ),
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: styleUse,
          type: isWebpack ? undefined : "css/module",
        },
      ],
    },
    plugins: [],
  };
  if (!isWebpack) {
    config.builtins = { css: { modules: rspackCssModule } };
  }
  return config;
};
