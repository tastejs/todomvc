"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const path = require('path');

const Packager = require('./Packager');

const getExisting = require('../utils/getExisting');

const urlJoin = require('../utils/urlJoin');

const lineCounter = require('../utils/lineCounter');

const objectHash = require('../utils/objectHash');

const prelude = getExisting(path.join(__dirname, '../builtins/prelude.min.js'), path.join(__dirname, '../builtins/prelude.js'));

class JSPackager extends Packager {
  start() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this.first = true;
      _this.dedupe = new Map();
      _this.bundleLoaders = new Set();
      _this.externalModules = new Set();
      let preludeCode = _this.options.minify ? prelude.minified : prelude.source;

      if (_this.options.target === 'electron') {
        preludeCode = `process.env.HMR_PORT=${_this.options.hmrPort};process.env.HMR_HOSTNAME=${JSON.stringify(_this.options.hmrHostname)};` + preludeCode;
      }

      yield _this.write(preludeCode + '({');
      _this.lineOffset = lineCounter(preludeCode);
    })();
  }

  addAsset(asset) {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // If this module is referenced by another JS bundle, it needs to be exposed externally.
      // In that case, don't dedupe the asset as it would affect the module ids that are referenced by other bundles.
      let isExposed = !Array.from(asset.parentDeps).every(dep => {
        let depAsset = _this2.bundler.loadedAssets.get(dep.parent);

        return _this2.bundle.assets.has(depAsset) || depAsset.type !== 'js';
      });

      if (!isExposed) {
        let key = _this2.dedupeKey(asset);

        if (_this2.dedupe.has(key)) {
          return;
        } // Don't dedupe when HMR is turned on since it messes with the asset ids


        if (!_this2.options.hmr) {
          _this2.dedupe.set(key, asset.id);
        }
      }

      let deps = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = asset.depAssets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let _step$value = (0, _slicedToArray2.default)(_step.value, 2),
              dep = _step$value[0],
              mod = _step$value[1];

          // For dynamic dependencies, list the child bundles to load along with the module id
          if (dep.dynamic) {
            let bundles = [_this2.getBundleSpecifier(mod.parentBundle)];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = mod.parentBundle.siblingBundles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                let child = _step2.value;

                if (!child.isEmpty) {
                  bundles.push(_this2.getBundleSpecifier(child));

                  _this2.bundleLoaders.add(child.type);
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

            bundles.push(mod.id);
            deps[dep.name] = bundles;

            _this2.bundleLoaders.add(mod.type);
          } else {
            deps[dep.name] = _this2.dedupe.get(_this2.dedupeKey(mod)) || mod.id; // If the dep isn't in this bundle, add it to the list of external modules to preload.
            // Only do this if this is the root JS bundle, otherwise they will have already been
            // loaded in parallel with this bundle as part of a dynamic import.

            if (!_this2.bundle.assets.has(mod)) {
              _this2.externalModules.add(mod);

              if (!_this2.bundle.parentBundle || _this2.bundle.isolated || _this2.bundle.parentBundle.type !== 'js') {
                _this2.bundleLoaders.add(mod.type);
              }
            }
          }
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

      _this2.bundle.addOffset(asset, _this2.lineOffset);

      yield _this2.writeModule(asset.id, asset.generated.js, deps, asset.generated.map);
    })();
  }

  getBundleSpecifier(bundle) {
    let name = path.relative(path.dirname(this.bundle.name), bundle.name);

    if (bundle.entryAsset) {
      return [name, bundle.entryAsset.id];
    }

    return name;
  }

  dedupeKey(asset) {
    // cannot rely *only* on generated JS for deduplication because paths like
    // `../` can cause 2 identical JS files to behave differently depending on
    // where they are located on the filesystem
    let deps = Array.from(asset.depAssets.values(), dep => dep.name).sort();
    return objectHash([asset.generated.js, deps]);
  }

  writeModule(id, code, deps = {}, map) {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let wrapped = _this3.first ? '' : ',';
      wrapped += JSON.stringify(id) + ':[function(require,module,exports) {\n' + (code || '') + '\n},';
      wrapped += JSON.stringify(deps);
      wrapped += ']';
      _this3.first = false;
      yield _this3.write(wrapped); // Use the pre-computed line count from the source map if possible

      let lineCount = map && map.lineCount ? map.lineCount : lineCounter(code);
      _this3.lineOffset += 1 + lineCount;
    })();
  }

  addAssetToBundle(asset) {
    var _this4 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this4.bundle.assets.has(asset)) {
        return;
      }

      _this4.bundle.addAsset(asset);

      if (!asset.parentBundle) {
        asset.parentBundle = _this4.bundle;
      } // Add all dependencies as well


      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = asset.depAssets.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          let child = _step3.value;
          yield _this4.addAssetToBundle(child);
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

      yield _this4.addAsset(asset);
    })();
  }

  writeBundleLoaders() {
    var _this5 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this5.bundleLoaders.size === 0) {
        return false;
      }

      let bundleLoader = _this5.bundler.loadedAssets.get(require.resolve('../builtins/bundle-loader'));

      if (_this5.externalModules.size > 0 && !bundleLoader) {
        bundleLoader = yield _this5.bundler.getAsset('_bundle_loader');
      }

      if (bundleLoader) {
        yield _this5.addAssetToBundle(bundleLoader);
      } else {
        return;
      } // Generate a module to register the bundle loaders that are needed


      let loads = 'var b=require(' + JSON.stringify(bundleLoader.id) + ');';
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = _this5.bundleLoaders[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          let bundleType = _step4.value;
          let loader = _this5.options.bundleLoaders[bundleType];

          if (loader) {
            let target = _this5.options.target === 'node' ? 'node' : 'browser';
            let asset = yield _this5.bundler.getAsset(loader[target]);
            yield _this5.addAssetToBundle(asset);
            loads += 'b.register(' + JSON.stringify(bundleType) + ',require(' + JSON.stringify(asset.id) + '));';
          }
        } // Preload external modules before running entry point if needed

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

      if (_this5.externalModules.size > 0) {
        let preload = [];
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = _this5.externalModules[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            let mod = _step5.value;
            // Find the bundle that has the module as its entry point
            let bundle = Array.from(mod.bundles).find(b => b.entryAsset === mod);

            if (bundle) {
              preload.push([path.basename(bundle.name), mod.id]);
            }
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

        loads += 'b.load(' + JSON.stringify(preload) + ')';

        if (_this5.bundle.entryAsset) {
          loads += `.then(function(){require(${JSON.stringify(_this5.bundle.entryAsset.id)});})`;
        }

        loads += ';';
      } // Asset ids normally start at 1, so this should be safe.


      yield _this5.writeModule(0, loads, {});
      return true;
    })();
  }

  end() {
    var _this6 = this,
        _superprop_callEnd = (..._args) => super.end(..._args);

    return (0, _asyncToGenerator2.default)(function* () {
      let entry = []; // Add the HMR runtime if needed.

      if (_this6.options.hmr) {
        let asset = yield _this6.bundler.getAsset(require.resolve('../builtins/hmr-runtime'));
        yield _this6.addAssetToBundle(asset);
        entry.push(asset.id);
      }

      if (yield _this6.writeBundleLoaders()) {
        entry.push(0);
      }

      if (_this6.bundle.entryAsset && _this6.externalModules.size === 0) {
        entry.push(_this6.bundle.entryAsset.id);
      }

      yield _this6.write('},{},' + JSON.stringify(entry) + ', ' + JSON.stringify(_this6.options.global || null) + ')');

      if (_this6.options.sourceMaps) {
        // Add source map url if a map bundle exists
        let mapBundle = _this6.bundle.siblingBundlesMap.get('map');

        if (mapBundle) {
          let mapUrl = urlJoin(_this6.options.publicURL, path.relative(_this6.options.outDir, mapBundle.name));
          yield _this6.write(`\n//# sourceMappingURL=${mapUrl}`);
        }
      }

      yield _superprop_callEnd();
    })();
  }

}

module.exports = JSPackager;