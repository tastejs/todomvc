"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Asset = require('../Asset');

const fs = require('@parcel/fs');

const localRequire = require('../utils/localRequire');

class ReasonAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  generate() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      const bsb = yield localRequire('bsb-js', _this.name); // This runs BuckleScript - the Reason to JS compiler.
      // Other Asset types use `localRequire` but the `bsb-js` package already
      // does that internally. This should also take care of error handling in
      // the Reason compilation process.

      if (process.env.NODE_ENV !== 'test') {
        yield bsb.runBuild();
      } // This is a simplified use-case for Reason - it only loads the recommended
      // BuckleScript configuration to simplify the file processing.


      const outputFile = _this.name.replace(/\.(re|ml)$/, '.bs.js');

      const outputContent = yield fs.readFile(outputFile);
      return outputContent.toString();
    })();
  }

}

module.exports = ReasonAsset;