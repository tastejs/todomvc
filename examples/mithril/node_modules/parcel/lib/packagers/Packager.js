"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const fs = require('fs');

const _require = require('@parcel/utils'),
      promisify = _require.promisify;

const path = require('path');

const _require2 = require('@parcel/fs'),
      mkdirp = _require2.mkdirp;

class Packager {
  constructor(bundle, bundler) {
    this.bundle = bundle;
    this.bundler = bundler;
    this.options = bundler.options;
  }

  static shouldAddAsset() {
    return true;
  }

  setup() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Create sub-directories if needed
      if (_this.bundle.name.includes(path.sep)) {
        yield mkdirp(path.dirname(_this.bundle.name));
      }

      _this.dest = fs.createWriteStream(_this.bundle.name);
      _this.dest.write = promisify(_this.dest.write.bind(_this.dest));
      _this.dest.end = promisify(_this.dest.end.bind(_this.dest));
    })();
  }

  write(string) {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this2.dest.write(string);
    })();
  }

  start() {
    return (0, _asyncToGenerator2.default)(function* () {})();
  } // eslint-disable-next-line no-unused-vars


  addAsset(asset) {
    return (0, _asyncToGenerator2.default)(function* () {
      throw new Error('Must be implemented by subclasses');
    })();
  }

  getSize() {
    return this.dest.bytesWritten;
  }

  end() {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this3.dest.end();
    })();
  }

}

module.exports = Packager;