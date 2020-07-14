"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const fs = require('@parcel/fs');

function getCertificate(_x) {
  return _getCertificate.apply(this, arguments);
}

function _getCertificate() {
  _getCertificate = (0, _asyncToGenerator2.default)(function* (options) {
    try {
      let cert = yield fs.readFile(options.cert);
      let key = yield fs.readFile(options.key);
      return {
        key,
        cert
      };
    } catch (err) {
      throw new Error('Certificate and/or key not found');
    }
  });
  return _getCertificate.apply(this, arguments);
}

module.exports = getCertificate;