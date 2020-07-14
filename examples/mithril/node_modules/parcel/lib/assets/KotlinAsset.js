"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Asset = require('../Asset');

const localRequire = require('../utils/localRequire');

const path = require('path');

const fs = require('@parcel/fs');

const os = require('os');

class KotlinAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  generate() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // require kotlin
      const kotlinCompiler = yield localRequire('@jetbrains/kotlinc-js-api', _this.name);
      let id = Math.random().toString(36).slice(3);
      let dir = path.join(os.tmpdir(), id);
      let filename = path.join(dir, id + '.js');
      yield fs.mkdirp(dir);
      yield kotlinCompiler.compile({
        output: filename,
        sources: [_this.name],
        moduleKind: 'commonjs',
        noStdlib: false,
        metaInfo: true,
        sourceMaps: _this.options.sourceMaps
      });
      let source = yield fs.readFile(filename, 'utf8');
      let sourceMap;

      if (_this.options.sourceMaps) {
        sourceMap = yield fs.readFile(filename + '.map', 'utf8');
        sourceMap = JSON.parse(sourceMap);
        sourceMap.sources = [_this.relativeName];
        sourceMap.sourcesContent = [_this.contents]; // remove source map url

        source = source.substring(0, source.lastIndexOf('//# sourceMappingURL'));
      } // delete temp directory


      yield fs.rimraf(dir);
      return [{
        type: 'js',
        value: source,
        sourceMap
      }];
    })();
  }

}

module.exports = KotlinAsset;