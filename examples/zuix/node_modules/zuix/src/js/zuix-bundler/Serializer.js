/*
 Copyright (c) 2014, Yahoo! Inc. All rights reserved.
 Copyrights licensed under the New BSD License.
 See the accompanying LICENSE file for terms.

    https://github.com/yahoo/serialize-javascript

 */

const isRegExp = function(re) {
    return Object.prototype.toString.call(re) === '[object RegExp]';
};

const UID = Math.floor(Math.random() * 0x10000000000).toString(16);
const PLACE_HOLDER_REGEXP = new RegExp('"@__(F|R)-' + UID + '-(\\d+)__@"', 'g');

const IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
const UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;

// Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
// Unicode char counterparts which are safe to use in JavaScript strings.
const ESCAPED_CHARS = {
    '<': '\\u003C',
    '>': '\\u003E',
    '/': '\\u002F',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};

function escapeUnsafeChars(unsafeChar) {
    return ESCAPED_CHARS[unsafeChar];
}

module.exports = function serialize(obj, options) {
    options || (options = {});

    // component item serialization

    // Backwards-compatability for `space` as the second argument.
    if (typeof options === 'number' || typeof options === 'string') {
        options = {space: options};
    }

    const functions = [];
    const regexps = [];

    // Returns placeholders for functions and regexps (identified by index)
    // which are later replaced by their string representation.
    function replacer(key, value) {
        if (!value) {
            return value;
        }

        const type = typeof value;

        if (type === 'object') {
            if (isRegExp(value)) {
                return '@__R-' + UID + '-' + (regexps.push(value) - 1) + '__@';
            }

            return value;
        }

        if (type === 'function') {
            return '@__F-' + UID + '-' + (functions.push(value) - 1) + '__@';
        }

        return value;
    }

    let str;

    // Creates a JSON string representation of the value.
    // NOTE: Node 0.12 goes into slow mode with extra JSON.stringify() args.
    if (options.isJSON && !options.space) {
        str = JSON.stringify(obj);
    } else {
        str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space);
    }

    // Protects against `JSON.stringify()` returning `undefined`, by serializing
    // to the literal string: "undefined".
    if (typeof str !== 'string') {
        return String(str);
    }

    // Replace unsafe HTML and invalid JavaScript line terminator chars with
    // their safe Unicode char counterpart. This _must_ happen before the
    // regexps and functions are serialized and added back to the string.
    str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);

    if (functions.length === 0 && regexps.length === 0) {
        return str;
    }

    // Replaces all occurrences of function and regexp placeholders in the JSON
    // string with their string representations. If the original value can not
    // be found, then `undefined` is used.
    return str.replace(PLACE_HOLDER_REGEXP, function(match, type, valueIndex) {
        if (type === 'R') {
            return regexps[valueIndex].toString();
        }

        const fn = functions[valueIndex];
        const serializedFn = fn.toString();

        if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
            throw new TypeError('Serializing native function: ' + fn.name);
        }

        return serializedFn;
    });
};
