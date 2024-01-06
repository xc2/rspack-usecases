import { defineConfig } from "@rsbuild/core";

export default defineConfig({
  output: {
    cleanDistPath: true,
  },
  tools: {
    bundlerChain(chain, utils) {
      const rule = chain.module
        .rule("svg")
        .oneOf("sprite")
        .test(/./) // regexp for all svgs you'd like them to be sprited.
        .before("svg-asset-url");

      rule
        .use("jetbrains")
        .loader(require.resolve("./workaround-svg-sprite-loader.js"))
        .options({ symbolId: "icon-[name]" });

      rule.use("svgo").loader("svgo-loader");
    },
  },
});
