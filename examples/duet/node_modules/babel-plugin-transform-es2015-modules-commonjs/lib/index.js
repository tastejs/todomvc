/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _symbol = require("babel-runtime/core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

exports.default = function () {
  var REASSIGN_REMAP_SKIP = /*istanbul ignore next*/(0, _symbol2.default)();

  var reassignmentVisitor = { /*istanbul ignore next*/
    ReferencedIdentifier: function ReferencedIdentifier(path) {
      var name = path.node.name;
      var remap = this.remaps[name];
      if (!remap) return;

      // redeclared in this scope
      if (this.scope.getBinding(name) !== path.scope.getBinding(name)) return;

      if (path.parentPath.isCallExpression({ callee: path.node })) {
        path.replaceWith(t.sequenceExpression([t.numericLiteral(0), remap]));
      } else {
        path.replaceWith(remap);
      }
      this.requeueInParent(path);
    },
    /*istanbul ignore next*/AssignmentExpression: function AssignmentExpression(path) {
      var node = path.node;
      if (node[REASSIGN_REMAP_SKIP]) return;

      var left = path.get("left");
      if (!left.isIdentifier()) return;

      var name = left.node.name;
      var exports = this.exports[name];
      if (!exports) return;

      // redeclared in this scope
      if (this.scope.getBinding(name) !== path.scope.getBinding(name)) return;

      node[REASSIGN_REMAP_SKIP] = true;

      for ( /*istanbul ignore next*/var _iterator = exports, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
        /*istanbul ignore next*/
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var reid = _ref;

        node = buildExportsAssignment(reid, node).expression;
      }

      path.replaceWith(node);
      this.requeueInParent(path);
    },
    /*istanbul ignore next*/UpdateExpression: function UpdateExpression(path) {
      var arg = path.get("argument");
      if (!arg.isIdentifier()) return;

      var name = arg.node.name;
      var exports = this.exports[name];
      if (!exports) return;

      // redeclared in this scope
      if (this.scope.getBinding(name) !== path.scope.getBinding(name)) return;

      var node = t.assignmentExpression(path.node.operator[0] + "=", arg.node, t.numericLiteral(1));

      if (path.parentPath.isExpressionStatement() && !path.isCompletionRecord() || path.node.prefix) {
        path.replaceWith(node);
        this.requeueInParent(path);
        return;
      }

      var nodes = [];
      nodes.push(node);

      var operator = /*istanbul ignore next*/void 0;
      if (path.node.operator === "--") {
        operator = "+";
      } else {
        // "++"
        operator = "-";
      }
      nodes.push(t.binaryExpression(operator, arg.node, t.numericLiteral(1)));

      var newPaths = path.replaceWithMultiple(t.sequenceExpression(nodes));
      for ( /*istanbul ignore next*/var _iterator2 = newPaths, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) /*istanbul ignore next*/{
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var newPath = _ref2;
        this.requeueInParent(newPath);
      }
    }
  };

  return {
    inherits: require("babel-plugin-transform-strict-mode"),

    visitor: { /*istanbul ignore next*/
      ThisExpression: function ThisExpression(path, state) {
        // If other plugins run after this plugin's Program#exit handler, we allow them to
        // insert top-level `this` values. This allows the AMD and UMD plugins to
        // function properly.
        if (this.ranCommonJS) return;

        if (state.opts.allowTopLevelThis !== true && !path.findParent(function (path) /*istanbul ignore next*/{
          return !path.is("shadow") && THIS_BREAK_KEYS.indexOf(path.type) >= 0;
        })) {
          path.replaceWith(t.identifier("undefined"));
        }
      },


      Program: { /*istanbul ignore next*/
        exit: function exit(path) {
          this.ranCommonJS = true;

          var strict = !!this.opts.strict;

          /*istanbul ignore next*/var scope = path.scope;

          // rename these commonjs variables if they're declared in the file

          scope.rename("module");
          scope.rename("exports");
          scope.rename("require");

          var hasExports = false;
          var hasImports = false;

          var body = path.get("body");
          var imports = /*istanbul ignore next*/(0, _create2.default)(null);
          var exports = /*istanbul ignore next*/(0, _create2.default)(null);

          var nonHoistedExportNames = /*istanbul ignore next*/(0, _create2.default)(null);

          var topNodes = [];
          var remaps = /*istanbul ignore next*/(0, _create2.default)(null);

          var requires = /*istanbul ignore next*/(0, _create2.default)(null);

          function addRequire(source, blockHoist) {
            var cached = requires[source];
            if (cached) return cached;

            var ref = path.scope.generateUidIdentifier( /*istanbul ignore next*/(0, _path2.basename)(source, /*istanbul ignore next*/(0, _path2.extname)(source)));

            var varDecl = t.variableDeclaration("var", [t.variableDeclarator(ref, buildRequire(t.stringLiteral(source)).expression)]);

            // Copy location from the original import statement for sourcemap
            // generation.
            if (imports[source]) {
              varDecl.loc = imports[source].loc;
            }

            if (typeof blockHoist === "number" && blockHoist > 0) {
              varDecl._blockHoist = blockHoist;
            }

            topNodes.push(varDecl);

            return requires[source] = ref;
          }

          function addTo(obj, key, arr) {
            var existing = obj[key] || [];
            obj[key] = existing.concat(arr);
          }

          for ( /*istanbul ignore next*/var _iterator3 = body, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3.default)(_iterator3);;) {
            /*istanbul ignore next*/
            var _ref3;

            if (_isArray3) {
              if (_i3 >= _iterator3.length) break;
              _ref3 = _iterator3[_i3++];
            } else {
              _i3 = _iterator3.next();
              if (_i3.done) break;
              _ref3 = _i3.value;
            }

            var _path = _ref3;

            if (_path.isExportDeclaration()) {
              hasExports = true;

              var specifiers = [].concat(_path.get("declaration"), _path.get("specifiers"));
              for ( /*istanbul ignore next*/var _iterator5 = specifiers, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : (0, _getIterator3.default)(_iterator5);;) {
                /*istanbul ignore next*/
                var _ref5;

                if (_isArray5) {
                  if (_i5 >= _iterator5.length) break;
                  _ref5 = _iterator5[_i5++];
                } else {
                  _i5 = _iterator5.next();
                  if (_i5.done) break;
                  _ref5 = _i5.value;
                }

                var _specifier2 = _ref5;

                var ids = _specifier2.getBindingIdentifiers();
                if (ids.__esModule) {
                  throw _specifier2.buildCodeFrameError("Illegal export \"__esModule\"");
                }
              }
            }

            if (_path.isImportDeclaration()) {
              /*istanbul ignore next*/
              var _importsEntry$specifi;

              hasImports = true;

              var key = _path.node.source.value;
              var importsEntry = imports[key] || {
                specifiers: [],
                maxBlockHoist: 0,
                loc: _path.node.loc
              };

              /*istanbul ignore next*/(_importsEntry$specifi = importsEntry.specifiers).push. /*istanbul ignore next*/apply( /*istanbul ignore next*/_importsEntry$specifi, _path.node.specifiers);

              if (typeof _path.node._blockHoist === "number") {
                importsEntry.maxBlockHoist = Math.max(_path.node._blockHoist, importsEntry.maxBlockHoist);
              }

              imports[key] = importsEntry;

              _path.remove();
            } else if (_path.isExportDefaultDeclaration()) {
              var declaration = _path.get("declaration");
              if (declaration.isFunctionDeclaration()) {
                var id = declaration.node.id;
                var defNode = t.identifier("default");
                if (id) {
                  addTo(exports, id.name, defNode);
                  topNodes.push(buildExportsAssignment(defNode, id));
                  _path.replaceWith(declaration.node);
                } else {
                  topNodes.push(buildExportsAssignment(defNode, t.toExpression(declaration.node)));
                  _path.remove();
                }
              } else if (declaration.isClassDeclaration()) {
                var _id = declaration.node.id;
                var _defNode = t.identifier("default");
                if (_id) {
                  addTo(exports, _id.name, _defNode);
                  _path.replaceWithMultiple([declaration.node, buildExportsAssignment(_defNode, _id)]);
                } else {
                  _path.replaceWith(buildExportsAssignment(_defNode, t.toExpression(declaration.node)));
                }
              } else {
                _path.replaceWith(buildExportsAssignment(t.identifier("default"), declaration.node));

                // Manualy re-queue `export default foo;` expressions so that the ES3 transform
                // has an opportunity to convert them. Ideally this would happen automatically from the
                // replaceWith above. See T7166 for more info.
                _path.parentPath.requeue(_path.get("expression.left"));
              }
            } else if (_path.isExportNamedDeclaration()) {
              var _declaration = _path.get("declaration");
              if (_declaration.node) {
                if (_declaration.isFunctionDeclaration()) {
                  var _id2 = _declaration.node.id;
                  addTo(exports, _id2.name, _id2);
                  topNodes.push(buildExportsAssignment(_id2, _id2));
                  _path.replaceWith(_declaration.node);
                } else if (_declaration.isClassDeclaration()) {
                  var _id3 = _declaration.node.id;
                  addTo(exports, _id3.name, _id3);
                  _path.replaceWithMultiple([_declaration.node, buildExportsAssignment(_id3, _id3)]);
                  nonHoistedExportNames[_id3.name] = true;
                } else if (_declaration.isVariableDeclaration()) {
                  var declarators = _declaration.get("declarations");
                  for ( /*istanbul ignore next*/var _iterator6 = declarators, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : (0, _getIterator3.default)(_iterator6);;) {
                    /*istanbul ignore next*/
                    var _ref6;

                    if (_isArray6) {
                      if (_i6 >= _iterator6.length) break;
                      _ref6 = _iterator6[_i6++];
                    } else {
                      _i6 = _iterator6.next();
                      if (_i6.done) break;
                      _ref6 = _i6.value;
                    }

                    var decl = _ref6;

                    var _id4 = decl.get("id");

                    var init = decl.get("init");
                    if (!init.node) init.replaceWith(t.identifier("undefined"));

                    if (_id4.isIdentifier()) {
                      addTo(exports, _id4.node.name, _id4.node);
                      init.replaceWith(buildExportsAssignment(_id4.node, init.node).expression);
                      nonHoistedExportNames[_id4.node.name] = true;
                    } else {
                      // todo
                    }
                  }
                  _path.replaceWith(_declaration.node);
                }
                continue;
              }

              var _specifiers = _path.get("specifiers");
              if (_specifiers.length) {
                var nodes = [];
                var _source = _path.node.source;
                if (_source) {
                  var ref = addRequire(_source.value, _path.node._blockHoist);

                  for ( /*istanbul ignore next*/var _iterator7 = _specifiers, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : (0, _getIterator3.default)(_iterator7);;) {
                    /*istanbul ignore next*/
                    var _ref7;

                    if (_isArray7) {
                      if (_i7 >= _iterator7.length) break;
                      _ref7 = _iterator7[_i7++];
                    } else {
                      _i7 = _iterator7.next();
                      if (_i7.done) break;
                      _ref7 = _i7.value;
                    }

                    var _specifier3 = _ref7;

                    if (_specifier3.isExportNamespaceSpecifier()) {
                      // todo
                    } else if (_specifier3.isExportDefaultSpecifier()) {
                        // todo
                      } else if (_specifier3.isExportSpecifier()) {
                          if (_specifier3.node.local.name === "default") {
                            topNodes.push(buildExportsFrom(t.stringLiteral(_specifier3.node.exported.name), t.memberExpression(t.callExpression(this.addHelper("interopRequireDefault"), [ref]), _specifier3.node.local)));
                          } else {
                            topNodes.push(buildExportsFrom(t.stringLiteral(_specifier3.node.exported.name), t.memberExpression(ref, _specifier3.node.local)));
                          }
                          nonHoistedExportNames[_specifier3.node.exported.name] = true;
                        }
                  }
                } else {
                  for ( /*istanbul ignore next*/var _iterator8 = _specifiers, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : (0, _getIterator3.default)(_iterator8);;) {
                    /*istanbul ignore next*/
                    var _ref8;

                    if (_isArray8) {
                      if (_i8 >= _iterator8.length) break;
                      _ref8 = _iterator8[_i8++];
                    } else {
                      _i8 = _iterator8.next();
                      if (_i8.done) break;
                      _ref8 = _i8.value;
                    }

                    var _specifier4 = _ref8;

                    if (_specifier4.isExportSpecifier()) {
                      addTo(exports, _specifier4.node.local.name, _specifier4.node.exported);
                      nonHoistedExportNames[_specifier4.node.exported.name] = true;
                      nodes.push(buildExportsAssignment(_specifier4.node.exported, _specifier4.node.local));
                    }
                  }
                }
                _path.replaceWithMultiple(nodes);
              }
            } else if (_path.isExportAllDeclaration()) {
              var exportNode = buildExportAll({
                OBJECT: addRequire(_path.node.source.value, _path.node._blockHoist)
              });
              exportNode.loc = _path.node.loc;
              topNodes.push(exportNode);
              _path.remove();
            }
          }

          for (var source in imports) {
            /*istanbul ignore next*/var _imports$source = imports[source];
            /*istanbul ignore next*/var specifiers = _imports$source.specifiers;
            /*istanbul ignore next*/var maxBlockHoist = _imports$source.maxBlockHoist;

            if (specifiers.length) {
              var uid = addRequire(source, maxBlockHoist);

              var wildcard = /*istanbul ignore next*/void 0;

              for (var i = 0; i < specifiers.length; i++) {
                var specifier = specifiers[i];
                if (t.isImportNamespaceSpecifier(specifier)) {
                  if (strict) {
                    remaps[specifier.local.name] = uid;
                  } else {
                    var varDecl = t.variableDeclaration("var", [t.variableDeclarator(specifier.local, t.callExpression(this.addHelper("interopRequireWildcard"), [uid]))]);

                    if (maxBlockHoist > 0) {
                      varDecl._blockHoist = maxBlockHoist;
                    }

                    topNodes.push(varDecl);
                  }
                  wildcard = specifier.local;
                } else if (t.isImportDefaultSpecifier(specifier)) {
                  specifiers[i] = t.importSpecifier(specifier.local, t.identifier("default"));
                }
              }

              for ( /*istanbul ignore next*/var _iterator4 = specifiers, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : (0, _getIterator3.default)(_iterator4);;) {
                /*istanbul ignore next*/
                var _ref4;

                if (_isArray4) {
                  if (_i4 >= _iterator4.length) break;
                  _ref4 = _iterator4[_i4++];
                } else {
                  _i4 = _iterator4.next();
                  if (_i4.done) break;
                  _ref4 = _i4.value;
                }

                var _specifier = _ref4;

                if (t.isImportSpecifier(_specifier)) {
                  var target = uid;
                  if (_specifier.imported.name === "default") {
                    if (wildcard) {
                      target = wildcard;
                    } else {
                      target = wildcard = path.scope.generateUidIdentifier(uid.name);
                      var _varDecl = t.variableDeclaration("var", [t.variableDeclarator(target, t.callExpression(this.addHelper("interopRequireDefault"), [uid]))]);

                      if (maxBlockHoist > 0) {
                        _varDecl._blockHoist = maxBlockHoist;
                      }

                      topNodes.push(_varDecl);
                    }
                  }
                  remaps[_specifier.local.name] = t.memberExpression(target, t.cloneWithoutLoc(_specifier.imported));
                }
              }
            } else {
              // bare import
              var requireNode = buildRequire(t.stringLiteral(source));
              requireNode.loc = imports[source].loc;
              topNodes.push(requireNode);
            }
          }

          if (hasImports && /*istanbul ignore next*/(0, _keys2.default)(nonHoistedExportNames).length) {
            var hoistedExportsNode = t.identifier("undefined");

            for (var name in nonHoistedExportNames) {
              hoistedExportsNode = buildExportsAssignment(t.identifier(name), hoistedExportsNode).expression;
            }

            var node = t.expressionStatement(hoistedExportsNode);
            node._blockHoist = 3;

            topNodes.unshift(node);
          }

          // add __esModule declaration if this file has any exports
          if (hasExports && !strict) {
            var buildTemplate = buildExportsModuleDeclaration;
            if (this.opts.loose) buildTemplate = buildLooseExportsModuleDeclaration;

            var declar = buildTemplate();
            declar._blockHoist = 3;

            topNodes.unshift(declar);
          }

          path.unshiftContainer("body", topNodes);
          path.traverse(reassignmentVisitor, {
            remaps: remaps,
            scope: scope,
            exports: exports,
            requeueInParent: function /*istanbul ignore next*/requeueInParent(newPath) /*istanbul ignore next*/{
              return path.requeue(newPath);
            }
          });
        }
      }
    }
  };
};

var /*istanbul ignore next*/_path2 = require("path");

var /*istanbul ignore next*/_babelTemplate = require("babel-template");

/*istanbul ignore next*/
var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildRequire = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  require($0);\n"); /* eslint max-len: 0 */

var buildExportsModuleDeclaration = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  Object.defineProperty(exports, \"__esModule\", {\n    value: true\n  });\n");

var buildExportsFrom = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  Object.defineProperty(exports, $0, {\n    enumerable: true,\n    get: function () {\n      return $1;\n    }\n  });\n");

var buildLooseExportsModuleDeclaration = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  exports.__esModule = true;\n");

var buildExportsAssignment = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  exports.$0 = $1;\n");

var buildExportAll = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  Object.keys(OBJECT).forEach(function (key) {\n    if (key === \"default\") return;\n    Object.defineProperty(exports, key, {\n      enumerable: true,\n      get: function () {\n        return OBJECT[key];\n      }\n    });\n  });\n");

var THIS_BREAK_KEYS = ["FunctionExpression", "FunctionDeclaration", "ClassProperty", "ClassMethod", "ObjectMethod"];

/*istanbul ignore next*/module.exports = exports["default"];