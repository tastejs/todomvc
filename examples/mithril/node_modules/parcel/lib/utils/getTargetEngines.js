"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const browserslist = require('browserslist');

const semver = require('semver');

const Path = require('path');

const DEFAULT_ENGINES = {
  browsers: ['> 0.25%'],
  node: '8'
};
/**
 * Loads target node and browser versions from the following locations:
 *   - package.json engines field
 *   - package.json browserslist field
 *   - browserslist or .browserslistrc files
 *   - .babelrc or .babelrc.js files with @babel/preset-env
 */

function getTargetEngines(_x, _x2) {
  return _getTargetEngines.apply(this, arguments);
}

function _getTargetEngines() {
  _getTargetEngines = (0, _asyncToGenerator2.default)(function* (asset, isTargetApp) {
    let targets = {};
    let path = isTargetApp ? Path.join(asset.options.rootDir, 'index') : asset.name;
    let compileTarget = asset.options.target === 'browser' ? 'browsers' : asset.options.target;
    let pkg = yield asset.getConfig(['package.json'], {
      path
    });
    let engines = pkg && pkg.engines;
    let nodeVersion = engines && getMinSemver(engines.node);

    if (compileTarget === 'node') {
      // Use package.engines.node by default if we are compiling for node.
      if (typeof nodeVersion === 'string') {
        targets.node = nodeVersion;
      }
    } else {
      if (engines && (typeof engines.browsers === 'string' || Array.isArray(engines.browsers))) {
        targets.browsers = engines.browsers;
      } else if (pkg && pkg.browserslist) {
        targets.browsers = pkg.browserslist;
      } else {
        let browserslist = yield loadBrowserslist(asset, path);

        if (browserslist) {
          targets.browsers = browserslist;
        } else {
          let babelTargets = yield loadBabelrc(asset, path);

          if (babelTargets && babelTargets.browsers) {
            targets.browsers = babelTargets.browsers;
          } else if (babelTargets && babelTargets.node && !nodeVersion) {
            nodeVersion = babelTargets.node;
          }
        }
      } // Fall back to package.engines.node for node_modules without any browser target info.


      if (!isTargetApp && !targets.browsers && typeof nodeVersion === 'string') {
        targets.node = nodeVersion;
      }
    } // If we didn't find any targets, set some default engines for the target app.


    if (isTargetApp && !targets[compileTarget] && DEFAULT_ENGINES[compileTarget]) {
      targets[compileTarget] = DEFAULT_ENGINES[compileTarget];
    } // Parse browser targets


    if (targets.browsers) {
      if (typeof targets.browsers === 'object' && !Array.isArray(targets.browsers)) {
        let env = asset.options.production ? 'production' : process.env.NODE_ENV || 'development';
        targets.browsers = targets.browsers[env] || targets.browsers.defaults;
      }

      if (targets.browsers) {
        targets.browsers = browserslist(targets.browsers).sort();
      }
    } // Dont compile if we couldn't find any targets


    if (Object.keys(targets).length === 0) {
      return null;
    }

    return targets;
  });
  return _getTargetEngines.apply(this, arguments);
}

function getMinSemver(version) {
  try {
    let range = new semver.Range(version);
    let sorted = range.set.sort((a, b) => a[0].semver.compare(b[0].semver));
    return sorted[0][0].semver.version;
  } catch (err) {
    return null;
  }
}

function loadBrowserslist(_x3, _x4) {
  return _loadBrowserslist.apply(this, arguments);
}

function _loadBrowserslist() {
  _loadBrowserslist = (0, _asyncToGenerator2.default)(function* (asset, path) {
    let config = yield asset.getConfig(['browserslist', '.browserslistrc'], {
      path,
      load: false
    });

    if (config) {
      return browserslist.readConfig(config);
    }
  });
  return _loadBrowserslist.apply(this, arguments);
}

function loadBabelrc(_x5, _x6) {
  return _loadBabelrc.apply(this, arguments);
}

function _loadBabelrc() {
  _loadBabelrc = (0, _asyncToGenerator2.default)(function* (asset, path) {
    let config = yield asset.getConfig(['.babelrc', '.babelrc.js'], {
      path
    });

    if (config && config.presets) {
      let env = config.presets.find(plugin => Array.isArray(plugin) && (plugin[0] === 'env' || plugin[0] === '@babel/env'));

      if (env && env[1] && env[1].targets) {
        return env[1].targets;
      }
    }
  });
  return _loadBabelrc.apply(this, arguments);
}

module.exports = getTargetEngines;