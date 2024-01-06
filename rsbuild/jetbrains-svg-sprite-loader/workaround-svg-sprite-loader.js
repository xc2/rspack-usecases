const _loader = require("svg-sprite-loader");

module.exports = function loader(...args) {
  // svg-sprite-loader workaround for rspack, with no extract support.
  this._module = this._module || {};
  this.target = this.target || "web";
  return _loader.apply(this, args);
};

module.exports.NAMESPACE = _loader.NAMESPACE;
