import { defineConfig } from "@rsbuild/core";

export default defineConfig({
  output: {
    cleanDistPath: true,
  },
  html: {
    template: "./index.html",
  },
});
