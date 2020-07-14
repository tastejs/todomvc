"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const fs = require('@parcel/fs');

const path = require('path');

const md5 = require('./utils/md5');

const objectHash = require('./utils/objectHash');

const pkg = require('../package.json');

const logger = require('@parcel/logger');

const _require = require('./utils/glob'),
      isGlob = _require.isGlob,
      glob = _require.glob; // These keys can affect the output, so if they differ, the cache should not match


const OPTION_KEYS = ['publicURL', 'minify', 'hmr', 'target', 'scopeHoist', 'sourceMaps'];

class FSCache {
  constructor(options) {
    this.dir = path.resolve(options.cacheDir || '.cache');
    this.dirExists = false;
    this.invalidated = new Set();
    this.optionsHash = objectHash(OPTION_KEYS.reduce((p, k) => (p[k] = options[k], p), {
      version: pkg.version
    }));
  }

  ensureDirExists() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this.dirExists) {
        return;
      }

      yield fs.mkdirp(_this.dir); // Create sub-directories for every possible hex value
      // This speeds up large caches on many file systems since there are fewer files in a single directory.

      for (let i = 0; i < 256; i++) {
        yield fs.mkdirp(path.join(_this.dir, ('00' + i.toString(16)).slice(-2)));
      }

      _this.dirExists = true;
    })();
  }

  getCacheFile(filename) {
    let hash = md5(this.optionsHash + filename);
    return path.join(this.dir, hash.slice(0, 2), hash.slice(2) + '.json');
  }

  getLastModified(filename) {
    return (0, _asyncToGenerator2.default)(function* () {
      if (isGlob(filename)) {
        let files = yield glob(filename, {
          onlyFiles: true
        });
        return (yield Promise.all(files.map(file => fs.stat(file).then(({
          mtime
        }) => mtime.getTime())))).reduce((a, b) => Math.max(a, b), 0);
      }

      return (yield fs.stat(filename)).mtime.getTime();
    })();
  }

  writeDepMtimes(data) {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Write mtimes for each dependent file that is already compiled into this asset
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data.dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let dep = _step.value;

          if (dep.includedInParent) {
            dep.mtime = yield _this2.getLastModified(dep.name);
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
    })();
  }

  write(filename, data) {
    var _this3 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      try {
        yield _this3.ensureDirExists();
        yield _this3.writeDepMtimes(data);
        yield fs.writeFile(_this3.getCacheFile(filename), JSON.stringify(data));

        _this3.invalidated.delete(filename);
      } catch (err) {
        logger.error(`Error writing to cache: ${err.message}`);
      }
    })();
  }

  checkDepMtimes(data) {
    var _this4 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      // Check mtimes for files that are already compiled into this asset
      // If any of them changed, invalidate.
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = data.dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let dep = _step2.value;

          if (dep.includedInParent) {
            if ((yield _this4.getLastModified(dep.name)) > dep.mtime) {
              return false;
            }
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

      return true;
    })();
  }

  read(filename) {
    var _this5 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      if (_this5.invalidated.has(filename)) {
        return null;
      }

      let cacheFile = _this5.getCacheFile(filename);

      try {
        let stats = yield fs.stat(filename);
        let cacheStats = yield fs.stat(cacheFile);

        if (stats.mtime > cacheStats.mtime) {
          return null;
        }

        let json = yield fs.readFile(cacheFile);
        let data = JSON.parse(json);

        if (!(yield _this5.checkDepMtimes(data))) {
          return null;
        }

        return data;
      } catch (err) {
        return null;
      }
    })();
  }

  invalidate(filename) {
    this.invalidated.add(filename);
  }

  delete(filename) {
    var _this6 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      try {
        yield fs.unlink(_this6.getCacheFile(filename));

        _this6.invalidated.delete(filename);
      } catch (err) {// Fail silently
      }
    })();
  }

}

module.exports = FSCache;