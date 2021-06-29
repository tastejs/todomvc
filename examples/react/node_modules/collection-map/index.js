/*!
 * collection-map <https://github.com/jonschlinkert/collection-map>
 *
 * Copyright (c) 2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var makeIterator = require('make-iterator');
var forOwn = require('for-own');
var map = require('arr-map');

module.exports = function(collection, fn, thisArg) {
  if (!Array.isArray(collection)) {
    var iterator = makeIterator(fn, thisArg);
    var result = [];

    forOwn(collection, function(value, key) {
      result.push(iterator(value, key, collection));
    });
    return result;
  }
  return map(collection, fn, thisArg);
};
