/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Track current position in code generation.
 */

var Position = function () {
  function /*istanbul ignore next*/Position() {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, Position);

    this.line = 1;
    this.column = 0;
  }

  /**
   * Push a string to the current position, mantaining the current line and column.
   */

  Position.prototype.push = function push(str) {
    for (var i = 0; i < str.length; i++) {
      if (str[i] === "\n") {
        this.line++;
        this.column = 0;
      } else {
        this.column++;
      }
    }
  };

  /**
   * Unshift a string from the current position, mantaining the current line and column.
   */

  Position.prototype.unshift = function unshift(str) {
    for (var i = 0; i < str.length; i++) {
      if (str[i] === "\n") {
        this.line--;
      } else {
        this.column--;
      }
    }
  };

  return Position;
}();

/*istanbul ignore next*/exports.default = Position;
/*istanbul ignore next*/module.exports = exports["default"];