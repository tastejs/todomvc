"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Asset = require('../Asset');

const localRequire = require('../utils/localRequire');

const _require = require('@parcel/utils'),
      promisify = _require.promisify;

const path = require('path');

const os = require('os');

const Resolver = require('../Resolver');

const parseCSSImport = require('../utils/parseCSSImport');

class SASSAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'css';
  }

  parse(code) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // node-sass or dart-sass should be installed locally in the module that's being required
      let sass = yield getSassRuntime(_this.name);
      let render = promisify(sass.render.bind(sass));
      const resolver = new Resolver({
        extensions: ['.scss', '.sass'],
        rootDir: _this.options.rootDir
      });
      let opts = (yield _this.getConfig(['.sassrc', '.sassrc.js'], {
        packageKey: 'sass'
      })) || {};
      opts.includePaths = (opts.includePaths ? opts.includePaths.map(includePath => path.resolve(includePath)) : []).concat(path.dirname(_this.name));
      opts.data = opts.data ? opts.data + os.EOL + code : code;
      let type = _this.options.rendition ? _this.options.rendition.type : path.extname(_this.name).toLowerCase().replace('.', '');
      opts.indentedSyntax = typeof opts.indentedSyntax === 'boolean' ? opts.indentedSyntax : type === 'sass';
      opts.importer = opts.importer || [];
      opts.importer = Array.isArray(opts.importer) ? opts.importer : [opts.importer];
      opts.importer.push((url, prev, done) => {
        url = url.replace(/^file:\/\//, '');
        url = parseCSSImport(url);
        resolver.resolve(url, prev === 'stdin' ? _this.name : prev).then(resolved => resolved.path).catch(() => url).then(file => done({
          file
        })).catch(err => done(normalizeError(err)));
      });

      if (_this.options.sourceMaps) {
        opts.sourceMap = true;
        opts.file = _this.name;
        opts.outFile = _this.name;
        opts.omitSourceMapUrl = true;
        opts.sourceMapContents = true;
      }

      try {
        return yield render(opts);
      } catch (err) {
        // Format the error so it can be handled by parcel's prettyError
        if (err.formatted) {
          throw sassToCodeFrame(err);
        } // Throw original error if there is no codeFrame


        throw err;
      }
    })();
  }

  collectDependencies() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.ast.stats.includedFiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let dep = _step.value;
        this.addDependency(dep, {
          includedInParent: true
        });
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  generate() {
    return [{
      type: 'css',
      value: this.ast ? this.ast.css.toString() : '',
      map: this.ast && this.ast.map ? JSON.parse(this.ast.map.toString()) : undefined
    }];
  }

}

module.exports = SASSAsset;

function getSassRuntime(_x) {
  return _getSassRuntime.apply(this, arguments);
}

function _getSassRuntime() {
  _getSassRuntime = (0, _asyncToGenerator2.default)(function* (searchPath) {
    try {
      return yield localRequire('node-sass', searchPath, true);
    } catch (e) {
      // If node-sass is not used locally, install dart-sass, as this causes no freezing issues
      return localRequire('sass', searchPath);
    }
  });
  return _getSassRuntime.apply(this, arguments);
}

function sassToCodeFrame(err) {
  let error = new Error(err.message);
  error.codeFrame = err.formatted;
  error.stack = err.stack;
  error.fileName = err.file;
  error.loc = {
    line: err.line,
    column: err.column
  };
  return error;
} // Ensures an error inherits from Error


function normalizeError(err) {
  let message = 'Unknown error';

  if (err) {
    if (err instanceof Error) {
      return err;
    }

    message = err.stack || err.message || err;
  }

  return new Error(message);
}