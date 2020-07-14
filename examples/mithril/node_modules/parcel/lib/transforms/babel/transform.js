"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const babel6 = require('./babel6');

const babel7 = require('./babel7');

const getBabelConfig = require('./config');

function babelTransform(_x) {
  return _babelTransform.apply(this, arguments);
}

function _babelTransform() {
  _babelTransform = (0, _asyncToGenerator2.default)(function* (asset) {
    let config = yield getBabelConfig(asset);

    if (config[6]) {
      yield babel6(asset, config[6]);
    }

    if (config[7]) {
      yield babel7(asset, config[7]);
    }

    return asset.ast;
  });
  return _babelTransform.apply(this, arguments);
}

module.exports = babelTransform;