"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Packager = require('./Packager');

const path = require('path');

const fs = require('@parcel/fs');

class RawPackager extends Packager {
  static shouldAddAsset() {
    // We cannot combine multiple raw assets together - they should be written as separate bundles.
    return false;
  } // Override so we don't create a file for this bundle.
  // Each asset will be emitted as a separate file instead.


  setup() {}

  addAsset(asset) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let contents = asset.generated[_this.bundle.type];

      if (!contents || contents && contents.path) {
        contents = yield fs.readFile(contents ? contents.path : asset.name);
      } // Create sub-directories if needed


      if (_this.bundle.name.includes(path.sep)) {
        yield fs.mkdirp(path.dirname(_this.bundle.name));
      }

      _this.size = contents.length;
      yield fs.writeFile(_this.bundle.name, contents);
    })();
  }

  getSize() {
    return this.size || 0;
  }

  end() {}

}

module.exports = RawPackager;