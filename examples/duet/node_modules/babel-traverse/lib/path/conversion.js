/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.toComputedKey = toComputedKey;
/*istanbul ignore next*/exports.ensureBlock = ensureBlock;
/*istanbul ignore next*/exports.arrowFunctionToShadowed = arrowFunctionToShadowed;

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function toComputedKey() {
  var node = this.node;

  var key = /*istanbul ignore next*/void 0;
  if (this.isMemberExpression()) {
    key = node.property;
  } else if (this.isProperty() || this.isMethod()) {
    key = node.key;
  } else {
    throw new ReferenceError("todo");
  }

  if (!node.computed) {
    if (t.isIdentifier(key)) key = t.stringLiteral(key.name);
  }

  return key;
} // This file contains methods that convert the path node into another node or some other type of data.

function ensureBlock() {
  return t.ensureBlock(this.node);
}

function arrowFunctionToShadowed() {
  // todo: maybe error
  if (!this.isArrowFunctionExpression()) return;

  this.ensureBlock();

  /*istanbul ignore next*/var node = this.node;

  node.expression = false;
  node.type = "FunctionExpression";
  node.shadow = node.shadow || true;
}