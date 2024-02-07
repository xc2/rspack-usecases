const InterpolateHtmlPlugin = require("./cra-interpolate-html-plugin");
const { getClientEnvironment } = require("./cra-config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const publicUrl = "/";
const env = getClientEnvironment(publicUrl);

/** @type {import('@rspack/cli').Configuration} */
const config = {
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
  ],
};
module.exports = config;
