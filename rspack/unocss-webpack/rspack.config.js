const rspack = require("@rspack/core");
const NodePath = require("node:path");

module.exports = async function config() {
  const { default: UnoCSS } = await import("@unocss/webpack");
  return /** @type {import('@rspack/core').Configuration} */ ({
    mode: "development",
    entry: "./src",
    devtool: false,
    module: {
      rules: [{ test: /\.css$/, type: "css" }],
    },
    resolve: {
      alias: {
        // workaround for rspack
        // "uno.css$": NodePath.resolve(__dirname, "__uno.css"),
        // "__uno.css$": "data:",
      },
    },
    optimization: { realContentHash: true },
    plugins: [
      UnoCSS(),
      new rspack.HtmlRspackPlugin({
        template: NodePath.resolve(__dirname, "public", "index.html"),
      }),
      {
        apply(compiler) {
          const VIRTUAL_ENTRY_ALIAS = [
            /^(?:virtual:)?uno(?::(.+))?\.css(\?.*)?$/,
          ];
          const RESOLVED_ID_WITH_QUERY_RE =
            /[\/\\]__uno(?:(_.*?))?\.css(\?.*)?$/;
          function resolveId(id) {
            if (id.match(RESOLVED_ID_WITH_QUERY_RE)) return id;
            for (const alias of VIRTUAL_ENTRY_ALIAS) {
              const match = id.match(alias);
              if (match) {
                return match[1] ? `/__uno_${match[1]}.css` : "/__uno.css";
              }
            }
          }
          compiler.hooks.normalModuleFactory.tap("a", (nmf) => {
            const vfs = compiler.options.plugins.slice(-1)[0];
            nmf.hooks.beforeResolve.tap("a", (nmf) => {
              const resolved = resolveId(nmf.request);
              if (resolved) {
                vfs.writeModule(resolved, "");
                nmf.request = resolved;
              }
            });
          });
        },
      },
    ],
  });
};
