import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

import { logger } from "@rsbuild/core";
console.log(process.stdin.isRaw);
let interrupted = false;
process.on("SIGINT", () => {
  if (interrupted) {
    return process.exit(/** 128 + 2(kill) */ 130);
  }

  interrupted = true;
  logger.info(
    `Gracefully shutting down. Please wait... (Press Ctrl+ C again to force exit)`,
  );
});

// process.on("SIGINT", () => {
//   console.log("SIGINT");
// });

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    // alias: {
    //   "/amcp/image/font": false,
    // },
  },

  dev: {
    writeToDisk: true,
  },
  output: {
    overrideBrowserslist: ["last 1 chrome version"],
    externals: [/^node:/, /^bun:/],
    minify: false,
  },
  tools: {
    rspack: {
      output: {
        hotUpdateChunkFilename: "static/[id].[fullhash].hot-update.js",
        hotUpdateMainFilename: "static/[runtime].[fullhash].hot-update.json",
      },
    },
  },
});
