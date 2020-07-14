/*
 * @copyright 2016- commenthol
 * @license MIT
 */

'use strict'

// dependencies
const utils = require('./internal/utils')
const Ref = require('./internal/reference')

/**
 * serializes an object to javascript
 *
 * @example <caption>serializing regex, date, buffer, ...</caption>
 * const serialize = require('serialize-to-js')
 * const obj = {
 *   str: '<script>var a = 0 > 1</script>',
 *   num: 3.1415,
 *   bool: true,
 *   nil: null,
 *   undef: undefined,
 *   obj: { foo: 'bar' },
 *   arr: [1, '2'],
 *   regexp: /^test?$/,
 *   date: new Date(),
 *   buffer: new Buffer('data'),
 *   set: new Set([1, 2, 3]),
 *   map: new Map([['a': 1],['b': 2]])
 * }
 * console.log(serialize(obj))
 * //> '{str: "\u003Cscript\u003Evar a = 0 \u003E 1\u003C\u002Fscript\u003E",
 * //>   num: 3.1415, bool: true, nil: null, undef: undefined,
 * //>   obj: {foo: "bar"}, arr: [1, "2"], regexp: new RegExp("^test?$", ""),
 * //>   date: new Date("2019-12-29T10:37:36.613Z"),
 * //>   buffer: Buffer.from("ZGF0YQ==", "base64"), set: new Set([1, 2, 3]),
 * //>   map: new Map([["a", 1], ["b", 2]])}'
 *
 * @example <caption>serializing while respecting references</caption>
 * const serialize = require('serialize-to-js')
 * const obj = { object: { regexp: /^test?$/ } };
 * obj.reference = obj.object;
 * const opts = { reference: true };
 * console.log(serialize(obj, opts));
 * //> {object: {regexp: /^test?$/}}
 * console.log(opts.references);
 * //> [ [ '.reference', '.object' ] ]
 *
 * @param {Object|Array|Function|Any} source - source to serialize
 * @param {Object} [opts] - options
 * @param {Boolean} opts.ignoreCircular - ignore circular objects
 * @param {Boolean} opts.reference - reference instead of a copy (requires post-processing of opts.references)
 * @param {Boolean} opts.unsafe - do not escape chars `<>/`
 * @return {String} serialized representation of `source`
 */
function serialize (source, opts = {}) {
  opts = opts || {}

  const visited = new Set()
  opts.references = []
  const refs = new Ref(opts.references, opts)

  function stringify (source, opts) {
    const type = utils.toType(source)

    if (visited.has(source)) {
      if (opts.ignoreCircular) {
        switch (type) {
          case 'Array':
            return '[/*[Circular]*/]'
          case 'Object':
            return '{/*[Circular]*/}'
          default:
            return 'undefined /*[Circular]*/'
        }
      } else {
        throw new Error('can not convert circular structures.')
      }
    }

    switch (type) {
      case 'Null':
        return 'null'
      case 'String':
        return utils.quote(source, opts) || '""'
      case 'Function': {
        const _tmp = source.toString()
        const tmp = opts.unsafe ? _tmp : utils.saferFunctionString(_tmp, opts)
        // append function to es6 function within obj
        return !/^\s*(function|\([^)]*?\)\s*=>)/m.test(tmp) ? 'function ' + tmp : tmp
      }
      case 'RegExp':
        return `new RegExp(${utils.quote(source.source, opts)}, "${source.flags}")`
      case 'Date':
        if (utils.isInvalidDate(source)) return 'new Date("Invalid Date")'
        return `new Date(${utils.quote(source.toJSON(), opts)})`
      case 'Error':
        return `new Error(${utils.quote(source.message, opts)})`
      case 'Buffer':
        return `Buffer.from("${source.toString('base64')}", "base64")`
      case 'Array': {
        visited.add(source)
        const tmp = source.map(item => stringify(item, opts))
        visited.delete(source)
        return `[${tmp.join(', ')}]`
      }
      case 'Int8Array':
      case 'Uint8Array':
      case 'Uint8ClampedArray':
      case 'Int16Array':
      case 'Uint16Array':
      case 'Int32Array':
      case 'Uint32Array':
      case 'Float32Array':
      case 'Float64Array': {
        const tmp = []
        for (let i = 0; i < source.length; i++) {
          tmp.push(source[i])
        }
        return `new ${type}([${tmp.join(', ')}])`
      }
      case 'Set': {
        visited.add(source)
        const tmp = Array.from(source).map(item => stringify(item, opts))
        visited.delete(source)
        return `new ${type}([${tmp.join(', ')}])`
      }
      case 'Map': {
        visited.add(source)
        const tmp = Array.from(source).map(([key, value]) => `[${stringify(key, opts)}, ${stringify(value, opts)}]`)
        visited.delete(source)
        return `new ${type}([${tmp.join(', ')}])`
      }
      case 'Object': {
        visited.add(source)
        const tmp = []
        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (opts.reference && utils.isObject(source[key])) {
              refs.push(key)
              if (!refs.hasReference(source[key])) {
                tmp.push(Ref.wrapkey(key, opts) + ': ' + stringify(source[key], opts))
              }
              refs.pop()
            } else {
              tmp.push(Ref.wrapkey(key, opts) + ': ' + stringify(source[key], opts))
            }
          }
        }
        visited.delete(source)
        return `{${tmp.join(', ')}}`
      }
      default:
        return '' + source
    }
  }

  return stringify(source, opts)
}

module.exports = serialize
