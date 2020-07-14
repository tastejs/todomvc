"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const presetEnv = require('@babel/preset-env');

const getTargetEngines = require('../../utils/getTargetEngines');
/**
 * Generates a @babel/preset-env config for an asset.
 * This is done by finding the source module's target engines, and the app's
 * target engines, and doing a diff to include only the necessary plugins.
 */


function getEnvConfig(_x, _x2) {
  return _getEnvConfig.apply(this, arguments);
}

function _getEnvConfig() {
  _getEnvConfig = (0, _asyncToGenerator2.default)(function* (asset, isSourceModule) {
    // Load the target engines for the app and generate a @babel/preset-env config
    let targetEngines = yield getTargetEngines(asset, true);
    let targetEnv = yield getEnvPlugins(targetEngines, true);

    if (!targetEnv) {
      return null;
    } // If this is the app module, the source and target will be the same, so just compile everything.
    // Otherwise, load the source engines and generate a babel-present-env config.


    if (!isSourceModule) {
      let sourceEngines = yield getTargetEngines(asset, false);
      let sourceEnv = (yield getEnvPlugins(sourceEngines, false)) || targetEnv; // Do a diff of the returned plugins. We only need to process the remaining plugins to get to the app target.

      let sourcePlugins = new Set(sourceEnv.map(p => p[0]));
      targetEnv = targetEnv.filter(plugin => {
        return !sourcePlugins.has(plugin[0]);
      });
    }

    return {
      internal: true,
      babelVersion: 7,
      config: {
        plugins: targetEnv
      }
    };
  });
  return _getEnvConfig.apply(this, arguments);
}

const envCache = new Map();

function getEnvPlugins(_x3) {
  return _getEnvPlugins.apply(this, arguments);
}

function _getEnvPlugins() {
  _getEnvPlugins = (0, _asyncToGenerator2.default)(function* (targets, useBuiltIns = false) {
    if (!targets) {
      return null;
    }

    let key = JSON.stringify(targets);

    if (envCache.has(key)) {
      return envCache.get(key);
    }

    const options = {
      targets,
      modules: false,
      useBuiltIns: useBuiltIns ? 'entry' : false,
      shippedProposals: true
    };

    if (useBuiltIns) {
      options.corejs = 2;
    }

    let plugins = presetEnv.default({
      assertVersion: () => true
    }, options).plugins;
    envCache.set(key, plugins);
    return plugins;
  });
  return _getEnvPlugins.apply(this, arguments);
}

module.exports = getEnvConfig;