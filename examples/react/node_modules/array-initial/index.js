/*!
 * array-initial <https://github.com/jonschlinkert/array-initial>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

var isNumber = require('is-number');
var slice = require('array-slice');

module.exports = function arrayInitial(arr, num) {
  if (!Array.isArray(arr)) {
    throw new Error('array-initial expects an array as the first argument.');
  }

  if (arr.length === 0) {
    return null;
  }

  return slice(arr, 0, arr.length - (isNumber(num) ? num : 1));
};
