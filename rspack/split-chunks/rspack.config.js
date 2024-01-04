/** @type {import('@rspack/core').Configuration} */
const config = {
  entry: "./src/index.js",
  target: "web",
  mode: "production",
  output: {
    clean: true,
  },
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        never: {
          test: /(\/(node_modules|pages)\/)/,
          chunks: "all",
          reuseExistingChunk: false,
          enforce: true,
          idHint: "never",
          name({ resource } = {}) {
            const r = /\/node_modules\/(?:(@[^/]+\/[^/]+)|([^@/]+))/;
            const z = /\/pages\/([^/]+)\.(?:jsx?|ts?|mjs|cjs)/;
            if (!resource) {
              return;
            }

            if (r.test(resource)) {
              const all = resource.match(new RegExp(r, "g")) || [];
              const last = all[all.length - 1];
              if (last) {
                const name = last.match(r);

                return (
                  "node_modules-" +
                  name[1].replace(/@/g, "_").replace(/\//g, "_")
                );
              }
            } else if (z.test(resource)) {
              const [, name] = resource.match(z) || [];

              if (name) {
                return `pages-${name}`;
              }
            }

            return;
          },
        },
      },
    },
  },
};
module.exports = config;
