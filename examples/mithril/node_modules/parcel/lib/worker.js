"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require('v8-compile-cache');

const Pipeline = require('./Pipeline');

let pipeline;

function init(options) {
  pipeline = new Pipeline(options || {});
  Object.assign(process.env, options.env || {});
  process.env.HMR_PORT = options.hmrPort;
  process.env.HMR_HOSTNAME = options.hmrHostname;
}

function run(_x, _x2) {
  return _run.apply(this, arguments);
}

function _run() {
  _run = (0, _asyncToGenerator2.default)(function* (path, isWarmUp) {
    try {
      return yield pipeline.process(path, isWarmUp);
    } catch (e) {
      e.fileName = path;
      throw e;
    }
  });
  return _run.apply(this, arguments);
}

exports.init = init;
exports.run = run;