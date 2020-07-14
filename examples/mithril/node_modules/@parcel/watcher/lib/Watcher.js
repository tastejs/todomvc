"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const fork = require('child_process').fork;

const optionsTransfer = require('./options');

const Path = require('path');

const _require = require('events'),
      EventEmitter = _require.EventEmitter;

const _require2 = require('@parcel/utils'),
      errorUtils = _require2.errorUtils;
/**
 * This watcher wraps chokidar so that we watch directories rather than individual files on macOS.
 * This prevents us from hitting EMFILE errors when running out of file descriptors.
 * Chokidar does not have support for watching directories on non-macOS platforms, so we disable
 * this behavior in order to prevent watching more individual files than necessary (e.g. node_modules).
 */


class Watcher extends EventEmitter {
  constructor(options = {
    // FS events on macOS are flakey in the tests, which write lots of files very quickly
    // See https://github.com/paulmillr/chokidar/issues/612
    useFsEvents: process.platform === 'darwin' && process.env.NODE_ENV !== 'test',
    ignoreInitial: true,
    ignorePermissionErrors: true,
    ignored: /(^|[/\\])\.(git|cache)/
  }) {
    super();
    this.options = optionsTransfer.encode(options);
    this.watchedPaths = new Set();
    this.child = null;
    this.ready = false;
    this.readyQueue = [];
    this.watchedDirectories = new Map();
    this.stopped = false;
    this.on('ready', () => {
      this.ready = true;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.readyQueue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          let func = _step.value;
          func();
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

      this.readyQueue = [];
    });
    this.startchild();
  }

  startchild() {
    if (this.child) return;
    let filteredArgs = process.execArgv.filter(v => !/^--(debug|inspect)/.test(v));
    let options = {
      execArgv: filteredArgs,
      env: process.env,
      cwd: process.cwd()
    };
    this.child = fork(Path.join(__dirname, 'child'), process.argv, options);

    if (this.watchedPaths.size > 0) {
      this.sendCommand('add', [Array.from(this.watchedPaths)]);
    }

    this.child.send({
      type: 'init',
      options: this.options
    });
    this.child.on('message', msg => this.handleEmit(msg.event, msg.path));
    this.child.on('error', () => {});
    this.child.on('exit', () => this.handleClosed()); // this.child.on('close', () => this.handleClosed());
  }

  handleClosed() {
    if (!this.stopped) {
      // Restart the child
      this.child = null;
      this.ready = false;
      this.startchild();
    }

    this.emit('childDead');
  }

  handleEmit(event, data) {
    if (event === 'watcherError') {
      data = errorUtils.jsonToError(data);
    }

    this.emit(event, data);
  }

  sendCommand(func, args) {
    if (!this.ready) {
      return this.readyQueue.push(() => this.sendCommand(func, args));
    }

    this.child.send({
      type: 'function',
      name: func,
      args: args
    });
  }

  _addPath(path) {
    if (!this.watchedPaths.has(path)) {
      this.watchedPaths.add(path);
      return true;
    }
  }

  add(paths) {
    let added = false;

    if (Array.isArray(paths)) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = paths[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          let path = _step2.value;
          added = !added ? this._addPath(path) : true;
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
    } else {
      added = this._addPath(paths);
    }

    if (added) this.sendCommand('add', [paths]);
  }

  _closePath(path) {
    if (this.watchedPaths.has(path)) {
      this.watchedPaths.delete(path);
    }

    this.sendCommand('_closePath', [path]);
  }

  _emulateChildDead() {
    if (!this.child) {
      return;
    }

    this.child.send({
      type: 'die'
    });
  }

  _emulateChildError() {
    if (!this.child) {
      return;
    }

    this.child.send({
      type: 'emulate_error'
    });
  }

  getWatched() {
    let watchList = {};
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this.watchedPaths[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        let path = _step3.value;
        let key = this.options.cwd ? Path.relative(this.options.cwd, path) : path;
        watchList[key || '.'] = [];
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

    return watchList;
  }
  /**
   * Find a parent directory of `path` which is already watched
   */


  getWatchedParent(path) {
    path = Path.dirname(path);
    let root = Path.parse(path).root;

    while (path !== root) {
      if (this.watchedDirectories.has(path)) {
        return path;
      }

      path = Path.dirname(path);
    }

    return null;
  }
  /**
   * Find a list of child directories of `path` which are already watched
   */


  getWatchedChildren(path) {
    path = Path.dirname(path) + Path.sep;
    let res = [];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = this.watchedDirectories.keys()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        let dir = _step4.value;

        if (dir.startsWith(path)) {
          res.push(dir);
        }
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

    return res;
  }
  /**
   * Add a path to the watcher
   */


  watch(path) {
    if (this.shouldWatchDirs) {
      // If there is no parent directory already watching this path, add a new watcher.
      let parent = this.getWatchedParent(path);

      if (!parent) {
        // Find watchers on child directories, and remove them. They will be handled by the new parent watcher.
        let children = this.getWatchedChildren(path);
        let count = 1;
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            let dir = _step5.value;
            count += this.watchedDirectories.get(dir);

            this._closePath(dir);

            this.watchedDirectories.delete(dir);
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

        let dir = Path.dirname(path);
        this.add(dir);
        this.watchedDirectories.set(dir, count);
      } else {
        // Otherwise, increment the reference count of the parent watcher.
        this.watchedDirectories.set(parent, this.watchedDirectories.get(parent) + 1);
      }
    } else {
      this.add(path);
    }
  }

  _unwatch(paths) {
    let removed = false;

    if (Array.isArray(paths)) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = paths[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          let p = _step6.value;
          removed = !removed ? this.watchedPaths.delete(p) : true;
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
    } else {
      removed = this.watchedPaths.delete(paths);
    }

    if (removed) this.sendCommand('unwatch', [paths]);
  }
  /**
   * Remove a path from the watcher
   */


  unwatch(path) {
    if (this.shouldWatchDirs) {
      let dir = this.getWatchedParent(path);

      if (dir) {
        // When the count of files watching a directory reaches zero, unwatch it.
        let count = this.watchedDirectories.get(dir) - 1;

        if (count === 0) {
          this.watchedDirectories.delete(dir);

          this._unwatch(dir);
        } else {
          this.watchedDirectories.set(dir, count);
        }
      }
    } else {
      this._unwatch(path);
    }
  }
  /**
   * Stop watching all paths
   */


  stop() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this.stopped = true;

      if (_this.child) {
        _this.child.kill();

        return new Promise(resolve => _this.once('childDead', resolve));
      }
    })();
  }

}

module.exports = Watcher;