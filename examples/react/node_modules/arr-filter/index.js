/*!
 * arr-filter <https://github.com/jonschlinkert/arr-filter>
 *
 * Copyright (c) 2014-2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var makeIterator = require('make-iterator');

module.exports = function filter(arr, fn, thisArg) {
  if (arr == null) {
    return [];
  }

  if (typeof fn !== 'function') {
    throw new TypeError('expected callback to be a function');
  }

  var iterator = makeIterator(fn, thisArg);
  var len = arr.length;
  var res = arr.slice();
  var i = -1;

  while (len--) {
    if (!iterator(arr[len], i++)) {
      res.splice(len, 1);
    }
  }
  return res;
};

