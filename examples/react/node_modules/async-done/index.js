'use strict';

var domain = require('domain');

var eos = require('end-of-stream');
var p = require('process-nextick-args');
var once = require('once');
var exhaust = require('stream-exhaust');

var eosConfig = {
  error: false,
};

function rethrowAsync(err) {
  process.nextTick(rethrow);

  function rethrow() {
    throw err;
  }
}

function tryCatch(fn, args) {
  try {
    return fn.apply(null, args);
  } catch (err) {
    rethrowAsync(err);
  }
}

function asyncDone(fn, cb) {
  cb = once(cb);

  var d = domain.create();
  d.once('error', onError);
  var domainBoundFn = d.bind(fn);

  function done() {
    d.removeListener('error', onError);
    d.exit();
    return tryCatch(cb, arguments);
  }

  function onSuccess(result) {
    done(null, result);
  }

  function onError(error) {
    if (!error) {
      error = new Error('Promise rejected without Error');
    }
    done(error);
  }

  function asyncRunner() {
    var result = domainBoundFn(done);

    function onNext(state) {
      onNext.state = state;
    }

    function onCompleted() {
      onSuccess(onNext.state);
    }

    if (result && typeof result.on === 'function') {
      // Assume node stream
      d.add(result);
      eos(exhaust(result), eosConfig, done);
      return;
    }

    if (result && typeof result.subscribe === 'function') {
      // Assume RxJS observable
      result.subscribe(onNext, onError, onCompleted);
      return;
    }

    if (result && typeof result.then === 'function') {
      // Assume promise
      result.then(onSuccess, onError);
      return;
    }
  }

  p.nextTick(asyncRunner);
}

module.exports = asyncDone;
