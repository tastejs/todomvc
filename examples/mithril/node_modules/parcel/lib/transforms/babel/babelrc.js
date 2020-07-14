"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const semver = require('semver');

const logger = require('@parcel/logger');

const path = require('path');

const localRequire = require('../../utils/localRequire');

const installPackage = require('../../utils/installPackage');

const fs = require('@parcel/fs');

const micromatch = require('micromatch');

function getBabelConfig(_x, _x2) {
  return _getBabelConfig.apply(this, arguments);
}

function _getBabelConfig() {
  _getBabelConfig = (0, _asyncToGenerator2.default)(function* (asset, isSource) {
    let config = yield getBabelRc(asset, isSource);

    if (!config) {
      return null;
    } // Ignore if the config is empty.


    if ((!config.plugins || config.plugins.length === 0) && (!config.presets || config.presets.length === 0)) {
      return null;
    }

    let plugins = yield installPlugins(asset, config);
    let babelVersion = yield getBabelVersion(asset, plugins);
    return {
      babelVersion,
      config
    };
  });
  return _getBabelConfig.apply(this, arguments);
}

module.exports = getBabelConfig;
/**
 * Finds a .babelrc for an asset. By default, .babelrc files inside node_modules are not used.
 * However, there are some exceptions:
 *   - if `browserify.transforms` includes "babelify" in package.json (for legacy module compat)
 *   - the `source` field in package.json is used by the resolver
 */

function getBabelRc(_x3, _x4) {
  return _getBabelRc.apply(this, arguments);
}

function _getBabelRc() {
  _getBabelRc = (0, _asyncToGenerator2.default)(function* (asset, isSource) {
    // Support legacy browserify packages
    let pkg = yield asset.getPackage();
    let browserify = pkg && pkg.browserify;

    if (browserify && Array.isArray(browserify.transform)) {
      // Look for babelify in the browserify transform list
      let babelify = browserify.transform.find(t => (Array.isArray(t) ? t[0] : t) === 'babelify'); // If specified as an array, override the config with the one specified

      if (Array.isArray(babelify) && babelify[1]) {
        return babelify[1];
      } // Otherwise, return the .babelrc if babelify was found


      return babelify ? findBabelRc(asset) : null;
    } // If this asset is not in node_modules, always use the .babelrc


    if (isSource) {
      return findBabelRc(asset);
    } // Otherwise, don't load .babelrc for node_modules.
    // See https://github.com/parcel-bundler/parcel/issues/13.


    return null;
  });
  return _getBabelRc.apply(this, arguments);
}

function findBabelRc(_x5) {
  return _findBabelRc.apply(this, arguments);
}

function _findBabelRc() {
  _findBabelRc = (0, _asyncToGenerator2.default)(function* (asset) {
    // TODO: use the babel API to do this config resolution and support all of its features.
    // This is not currently possible because babel tries to actually load plugins and presets
    // while resolving the config, but those plugins might not be installed yet.
    let config = yield asset.getConfig(['.babelrc', '.babelrc.js'], {
      packageKey: 'babel'
    });

    if (!config) {
      return null;
    }

    if (typeof config === 'function') {
      // We cannot support function configs since there is no exposed method in babel
      // to create the API that is passed to them...
      throw new Error('Parcel does not support function configs in .babelrc.js yet.');
    }

    for (var _i = 0, _arr = ['extends', 'overrides', 'test', 'include', 'exclude']; _i < _arr.length; _i++) {
      let key = _arr[_i];

      if (config[key]) {
        throw new Error(`Parcel does not support babel 7 advanced configuration option "${key}" yet.`);
      }
    } // Support ignore/only config options.


    if (shouldIgnore(asset, config)) {
      return null;
    } // Support .babelignore


    let ignoreConfig = yield getIgnoreConfig(asset);

    if (ignoreConfig && shouldIgnore(asset, ignoreConfig)) {
      return null;
    }

    return config;
  });
  return _findBabelRc.apply(this, arguments);
}

function getIgnoreConfig(_x6) {
  return _getIgnoreConfig.apply(this, arguments);
}

function _getIgnoreConfig() {
  _getIgnoreConfig = (0, _asyncToGenerator2.default)(function* (asset) {
    let ignoreFile = yield asset.getConfig(['.babelignore'], {
      load: false
    });

    if (!ignoreFile) {
      return null;
    }

    let data = yield fs.readFile(ignoreFile, 'utf8');
    let patterns = data.split('\n').map(line => line.replace(/#.*$/, '').trim()).filter(Boolean);
    return {
      ignore: patterns
    };
  });
  return _getIgnoreConfig.apply(this, arguments);
}

function shouldIgnore(asset, config) {
  if (config.ignore && matchesPatterns(config.ignore, asset.name)) {
    return true;
  }

  if (config.only && !matchesPatterns(config.only, asset.name)) {
    return true;
  }

  return false;
}

function matchesPatterns(patterns, path) {
  return patterns.some(pattern => {
    if (typeof pattern === 'function') {
      return !!pattern(path);
    }

    if (typeof pattern === 'string') {
      return micromatch.isMatch(path, '**/' + pattern + '/**');
    }

    return pattern.test(path);
  });
}

function getBabelVersion(_x7, _x8) {
  return _getBabelVersion.apply(this, arguments);
}

function _getBabelVersion() {
  _getBabelVersion = (0, _asyncToGenerator2.default)(function* (asset, plugins) {
    // Check the package.json to determine the babel version that is installed
    let pkg = yield asset.getPackage();
    let babelLegacy = getDependency(pkg, 'babel-core');
    let babelModern = getDependency(pkg, '@babel/core');

    if (babelModern) {
      return getMaxMajor(babelModern);
    }

    if (babelLegacy) {
      return 6;
    } // No version was installed. This is either an old app where we didn't require a version to be installed,
    // or a new app that just added a .babelrc without manually installing a version of babel core.
    // We will attempt to infer a verison of babel and install it based on the dependencies of the plugins
    // in the config. This should only happen once since we save babel core into package.json for subsequent runs.


    let inferred = yield inferBabelVersion(asset, plugins);
    let name = inferred === 6 ? 'babel-core' : `@babel/core`;
    yield installPackage(name, asset.name);
    return inferred;
  });
  return _getBabelVersion.apply(this, arguments);
}

function getDependency(pkg, dep) {
  return pkg.dependencies && pkg.dependencies[dep] || pkg.peerDependencies && pkg.peerDependencies[dep] || pkg.devDependencies && pkg.devDependencies[dep];
} // Core babel packages we use to infer the major version of babel to use.


const CORE_DEPS = new Set(['@babel/core', '@babel/runtime', '@babel/template', '@babel/traverse', '@babel/types', '@babel/parser', '@babel/cli', '@babel/register', '@babel/generator', 'babel-core', 'babel-runtime', 'babel-template', 'babel-traverse', 'babel-types', 'babylon', 'babel-cli', 'babel-register', 'babel-generator']);

function inferBabelVersion(_x9, _x10) {
  return _inferBabelVersion.apply(this, arguments);
}

function _inferBabelVersion() {
  _inferBabelVersion = (0, _asyncToGenerator2.default)(function* (asset, plugins) {
    // Attempt to determine version based on dependencies of plugins
    let version;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let pkg = _step.value;

        if (!pkg) {
          continue;
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = CORE_DEPS[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            let name = _step2.value;
            let dep = getDependency(pkg, name);

            if (dep) {
              // Parse version range (ignore prerelease), and ensure it overlaps with the existing version (if any)
              let range = new semver.Range(dep.replace(/-.*(\s|\|\||$)?/, ''));

              if (version && !version.intersects(range)) {
                throw new Error('Conflicting babel versions found in .babelrc. Make sure all of your plugins and presets depend on the same major version of babel.');
              }

              version = range;
              break;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      } // Find the maximum major version allowed in the range and use that.
      // e.g. if ^6 || ^7 were specified, use 7.

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

    version = getMaxMajor(version);

    if (!version) {
      logger.warn(`Could not infer babel version. Defaulting to babel 7. Please add either babel-core or @babel/core as a dependency.`);
      version = 7;
    }

    return version;
  });
  return _inferBabelVersion.apply(this, arguments);
}

function getPluginName(p) {
  return Array.isArray(p) ? p[0] : p;
}

function getMaxMajor(version) {
  try {
    let range = new semver.Range(version);
    let sorted = range.set.sort((a, b) => a[0].semver.compare(b[0].semver));
    return semver.major(sorted.pop()[0].semver.version);
  } catch (err) {
    return null;
  }
}

function installPlugins(_x11, _x12) {
  return _installPlugins.apply(this, arguments);
}

function _installPlugins() {
  _installPlugins = (0, _asyncToGenerator2.default)(function* (asset, babelrc) {
    let presets = (babelrc.presets || []).map(p => resolveModule('preset', getPluginName(p), asset.name));
    let plugins = (babelrc.plugins || []).map(p => resolveModule('plugin', getPluginName(p), asset.name));
    return Promise.all([...presets, ...plugins]);
  });
  return _installPlugins.apply(this, arguments);
}

function resolveModule(_x13, _x14, _x15) {
  return _resolveModule.apply(this, arguments);
} // Copied from https://github.com/babel/babel/blob/3a399d1eb907df520f2b85bf9ddbc6533e256f6d/packages/babel-core/src/config/files/plugins.js#L61


function _resolveModule() {
  _resolveModule = (0, _asyncToGenerator2.default)(function* (type, name, path) {
    try {
      name = standardizeName(type, name);

      let _ref = yield localRequire.resolve(name, path),
          _ref2 = (0, _slicedToArray2.default)(_ref, 2),
          pkg = _ref2[1];

      return pkg;
    } catch (err) {
      return null;
    }
  });
  return _resolveModule.apply(this, arguments);
}

const EXACT_RE = /^module:/;
const BABEL_PLUGIN_PREFIX_RE = /^(?!@|module:|[^/]+\/|babel-plugin-)/;
const BABEL_PRESET_PREFIX_RE = /^(?!@|module:|[^/]+\/|babel-preset-)/;
const BABEL_PLUGIN_ORG_RE = /^(@babel\/)(?!plugin-|[^/]+\/)/;
const BABEL_PRESET_ORG_RE = /^(@babel\/)(?!preset-|[^/]+\/)/;
const OTHER_PLUGIN_ORG_RE = /^(@(?!babel\/)[^/]+\/)(?![^/]*babel-plugin(?:-|\/|$)|[^/]+\/)/;
const OTHER_PRESET_ORG_RE = /^(@(?!babel\/)[^/]+\/)(?![^/]*babel-preset(?:-|\/|$)|[^/]+\/)/;
const OTHER_ORG_DEFAULT_RE = /^(@(?!babel$)[^/]+)$/;

function standardizeName(type, name) {
  // Let absolute and relative paths through.
  if (path.isAbsolute(name)) return name;
  const isPreset = type === 'preset';
  return name // foo -> babel-preset-foo
  .replace(isPreset ? BABEL_PRESET_PREFIX_RE : BABEL_PLUGIN_PREFIX_RE, `babel-${type}-`) // @babel/es2015 -> @babel/preset-es2015
  .replace(isPreset ? BABEL_PRESET_ORG_RE : BABEL_PLUGIN_ORG_RE, `$1${type}-`) // @foo/mypreset -> @foo/babel-preset-mypreset
  .replace(isPreset ? OTHER_PRESET_ORG_RE : OTHER_PLUGIN_ORG_RE, `$1babel-${type}-`) // @foo -> @foo/babel-preset
  .replace(OTHER_ORG_DEFAULT_RE, `$1/babel-${type}`) // module:mypreset -> mypreset
  .replace(EXACT_RE, '');
}