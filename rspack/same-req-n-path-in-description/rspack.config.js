/** @type {import("@rspack/core").Configuration} */
const config = {
  context: __dirname,
  entry: "./src/main.js",
  resolve: {
    aliasFields: ["browser"],
  },
};

module.exports = config;
