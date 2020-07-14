"use strict";

function type(options) {
  return Object.prototype.toString.call(options).slice(8, -1);
}

function encode(options) {
  if (options && options.ignored) {
    const ignoredType = type(options.ignored);

    if (ignoredType !== 'Array') {
      options.ignored = [options.ignored];
    }

    options.ignored.forEach((value, index) => {
      const valueType = type(value);

      if (valueType === 'RegExp') {
        options.ignored[index] = value.source;

        if (!options._regIndexs) {
          options._regIndexs = [];
        }

        options._regIndexs.push(index);
      }
    });
  }

  return options;
}

function decode(options) {
  if (options && options.ignored && options._regIndexs) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = options._regIndexs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let index = _step.value;
        options.ignored[index] = new RegExp(options.ignored[index]);
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

    delete options._regIndexs;
  }

  return options;
}

exports.encode = encode;
exports.decode = decode;