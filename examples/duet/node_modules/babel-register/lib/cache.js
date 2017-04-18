/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

exports.save = save;
/*istanbul ignore next*/exports.load = load;
/*istanbul ignore next*/exports.get = get;

var /*istanbul ignore next*/_path = require("path");

/*istanbul ignore next*/
var _path2 = _interopRequireDefault(_path);

var /*istanbul ignore next*/_fs = require("fs");

/*istanbul ignore next*/
var _fs2 = _interopRequireDefault(_fs);

var /*istanbul ignore next*/_mkdirp = require("mkdirp");

var /*istanbul ignore next*/_homeOrTmp = require("home-or-tmp");

/*istanbul ignore next*/
var _homeOrTmp2 = _interopRequireDefault(_homeOrTmp);

var /*istanbul ignore next*/_pathExists = require("path-exists");

/*istanbul ignore next*/
var _pathExists2 = _interopRequireDefault(_pathExists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FILENAME = process.env.BABEL_CACHE_PATH || /*istanbul ignore next*/_path2.default.join( /*istanbul ignore next*/_homeOrTmp2.default, ".babel.json");
var data = {};

/**
 * Write stringified cache to disk.
 */

function save() {
  var serialised = {};
  try {
    serialised = /*istanbul ignore next*/(0, _stringify2.default)(data, null, "  ");
  } catch (err) {
    if (err.message === "Invalid string length") {
      err.message = "Cache too large so it's been cleared.";
      console.error(err.stack);
    } else {
      throw err;
    }
  }
  /*istanbul ignore next*/(0, _mkdirp.sync)( /*istanbul ignore next*/_path2.default.dirname(FILENAME));
  /*istanbul ignore next*/_fs2.default.writeFileSync(FILENAME, serialised);
}

/**
 * Load cache from disk and parse.
 */

function load() {
  if (process.env.BABEL_DISABLE_CACHE) return;

  process.on("exit", save);
  process.nextTick(save);

  if (! /*istanbul ignore next*/_pathExists2.default.sync(FILENAME)) return;

  try {
    data = JSON.parse( /*istanbul ignore next*/_fs2.default.readFileSync(FILENAME));
  } catch (err) {
    return;
  }
}

/**
 * Retrieve data from cache.
 */

function get() {
  return data;
}