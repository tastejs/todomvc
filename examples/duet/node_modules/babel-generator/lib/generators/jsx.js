/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.JSXAttribute = JSXAttribute;
/*istanbul ignore next*/exports.JSXIdentifier = JSXIdentifier;
/*istanbul ignore next*/exports.JSXNamespacedName = JSXNamespacedName;
/*istanbul ignore next*/exports.JSXMemberExpression = JSXMemberExpression;
/*istanbul ignore next*/exports.JSXSpreadAttribute = JSXSpreadAttribute;
/*istanbul ignore next*/exports.JSXExpressionContainer = JSXExpressionContainer;
/*istanbul ignore next*/exports.JSXText = JSXText;
/*istanbul ignore next*/exports.JSXElement = JSXElement;
/*istanbul ignore next*/exports.JSXOpeningElement = JSXOpeningElement;
/*istanbul ignore next*/exports.JSXClosingElement = JSXClosingElement;
/*istanbul ignore next*/exports.JSXEmptyExpression = JSXEmptyExpression;
/*istanbul ignore next*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function JSXAttribute(node) {
  this.print(node.name, node);
  if (node.value) {
    this.push("=");
    this.print(node.value, node);
  }
}

function JSXIdentifier(node) {
  this.push(node.name);
}

function JSXNamespacedName(node) {
  this.print(node.namespace, node);
  this.push(":");
  this.print(node.name, node);
}

function JSXMemberExpression(node) {
  this.print(node.object, node);
  this.push(".");
  this.print(node.property, node);
}

function JSXSpreadAttribute(node) {
  this.push("{...");
  this.print(node.argument, node);
  this.push("}");
}

function JSXExpressionContainer(node) {
  this.push("{");
  this.print(node.expression, node);
  this.push("}");
}

function JSXText(node) {
  this.push(node.value, true);
}

function JSXElement(node) {
  var open = node.openingElement;
  this.print(open, node);
  if (open.selfClosing) return;

  this.indent();
  for ( /*istanbul ignore next*/var _iterator = node.children, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
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

    var child = _ref;

    this.print(child, node);
  }
  this.dedent();

  this.print(node.closingElement, node);
}

function JSXOpeningElement(node) {
  this.push("<");
  this.print(node.name, node);
  if (node.attributes.length > 0) {
    this.push(" ");
    this.printJoin(node.attributes, node, { separator: " " });
  }
  this.push(node.selfClosing ? " />" : ">");
}

function JSXClosingElement(node) {
  this.push("</");
  this.print(node.name, node);
  this.push(">");
}

function JSXEmptyExpression() {}