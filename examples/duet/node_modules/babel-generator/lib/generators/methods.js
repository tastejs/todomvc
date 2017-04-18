/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.FunctionDeclaration = undefined;
exports._params = _params;
/*istanbul ignore next*/exports._method = _method;
/*istanbul ignore next*/exports.FunctionExpression = FunctionExpression;
/*istanbul ignore next*/exports.ArrowFunctionExpression = ArrowFunctionExpression;

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _params(node) {
  /*istanbul ignore next*/
  var _this = this;

  this.print(node.typeParameters, node);
  this.push("(");
  this.printList(node.params, node, {
    iterator: function /*istanbul ignore next*/iterator(node) {
      if (node.optional) /*istanbul ignore next*/_this.push("?");
      /*istanbul ignore next*/_this.print(node.typeAnnotation, node);
    }
  });
  this.push(")");

  if (node.returnType) {
    this.print(node.returnType, node);
  }
}

function _method(node) {
  var kind = node.kind;
  var key = node.key;

  if (kind === "method" || kind === "init") {
    if (node.generator) {
      this.push("*");
    }
  }

  if (kind === "get" || kind === "set") {
    this.push(kind + " ");
  }

  if (node.async) this.push("async ");

  if (node.computed) {
    this.push("[");
    this.print(key, node);
    this.push("]");
  } else {
    this.print(key, node);
  }

  this._params(node);
  this.space();
  this.print(node.body, node);
}

function FunctionExpression(node) {
  if (node.async) this.push("async ");
  this.push("function");
  if (node.generator) this.push("*");

  if (node.id) {
    this.push(" ");
    this.print(node.id, node);
  } else {
    this.space();
  }

  this._params(node);
  this.space();
  this.print(node.body, node);
}

/*istanbul ignore next*/exports.FunctionDeclaration = FunctionExpression;
function ArrowFunctionExpression(node) {
  if (node.async) this.push("async ");

  if (node.params.length === 1 && t.isIdentifier(node.params[0])) {
    this.print(node.params[0], node);
  } else {
    this._params(node);
  }

  this.push(" => ");

  this.print(node.body, node);
}