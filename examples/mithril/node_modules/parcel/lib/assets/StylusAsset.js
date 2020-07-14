"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

// const CSSAsset = require('./CSSAsset');
const Asset = require('../Asset');

const localRequire = require('../utils/localRequire');

const Resolver = require('../Resolver');

const fs = require('@parcel/fs');

const _require = require('path'),
      dirname = _require.dirname,
      resolve = _require.resolve,
      relative = _require.relative;

const _require2 = require('../utils/glob'),
      isGlob = _require2.isGlob,
      glob = _require2.glob;

const URL_RE = /^(?:url\s*\(\s*)?['"]?(?:[#/]|(?:https?:)?\/\/)/i;

class StylusAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'css';
  }

  parse(code) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // stylus should be installed locally in the module that's being required
      let stylus = yield localRequire('stylus', _this.name);
      let opts = yield _this.getConfig(['.stylusrc', '.stylusrc.js'], {
        packageKey: 'stylus'
      });
      let style = stylus(code, opts);
      style.set('filename', _this.name);
      style.set('include css', true); // Setup a handler for the URL function so we add dependencies for linked assets.

      style.define('url', node => {
        let filename = _this.addURLDependency(node.val, node.filename);

        return new stylus.nodes.Literal(`url(${JSON.stringify(filename)})`);
      });
      style.set('Evaluator', (yield createEvaluator(code, _this, style.options)));
      return style;
    })();
  }

  generate() {
    return [{
      type: 'css',
      value: this.ast.render(),
      hasDependencies: false
    }];
  }

  generateErrorMessage(err) {
    let index = err.message.indexOf('\n');
    err.codeFrame = err.message.slice(index + 1);
    err.message = err.message.slice(0, index);
    return err;
  }

}

function getDependencies(_x, _x2, _x3, _x4) {
  return _getDependencies.apply(this, arguments);
}

function _getDependencies() {
  _getDependencies = (0, _asyncToGenerator2.default)(function* (code, filepath, asset, options, seen = new Set()) {
    seen.add(filepath);

    const _ref = yield Promise.all(['parser', 'visitor/deps-resolver', 'nodes', 'utils'].map(dep => localRequire('stylus/lib/' + dep, filepath))),
          _ref2 = (0, _slicedToArray2.default)(_ref, 4),
          Parser = _ref2[0],
          DepsResolver = _ref2[1],
          nodes = _ref2[2],
          utils = _ref2[3];

    nodes.filename = asset.name;
    let parser = new Parser(code, options);
    let ast = parser.parse();
    let deps = new Map();
    let resolver = new Resolver(Object.assign({}, asset.options, {
      extensions: ['.styl', '.css']
    }));

    class ImportVisitor extends DepsResolver {
      visitImport(imported) {
        let path = imported.path.first.string;

        if (!deps.has(path)) {
          if (isGlob(path)) {
            deps.set(path, glob(resolve(dirname(filepath), path), {
              onlyFiles: true
            }).then(entries => Promise.all(entries.map(entry => resolver.resolve('./' + relative(dirname(filepath), entry), filepath)))));
          } else {
            deps.set(path, resolver.resolve(path, filepath));
          }
        }
      }

    }

    new ImportVisitor(ast, options).visit(ast); // Recursively process depdendencies, and return a map with all resolved paths.

    let res = new Map();
    yield Promise.all(Array.from(deps.entries()).map(
    /*#__PURE__*/
    function () {
      var _ref3 = (0, _asyncToGenerator2.default)(function* ([path, resolved]) {
        try {
          resolved = yield resolved;
          resolved = Array.isArray(resolved) ? resolved.map(r => r.path) : resolved.path;
        } catch (err) {
          resolved = null;
        }

        let found;

        if (resolved) {
          found = Array.isArray(resolved) ? resolved : [resolved];
          res.set(path, resolved);
        } else {
          // If we couldn't resolve, try the normal stylus resolver.
          // We just need to do this to keep track of the dependencies - stylus does the real work.
          // support optional .styl
          let originalPath = path;

          if (!/\.styl$/i.test(path)) {
            path += '.styl';
          }

          let paths = (options.paths || []).concat(dirname(filepath || '.'));
          found = utils.find(path, paths, filepath);

          if (!found) {
            found = utils.lookupIndex(originalPath, paths, filepath);
          }

          if (!found) {
            throw new Error('failed to locate file ' + originalPath);
          }
        } // Recursively process resolved files as well to get nested deps


        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = found[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            let resolved = _step2.value;

            if (!seen.has(resolved)) {
              asset.addDependency(resolved, {
                includedInParent: true
              });
              let code = yield fs.readFile(resolved, 'utf8');
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = (yield getDependencies(code, resolved, asset, options, seen))[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  let _step3$value = (0, _slicedToArray2.default)(_step3.value, 2),
                      path = _step3$value[0],
                      resolvedPath = _step3$value[1];

                  res.set(path, resolvedPath);
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                    _iterator3.return();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      });

      return function (_x8) {
        return _ref3.apply(this, arguments);
      };
    }()));
    return res;
  });
  return _getDependencies.apply(this, arguments);
}

function createEvaluator(_x5, _x6, _x7) {
  return _createEvaluator.apply(this, arguments);
}
/**
 * Puts the content of all given node blocks into the first one, essentially merging them.
 */


function _createEvaluator() {
  _createEvaluator = (0, _asyncToGenerator2.default)(function* (code, asset, options) {
    const deps = yield getDependencies(code, asset.name, asset, options);
    const Evaluator = yield localRequire('stylus/lib/visitor/evaluator', asset.name); // This is a custom stylus evaluator that extends stylus with support for the node
    // require resolution algorithm. It also adds all dependencies to the parcel asset
    // tree so the file watcher works correctly, etc.

    class CustomEvaluator extends Evaluator {
      visitImport(imported) {
        let node = this.visit(imported.path).first;
        let path = node.string;

        if (node.name !== 'url' && path && !URL_RE.test(path)) {
          let resolved = deps.get(path); // First try resolving using the node require resolution algorithm.
          // This allows stylus files in node_modules to be resolved properly.
          // If we find something, update the AST so stylus gets the absolute path to load later.

          if (resolved) {
            if (!Array.isArray(resolved)) {
              node.string = resolved;
            } else {
              // If the import resolves to multiple files (i.e. glob),
              // replace it with a separate import node for each file
              return mergeBlocks(resolved.map(resolvedPath => {
                node.string = resolvedPath;
                return super.visitImport(imported.clone());
              }));
            }
          }
        } // Done. Let stylus do its thing.


        return super.visitImport(imported);
      }

    }

    return CustomEvaluator;
  });
  return _createEvaluator.apply(this, arguments);
}

function mergeBlocks(blocks) {
  let finalBlock;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = blocks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      const block = _step.value;
      if (!finalBlock) finalBlock = block;else {
        block.nodes.forEach(node => finalBlock.push(node));
      }
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

  return finalBlock;
}

module.exports = StylusAsset;