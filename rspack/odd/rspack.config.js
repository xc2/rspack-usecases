module.exports = function (env) {
  const isWebpack = env.WEBPACK_BUNDLE || env.WEBPACK_BUILD;
  /** @type {import('@rspack/core').Configuration} */
  const config = {
    entry: "./src/index.js",
    output: {
      clean: true,
      path: require("path").resolve(
        __dirname,
        isWebpack ? "dist-webpack" : "dist-rspack",
      ),
    },
    optimization: {
      minimize: false,
    },
  };

  return config;
};
