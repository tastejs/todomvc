"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const URL = require('url');

const path = require('path');

const clone = require('clone');

const fs = require('@parcel/fs');

const md5 = require('./utils/md5');

const isURL = require('./utils/is-url');

const config = require('./utils/config');

const syncPromise = require('./utils/syncPromise');

const logger = require('@parcel/logger');

const Resolver = require('./Resolver');

const objectHash = require('./utils/objectHash');

const t = require('babel-types');
/**
 * An Asset represents a file in the dependency tree. Assets can have multiple
 * parents that depend on it, and can be added to multiple output bundles.
 * The base Asset class doesn't do much by itself, but sets up an interface
 * for subclasses to implement.
 */


class Asset {
  constructor(name, options) {
    this.id = null;
    this.name = name;
    this.basename = path.basename(this.name);
    this.relativeName = path.relative(options.rootDir, this.name).replace(/\\/g, '/');
    this.options = options;
    this.encoding = 'utf8';
    this.type = path.extname(this.name).slice(1);
    this.hmrPageReload = false;
    this.processed = false;
    this.contents = options.rendition ? options.rendition.value : null;
    this.ast = null;
    this.generated = null;
    this.hash = null;
    this.sourceMaps = null;
    this.parentDeps = new Set();
    this.dependencies = new Map();
    this.depAssets = new Map();
    this.parentBundle = null;
    this.bundles = new Set();
    this.cacheData = {};
    this.startTime = 0;
    this.endTime = 0;
    this.buildTime = 0;
    this.bundledSize = 0;
    this.resolver = new Resolver(options);
  }

  shouldInvalidate() {
    return false;
  }

  loadIfNeeded() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this.contents == null) {
        _this.contents = yield _this.load();
      }
    })();
  }

  parseIfNeeded() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this2.loadIfNeeded();

      if (!_this2.ast) {
        _this2.ast = yield _this2.parse(_this2.contents);
      }
    })();
  }

  getDependencies() {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this3.options.rendition && _this3.options.rendition.hasDependencies === false) {
        return;
      }

      yield _this3.loadIfNeeded();

      if (_this3.contents && _this3.mightHaveDependencies()) {
        yield _this3.parseIfNeeded();
        yield _this3.collectDependencies();
      }
    })();
  }

  addDependency(name, opts) {
    this.dependencies.set(name, Object.assign({
      name
    }, opts));
  }

  resolveDependency(url, from = this.name) {
    const parsed = URL.parse(url);
    let depName;
    let resolved;
    let dir = path.dirname(from);
    const filename = decodeURIComponent(parsed.pathname);

    if (filename[0] === '~' || filename[0] === '/') {
      if (dir === '.') {
        dir = this.options.rootDir;
      }

      depName = resolved = this.resolver.resolveFilename(filename, dir);
    } else {
      resolved = path.resolve(dir, filename);
      depName = './' + path.relative(path.dirname(this.name), resolved);
    }

    return {
      depName,
      resolved
    };
  }

  addURLDependency(url, from = this.name, opts) {
    if (!url || isURL(url)) {
      return url;
    }

    if (typeof from === 'object') {
      opts = from;
      from = this.name;
    }

    const _this$resolveDependen = this.resolveDependency(url, from),
          depName = _this$resolveDependen.depName,
          resolved = _this$resolveDependen.resolved;

    this.addDependency(depName, Object.assign({
      dynamic: true,
      resolved
    }, opts));
    const parsed = URL.parse(url);
    parsed.pathname = this.options.parser.getAsset(resolved, this.options).generateBundleName();
    return URL.format(parsed);
  }

  get package() {
    logger.warn('`asset.package` is deprecated. Please use `await asset.getPackage()` instead.');
    return syncPromise(this.getPackage());
  }

  getPackage() {
    var _this4 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (!_this4._package) {
        _this4._package = yield _this4.resolver.findPackage(path.dirname(_this4.name));
      }

      return _this4._package;
    })();
  }

  getConfig(filenames, opts = {}) {
    var _this5 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (opts.packageKey) {
        let pkg = yield _this5.getPackage();

        if (pkg && pkg[opts.packageKey]) {
          return clone(pkg[opts.packageKey]);
        }
      } // Resolve the config file


      let conf = yield config.resolve(opts.path || _this5.name, filenames);

      if (conf) {
        // Add as a dependency so it is added to the watcher and invalidates
        // this asset when the config changes.
        _this5.addDependency(conf, {
          includedInParent: true
        });

        if (opts.load === false) {
          return conf;
        }

        return config.load(opts.path || _this5.name, filenames);
      }

      return null;
    })();
  }

  mightHaveDependencies() {
    return true;
  }

  load() {
    var _this6 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return fs.readFile(_this6.name, _this6.encoding);
    })();
  }

  parse() {// do nothing by default
  }

  collectDependencies() {// do nothing by default
  }

  pretransform() {// do nothing by default

    return (0, _asyncToGenerator2.default)(function* () {})();
  }

  transform() {// do nothing by default

    return (0, _asyncToGenerator2.default)(function* () {})();
  }

  generate() {
    var _this7 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      return {
        [_this7.type]: _this7.contents
      };
    })();
  }

  process() {
    var _this8 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Generate the id for this asset, unless it has already been set.
      // We do this here rather than in the constructor to avoid unnecessary work in the main process.
      // In development, the id is just the relative path to the file, for easy debugging and performance.
      // In production, we use a short hash of the relative path.
      if (!_this8.id) {
        _this8.id = _this8.options.production || _this8.options.scopeHoist ? t.toIdentifier(md5(_this8.relativeName, 'base64')).slice(0, 4) : _this8.relativeName;
      }

      if (!_this8.generated) {
        yield _this8.loadIfNeeded();
        yield _this8.pretransform();
        yield _this8.getDependencies();
        yield _this8.transform();
        _this8.generated = yield _this8.generate();
      }

      return _this8.generated;
    })();
  }

  postProcess(generated) {
    return (0, _asyncToGenerator2.default)(function* () {
      return generated;
    })();
  }

  generateHash() {
    return objectHash(this.generated);
  }

  invalidate() {
    this.processed = false;
    this.contents = null;
    this.ast = null;
    this.generated = null;
    this.hash = null;
    this.dependencies.clear();
    this.depAssets.clear();
  }

  invalidateBundle() {
    this.parentBundle = null;
    this.bundles.clear();
    this.parentDeps.clear();
  }

  generateBundleName() {
    // Generate a unique name. This will be replaced with a nicer
    // name later as part of content hashing.
    return md5(this.relativeName) + '.' + this.type;
  }

  replaceBundleNames(bundleNameMap) {
    let copied = false;

    for (let key in this.generated) {
      let value = this.generated[key];

      if (typeof value === 'string') {
        // Replace temporary bundle names in the output with the final content-hashed names.
        let newValue = value;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = bundleNameMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let _step$value = (0, _slicedToArray2.default)(_step.value, 2),
                name = _step$value[0],
                map = _step$value[1];

            newValue = newValue.split(name).join(map);
          } // Copy `this.generated` on write so we don't end up writing the final names to the cache.

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

        if (newValue !== value && !copied) {
          this.generated = Object.assign({}, this.generated);
          copied = true;
        }

        this.generated[key] = newValue;
      }
    }
  }

  generateErrorMessage(err) {
    return err;
  }

}

module.exports = Asset;