"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const path = require('path');

const Packager = require('./Packager');

const SourceMap = require('../SourceMap');

class SourceMapPackager extends Packager {
  start() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this.sourceMap = new SourceMap();
    })();
  }

  addAsset(asset) {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let offsets = _this2.bundle.parentBundle.getOffset(asset);

      if (asset.sourceMaps[asset.type]) {
        yield _this2.sourceMap.addMap(asset.sourceMaps[asset.type], offsets[0], offsets[1]);
      }
    })();
  }

  end() {
    var _this3 = this,
        _superprop_callEnd = (..._args) => super.end(..._args);

    return (0, _asyncToGenerator2.default)(function* () {
      let file = path.basename(_this3.bundle.parentBundle.name);
      yield _this3.write(_this3.sourceMap.stringify(file, path.relative(_this3.options.outDir, _this3.options.rootDir)));
      yield _superprop_callEnd();
    })();
  }

}

module.exports = SourceMapPackager;