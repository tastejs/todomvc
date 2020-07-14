/*
 * @copyright 2016- commenthol
 * @license MIT
 */
'use strict'; // dependencies

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var utils = require('./internal/utils');

var Ref = require('./internal/reference');
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


function serialize(source) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  opts = opts || {};
  var visited = new Set();
  opts.references = [];
  var refs = new Ref(opts.references, opts);

  function stringify(source, opts) {
    var type = utils.toType(source);

    if (visited.has(source)) {
      if (opts.ignoreCircular) {
        switch (type) {
          case 'Array':
            return '[/*[Circular]*/]';

          case 'Object':
            return '{/*[Circular]*/}';

          default:
            return 'undefined /*[Circular]*/';
        }
      } else {
        throw new Error('can not convert circular structures.');
      }
    }

    switch (type) {
      case 'Null':
        return 'null';

      case 'String':
        return utils.quote(source, opts) || '""';

      case 'Function':
        {
          var _tmp = source.toString();

          var tmp = opts.unsafe ? _tmp : utils.saferFunctionString(_tmp, opts); // append function to es6 function within obj

          return !/^\s*(function|\([^)]*?\)\s*=>)/m.test(tmp) ? 'function ' + tmp : tmp;
        }

      case 'RegExp':
        return "new RegExp(".concat(utils.quote(source.source, opts), ", \"").concat(source.flags, "\")");

      case 'Date':
        if (utils.isInvalidDate(source)) return 'new Date("Invalid Date")';
        return "new Date(".concat(utils.quote(source.toJSON(), opts), ")");

      case 'Error':
        return "new Error(".concat(utils.quote(source.message, opts), ")");

      case 'Buffer':
        return "Buffer.from(\"".concat(source.toString('base64'), "\", \"base64\")");

      case 'Array':
        {
          visited.add(source);

          var _tmp2 = source.map(function (item) {
            return stringify(item, opts);
          });

          visited["delete"](source);
          return "[".concat(_tmp2.join(', '), "]");
        }

      case 'Int8Array':
      case 'Uint8Array':
      case 'Uint8ClampedArray':
      case 'Int16Array':
      case 'Uint16Array':
      case 'Int32Array':
      case 'Uint32Array':
      case 'Float32Array':
      case 'Float64Array':
        {
          var _tmp3 = [];

          for (var i = 0; i < source.length; i++) {
            _tmp3.push(source[i]);
          }

          return "new ".concat(type, "([").concat(_tmp3.join(', '), "])");
        }

      case 'Set':
        {
          visited.add(source);

          var _tmp4 = Array.from(source).map(function (item) {
            return stringify(item, opts);
          });

          visited["delete"](source);
          return "new ".concat(type, "([").concat(_tmp4.join(', '), "])");
        }

      case 'Map':
        {
          visited.add(source);

          var _tmp5 = Array.from(source).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            return "[".concat(stringify(key, opts), ", ").concat(stringify(value, opts), "]");
          });

          visited["delete"](source);
          return "new ".concat(type, "([").concat(_tmp5.join(', '), "])");
        }

      case 'Object':
        {
          visited.add(source);
          var _tmp6 = [];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              if (opts.reference && utils.isObject(source[key])) {
                refs.push(key);

                if (!refs.hasReference(source[key])) {
                  _tmp6.push(Ref.wrapkey(key, opts) + ': ' + stringify(source[key], opts));
                }

                refs.pop();
              } else {
                _tmp6.push(Ref.wrapkey(key, opts) + ': ' + stringify(source[key], opts));
              }
            }
          }

          visited["delete"](source);
          return "{".concat(_tmp6.join(', '), "}");
        }

      default:
        return '' + source;
    }
  }

  return stringify(source, opts);
}

module.exports = serialize;