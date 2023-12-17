import { defineConfig } from "@rsbuild/core";
import { pluginVue2 } from "@rsbuild/plugin-vue2";
import { pluginVue2Jsx } from "@rsbuild/plugin-vue2-jsx";
import { pluginBabel } from "@rsbuild/plugin-babel";

export default defineConfig({
  plugins: [pluginVue2({}), pluginBabel({}), pluginVue2Jsx({})],
  source: {
    entry: {
      index: "./src/index.vue",
    },
    include: [/\.vue\.js$/],
  },

  server: {
    port: 8081,
  },
});
