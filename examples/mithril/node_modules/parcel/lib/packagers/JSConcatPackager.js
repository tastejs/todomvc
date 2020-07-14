"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Packager = require('./Packager');

const path = require('path');

const concat = require('../scope-hoisting/concat');

const urlJoin = require('../utils/urlJoin');

const getExisting = require('../utils/getExisting');

const walk = require('babylon-walk');

const babylon = require('@babel/parser');

const t = require('@babel/types');

const _require = require('../scope-hoisting/utils'),
      getName = _require.getName,
      getIdentifier = _require.getIdentifier;

const prelude = getExisting(path.join(__dirname, '../builtins/prelude2.min.js'), path.join(__dirname, '../builtins/prelude2.js'));
const helpers = getExisting(path.join(__dirname, '../builtins/helpers.min.js'), path.join(__dirname, '../builtins/helpers.js'));

class JSConcatPackager extends Packager {
  start() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this.addedAssets = new Set();
      _this.assets = new Map();
      _this.exposedModules = new Set();
      _this.externalModules = new Set();
      _this.size = 0;
      _this.needsPrelude = false;
      _this.statements = [];
      _this.assetPostludes = new Map();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this.bundle.assets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let asset = _step.value;
          // If this module is referenced by another JS bundle, it needs to be exposed externally.
          let isExposed = !Array.from(asset.parentDeps).every(dep => {
            let depAsset = _this.bundler.loadedAssets.get(dep.parent);

            return _this.bundle.assets.has(depAsset) || depAsset.type !== 'js';
          });

          if (isExposed || _this.bundle.entryAsset === asset && _this.bundle.parentBundle && _this.bundle.parentBundle.childBundles.size !== 1) {
            _this.exposedModules.add(asset);

            _this.needsPrelude = true;
          }

          _this.assets.set(asset.id, asset);

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = asset.depAssets.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              let mod = _step2.value;

              if (!_this.bundle.assets.has(mod) && _this.options.bundleLoaders[asset.type]) {
                _this.needsPrelude = true;
                break;
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

      if (_this.bundle.entryAsset) {
        _this.markUsedExports(_this.bundle.entryAsset);
      }

      if (_this.needsPrelude) {
        if (_this.bundle.entryAsset && _this.options.bundleLoaders[_this.bundle.entryAsset.type]) {
          _this.exposedModules.add(_this.bundle.entryAsset);
        }
      }

      _this.write(helpers.minified);
    })();
  }

  write(string) {
    this.statements.push(...this.parse(string));
  }

  getSize() {
    return this.size;
  }

  markUsedExports(asset) {
    if (asset.usedExports) {
      return;
    }

    asset.usedExports = new Set();

    for (let identifier in asset.cacheData.imports) {
      let _asset$cacheData$impo = (0, _slicedToArray2.default)(asset.cacheData.imports[identifier], 2),
          source = _asset$cacheData$impo[0],
          name = _asset$cacheData$impo[1];

      let dep = asset.depAssets.get(asset.dependencies.get(source));

      if (dep) {
        if (name === '*') {
          this.markUsedExports(dep);
        }

        this.markUsed(dep, name);
      }
    }
  }

  markUsed(mod, name) {
    let _this$findExportModul = this.findExportModule(mod.id, name),
        id = _this$findExportModul.id;

    mod = this.assets.get(id);

    if (!mod) {
      return;
    }

    let exp = mod.cacheData.exports[name];

    if (Array.isArray(exp)) {
      let depMod = mod.depAssets.get(mod.dependencies.get(exp[0]));
      return this.markUsed(depMod, exp[1]);
    }

    this.markUsedExports(mod);
    mod.usedExports.add(name);
  }

  getExportIdentifier(asset) {
    let id = getName(asset, 'exports');

    if (this.shouldWrap(asset)) {
      return `(${getName(asset, 'init')}(), ${id})`;
    }

    return id;
  }

  addAsset(asset) {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this2.addedAssets.has(asset)) {
        return;
      }

      _this2.addedAssets.add(asset);

      let js = asset.generated.js; // If the asset has no side effects according to the its package's sideEffects flag,
      // and there are no used exports marked, exclude the asset from the bundle.

      if (asset.cacheData.sideEffects === false && (!asset.usedExports || asset.usedExports.size === 0)) {
        return;
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = asset.depAssets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          let _step3$value = (0, _slicedToArray2.default)(_step3.value, 2),
              dep = _step3$value[0],
              mod = _step3$value[1];

          if (dep.dynamic) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = mod.parentBundle.siblingBundles[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                let child = _step4.value;

                if (!child.isEmpty) {
                  yield _this2.addBundleLoader(child.type, asset);
                }
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            yield _this2.addBundleLoader(mod.type, asset, true);
          } else {
            // If the dep isn't in this bundle, add it to the list of external modules to preload.
            // Only do this if this is the root JS bundle, otherwise they will have already been
            // loaded in parallel with this bundle as part of a dynamic import.
            if (!_this2.bundle.assets.has(mod) && (!_this2.bundle.parentBundle || _this2.bundle.parentBundle.type !== 'js') && _this2.options.bundleLoaders[mod.type]) {
              _this2.externalModules.add(mod);

              yield _this2.addBundleLoader(mod.type, asset);
            }
          }
        } // if (this.bundle.entryAsset === asset && this.externalModules.size > 0) {
        //   js = `
        //     function $parcel$entry() {
        //       ${js.trim()}
        //     }
        //   `;
        // }
        // js = js.trim() + '\n';

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

      _this2.size += js.length;
    })();
  }

  shouldWrap(asset) {
    if (!asset) {
      return false;
    }

    if (asset.cacheData.shouldWrap != null) {
      return asset.cacheData.shouldWrap;
    } // Set to false initially so circular deps work


    asset.cacheData.shouldWrap = false; // We need to wrap if any of the deps are marked by the hoister, e.g.
    // when the dep is required inside a function or conditional.
    // We also need to wrap if any of the parents are wrapped - transitive requires
    // shouldn't be evaluated until their parents are.

    let shouldWrap = [...asset.parentDeps].some(dep => dep.shouldWrap || this.shouldWrap(this.bundler.loadedAssets.get(dep.parent)));
    asset.cacheData.shouldWrap = shouldWrap;
    return shouldWrap;
  }

  addDeps(asset, included) {
    if (!this.bundle.assets.has(asset) || included.has(asset)) {
      return [];
    }

    included.add(asset);
    let depAsts = new Map();
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = asset.depAssets.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        let depAsset = _step5.value;

        if (!depAsts.has(depAsset)) {
          let depAst = this.addDeps(depAsset, included);
          depAsts.set(depAsset, depAst);
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    let statements;

    if (asset.cacheData.sideEffects === false && (!asset.usedExports || asset.usedExports.size === 0)) {
      statements = [];
    } else {
      statements = this.parse(asset.generated.js, asset.name);
    }

    if (this.shouldWrap(asset)) {
      statements = this.wrapModule(asset, statements);
    }

    if (statements[0]) {
      if (!statements[0].leadingComments) {
        statements[0].leadingComments = [];
      }

      statements[0].leadingComments.push({
        type: 'CommentLine',
        value: ` ASSET: ${path.relative(this.options.rootDir, asset.name)}`
      });
    }

    let statementIndices = new Map();

    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i];

      if (t.isExpressionStatement(statement)) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = this.findRequires(asset, statement)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            let depAsset = _step6.value;

            if (!statementIndices.has(depAsset)) {
              statementIndices.set(depAsset, i);
            }
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }
      }
    }

    let reverseDeps = [...asset.depAssets.values()].reverse();
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = reverseDeps[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        let dep = _step7.value;
        let index = statementIndices.has(dep) ? statementIndices.get(dep) : 0;
        statements.splice(index, 0, ...depAsts.get(dep));
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }

    if (this.assetPostludes.has(asset)) {
      statements.push(...this.parse(this.assetPostludes.get(asset)));
    }

    return statements;
  }

  wrapModule(asset, statements) {
    let body = [];
    let decls = [];
    let fns = [];
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = statements[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        let node = _step8.value;

        // Hoist all declarations out of the function wrapper
        // so that they can be referenced by other modules directly.
        if (t.isVariableDeclaration(node)) {
          var _iteratorNormalCompletion9 = true;
          var _didIteratorError9 = false;
          var _iteratorError9 = undefined;

          try {
            for (var _iterator9 = node.declarations[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              let decl = _step9.value;

              if (t.isObjectPattern(decl.id) || t.isArrayPattern(decl.id)) {
                for (var _i = 0, _Object$values = Object.values(t.getBindingIdentifiers(decl.id)); _i < _Object$values.length; _i++) {
                  let prop = _Object$values[_i];
                  decls.push(t.variableDeclarator(prop));
                }

                if (decl.init) {
                  body.push(t.expressionStatement(t.assignmentExpression('=', decl.id, decl.init)));
                }
              } else {
                decls.push(t.variableDeclarator(decl.id));

                if (decl.init) {
                  body.push(t.expressionStatement(t.assignmentExpression('=', t.identifier(decl.id.name), decl.init)));
                }
              }
            }
          } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
                _iterator9.return();
              }
            } finally {
              if (_didIteratorError9) {
                throw _iteratorError9;
              }
            }
          }
        } else if (t.isFunctionDeclaration(node)) {
          // Function declarations can be hoisted out of the module initialization function
          fns.push(node);
        } else if (t.isClassDeclaration(node)) {
          // Class declarations are not hoisted. We declare a variable outside the
          // function convert to a class expression assignment.
          decls.push(t.variableDeclarator(t.identifier(node.id.name)));
          body.push(t.expressionStatement(t.assignmentExpression('=', t.identifier(node.id.name), t.toExpression(node))));
        } else {
          body.push(node);
        }
      }
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
          _iterator8.return();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
      }
    }

    let executed = getName(asset, 'executed');
    decls.push(t.variableDeclarator(t.identifier(executed), t.booleanLiteral(false)));
    let init = t.functionDeclaration(getIdentifier(asset, 'init'), [], t.blockStatement([t.ifStatement(t.identifier(executed), t.returnStatement()), t.expressionStatement(t.assignmentExpression('=', t.identifier(executed), t.booleanLiteral(true))), ...body]));
    return [t.variableDeclaration('var', decls), ...fns, init];
  }

  parse(code, filename) {
    let ast = babylon.parse(code, {
      sourceFilename: filename,
      allowReturnOutsideFunction: true
    });
    return ast.program.body;
  }

  findRequires(asset, ast) {
    let result = [];
    walk.simple(ast, {
      CallExpression(node) {
        let args = node.arguments,
            callee = node.callee;

        if (!t.isIdentifier(callee)) {
          return;
        }

        if (callee.name === '$parcel$require') {
          result.push(asset.depAssets.get(asset.dependencies.get(args[1].value)));
        }
      }

    });
    return result;
  }

  getBundleSpecifier(bundle) {
    let name = path.relative(path.dirname(this.bundle.name), bundle.name);

    if (bundle.entryAsset) {
      return [name, bundle.entryAsset.id];
    }

    return name;
  }

  addAssetToBundle(asset) {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this3.bundle.assets.has(asset)) {
        return;
      }

      _this3.assets.set(asset.id, asset);

      _this3.bundle.addAsset(asset);

      if (!asset.parentBundle) {
        asset.parentBundle = _this3.bundle;
      } // Add all dependencies as well


      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = asset.depAssets.values()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          let child = _step10.value;
          yield _this3.addAssetToBundle(child, _this3.bundle);
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }

      yield _this3.addAsset(asset);
    })();
  }

  addBundleLoader(bundleType, parentAsset, dynamic) {
    var _this4 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let loader = _this4.options.bundleLoaders[bundleType];

      if (!loader) {
        return;
      }

      let bundleLoader = _this4.bundler.loadedAssets.get(require.resolve('../builtins/bundle-loader'));

      if (!bundleLoader && !dynamic) {
        bundleLoader = yield _this4.bundler.getAsset('_bundle_loader');
      }

      if (bundleLoader) {
        // parentAsset.depAssets.set({name: '_bundle_loader'}, bundleLoader);
        yield _this4.addAssetToBundle(bundleLoader);
      } else {
        return;
      }

      let target = _this4.options.target === 'node' ? 'node' : 'browser';
      let asset = yield _this4.bundler.getAsset(loader[target]);

      if (!_this4.bundle.assets.has(asset)) {
        let dep = {
          name: asset.name
        };
        asset.parentDeps.add(dep);
        parentAsset.dependencies.set(dep.name, dep);
        parentAsset.depAssets.set(dep, asset);

        _this4.assetPostludes.set(asset, `${_this4.getExportIdentifier(bundleLoader)}.register(${JSON.stringify(bundleType)},${_this4.getExportIdentifier(asset)});\n`);

        yield _this4.addAssetToBundle(asset);
      }
    })();
  }

  end() {
    var _this5 = this,
        _superprop_callWrite = (..._args) => super.write(..._args),
        _superprop_callEnd = (..._args2) => super.end(..._args2);

    return (0, _asyncToGenerator2.default)(function* () {
      let included = new Set();
      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;
      var _iteratorError11 = undefined;

      try {
        for (var _iterator11 = _this5.bundle.assets[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
          let asset = _step11.value;

          _this5.statements.push(..._this5.addDeps(asset, included));
        } // Preload external modules before running entry point if needed

      } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
            _iterator11.return();
          }
        } finally {
          if (_didIteratorError11) {
            throw _iteratorError11;
          }
        }
      }

      if (_this5.externalModules.size > 0) {
        let bundleLoader = _this5.bundler.loadedAssets.get(require.resolve('../builtins/bundle-loader'));

        let preload = [];
        var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {
          for (var _iterator12 = _this5.externalModules[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
            let mod = _step12.value;
            // Find the bundle that has the module as its entry point
            let bundle = Array.from(mod.bundles).find(b => b.entryAsset === mod);

            if (bundle) {
              preload.push([path.basename(bundle.name), mod.id]);
            }
          }
        } catch (err) {
          _didIteratorError12 = true;
          _iteratorError12 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
              _iterator12.return();
            }
          } finally {
            if (_didIteratorError12) {
              throw _iteratorError12;
            }
          }
        }

        let loads = `${_this5.getExportIdentifier(bundleLoader)}.load(${JSON.stringify(preload)})`;

        if (_this5.bundle.entryAsset) {
          loads += '.then($parcel$entry)';
        }

        loads += ';';

        _this5.write(loads);
      }

      let entryExports = _this5.bundle.entryAsset && _this5.getExportIdentifier(_this5.bundle.entryAsset);

      if (entryExports && _this5.bundle.entryAsset.generated.js.includes(entryExports)) {
        _this5.write(`
        if (typeof exports === "object" && typeof module !== "undefined") {
          // CommonJS
          module.exports = ${entryExports};
        } else if (typeof define === "function" && define.amd) {
          // RequireJS
          define(function () {
            return ${entryExports};
          });
        } ${_this5.options.global ? `else {
          // <script>
          this[${JSON.stringify(_this5.options.global)}] = ${entryExports};
        }` : ''}
      `);
      }

      if (_this5.needsPrelude) {
        let exposed = [];
        let prepareModule = [];
        var _iteratorNormalCompletion13 = true;
        var _didIteratorError13 = false;
        var _iteratorError13 = undefined;

        try {
          for (var _iterator13 = _this5.exposedModules[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            let m = _step13.value;

            if (m.cacheData.isES6Module) {
              prepareModule.push(`${_this5.getExportIdentifier(m)}.__esModule = true;`);
            }

            exposed.push(`"${m.id}": ${_this5.getExportIdentifier(m)}`);
          }
        } catch (err) {
          _didIteratorError13 = true;
          _iteratorError13 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion13 && _iterator13.return != null) {
              _iterator13.return();
            }
          } finally {
            if (_didIteratorError13) {
              throw _iteratorError13;
            }
          }
        }

        _this5.write(`
        ${prepareModule.join('\n')}
        return {${exposed.join(', ')}};
      `);
      }

      try {
        let ast = t.file(t.program(_this5.statements));

        let _concat = concat(_this5, ast),
            output = _concat.code;

        if (!_this5.options.minify) {
          output = '\n' + output + '\n';
        }

        let preludeCode = _this5.options.minify ? prelude.minified : prelude.source;

        if (_this5.needsPrelude) {
          output = preludeCode + '(function (require) {' + output + '});';
        } else {
          output = '(function () {' + output + '})();';
        }

        _this5.size = output.length;
        let sourceMaps = _this5.options.sourceMaps;

        if (sourceMaps) {
          // Add source map url if a map bundle exists
          let mapBundle = _this5.bundle.siblingBundlesMap.get('map');

          if (mapBundle) {
            let mapUrl = urlJoin(_this5.options.publicURL, path.basename(mapBundle.name));
            output += `\n//# sourceMappingURL=${mapUrl}`;
          }
        }

        yield _superprop_callWrite(output);
      } catch (e) {
        throw e;
      } finally {
        yield _superprop_callEnd();
      }
    })();
  }

  resolveModule(id, name) {
    let module = this.assets.get(id);
    return module.depAssets.get(module.dependencies.get(name));
  }

  findExportModule(id, name, replacements) {
    let asset = this.assets.get(id);
    let exp = asset && Object.prototype.hasOwnProperty.call(asset.cacheData.exports, name) ? asset.cacheData.exports[name] : null; // If this is a re-export, find the original module.

    if (Array.isArray(exp)) {
      let mod = this.resolveModule(id, exp[0]);
      return this.findExportModule(mod.id, exp[1], replacements);
    } // If this module exports wildcards, resolve the original module.
    // Default exports are excluded from wildcard exports.


    let wildcards = asset && asset.cacheData.wildcards;

    if (wildcards && name !== 'default' && name !== '*') {
      var _iteratorNormalCompletion14 = true;
      var _didIteratorError14 = false;
      var _iteratorError14 = undefined;

      try {
        for (var _iterator14 = wildcards[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
          let source = _step14.value;
          let mod = this.resolveModule(id, source);
          let m = this.findExportModule(mod.id, name, replacements);

          if (m.identifier) {
            return m;
          }
        }
      } catch (err) {
        _didIteratorError14 = true;
        _iteratorError14 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion14 && _iterator14.return != null) {
            _iterator14.return();
          }
        } finally {
          if (_didIteratorError14) {
            throw _iteratorError14;
          }
        }
      }
    } // If this is a wildcard import, resolve to the exports object.


    if (asset && name === '*') {
      exp = getName(asset, 'exports');
    }

    if (replacements && replacements.has(exp)) {
      exp = replacements.get(exp);
    }

    return {
      identifier: exp,
      name,
      id
    };
  }

}

module.exports = JSConcatPackager;