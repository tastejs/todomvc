"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const postcss = require('postcss');

const localRequire = require('../utils/localRequire');

const Asset = require('../Asset');

class SSSAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'css';
  }

  generate() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let sugarss = yield localRequire('sugarss', _this.name);
      yield _this.loadIfNeeded();

      let _ref = yield postcss().process(_this.contents, {
        from: _this.name,
        to: _this.name,
        parser: sugarss
      }),
          css = _ref.css;

      return [{
        type: 'css',
        value: css
      }];
    })();
  }

}

module.exports = SSSAsset;