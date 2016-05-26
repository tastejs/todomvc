/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var /*istanbul ignore next*/_repeat = require("lodash/repeat");

/*istanbul ignore next*/
var _repeat2 = _interopRequireDefault(_repeat);

var /*istanbul ignore next*/_buffer = require("./buffer");

/*istanbul ignore next*/
var _buffer2 = _interopRequireDefault(_buffer);

var /*istanbul ignore next*/_node = require("./node");

/*istanbul ignore next*/
var n = _interopRequireWildcard(_node);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-len: 0 */

var Printer = function (_Buffer) {
  (0, _inherits3.default)(Printer, _Buffer);

  function /*istanbul ignore next*/Printer() {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, Printer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    /*istanbul ignore next*/
    var _this = (0, _possibleConstructorReturn3.default)(this, /*istanbul ignore next*/_Buffer.call.apply( /*istanbul ignore next*/_Buffer, /*istanbul ignore next*/[this].concat(args)));

    /*istanbul ignore next*/_this.insideAux = false;
    /*istanbul ignore next*/_this.printAuxAfterOnNextUserNode = false;
    /*istanbul ignore next*/_this._printStack = [];
    /*istanbul ignore next*/return _this;
  }

  Printer.prototype.print = function print(node, parent) {
    /*istanbul ignore next*/
    var _this2 = this;

    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    if (!node) return;

    this._lastPrintedIsEmptyStatement = false;

    if (parent && parent._compact) {
      node._compact = true;
    }

    var oldInAux = this.insideAux;
    this.insideAux = !node.loc;

    var oldConcise = this.format.concise;
    if (node._compact) {
      this.format.concise = true;
    }

    var printMethod = this[node.type];
    if (!printMethod) {
      throw new ReferenceError( /*istanbul ignore next*/"unknown node of type " + /*istanbul ignore next*/(0, _stringify2.default)(node.type) + " with constructor " + /*istanbul ignore next*/(0, _stringify2.default)(node && node.constructor.name));
    }

    this._printStack.push(node);

    if (node.loc) this.printAuxAfterComment();
    this.printAuxBeforeComment(oldInAux);

    var needsParens = n.needsParens(node, parent, this._printStack);
    if (needsParens) this.push("(");

    this.printLeadingComments(node, parent);

    this.catchUp(node);

    this._printNewline(true, node, parent, opts);

    if (opts.before) opts.before();

    var loc = t.isProgram(node) || t.isFile(node) ? null : node.loc;
    this.withSource("start", loc, function () {
      /*istanbul ignore next*/_this2._print(node, parent);
    });

    // Check again if any of our children may have left an aux comment on the stack
    if (node.loc) this.printAuxAfterComment();

    this.printTrailingComments(node, parent);

    if (needsParens) this.push(")");

    // end
    this._printStack.pop();
    if (opts.after) opts.after();

    this.format.concise = oldConcise;
    this.insideAux = oldInAux;

    this._printNewline(false, node, parent, opts);
  };

  Printer.prototype.printAuxBeforeComment = function printAuxBeforeComment(wasInAux) {
    var comment = this.format.auxiliaryCommentBefore;
    if (!wasInAux && this.insideAux && !this.printAuxAfterOnNextUserNode) {
      this.printAuxAfterOnNextUserNode = true;
      if (comment) this.printComment({
        type: "CommentBlock",
        value: comment
      });
    }
  };

  Printer.prototype.printAuxAfterComment = function printAuxAfterComment() {
    if (this.printAuxAfterOnNextUserNode) {
      this.printAuxAfterOnNextUserNode = false;
      var comment = this.format.auxiliaryCommentAfter;
      if (comment) this.printComment({
        type: "CommentBlock",
        value: comment
      });
    }
  };

  Printer.prototype.getPossibleRaw = function getPossibleRaw(node) {
    var extra = node.extra;
    if (extra && extra.raw != null && extra.rawValue != null && node.value === extra.rawValue) {
      return extra.raw;
    }
  };

  Printer.prototype._print = function _print(node, parent) {
    // In minified mode we need to produce as little bytes as needed
    // and need to make sure that string quoting is consistent.
    // That means we have to always reprint as opposed to getting
    // the raw value.
    if (!this.format.minified) {
      var extra = this.getPossibleRaw(node);
      if (extra) {
        this.push("");
        this._push(extra);
        return;
      }
    }

    var printMethod = this[node.type];
    printMethod.call(this, node, parent);
  };

  Printer.prototype.printJoin = function printJoin(nodes, parent) {
    /*istanbul ignore next*/
    var _this3 = this;

    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    if (!nodes || !nodes.length) return;

    var len = nodes.length;
    var node = /*istanbul ignore next*/void 0,
        i = /*istanbul ignore next*/void 0;

    if (opts.indent) this.indent();

    var printOpts = {
      statement: opts.statement,
      addNewlines: opts.addNewlines,
      after: function /*istanbul ignore next*/after() {
        if (opts.iterator) {
          opts.iterator(node, i);
        }

        if (opts.separator && parent.loc) {
          /*istanbul ignore next*/_this3.printAuxAfterComment();
        }

        if (opts.separator && i < len - 1) {
          /*istanbul ignore next*/_this3.push(opts.separator);
        }
      }
    };

    for (i = 0; i < nodes.length; i++) {
      node = nodes[i];
      this.print(node, parent, printOpts);
    }

    if (opts.indent) this.dedent();
  };

  Printer.prototype.printAndIndentOnComments = function printAndIndentOnComments(node, parent) {
    var indent = !!node.leadingComments;
    if (indent) this.indent();
    this.print(node, parent);
    if (indent) this.dedent();
  };

  Printer.prototype.printBlock = function printBlock(parent) {
    var node = parent.body;

    if (!t.isEmptyStatement(node)) {
      this.space();
    }

    this.print(node, parent);
  };

  Printer.prototype.generateComment = function generateComment(comment) {
    var val = comment.value;
    if (comment.type === "CommentLine") {
      val = /*istanbul ignore next*/"//" + val;
    } else {
      val = /*istanbul ignore next*/"/*" + val + "*/";
    }
    return val;
  };

  Printer.prototype.printTrailingComments = function printTrailingComments(node, parent) {
    this.printComments(this.getComments(false, node, parent));
  };

  Printer.prototype.printLeadingComments = function printLeadingComments(node, parent) {
    this.printComments(this.getComments(true, node, parent));
  };

  Printer.prototype.printInnerComments = function printInnerComments(node) {
    /*istanbul ignore next*/var indent = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    if (!node.innerComments) return;
    if (indent) this.indent();
    this.printComments(node.innerComments);
    if (indent) this.dedent();
  };

  Printer.prototype.printSequence = function printSequence(nodes, parent) {
    /*istanbul ignore next*/var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    opts.statement = true;
    return this.printJoin(nodes, parent, opts);
  };

  Printer.prototype.printList = function printList(items, parent) {
    /*istanbul ignore next*/var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    if (opts.separator == null) {
      opts.separator = ",";
      if (!this.format.compact) opts.separator += " ";
    }

    return this.printJoin(items, parent, opts);
  };

  Printer.prototype._printNewline = function _printNewline(leading, node, parent, opts) {
    // Fast path since 'this.newline' does nothing when not tracking lines.
    if (this.format.retainLines || this.format.compact) return;

    if (!opts.statement && !n.isUserWhitespacable(node, parent)) {
      return;
    }

    // Fast path for concise since 'this.newline' just inserts a space when
    // concise formatting is in use.
    if (this.format.concise) {
      this.space();
      return;
    }

    var lines = 0;

    if (node.start != null && !node._ignoreUserWhitespace && this.tokens.length) {
      // user node
      if (leading) {
        lines = this.whitespace.getNewlinesBefore(node);
      } else {
        lines = this.whitespace.getNewlinesAfter(node);
      }
    } else {
      // generated node
      if (!leading) lines++; // always include at least a single line after
      if (opts.addNewlines) lines += opts.addNewlines(leading, node) || 0;

      var needs = n.needsWhitespaceAfter;
      if (leading) needs = n.needsWhitespaceBefore;
      if (needs(node, parent)) lines++;

      // generated nodes can't add starting file whitespace
      if (!this.buf) lines = 0;
    }

    this.newline(lines);
  };

  Printer.prototype.getComments = function getComments(leading, node) {
    // Note, we use a boolean flag here instead of passing in the attribute name as it is faster
    // because this is called extremely frequently.
    return node && (leading ? node.leadingComments : node.trailingComments) || [];
  };

  Printer.prototype.shouldPrintComment = function shouldPrintComment(comment) {
    if (this.format.shouldPrintComment) {
      return this.format.shouldPrintComment(comment.value);
    } else {
      if (!this.format.minified && (comment.value.indexOf("@license") >= 0 || comment.value.indexOf("@preserve") >= 0)) {
        return true;
      } else {
        return this.format.comments;
      }
    }
  };

  Printer.prototype.printComment = function printComment(comment) {
    /*istanbul ignore next*/
    var _this4 = this;

    if (!this.shouldPrintComment(comment)) return;

    if (comment.ignore) return;
    comment.ignore = true;

    if (comment.start != null) {
      if (this.printedCommentStarts[comment.start]) return;
      this.printedCommentStarts[comment.start] = true;
    }

    // Exclude comments from source mappings since they will only clutter things.
    this.withSource(null, null, function () {
      /*istanbul ignore next*/_this4.catchUp(comment);

      // whitespace before
      /*istanbul ignore next*/_this4.newline( /*istanbul ignore next*/_this4.whitespace.getNewlinesBefore(comment));

      var column = /*istanbul ignore next*/_this4.position.column;
      var val = /*istanbul ignore next*/_this4.generateComment(comment);

      if (column && ! /*istanbul ignore next*/_this4.isLast(["\n", " ", "[", "{"])) {
        /*istanbul ignore next*/_this4._push(" ");
        column++;
      }

      //
      if (comment.type === "CommentBlock" && /*istanbul ignore next*/_this4.format.indent.adjustMultilineComment) {
        var offset = comment.loc && comment.loc.start.column;
        if (offset) {
          var newlineRegex = new RegExp("\\n\\s{1," + offset + "}", "g");
          val = val.replace(newlineRegex, "\n");
        }

        var indent = Math.max( /*istanbul ignore next*/_this4.indentSize(), column);
        val = val.replace(/\n/g, /*istanbul ignore next*/"\n" + /*istanbul ignore next*/(0, _repeat2.default)(" ", indent));
      }

      if (column === 0) {
        val = /*istanbul ignore next*/_this4.getIndent() + val;
      }

      // force a newline for line comments when retainLines is set in case the next printed node
      // doesn't catch up
      if (( /*istanbul ignore next*/_this4.format.compact || /*istanbul ignore next*/_this4.format.concise || /*istanbul ignore next*/_this4.format.retainLines) && comment.type === "CommentLine") {
        val += "\n";
      }

      //
      /*istanbul ignore next*/_this4._push(val);

      // whitespace after
      /*istanbul ignore next*/_this4.newline( /*istanbul ignore next*/_this4.whitespace.getNewlinesAfter(comment));
    });
  };

  Printer.prototype.printComments = function printComments(comments) {
    if (!comments || !comments.length) return;

    for ( /*istanbul ignore next*/var _iterator = comments, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
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

      var comment = _ref;

      this.printComment(comment);
    }
  };

  return Printer;
}(_buffer2.default);

/*istanbul ignore next*/exports.default = Printer;
/*istanbul ignore next*/var _arr = [require("./generators/template-literals"), require("./generators/expressions"), require("./generators/statements"), require("./generators/classes"), require("./generators/methods"), require("./generators/modules"), require("./generators/types"), require("./generators/flow"), require("./generators/base"), require("./generators/jsx")];


for ( /*istanbul ignore next*/var _i2 = 0; _i2 < _arr.length; _i2++) {
  var generator = /*istanbul ignore next*/_arr[_i2];
  /*istanbul ignore next*/(0, _assign2.default)(Printer.prototype, generator);
}
/*istanbul ignore next*/module.exports = exports["default"];