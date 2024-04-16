import { defineConfig } from "@rsbuild/core";
import { getModernWebpackImporter, getWebpackImporter } from "./sass-importer";
import * as path from "node:path";

export default defineConfig({
  output: {
    cleanDistPath: true,
  },
  dev: { progressBar: false },
  tools: {
    bundlerChain(chain, { CHAIN_ID }) {
      chain.module
        .rule(CHAIN_ID.RULE.SASS)
        .use("a")
        .after(CHAIN_ID.USE.SASS)
        .loader(require.resolve("./a.js"));

      chain.module.rule(CHAIN_ID.RULE.SASS).use(CHAIN_ID.USE.SASS).loader("sass-loader");
    },
    rspack(config) {
      config.plugins.push(require("./plugin.js"));
      return config;
    },
    sass: {
      implementation: require.resolve("sass"),
      // api: "modern",
      // sassOptions: {
      // importer,
      // } as any,
    },
  },
});

// function importer() {
//   const loaderContext = this.webpackLoaderContext;
//   console.log(loaderContext);
//   console.log(111, loaderContext.resource);
//   const s = getModernWebpackImporter(
//     loaderContext,
//     require(loaderContext.options.implementation),
//     []
//   );
//
//   return s;
// }
