/** @type {import('@rspack/core').Configuration} */
const config = {
  context: __dirname,
  entry: "./src/index.js",
  resolve: {
    alias: {
      "./a_": "./a!",
    },
  },
};
module.exports = config;
