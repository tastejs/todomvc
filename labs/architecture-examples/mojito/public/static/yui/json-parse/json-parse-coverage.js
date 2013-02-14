/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/json-parse/json-parse.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/json-parse/json-parse.js",
    code: []
};
_yuitest_coverage["build/json-parse/json-parse.js"].code=["YUI.add('json-parse', function (Y, NAME) {","","/**"," * <p>The JSON module adds support for serializing JavaScript objects into"," * JSON strings and parsing JavaScript objects from strings in JSON format.</p>"," *"," * <p>The JSON namespace is added to your YUI instance including static methods"," * Y.JSON.parse(..) and Y.JSON.stringify(..).</p>"," *"," * <p>The functionality and method signatures follow the ECMAScript 5"," * specification.  In browsers with native JSON support, the native"," * implementation is used.</p>"," *"," * <p>The <code>json</code> module is a rollup of <code>json-parse</code> and"," * <code>json-stringify</code>.</p>"," *"," * <p>As their names suggest, <code>json-parse</code> adds support for parsing"," * JSON data (Y.JSON.parse) and <code>json-stringify</code> for serializing"," * JavaScript data into JSON strings (Y.JSON.stringify).  You may choose to"," * include either of the submodules individually if you don't need the"," * complementary functionality, or include the rollup for both.</p>"," *"," * @module json"," * @main json"," * @class JSON"," * @static"," */","","/**"," * Provides Y.JSON.parse method to accept JSON strings and return native"," * JavaScript objects."," *"," * @module json"," * @submodule json-parse"," * @for JSON"," * @static"," */","","","// All internals kept private for security reasons","function fromGlobal(ref) {","    var g = ((typeof global === 'object') ? global : undefined);","    return ((Y.UA.nodejs && g) ? g : (Y.config.win || {}))[ref];","}","","","    /**","     * Alias to native browser implementation of the JSON object if available.","     *","     * @property Native","     * @type {Object}","     * @private","     */","var _JSON  = fromGlobal('JSON'),","","    Native = (Object.prototype.toString.call(_JSON) === '[object JSON]' && _JSON),","    useNative = !!Native,","","    /**","     * Replace certain Unicode characters that JavaScript may handle incorrectly","     * during eval--either by deleting them or treating them as line","     * endings--with escape sequences.","     * IMPORTANT NOTE: This regex will be used to modify the input if a match is","     * found.","     *","     * @property _UNICODE_EXCEPTIONS","     * @type {RegExp}","     * @private","     */","    _UNICODE_EXCEPTIONS = /[\\u0000\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g,","","","    /**","     * First step in the safety evaluation.  Regex used to replace all escape","     * sequences (i.e. \"\\\\\", etc) with '@' characters (a non-JSON character).","     *","     * @property _ESCAPES","     * @type {RegExp}","     * @private","     */","    _ESCAPES = /\\\\(?:[\"\\\\\\/bfnrt]|u[0-9a-fA-F]{4})/g,","","    /**","     * Second step in the safety evaluation.  Regex used to replace all simple","     * values with ']' characters.","     *","     * @property _VALUES","     * @type {RegExp}","     * @private","     */","    _VALUES  = /\"[^\"\\\\\\n\\r]*\"|true|false|null|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?/g,","","    /**","     * Third step in the safety evaluation.  Regex used to remove all open","     * square brackets following a colon, comma, or at the beginning of the","     * string.","     *","     * @property _BRACKETS","     * @type {RegExp}","     * @private","     */","    _BRACKETS = /(?:^|:|,)(?:\\s*\\[)+/g,","","    /**","     * Final step in the safety evaluation.  Regex used to test the string left","     * after all previous replacements for invalid characters.","     *","     * @property _UNSAFE","     * @type {RegExp}","     * @private","     */","    _UNSAFE = /[^\\],:{}\\s]/,","","    /**","     * Replaces specific unicode characters with their appropriate \\unnnn","     * format. Some browsers ignore certain characters during eval.","     *","     * @method escapeException","     * @param c {String} Unicode character","     * @return {String} the \\unnnn escapement of the character","     * @private","     */","    _escapeException = function (c) {","        return '\\\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);","    },","","    /**","     * Traverses nested objects, applying a reviver function to each (key,value)","     * from the scope if the key:value's containing object.  The value returned","     * from the function will replace the original value in the key:value pair.","     * If the value returned is undefined, the key will be omitted from the","     * returned object.","     *","     * @method _revive","     * @param data {MIXED} Any JavaScript data","     * @param reviver {Function} filter or mutation function","     * @return {MIXED} The results of the filtered data","     * @private","     */","    _revive = function (data, reviver) {","        var walk = function (o,key) {","            var k,v,value = o[key];","            if (value && typeof value === 'object') {","                for (k in value) {","                    if (value.hasOwnProperty(k)) {","                        v = walk(value, k);","                        if (v === undefined) {","                            delete value[k];","                        } else {","                            value[k] = v;","                        }","                    }","                }","            }","            return reviver.call(o,key,value);","        };","","        return typeof reviver === 'function' ? walk({'':data},'') : data;","    },","","    /**","     * Parse a JSON string, returning the native JavaScript representation.","     *","     * @param s {string} JSON string data","     * @param reviver {function} (optional) function(k,v) passed each key value","     *          pair of object literals, allowing pruning or altering values","     * @return {MIXED} the native JavaScript representation of the JSON string","     * @throws SyntaxError","     * @method parse","     * @static","     */","    // JavaScript implementation in lieu of native browser support.  Based on","    // the json2.js library from http://json.org","    _parse = function (s,reviver) {","        // Replace certain Unicode characters that are otherwise handled","        // incorrectly by some browser implementations.","        // NOTE: This modifies the input if such characters are found!","        s = s.replace(_UNICODE_EXCEPTIONS, _escapeException);","","        // Test for any remaining invalid characters","        if (!_UNSAFE.test(s.replace(_ESCAPES,'@').","                            replace(_VALUES,']').","                            replace(_BRACKETS,''))) {","","            // Eval the text into a JavaScript data structure, apply any","            // reviver function, and return","            return _revive( eval('(' + s + ')'), reviver );","        }","","        throw new SyntaxError('JSON.parse');","    };","","Y.namespace('JSON').parse = function (s,reviver) {","        if (typeof s !== 'string') {","            s += '';","        }","","        return Native && Y.JSON.useNativeParse ?","            Native.parse(s,reviver) : _parse(s,reviver);","};","","function workingNative( k, v ) {","    return k === \"ok\" ? true : v;","}","","// Double check basic functionality.  This is mainly to catch early broken","// implementations of the JSON API in Firefox 3.1 beta1 and beta2","if ( Native ) {","    try {","        useNative = ( Native.parse( '{\"ok\":false}', workingNative ) ).ok;","    }","    catch ( e ) {","        useNative = false;","    }","}","","/**"," * Leverage native JSON parse if the browser has a native implementation."," * In general, this is a good idea.  See the Known Issues section in the"," * JSON user guide for caveats.  The default value is true for browsers with"," * native JSON support."," *"," * @property useNativeParse"," * @type Boolean"," * @default true"," * @static"," */","Y.JSON.useNativeParse = useNative;","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/json-parse/json-parse.js"].lines = {"1":0,"41":0,"42":0,"43":0,"54":0,"124":0,"141":0,"142":0,"143":0,"144":0,"145":0,"146":0,"147":0,"148":0,"150":0,"155":0,"158":0,"178":0,"181":0,"187":0,"190":0,"193":0,"194":0,"195":0,"198":0,"202":0,"203":0,"208":0,"209":0,"210":0,"213":0,"228":0};
_yuitest_coverage["build/json-parse/json-parse.js"].functions = {"fromGlobal:41":0,"_escapeException:123":0,"walk:141":0,"_revive:140":0,"_parse:174":0,"parse:193":0,"workingNative:202":0,"(anonymous 1):1":0};
_yuitest_coverage["build/json-parse/json-parse.js"].coveredLines = 32;
_yuitest_coverage["build/json-parse/json-parse.js"].coveredFunctions = 8;
_yuitest_coverline("build/json-parse/json-parse.js", 1);
YUI.add('json-parse', function (Y, NAME) {

/**
 * <p>The JSON module adds support for serializing JavaScript objects into
 * JSON strings and parsing JavaScript objects from strings in JSON format.</p>
 *
 * <p>The JSON namespace is added to your YUI instance including static methods
 * Y.JSON.parse(..) and Y.JSON.stringify(..).</p>
 *
 * <p>The functionality and method signatures follow the ECMAScript 5
 * specification.  In browsers with native JSON support, the native
 * implementation is used.</p>
 *
 * <p>The <code>json</code> module is a rollup of <code>json-parse</code> and
 * <code>json-stringify</code>.</p>
 *
 * <p>As their names suggest, <code>json-parse</code> adds support for parsing
 * JSON data (Y.JSON.parse) and <code>json-stringify</code> for serializing
 * JavaScript data into JSON strings (Y.JSON.stringify).  You may choose to
 * include either of the submodules individually if you don't need the
 * complementary functionality, or include the rollup for both.</p>
 *
 * @module json
 * @main json
 * @class JSON
 * @static
 */

/**
 * Provides Y.JSON.parse method to accept JSON strings and return native
 * JavaScript objects.
 *
 * @module json
 * @submodule json-parse
 * @for JSON
 * @static
 */


// All internals kept private for security reasons
_yuitest_coverfunc("build/json-parse/json-parse.js", "(anonymous 1)", 1);
_yuitest_coverline("build/json-parse/json-parse.js", 41);
function fromGlobal(ref) {
    _yuitest_coverfunc("build/json-parse/json-parse.js", "fromGlobal", 41);
_yuitest_coverline("build/json-parse/json-parse.js", 42);
var g = ((typeof global === 'object') ? global : undefined);
    _yuitest_coverline("build/json-parse/json-parse.js", 43);
return ((Y.UA.nodejs && g) ? g : (Y.config.win || {}))[ref];
}


    /**
     * Alias to native browser implementation of the JSON object if available.
     *
     * @property Native
     * @type {Object}
     * @private
     */
_yuitest_coverline("build/json-parse/json-parse.js", 54);
var _JSON  = fromGlobal('JSON'),

    Native = (Object.prototype.toString.call(_JSON) === '[object JSON]' && _JSON),
    useNative = !!Native,

    /**
     * Replace certain Unicode characters that JavaScript may handle incorrectly
     * during eval--either by deleting them or treating them as line
     * endings--with escape sequences.
     * IMPORTANT NOTE: This regex will be used to modify the input if a match is
     * found.
     *
     * @property _UNICODE_EXCEPTIONS
     * @type {RegExp}
     * @private
     */
    _UNICODE_EXCEPTIONS = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,


    /**
     * First step in the safety evaluation.  Regex used to replace all escape
     * sequences (i.e. "\\", etc) with '@' characters (a non-JSON character).
     *
     * @property _ESCAPES
     * @type {RegExp}
     * @private
     */
    _ESCAPES = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,

    /**
     * Second step in the safety evaluation.  Regex used to replace all simple
     * values with ']' characters.
     *
     * @property _VALUES
     * @type {RegExp}
     * @private
     */
    _VALUES  = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,

    /**
     * Third step in the safety evaluation.  Regex used to remove all open
     * square brackets following a colon, comma, or at the beginning of the
     * string.
     *
     * @property _BRACKETS
     * @type {RegExp}
     * @private
     */
    _BRACKETS = /(?:^|:|,)(?:\s*\[)+/g,

    /**
     * Final step in the safety evaluation.  Regex used to test the string left
     * after all previous replacements for invalid characters.
     *
     * @property _UNSAFE
     * @type {RegExp}
     * @private
     */
    _UNSAFE = /[^\],:{}\s]/,

    /**
     * Replaces specific unicode characters with their appropriate \unnnn
     * format. Some browsers ignore certain characters during eval.
     *
     * @method escapeException
     * @param c {String} Unicode character
     * @return {String} the \unnnn escapement of the character
     * @private
     */
    _escapeException = function (c) {
        _yuitest_coverfunc("build/json-parse/json-parse.js", "_escapeException", 123);
_yuitest_coverline("build/json-parse/json-parse.js", 124);
return '\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
    },

    /**
     * Traverses nested objects, applying a reviver function to each (key,value)
     * from the scope if the key:value's containing object.  The value returned
     * from the function will replace the original value in the key:value pair.
     * If the value returned is undefined, the key will be omitted from the
     * returned object.
     *
     * @method _revive
     * @param data {MIXED} Any JavaScript data
     * @param reviver {Function} filter or mutation function
     * @return {MIXED} The results of the filtered data
     * @private
     */
    _revive = function (data, reviver) {
        _yuitest_coverfunc("build/json-parse/json-parse.js", "_revive", 140);
_yuitest_coverline("build/json-parse/json-parse.js", 141);
var walk = function (o,key) {
            _yuitest_coverfunc("build/json-parse/json-parse.js", "walk", 141);
_yuitest_coverline("build/json-parse/json-parse.js", 142);
var k,v,value = o[key];
            _yuitest_coverline("build/json-parse/json-parse.js", 143);
if (value && typeof value === 'object') {
                _yuitest_coverline("build/json-parse/json-parse.js", 144);
for (k in value) {
                    _yuitest_coverline("build/json-parse/json-parse.js", 145);
if (value.hasOwnProperty(k)) {
                        _yuitest_coverline("build/json-parse/json-parse.js", 146);
v = walk(value, k);
                        _yuitest_coverline("build/json-parse/json-parse.js", 147);
if (v === undefined) {
                            _yuitest_coverline("build/json-parse/json-parse.js", 148);
delete value[k];
                        } else {
                            _yuitest_coverline("build/json-parse/json-parse.js", 150);
value[k] = v;
                        }
                    }
                }
            }
            _yuitest_coverline("build/json-parse/json-parse.js", 155);
return reviver.call(o,key,value);
        };

        _yuitest_coverline("build/json-parse/json-parse.js", 158);
return typeof reviver === 'function' ? walk({'':data},'') : data;
    },

    /**
     * Parse a JSON string, returning the native JavaScript representation.
     *
     * @param s {string} JSON string data
     * @param reviver {function} (optional) function(k,v) passed each key value
     *          pair of object literals, allowing pruning or altering values
     * @return {MIXED} the native JavaScript representation of the JSON string
     * @throws SyntaxError
     * @method parse
     * @static
     */
    // JavaScript implementation in lieu of native browser support.  Based on
    // the json2.js library from http://json.org
    _parse = function (s,reviver) {
        // Replace certain Unicode characters that are otherwise handled
        // incorrectly by some browser implementations.
        // NOTE: This modifies the input if such characters are found!
        _yuitest_coverfunc("build/json-parse/json-parse.js", "_parse", 174);
_yuitest_coverline("build/json-parse/json-parse.js", 178);
s = s.replace(_UNICODE_EXCEPTIONS, _escapeException);

        // Test for any remaining invalid characters
        _yuitest_coverline("build/json-parse/json-parse.js", 181);
if (!_UNSAFE.test(s.replace(_ESCAPES,'@').
                            replace(_VALUES,']').
                            replace(_BRACKETS,''))) {

            // Eval the text into a JavaScript data structure, apply any
            // reviver function, and return
            _yuitest_coverline("build/json-parse/json-parse.js", 187);
return _revive( eval('(' + s + ')'), reviver );
        }

        _yuitest_coverline("build/json-parse/json-parse.js", 190);
throw new SyntaxError('JSON.parse');
    };

_yuitest_coverline("build/json-parse/json-parse.js", 193);
Y.namespace('JSON').parse = function (s,reviver) {
        _yuitest_coverfunc("build/json-parse/json-parse.js", "parse", 193);
_yuitest_coverline("build/json-parse/json-parse.js", 194);
if (typeof s !== 'string') {
            _yuitest_coverline("build/json-parse/json-parse.js", 195);
s += '';
        }

        _yuitest_coverline("build/json-parse/json-parse.js", 198);
return Native && Y.JSON.useNativeParse ?
            Native.parse(s,reviver) : _parse(s,reviver);
};

_yuitest_coverline("build/json-parse/json-parse.js", 202);
function workingNative( k, v ) {
    _yuitest_coverfunc("build/json-parse/json-parse.js", "workingNative", 202);
_yuitest_coverline("build/json-parse/json-parse.js", 203);
return k === "ok" ? true : v;
}

// Double check basic functionality.  This is mainly to catch early broken
// implementations of the JSON API in Firefox 3.1 beta1 and beta2
_yuitest_coverline("build/json-parse/json-parse.js", 208);
if ( Native ) {
    _yuitest_coverline("build/json-parse/json-parse.js", 209);
try {
        _yuitest_coverline("build/json-parse/json-parse.js", 210);
useNative = ( Native.parse( '{"ok":false}', workingNative ) ).ok;
    }
    catch ( e ) {
        _yuitest_coverline("build/json-parse/json-parse.js", 213);
useNative = false;
    }
}

/**
 * Leverage native JSON parse if the browser has a native implementation.
 * In general, this is a good idea.  See the Known Issues section in the
 * JSON user guide for caveats.  The default value is true for browsers with
 * native JSON support.
 *
 * @property useNativeParse
 * @type Boolean
 * @default true
 * @static
 */
_yuitest_coverline("build/json-parse/json-parse.js", 228);
Y.JSON.useNativeParse = useNative;


}, '3.7.3', {"requires": ["yui-base"]});
