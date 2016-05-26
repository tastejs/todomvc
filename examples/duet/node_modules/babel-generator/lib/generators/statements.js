/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.ThrowStatement = exports.BreakStatement = exports.ReturnStatement = exports.ContinueStatement = exports.ForOfStatement = exports.ForInStatement = undefined;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.WithStatement = WithStatement;
/*istanbul ignore next*/exports.IfStatement = IfStatement;
/*istanbul ignore next*/exports.ForStatement = ForStatement;
/*istanbul ignore next*/exports.WhileStatement = WhileStatement;
/*istanbul ignore next*/exports.DoWhileStatement = DoWhileStatement;
/*istanbul ignore next*/exports.LabeledStatement = LabeledStatement;
/*istanbul ignore next*/exports.TryStatement = TryStatement;
/*istanbul ignore next*/exports.CatchClause = CatchClause;
/*istanbul ignore next*/exports.SwitchStatement = SwitchStatement;
/*istanbul ignore next*/exports.SwitchCase = SwitchCase;
/*istanbul ignore next*/exports.DebuggerStatement = DebuggerStatement;
/*istanbul ignore next*/exports.VariableDeclaration = VariableDeclaration;
/*istanbul ignore next*/exports.VariableDeclarator = VariableDeclarator;

var /*istanbul ignore next*/_repeat = require("lodash/repeat");

/*istanbul ignore next*/
var _repeat2 = _interopRequireDefault(_repeat);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NON_ALPHABETIC_UNARY_OPERATORS = t.UPDATE_OPERATORS.concat(t.NUMBER_UNARY_OPERATORS).concat(["!"]);

function WithStatement(node) {
  this.keyword("with");
  this.push("(");
  this.print(node.object, node);
  this.push(")");
  this.printBlock(node);
}

function IfStatement(node) {
  this.keyword("if");
  this.push("(");
  this.print(node.test, node);
  this.push(")");
  this.space();

  var needsBlock = node.alternate && t.isIfStatement(getLastStatement(node.consequent));
  if (needsBlock) {
    this.push("{");
    this.newline();
    this.indent();
  }

  this.printAndIndentOnComments(node.consequent, node);

  if (needsBlock) {
    this.dedent();
    this.newline();
    this.push("}");
  }

  if (node.alternate) {
    if (this.isLast("}")) this.space();
    this.push("else ");
    this.printAndIndentOnComments(node.alternate, node);
  }
}

// Recursively get the last statement.
function getLastStatement(statement) {
  if (!t.isStatement(statement.body)) return statement;
  return getLastStatement(statement.body);
}

function ForStatement(node) {
  this.keyword("for");
  this.push("(");

  this._inForStatementInitCounter++;
  this.print(node.init, node);
  this._inForStatementInitCounter--;
  this.push(";");

  if (node.test) {
    this.space();
    this.print(node.test, node);
  }
  this.push(";");

  if (node.update) {
    this.space();
    this.print(node.update, node);
  }

  this.push(")");
  this.printBlock(node);
}

function WhileStatement(node) {
  this.keyword("while");
  this.push("(");
  this.print(node.test, node);
  this.push(")");
  this.printBlock(node);
}

var buildForXStatement = function buildForXStatement(op) {
  return function (node) {
    this.keyword("for");
    this.push("(");
    this.print(node.left, node);
    this.push( /*istanbul ignore next*/" " + op + " ");
    this.print(node.right, node);
    this.push(")");
    this.printBlock(node);
  };
};

var ForInStatement = /*istanbul ignore next*/exports.ForInStatement = buildForXStatement("in");
var ForOfStatement = /*istanbul ignore next*/exports.ForOfStatement = buildForXStatement("of");

function DoWhileStatement(node) {
  this.push("do ");
  this.print(node.body, node);
  this.space();
  this.keyword("while");
  this.push("(");
  this.print(node.test, node);
  this.push(");");
}

function buildLabelStatement(prefix) {
  /*istanbul ignore next*/var key = arguments.length <= 1 || arguments[1] === undefined ? "label" : arguments[1];

  return function (node) {
    this.push(prefix);

    var label = node[key];
    if (label) {
      if (!(this.format.minified && (t.isUnaryExpression(label, { prefix: true }) || t.isUpdateExpression(label, { prefix: true })) && NON_ALPHABETIC_UNARY_OPERATORS.indexOf(label.operator) > -1)) {
        this.push(" ");
      }

      var terminatorState = this.startTerminatorless();
      this.print(label, node);
      this.endTerminatorless(terminatorState);
    }

    this.semicolon();
  };
}

var ContinueStatement = /*istanbul ignore next*/exports.ContinueStatement = buildLabelStatement("continue");
var ReturnStatement = /*istanbul ignore next*/exports.ReturnStatement = buildLabelStatement("return", "argument");
var BreakStatement = /*istanbul ignore next*/exports.BreakStatement = buildLabelStatement("break");
var ThrowStatement = /*istanbul ignore next*/exports.ThrowStatement = buildLabelStatement("throw", "argument");

function LabeledStatement(node) {
  this.print(node.label, node);
  this.push(": ");
  this.print(node.body, node);
}

function TryStatement(node) {
  this.keyword("try");
  this.print(node.block, node);
  this.space();

  // Esprima bug puts the catch clause in a `handlers` array.
  // see https://code.google.com/p/esprima/issues/detail?id=433
  // We run into this from regenerator generated ast.
  if (node.handlers) {
    this.print(node.handlers[0], node);
  } else {
    this.print(node.handler, node);
  }

  if (node.finalizer) {
    this.space();
    this.push("finally ");
    this.print(node.finalizer, node);
  }
}

function CatchClause(node) {
  this.keyword("catch");
  this.push("(");
  this.print(node.param, node);
  this.push(")");
  this.space();
  this.print(node.body, node);
}

function SwitchStatement(node) {
  this.keyword("switch");
  this.push("(");
  this.print(node.discriminant, node);
  this.push(")");
  this.space();
  this.push("{");

  this.printSequence(node.cases, node, {
    indent: true,
    /*istanbul ignore next*/addNewlines: function addNewlines(leading, cas) {
      if (!leading && node.cases[node.cases.length - 1] === cas) return -1;
    }
  });

  this.push("}");
}

function SwitchCase(node) {
  if (node.test) {
    this.push("case ");
    this.print(node.test, node);
    this.push(":");
  } else {
    this.push("default:");
  }

  if (node.consequent.length) {
    this.newline();
    this.printSequence(node.consequent, node, { indent: true });
  }
}

function DebuggerStatement() {
  this.push("debugger;");
}

function VariableDeclaration(node, parent) {
  this.push(node.kind + " ");

  var hasInits = false;
  // don't add whitespace to loop heads
  if (!t.isFor(parent)) {
    for ( /*istanbul ignore next*/var _iterator = node.declarations, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
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

      var declar = _ref;

      if (declar.init) {
        // has an init so let's split it up over multiple lines
        hasInits = true;
      }
    }
  }

  //
  // use a pretty separator when we aren't in compact mode, have initializers and don't have retainLines on
  // this will format declarations like:
  //
  //   let foo = "bar", bar = "foo";
  //
  // into
  //
  //   let foo = "bar",
  //       bar = "foo";
  //

  var sep = /*istanbul ignore next*/void 0;
  if (!this.format.compact && !this.format.concise && hasInits && !this.format.retainLines) {
    sep = /*istanbul ignore next*/",\n" + /*istanbul ignore next*/(0, _repeat2.default)(" ", node.kind.length + 1);
  }

  //

  this.printList(node.declarations, node, { separator: sep });

  if (t.isFor(parent)) {
    // don't give semicolons to these nodes since they'll be inserted in the parent generator
    if (parent.left === node || parent.init === node) return;
  }

  this.semicolon();
}

function VariableDeclarator(node) {
  this.print(node.id, node);
  this.print(node.id.typeAnnotation, node);
  if (node.init) {
    this.space();
    this.push("=");
    this.space();
    this.print(node.init, node);
  }
}