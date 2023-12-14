const rspack = require("@rspack/core");

/** @type {import('@rspack/core').Configuration} */
const config = {
  entry: "./src/index.js",
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
      templateParameters: {
        publicUrl: "/",
      },
    }),
  ],
};
module.exports = config;
