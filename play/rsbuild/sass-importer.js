const url = require("node:url");
const path = require("node:path");

const MODULE_REQUEST_REGEX = /^[^?]*~/;

// Examples:
// - ~package
// - ~package/
// - ~@org
// - ~@org/
// - ~@org/package
// - ~@org/package/
const IS_MODULE_IMPORT = /^~([^/]+|[^/]+\/|@[^/]+[/][^/]+|@[^/]+\/?|@[^/]+[/][^/]+\/)$/;

const IS_PKG_SCHEME = /^pkg:/i;

/**
 * When `sass`/`node-sass` tries to resolve an import, it uses a special algorithm.
 * Since the `sass-loader` uses webpack to resolve the modules, we need to simulate that algorithm.
 * This function returns an array of import paths to try.
 * The last entry in the array is always the original url to enable straight-forward webpack.config aliases.
 *
 * We don't need emulate `dart-sass` "It's not clear which file to import." errors (when "file.ext" and "_file.ext" files are present simultaneously in the same directory).
 * This reduces performance and `dart-sass` always do it on own side.
 *
 * @param {string} url
 * @param {boolean} forWebpackResolver
 * @param {boolean} fromImport
 * @returns {Array<string>}
 */
function getPossibleRequests(
  // eslint-disable-next-line no-shadow
  url,
  forWebpackResolver = false,
  fromImport = false
) {
  let request = url;

  // In case there is module request, send this to webpack resolver
  if (forWebpackResolver) {
    if (MODULE_REQUEST_REGEX.test(url)) {
      request = request.replace(MODULE_REQUEST_REGEX, "");
    }

    if (IS_PKG_SCHEME.test(url)) {
      request = `${request.slice(4)}`;

      return [...new Set([request, url])];
    }

    if (IS_MODULE_IMPORT.test(url) || IS_PKG_SCHEME.test(url)) {
      request = request[request.length - 1] === "/" ? request : `${request}/`;

      return [...new Set([request, url])];
    }
  }

  // Keep in mind: ext can also be something like '.datepicker' when the true extension is omitted and the filename contains a dot.
  // @see https://github.com/webpack-contrib/sass-loader/issues/167
  const extension = path.extname(request).toLowerCase();

  // Because @import is also defined in CSS, Sass needs a way of compiling plain CSS @imports without trying to import the files at compile time.
  // To accomplish this, and to ensure SCSS is as much of a superset of CSS as possible, Sass will compile any @imports with the following characteristics to plain CSS imports:
  //  - imports where the URL ends with .css.
  //  - imports where the URL begins http:// or https://.
  //  - imports where the URL is written as a url().
  //  - imports that have media queries.
  //
  // The `node-sass` package sends `@import` ending on `.css` to importer, it is bug, so we skip resolve
  if (extension === ".css") {
    return [];
  }

  const dirname = path.dirname(request);
  const normalizedDirname = dirname === "." ? "" : `${dirname}/`;
  const basename = path.basename(request);
  const basenameWithoutExtension = path.basename(request, extension);

  return [
    ...new Set(
      []
        .concat(
          fromImport
            ? [
                `${normalizedDirname}_${basenameWithoutExtension}.import${extension}`,
                `${normalizedDirname}${basenameWithoutExtension}.import${extension}`,
              ]
            : []
        )
        .concat([`${normalizedDirname}_${basename}`, `${normalizedDirname}${basename}`])
        .concat(forWebpackResolver ? [url] : [])
    ),
  ];
}

function promiseResolve(callbackResolve) {
  return (context, request) =>
    new Promise((resolve, reject) => {
      callbackResolve(context, request, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
}

async function startResolving(resolutionMap) {
  if (resolutionMap.length === 0) {
    return Promise.reject();
  }

  const [{ possibleRequests }] = resolutionMap;

  if (possibleRequests.length === 0) {
    return Promise.reject();
  }

  const [{ resolve, context }] = resolutionMap;

  try {
    return await resolve(context, possibleRequests[0]);
  } catch (_ignoreError) {
    const [, ...tailResult] = possibleRequests;

    if (tailResult.length === 0) {
      const [, ...tailResolutionMap] = resolutionMap;

      return startResolving(tailResolutionMap);
    }

    // eslint-disable-next-line no-param-reassign
    resolutionMap[0].possibleRequests = tailResult;

    return startResolving(resolutionMap);
  }
}

const IS_SPECIAL_MODULE_IMPORT = /^~[^/]+$/;
// `[drive_letter]:\` + `\\[server]\[sharename]\`
const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i;

/**
 * @public
 * Create the resolve function used in the custom Sass importer.
 *
 * Can be used by external tools to mimic how `sass-loader` works, for example
 * in a Jest transform. Such usages will want to wrap `resolve.create` from
 * [`enhanced-resolve`]{@link https://github.com/webpack/enhanced-resolve} to
 * pass as the `resolverFactory` argument.
 *
 * @param {Function} resolverFactory - A factory function for creating a Webpack
 *   resolver.
 * @param {Object} implementation - The imported Sass implementation, both
 *   `sass` (Dart Sass) and `node-sass` are supported.
 * @param {string[]} [includePaths] - The list of include paths passed to Sass.
 *
 * @throws If a compatible Sass implementation cannot be found.
 */
function getWebpackResolver(resolverFactory, implementation, includePaths = []) {
  const isModernSass =
    implementation &&
    (implementation.info.includes("dart-sass") || implementation.info.includes("sass-embedded"));
  // We only have one difference with the built-in sass resolution logic and out resolution logic:
  // First, we look at the files starting with `_`, then without `_` (i.e. `_name.sass`, `_name.scss`, `_name.css`, `name.sass`, `name.scss`, `name.css`),
  // although `sass` look together by extensions (i.e. `_name.sass`/`name.sass`/`_name.scss`/`name.scss`/`_name.css`/`name.css`).
  // It shouldn't be a problem because `sass` throw errors:
  // - on having `_name.sass` and `name.sass` (extension can be `sass`, `scss` or `css`) in the same directory
  // - on having `_name.sass` and `_name.scss` in the same directory
  //
  // Also `sass` prefer `sass`/`scss` over `css`.
  const sassModuleResolve = promiseResolve(
    resolverFactory({
      alias: [],
      aliasFields: [],
      conditionNames: [],
      descriptionFiles: [],
      extensions: [".sass", ".scss", ".css"],
      exportsFields: [],
      mainFields: [],
      mainFiles: ["_index", "index"],
      modules: [],
      restrictions: [/\.((sa|sc|c)ss)$/i],
      preferRelative: true,
    })
  );
  const sassImportResolve = promiseResolve(
    resolverFactory({
      alias: [],
      aliasFields: [],
      conditionNames: [],
      descriptionFiles: [],
      extensions: [".sass", ".scss", ".css"],
      exportsFields: [],
      mainFields: [],
      mainFiles: ["_index.import", "_index", "index.import", "index"],
      modules: [],
      restrictions: [/\.((sa|sc|c)ss)$/i],
      preferRelative: true,
    })
  );
  const webpackModuleResolve = promiseResolve(
    resolverFactory({
      dependencyType: "sass",
      conditionNames: ["sass", "style", "..."],
      mainFields: ["sass", "style", "main", "..."],
      mainFiles: ["_index", "index", "..."],
      extensions: [".sass", ".scss", ".css"],
      restrictions: [/\.((sa|sc|c)ss)$/i],
      preferRelative: true,
    })
  );
  const webpackImportResolve = promiseResolve(
    resolverFactory({
      dependencyType: "sass",
      conditionNames: ["sass", "style", "..."],
      mainFields: ["sass", "style", "main", "..."],
      mainFiles: ["_index.import", "_index", "index.import", "index", "..."],
      extensions: [".sass", ".scss", ".css"],
      restrictions: [/\.((sa|sc|c)ss)$/i],
      preferRelative: true,
    })
  );

  return (context, request, fromImport) => {
    // See https://github.com/webpack/webpack/issues/12340
    // Because `node-sass` calls our importer before `1. Filesystem imports relative to the base file.`
    // custom importer may not return `{ file: '/path/to/name.ext' }` and therefore our `context` will be relative
    if (!isModernSass && !path.isAbsolute(context)) {
      return Promise.reject();
    }

    const originalRequest = request;
    const isFileScheme = originalRequest.slice(0, 5).toLowerCase() === "file:";

    if (isFileScheme) {
      try {
        // eslint-disable-next-line no-param-reassign
        request = url.fileURLToPath(originalRequest);
      } catch (ignoreError) {
        // eslint-disable-next-line no-param-reassign
        request = request.slice(7);
      }
    }

    let resolutionMap = [];

    const needEmulateSassResolver =
      // `sass` doesn't support module import
      !IS_SPECIAL_MODULE_IMPORT.test(request) &&
      // don't handle `pkg:` scheme
      !IS_PKG_SCHEME.test(request) &&
      // We need improve absolute paths handling.
      // Absolute paths should be resolved:
      // - Server-relative URLs - `<context>/path/to/file.ext` (where `<context>` is root context)
      // - Absolute path - `/full/path/to/file.ext` or `C:\\full\path\to\file.ext`
      !isFileScheme &&
      !originalRequest.startsWith("/") &&
      !IS_NATIVE_WIN32_PATH.test(originalRequest);

    if (includePaths.length > 0 && needEmulateSassResolver) {
      // The order of import precedence is as follows:
      //
      // 1. Filesystem imports relative to the base file.
      // 2. Custom importer imports.
      // 3. Filesystem imports relative to the working directory.
      // 4. Filesystem imports relative to an `includePaths` path.
      // 5. Filesystem imports relative to a `SASS_PATH` path.
      //
      // `sass` run custom importers before `3`, `4` and `5` points, we need to emulate this behavior to avoid wrong resolution.
      const sassPossibleRequests = getPossibleRequests(request, false, fromImport);

      // `node-sass` calls our importer before `1. Filesystem imports relative to the base file.`, so we need emulate this too
      if (!isModernSass) {
        resolutionMap = resolutionMap.concat({
          resolve: fromImport ? sassImportResolve : sassModuleResolve,
          context: path.dirname(context),
          possibleRequests: sassPossibleRequests,
        });
      }

      resolutionMap = resolutionMap.concat(
        // eslint-disable-next-line no-shadow
        includePaths.map((context) => {
          return {
            resolve: fromImport ? sassImportResolve : sassModuleResolve,
            context,
            possibleRequests: sassPossibleRequests,
          };
        })
      );
    }

    const webpackPossibleRequests = getPossibleRequests(request, true, fromImport);

    resolutionMap = resolutionMap.concat({
      resolve: fromImport ? webpackImportResolve : webpackModuleResolve,
      context: path.dirname(context),
      possibleRequests: webpackPossibleRequests,
    });

    return startResolving(resolutionMap);
  };
}

const MATCH_CSS = /\.css$/i;

function getModernWebpackImporter(loaderContext, implementation, loadPaths) {
  const resolve = getWebpackResolver(loaderContext.getResolve, implementation, loadPaths);

  return {
    async canonicalize(originalUrl, context) {
      const { fromImport } = context;
      const prev = context.containingUrl
        ? url.fileURLToPath(context.containingUrl.toString())
        : loaderContext.resourcePath;

      let result;

      try {
        result = await resolve(prev, originalUrl, fromImport);
      } catch (err) {
        // If no stylesheets are found, the importer should return null.
        return null;
      }

      loaderContext.addDependency(path.normalize(result));

      return url.pathToFileURL(result);
    },
    async load(canonicalUrl) {
      const ext = path.extname(canonicalUrl.pathname);

      let syntax;

      if (ext && ext.toLowerCase() === ".scss") {
        syntax = "scss";
      } else if (ext && ext.toLowerCase() === ".sass") {
        syntax = "indented";
      } else if (ext && ext.toLowerCase() === ".css") {
        syntax = "css";
      } else {
        // Fallback to default value
        syntax = "scss";
      }

      try {
        const contents = await new Promise((resolve, reject) => {
          // Old version of `enhanced-resolve` supports only path as a string
          // TODO simplify in the next major release and pass URL
          const canonicalPath = url.fileURLToPath(canonicalUrl);

          loaderContext.fs.readFile(canonicalPath, "utf8", (err, content) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(content);
          });
        });

        return { contents, syntax };
      } catch (err) {
        return null;
      }
    },
  };
}

function getWebpackImporter(loaderContext, implementation, includePaths) {
  const resolve = getWebpackResolver(loaderContext.getResolve, implementation, includePaths);

  return function importer(originalUrl, prev, done) {
    const { fromImport } = this;

    resolve(prev, originalUrl, fromImport)
      .then((result) => {
        // Add the result as dependency.
        // Although we're also using stats.includedFiles, this might come in handy when an error occurs.
        // In this case, we don't get stats.includedFiles from node-sass/sass.
        loaderContext.addDependency(path.normalize(result));

        // By removing the CSS file extension, we trigger node-sass to include the CSS file instead of just linking it.
        done({ file: result.replace(MATCH_CSS, "") });
      })
      // Catch all resolving errors, return the original file and pass responsibility back to other custom importers
      .catch(() => {
        done({ file: originalUrl });
      });
  };
}

module.exports = { getModernWebpackImporter, getWebpackImporter };
