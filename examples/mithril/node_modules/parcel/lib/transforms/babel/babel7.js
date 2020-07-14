"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const localRequire = require('../../utils/localRequire');

function babel7(_x, _x2) {
  return _babel.apply(this, arguments);
}

function _babel() {
  _babel = (0, _asyncToGenerator2.default)(function* (asset, options) {
    let config = options.config; // If this is an internally generated config, use our internal @babel/core,
    // otherwise require a local version from the package we're compiling.

    let babel = options.internal ? require('@babel/core') : yield localRequire('@babel/core', asset.name);
    let pkg = yield asset.getPackage();
    config.code = false;
    config.ast = true;
    config.filename = asset.name;
    config.cwd = pkg ? pkg.pkgdir : asset.options.rootDir;
    config.babelrc = false;
    config.configFile = false;
    config.parserOpts = Object.assign({}, config.parserOpts, {
      allowReturnOutsideFunction: true,
      strictMode: false,
      sourceType: 'module',
      plugins: ['dynamicImport']
    });
    let res;

    if (asset.ast) {
      res = babel.transformFromAst(asset.ast, asset.contents, config);
    } else {
      res = babel.transformSync(asset.contents, config);
    }

    if (res.ast) {
      asset.ast = res.ast;
      asset.isAstDirty = true;
    }
  });
  return _babel.apply(this, arguments);
}

module.exports = babel7;