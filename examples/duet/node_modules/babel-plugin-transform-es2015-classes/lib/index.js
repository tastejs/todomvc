/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _symbol = require("babel-runtime/core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

exports.default = function ( /*istanbul ignore next*/_ref) {
  /*istanbul ignore next*/var t = _ref.types;

  // todo: investigate traversal requeueing
  var VISITED = /*istanbul ignore next*/(0, _symbol2.default)();

  return {
    visitor: { /*istanbul ignore next*/
      ExportDefaultDeclaration: function ExportDefaultDeclaration(path) {
        if (!path.get("declaration").isClassDeclaration()) return;

        /*istanbul ignore next*/var node = path.node;

        var ref = node.declaration.id || path.scope.generateUidIdentifier("class");
        node.declaration.id = ref;

        // Split the class declaration and the export into two separate statements.
        path.replaceWith(node.declaration);
        path.insertAfter(t.exportDefaultDeclaration(ref));
      },
      /*istanbul ignore next*/ClassDeclaration: function ClassDeclaration(path) {
        /*istanbul ignore next*/var node = path.node;


        var ref = node.id || path.scope.generateUidIdentifier("class");

        path.replaceWith(t.variableDeclaration("let", [t.variableDeclarator(ref, t.toExpression(node))]));
      },
      /*istanbul ignore next*/ClassExpression: function ClassExpression(path, state) {
        /*istanbul ignore next*/var node = path.node;

        if (node[VISITED]) return;

        var inferred = /*istanbul ignore next*/(0, _babelHelperFunctionName2.default)(path);
        if (inferred && inferred !== node) return path.replaceWith(inferred);

        node[VISITED] = true;

        var Constructor = /*istanbul ignore next*/_vanilla2.default;
        if (state.opts.loose) Constructor = /*istanbul ignore next*/_loose2.default;

        path.replaceWith(new Constructor(path, state.file).run());
      }
    }
  };
};

var /*istanbul ignore next*/_loose = require("./loose");

/*istanbul ignore next*/
var _loose2 = _interopRequireDefault(_loose);

var /*istanbul ignore next*/_vanilla = require("./vanilla");

/*istanbul ignore next*/
var _vanilla2 = _interopRequireDefault(_vanilla);

var /*istanbul ignore next*/_babelHelperFunctionName = require("babel-helper-function-name");

/*istanbul ignore next*/
var _babelHelperFunctionName2 = _interopRequireDefault(_babelHelperFunctionName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];