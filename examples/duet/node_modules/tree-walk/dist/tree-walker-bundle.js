!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.treeWalker=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright (c) 2014 Patrick Dubroy <pdubroy@gmail.com>
// This software is distributed under the terms of the MIT License.

'use strict';

var extend = require('util-extend'),
    WeakMap = require('./third_party/WeakMap');  // eslint-disable-line no-undef,no-native-reassign

// An internal object that can be returned from a visitor function to
// prevent a top-down walk from walking subtrees of a node.
var stopRecursion = {};

// An internal object that can be returned from a visitor function to
// cause the walk to immediately stop.
var stopWalk = {};

var hasOwnProp = Object.prototype.hasOwnProperty;

// Helpers
// -------

function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

function each(obj, predicate) {
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      if (predicate(obj[k], k, obj))
        return false;
    }
  }
  return true;
}

// Returns a copy of `obj` containing only the properties given by `keys`.
function pick(obj, keys) {
  var result = {};
  for (var i = 0, length = keys.length; i < length; i++) {
    var key = keys[i];
    if (key in obj) result[key] = obj[key];
  }
  return result;
}

// Makes a shallow copy of `arr`, and adds `obj` to the end of the copy.
function copyAndPush(arr, obj) {
  var result = arr.slice();
  result.push(obj);
  return result;
}

// Implements the default traversal strategy: if `obj` is a DOM node, walk
// its DOM children; otherwise, walk all the objects it references.
function defaultTraversal(obj) {
  return isElement(obj) ? obj.children : obj;
}

// Walk the tree recursively beginning with `root`, calling `beforeFunc`
// before visiting an objects descendents, and `afterFunc` afterwards.
// If `collectResults` is true, the last argument to `afterFunc` will be a
// collection of the results of walking the node's subtrees.
function walkImpl(root, traversalStrategy, beforeFunc, afterFunc, context, collectResults) {
  return (function _walk(stack, value, key, parent) {
    if (isObject(value) && stack.indexOf(value) >= 0)
      throw new TypeError('A cycle was detected at ' + value);

    if (beforeFunc) {
      var result = beforeFunc.call(context, value, key, parent);
      if (result === stopWalk) return stopWalk;
      if (result === stopRecursion) return;  // eslint-disable-line consistent-return
    }

    var subResults;
    var target = traversalStrategy(value);

    if (isObject(target) && Object.keys(target).length > 0) {
      // Collect results from subtrees in the same shape as the target.
      if (collectResults) subResults = Array.isArray(target) ? [] : {};

      var ok = each(target, function(obj, key) {
        var result = _walk(copyAndPush(stack, value), obj, key, value);
        if (result === stopWalk) return false;
        if (subResults) subResults[key] = result;
      });
      if (!ok) return stopWalk;
    }
    if (afterFunc) return afterFunc.call(context, value, key, parent, subResults);
  })([], root);
}

// Internal helper providing the implementation for `pluck` and `pluckRec`.
function pluck(obj, propertyName, recursive) {
  var results = [];
  this.preorder(obj, function(value, key) {
    if (!recursive && key === propertyName)
      return stopRecursion;
    if (hasOwnProp.call(value, propertyName))
      results[results.length] = value[propertyName];
  });
  return results;
}

function defineEnumerableProperty(obj, propName, getterFn) {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    get: getterFn
  });
}

// Returns an object containing the walk functions. If `traversalStrategy`
// is specified, it is a function determining how objects should be
// traversed. Given an object, it returns the object to be recursively
// walked. The default strategy is equivalent to `_.identity` for regular
// objects, and for DOM nodes it returns the node's DOM children.
function Walker(traversalStrategy) {
  if (!(this instanceof Walker))
    return new Walker(traversalStrategy);

  // There are two different strategy shorthands: if a single string is
  // specified, treat the value of that property as the traversal target.
  // If an array is specified, the traversal target is the node itself, but
  // only the properties contained in the array will be traversed.
  if (isString(traversalStrategy)) {
    var prop = traversalStrategy;
    traversalStrategy = function(node) {
      if (isObject(node) && prop in node) return node[prop];
    };
  } else if (Array.isArray(traversalStrategy)) {
    var props = traversalStrategy;
    traversalStrategy = function(node) {
      if (isObject(node)) return pick(node, props);
    };
  }
  this._traversalStrategy = traversalStrategy || defaultTraversal;
}

extend(Walker.prototype, {
  STOP_RECURSION: stopRecursion,

  // Performs a preorder traversal of `obj` and returns the first value
  // which passes a truth test.
  find: function(obj, visitor, context) {
    var result;
    this.preorder(obj, function(value, key, parent) {
      if (visitor.call(context, value, key, parent)) {
        result = value;
        return stopWalk;
      }
    }, context);
    return result;
  },

  // Recursively traverses `obj` and returns all the elements that pass a
  // truth test. `strategy` is the traversal function to use, e.g. `preorder`
  // or `postorder`.
  filter: function(obj, strategy, visitor, context) {
    var results = [];
    if (obj === null) return results;
    strategy(obj, function(value, key, parent) {
      if (visitor.call(context, value, key, parent)) results.push(value);
    }, null, this._traversalStrategy);
    return results;
  },

  // Recursively traverses `obj` and returns all the elements for which a
  // truth test fails.
  reject: function(obj, strategy, visitor, context) {
    return this.filter(obj, strategy, function(value, key, parent) {
      return !visitor.call(context, value, key, parent);
    });
  },

  // Produces a new array of values by recursively traversing `obj` and
  // mapping each value through the transformation function `visitor`.
  // `strategy` is the traversal function to use, e.g. `preorder` or
  // `postorder`.
  map: function(obj, strategy, visitor, context) {
    var results = [];
    strategy(obj, function(value, key, parent) {
      results[results.length] = visitor.call(context, value, key, parent);
    }, null, this._traversalStrategy);
    return results;
  },

  // Return the value of properties named `propertyName` reachable from the
  // tree rooted at `obj`. Results are not recursively searched; use
  // `pluckRec` for that.
  pluck: function(obj, propertyName) {
    return pluck.call(this, obj, propertyName, false);
  },

  // Version of `pluck` which recursively searches results for nested objects
  // with a property named `propertyName`.
  pluckRec: function(obj, propertyName) {
    return pluck.call(this, obj, propertyName, true);
  },

  // Recursively traverses `obj` in a depth-first fashion, invoking the
  // `visitor` function for each object only after traversing its children.
  // `traversalStrategy` is intended for internal callers, and is not part
  // of the public API.
  postorder: function(obj, visitor, context, traversalStrategy) {
    traversalStrategy = traversalStrategy || this._traversalStrategy;
    walkImpl(obj, traversalStrategy, null, visitor, context);
  },

  // Recursively traverses `obj` in a depth-first fashion, invoking the
  // `visitor` function for each object before traversing its children.
  // `traversalStrategy` is intended for internal callers, and is not part
  // of the public API.
  preorder: function(obj, visitor, context, traversalStrategy) {
    traversalStrategy = traversalStrategy || this._traversalStrategy;
    walkImpl(obj, traversalStrategy, visitor, null, context);
  },

  // Builds up a single value by doing a post-order traversal of `obj` and
  // calling the `visitor` function on each object in the tree. For leaf
  // objects, the `memo` argument to `visitor` is the value of the `leafMemo`
  // argument to `reduce`. For non-leaf objects, `memo` is a collection of
  // the results of calling `reduce` on the object's children.
  reduce: function(obj, visitor, leafMemo, context) {
    var reducer = function(value, key, parent, subResults) {
      return visitor(subResults || leafMemo, value, key, parent);
    };
    return walkImpl(obj, this._traversalStrategy, null, reducer, context, true);
  },

  // An 'attribute' is a value that is calculated by invoking a visitor
  // function on a node. The first argument of the visitor is a collection
  // of the attribute values for the node's children. These are calculated
  // lazily -- in this way the visitor can decide in what order to visit the
  // subtrees.
  createAttribute: function(visitor, defaultValue, context) {
    var self = this;
    var memo = new WeakMap();
    function _visit(stack, value, key, parent) {
      if (isObject(value) && stack.indexOf(value) >= 0)
        throw new TypeError('A cycle was detected at ' + value);

      if (memo.has(value))
        return memo.get(value);

      var subResults;
      var target = self._traversalStrategy(value);
      if (isObject(target) && Object.keys(target).length > 0) {
        subResults = {};
        each(target, function(child, k) {
          defineEnumerableProperty(subResults, k, function() {
            return _visit(copyAndPush(stack, value), child, k, value);
          });
        });
      }
      var result = visitor.call(context, subResults, value, key, parent);
      memo.set(value, result);
      return result;
    }
    return function(obj) { return _visit([], obj); };
  }
});

var WalkerProto = Walker.prototype;

// Set up a few convenient aliases.
WalkerProto.each = WalkerProto.preorder;
WalkerProto.collect = WalkerProto.map;
WalkerProto.detect = WalkerProto.find;
WalkerProto.select = WalkerProto.filter;

// Export the walker constructor, but make it behave like an instance.
Walker._traversalStrategy = defaultTraversal;
module.exports = extend(Walker, WalkerProto);

},{"./third_party/WeakMap":3,"util-extend":2}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = extend;
function extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || typeof add !== 'object') return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}

},{}],3:[function(require,module,exports){
/*
 * Copyright 2012 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

if (typeof WeakMap === 'undefined') {
  (function() {
    var defineProperty = Object.defineProperty;
    var counter = Date.now() % 1e9;

    var WeakMap = function() {
      this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
    };

    WeakMap.prototype = {
      set: function(key, value) {
        var entry = key[this.name];
        if (entry && entry[0] === key)
          entry[1] = value;
        else
          defineProperty(key, this.name, {value: [key, value], writable: true});
        return this;
      },
      get: function(key) {
        var entry;
        return (entry = key[this.name]) && entry[0] === key ?
            entry[1] : undefined;
      },
      delete: function(key) {
        var entry = key[this.name];
        if (!entry || entry[0] !== key) return false;
        entry[0] = entry[1] = undefined;
        return true;
      },
      has: function(key) {
        var entry = key[this.name];
        if (!entry) return false;
        return entry[0] === key;
      }
    };

    module.exports = WeakMap;
  })();
} else {
  module.exports = WeakMap;
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZHVicm95L2Rldi90cmVlLXdhbGsvaW5kZXguanMiLCIvVXNlcnMvZHVicm95L2Rldi90cmVlLXdhbGsvbm9kZV9tb2R1bGVzL3V0aWwtZXh0ZW5kL2V4dGVuZC5qcyIsIi9Vc2Vycy9kdWJyb3kvZGV2L3RyZWUtd2Fsay90aGlyZF9wYXJ0eS9XZWFrTWFwL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIENvcHlyaWdodCAoYykgMjAxNCBQYXRyaWNrIER1YnJveSA8cGR1YnJveUBnbWFpbC5jb20+XG4vLyBUaGlzIHNvZnR3YXJlIGlzIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIExpY2Vuc2UuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3V0aWwtZXh0ZW5kJyksXG4gICAgV2Vha01hcCA9IHJlcXVpcmUoJy4vdGhpcmRfcGFydHkvV2Vha01hcCcpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZixuby1uYXRpdmUtcmVhc3NpZ25cblxuLy8gQW4gaW50ZXJuYWwgb2JqZWN0IHRoYXQgY2FuIGJlIHJldHVybmVkIGZyb20gYSB2aXNpdG9yIGZ1bmN0aW9uIHRvXG4vLyBwcmV2ZW50IGEgdG9wLWRvd24gd2FsayBmcm9tIHdhbGtpbmcgc3VidHJlZXMgb2YgYSBub2RlLlxudmFyIHN0b3BSZWN1cnNpb24gPSB7fTtcblxuLy8gQW4gaW50ZXJuYWwgb2JqZWN0IHRoYXQgY2FuIGJlIHJldHVybmVkIGZyb20gYSB2aXNpdG9yIGZ1bmN0aW9uIHRvXG4vLyBjYXVzZSB0aGUgd2FsayB0byBpbW1lZGlhdGVseSBzdG9wLlxudmFyIHN0b3BXYWxrID0ge307XG5cbnZhciBoYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLy8gSGVscGVyc1xuLy8gLS0tLS0tLVxuXG5mdW5jdGlvbiBpc0VsZW1lbnQob2JqKSB7XG4gIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbn1cblxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIG9iajtcbiAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG59XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufVxuXG5mdW5jdGlvbiBlYWNoKG9iaiwgcHJlZGljYXRlKSB7XG4gIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpba10sIGssIG9iaikpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFJldHVybnMgYSBjb3B5IG9mIGBvYmpgIGNvbnRhaW5pbmcgb25seSB0aGUgcHJvcGVydGllcyBnaXZlbiBieSBga2V5c2AuXG5mdW5jdGlvbiBwaWNrKG9iaiwga2V5cykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgaWYgKGtleSBpbiBvYmopIHJlc3VsdFtrZXldID0gb2JqW2tleV07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gTWFrZXMgYSBzaGFsbG93IGNvcHkgb2YgYGFycmAsIGFuZCBhZGRzIGBvYmpgIHRvIHRoZSBlbmQgb2YgdGhlIGNvcHkuXG5mdW5jdGlvbiBjb3B5QW5kUHVzaChhcnIsIG9iaikge1xuICB2YXIgcmVzdWx0ID0gYXJyLnNsaWNlKCk7XG4gIHJlc3VsdC5wdXNoKG9iaik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIEltcGxlbWVudHMgdGhlIGRlZmF1bHQgdHJhdmVyc2FsIHN0cmF0ZWd5OiBpZiBgb2JqYCBpcyBhIERPTSBub2RlLCB3YWxrXG4vLyBpdHMgRE9NIGNoaWxkcmVuOyBvdGhlcndpc2UsIHdhbGsgYWxsIHRoZSBvYmplY3RzIGl0IHJlZmVyZW5jZXMuXG5mdW5jdGlvbiBkZWZhdWx0VHJhdmVyc2FsKG9iaikge1xuICByZXR1cm4gaXNFbGVtZW50KG9iaikgPyBvYmouY2hpbGRyZW4gOiBvYmo7XG59XG5cbi8vIFdhbGsgdGhlIHRyZWUgcmVjdXJzaXZlbHkgYmVnaW5uaW5nIHdpdGggYHJvb3RgLCBjYWxsaW5nIGBiZWZvcmVGdW5jYFxuLy8gYmVmb3JlIHZpc2l0aW5nIGFuIG9iamVjdHMgZGVzY2VuZGVudHMsIGFuZCBgYWZ0ZXJGdW5jYCBhZnRlcndhcmRzLlxuLy8gSWYgYGNvbGxlY3RSZXN1bHRzYCBpcyB0cnVlLCB0aGUgbGFzdCBhcmd1bWVudCB0byBgYWZ0ZXJGdW5jYCB3aWxsIGJlIGFcbi8vIGNvbGxlY3Rpb24gb2YgdGhlIHJlc3VsdHMgb2Ygd2Fsa2luZyB0aGUgbm9kZSdzIHN1YnRyZWVzLlxuZnVuY3Rpb24gd2Fsa0ltcGwocm9vdCwgdHJhdmVyc2FsU3RyYXRlZ3ksIGJlZm9yZUZ1bmMsIGFmdGVyRnVuYywgY29udGV4dCwgY29sbGVjdFJlc3VsdHMpIHtcbiAgcmV0dXJuIChmdW5jdGlvbiBfd2FsayhzdGFjaywgdmFsdWUsIGtleSwgcGFyZW50KSB7XG4gICAgaWYgKGlzT2JqZWN0KHZhbHVlKSAmJiBzdGFjay5pbmRleE9mKHZhbHVlKSA+PSAwKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBjeWNsZSB3YXMgZGV0ZWN0ZWQgYXQgJyArIHZhbHVlKTtcblxuICAgIGlmIChiZWZvcmVGdW5jKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gYmVmb3JlRnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBrZXksIHBhcmVudCk7XG4gICAgICBpZiAocmVzdWx0ID09PSBzdG9wV2FsaykgcmV0dXJuIHN0b3BXYWxrO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gc3RvcFJlY3Vyc2lvbikgcmV0dXJuOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgIH1cblxuICAgIHZhciBzdWJSZXN1bHRzO1xuICAgIHZhciB0YXJnZXQgPSB0cmF2ZXJzYWxTdHJhdGVneSh2YWx1ZSk7XG5cbiAgICBpZiAoaXNPYmplY3QodGFyZ2V0KSAmJiBPYmplY3Qua2V5cyh0YXJnZXQpLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIENvbGxlY3QgcmVzdWx0cyBmcm9tIHN1YnRyZWVzIGluIHRoZSBzYW1lIHNoYXBlIGFzIHRoZSB0YXJnZXQuXG4gICAgICBpZiAoY29sbGVjdFJlc3VsdHMpIHN1YlJlc3VsdHMgPSBBcnJheS5pc0FycmF5KHRhcmdldCkgPyBbXSA6IHt9O1xuXG4gICAgICB2YXIgb2sgPSBlYWNoKHRhcmdldCwgZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IF93YWxrKGNvcHlBbmRQdXNoKHN0YWNrLCB2YWx1ZSksIG9iaiwga2V5LCB2YWx1ZSk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IHN0b3BXYWxrKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChzdWJSZXN1bHRzKSBzdWJSZXN1bHRzW2tleV0gPSByZXN1bHQ7XG4gICAgICB9KTtcbiAgICAgIGlmICghb2spIHJldHVybiBzdG9wV2FsaztcbiAgICB9XG4gICAgaWYgKGFmdGVyRnVuYykgcmV0dXJuIGFmdGVyRnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBrZXksIHBhcmVudCwgc3ViUmVzdWx0cyk7XG4gIH0pKFtdLCByb290KTtcbn1cblxuLy8gSW50ZXJuYWwgaGVscGVyIHByb3ZpZGluZyB0aGUgaW1wbGVtZW50YXRpb24gZm9yIGBwbHVja2AgYW5kIGBwbHVja1JlY2AuXG5mdW5jdGlvbiBwbHVjayhvYmosIHByb3BlcnR5TmFtZSwgcmVjdXJzaXZlKSB7XG4gIHZhciByZXN1bHRzID0gW107XG4gIHRoaXMucHJlb3JkZXIob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgaWYgKCFyZWN1cnNpdmUgJiYga2V5ID09PSBwcm9wZXJ0eU5hbWUpXG4gICAgICByZXR1cm4gc3RvcFJlY3Vyc2lvbjtcbiAgICBpZiAoaGFzT3duUHJvcC5jYWxsKHZhbHVlLCBwcm9wZXJ0eU5hbWUpKVxuICAgICAgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aF0gPSB2YWx1ZVtwcm9wZXJ0eU5hbWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIGRlZmluZUVudW1lcmFibGVQcm9wZXJ0eShvYmosIHByb3BOYW1lLCBnZXR0ZXJGbikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wTmFtZSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBnZXR0ZXJGblxuICB9KTtcbn1cblxuLy8gUmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgd2FsayBmdW5jdGlvbnMuIElmIGB0cmF2ZXJzYWxTdHJhdGVneWBcbi8vIGlzIHNwZWNpZmllZCwgaXQgaXMgYSBmdW5jdGlvbiBkZXRlcm1pbmluZyBob3cgb2JqZWN0cyBzaG91bGQgYmVcbi8vIHRyYXZlcnNlZC4gR2l2ZW4gYW4gb2JqZWN0LCBpdCByZXR1cm5zIHRoZSBvYmplY3QgdG8gYmUgcmVjdXJzaXZlbHlcbi8vIHdhbGtlZC4gVGhlIGRlZmF1bHQgc3RyYXRlZ3kgaXMgZXF1aXZhbGVudCB0byBgXy5pZGVudGl0eWAgZm9yIHJlZ3VsYXJcbi8vIG9iamVjdHMsIGFuZCBmb3IgRE9NIG5vZGVzIGl0IHJldHVybnMgdGhlIG5vZGUncyBET00gY2hpbGRyZW4uXG5mdW5jdGlvbiBXYWxrZXIodHJhdmVyc2FsU3RyYXRlZ3kpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFdhbGtlcikpXG4gICAgcmV0dXJuIG5ldyBXYWxrZXIodHJhdmVyc2FsU3RyYXRlZ3kpO1xuXG4gIC8vIFRoZXJlIGFyZSB0d28gZGlmZmVyZW50IHN0cmF0ZWd5IHNob3J0aGFuZHM6IGlmIGEgc2luZ2xlIHN0cmluZyBpc1xuICAvLyBzcGVjaWZpZWQsIHRyZWF0IHRoZSB2YWx1ZSBvZiB0aGF0IHByb3BlcnR5IGFzIHRoZSB0cmF2ZXJzYWwgdGFyZ2V0LlxuICAvLyBJZiBhbiBhcnJheSBpcyBzcGVjaWZpZWQsIHRoZSB0cmF2ZXJzYWwgdGFyZ2V0IGlzIHRoZSBub2RlIGl0c2VsZiwgYnV0XG4gIC8vIG9ubHkgdGhlIHByb3BlcnRpZXMgY29udGFpbmVkIGluIHRoZSBhcnJheSB3aWxsIGJlIHRyYXZlcnNlZC5cbiAgaWYgKGlzU3RyaW5nKHRyYXZlcnNhbFN0cmF0ZWd5KSkge1xuICAgIHZhciBwcm9wID0gdHJhdmVyc2FsU3RyYXRlZ3k7XG4gICAgdHJhdmVyc2FsU3RyYXRlZ3kgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICBpZiAoaXNPYmplY3Qobm9kZSkgJiYgcHJvcCBpbiBub2RlKSByZXR1cm4gbm9kZVtwcm9wXTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodHJhdmVyc2FsU3RyYXRlZ3kpKSB7XG4gICAgdmFyIHByb3BzID0gdHJhdmVyc2FsU3RyYXRlZ3k7XG4gICAgdHJhdmVyc2FsU3RyYXRlZ3kgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICBpZiAoaXNPYmplY3Qobm9kZSkpIHJldHVybiBwaWNrKG5vZGUsIHByb3BzKTtcbiAgICB9O1xuICB9XG4gIHRoaXMuX3RyYXZlcnNhbFN0cmF0ZWd5ID0gdHJhdmVyc2FsU3RyYXRlZ3kgfHwgZGVmYXVsdFRyYXZlcnNhbDtcbn1cblxuZXh0ZW5kKFdhbGtlci5wcm90b3R5cGUsIHtcbiAgU1RPUF9SRUNVUlNJT046IHN0b3BSZWN1cnNpb24sXG5cbiAgLy8gUGVyZm9ybXMgYSBwcmVvcmRlciB0cmF2ZXJzYWwgb2YgYG9iamAgYW5kIHJldHVybnMgdGhlIGZpcnN0IHZhbHVlXG4gIC8vIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuXG4gIGZpbmQ6IGZ1bmN0aW9uKG9iaiwgdmlzaXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQ7XG4gICAgdGhpcy5wcmVvcmRlcihvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXksIHBhcmVudCkge1xuICAgICAgaWYgKHZpc2l0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwga2V5LCBwYXJlbnQpKSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gc3RvcFdhbGs7XG4gICAgICB9XG4gICAgfSwgY29udGV4dCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcblxuICAvLyBSZWN1cnNpdmVseSB0cmF2ZXJzZXMgYG9iamAgYW5kIHJldHVybnMgYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYVxuICAvLyB0cnV0aCB0ZXN0LiBgc3RyYXRlZ3lgIGlzIHRoZSB0cmF2ZXJzYWwgZnVuY3Rpb24gdG8gdXNlLCBlLmcuIGBwcmVvcmRlcmBcbiAgLy8gb3IgYHBvc3RvcmRlcmAuXG4gIGZpbHRlcjogZnVuY3Rpb24ob2JqLCBzdHJhdGVneSwgdmlzaXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgc3RyYXRlZ3kob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBwYXJlbnQpIHtcbiAgICAgIGlmICh2aXNpdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgcGFyZW50KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgICB9LCBudWxsLCB0aGlzLl90cmF2ZXJzYWxTdHJhdGVneSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH0sXG5cbiAgLy8gUmVjdXJzaXZlbHkgdHJhdmVyc2VzIGBvYmpgIGFuZCByZXR1cm5zIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGFcbiAgLy8gdHJ1dGggdGVzdCBmYWlscy5cbiAgcmVqZWN0OiBmdW5jdGlvbihvYmosIHN0cmF0ZWd5LCB2aXNpdG9yLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG9iaiwgc3RyYXRlZ3ksIGZ1bmN0aW9uKHZhbHVlLCBrZXksIHBhcmVudCkge1xuICAgICAgcmV0dXJuICF2aXNpdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgcGFyZW50KTtcbiAgICB9KTtcbiAgfSxcblxuICAvLyBQcm9kdWNlcyBhIG5ldyBhcnJheSBvZiB2YWx1ZXMgYnkgcmVjdXJzaXZlbHkgdHJhdmVyc2luZyBgb2JqYCBhbmRcbiAgLy8gbWFwcGluZyBlYWNoIHZhbHVlIHRocm91Z2ggdGhlIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uIGB2aXNpdG9yYC5cbiAgLy8gYHN0cmF0ZWd5YCBpcyB0aGUgdHJhdmVyc2FsIGZ1bmN0aW9uIHRvIHVzZSwgZS5nLiBgcHJlb3JkZXJgIG9yXG4gIC8vIGBwb3N0b3JkZXJgLlxuICBtYXA6IGZ1bmN0aW9uKG9iaiwgc3RyYXRlZ3ksIHZpc2l0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHN0cmF0ZWd5KG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgcGFyZW50KSB7XG4gICAgICByZXN1bHRzW3Jlc3VsdHMubGVuZ3RoXSA9IHZpc2l0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwga2V5LCBwYXJlbnQpO1xuICAgIH0sIG51bGwsIHRoaXMuX3RyYXZlcnNhbFN0cmF0ZWd5KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfSxcblxuICAvLyBSZXR1cm4gdGhlIHZhbHVlIG9mIHByb3BlcnRpZXMgbmFtZWQgYHByb3BlcnR5TmFtZWAgcmVhY2hhYmxlIGZyb20gdGhlXG4gIC8vIHRyZWUgcm9vdGVkIGF0IGBvYmpgLiBSZXN1bHRzIGFyZSBub3QgcmVjdXJzaXZlbHkgc2VhcmNoZWQ7IHVzZVxuICAvLyBgcGx1Y2tSZWNgIGZvciB0aGF0LlxuICBwbHVjazogZnVuY3Rpb24ob2JqLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICByZXR1cm4gcGx1Y2suY2FsbCh0aGlzLCBvYmosIHByb3BlcnR5TmFtZSwgZmFsc2UpO1xuICB9LFxuXG4gIC8vIFZlcnNpb24gb2YgYHBsdWNrYCB3aGljaCByZWN1cnNpdmVseSBzZWFyY2hlcyByZXN1bHRzIGZvciBuZXN0ZWQgb2JqZWN0c1xuICAvLyB3aXRoIGEgcHJvcGVydHkgbmFtZWQgYHByb3BlcnR5TmFtZWAuXG4gIHBsdWNrUmVjOiBmdW5jdGlvbihvYmosIHByb3BlcnR5TmFtZSkge1xuICAgIHJldHVybiBwbHVjay5jYWxsKHRoaXMsIG9iaiwgcHJvcGVydHlOYW1lLCB0cnVlKTtcbiAgfSxcblxuICAvLyBSZWN1cnNpdmVseSB0cmF2ZXJzZXMgYG9iamAgaW4gYSBkZXB0aC1maXJzdCBmYXNoaW9uLCBpbnZva2luZyB0aGVcbiAgLy8gYHZpc2l0b3JgIGZ1bmN0aW9uIGZvciBlYWNoIG9iamVjdCBvbmx5IGFmdGVyIHRyYXZlcnNpbmcgaXRzIGNoaWxkcmVuLlxuICAvLyBgdHJhdmVyc2FsU3RyYXRlZ3lgIGlzIGludGVuZGVkIGZvciBpbnRlcm5hbCBjYWxsZXJzLCBhbmQgaXMgbm90IHBhcnRcbiAgLy8gb2YgdGhlIHB1YmxpYyBBUEkuXG4gIHBvc3RvcmRlcjogZnVuY3Rpb24ob2JqLCB2aXNpdG9yLCBjb250ZXh0LCB0cmF2ZXJzYWxTdHJhdGVneSkge1xuICAgIHRyYXZlcnNhbFN0cmF0ZWd5ID0gdHJhdmVyc2FsU3RyYXRlZ3kgfHwgdGhpcy5fdHJhdmVyc2FsU3RyYXRlZ3k7XG4gICAgd2Fsa0ltcGwob2JqLCB0cmF2ZXJzYWxTdHJhdGVneSwgbnVsbCwgdmlzaXRvciwgY29udGV4dCk7XG4gIH0sXG5cbiAgLy8gUmVjdXJzaXZlbHkgdHJhdmVyc2VzIGBvYmpgIGluIGEgZGVwdGgtZmlyc3QgZmFzaGlvbiwgaW52b2tpbmcgdGhlXG4gIC8vIGB2aXNpdG9yYCBmdW5jdGlvbiBmb3IgZWFjaCBvYmplY3QgYmVmb3JlIHRyYXZlcnNpbmcgaXRzIGNoaWxkcmVuLlxuICAvLyBgdHJhdmVyc2FsU3RyYXRlZ3lgIGlzIGludGVuZGVkIGZvciBpbnRlcm5hbCBjYWxsZXJzLCBhbmQgaXMgbm90IHBhcnRcbiAgLy8gb2YgdGhlIHB1YmxpYyBBUEkuXG4gIHByZW9yZGVyOiBmdW5jdGlvbihvYmosIHZpc2l0b3IsIGNvbnRleHQsIHRyYXZlcnNhbFN0cmF0ZWd5KSB7XG4gICAgdHJhdmVyc2FsU3RyYXRlZ3kgPSB0cmF2ZXJzYWxTdHJhdGVneSB8fCB0aGlzLl90cmF2ZXJzYWxTdHJhdGVneTtcbiAgICB3YWxrSW1wbChvYmosIHRyYXZlcnNhbFN0cmF0ZWd5LCB2aXNpdG9yLCBudWxsLCBjb250ZXh0KTtcbiAgfSxcblxuICAvLyBCdWlsZHMgdXAgYSBzaW5nbGUgdmFsdWUgYnkgZG9pbmcgYSBwb3N0LW9yZGVyIHRyYXZlcnNhbCBvZiBgb2JqYCBhbmRcbiAgLy8gY2FsbGluZyB0aGUgYHZpc2l0b3JgIGZ1bmN0aW9uIG9uIGVhY2ggb2JqZWN0IGluIHRoZSB0cmVlLiBGb3IgbGVhZlxuICAvLyBvYmplY3RzLCB0aGUgYG1lbW9gIGFyZ3VtZW50IHRvIGB2aXNpdG9yYCBpcyB0aGUgdmFsdWUgb2YgdGhlIGBsZWFmTWVtb2BcbiAgLy8gYXJndW1lbnQgdG8gYHJlZHVjZWAuIEZvciBub24tbGVhZiBvYmplY3RzLCBgbWVtb2AgaXMgYSBjb2xsZWN0aW9uIG9mXG4gIC8vIHRoZSByZXN1bHRzIG9mIGNhbGxpbmcgYHJlZHVjZWAgb24gdGhlIG9iamVjdCdzIGNoaWxkcmVuLlxuICByZWR1Y2U6IGZ1bmN0aW9uKG9iaiwgdmlzaXRvciwgbGVhZk1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgcmVkdWNlciA9IGZ1bmN0aW9uKHZhbHVlLCBrZXksIHBhcmVudCwgc3ViUmVzdWx0cykge1xuICAgICAgcmV0dXJuIHZpc2l0b3Ioc3ViUmVzdWx0cyB8fCBsZWFmTWVtbywgdmFsdWUsIGtleSwgcGFyZW50KTtcbiAgICB9O1xuICAgIHJldHVybiB3YWxrSW1wbChvYmosIHRoaXMuX3RyYXZlcnNhbFN0cmF0ZWd5LCBudWxsLCByZWR1Y2VyLCBjb250ZXh0LCB0cnVlKTtcbiAgfSxcblxuICAvLyBBbiAnYXR0cmlidXRlJyBpcyBhIHZhbHVlIHRoYXQgaXMgY2FsY3VsYXRlZCBieSBpbnZva2luZyBhIHZpc2l0b3JcbiAgLy8gZnVuY3Rpb24gb24gYSBub2RlLiBUaGUgZmlyc3QgYXJndW1lbnQgb2YgdGhlIHZpc2l0b3IgaXMgYSBjb2xsZWN0aW9uXG4gIC8vIG9mIHRoZSBhdHRyaWJ1dGUgdmFsdWVzIGZvciB0aGUgbm9kZSdzIGNoaWxkcmVuLiBUaGVzZSBhcmUgY2FsY3VsYXRlZFxuICAvLyBsYXppbHkgLS0gaW4gdGhpcyB3YXkgdGhlIHZpc2l0b3IgY2FuIGRlY2lkZSBpbiB3aGF0IG9yZGVyIHRvIHZpc2l0IHRoZVxuICAvLyBzdWJ0cmVlcy5cbiAgY3JlYXRlQXR0cmlidXRlOiBmdW5jdGlvbih2aXNpdG9yLCBkZWZhdWx0VmFsdWUsIGNvbnRleHQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG1lbW8gPSBuZXcgV2Vha01hcCgpO1xuICAgIGZ1bmN0aW9uIF92aXNpdChzdGFjaywgdmFsdWUsIGtleSwgcGFyZW50KSB7XG4gICAgICBpZiAoaXNPYmplY3QodmFsdWUpICYmIHN0YWNrLmluZGV4T2YodmFsdWUpID49IDApXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0EgY3ljbGUgd2FzIGRldGVjdGVkIGF0ICcgKyB2YWx1ZSk7XG5cbiAgICAgIGlmIChtZW1vLmhhcyh2YWx1ZSkpXG4gICAgICAgIHJldHVybiBtZW1vLmdldCh2YWx1ZSk7XG5cbiAgICAgIHZhciBzdWJSZXN1bHRzO1xuICAgICAgdmFyIHRhcmdldCA9IHNlbGYuX3RyYXZlcnNhbFN0cmF0ZWd5KHZhbHVlKTtcbiAgICAgIGlmIChpc09iamVjdCh0YXJnZXQpICYmIE9iamVjdC5rZXlzKHRhcmdldCkubGVuZ3RoID4gMCkge1xuICAgICAgICBzdWJSZXN1bHRzID0ge307XG4gICAgICAgIGVhY2godGFyZ2V0LCBmdW5jdGlvbihjaGlsZCwgaykge1xuICAgICAgICAgIGRlZmluZUVudW1lcmFibGVQcm9wZXJ0eShzdWJSZXN1bHRzLCBrLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBfdmlzaXQoY29weUFuZFB1c2goc3RhY2ssIHZhbHVlKSwgY2hpbGQsIGssIHZhbHVlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0ID0gdmlzaXRvci5jYWxsKGNvbnRleHQsIHN1YlJlc3VsdHMsIHZhbHVlLCBrZXksIHBhcmVudCk7XG4gICAgICBtZW1vLnNldCh2YWx1ZSwgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHsgcmV0dXJuIF92aXNpdChbXSwgb2JqKTsgfTtcbiAgfVxufSk7XG5cbnZhciBXYWxrZXJQcm90byA9IFdhbGtlci5wcm90b3R5cGU7XG5cbi8vIFNldCB1cCBhIGZldyBjb252ZW5pZW50IGFsaWFzZXMuXG5XYWxrZXJQcm90by5lYWNoID0gV2Fsa2VyUHJvdG8ucHJlb3JkZXI7XG5XYWxrZXJQcm90by5jb2xsZWN0ID0gV2Fsa2VyUHJvdG8ubWFwO1xuV2Fsa2VyUHJvdG8uZGV0ZWN0ID0gV2Fsa2VyUHJvdG8uZmluZDtcbldhbGtlclByb3RvLnNlbGVjdCA9IFdhbGtlclByb3RvLmZpbHRlcjtcblxuLy8gRXhwb3J0IHRoZSB3YWxrZXIgY29uc3RydWN0b3IsIGJ1dCBtYWtlIGl0IGJlaGF2ZSBsaWtlIGFuIGluc3RhbmNlLlxuV2Fsa2VyLl90cmF2ZXJzYWxTdHJhdGVneSA9IGRlZmF1bHRUcmF2ZXJzYWw7XG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZChXYWxrZXIsIFdhbGtlclByb3RvKTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZDtcbmZ1bmN0aW9uIGV4dGVuZChvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8IHR5cGVvZiBhZGQgIT09ICdvYmplY3QnKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufVxuIiwiLypcbiAqIENvcHlyaWdodCAyMDEyIFRoZSBQb2x5bWVyIEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhIEJTRC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlLlxuICovXG5cbmlmICh0eXBlb2YgV2Vha01hcCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgKGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbiAgICB2YXIgY291bnRlciA9IERhdGUubm93KCkgJSAxZTk7XG5cbiAgICB2YXIgV2Vha01hcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5uYW1lID0gJ19fc3QnICsgKE1hdGgucmFuZG9tKCkgKiAxZTkgPj4+IDApICsgKGNvdW50ZXIrKyArICdfXycpO1xuICAgIH07XG5cbiAgICBXZWFrTWFwLnByb3RvdHlwZSA9IHtcbiAgICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICB2YXIgZW50cnkgPSBrZXlbdGhpcy5uYW1lXTtcbiAgICAgICAgaWYgKGVudHJ5ICYmIGVudHJ5WzBdID09PSBrZXkpXG4gICAgICAgICAgZW50cnlbMV0gPSB2YWx1ZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRlZmluZVByb3BlcnR5KGtleSwgdGhpcy5uYW1lLCB7dmFsdWU6IFtrZXksIHZhbHVlXSwgd3JpdGFibGU6IHRydWV9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuICAgICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICByZXR1cm4gKGVudHJ5ID0ga2V5W3RoaXMubmFtZV0pICYmIGVudHJ5WzBdID09PSBrZXkgP1xuICAgICAgICAgICAgZW50cnlbMV0gOiB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgZGVsZXRlOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0ga2V5W3RoaXMubmFtZV07XG4gICAgICAgIGlmICghZW50cnkgfHwgZW50cnlbMF0gIT09IGtleSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBlbnRyeVswXSA9IGVudHJ5WzFdID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICBoYXM6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICB2YXIgZW50cnkgPSBrZXlbdGhpcy5uYW1lXTtcbiAgICAgICAgaWYgKCFlbnRyeSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gZW50cnlbMF0gPT09IGtleTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBXZWFrTWFwO1xuICB9KSgpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBXZWFrTWFwO1xufVxuIl19
