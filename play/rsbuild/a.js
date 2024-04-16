const { getModernWebpackImporter } = require("sass-loader/dist/utils");
module.exports = function foo(code) {
  for (const current of this.loaders) {
    if (/sass-loader/.test(current.path)) {
      console.log(current.options);
    }
  }
  return code;
};

module.exports.pitch = function p() {
  for (const current of this.loaders) {
    if (/sass-loader/.test(current.path)) {
      current.options.sassOptions = current.options.sassOptions || {};

      const s = getModernWebpackImporter(this, require(current.options.implementation));

      const importer = {
        ...s,
        async canonicalize(...args) {
          const f = await s.canonicalize(...args);
          console.log(999, f);
          return f;
        },
      };

      current.options.webpackImporter = false;
      current.options.api = "modern-compiler";
      current.options.sassOptions.importers = importer;
      console.log(current.options);
    }
  }
};
