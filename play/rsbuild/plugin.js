const { getModernWebpackImporter, getWebpackImporter } = require("sass-loader/dist/utils");
module.exports = {
  apply(compiler) {
    const { NormalModule } = compiler.webpack;
    compiler.hooks.thisCompilation.tap("a", (compilation) => {
      NormalModule.getCompilationHooks(compilation).loader.tap("a", (loaderContext) => {
        // for (const current of loaderContext.loaders) {
        //   if (/sass-loader/.test(current.path)) {
        //     current.options.sassOptions = current.options.sassOptions || {};
        //
        //     const s = getModernWebpackImporter(
        //       loaderContext,
        //       require(current.options.implementation)
        //     );
        //
        //     const importer = {
        //       ...s,
        //       async canonicalize(...args) {
        //         const f = await s.canonicalize(...args);
        //         console.log(999, f);
        //         return f;
        //       },
        //     };
        //
        //     // current.options.webpackImporter = false;
        //     current.options.api = "modern";
        //     current.options.sassOptions.importers = importer;
        //     console.log(current.options);
        //   }
        // }
      });
    });
  },
};
