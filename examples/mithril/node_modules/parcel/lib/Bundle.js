"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const Path = require('path');

const crypto = require('crypto');
/**
 * A Bundle represents an output file, containing multiple assets. Bundles can have
 * child bundles, which are bundles that are loaded dynamically from this bundle.
 * Child bundles are also produced when importing an asset of a different type from
 * the bundle, e.g. importing a CSS file from JS.
 */


class Bundle {
  constructor(type, name, parent, options = {}) {
    this.type = type;
    this.name = name;
    this.parentBundle = parent;
    this.entryAsset = null;
    this.assets = new Set();
    this.childBundles = new Set();
    this.siblingBundles = new Set();
    this.siblingBundlesMap = new Map();
    this.offsets = new Map();
    this.totalSize = 0;
    this.bundleTime = 0;
    this.isolated = options.isolated;
  }

  static createWithAsset(asset, parentBundle, options) {
    let bundle = new Bundle(asset.type, Path.join(asset.options.outDir, asset.generateBundleName()), parentBundle, options);
    bundle.entryAsset = asset;
    bundle.addAsset(asset);
    return bundle;
  }

  addAsset(asset) {
    asset.bundles.add(this);
    this.assets.add(asset);

    if (this.type != 'map' && this.type == asset.type && asset.options.sourceMaps && asset.sourceMaps) {
      this.getSiblingBundle('map').addAsset(asset);
    }
  }

  removeAsset(asset) {
    asset.bundles.delete(this);
    this.assets.delete(asset);
  }

  addOffset(asset, line, column = 0) {
    this.offsets.set(asset, [line, column]);
  }

  getOffset(asset) {
    return this.offsets.get(asset) || [0, 0];
  }

  getSiblingBundle(type) {
    if (!type || type === this.type) {
      return this;
    }

    if (!this.siblingBundlesMap.has(type)) {
      let bundle = new Bundle(type, Path.join(Path.dirname(this.name), // keep the original extension for source map files, so we have
      // .js.map instead of just .map
      type === 'map' ? Path.basename(this.name) + '.' + type : Path.basename(this.name, Path.extname(this.name)) + '.' + type), this);
      this.childBundles.add(bundle);
      this.siblingBundles.add(bundle);
      this.siblingBundlesMap.set(type, bundle);
    }

    return this.siblingBundlesMap.get(type);
  }

  createChildBundle(entryAsset, options = {}) {
    let bundle = Bundle.createWithAsset(entryAsset, this, options);
    this.childBundles.add(bundle);
    return bundle;
  }

  createSiblingBundle(entryAsset, options = {}) {
    let bundle = this.createChildBundle(entryAsset, options);
    this.siblingBundles.add(bundle);
    return bundle;
  }

  get isEmpty() {
    return this.assets.size === 0;
  }

  getBundleNameMap(contentHash, hashes = new Map()) {
    if (this.name) {
      let hashedName = this.getHashedBundleName(contentHash);
      hashes.set(Path.basename(this.name), hashedName);
      this.name = Path.join(Path.dirname(this.name), hashedName);
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.childBundles.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let child = _step.value;
        child.getBundleNameMap(contentHash, hashes);
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

    return hashes;
  }

  getHashedBundleName(contentHash) {
    // If content hashing is enabled, generate a hash from all assets in the bundle.
    // Otherwise, use a hash of the filename so it remains consistent across builds.
    if (this.type == 'map') {
      return this.parentBundle.getHashedBundleName(contentHash) + '.map';
    }

    let basename = Path.basename(this.name);
    let ext = Path.extname(basename);
    let hash = (contentHash ? this.getHash() : Path.basename(this.name, ext)).slice(-8);
    let entryAsset = this;

    while (!entryAsset.entryAsset && entryAsset.parentBundle) {
      entryAsset = entryAsset.parentBundle;
    }

    entryAsset = entryAsset.entryAsset;
    let name = Path.basename(entryAsset.name, Path.extname(entryAsset.name));
    let isMainEntry = entryAsset.options.entryFiles[0] === entryAsset.name;
    let isEntry = entryAsset.options.entryFiles.includes(entryAsset.name) || Array.from(entryAsset.parentDeps).some(dep => dep.entry); // If this is the main entry file, use the output file option as the name if provided.

    if (isMainEntry && entryAsset.options.outFile) {
      let extname = Path.extname(entryAsset.options.outFile);

      if (extname) {
        ext = this.entryAsset ? extname : ext;
        name = Path.basename(entryAsset.options.outFile, extname);
      } else {
        name = entryAsset.options.outFile;
      }
    } // If this is an entry asset, don't hash. Return a relative path
    // from the main file so we keep the original file paths.


    if (isEntry) {
      return Path.join(Path.relative(entryAsset.options.rootDir, Path.dirname(entryAsset.name)), name + ext).replace(/\.\.(\/|\\)/g, '__$1');
    } // If this is an index file, use the parent directory name instead
    // which is probably more descriptive.


    if (name === 'index') {
      name = Path.basename(Path.dirname(entryAsset.name));
    } // Add the content hash and extension.


    return name + '.' + hash + ext;
  }

  package(bundler, oldHashes, newHashes = new Map()) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let promises = [];
      let mappings = [];

      if (!_this.isEmpty) {
        let hash = _this.getHash();

        newHashes.set(_this.name, hash);

        if (!oldHashes || oldHashes.get(_this.name) !== hash) {
          promises.push(_this._package(bundler));
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _this.childBundles.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let bundle = _step2.value;

          if (bundle.type === 'map') {
            mappings.push(bundle);
          } else {
            promises.push(bundle.package(bundler, oldHashes, newHashes));
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

      yield Promise.all(promises);

      for (var _i = 0, _mappings = mappings; _i < _mappings.length; _i++) {
        let bundle = _mappings[_i];
        yield bundle.package(bundler, oldHashes, newHashes);
      }

      return newHashes;
    })();
  }

  _package(bundler) {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let Packager = bundler.packagers.get(_this2.type);
      let packager = new Packager(_this2, bundler);
      let startTime = Date.now();
      yield packager.setup();
      yield packager.start();
      let included = new Set();
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _this2.assets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          let asset = _step3.value;
          yield _this2._addDeps(asset, packager, included);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      yield packager.end();
      _this2.totalSize = packager.getSize();
      let assetArray = Array.from(_this2.assets);
      let assetStartTime = _this2.type === 'map' ? 0 : assetArray.sort((a, b) => a.startTime - b.startTime)[0].startTime;
      let assetEndTime = _this2.type === 'map' ? 0 : assetArray.sort((a, b) => b.endTime - a.endTime)[0].endTime;
      let packagingTime = Date.now() - startTime;
      _this2.bundleTime = assetEndTime - assetStartTime + packagingTime;
    })();
  }

  _addDeps(asset, packager, included) {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (!_this3.assets.has(asset) || included.has(asset)) {
        return;
      }

      included.add(asset);
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = asset.depAssets.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          let depAsset = _step4.value;
          yield _this3._addDeps(depAsset, packager, included);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      yield packager.addAsset(asset);

      const assetSize = packager.getSize() - _this3.totalSize;

      if (assetSize > 0) {
        _this3.addAssetSize(asset, assetSize);
      }
    })();
  }

  addAssetSize(asset, size) {
    asset.bundledSize = size;
    this.totalSize += size;
  }

  getParents() {
    let parents = [];
    let bundle = this;

    while (bundle) {
      parents.push(bundle);
      bundle = bundle.parentBundle;
    }

    return parents;
  }

  findCommonAncestor(bundle) {
    // Get a list of parent bundles going up to the root
    let ourParents = this.getParents();
    let theirParents = bundle.getParents(); // Start from the root bundle, and find the first bundle that's different

    let a = ourParents.pop();
    let b = theirParents.pop();
    let last;

    while (a === b && ourParents.length > 0 && theirParents.length > 0) {
      last = a;
      a = ourParents.pop();
      b = theirParents.pop();
    }

    if (a === b) {
      // One bundle descended from the other
      return a;
    }

    return last;
  }

  getHash() {
    let hash = crypto.createHash('md5');
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = this.assets[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        let asset = _step5.value;
        hash.update(asset.hash);
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    return hash.digest('hex');
  }

}

module.exports = Bundle;