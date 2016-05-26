"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.TokContext = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _types = require("./types");

var _whitespace = require("../util/whitespace");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The algorithm used to determine whether a regexp can appear at a
// given point in the program is loosely based on sweet.js' approach.
// See https://github.com/mozilla/sweet.js/wiki/design

var TokContext = exports.TokContext = function TokContext(token, isExpr, preserveSpace, override) {
  (0, _classCallCheck3.default)(this, TokContext);

  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
};

var types = exports.types = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", true),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function (p) {
    return p.readTmplToken();
  }),
  f_expr: new TokContext("function", true)
};

// Token-specific context update code

_types.types.parenR.updateContext = _types.types.braceR.updateContext = function () {
  if (this.state.context.length === 1) {
    this.state.exprAllowed = true;
    return;
  }

  var out = this.state.context.pop();
  if (out === types.b_stat && this.curContext() === types.f_expr) {
    this.state.context.pop();
    this.state.exprAllowed = false;
  } else if (out === types.b_tmpl) {
    this.state.exprAllowed = true;
  } else {
    this.state.exprAllowed = !out.isExpr;
  }
};

_types.types.name.updateContext = function (prevType) {
  this.state.exprAllowed = false;

  if (prevType === _types.types._let || prevType === _types.types._const || prevType === _types.types._var) {
    if (_whitespace.lineBreak.test(this.input.slice(this.state.end))) {
      this.state.exprAllowed = true;
    }
  }
};

_types.types.braceL.updateContext = function (prevType) {
  this.state.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
  this.state.exprAllowed = true;
};

_types.types.dollarBraceL.updateContext = function () {
  this.state.context.push(types.b_tmpl);
  this.state.exprAllowed = true;
};

_types.types.parenL.updateContext = function (prevType) {
  var statementParens = prevType === _types.types._if || prevType === _types.types._for || prevType === _types.types._with || prevType === _types.types._while;
  this.state.context.push(statementParens ? types.p_stat : types.p_expr);
  this.state.exprAllowed = true;
};

_types.types.incDec.updateContext = function () {
  // tokExprAllowed stays unchanged
};

_types.types._function.updateContext = function () {
  if (this.curContext() !== types.b_stat) {
    this.state.context.push(types.f_expr);
  }

  this.state.exprAllowed = false;
};

_types.types.backQuote.updateContext = function () {
  if (this.curContext() === types.q_tmpl) {
    this.state.context.pop();
  } else {
    this.state.context.push(types.q_tmpl);
  }
  this.state.exprAllowed = false;
};