const rspack = require("@rspack/core");

/** @type {import('@rspack/core').Configuration} */
const config = {
  entry: { index: "./src/index.js", index2: "./src/index2.js" },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["svg-sprite-loader", "svgo-loader"],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
  ],
};
module.exports = config;
