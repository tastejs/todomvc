"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const _require = require('path'),
      dirname = _require.dirname;

const _require2 = require('@parcel/utils'),
      promisify = _require2.promisify;

const resolve = promisify(require('resolve'));

const installPackage = require('./installPackage');

const getModuleParts = require('./getModuleParts');

const cache = new Map();

function localRequire(_x, _x2) {
  return _localRequire.apply(this, arguments);
}

function _localRequire() {
  _localRequire = (0, _asyncToGenerator2.default)(function* (name, path, triedInstall = false) {
    let _ref = yield localResolve(name, path, triedInstall),
        _ref2 = (0, _slicedToArray2.default)(_ref, 1),
        resolved = _ref2[0];

    return require(resolved);
  });
  return _localRequire.apply(this, arguments);
}

function localResolve(_x3, _x4) {
  return _localResolve.apply(this, arguments);
}

function _localResolve() {
  _localResolve = (0, _asyncToGenerator2.default)(function* (name, path, triedInstall = false) {
    let basedir = dirname(path);
    let key = basedir + ':' + name;
    let resolved = cache.get(key);

    if (!resolved) {
      try {
        resolved = yield resolve(name, {
          basedir
        });
      } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND' && !triedInstall) {
          const packageName = getModuleParts(name)[0];
          yield installPackage(packageName, path);
          return localResolve(name, path, true);
        }

        throw e;
      }

      cache.set(key, resolved);
    }

    return resolved;
  });
  return _localResolve.apply(this, arguments);
}

localRequire.resolve = localResolve;
module.exports = localRequire;