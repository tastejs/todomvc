"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const fs = require('@parcel/fs');

const path = require('path');

const clone = require('clone');

const PARSERS = {
  json: require('json5').parse,
  toml: require('@iarna/toml').parse
};
const existsCache = new Map();

function resolve(_x, _x2) {
  return _resolve.apply(this, arguments);
}

function _resolve() {
  _resolve = (0, _asyncToGenerator2.default)(function* (filepath, filenames, root = path.parse(filepath).root) {
    filepath = path.dirname(filepath); // Don't traverse above the module root

    if (filepath === root || path.basename(filepath) === 'node_modules') {
      return null;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = filenames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const filename = _step.value;
        let file = path.join(filepath, filename);
        let exists = existsCache.has(file) ? existsCache.get(file) : yield fs.exists(file);

        if (exists) {
          existsCache.set(file, true);
          return file;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return resolve(filepath, filenames, root);
  });
  return _resolve.apply(this, arguments);
}

function load(_x3, _x4) {
  return _load.apply(this, arguments);
}

function _load() {
  _load = (0, _asyncToGenerator2.default)(function* (filepath, filenames, root = path.parse(filepath).root) {
    let configFile = yield resolve(filepath, filenames, root);

    if (configFile) {
      try {
        let extname = path.extname(configFile).slice(1);

        if (extname === 'js') {
          return clone(require(configFile));
        }

        let configContent = (yield fs.readFile(configFile)).toString();
        let parse = PARSERS[extname] || PARSERS.json;
        return configContent ? parse(configContent) : null;
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND' || err.code === 'ENOENT') {
          existsCache.delete(configFile);
          return null;
        }

        throw err;
      }
    }

    return null;
  });
  return _load.apply(this, arguments);
}

exports.resolve = resolve;
exports.load = load;