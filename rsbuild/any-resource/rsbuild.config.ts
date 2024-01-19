import { defineConfig } from "@rsbuild/core";

export default defineConfig({
  output: {
    cleanDistPath: true,
  },
  tools: {
    rspack: {
      module: {
        rules: [{ resourceQuery: /type=source/, type: "asset/source" }],
      },
    },
  },
});
