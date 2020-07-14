"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const traverse = require('@babel/traverse').default;

const codeFrame = require('@babel/code-frame').codeFrameColumns;

const collectDependencies = require('../visitors/dependencies');

const walk = require('babylon-walk');

const Asset = require('../Asset');

const babelParser = require('@babel/parser');

const insertGlobals = require('../visitors/globals');

const fsVisitor = require('../visitors/fs');

const envVisitor = require('../visitors/env');

const processVisitor = require('../visitors/process');

const babel = require('../transforms/babel/transform');

const babel7 = require('../transforms/babel/babel7');

const generate = require('@babel/generator').default;

const terser = require('../transforms/terser');

const SourceMap = require('../SourceMap');

const hoist = require('../scope-hoisting/hoist');

const loadSourceMap = require('../utils/loadSourceMap');

const isAccessedVarChanged = require('../utils/isAccessedVarChanged');

const IMPORT_RE = /\b(?:import\b|export\b|require\s*\()/;
const ENV_RE = /\b(?:process\.env)\b/;
const BROWSER_RE = /\b(?:process\.browser)\b/;
const GLOBAL_RE = /\b(?:process|__dirname|__filename|global|Buffer|define)\b/;
const FS_RE = /\breadFileSync\b/;
const SW_RE = /\bnavigator\s*\.\s*serviceWorker\s*\.\s*register\s*\(/;
const WORKER_RE = /\bnew\s*(?:Shared)?Worker\s*\(/;

class JSAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
    this.globals = new Map();
    this.isAstDirty = false;
    this.isES6Module = false;
    this.outputCode = null;
    this.cacheData.env = {};
    this.rendition = options.rendition;
    this.sourceMap = this.rendition ? this.rendition.map : null;
  }

  shouldInvalidate(cacheData) {
    return isAccessedVarChanged(cacheData);
  }

  mightHaveDependencies() {
    return this.isAstDirty || !/\.js$/.test(this.name) || IMPORT_RE.test(this.contents) || GLOBAL_RE.test(this.contents) || SW_RE.test(this.contents) || WORKER_RE.test(this.contents);
  }

  parse(code) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return babelParser.parse(code, {
        filename: _this.name,
        allowReturnOutsideFunction: true,
        strictMode: false,
        sourceType: 'module',
        plugins: ['exportDefaultFrom', 'exportNamespaceFrom', 'dynamicImport']
      });
    })();
  }

  traverse(visitor) {
    return traverse(this.ast, visitor, null, this);
  }

  traverseFast(visitor) {
    return walk.simple(this.ast, visitor, this);
  }

  collectDependencies() {
    walk.ancestor(this.ast, collectDependencies, this);
  }

  pretransform() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this2.options.sourceMaps && !_this2.sourceMap) {
        _this2.sourceMap = yield loadSourceMap(_this2);
      }

      yield babel(_this2); // Inline environment variables

      if (_this2.options.target === 'browser' && ENV_RE.test(_this2.contents)) {
        yield _this2.parseIfNeeded();

        _this2.traverseFast(envVisitor);
      } // Inline process.browser


      if (_this2.options.target === 'browser' && BROWSER_RE.test(_this2.contents)) {
        yield _this2.parseIfNeeded();

        _this2.traverse(processVisitor);

        _this2.isAstDirty = true;
      }
    })();
  }

  transform() {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this3.options.target === 'browser') {
        if (_this3.dependencies.has('fs') && FS_RE.test(_this3.contents)) {
          // Check if we should ignore fs calls
          // See https://github.com/defunctzombie/node-browser-resolve#skip
          let pkg = yield _this3.getPackage();
          let ignore = pkg && pkg.browser && pkg.browser.fs === false;

          if (!ignore) {
            yield _this3.parseIfNeeded();

            _this3.traverse(fsVisitor);
          }
        }

        if (GLOBAL_RE.test(_this3.contents)) {
          yield _this3.parseIfNeeded();
          walk.ancestor(_this3.ast, insertGlobals, _this3);
        }
      }

      if (_this3.options.scopeHoist) {
        yield _this3.parseIfNeeded();
        yield _this3.getPackage();

        _this3.traverse(hoist);

        _this3.isAstDirty = true;
      } else {
        if (_this3.isES6Module) {
          yield babel7(_this3, {
            internal: true,
            config: {
              plugins: [require('@babel/plugin-transform-modules-commonjs')]
            }
          });
        }
      }

      if (_this3.options.minify) {
        yield terser(_this3);
      }
    })();
  }

  generate() {
    var _this4 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let code;

      if (_this4.isAstDirty) {
        let opts = {
          sourceMaps: _this4.options.sourceMaps,
          sourceFileName: _this4.relativeName
        };
        let generated = generate(_this4.ast, opts, _this4.contents);

        if (_this4.options.sourceMaps && generated.rawMappings) {
          let rawMap = new SourceMap(generated.rawMappings, {
            [_this4.relativeName]: _this4.contents
          }); // Check if we already have a source map (e.g. from TypeScript or CoffeeScript)
          // In that case, we need to map the original source map to the babel generated one.

          if (_this4.sourceMap) {
            _this4.sourceMap = yield new SourceMap().extendSourceMap(_this4.sourceMap, rawMap);
          } else {
            _this4.sourceMap = rawMap;
          }
        }

        code = generated.code;
      } else {
        code = _this4.outputCode != null ? _this4.outputCode : _this4.contents;
      }

      if (_this4.options.sourceMaps && !_this4.sourceMap) {
        _this4.sourceMap = new SourceMap().generateEmptyMap(_this4.relativeName, _this4.contents);
      }

      if (_this4.globals.size > 0) {
        code = Array.from(_this4.globals.values()).join('\n') + '\n' + code;

        if (_this4.options.sourceMaps) {
          if (!(_this4.sourceMap instanceof SourceMap)) {
            _this4.sourceMap = yield new SourceMap().addMap(_this4.sourceMap);
          }

          _this4.sourceMap.offset(_this4.globals.size);
        }
      }

      return [{
        type: 'js',
        value: code,
        map: _this4.sourceMap
      }];
    })();
  }

  generateErrorMessage(err) {
    const loc = err.loc;

    if (loc) {
      // Babel 7 adds its own code frame on the error message itself
      // We need to remove it and pass it separately.
      if (err.message.startsWith(this.name)) {
        err.message = err.message.slice(this.name.length + 1, err.message.indexOf('\n')).trim();
      }

      err.codeFrame = codeFrame(this.contents, {
        start: loc
      });
      err.highlightedCodeFrame = codeFrame(this.contents, {
        start: loc
      }, {
        highlightCode: true
      });
    }

    return err;
  }

}

module.exports = JSAsset;