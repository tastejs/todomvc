"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const config = require('./config');

const dotenv = require('dotenv');

const variableExpansion = require('dotenv-expand');

function loadEnv(_x) {
  return _loadEnv.apply(this, arguments);
}

function _loadEnv() {
  _loadEnv = (0, _asyncToGenerator2.default)(function* (filepath) {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const dotenvFiles = [`.env.${NODE_ENV}.local`, `.env.${NODE_ENV}`, // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    NODE_ENV !== 'test' && '.env.local', '.env'].filter(Boolean);
    yield Promise.all(dotenvFiles.map(
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2.default)(function* (dotenvFile) {
        const envPath = yield config.resolve(filepath, [dotenvFile]);

        if (envPath) {
          const envs = dotenv.config({
            path: envPath
          });
          variableExpansion(envs);
        }
      });

      return function (_x2) {
        return _ref.apply(this, arguments);
      };
    }()));
  });
  return _loadEnv.apply(this, arguments);
}

module.exports = loadEnv;