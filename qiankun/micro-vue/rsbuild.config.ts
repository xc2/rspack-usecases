import { defineConfig } from "@rsbuild/core";
import { pluginVue2 } from "@rsbuild/plugin-vue2";

export default defineConfig({
  plugins: [pluginVue2()],
  source: {
    preEntry: "./src/public-path.js",
  },
  html: {
    template: "./index.html",
  },
  tools: {
    bundlerChain: (chain) => {
      chain.output.library({
        name: "whatever",
        type: "umd",
        umdNamedDefine: true,
      });
    },
  },
  output: {
    cleanDistPath: true,
  },
  server: {
    port: 1234,
  },
});
