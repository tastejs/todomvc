/*!
 * object.reduce <https://github.com/jonschlinkert/object.reduce>
 *
 * Copyright (c) 2014-2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var makeIterator = require('make-iterator');
var forOwn = require('for-own');

module.exports = function reduce(target, fn, acc, thisArg) {
  var first = arguments.length > 2;
  if (target && !Object.keys(target).length && !first) {
    return null;
  }

  var iterator = makeIterator(fn, thisArg);

  forOwn(target, function(value, key, orig) {
    if (!first) {
      acc = value;
      first = true;
    } else {
      acc = iterator(acc, value, key, orig);
    }
  });

  return acc;
};
