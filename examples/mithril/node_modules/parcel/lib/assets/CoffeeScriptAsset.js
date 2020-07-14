"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Asset = require('../Asset');

const localRequire = require('../utils/localRequire');

class CoffeeScriptAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  generate() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // require coffeescript, installed locally in the app
      let coffee = yield localRequire('coffeescript', _this.name); // Transpile Module using CoffeeScript and parse result as ast format through babylon

      let transpiled = coffee.compile(_this.contents, {
        sourceMap: _this.options.sourceMaps
      });
      let sourceMap;

      if (transpiled.sourceMap) {
        sourceMap = transpiled.sourceMap.generate();
        sourceMap.sources = [_this.relativeName];
        sourceMap.sourcesContent = [_this.contents];
      }

      return [{
        type: 'js',
        value: _this.options.sourceMaps ? transpiled.js : transpiled,
        map: sourceMap
      }];
    })();
  }

}

module.exports = CoffeeScriptAsset;