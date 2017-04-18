/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var /*istanbul ignore next*/_node = require("debug/node");

/*istanbul ignore next*/
var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var verboseDebug = /*istanbul ignore next*/(0, _node2.default)("babel:verbose");
var generalDebug = /*istanbul ignore next*/(0, _node2.default)("babel");

var seenDeprecatedMessages = [];

/*istanbul ignore next*/
var Logger = function () {
  function /*istanbul ignore next*/Logger(file, filename) {
    /*istanbul ignore next*/(0, _classCallCheck3.default)(this, Logger);

    this.filename = filename;
    this.file = file;
  }

  Logger.prototype._buildMessage = function _buildMessage(msg) {
    var parts = /*istanbul ignore next*/"[BABEL] " + this.filename;
    if (msg) parts += /*istanbul ignore next*/": " + msg;
    return parts;
  };

  Logger.prototype.warn = function warn(msg) {
    console.warn(this._buildMessage(msg));
  };

  Logger.prototype.error = function error(msg) {
    /*istanbul ignore next*/var Constructor = arguments.length <= 1 || arguments[1] === undefined ? Error : arguments[1];

    throw new Constructor(this._buildMessage(msg));
  };

  Logger.prototype.deprecate = function deprecate(msg) {
    if (this.file.opts && this.file.opts.suppressDeprecationMessages) return;

    msg = this._buildMessage(msg);

    // already seen this message
    if (seenDeprecatedMessages.indexOf(msg) >= 0) return;

    // make sure we don't see it again
    seenDeprecatedMessages.push(msg);

    console.error(msg);
  };

  Logger.prototype.verbose = function verbose(msg) {
    if (verboseDebug.enabled) verboseDebug(this._buildMessage(msg));
  };

  Logger.prototype.debug = function debug(msg) {
    if (generalDebug.enabled) generalDebug(this._buildMessage(msg));
  };

  Logger.prototype.deopt = function deopt(node, msg) {
    this.debug(msg);
  };

  return Logger;
}();

/*istanbul ignore next*/exports.default = Logger;
/*istanbul ignore next*/module.exports = exports["default"];