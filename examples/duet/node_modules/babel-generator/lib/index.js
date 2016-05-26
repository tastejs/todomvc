/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.CodeGenerator = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = function (ast, opts, code) {
  var gen = new CodeGenerator(ast, opts, code);
  return gen.generate();
};

var /*istanbul ignore next*/_detectIndent = require("detect-indent");

/*istanbul ignore next*/
var _detectIndent2 = _interopRequireDefault(_detectIndent);

var /*istanbul ignore next*/_whitespace = require("./whitespace");

/*istanbul ignore next*/
var _whitespace2 = _interopRequireDefault(_whitespace);

var /*istanbul ignore next*/_sourceMap = require("./source-map");

/*istanbul ignore next*/
var _sourceMap2 = _interopRequireDefault(_sourceMap);

var /*istanbul ignore next*/_position = require("./position");

/*istanbul ignore next*/
var _position2 = _interopRequireDefault(_position);

var /*istanbul ignore next*/_babelMessages = require("babel-messages");

/*istanbul ignore next*/
var messages = _interopRequireWildcard(_babelMessages);

var /*istanbul ignore next*/_printer = require("./printer");

/*istanbul ignore next*/
var _printer2 = _interopRequireDefault(_printer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Babel's code generator, turns an ast into code, maintaining sourcemaps,
 * user preferences, and valid output.
 */

var CodeGenerator = exports.CodeGenerator = function (_Printer) {
  (0, _inherits3.default)(CodeGenerator, _Printer);

  function /*istanbul ignore next*/CodeGenerator(ast, opts, code) {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, CodeGenerator);

    opts = opts || {};

    var comments = ast.comments || [];
    var tokens = ast.tokens || [];
    var format = CodeGenerator.normalizeOptions(code, opts, tokens);

    var position = new /*istanbul ignore next*/_position2.default();

    /*istanbul ignore next*/
    var _this = (0, _possibleConstructorReturn3.default)(this, /*istanbul ignore next*/_Printer.call( /*istanbul ignore next*/this, position, format));

    /*istanbul ignore next*/_this.comments = comments;
    /*istanbul ignore next*/_this.position = position;
    /*istanbul ignore next*/_this.tokens = tokens;
    /*istanbul ignore next*/_this.format = format;
    /*istanbul ignore next*/_this.opts = opts;
    /*istanbul ignore next*/_this.ast = ast;
    /*istanbul ignore next*/_this._inForStatementInitCounter = 0;

    /*istanbul ignore next*/_this.whitespace = new /*istanbul ignore next*/_whitespace2.default(tokens);
    /*istanbul ignore next*/_this.map = new /*istanbul ignore next*/_sourceMap2.default(position, opts, code);
    /*istanbul ignore next*/return _this;
  }

  /**
   * Normalize generator options, setting defaults.
   *
   * - Detects code indentation.
   * - If `opts.compact = "auto"` and the code is over 100KB, `compact` will be set to `true`.
    */

  CodeGenerator.normalizeOptions = function normalizeOptions(code, opts, tokens) {
    var style = "  ";
    if (code && typeof code === "string") {
      var _indent = /*istanbul ignore next*/(0, _detectIndent2.default)(code).indent;
      if (_indent && _indent !== " ") style = _indent;
    }

    var format = {
      auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
      auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
      shouldPrintComment: opts.shouldPrintComment,
      retainLines: opts.retainLines,
      comments: opts.comments == null || opts.comments,
      compact: opts.compact,
      minified: opts.minified,
      concise: opts.concise,
      quotes: opts.quotes || CodeGenerator.findCommonStringDelimiter(code, tokens),
      indent: {
        adjustMultilineComment: true,
        style: style,
        base: 0
      }
    };

    if (format.minified) {
      format.compact = true;
    }

    if (format.compact === "auto") {
      format.compact = code.length > 100000; // 100KB

      if (format.compact) {
        console.error("[BABEL] " + messages.get("codeGeneratorDeopt", opts.filename, "100KB"));
      }
    }

    if (format.compact) {
      format.indent.adjustMultilineComment = false;
    }

    return format;
  };

  /**
   * Determine if input code uses more single or double quotes.
   */


  CodeGenerator.findCommonStringDelimiter = function findCommonStringDelimiter(code, tokens) {
    var occurences = {
      single: 0,
      double: 0
    };

    var checked = 0;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (token.type.label !== "string") continue;

      var raw = code.slice(token.start, token.end);
      if (raw[0] === "'") {
        occurences.single++;
      } else {
        occurences.double++;
      }

      checked++;
      if (checked >= 3) break;
    }
    if (occurences.single > occurences.double) {
      return "single";
    } else {
      return "double";
    }
  };

  /**
   * Generate code and sourcemap from ast.
   *
   * Appends comments that weren't attached to any node to the end of the generated output.
   */

  CodeGenerator.prototype.generate = function generate() {
    this.print(this.ast);
    this.printAuxAfterComment();

    return {
      map: this.map.get(),
      code: this.get()
    };
  };

  return CodeGenerator;
}(_printer2.default);