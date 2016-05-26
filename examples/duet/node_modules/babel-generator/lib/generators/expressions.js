/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.LogicalExpression = exports.BinaryExpression = exports.AwaitExpression = exports.YieldExpression = undefined;
exports.UnaryExpression = UnaryExpression;
/*istanbul ignore next*/exports.DoExpression = DoExpression;
/*istanbul ignore next*/exports.ParenthesizedExpression = ParenthesizedExpression;
/*istanbul ignore next*/exports.UpdateExpression = UpdateExpression;
/*istanbul ignore next*/exports.ConditionalExpression = ConditionalExpression;
/*istanbul ignore next*/exports.NewExpression = NewExpression;
/*istanbul ignore next*/exports.SequenceExpression = SequenceExpression;
/*istanbul ignore next*/exports.ThisExpression = ThisExpression;
/*istanbul ignore next*/exports.Super = Super;
/*istanbul ignore next*/exports.Decorator = Decorator;
/*istanbul ignore next*/exports.CallExpression = CallExpression;
/*istanbul ignore next*/exports.EmptyStatement = EmptyStatement;
/*istanbul ignore next*/exports.ExpressionStatement = ExpressionStatement;
/*istanbul ignore next*/exports.AssignmentPattern = AssignmentPattern;
/*istanbul ignore next*/exports.AssignmentExpression = AssignmentExpression;
/*istanbul ignore next*/exports.BindExpression = BindExpression;
/*istanbul ignore next*/exports.MemberExpression = MemberExpression;
/*istanbul ignore next*/exports.MetaProperty = MetaProperty;

var /*istanbul ignore next*/_isInteger = require("lodash/isInteger");

/*istanbul ignore next*/
var _isInteger2 = _interopRequireDefault(_isInteger);

var /*istanbul ignore next*/_isNumber = require("lodash/isNumber");

/*istanbul ignore next*/
var _isNumber2 = _interopRequireDefault(_isNumber);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

var /*istanbul ignore next*/_node = require("../node");

/*istanbul ignore next*/
var n = _interopRequireWildcard(_node);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-len: 0 */

var SCIENTIFIC_NOTATION = /e/i;
var ZERO_DECIMAL_INTEGER = /\.0+$/;
var NON_DECIMAL_LITERAL = /^0[box]/;

function UnaryExpression(node) {
  var needsSpace = /[a-z]$/.test(node.operator);
  var arg = node.argument;

  if (t.isUpdateExpression(arg) || t.isUnaryExpression(arg)) {
    needsSpace = true;
  }

  if (t.isUnaryExpression(arg) && arg.operator === "!") {
    needsSpace = false;
  }

  this.push(node.operator);
  if (needsSpace) this.push(" ");
  this.print(node.argument, node);
}

function DoExpression(node) {
  this.push("do");
  this.space();
  this.print(node.body, node);
}

function ParenthesizedExpression(node) {
  this.push("(");
  this.print(node.expression, node);
  this.push(")");
}

function UpdateExpression(node) {
  if (node.prefix) {
    this.push(node.operator);
    this.print(node.argument, node);
  } else {
    this.print(node.argument, node);
    this.push(node.operator);
  }
}

function ConditionalExpression(node) {
  this.print(node.test, node);
  this.space();
  this.push("?");
  this.space();
  this.print(node.consequent, node);
  this.space();
  this.push(":");
  this.space();
  this.print(node.alternate, node);
}

function NewExpression(node, parent) {
  this.push("new ");
  this.print(node.callee, node);
  if (node.arguments.length === 0 && this.format.minified && !t.isCallExpression(parent, { callee: node }) && !t.isMemberExpression(parent) && !t.isNewExpression(parent)) return;

  this.push("(");
  this.printList(node.arguments, node);
  this.push(")");
}

function SequenceExpression(node) {
  this.printList(node.expressions, node);
}

function ThisExpression() {
  this.push("this");
}

function Super() {
  this.push("super");
}

function Decorator(node) {
  this.push("@");
  this.print(node.expression, node);
  this.newline();
}

function CallExpression(node) {
  this.print(node.callee, node);
  if (node.loc) this.printAuxAfterComment();

  this.push("(");

  var isPrettyCall = node._prettyCall && !this.format.retainLines && !this.format.compact;

  var separator = /*istanbul ignore next*/void 0;
  if (isPrettyCall) {
    separator = ",\n";
    this.newline();
    this.indent();
  }

  this.printList(node.arguments, node, { separator: separator });

  if (isPrettyCall) {
    this.newline();
    this.dedent();
  }

  this.push(")");
}

function buildYieldAwait(keyword) {
  return function (node) {
    this.push(keyword);

    if (node.delegate) {
      this.push("*");
    }

    if (node.argument) {
      this.push(" ");
      var terminatorState = this.startTerminatorless();
      this.print(node.argument, node);
      this.endTerminatorless(terminatorState);
    }
  };
}

var YieldExpression = /*istanbul ignore next*/exports.YieldExpression = buildYieldAwait("yield");
var AwaitExpression = /*istanbul ignore next*/exports.AwaitExpression = buildYieldAwait("await");

function EmptyStatement() {
  this._lastPrintedIsEmptyStatement = true;
  this.semicolon();
}

function ExpressionStatement(node) {
  this.print(node.expression, node);
  this.semicolon();
}

function AssignmentPattern(node) {
  this.print(node.left, node);
  this.space();
  this.push("=");
  this.space();
  this.print(node.right, node);
}

function AssignmentExpression(node, parent) {
  // Somewhere inside a for statement `init` node but doesn't usually
  // needs a paren except for `in` expressions: `for (a in b ? a : b;;)`
  var parens = this._inForStatementInitCounter && node.operator === "in" && !n.needsParens(node, parent);

  if (parens) {
    this.push("(");
  }

  this.print(node.left, node);

  var spaces = !this.format.compact || node.operator === "in" || node.operator === "instanceof";
  if (spaces) this.push(" ");

  this.push(node.operator);

  if (!spaces) {
    // space is mandatory to avoid outputting <!--
    // http://javascript.spec.whatwg.org/#comment-syntax
    spaces = node.operator === "<" && t.isUnaryExpression(node.right, { prefix: true, operator: "!" }) && t.isUnaryExpression(node.right.argument, { prefix: true, operator: "--" });

    // Need spaces for operators of the same kind to avoid: `a+++b`
    if (!spaces) {
      var right = getLeftMost(node.right);
      spaces = t.isUnaryExpression(right, { prefix: true, operator: node.operator }) || t.isUpdateExpression(right, { prefix: true, operator: node.operator + node.operator });
    }
  }

  if (spaces) this.push(" ");

  this.print(node.right, node);

  if (parens) {
    this.push(")");
  }
}

function BindExpression(node) {
  this.print(node.object, node);
  this.push("::");
  this.print(node.callee, node);
}

/*istanbul ignore next*/exports.BinaryExpression = AssignmentExpression;
/*istanbul ignore next*/exports.LogicalExpression = AssignmentExpression;
function MemberExpression(node) {
  this.print(node.object, node);

  if (!node.computed && t.isMemberExpression(node.property)) {
    throw new TypeError("Got a MemberExpression for MemberExpression property");
  }

  var computed = node.computed;
  if (t.isLiteral(node.property) && /*istanbul ignore next*/(0, _isNumber2.default)(node.property.value)) {
    computed = true;
  }

  if (computed) {
    this.push("[");
    this.print(node.property, node);
    this.push("]");
  } else {
    if (t.isNumericLiteral(node.object)) {
      var val = this.getPossibleRaw(node.object) || node.object.value;
      if ( /*istanbul ignore next*/(0, _isInteger2.default)(+val) && !NON_DECIMAL_LITERAL.test(val) && !SCIENTIFIC_NOTATION.test(val) && !ZERO_DECIMAL_INTEGER.test(val) && !this.endsWith(".")) {
        this.push(".");
      }
    }

    this.push(".");
    this.print(node.property, node);
  }
}

function MetaProperty(node) {
  this.print(node.meta, node);
  this.push(".");
  this.print(node.property, node);
}

function getLeftMost(binaryExpr) {
  if (!t.isBinaryExpression(binaryExpr)) {
    return binaryExpr;
  }
  return getLeftMost(binaryExpr.left);
}