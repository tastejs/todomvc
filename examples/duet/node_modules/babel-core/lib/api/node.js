/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.transformFromAst = exports.transform = exports.analyse = exports.Pipeline = exports.OptionManager = exports.traverse = exports.types = exports.messages = exports.util = exports.version = exports.template = exports.buildExternalHelpers = exports.options = exports.File = undefined;

var _file = require("../transformation/file");

Object.defineProperty(exports, "File", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_file).default;
  }
});
/*istanbul ignore next*/
var _config = require("../transformation/file/options/config");

Object.defineProperty(exports, "options", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_config).default;
  }
});
/*istanbul ignore next*/
var _buildExternalHelpers = require("../tools/build-external-helpers");

Object.defineProperty(exports, "buildExternalHelpers", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_buildExternalHelpers).default;
  }
});
/*istanbul ignore next*/
var _babelTemplate = require("babel-template");

Object.defineProperty(exports, "template", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_babelTemplate).default;
  }
});
/*istanbul ignore next*/
var _package = require("../../package");

Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function get() {
    return _package.version;
  }
});
/*istanbul ignore next*/exports.Plugin = Plugin;
/*istanbul ignore next*/exports.transformFile = transformFile;
/*istanbul ignore next*/exports.transformFileSync = transformFileSync;

var /*istanbul ignore next*/_isFunction = require("lodash/isFunction");

/*istanbul ignore next*/
var _isFunction2 = _interopRequireDefault(_isFunction);

var /*istanbul ignore next*/_fs = require("fs");

/*istanbul ignore next*/
var _fs2 = _interopRequireDefault(_fs);

var /*istanbul ignore next*/_util = require("../util");

/*istanbul ignore next*/
var util = _interopRequireWildcard(_util);

var /*istanbul ignore next*/_babelMessages = require("babel-messages");

/*istanbul ignore next*/
var messages = _interopRequireWildcard(_babelMessages);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

var /*istanbul ignore next*/_babelTraverse = require("babel-traverse");

/*istanbul ignore next*/
var _babelTraverse2 = _interopRequireDefault(_babelTraverse);

var /*istanbul ignore next*/_optionManager = require("../transformation/file/options/option-manager");

/*istanbul ignore next*/
var _optionManager2 = _interopRequireDefault(_optionManager);

var /*istanbul ignore next*/_pipeline = require("../transformation/pipeline");

/*istanbul ignore next*/
var _pipeline2 = _interopRequireDefault(_pipeline);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//

exports.util = util;
/*istanbul ignore next*/exports.messages = messages;
/*istanbul ignore next*/exports.types = t;
/*istanbul ignore next*/exports.traverse = _babelTraverse2.default;
/*istanbul ignore next*/exports.OptionManager = _optionManager2.default;
function Plugin(alias) {
  throw new Error( /*istanbul ignore next*/"The (" + alias + ") Babel 5 plugin is being run with Babel 6.");
}

//

/*istanbul ignore next*/exports.Pipeline = _pipeline2.default;


var pipeline = new /*istanbul ignore next*/_pipeline2.default();
var analyse = /*istanbul ignore next*/exports.analyse = pipeline.analyse.bind(pipeline);
var transform = /*istanbul ignore next*/exports.transform = pipeline.transform.bind(pipeline);
var transformFromAst = /*istanbul ignore next*/exports.transformFromAst = pipeline.transformFromAst.bind(pipeline);

//

function transformFile(filename, opts, callback) {
  if ( /*istanbul ignore next*/(0, _isFunction2.default)(opts)) {
    callback = opts;
    opts = {};
  }

  opts.filename = filename;

  /*istanbul ignore next*/_fs2.default.readFile(filename, function (err, code) {
    var result = /*istanbul ignore next*/void 0;

    if (!err) {
      try {
        result = transform(code, opts);
      } catch (_err) {
        err = _err;
      }
    }

    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
}

function transformFileSync(filename) {
  /*istanbul ignore next*/var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  opts.filename = filename;
  return transform( /*istanbul ignore next*/_fs2.default.readFileSync(filename, "utf8"), opts);
}