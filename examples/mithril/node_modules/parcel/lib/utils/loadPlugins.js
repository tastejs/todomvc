"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const localRequire = require('./localRequire');

module.exports =
/*#__PURE__*/
function () {
  var _loadPlugins = (0, _asyncToGenerator2.default)(function* (plugins, relative) {
    if (Array.isArray(plugins)) {
      return Promise.all(plugins.map(p => loadPlugin(p, relative)).filter(Boolean));
    } else if (typeof plugins === 'object') {
      let mapPlugins = yield Promise.all(Object.keys(plugins).map(p => loadPlugin(p, relative, plugins[p])));
      return mapPlugins.filter(Boolean);
    } else {
      return [];
    }
  });

  function loadPlugins(_x, _x2) {
    return _loadPlugins.apply(this, arguments);
  }

  return loadPlugins;
}();

function loadPlugin(_x3, _x4, _x5) {
  return _loadPlugin.apply(this, arguments);
}

function _loadPlugin() {
  _loadPlugin = (0, _asyncToGenerator2.default)(function* (plugin, relative, options) {
    if (typeof plugin === 'string') {
      plugin = yield localRequire(plugin, relative);
      plugin = plugin.default || plugin;

      if (typeof options !== 'object') {
        options = {};
      }

      if (Object.keys(options).length > 0) {
        plugin = plugin(options);
      }

      plugin = plugin.default || plugin;
    }

    return plugin;
  });
  return _loadPlugin.apply(this, arguments);
}