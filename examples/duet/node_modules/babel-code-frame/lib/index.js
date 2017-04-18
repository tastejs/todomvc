/*istanbul ignore next*/"use strict";

exports.__esModule = true;

exports.default = function (rawLines, lineNumber, colNumber) {
  /*istanbul ignore next*/var opts = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  colNumber = Math.max(colNumber, 0);

  var highlighted = opts.highlightCode && /*istanbul ignore next*/_chalk2.default.supportsColor;
  if (highlighted) rawLines = highlight(rawLines);

  var lines = rawLines.split(NEWLINE);
  var start = Math.max(lineNumber - 3, 0);
  var end = Math.min(lines.length, lineNumber + 3);

  if (!lineNumber && !colNumber) {
    start = 0;
    end = lines.length;
  }

  var numberMaxWidth = String(end).length;

  var frame = lines.slice(start, end).map(function (line, index) {
    var number = start + 1 + index;
    var paddedNumber = /*istanbul ignore next*/(" " + number).slice(-numberMaxWidth);
    var gutter = /*istanbul ignore next*/" " + paddedNumber + " | ";
    if (number === lineNumber) {
      var markerLine = "";
      if (colNumber) {
        var markerSpacing = line.slice(0, colNumber - 1).replace(/[^\t]/g, " ");
        markerLine = /*istanbul ignore next*/"\n " + gutter.replace(/\d/g, " ") + markerSpacing + "^";
      }
      return (/*istanbul ignore next*/">" + gutter + line + markerLine
      );
    } else {
      return (/*istanbul ignore next*/" " + gutter + line
      );
    }
  }).join("\n");

  if (highlighted) {
    return (/*istanbul ignore next*/_chalk2.default.reset(frame)
    );
  } else {
    return frame;
  }
};

var /*istanbul ignore next*/_jsTokens = require("js-tokens");

/*istanbul ignore next*/
var _jsTokens2 = _interopRequireDefault(_jsTokens);

var /*istanbul ignore next*/_esutils = require("esutils");

/*istanbul ignore next*/
var _esutils2 = _interopRequireDefault(_esutils);

var /*istanbul ignore next*/_chalk = require("chalk");

/*istanbul ignore next*/
var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Chalk styles for token types.
 */

var defs = {
  string: /*istanbul ignore next*/_chalk2.default.red,
  punctuator: /*istanbul ignore next*/_chalk2.default.bold,
  curly: /*istanbul ignore next*/_chalk2.default.green,
  parens: /*istanbul ignore next*/_chalk2.default.blue.bold,
  square: /*istanbul ignore next*/_chalk2.default.yellow,
  keyword: /*istanbul ignore next*/_chalk2.default.cyan,
  number: /*istanbul ignore next*/_chalk2.default.magenta,
  regex: /*istanbul ignore next*/_chalk2.default.magenta,
  comment: /*istanbul ignore next*/_chalk2.default.grey,
  invalid: /*istanbul ignore next*/_chalk2.default.inverse
};

/**
 * RegExp to test for newlines in terminal.
 */

var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

/**
 * Get the type of token, specifying punctuator type.
 */

function getTokenType(match) {
  var token = /*istanbul ignore next*/_jsTokens2.default.matchToToken(match);
  if (token.type === "name" && /*istanbul ignore next*/_esutils2.default.keyword.isReservedWordES6(token.value)) {
    return "keyword";
  }

  if (token.type === "punctuator") {
    switch (token.value) {
      case "{":
      case "}":
        return "curly";
      case "(":
      case ")":
        return "parens";
      case "[":
      case "]":
        return "square";
    }
  }

  return token.type;
}

/**
 * Highlight `text`.
 */

function highlight(text) {
  return text.replace( /*istanbul ignore next*/_jsTokens2.default, function () {
    /*istanbul ignore next*/
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var type = getTokenType(args);
    var colorize = defs[type];
    if (colorize) {
      return args[0].split(NEWLINE).map(function (str) /*istanbul ignore next*/{
        return colorize(str);
      }).join("\n");
    } else {
      return args[0];
    }
  });
}

/**
 * Create a code frame, adding line numbers, code highlighting, and pointing to a given position.
 */

/*istanbul ignore next*/module.exports = exports["default"];