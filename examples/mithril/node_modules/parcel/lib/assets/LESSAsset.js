"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Asset = require('../Asset');

const localRequire = require('../utils/localRequire');

const _require = require('@parcel/utils'),
      promisify = _require.promisify;

const Resolver = require('../Resolver');

const fs = require('@parcel/fs');

const path = require('path');

const parseCSSImport = require('../utils/parseCSSImport');

class LESSAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'css';
  }

  parse(code) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // less should be installed locally in the module that's being required
      let less = yield localRequire('less', _this.name);
      let render = promisify(less.render.bind(less));
      let opts = (yield _this.getConfig(['.lessrc', '.lessrc.js'], {
        packageKey: 'less'
      })) || {};
      opts.filename = _this.name;
      opts.plugins = (opts.plugins || []).concat(urlPlugin(_this));

      if (_this.options.sourceMaps) {
        opts.sourceMap = {
          outputSourceFiles: true
        };
      }

      return render(code, opts);
    })();
  }

  collectDependencies() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.ast.imports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
    let map;

    if (this.ast && this.ast.map) {
      map = JSON.parse(this.ast.map.toString());
      map.sources = map.sources.map(v => path.relative(this.options.rootDir, v));
    }

    return [{
      type: 'css',
      value: this.ast ? this.ast.css : '',
      hasDependencies: false,
      map
    }];
  }

}

function urlPlugin(asset) {
  return {
    install: (less, pluginManager) => {
      let visitor = new less.visitors.Visitor({
        visitUrl: node => {
          node.value.value = asset.addURLDependency(node.value.value, node.currentFileInfo.filename);
          return node;
        }
      });
      visitor.run = visitor.visit;
      pluginManager.addVisitor(visitor);
      let LessFileManager = getFileManager(less, asset.options);
      pluginManager.addFileManager(new LessFileManager());
    }
  };
}

function getFileManager(less, options) {
  const resolver = new Resolver({
    extensions: ['.css', '.less'],
    rootDir: options.rootDir
  });

  class LessFileManager extends less.FileManager {
    supports() {
      return true;
    }

    supportsSync() {
      return false;
    }

    loadFile(filename, currentDirectory) {
      return (0, _asyncToGenerator2.default)(function* () {
        filename = parseCSSImport(filename);
        let resolved = yield resolver.resolve(filename, path.join(currentDirectory, 'index'));
        return {
          contents: yield fs.readFile(resolved.path, 'utf8'),
          filename: resolved.path
        };
      })();
    }

  }

  return LessFileManager;
}

module.exports = LESSAsset;