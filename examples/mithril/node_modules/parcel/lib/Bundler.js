"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const fs = require('@parcel/fs');

const Resolver = require('./Resolver');

const Parser = require('./Parser');

const WorkerFarm = require('@parcel/workers');

const Path = require('path');

const Bundle = require('./Bundle');

const Watcher = require('@parcel/watcher');

const FSCache = require('./FSCache');

const HMRServer = require('./HMRServer');

const Server = require('./Server');

const _require = require('events'),
      EventEmitter = _require.EventEmitter;

const logger = require('@parcel/logger');

const PackagerRegistry = require('./packagers');

const localRequire = require('./utils/localRequire');

const config = require('./utils/config');

const loadEnv = require('./utils/env');

const PromiseQueue = require('./utils/PromiseQueue');

const installPackage = require('./utils/installPackage');

const bundleReport = require('./utils/bundleReport');

const prettifyTime = require('./utils/prettifyTime');

const getRootDir = require('./utils/getRootDir');

const _require2 = require('./utils/glob'),
      glob = _require2.glob,
      isGlob = _require2.isGlob;
/**
 * The Bundler is the main entry point. It resolves and loads assets,
 * creates the bundle tree, and manages the worker farm, cache, and file watcher.
 */


class Bundler extends EventEmitter {
  constructor(entryFiles, options = {}) {
    super();
    entryFiles = this.normalizeEntries(entryFiles);
    this.watchedGlobs = entryFiles.filter(entry => isGlob(entry));
    this.entryFiles = this.findEntryFiles(entryFiles);
    this.options = this.normalizeOptions(options);
    this.resolver = new Resolver(this.options);
    this.parser = new Parser(this.options);
    this.packagers = new PackagerRegistry(this.options);
    this.cache = this.options.cache ? new FSCache(this.options) : null;
    this.delegate = options.delegate || {};
    this.bundleLoaders = {};
    this.addBundleLoader('wasm', {
      browser: require.resolve('./builtins/loaders/browser/wasm-loader'),
      node: require.resolve('./builtins/loaders/node/wasm-loader')
    });
    this.addBundleLoader('css', {
      browser: require.resolve('./builtins/loaders/browser/css-loader'),
      node: require.resolve('./builtins/loaders/node/css-loader')
    });
    this.addBundleLoader('js', {
      browser: require.resolve('./builtins/loaders/browser/js-loader'),
      node: require.resolve('./builtins/loaders/node/js-loader')
    });
    this.addBundleLoader('html', {
      browser: require.resolve('./builtins/loaders/browser/html-loader'),
      node: require.resolve('./builtins/loaders/node/html-loader')
    });
    this.pending = false;
    this.loadedAssets = new Map();
    this.watchedAssets = new Map();
    this.farm = null;
    this.watcher = null;
    this.hmr = null;
    this.bundleHashes = null;
    this.error = null;
    this.buildQueue = new PromiseQueue(this.processAsset.bind(this));
    this.rebuildTimeout = null;
    logger.setOptions(this.options);
  }

  normalizeEntries(entryFiles) {
    // Support passing a single file
    if (entryFiles && !Array.isArray(entryFiles)) {
      entryFiles = [entryFiles];
    } // If no entry files provided, resolve the entry point from the current directory.


    if (!entryFiles || entryFiles.length === 0) {
      entryFiles = [process.cwd()];
    }

    return entryFiles;
  }

  findEntryFiles(entryFiles) {
    // Match files as globs
    return entryFiles.reduce((p, m) => p.concat(glob.sync(m)), []).map(f => Path.resolve(f));
  }

  normalizeOptions(options) {
    const isProduction = options.production || process.env.NODE_ENV === 'production';
    const publicURL = options.publicUrl || options.publicURL || '/';
    const watch = typeof options.watch === 'boolean' ? options.watch : !isProduction;
    const target = options.target || 'browser';
    const hmr = target === 'node' ? false : typeof options.hmr === 'boolean' ? options.hmr : watch;
    const scopeHoist = options.scopeHoist !== undefined ? options.scopeHoist : false;
    return {
      production: isProduction,
      outDir: Path.resolve(options.outDir || 'dist'),
      outFile: options.outFile || '',
      publicURL: publicURL,
      watch: watch,
      cache: typeof options.cache === 'boolean' ? options.cache : true,
      cacheDir: Path.resolve(options.cacheDir || '.cache'),
      killWorkers: typeof options.killWorkers === 'boolean' ? options.killWorkers : true,
      minify: typeof options.minify === 'boolean' ? options.minify : isProduction,
      target: target,
      bundleNodeModules: typeof options.bundleNodeModules === 'boolean' ? options.bundleNodeModules : target === 'browser',
      hmr: hmr,
      https: options.https || false,
      logLevel: isNaN(options.logLevel) ? 3 : options.logLevel,
      entryFiles: this.entryFiles,
      hmrPort: options.hmrPort || 0,
      rootDir: getRootDir(this.entryFiles),
      sourceMaps: (typeof options.sourceMaps === 'boolean' ? options.sourceMaps : true) && !scopeHoist,
      hmrHostname: options.hmrHostname || options.host || (options.target === 'electron' ? 'localhost' : ''),
      detailedReport: options.detailedReport || false,
      global: options.global,
      autoinstall: typeof options.autoInstall === 'boolean' ? options.autoInstall : process.env.PARCEL_AUTOINSTALL === 'false' ? false : !isProduction,
      scopeHoist: scopeHoist,
      contentHash: typeof options.contentHash === 'boolean' ? options.contentHash : isProduction,
      throwErrors: typeof options.throwErrors === 'boolean' ? options.throwErrors : true
    };
  }

  addAssetType(extension, path) {
    if (typeof path !== 'string') {
      throw new Error('Asset type should be a module path.');
    }

    if (this.farm) {
      throw new Error('Asset types must be added before bundling.');
    }

    this.parser.registerExtension(extension, path);
  }

  addPackager(type, packager) {
    if (this.farm) {
      throw new Error('Packagers must be added before bundling.');
    }

    this.packagers.add(type, packager);
  }

  addBundleLoader(type, paths) {
    if (typeof paths === 'string') {
      paths = {
        node: paths,
        browser: paths
      };
    } else if (typeof paths !== 'object') {
      throw new Error('Bundle loaders should be an object.');
    }

    for (const target in paths) {
      if (target !== 'node' && target !== 'browser') {
        throw new Error(`Unknown bundle loader target "${target}".`);
      }

      if (typeof paths[target] !== 'string') {
        throw new Error('Bundle loader should be a string.');
      }
    }

    if (this.farm) {
      throw new Error('Bundle loaders must be added before bundling.');
    }

    this.bundleLoaders[type] = paths;
  }

  loadPlugins() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let relative = Path.join(_this.options.rootDir, 'index');
      let pkg = yield config.load(relative, ['package.json']);

      if (!pkg) {
        return;
      }

      let lastDep;

      try {
        let deps = Object.assign({}, pkg.dependencies, pkg.devDependencies);

        for (let dep in deps) {
          lastDep = dep;
          const pattern = /^(@.*\/)?parcel-plugin-.+/;

          if (pattern.test(dep)) {
            let plugin = yield localRequire(dep, relative);
            yield plugin(_this);
          }
        }
      } catch (err) {
        logger.warn(`Plugin ${lastDep} failed to initialize: ${err.stack || err.message || err}`);
      }
    })();
  }

  bundle() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // If another bundle is already pending, wait for that one to finish and retry.
      if (_this2.pending) {
        return new Promise((resolve, reject) => {
          _this2.once('buildEnd', () => {
            _this2.bundle().then(resolve, reject);
          });
        });
      }

      let isInitialBundle = !_this2.entryAssets;
      let startTime = Date.now();
      let initialised = !isInitialBundle;
      _this2.pending = true;
      _this2.error = null;
      logger.clear();
      logger.progress('Building...');

      try {
        // Start worker farm, watcher, etc. if needed
        yield _this2.start(); // Emit start event, after bundler is initialised

        _this2.emit('buildStart', _this2.entryFiles); // If this is the initial bundle, ensure the output directory exists, and resolve the main asset.


        if (isInitialBundle) {
          yield fs.mkdirp(_this2.options.outDir);
          _this2.entryAssets = new Set();
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = _this2.entryFiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              let entry = _step.value;

              try {
                let asset = yield _this2.resolveAsset(entry);

                _this2.buildQueue.add(asset);

                _this2.entryAssets.add(asset);
              } catch (err) {
                throw new Error(`Cannot resolve entry "${entry}" from "${_this2.options.rootDir}"`);
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

          if (_this2.entryAssets.size === 0) {
            throw new Error('No entries found.');
          }

          initialised = true;
        } // Build the queued assets.


        let loadedAssets = yield _this2.buildQueue.run(); // The changed assets are any that don't have a parent bundle yet
        // plus the ones that were in the build queue.

        let changedAssets = [..._this2.findOrphanAssets(), ...loadedAssets]; // Invalidate bundles

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _this2.loadedAssets.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            let asset = _step2.value;
            asset.invalidateBundle();
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

        logger.progress(`Producing bundles...`); // Create a root bundle to hold all of the entry assets, and add them to the tree.

        _this2.mainBundle = new Bundle();
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = _this2.entryAssets[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            let asset = _step3.value;

            _this2.createBundleTree(asset, _this2.mainBundle);
          } // If there is only one child bundle, replace the root with that bundle.

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

        if (_this2.mainBundle.childBundles.size === 1) {
          _this2.mainBundle = Array.from(_this2.mainBundle.childBundles)[0];
        } // Generate the final bundle names, and replace references in the built assets.


        let numBundles = _this2.bundleNameMap ? _this2.bundleNameMap.size : 0;
        _this2.bundleNameMap = _this2.mainBundle.getBundleNameMap(_this2.options.contentHash);

        for (var _i = 0, _changedAssets = changedAssets; _i < _changedAssets.length; _i++) {
          let asset = _changedAssets[_i];
          asset.replaceBundleNames(_this2.bundleNameMap);
        } // Emit an HMR update if this is not the initial bundle.


        let bundlesChanged = numBundles !== _this2.bundleNameMap.size;

        if (_this2.hmr && !isInitialBundle) {
          _this2.hmr.emitUpdate(changedAssets, bundlesChanged);
        }

        logger.progress(`Packaging...`); // Package everything up

        _this2.bundleHashes = yield _this2.mainBundle.package(_this2, bundlesChanged ? null : _this2.bundleHashes); // Unload any orphaned assets

        _this2.unloadOrphanedAssets();

        let buildTime = Date.now() - startTime;
        let time = prettifyTime(buildTime);
        logger.success(`Built in ${time}.`);

        if (!_this2.watcher) {
          bundleReport(_this2.mainBundle, _this2.options.detailedReport);
        }

        _this2.emit('bundled', _this2.mainBundle);

        return _this2.mainBundle;
      } catch (err) {
        _this2.error = err;
        logger.error(err);

        _this2.emit('buildError', err);

        if (_this2.hmr) {
          _this2.hmr.emitError(err);
        }

        if (_this2.options.throwErrors && !_this2.hmr) {
          throw err;
        } else if (!_this2.options.watch || !initialised) {
          yield _this2.stop();
          process.exit(1);
        }
      } finally {
        _this2.pending = false;

        _this2.emit('buildEnd'); // If not in watch mode, stop the worker farm so we don't keep the process running.


        if (!_this2.watcher && _this2.options.killWorkers) {
          yield _this2.stop();
        }
      }
    })();
  }

  start() {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this3.farm) {
        return;
      }

      yield _this3.loadPlugins();

      if (!_this3.options.env) {
        yield loadEnv(Path.join(_this3.options.rootDir, 'index'));
        _this3.options.env = process.env;
      }

      _this3.options.extensions = Object.assign({}, _this3.parser.extensions);
      _this3.options.bundleLoaders = _this3.bundleLoaders;

      if (_this3.options.watch) {
        _this3.watcher = new Watcher(); // Wait for ready event for reliable testing on watcher

        if (process.env.NODE_ENV === 'test' && !_this3.watcher.ready) {
          yield new Promise(resolve => _this3.watcher.once('ready', resolve));
        }

        _this3.watchedGlobs.forEach(glob => {
          _this3.watcher.add(glob);
        });

        _this3.watcher.on('add', _this3.onAdd.bind(_this3));

        _this3.watcher.on('change', _this3.onChange.bind(_this3));

        _this3.watcher.on('unlink', _this3.onUnlink.bind(_this3));
      }

      if (_this3.options.hmr) {
        _this3.hmr = new HMRServer();
        _this3.options.hmrPort = yield _this3.hmr.start(_this3.options);
      }

      _this3.farm = yield WorkerFarm.getShared(_this3.options, {
        workerPath: require.resolve('./worker.js')
      });
    })();
  }

  stop() {
    var _this4 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this4.watcher) {
        yield _this4.watcher.stop();
      }

      if (_this4.hmr) {
        _this4.hmr.stop();
      } // Watcher and hmr can cause workerfarm calls
      // keep this as last to prevent unwanted errors


      if (_this4.farm) {
        yield _this4.farm.end();
      }
    })();
  }

  getAsset(name, parent) {
    var _this5 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let asset = yield _this5.resolveAsset(name, parent);

      _this5.buildQueue.add(asset);

      yield _this5.buildQueue.run();
      return asset;
    })();
  }

  resolveAsset(name, parent) {
    var _this6 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let _ref = yield _this6.resolver.resolve(name, parent),
          path = _ref.path;

      return _this6.getLoadedAsset(path);
    })();
  }

  getLoadedAsset(path) {
    if (this.loadedAssets.has(path)) {
      return this.loadedAssets.get(path);
    }

    let asset = this.parser.getAsset(path, this.options);
    this.loadedAssets.set(path, asset);
    this.watch(path, asset);
    return asset;
  }

  watch(path, asset) {
    var _this7 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (!_this7.watcher) {
        return;
      }

      path = yield fs.realpath(path);

      if (!_this7.watchedAssets.has(path)) {
        _this7.watcher.watch(path);

        _this7.watchedAssets.set(path, new Set());
      }

      _this7.watchedAssets.get(path).add(asset);
    })();
  }

  unwatch(path, asset) {
    var _this8 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      path = yield fs.realpath(path);

      if (!_this8.watchedAssets.has(path)) {
        return;
      }

      let watched = _this8.watchedAssets.get(path);

      watched.delete(asset);

      if (watched.size === 0) {
        _this8.watchedAssets.delete(path);

        _this8.watcher.unwatch(path);
      }
    })();
  }

  resolveDep(asset, dep, install = true) {
    var _this9 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      try {
        if (dep.resolved) {
          return _this9.getLoadedAsset(dep.resolved);
        }

        return yield _this9.resolveAsset(dep.name, asset.name);
      } catch (err) {
        // If the dep is optional, return before we throw
        if (dep.optional) {
          return;
        }

        if (err.code === 'MODULE_NOT_FOUND') {
          let isLocalFile = /^[/~.]/.test(dep.name);
          let fromNodeModules = asset.name.includes(`${Path.sep}node_modules${Path.sep}`);

          if (!isLocalFile && !fromNodeModules && _this9.options.autoinstall && install) {
            return _this9.installDep(asset, dep);
          }

          err.message = `Cannot resolve dependency '${dep.name}'`;

          if (isLocalFile) {
            const absPath = Path.resolve(Path.dirname(asset.name), dep.name);
            err.message += ` at '${absPath}'`;
          }

          yield _this9.throwDepError(asset, dep, err);
        }

        throw err;
      }
    })();
  }

  installDep(asset, dep) {
    var _this10 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Check if module exists, prevents useless installs
      let resolved = yield _this10.resolver.resolveModule(dep.name, asset.name); // If the module resolved (i.e. wasn't a local file), but the module directory wasn't found, install it.

      if (resolved.moduleName && !resolved.moduleDir) {
        try {
          yield installPackage(resolved.moduleName, asset.name, {
            saveDev: false
          });
        } catch (err) {
          yield _this10.throwDepError(asset, dep, err);
        }
      }

      return _this10.resolveDep(asset, dep, false);
    })();
  }

  throwDepError(asset, dep, err) {
    return (0, _asyncToGenerator2.default)(function* () {
      // Generate a code frame where the dependency was used
      if (dep.loc) {
        yield asset.loadIfNeeded();
        err.loc = dep.loc;
        err = asset.generateErrorMessage(err);
      }

      err.fileName = asset.name;
      throw err;
    })();
  }

  processAsset(asset, isRebuild) {
    var _this11 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (isRebuild) {
        asset.invalidate();

        if (_this11.cache) {
          _this11.cache.invalidate(asset.name);
        }
      }

      yield _this11.loadAsset(asset);
    })();
  }

  loadAsset(asset) {
    var _this12 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (asset.processed) {
        return;
      }

      if (!_this12.error) {
        logger.progress(`Building ${asset.basename}...`);
      } // Mark the asset processed so we don't load it twice


      asset.processed = true; // First try the cache, otherwise load and compile in the background

      asset.startTime = Date.now();
      let processed = _this12.cache && (yield _this12.cache.read(asset.name));
      let cacheMiss = false;

      if (!processed || asset.shouldInvalidate(processed.cacheData)) {
        processed = yield _this12.farm.run(asset.name);
        cacheMiss = true;
      }

      asset.endTime = Date.now();
      asset.buildTime = asset.endTime - asset.startTime;
      asset.id = processed.id;
      asset.generated = processed.generated;
      asset.sourceMaps = processed.sourceMaps;
      asset.hash = processed.hash;
      asset.cacheData = processed.cacheData; // Call the delegate to get implicit dependencies

      let dependencies = processed.dependencies;

      if (_this12.delegate.getImplicitDependencies) {
        let implicitDeps = yield _this12.delegate.getImplicitDependencies(asset);

        if (implicitDeps) {
          dependencies = dependencies.concat(implicitDeps);
        }
      } // Resolve and load asset dependencies


      let assetDeps = yield Promise.all(dependencies.map(
      /*#__PURE__*/
      function () {
        var _ref2 = (0, _asyncToGenerator2.default)(function* (dep) {
          if (dep.includedInParent) {
            // This dependency is already included in the parent's generated output,
            // so no need to load it. We map the name back to the parent asset so
            // that changing it triggers a recompile of the parent.
            _this12.watch(dep.name, asset);
          } else {
            dep.parent = asset.name;
            let assetDep = yield _this12.resolveDep(asset, dep);

            if (assetDep) {
              yield _this12.loadAsset(assetDep);
            }

            return assetDep;
          }
        });

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }())); // If there was a processing error, re-throw now that we've set up
      // depdenency watchers. This keeps reloading working if there is an
      // error in a dependency not directly handled by Parcel.

      if (processed.error !== null) {
        throw processed.error;
      } // Store resolved assets in their original order


      dependencies.forEach((dep, i) => {
        asset.dependencies.set(dep.name, dep);
        let assetDep = assetDeps[i];

        if (assetDep) {
          asset.depAssets.set(dep, assetDep);
          dep.resolved = assetDep.name;
        }
      });
      logger.verbose(`Built ${asset.relativeName}...`);

      if (_this12.cache && cacheMiss) {
        _this12.cache.write(asset.name, processed);
      }
    })();
  }

  createBundleTree(asset, bundle, dep, parentBundles = new Set()) {
    if (dep) {
      asset.parentDeps.add(dep);
    }

    if (asset.parentBundle && !bundle.isolated) {
      // If the asset is already in a bundle, it is shared. Move it to the lowest common ancestor.
      if (asset.parentBundle !== bundle) {
        let commonBundle = bundle.findCommonAncestor(asset.parentBundle); // If the common bundle's type matches the asset's, move the asset to the common bundle.
        // Otherwise, proceed with adding the asset to the new bundle below.

        if (asset.parentBundle.type === commonBundle.type) {
          this.moveAssetToBundle(asset, commonBundle);
          return;
        }
      } else {
        return;
      } // Detect circular bundles


      if (parentBundles.has(asset.parentBundle)) {
        return;
      }
    } // Skip this asset if it's already in the bundle.
    // Happens when circular dependencies are placed in an isolated bundle (e.g. a worker).


    if (bundle.isolated && bundle.assets.has(asset)) {
      return;
    }

    let isEntryAsset = asset.parentBundle && asset.parentBundle.entryAsset === asset; // If the asset generated a representation for the parent bundle type, and this
    // is not an async import, add it to the current bundle

    if (bundle.type && asset.generated[bundle.type] != null && !dep.dynamic) {
      bundle.addAsset(asset);
    }

    if (dep && dep.dynamic || !bundle.type) {
      // If the asset is already the entry asset of a bundle, don't create a duplicate.
      if (isEntryAsset) {
        return;
      } // Create a new bundle for dynamic imports


      bundle = bundle.createChildBundle(asset, dep);
    } else if (asset.type && !this.packagers.get(asset.type).shouldAddAsset(bundle, asset)) {
      // If the asset is already the entry asset of a bundle, don't create a duplicate.
      if (isEntryAsset) {
        return;
      } // No packager is available for this asset type, or the packager doesn't support
      // combining this asset into the bundle. Create a new bundle with only this asset.


      bundle = bundle.createSiblingBundle(asset, dep);
    } else {
      // Add the asset to the common bundle of the asset's type
      bundle.getSiblingBundle(asset.type).addAsset(asset);
    } // Add the asset to sibling bundles for each generated type


    if (asset.type && asset.generated[asset.type]) {
      for (let t in asset.generated) {
        if (asset.generated[t]) {
          bundle.getSiblingBundle(t).addAsset(asset);
        }
      }
    }

    asset.parentBundle = bundle;
    parentBundles.add(bundle);
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = asset.depAssets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        let _step4$value = (0, _slicedToArray2.default)(_step4.value, 2),
            dep = _step4$value[0],
            assetDep = _step4$value[1];

        this.createBundleTree(assetDep, bundle, dep, parentBundles);
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

    parentBundles.delete(bundle);
    return bundle;
  }

  moveAssetToBundle(asset, commonBundle) {
    // Never move the entry asset of a bundle, as it was explicitly requested to be placed in a separate bundle.
    if (asset.parentBundle.entryAsset === asset || asset.parentBundle === commonBundle) {
      return;
    }

    for (var _i2 = 0, _Array$from = Array.from(asset.bundles); _i2 < _Array$from.length; _i2++) {
      let bundle = _Array$from[_i2];

      if (!bundle.isolated) {
        bundle.removeAsset(asset);
      }

      commonBundle.getSiblingBundle(bundle.type).addAsset(asset);
    }

    let oldBundle = asset.parentBundle;
    asset.parentBundle = commonBundle; // Move all dependencies as well

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = asset.depAssets.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        let child = _step5.value;

        if (child.parentBundle === oldBundle) {
          this.moveAssetToBundle(child, commonBundle);
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
  }

  *findOrphanAssets() {
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = this.loadedAssets.values()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        let asset = _step6.value;

        if (!asset.parentBundle) {
          yield asset;
        }
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  }

  unloadOrphanedAssets() {
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = this.findOrphanAssets()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        let asset = _step7.value;
        this.unloadAsset(asset);
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }
  }

  unloadAsset(asset) {
    this.loadedAssets.delete(asset.name);

    if (this.watcher) {
      this.unwatch(asset.name, asset); // Unwatch all included dependencies that map to this asset

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = asset.dependencies.values()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          let dep = _step8.value;

          if (dep.includedInParent) {
            this.unwatch(dep.name, asset);
          }
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }
    }
  }

  onAdd(path) {
    var _this13 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      path = Path.join(process.cwd(), path);

      let asset = _this13.parser.getAsset(path, _this13.options);

      _this13.loadedAssets.set(path, asset);

      _this13.entryAssets.add(asset);

      yield _this13.watch(path, asset);

      _this13.onChange(path);
    })();
  }

  onChange(path) {
    var _this14 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // The path to the newly-added items are not absolute.
      if (!Path.isAbsolute(path)) {
        path = Path.resolve(process.cwd(), path);
      }

      let assets = _this14.watchedAssets.get(path);

      if (!assets || !assets.size) {
        return;
      }

      logger.clear();
      logger.progress(`Building ${Path.basename(path)}...`); // Add the asset to the rebuild queue, and reset the timeout.

      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = assets[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          let asset = _step9.value;

          _this14.buildQueue.add(asset, true);
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      clearTimeout(_this14.rebuildTimeout);
      _this14.rebuildTimeout = setTimeout(
      /*#__PURE__*/
      (0, _asyncToGenerator2.default)(function* () {
        yield _this14.bundle();
      }), 100);
    })();
  }

  onUnlink(path) {
    var _this15 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // The path to the newly-added items are not absolute.
      if (!Path.isAbsolute(path)) {
        path = Path.resolve(process.cwd(), path);
      }

      let asset = _this15.getLoadedAsset(path);

      _this15.entryAssets.delete(asset);

      _this15.unloadAsset(asset);

      _this15.bundle();
    })();
  }

  middleware() {
    this.bundle();
    return Server.middleware(this);
  }

  serve(port = 1234, https = false, host) {
    var _this16 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this16.server = yield Server.serve(_this16, port, host, https);

      try {
        yield _this16.bundle();
      } catch (e) {// ignore: server can still work with errored bundler
      }

      return _this16.server;
    })();
  }

}

module.exports = Bundler;
Bundler.Asset = require('./Asset');
Bundler.Packager = require('./packagers/Packager');