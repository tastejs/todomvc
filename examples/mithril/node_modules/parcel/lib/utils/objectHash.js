"use strict";

const crypto = require('crypto');

function objectHash(object) {
  let hash = crypto.createHash('md5');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(object).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      let key = _step.value;
      let val = object[key];

      if (typeof val === 'object' && val) {
        hash.update(key + objectHash(val));
      } else {
        hash.update(key + val);
      }
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

  return hash.digest('hex');
}

module.exports = objectHash;