/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var /*istanbul ignore next*/_binding = require("../binding");

/*istanbul ignore next*/
var _binding2 = _interopRequireDefault(_binding);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renameVisitor = { /*istanbul ignore next*/
  ReferencedIdentifier: function ReferencedIdentifier(_ref, state) {
    /*istanbul ignore next*/var node = _ref.node;

    if (node.name === state.oldName) {
      node.name = state.newName;
    }
  },
  /*istanbul ignore next*/Scope: function Scope(path, state) {
    if (!path.scope.bindingIdentifierEquals(state.oldName, state.binding.identifier)) {
      path.skip();
    }
  },
  /*istanbul ignore next*/"AssignmentExpression|Declaration": function AssignmentExpressionDeclaration(path, state) {
    var ids = path.getOuterBindingIdentifiers();

    for (var name in ids) {
      if (name === state.oldName) ids[name].name = state.newName;
    }
  }
};

/*istanbul ignore next*/
var Renamer = function () {
  function /*istanbul ignore next*/Renamer(binding, oldName, newName) {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, Renamer);

    this.newName = newName;
    this.oldName = oldName;
    this.binding = binding;
  }

  Renamer.prototype.maybeConvertFromExportDeclaration = function maybeConvertFromExportDeclaration(parentDeclar) {
    var exportDeclar = parentDeclar.parentPath.isExportDeclaration() && parentDeclar.parentPath;
    if (!exportDeclar) return;

    // build specifiers that point back to this export declaration
    var isDefault = exportDeclar.isExportDefaultDeclaration();

    if (isDefault && (parentDeclar.isFunctionDeclaration() || parentDeclar.isClassDeclaration()) && !parentDeclar.node.id) {
      // Ensure that default class and function exports have a name so they have a identifier to
      // reference from the export specifier list.
      parentDeclar.node.id = parentDeclar.scope.generateUidIdentifier("default");
    }

    var bindingIdentifiers = parentDeclar.getOuterBindingIdentifiers();
    var specifiers = [];

    for (var name in bindingIdentifiers) {
      var localName = name === this.oldName ? this.newName : name;
      var exportedName = isDefault ? "default" : name;
      specifiers.push(t.exportSpecifier(t.identifier(localName), t.identifier(exportedName)));
    }

    var aliasDeclar = t.exportNamedDeclaration(null, specifiers);

    // hoist to the top if it's a function
    if (parentDeclar.isFunctionDeclaration()) {
      aliasDeclar._blockHoist = 3;
    }

    exportDeclar.insertAfter(aliasDeclar);
    exportDeclar.replaceWith(parentDeclar.node);
  };

  Renamer.prototype.maybeConvertFromClassFunctionDeclaration = function maybeConvertFromClassFunctionDeclaration(path) {
    return; // TODO

    // retain the `name` of a class/function declaration

    if (!path.isFunctionDeclaration() && !path.isClassDeclaration()) return;
    if (this.binding.kind !== "hoisted") return;

    path.node.id = t.identifier(this.oldName);
    path.node._blockHoist = 3;

    path.replaceWith(t.variableDeclaration("let", [t.variableDeclarator(t.identifier(this.newName), t.toExpression(path.node))]));
  };

  Renamer.prototype.maybeConvertFromClassFunctionExpression = function maybeConvertFromClassFunctionExpression(path) {
    return; // TODO

    // retain the `name` of a class/function expression

    if (!path.isFunctionExpression() && !path.isClassExpression()) return;
    if (this.binding.kind !== "local") return;

    path.node.id = t.identifier(this.oldName);

    this.binding.scope.parent.push({
      id: t.identifier(this.newName)
    });

    path.replaceWith(t.assignmentExpression("=", t.identifier(this.newName), path.node));
  };

  Renamer.prototype.rename = function rename(block) {
    /*istanbul ignore next*/var binding = this.binding;
    /*istanbul ignore next*/var oldName = this.oldName;
    /*istanbul ignore next*/var newName = this.newName;
    /*istanbul ignore next*/var scope = binding.scope;
    /*istanbul ignore next*/var path = binding.path;


    var parentDeclar = path.find(function (path) /*istanbul ignore next*/{
      return path.isDeclaration() || path.isFunctionExpression();
    });
    if (parentDeclar) {
      this.maybeConvertFromExportDeclaration(parentDeclar);
    }

    scope.traverse(block || scope.block, renameVisitor, this);

    if (!block) {
      scope.removeOwnBinding(oldName);
      scope.bindings[newName] = binding;
      this.binding.identifier.name = newName;
    }

    if (binding.type === "hoisted") {
      // https://github.com/babel/babel/issues/2435
      // todo: hoist and convert function to a let
    }

    if (parentDeclar) {
      this.maybeConvertFromClassFunctionDeclaration(parentDeclar);
      this.maybeConvertFromClassFunctionExpression(parentDeclar);
    }
  };

  return Renamer;
}();

/*istanbul ignore next*/exports.default = Renamer;
/*istanbul ignore next*/module.exports = exports["default"];