"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const localRequire = require('../utils/localRequire');

const Asset = require('../Asset');

class MarkdownAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'html';
    this.hmrPageReload = true;
  }

  generate() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let marked = yield localRequire('marked', _this.name);
      return marked(_this.contents);
    })();
  }

}

module.exports = MarkdownAsset;