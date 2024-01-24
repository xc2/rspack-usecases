require("@loadable/server/lib/util");

const _utilModule = require.cache[require.resolve("@loadable/server/lib/util")];

function setLoadableServerHot(bool) {
  _utilModule.hot = bool;
}

module.exports = {
  setLoadableServerHot,
};
