"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const loadPlugins = require('../utils/loadPlugins');

const posthtml = require('posthtml');

const posthtmlParse = require('posthtml-parser');

function parse(_x, _x2) {
  return _parse.apply(this, arguments);
}

function _parse() {
  _parse = (0, _asyncToGenerator2.default)(function* (code, asset) {
    var config = yield getConfig(asset);

    if (!config) {
      config = {};
    }

    return posthtmlParse(code, config);
  });
  return _parse.apply(this, arguments);
}

function transform(_x3) {
  return _transform.apply(this, arguments);
}

function _transform() {
  _transform = (0, _asyncToGenerator2.default)(function* (asset) {
    let config = yield getConfig(asset);

    if (!config) {
      return;
    }

    yield asset.parseIfNeeded();
    let res = yield posthtml(config.plugins).process(asset.ast, config);
    asset.ast = res.tree;
    asset.isAstDirty = true;
  });
  return _transform.apply(this, arguments);
}

function getConfig(_x4) {
  return _getConfig.apply(this, arguments);
}

function _getConfig() {
  _getConfig = (0, _asyncToGenerator2.default)(function* (asset) {
    let config = yield asset.getConfig(['.posthtmlrc', '.posthtmlrc.js', 'posthtml.config.js'], {
      packageKey: 'posthtml'
    });

    if (!config && !asset.options.minify) {
      return;
    }

    config = config || {};
    const plugins = config.plugins;

    if (typeof plugins === 'object') {
      // This is deprecated in favor of result messages but kept for compatibility
      // See https://github.com/posthtml/posthtml-include/blob/e4f2a57c2e52ff721eed747b65eddf7d7a1451e3/index.js#L18-L26
      const depConfig = {
        addDependencyTo: {
          addDependency: name => asset.addDependency(name, {
            includedInParent: true
          })
        }
      };
      Object.keys(plugins).forEach(p => Object.assign(plugins[p], depConfig));
    }

    config.plugins = yield loadPlugins(plugins, asset.name);
    config.skipParse = true;
    return config;
  });
  return _getConfig.apply(this, arguments);
}

module.exports = {
  parse,
  transform
};