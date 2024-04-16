const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = /** @type {import('@rspack/core').Configuration} */ ({
  mode: "production",
  // mode: "none",
  entry: "./src",
  output: {
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                transform: {},
                minify: {
                  format: {
                    inline_script: true,
                    ascii_only: true,
                  },
                },
                experimental: {
                  plugins: [
                    // ["@swc/plugin-remove-console", {}],
                    // [require.resolve("../../../my-first-plugin"), {}],
                  ],
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    {
      apply(compiler) {
        compiler.hooks.compilation.tap("a", (compilation) => {
          compilation.hooks.finishModules.tap("a", (modules) => {
            for (const mod of modules) {
              console.log(1, mod.resource);
            }
            console.log(modules.length);
          });
        });
      },
    },
  ],
  // plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
});
