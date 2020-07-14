"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const path = require('path');

const Asset = require('../Asset');

const localRequire = require('../utils/localRequire');

class PugAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'html';
    this.hmrPageReload = true;
  }

  generate() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      const pug = yield localRequire('pug', _this.name);
      const config = (yield _this.getConfig(['.pugrc', '.pugrc.js', 'pug.config.js'])) || {};
      const compiled = pug.compile(_this.contents, {
        compileDebug: false,
        filename: _this.name,
        basedir: path.dirname(_this.name),
        pretty: config.pretty || false,
        templateName: path.basename(_this.basename, path.extname(_this.basename)),
        filters: config.filters,
        filterOptions: config.filterOptions,
        filterAliases: config.filterAliases
      });

      if (compiled.dependencies) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = compiled.dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let item = _step.value;

            _this.addDependency(item, {
              includedInParent: true
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return compiled(config.locals);
    })();
  }

}

module.exports = PugAsset;