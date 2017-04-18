/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.inspect = exports.inherits = undefined;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _util = require("util");

Object.defineProperty(exports, "inherits", {
  enumerable: true,
  get: function get() {
    return _util.inherits;
  }
});
/*istanbul ignore next*/Object.defineProperty(exports, "inspect", {
  enumerable: true,
  get: function get() {
    return _util.inspect;
  }
});
/*istanbul ignore next*/exports.canCompile = canCompile;
/*istanbul ignore next*/exports.list = list;
/*istanbul ignore next*/exports.regexify = regexify;
/*istanbul ignore next*/exports.arrayify = arrayify;
/*istanbul ignore next*/exports.booleanify = booleanify;
/*istanbul ignore next*/exports.shouldIgnore = shouldIgnore;

var /*istanbul ignore next*/_escapeRegExp = require("lodash/escapeRegExp");

/*istanbul ignore next*/
var _escapeRegExp2 = _interopRequireDefault(_escapeRegExp);

var /*istanbul ignore next*/_startsWith = require("lodash/startsWith");

/*istanbul ignore next*/
var _startsWith2 = _interopRequireDefault(_startsWith);

var /*istanbul ignore next*/_isBoolean = require("lodash/isBoolean");

/*istanbul ignore next*/
var _isBoolean2 = _interopRequireDefault(_isBoolean);

var /*istanbul ignore next*/_minimatch = require("minimatch");

/*istanbul ignore next*/
var _minimatch2 = _interopRequireDefault(_minimatch);

var /*istanbul ignore next*/_includes = require("lodash/includes");

/*istanbul ignore next*/
var _includes2 = _interopRequireDefault(_includes);

var /*istanbul ignore next*/_isString = require("lodash/isString");

/*istanbul ignore next*/
var _isString2 = _interopRequireDefault(_isString);

var /*istanbul ignore next*/_isRegExp = require("lodash/isRegExp");

/*istanbul ignore next*/
var _isRegExp2 = _interopRequireDefault(_isRegExp);

var /*istanbul ignore next*/_path = require("path");

/*istanbul ignore next*/
var _path2 = _interopRequireDefault(_path);

var /*istanbul ignore next*/_slash = require("slash");

/*istanbul ignore next*/
var _slash2 = _interopRequireDefault(_slash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Test if a filename ends with a compilable extension.
 */

function canCompile(filename, altExts) {
  var exts = altExts || canCompile.EXTENSIONS;
  var ext = /*istanbul ignore next*/_path2.default.extname(filename);
  return (/*istanbul ignore next*/(0, _includes2.default)(exts, ext)
  );
}

/**
 * Default set of compilable extensions.
 */

canCompile.EXTENSIONS = [".js", ".jsx", ".es6", ".es"];

/**
 * Create an array from any value, splitting strings by ",".
 */

function list(val) {
  if (!val) {
    return [];
  } else if (Array.isArray(val)) {
    return val;
  } else if (typeof val === "string") {
    return val.split(",");
  } else {
    return [val];
  }
}

/**
 * Create a RegExp from a string, array, or regexp.
 */

function regexify(val) {
  if (!val) {
    return new RegExp(/.^/);
  }

  if (Array.isArray(val)) {
    val = new RegExp(val.map( /*istanbul ignore next*/_escapeRegExp2.default).join("|"), "i");
  }

  if (typeof val === "string") {
    // normalise path separators
    val = /*istanbul ignore next*/(0, _slash2.default)(val);

    // remove starting wildcards or relative separator if present
    if ( /*istanbul ignore next*/(0, _startsWith2.default)(val, "./") || /*istanbul ignore next*/(0, _startsWith2.default)(val, "*/")) val = val.slice(2);
    if ( /*istanbul ignore next*/(0, _startsWith2.default)(val, "**/")) val = val.slice(3);

    var regex = /*istanbul ignore next*/_minimatch2.default.makeRe(val, { nocase: true });
    return new RegExp(regex.source.slice(1, -1), "i");
  }

  if ( /*istanbul ignore next*/(0, _isRegExp2.default)(val)) {
    return val;
  }

  throw new TypeError("illegal type for regexify");
}

/**
 * Create an array from a boolean, string, or array, mapped by and optional function.
 */

function arrayify(val, mapFn) {
  if (!val) return [];
  if ( /*istanbul ignore next*/(0, _isBoolean2.default)(val)) return arrayify([val], mapFn);
  if ( /*istanbul ignore next*/(0, _isString2.default)(val)) return arrayify(list(val), mapFn);

  if (Array.isArray(val)) {
    if (mapFn) val = val.map(mapFn);
    return val;
  }

  return [val];
}

/**
 * Makes boolean-like strings into booleans.
 */

function booleanify(val) {
  if (val === "true" || val == 1) {
    return true;
  }

  if (val === "false" || val == 0 || !val) {
    return false;
  }

  return val;
}

/**
 * Tests if a filename should be ignored based on "ignore" and "only" options.
 */

function shouldIgnore(filename) {
  /*istanbul ignore next*/var ignore = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  /*istanbul ignore next*/var only = arguments[2];

  filename = /*istanbul ignore next*/(0, _slash2.default)(filename);

  if (only) {
    for ( /*istanbul ignore next*/var _iterator = only, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
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

      var pattern = _ref;

      if (_shouldIgnore(pattern, filename)) return false;
    }
    return true;
  } else if (ignore.length) {
    for ( /*istanbul ignore next*/var _iterator2 = ignore, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
      /*istanbul ignore next*/
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var _pattern = _ref2;

      if (_shouldIgnore(_pattern, filename)) return true;
    }
  }

  return false;
}

/**
 * Returns result of calling function with filename if pattern is a function.
 * Otherwise returns result of matching pattern Regex with filename.
 */

function _shouldIgnore(pattern, filename) {
  if (typeof pattern === "function") {
    return pattern(filename);
  } else {
    return pattern.test(filename);
  }
}