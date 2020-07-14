'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var UNSAFE_CHARS_REGEXP = /[<>\u2028\u2029/\\\r\n\t"]/g;
var CHARS_REGEXP = /[\\\r\n\t"]/g;
var UNICODE_CHARS = {
  '"': '\\"',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\\': "\\u005C",
  '<': "\\u003C",
  '>': "\\u003E",
  '/': "\\u002F",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};

function safeString(str) {
  return str.replace(UNSAFE_CHARS_REGEXP, function (unsafeChar) {
    return UNICODE_CHARS[unsafeChar];
  });
}

function unsafeString(str) {
  str = str.replace(CHARS_REGEXP, function (unsafeChar) {
    return UNICODE_CHARS[unsafeChar];
  });
  return str;
}

function quote(str, opts) {
  var fn = opts.unsafe ? unsafeString : safeString;
  return str ? "\"".concat(fn(str), "\"") : '';
}

function saferFunctionString(str, opts) {
  return opts.unsafe ? str : str.replace(/(<\/?)([a-z][^>]*?>)/ig, function (m, m1, m2) {
    return safeString(m1) + m2;
  });
}

function isObject(arg) {
  return _typeof(arg) === 'object' && arg !== null;
}

function isBuffer(arg) {
  return arg instanceof Buffer;
}

function isInvalidDate(arg) {
  return isNaN(arg.getTime());
}

function toType(o) {
  var _type = Object.prototype.toString.call(o);

  var type = _type.substring(8, _type.length - 1);

  if (type === 'Uint8Array' && isBuffer(o)) return 'Buffer';
  return type;
}

module.exports = {
  safeString: safeString,
  unsafeString: unsafeString,
  quote: quote,
  saferFunctionString: saferFunctionString,
  isBuffer: isBuffer,
  isObject: isObject,
  isInvalidDate: isInvalidDate,
  toType: toType
};