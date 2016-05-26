/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var /*istanbul ignore next*/_sourceMap = require("source-map");

/*istanbul ignore next*/
var _sourceMap2 = _interopRequireDefault(_sourceMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build a sourcemap.
 */

var SourceMap = function () {
  function /*istanbul ignore next*/SourceMap(position, opts, code) {
    /*istanbul ignore next*/
    var _this = this;

    (0, _classCallCheck3.default)(this, SourceMap);

    this.position = position;
    this.opts = opts;
    this.last = { generated: {}, original: {} };

    if (opts.sourceMaps) {
      this.map = new /*istanbul ignore next*/_sourceMap2.default.SourceMapGenerator({
        file: opts.sourceMapTarget,
        sourceRoot: opts.sourceRoot
      });

      if (typeof code === "string") {
        this.map.setSourceContent(opts.sourceFileName, code);
      } else if ( /*istanbul ignore next*/(typeof code === "undefined" ? "undefined" : (0, _typeof3.default)(code)) === "object") {
        /*istanbul ignore next*/(0, _keys2.default)(code).forEach(function (sourceFileName) {
          /*istanbul ignore next*/_this.map.setSourceContent(sourceFileName, code[sourceFileName]);
        });
      }
    } else {
      this.map = null;
    }
  }

  /**
   * Get the sourcemap.
   */

  SourceMap.prototype.get = function get() {
    var map = this.map;
    if (map) {
      return map.toJSON();
    } else {
      return map;
    }
  };

  /**
   * Mark the current generated position with a source position. May also be passed null line/column
   * values to insert a mapping to nothing.
   */

  SourceMap.prototype.mark = function mark(sourcePos) {
    var map = this.map;
    if (!map) return; // no source map

    var position = this.position;

    // Adding an empty mapping at the start of a generated line just clutters the map.
    if (this._lastGenLine !== position.line && sourcePos.line === null) return;

    // If this mapping points to the same source location as the last one, we can ignore it since
    // the previous one covers it.
    if (this._lastGenLine === position.line && this._lastSourceLine === sourcePos.line && this._lastSourceColumn === sourcePos.column) {
      return;
    }

    this._lastGenLine = position.line;
    this._lastSourceLine = sourcePos.line;
    this._lastSourceColumn = sourcePos.column;

    map.addMapping({
      generated: {
        line: position.line,
        column: position.column
      },
      source: sourcePos.line == null ? null : sourcePos.filename || this.opts.sourceFileName,
      original: sourcePos.line == null ? null : {
        line: sourcePos.line,
        column: sourcePos.column
      }
    });
  };

  return SourceMap;
}();

/*istanbul ignore next*/exports.default = SourceMap;
/*istanbul ignore next*/module.exports = exports["default"];