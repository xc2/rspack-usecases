import { defineConfig } from "@rsbuild/core";
import { pluginVue2 } from "@rsbuild/plugin-vue2";
import { pluginVue2Jsx } from "@rsbuild/plugin-vue2-jsx";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { inspect } from "node:util";

export default defineConfig({
  source: {},
  plugins: [
    pluginVue2(),
    pluginBabel({
      include: [/\.[jt]sx\.js/],
    }),
    pluginVue2Jsx(),
  ],
  tools: {
    rspack(config) {
      // console.log(
      //   inspect(config.module.rules, { depth: 5, compact: true, colors: true }),
      // );
      return config;
    },
  },
});
