import { defineConfig } from "@rsbuild/core";

export default defineConfig({
  output: {
    cleanDistPath: true,
  },
  tools: {
    bundlerChain(chain, utils) {
      // remove rsbuild builtin css rules
      chain.module.rules.delete("css");
    },
    rspack: {
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ["css-loader"],
            resourceQuery: /type=source/,
            type: "asset/source",
          },
        ],
      },
    },
  },
});
