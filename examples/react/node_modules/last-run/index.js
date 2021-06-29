'use strict';

var assert = require('assert');

var WM = require('es6-weak-map');
var hasNativeWeakMap = require('es6-weak-map/is-native-implemented');
var defaultResolution = require('default-resolution');

var runtimes = new WM();

function isFunction(fn) {
  return (typeof fn === 'function');
}

function isExtensible(fn) {
  if (hasNativeWeakMap) {
    // Native weakmap doesn't care about extensible
    return true;
  }

  return Object.isExtensible(fn);
}

function lastRun(fn, timeResolution) {
  assert(isFunction(fn), 'Only functions can check lastRun');
  assert(isExtensible(fn), 'Only extensible functions can check lastRun');

  var time = runtimes.get(fn);

  if (time == null) {
    return;
  }

  var resolution = defaultResolution(timeResolution);

  return time - (time % resolution);
}

function capture(fn, timestamp) {
  assert(isFunction(fn), 'Only functions can be captured');
  assert(isExtensible(fn), 'Only extensible functions can be captured');

  timestamp = timestamp || Date.now();

  runtimes.set(fn, timestamp);
}

function release(fn) {
  assert(isFunction(fn), 'Only functions can be captured');
  assert(isExtensible(fn), 'Only extensible functions can be captured');

  runtimes.delete(fn);
}

lastRun.capture = capture;
lastRun.release = release;

module.exports = lastRun;
