import { defineConfig } from "@rsbuild/core";
import { pluginVue2 } from "@rsbuild/plugin-vue2";
import { pluginUmd } from "@rsbuild/plugin-umd";

export default defineConfig({
  plugins: [pluginVue2(), pluginUmd({ name: "doesnt_matter" })],
  source: {
    preEntry: "./src/public-path.js",
  },
  html: {
    template: "./index.html",
  },
  output: {
    cleanDistPath: true,
  },
  server: {
    port: 1234,
  },
});
