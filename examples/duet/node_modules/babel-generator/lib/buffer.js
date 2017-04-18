/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var /*istanbul ignore next*/_repeat = require("lodash/repeat");

/*istanbul ignore next*/
var _repeat2 = _interopRequireDefault(_repeat);

var /*istanbul ignore next*/_trimEnd = require("lodash/trimEnd");

/*istanbul ignore next*/
var _trimEnd2 = _interopRequireDefault(_trimEnd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Buffer for collecting generated output.
 */

var Buffer = function () {
  function /*istanbul ignore next*/Buffer(position, format) {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, Buffer);

    this.printedCommentStarts = {};
    this.parenPushNewlineState = null;
    this.position = position;
    this._indent = format.indent.base;
    this.format = format;
    this.buf = "";

    // Maintaining a reference to the last char in the buffer is an optimization
    // to make sure that v8 doesn't "flatten" the string more often than needed
    // see https://github.com/babel/babel/pull/3283 for details.
    this.last = "";

    this.map = null;
    this._sourcePosition = {
      line: null,
      column: null,
      filename: null
    };
  }

  /**
   * Description
   */

  Buffer.prototype.catchUp = function catchUp(node) {
    // catch up to this nodes newline if we're behind
    if (node.loc && this.format.retainLines && this.buf) {
      while (this.position.line < node.loc.start.line) {
        this._push("\n");
      }
    }
  };

  /**
   * Get the current trimmed buffer.
   */

  Buffer.prototype.get = function get() {
    return (/*istanbul ignore next*/(0, _trimEnd2.default)(this.buf)
    );
  };

  /**
   * Get the current indent.
   */

  Buffer.prototype.getIndent = function getIndent() {
    if (this.format.compact || this.format.concise) {
      return "";
    } else {
      return (/*istanbul ignore next*/(0, _repeat2.default)(this.format.indent.style, this._indent)
      );
    }
  };

  /**
   * Get the current indent size.
   */

  Buffer.prototype.indentSize = function indentSize() {
    return this.getIndent().length;
  };

  /**
   * Increment indent size.
   */

  Buffer.prototype.indent = function indent() {
    this._indent++;
  };

  /**
   * Decrement indent size.
   */

  Buffer.prototype.dedent = function dedent() {
    this._indent--;
  };

  /**
   * Add a semicolon to the buffer.
   */

  Buffer.prototype.semicolon = function semicolon() {
    this.push(";");
  };

  /**
   * Ensure last character is a semicolon.
   */

  Buffer.prototype.ensureSemicolon = function ensureSemicolon() {
    if (!this.isLast(";")) this.semicolon();
  };

  /**
   * Add a right brace to the buffer.
   */

  Buffer.prototype.rightBrace = function rightBrace() {
    this.newline(true);
    if (this.format.minified && !this._lastPrintedIsEmptyStatement) {
      this._removeLast(";");
    }
    this.push("}");
  };

  /**
   * Add a keyword to the buffer.
   */

  Buffer.prototype.keyword = function keyword(name) {
    this.push(name);
    this.space();
  };

  /**
   * Add a space to the buffer unless it is compact (override with force).
   */

  Buffer.prototype.space = function space(force) {
    if (!force && this.format.compact) return;

    if (force || this.buf && !this.isLast(" ") && !this.isLast("\n")) {
      this.push(" ");
    }
  };

  /**
   * Remove the last character.
   */

  Buffer.prototype.removeLast = function removeLast(cha) {
    if (this.format.compact) return;
    return this._removeLast(cha);
  };

  Buffer.prototype._removeLast = function _removeLast(cha) {
    if (!this._isLast(cha)) return;
    this.buf = this.buf.slice(0, -1);
    this.last = this.buf[this.buf.length - 1];
    this.position.unshift(cha);
  };

  /**
   * Set some state that will be modified if a newline has been inserted before any
   * non-space characters.
   *
   * This is to prevent breaking semantics for terminatorless separator nodes. eg:
   *
   *    return foo;
   *
   * returns `foo`. But if we do:
   *
   *   return
   *   foo;
   *
   *  `undefined` will be returned and not `foo` due to the terminator.
   */

  Buffer.prototype.startTerminatorless = function startTerminatorless() {
    return this.parenPushNewlineState = {
      printed: false
    };
  };

  /**
   * Print an ending parentheses if a starting one has been printed.
   */

  Buffer.prototype.endTerminatorless = function endTerminatorless(state) {
    if (state.printed) {
      this.dedent();
      this.newline();
      this.push(")");
    }
  };

  /**
   * Add a newline (or many newlines), maintaining formatting.
   * Strips multiple newlines if removeLast is true.
   */

  Buffer.prototype.newline = function newline(i, removeLast) {
    if (this.format.retainLines || this.format.compact) return;

    if (this.format.concise) {
      this.space();
      return;
    }

    // never allow more than two lines
    if (this.endsWith("\n\n")) return;

    if (typeof i === "boolean") removeLast = i;
    if (typeof i !== "number") i = 1;

    i = Math.min(2, i);
    if (this.endsWith("{\n") || this.endsWith(":\n")) i--;
    if (i <= 0) return;

    // remove the last newline
    if (removeLast) {
      this.removeLast("\n");
    }

    this.removeLast(" ");
    this._removeSpacesAfterLastNewline();
    this._push( /*istanbul ignore next*/(0, _repeat2.default)("\n", i));
  };

  /**
   * If buffer ends with a newline and some spaces after it, trim those spaces.
   */

  Buffer.prototype._removeSpacesAfterLastNewline = function _removeSpacesAfterLastNewline() {
    var lastNewlineIndex = this.buf.lastIndexOf("\n");
    if (lastNewlineIndex >= 0 && this.get().length <= lastNewlineIndex) {
      this.buf = this.buf.substring(0, lastNewlineIndex + 1);
      this.last = "\n";
    }
  };

  /**
   * Sets a given position as the current source location so generated code after this call
   * will be given this position in the sourcemap.
   */

  Buffer.prototype.source = function source(prop, loc) {
    if (prop && !loc) return;

    var pos = loc ? loc[prop] : null;

    this._sourcePosition.line = pos ? pos.line : null;
    this._sourcePosition.column = pos ? pos.column : null;
    this._sourcePosition.filename = loc && loc.filename || null;
  };

  /**
   * Call a callback with a specific source location and restore on completion.
   */

  Buffer.prototype.withSource = function withSource(prop, loc, cb) {
    // Use the call stack to manage a stack of "source location" data.
    var originalLine = this._sourcePosition.line;
    var originalColumn = this._sourcePosition.column;
    var originalFilename = this._sourcePosition.filename;

    this.source(prop, loc);

    cb();

    this._sourcePosition.line = originalLine;
    this._sourcePosition.column = originalColumn;
    this._sourcePosition.filename = originalFilename;
  };

  /**
   * Push a string to the buffer, maintaining indentation and newlines.
   */

  Buffer.prototype.push = function push(str, noIndent) {
    if (!this.format.compact && this._indent && !noIndent && str !== "\n") {
      // we have an indent level and we aren't pushing a newline
      var indent = this.getIndent();

      // replace all newlines with newlines with the indentation
      str = str.replace(/\n/g, /*istanbul ignore next*/"\n" + indent);

      // we've got a newline before us so prepend on the indentation
      if (this.isLast("\n")) this._push(indent);
    }

    this._push(str);
  };

  /**
   * Push a string to the buffer.
   */

  Buffer.prototype._push = function _push(str) {
    // see startTerminatorless() instance method
    var parenPushNewlineState = this.parenPushNewlineState;
    if (parenPushNewlineState) {
      for (var i = 0; i < str.length; i++) {
        var cha = str[i];

        // we can ignore spaces since they wont interupt a terminatorless separator
        if (cha === " ") continue;

        this.parenPushNewlineState = null;

        if (cha === "\n" || cha === "/") {
          // we're going to break this terminator expression so we need to add a parentheses
          this._push("(");
          this.indent();
          parenPushNewlineState.printed = true;
        }

        break;
      }
    }

    // If there the line is ending, adding a new mapping marker is redundant
    if (str[0] !== "\n") this.map.mark(this._sourcePosition);

    //
    this.position.push(str);
    this.buf += str;
    this.last = str[str.length - 1];
  };

  /**
   * Test if the buffer ends with a string.
   */

  Buffer.prototype.endsWith = function endsWith(str) {
    if (str.length === 1) {
      return this.last === str;
    } else {
      return this.buf.slice(-str.length) === str;
    }
  };

  /**
   * Test if a character is last in the buffer.
   */

  Buffer.prototype.isLast = function isLast(cha) {
    if (this.format.compact) return false;
    return this._isLast(cha);
  };

  Buffer.prototype._isLast = function _isLast(cha) {
    var last = this.last;

    if (Array.isArray(cha)) {
      return cha.indexOf(last) >= 0;
    } else {
      return cha === last;
    }
  };

  return Buffer;
}();

/*istanbul ignore next*/exports.default = Buffer;
/*istanbul ignore next*/module.exports = exports["default"];