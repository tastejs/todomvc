"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const builtins = require('./builtins');

const nodeBuiltins = require('node-libs-browser');

const path = require('path');

const _require = require('./utils/glob'),
      isGlob = _require.isGlob;

const fs = require('@parcel/fs');

const micromatch = require('micromatch');

const getModuleParts = require('./utils/getModuleParts');

const EMPTY_SHIM = require.resolve('./builtins/_empty');
/**
 * This resolver implements a modified version of the node_modules resolution algorithm:
 * https://nodejs.org/api/modules.html#modules_all_together
 *
 * In addition to the standard algorithm, Parcel supports:
 *   - All file extensions supported by Parcel.
 *   - Glob file paths
 *   - Absolute paths (e.g. /foo) resolved relative to the project root.
 *   - Tilde paths (e.g. ~/foo) resolved relative to the nearest module root in node_modules.
 *   - The package.json module, jsnext:main, and browser field as replacements for package.main.
 *   - The package.json browser and alias fields as an alias map within a local module.
 *   - The package.json alias field in the root package for global aliases across all modules.
 */


class Resolver {
  constructor(options = {}) {
    this.options = options;
    this.cache = new Map();
    this.packageCache = new Map();
    this.rootPackage = null;
  }

  resolve(input, parent) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let filename = input; // Check the cache first

      let key = _this.getCacheKey(filename, parent);

      if (_this.cache.has(key)) {
        return _this.cache.get(key);
      } // Check if this is a glob


      if (isGlob(filename)) {
        return {
          path: path.resolve(path.dirname(parent), filename)
        };
      } // Get file extensions to search


      let extensions = Array.isArray(_this.options.extensions) ? _this.options.extensions.slice() : Object.keys(_this.options.extensions);

      if (parent) {
        // parent's extension given high priority
        const parentExt = path.extname(parent);
        extensions = [parentExt, ...extensions.filter(ext => ext !== parentExt)];
      }

      extensions.unshift(''); // Resolve the module directory or local file path

      let module = yield _this.resolveModule(filename, parent);
      let resolved;

      if (module.moduleDir) {
        resolved = yield _this.loadNodeModules(module, extensions);
      } else if (module.filePath) {
        resolved = yield _this.loadRelative(module.filePath, extensions);
      }

      if (!resolved) {
        let dir = parent ? path.dirname(parent) : process.cwd();
        let err = new Error(`Cannot find module '${input}' from '${dir}'`);
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      _this.cache.set(key, resolved);

      return resolved;
    })();
  }

  resolveModule(filename, parent) {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let dir = parent ? path.dirname(parent) : process.cwd(); // If this isn't the entrypoint, resolve the input file to an absolute path

      if (parent) {
        filename = _this2.resolveFilename(filename, dir);
      } // Resolve aliases in the parent module for this file.


      filename = yield _this2.loadAlias(filename, dir); // Return just the file path if this is a file, not in node_modules

      if (path.isAbsolute(filename)) {
        return {
          filePath: filename
        };
      } // Resolve the module in node_modules


      let resolved;

      try {
        resolved = yield _this2.findNodeModulePath(filename, dir);
      } catch (err) {} // ignore
      // If we couldn't resolve the node_modules path, just return the module name info


      if (!resolved) {
        let parts = getModuleParts(filename);
        resolved = {
          moduleName: parts[0],
          subPath: parts[1]
        };
      }

      return resolved;
    })();
  }

  getCacheKey(filename, parent) {
    return (parent ? path.dirname(parent) : '') + ':' + filename;
  }

  resolveFilename(filename, dir) {
    switch (filename[0]) {
      case '/':
        // Absolute path. Resolve relative to project root.
        return path.resolve(this.options.rootDir, filename.slice(1));

      case '~':
        // Tilde path. Resolve relative to nearest node_modules directory,
        // or the project root - whichever comes first.
        while (dir !== this.options.rootDir && path.basename(path.dirname(dir)) !== 'node_modules') {
          dir = path.dirname(dir);

          if (dir === path.dirname(dir)) {
            dir = this.options.rootDir;
            break;
          }
        }

        return path.join(dir, filename.slice(1));

      case '.':
        // Relative path.
        return path.resolve(dir, filename);

      default:
        // Module
        return filename;
    }
  }

  loadRelative(filename, extensions) {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Find a package.json file in the current package.
      let pkg = yield _this3.findPackage(path.dirname(filename)); // First try as a file, then as a directory.

      return (yield _this3.loadAsFile(filename, extensions, pkg)) || (yield _this3.loadDirectory(filename, extensions, pkg)) // eslint-disable-line no-return-await
      ;
    })();
  }

  findNodeModulePath(filename, dir) {
    var _this4 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (builtins[filename]) {
        if (_this4.options.target === 'node' && filename in nodeBuiltins) {
          throw new Error('Cannot resolve builtin module for node target');
        }

        return {
          filePath: builtins[filename]
        };
      }

      let parts = getModuleParts(filename);
      let root = path.parse(dir).root;

      while (dir !== root) {
        // Skip node_modules directories
        if (path.basename(dir) === 'node_modules') {
          dir = path.dirname(dir);
        }

        try {
          // First, check if the module directory exists. This prevents a lot of unnecessary checks later.
          let moduleDir = path.join(dir, 'node_modules', parts[0]);
          let stats = yield fs.stat(moduleDir);

          if (stats.isDirectory()) {
            return {
              moduleName: parts[0],
              subPath: parts[1],
              moduleDir: moduleDir,
              filePath: path.join(dir, 'node_modules', filename)
            };
          }
        } catch (err) {} // ignore
        // Move up a directory


        dir = path.dirname(dir);
      }
    })();
  }

  loadNodeModules(module, extensions) {
    var _this5 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      try {
        // If a module was specified as a module sub-path (e.g. some-module/some/path),
        // it is likely a file. Try loading it as a file first.
        if (module.subPath) {
          let pkg = yield _this5.readPackage(module.moduleDir);
          let res = yield _this5.loadAsFile(module.filePath, extensions, pkg);

          if (res) {
            return res;
          }
        } // Otherwise, load as a directory.


        return yield _this5.loadDirectory(module.filePath, extensions);
      } catch (e) {// ignore
      }
    })();
  }

  isFile(file) {
    return (0, _asyncToGenerator2.default)(function* () {
      try {
        let stat = yield fs.stat(file);
        return stat.isFile() || stat.isFIFO();
      } catch (err) {
        return false;
      }
    })();
  }

  loadDirectory(dir, extensions, pkg) {
    var _this6 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      try {
        pkg = yield _this6.readPackage(dir); // Get a list of possible package entry points.

        let entries = _this6.getPackageEntries(pkg);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let file = _step.value;
            // First try loading package.main as a file, then try as a directory.
            const res = (yield _this6.loadAsFile(file, extensions, pkg)) || (yield _this6.loadDirectory(file, extensions, pkg));

            if (res) {
              return res;
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
      } catch (err) {} // ignore
      // Fall back to an index file inside the directory.


      return _this6.loadAsFile(path.join(dir, 'index'), extensions, pkg);
    })();
  }

  readPackage(dir) {
    var _this7 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      let file = path.join(dir, 'package.json');

      if (_this7.packageCache.has(file)) {
        return _this7.packageCache.get(file);
      }

      let json = yield fs.readFile(file, 'utf8');
      let pkg = JSON.parse(json);
      pkg.pkgfile = file;
      pkg.pkgdir = dir; // If the package has a `source` field, check if it is behind a symlink.
      // If so, we treat the module as source code rather than a pre-compiled module.

      if (pkg.source) {
        let realpath = yield fs.realpath(file);

        if (realpath === file) {
          delete pkg.source;
        }
      }

      _this7.packageCache.set(file, pkg);

      return pkg;
    })();
  }

  getBrowserField(pkg) {
    let target = this.options.target || 'browser';
    return target === 'browser' ? pkg.browser : null;
  }

  getPackageEntries(pkg) {
    let browser = this.getBrowserField(pkg);

    if (browser && typeof browser === 'object' && browser[pkg.name]) {
      browser = browser[pkg.name];
    } // libraries like d3.js specifies node.js specific files in the "main" which breaks the build
    // we use the "browser" or "module" field to get the full dependency tree if available.
    // If this is a linked module with a `source` field, use that as the entry point.


    return [pkg.source, browser, pkg.module, pkg.main].filter(entry => typeof entry === 'string').map(main => {
      // Default to index file if no main field find
      if (!main || main === '.' || main === './') {
        main = 'index';
      }

      return path.resolve(pkg.pkgdir, main);
    });
  }

  loadAsFile(file, extensions, pkg) {
    var _this8 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Try all supported extensions
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _this8.expandFile(file, extensions, pkg)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let f = _step2.value;

          if (yield _this8.isFile(f)) {
            return {
              path: f,
              pkg
            };
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
    })();
  }

  expandFile(file, extensions, pkg, expandAliases = true) {
    // Expand extensions and aliases
    let res = [];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = extensions[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        let ext = _step3.value;
        let f = file + ext;

        if (expandAliases) {
          let alias = this.resolveAliases(file + ext, pkg);

          if (alias !== f) {
            res = res.concat(this.expandFile(alias, extensions, pkg, false));
          }
        }

        res.push(f);
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

    return res;
  }

  resolveAliases(filename, pkg) {
    // First resolve local package aliases, then project global ones.
    return this.resolvePackageAliases(this.resolvePackageAliases(filename, pkg), this.rootPackage);
  }

  resolvePackageAliases(filename, pkg) {
    if (!pkg) {
      return filename;
    } // Resolve aliases in the package.source, package.alias, and package.browser fields.


    return this.getAlias(filename, pkg.pkgdir, pkg.source) || this.getAlias(filename, pkg.pkgdir, pkg.alias) || this.getAlias(filename, pkg.pkgdir, this.getBrowserField(pkg)) || filename;
  }

  getAlias(filename, dir, aliases) {
    if (!filename || !aliases || typeof aliases !== 'object') {
      return null;
    }

    let alias; // If filename is an absolute path, get one relative to the package.json directory.

    if (path.isAbsolute(filename)) {
      filename = path.relative(dir, filename);

      if (filename[0] !== '.') {
        filename = './' + filename;
      }

      alias = this.lookupAlias(aliases, filename, dir);
    } else {
      // It is a node_module. First try the entire filename as a key.
      alias = this.lookupAlias(aliases, filename, dir);

      if (alias == null) {
        // If it didn't match, try only the module name.
        let parts = getModuleParts(filename);
        alias = this.lookupAlias(aliases, parts[0], dir);

        if (typeof alias === 'string') {
          // Append the filename back onto the aliased module.
          alias = path.join(alias, ...parts.slice(1));
        }
      }
    } // If the alias is set to `false`, return an empty file.


    if (alias === false) {
      return EMPTY_SHIM;
    }

    return alias;
  }

  lookupAlias(aliases, filename, dir) {
    // First, try looking up the exact filename
    let alias = aliases[filename];

    if (alias == null) {
      // Otherwise, try replacing glob keys
      for (let key in aliases) {
        if (isGlob(key)) {
          let re = micromatch.makeRe(key, {
            capture: true
          });

          if (re.test(filename)) {
            alias = filename.replace(re, aliases[key]);
            break;
          }
        }
      } // Or try a lookup replacing backslash characters with forward slash


      if (alias == null && ~filename.indexOf('\\')) {
        alias = aliases[filename.replace(/\\/g, '/')];
      }
    }

    if (typeof alias === 'string') {
      return this.resolveFilename(alias, dir);
    }

    return alias;
  }

  findPackage(dir) {
    var _this9 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Find the nearest package.json file within the current node_modules folder
      let root = path.parse(dir).root;

      while (dir !== root && path.basename(dir) !== 'node_modules') {
        try {
          return yield _this9.readPackage(dir);
        } catch (err) {// ignore
        }

        dir = path.dirname(dir);
      }
    })();
  }

  loadAlias(filename, dir) {
    var _this10 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Load the root project's package.json file if we haven't already
      if (!_this10.rootPackage) {
        _this10.rootPackage = yield _this10.findPackage(_this10.options.rootDir);
      } // Load the local package, and resolve aliases


      let pkg = yield _this10.findPackage(dir);
      return _this10.resolveAliases(filename, pkg);
    })();
  }

}

module.exports = Resolver;