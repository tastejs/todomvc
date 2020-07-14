"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

class PromiseQueue {
  constructor(callback, options = {}) {
    this.process = callback;
    this.maxConcurrent = options.maxConcurrent || Infinity;
    this.retry = options.retry !== false;
    this.queue = [];
    this.processing = new Set();
    this.processed = new Set();
    this.numRunning = 0;
    this.runPromise = null;
    this.resolve = null;
    this.reject = null;
  }

  add(job, ...args) {
    if (this.processing.has(job)) {
      return;
    }

    if (this.runPromise && this.numRunning < this.maxConcurrent) {
      this._runJob(job, args);
    } else {
      this.queue.push([job, args]);
    }

    this.processing.add(job);
  }

  run() {
    if (this.runPromise) {
      return this.runPromise;
    }

    const runPromise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.runPromise = runPromise;

    this._next();

    return runPromise;
  }

  _runJob(job, args) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      try {
        _this.numRunning++;
        yield _this.process(job, ...args);

        _this.processing.delete(job);

        _this.processed.add(job);

        _this.numRunning--;

        _this._next();
      } catch (err) {
        _this.numRunning--;

        if (_this.retry) {
          _this.queue.push([job, args]);
        } else {
          _this.processing.delete(job);
        }

        if (_this.reject) {
          _this.reject(err);
        }

        _this._reset();
      }
    })();
  }

  _next() {
    if (!this.runPromise) {
      return;
    }

    if (this.queue.length > 0) {
      while (this.queue.length > 0 && this.numRunning < this.maxConcurrent) {
        this._runJob(...this.queue.shift());
      }
    } else if (this.processing.size === 0) {
      this.resolve(this.processed);

      this._reset();
    }
  }

  _reset() {
    this.processed = new Set();
    this.runPromise = null;
    this.resolve = null;
    this.reject = null;
  }

}

module.exports = PromiseQueue;