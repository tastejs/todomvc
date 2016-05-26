/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.Flow = exports.Pure = exports.Generated = exports.User = exports.Var = exports.BlockScoped = exports.Referenced = exports.Scope = exports.Expression = exports.Statement = exports.BindingIdentifier = exports.ReferencedMemberExpression = exports.ReferencedIdentifier = undefined;

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var ReferencedIdentifier = /*istanbul ignore next*/exports.ReferencedIdentifier = {
  types: ["Identifier", "JSXIdentifier"],
  /*istanbul ignore next*/checkPath: function checkPath(_ref, opts) {
    /*istanbul ignore next*/var node = _ref.node;
    /*istanbul ignore next*/var parent = _ref.parent;

    if (!t.isIdentifier(node, opts)) {
      if (t.isJSXIdentifier(node, opts)) {
        if ( /*istanbul ignore next*/_babelTypes.react.isCompatTag(node.name)) return false;
      } else {
        // not a JSXIdentifier or an Identifier
        return false;
      }
    }

    // check if node is referenced
    return t.isReferenced(node, parent);
  }
};

var ReferencedMemberExpression = /*istanbul ignore next*/exports.ReferencedMemberExpression = {
  types: ["MemberExpression"],
  /*istanbul ignore next*/checkPath: function checkPath(_ref2) {
    /*istanbul ignore next*/var node = _ref2.node;
    /*istanbul ignore next*/var parent = _ref2.parent;

    return t.isMemberExpression(node) && t.isReferenced(node, parent);
  }
};

var BindingIdentifier = /*istanbul ignore next*/exports.BindingIdentifier = {
  types: ["Identifier"],
  /*istanbul ignore next*/checkPath: function checkPath(_ref3) {
    /*istanbul ignore next*/var node = _ref3.node;
    /*istanbul ignore next*/var parent = _ref3.parent;

    return t.isIdentifier(node) && t.isBinding(node, parent);
  }
};

var Statement = /*istanbul ignore next*/exports.Statement = {
  types: ["Statement"],
  /*istanbul ignore next*/checkPath: function checkPath(_ref4) {
    /*istanbul ignore next*/var node = _ref4.node;
    /*istanbul ignore next*/var parent = _ref4.parent;

    if (t.isStatement(node)) {
      if (t.isVariableDeclaration(node)) {
        if (t.isForXStatement(parent, { left: node })) return false;
        if (t.isForStatement(parent, { init: node })) return false;
      }

      return true;
    } else {
      return false;
    }
  }
};

var Expression = /*istanbul ignore next*/exports.Expression = {
  types: ["Expression"],
  /*istanbul ignore next*/checkPath: function checkPath(path) {
    if (path.isIdentifier()) {
      return path.isReferencedIdentifier();
    } else {
      return t.isExpression(path.node);
    }
  }
};

var Scope = /*istanbul ignore next*/exports.Scope = {
  types: ["Scopable"],
  /*istanbul ignore next*/checkPath: function checkPath(path) {
    return t.isScope(path.node, path.parent);
  }
};

var Referenced = /*istanbul ignore next*/exports.Referenced = { /*istanbul ignore next*/
  checkPath: function checkPath(path) {
    return t.isReferenced(path.node, path.parent);
  }
};

var BlockScoped = /*istanbul ignore next*/exports.BlockScoped = { /*istanbul ignore next*/
  checkPath: function checkPath(path) {
    return t.isBlockScoped(path.node);
  }
};

var Var = /*istanbul ignore next*/exports.Var = {
  types: ["VariableDeclaration"],
  /*istanbul ignore next*/checkPath: function checkPath(path) {
    return t.isVar(path.node);
  }
};

var User = /*istanbul ignore next*/exports.User = { /*istanbul ignore next*/
  checkPath: function checkPath(path) {
    return path.node && !!path.node.loc;
  }
};

var Generated = /*istanbul ignore next*/exports.Generated = { /*istanbul ignore next*/
  checkPath: function checkPath(path) {
    return !path.isUser();
  }
};

var Pure = /*istanbul ignore next*/exports.Pure = { /*istanbul ignore next*/
  checkPath: function checkPath(path, opts) {
    return path.scope.isPure(path.node, opts);
  }
};

var Flow = /*istanbul ignore next*/exports.Flow = {
  types: ["Flow", "ImportDeclaration", "ExportDeclaration"],
  /*istanbul ignore next*/checkPath: function checkPath(_ref5) {
    /*istanbul ignore next*/var node = _ref5.node;

    if (t.isFlow(node)) {
      return true;
    } else if (t.isImportDeclaration(node)) {
      return node.importKind === "type" || node.importKind === "typeof";
    } else if (t.isExportDeclaration(node)) {
      return node.exportKind === "type";
    } else {
      return false;
    }
  }
};