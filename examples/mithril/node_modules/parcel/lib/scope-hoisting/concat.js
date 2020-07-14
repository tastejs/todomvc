"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

const _require = require('path'),
      relative = _require.relative;

const template = require('@babel/template').default;

const t = require('@babel/types');

const traverse = require('@babel/traverse').default;

const generate = require('@babel/generator').default;

const treeShake = require('./shake');

const mangleScope = require('./mangler');

const _require2 = require('./utils'),
      getName = _require2.getName,
      getIdentifier = _require2.getIdentifier;

const EXPORTS_RE = /^\$([^$]+)\$exports$/;
const ESMODULE_TEMPLATE = template(`$parcel$defineInteropFlag(EXPORTS);`);
const DEFAULT_INTEROP_TEMPLATE = template('var NAME = $parcel$interopDefault(MODULE)');
const THROW_TEMPLATE = template('$parcel$missingModule(MODULE)');
const REQUIRE_TEMPLATE = template('require(ID)');

module.exports = (packager, ast) => {
  let assets = packager.assets;
  let replacements = new Map();
  let imports = new Map();
  let referenced = new Set(); // Build a mapping of all imported identifiers to replace.

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = assets.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      let asset = _step.value;

      for (let name in asset.cacheData.imports) {
        let imp = asset.cacheData.imports[name];
        imports.set(name, [packager.resolveModule(asset.id, imp[0]), imp[1]]);
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

  function replaceExportNode(module, originalName, path) {
    let _packager$findExportM = packager.findExportModule(module.id, originalName, replacements),
        identifier = _packager$findExportM.identifier,
        name = _packager$findExportM.name,
        id = _packager$findExportM.id;

    let mod = assets.get(id);
    let node;

    if (identifier) {
      node = findSymbol(path, identifier);
    } // If the module is not in this bundle, create a `require` call for it.


    if (!node && !mod) {
      node = REQUIRE_TEMPLATE({
        ID: t.stringLiteral(id)
      }).expression;
      return interop(module, name, path, node);
    } // If this is an ES6 module, throw an error if we cannot resolve the module


    if (!node && !mod.cacheData.isCommonJS && mod.cacheData.isES6Module) {
      let relativePath = relative(packager.options.rootDir, mod.name);
      throw new Error(`${relativePath} does not export '${name}'`);
    } // If it is CommonJS, look for an exports object.


    if (!node && mod.cacheData.isCommonJS) {
      node = findSymbol(path, getName(mod, 'exports'));

      if (!node) {
        return null;
      }

      return interop(mod, name, path, node);
    }

    return node;
  }

  function findSymbol(path, symbol) {
    if (replacements.has(symbol)) {
      symbol = replacements.get(symbol);
    } // if the symbol is in the scope there is not need to remap it


    if (path.scope.getProgramParent().hasBinding(symbol)) {
      return t.identifier(symbol);
    }

    return null;
  }

  function interop(mod, originalName, path, node) {
    // Handle interop for default imports of CommonJS modules.
    if (mod.cacheData.isCommonJS && originalName === 'default') {
      let name = getName(mod, '$interop$default');

      if (!path.scope.getBinding(name)) {
        let _path$getStatementPar = path.getStatementParent().insertBefore(DEFAULT_INTEROP_TEMPLATE({
          NAME: t.identifier(name),
          MODULE: node
        })),
            _path$getStatementPar2 = (0, _slicedToArray2.default)(_path$getStatementPar, 1),
            decl = _path$getStatementPar2[0];

        let binding = path.scope.getBinding(getName(mod, 'exports'));

        if (binding) {
          binding.reference(decl.get('declarations.0.init'));
        }

        path.scope.registerDeclaration(decl);
      }

      return t.memberExpression(t.identifier(name), t.identifier('d'));
    } // if there is a CommonJS export return $id$exports.name


    if (originalName !== '*') {
      return t.memberExpression(node, t.identifier(originalName));
    }

    return node;
  }

  function isUnusedValue(path) {
    return path.parentPath.isExpressionStatement() || path.parentPath.isSequenceExpression() && (path.key !== path.container.length - 1 || isUnusedValue(path.parentPath));
  }

  traverse(ast, {
    CallExpression(path) {
      let _path$node = path.node,
          args = _path$node.arguments,
          callee = _path$node.callee;

      if (!t.isIdentifier(callee)) {
        return;
      } // each require('module') call gets replaced with $parcel$require(id, 'module')


      if (callee.name === '$parcel$require') {
        let _args = (0, _slicedToArray2.default)(args, 2),
            id = _args[0],
            source = _args[1];

        if (args.length !== 2 || !t.isStringLiteral(id) || !t.isStringLiteral(source)) {
          throw new Error('invariant: invalid signature, expected : $parcel$require(number, string)');
        }

        let asset = assets.get(id.value);
        let mod = packager.resolveModule(id.value, source.value);

        if (!mod) {
          if (asset.dependencies.get(source.value).optional) {
            path.replaceWith(THROW_TEMPLATE({
              MODULE: t.stringLiteral(source.value)
            }));
          } else {
            throw new Error(`Cannot find module "${source.value}" in asset ${id.value}`);
          }
        } else {
          let node;

          if (assets.get(mod.id)) {
            // Replace with nothing if the require call's result is not used.
            if (!isUnusedValue(path)) {
              let name = getName(mod, 'exports');
              node = t.identifier(replacements.get(name) || name); // Insert __esModule interop flag if the required module is an ES6 module with a default export.
              // This ensures that code generated by Babel and other tools works properly.

              if (asset.cacheData.isCommonJS && mod.cacheData.isES6Module && mod.cacheData.exports.default) {
                let binding = path.scope.getBinding(name);

                if (binding && !binding.path.getData('hasESModuleFlag')) {
                  if (binding.path.node.init) {
                    binding.path.getStatementParent().insertAfter(ESMODULE_TEMPLATE({
                      EXPORTS: name
                    }));
                  }

                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                    for (var _iterator2 = binding.constantViolations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      let path = _step2.value;
                      path.insertAfter(ESMODULE_TEMPLATE({
                        EXPORTS: name
                      }));
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

                  binding.path.setData('hasESModuleFlag', true);
                }
              }
            } // We need to wrap the module in a function when a require
            // call happens inside a non top-level scope, e.g. in a
            // function, if statement, or conditional expression.


            if (mod.cacheData.shouldWrap) {
              let call = t.callExpression(getIdentifier(mod, 'init'), []);
              node = node ? t.sequenceExpression([call, node]) : call;
            }
          } else {
            node = REQUIRE_TEMPLATE({
              ID: t.stringLiteral(mod.id)
            }).expression;
          }

          if (node) {
            path.replaceWith(node);
          } else {
            path.remove();
          }
        }
      } else if (callee.name === '$parcel$require$resolve') {
        let _args2 = (0, _slicedToArray2.default)(args, 2),
            id = _args2[0],
            source = _args2[1];

        if (args.length !== 2 || !t.isStringLiteral(id) || !t.isStringLiteral(source)) {
          throw new Error('invariant: invalid signature, expected : $parcel$require$resolve(number, string)');
        }

        let mapped = assets.get(id.value);
        let dep = mapped.dependencies.get(source.value);
        let mod = mapped.depAssets.get(dep);
        let bundles = mod.id;

        if (dep.dynamic && packager.bundle.childBundles.has(mod.parentBundle)) {
          bundles = [];
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = mod.parentBundle.siblingBundles[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              let child = _step3.value;

              if (!child.isEmpty && packager.options.bundleLoaders[child.type]) {
                bundles.push(packager.getBundleSpecifier(child));
              }
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

          bundles.push(packager.getBundleSpecifier(mod.parentBundle));
          bundles.push(mod.id);
        }

        path.replaceWith(t.valueToNode(bundles));
      }
    },

    VariableDeclarator: {
      exit(path) {
        // Replace references to declarations like `var x = require('x')`
        // with the final export identifier instead.
        // This allows us to potentially replace accesses to e.g. `x.foo` with
        // a variable like `$id$export$foo` later, avoiding the exports object altogether.
        let _path$node2 = path.node,
            id = _path$node2.id,
            init = _path$node2.init;

        if (!t.isIdentifier(init)) {
          return;
        }

        let match = init.name.match(EXPORTS_RE);

        if (!match) {
          return;
        } // Replace patterns like `var {x} = require('y')` with e.g. `$id$export$x`.


        if (t.isObjectPattern(id)) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = path.get('id.properties')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              let p = _step4.value;
              let _p$node = p.node,
                  computed = _p$node.computed,
                  key = _p$node.key,
                  value = _p$node.value;

              if (computed || !t.isIdentifier(key) || !t.isIdentifier(value)) {
                continue;
              }

              let _packager$findExportM2 = packager.findExportModule(match[1], key.name, replacements),
                  identifier = _packager$findExportM2.identifier;

              if (identifier) {
                replace(value.name, identifier, p);
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

          if (id.properties.length === 0) {
            path.remove();
          }
        } else if (t.isIdentifier(id)) {
          replace(id.name, init.name, path);
        }

        function replace(id, init, path) {
          let binding = path.scope.getBinding(id);

          if (!binding.constant) {
            return;
          }

          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = binding.referencePaths[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              let ref = _step5.value;
              ref.replaceWith(t.identifier(init));
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

          replacements.set(id, init);
          path.remove();
        }
      }

    },
    MemberExpression: {
      exit(path) {
        if (!path.isReferenced()) {
          return;
        }

        let _path$node3 = path.node,
            object = _path$node3.object,
            property = _path$node3.property,
            computed = _path$node3.computed;

        if (!(t.isIdentifier(object) && (t.isIdentifier(property) && !computed || t.isStringLiteral(property)))) {
          return;
        }

        let match = object.name.match(EXPORTS_RE); // If it's a $id$exports.name expression.

        if (match) {
          let name = t.isIdentifier(property) ? property.name : property.value;

          let _packager$findExportM3 = packager.findExportModule(match[1], name, replacements),
              identifier = _packager$findExportM3.identifier; // Check if $id$export$name exists and if so, replace the node by it.


          if (identifier) {
            path.replaceWith(t.identifier(identifier));
          }
        }
      }

    },

    ReferencedIdentifier(path) {
      let name = path.node.name;

      if (typeof name !== 'string') {
        return;
      }

      if (imports.has(name)) {
        let imp = imports.get(name);
        let node = replaceExportNode(imp[0], imp[1], path); // If the export does not exist, replace with an empty object.

        if (!node) {
          node = t.objectExpression([]);
        }

        path.replaceWith(node);
        return;
      }

      let match = name.match(EXPORTS_RE);

      if (match) {
        referenced.add(name);
      } // If it's an undefined $id$exports identifier.


      if (match && !path.scope.hasBinding(name)) {
        path.replaceWith(t.objectExpression([]));
      }
    },

    Program: {
      // A small optimization to remove unused CommonJS exports as sometimes Uglify doesn't remove them.
      exit(path) {
        treeShake(path.scope);

        if (packager.options.minify) {
          mangleScope(path.scope);
        }
      }

    }
  });
  let opts = {
    sourceMaps: packager.options.sourceMaps,
    sourceFileName: packager.bundle.name,
    minified: packager.options.minify,
    comments: !packager.options.minify
  };
  return generate(ast, opts);
};