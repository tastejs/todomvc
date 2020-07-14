'use strict'

const UNSAFE_CHARS_REGEXP = /[<>\u2028\u2029/\\\r\n\t"]/g
const CHARS_REGEXP = /[\\\r\n\t"]/g

const UNICODE_CHARS = {
  '"': '\\"',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\\': '\\u005C',
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
}

function safeString (str) {
  return str.replace(UNSAFE_CHARS_REGEXP, (unsafeChar) => {
    return UNICODE_CHARS[unsafeChar]
  })
}

function unsafeString (str) {
  str = str.replace(CHARS_REGEXP, (unsafeChar) => UNICODE_CHARS[unsafeChar])
  return str
}

function quote (str, opts) {
  const fn = opts.unsafe ? unsafeString : safeString
  return str ? `"${fn(str)}"` : ''
}

function saferFunctionString (str, opts) {
  return opts.unsafe
    ? str
    : str.replace(/(<\/?)([a-z][^>]*?>)/ig, (m, m1, m2) => safeString(m1) + m2)
}

function isObject (arg) {
  return typeof arg === 'object' && arg !== null
}

function isBuffer (arg) {
  return arg instanceof Buffer
}

function isInvalidDate (arg) {
  return isNaN(arg.getTime())
}

function toType (o) {
  const _type = Object.prototype.toString.call(o)
  const type = _type.substring(8, _type.length - 1)
  if (type === 'Uint8Array' && isBuffer(o)) return 'Buffer'
  return type
}

module.exports = {
  safeString,
  unsafeString,
  quote,
  saferFunctionString,
  isBuffer,
  isObject,
  isInvalidDate,
  toType
}
