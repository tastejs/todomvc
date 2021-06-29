'use strict';

var isPlainObject = require('is-plain-object');
var defaults = require('object.defaults/immutable');

module.exports = function(obj, fn, opts) {
  if (!isObject(obj)) {
    return;
  }

  if (typeof fn !== 'function') {
    return;
  }

  if (!isPlainObject(opts)) {
    opts = {};
  }

  forEachChild(obj, '', fn, 0, opts);
};

function forEachChild(node, baseKey, fn, depth, opts) {
  var keys = Object.keys(node);
  if (typeof opts.sort === 'function') {
    var sortedKeys = opts.sort(keys);
    if (Array.isArray(sortedKeys)) {
      keys = sortedKeys;
    }
  }

  depth += 1;

  for (var i = 0, n = keys.length; i < n; i++) {
    var key = keys[i];
    var keyChain = baseKey + '.' + key;
    var value = node[key];

    var nodeInfo = defaults(opts);
    nodeInfo.name = key;
    nodeInfo.index = i;
    nodeInfo.count = n;
    nodeInfo.depth = depth;
    nodeInfo.parent = node;

    var notDigg = fn(value, keyChain.slice(1), nodeInfo);
    if (notDigg || !isPlainObject(value)) {
      continue;
    }

    forEachChild(value, keyChain, fn, depth, opts);
  }
}

function isObject(v) {
  return Object.prototype.toString.call(v) === '[object Object]';
}

