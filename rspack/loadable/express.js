const express = require("express");
const { ChunkExtractor } = require("@loadable/server");
const { setupWebpack } = require("./setup-webpack");
const { hotMiddleware, devMiddleware, loadServerStats, loadClientStats } =
  setupWebpack();

const app = express();
app.use(devMiddleware);
app.use(hotMiddleware);

app.use(async (req, res) => {
  const serverExtractor = new ChunkExtractor({
    stats: await loadServerStats(),
  });

  const { render } = serverExtractor.requireEntrypoint();

  const webExtractor = new ChunkExtractor({ stats: await loadClientStats() });

  res.send(`<!Doctype html>
<meta charset="utf-8">
<title>It works</title>
${webExtractor.getLinkTags()}
${webExtractor.getStyleTags()}
<div id="react">${render("Landing")}</div>
${webExtractor.getScriptTags()}
  `);
});

app.listen(3000, () => {
  console.log(`Go http://localhost:3000`);
});
