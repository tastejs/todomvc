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
_yuitest_coverage["build/querystring-parse/querystring-parse.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/querystring-parse/querystring-parse.js",
    code: []
};
_yuitest_coverage["build/querystring-parse/querystring-parse.js"].code=["YUI.add('querystring-parse', function (Y, NAME) {","","/**"," * The QueryString module adds support for serializing JavaScript objects into"," * query strings and parsing JavaScript objects from query strings format."," *"," * The QueryString namespace is added to your YUI instance including static methods"," * `Y.QueryString.parse(..)` and `Y.QueryString.stringify(..)`."," *"," * The `querystring` module is a alias for `querystring-parse` and"," * `querystring-stringify`."," *"," * As their names suggest, `querystring-parse` adds support for parsing"," * Query String data (`Y.QueryString.parse`) and `querystring-stringify` for serializing"," * JavaScript data into Query Strings (`Y.QueryString.stringify`).  You may choose to"," * include either of the submodules individually if you don't need the"," * complementary functionality, or include the rollup for both."," *"," * @module querystring"," * @main querystring","*/","/**"," * The QueryString module adds support for serializing JavaScript objects into"," * query strings and parsing JavaScript objects from query strings format."," * @class QueryString"," * @static"," */","var QueryString = Y.namespace(\"QueryString\"),","","// Parse a key=val string.","// These can get pretty hairy","// example flow:","// parse(foo[bar][][bla]=baz)","// return parse(foo[bar][][bla],\"baz\")","// return parse(foo[bar][], {bla : \"baz\"})","// return parse(foo[bar], [{bla:\"baz\"}])","// return parse(foo, {bar:[{bla:\"baz\"}]})","// return {foo:{bar:[{bla:\"baz\"}]}}","pieceParser = function (eq) {","    return function parsePiece (key, val) {","","        var sliced, numVal, head, tail, ret;","","        if (arguments.length !== 2) {","            // key=val, called from the map/reduce","            key = key.split(eq);","            return parsePiece(","                QueryString.unescape(key.shift()),","                QueryString.unescape(key.join(eq))","            );","        }","        key = key.replace(/^\\s+|\\s+$/g, '');","        if (Y.Lang.isString(val)) {","            val = val.replace(/^\\s+|\\s+$/g, '');","            // convert numerals to numbers","            if (!isNaN(val)) {","                numVal = +val;","                if (val === numVal.toString(10)) {","                    val = numVal;","                }","            }","        }","        sliced = /(.*)\\[([^\\]]*)\\]$/.exec(key);","        if (!sliced) {","            ret = {};","            if (key) {","                ret[key] = val;","            }","            return ret;","        }","        // [\"foo[][bar][][baz]\", \"foo[][bar][]\", \"baz\"]","        tail = sliced[2];","        head = sliced[1];","","        // array: key[]=val","        if (!tail) {","            return parsePiece(head, [val]);","        }","","        // obj: key[subkey]=val","        ret = {};","        ret[tail] = val;","        return parsePiece(head, ret);","    };","},","","// the reducer function that merges each query piece together into one set of params","mergeParams = function(params, addition) {","    return (","        // if it's uncontested, then just return the addition.","        (!params) ? addition","        // if the existing value is an array, then concat it.","        : (Y.Lang.isArray(params)) ? params.concat(addition)","        // if the existing value is not an array, and either are not objects, arrayify it.","        : (!Y.Lang.isObject(params) || !Y.Lang.isObject(addition)) ? [params].concat(addition)","        // else merge them as objects, which is a little more complex","        : mergeObjects(params, addition)","    );","},","","// Merge two *objects* together. If this is called, we've already ruled","// out the simple cases, and need to do the for-in business.","mergeObjects = function(params, addition) {","    for (var i in addition) {","        if (i && addition.hasOwnProperty(i)) {","            params[i] = mergeParams(params[i], addition[i]);","        }","    }","    return params;","};","","/**"," * Provides Y.QueryString.parse method to accept Query Strings and return native"," * JavaScript objects."," *"," * @module querystring"," * @submodule querystring-parse"," * @for QueryString"," * @method parse"," * @param qs {String} Querystring to be parsed into an object."," * @param sep {String} (optional) Character that should join param k=v pairs together. Default: \"&\""," * @param eq  {String} (optional) Character that should join keys to their values. Default: \"=\""," * @public"," * @static"," */","QueryString.parse = function (qs, sep, eq) {","    // wouldn't Y.Array(qs.split()).map(pieceParser(eq)).reduce(mergeParams) be prettier?","    return Y.Array.reduce(","        Y.Array.map(","            qs.split(sep || \"&\"),","            pieceParser(eq || \"=\")","        ),","        {},","        mergeParams","    );","};","","/**"," * Provides Y.QueryString.unescape method to be able to override default decoding"," * method.  This is important in cases where non-standard delimiters are used, if"," * the delimiters would not normally be handled properly by the builtin"," * (en|de)codeURIComponent functions."," * Default: replace \"+\" with \" \", and then decodeURIComponent behavior."," * @module querystring"," * @submodule querystring-parse"," * @for QueryString"," * @method unescape"," * @param s {String} String to be decoded."," * @public"," * @static"," **/","QueryString.unescape = function (s) {","    return decodeURIComponent(s.replace(/\\+/g, ' '));","};","","","","","}, '3.7.3', {\"requires\": [\"yui-base\", \"array-extras\"]});"];
_yuitest_coverage["build/querystring-parse/querystring-parse.js"].lines = {"1":0,"28":0,"40":0,"42":0,"44":0,"46":0,"47":0,"52":0,"53":0,"54":0,"56":0,"57":0,"58":0,"59":0,"63":0,"64":0,"65":0,"66":0,"67":0,"69":0,"72":0,"73":0,"76":0,"77":0,"81":0,"82":0,"83":0,"89":0,"104":0,"105":0,"106":0,"109":0,"126":0,"128":0,"152":0,"153":0};
_yuitest_coverage["build/querystring-parse/querystring-parse.js"].functions = {"parsePiece:40":0,"pieceParser:39":0,"mergeParams:88":0,"mergeObjects:103":0,"parse:126":0,"unescape:152":0,"(anonymous 1):1":0};
_yuitest_coverage["build/querystring-parse/querystring-parse.js"].coveredLines = 36;
_yuitest_coverage["build/querystring-parse/querystring-parse.js"].coveredFunctions = 7;
_yuitest_coverline("build/querystring-parse/querystring-parse.js", 1);
YUI.add('querystring-parse', function (Y, NAME) {

/**
 * The QueryString module adds support for serializing JavaScript objects into
 * query strings and parsing JavaScript objects from query strings format.
 *
 * The QueryString namespace is added to your YUI instance including static methods
 * `Y.QueryString.parse(..)` and `Y.QueryString.stringify(..)`.
 *
 * The `querystring` module is a alias for `querystring-parse` and
 * `querystring-stringify`.
 *
 * As their names suggest, `querystring-parse` adds support for parsing
 * Query String data (`Y.QueryString.parse`) and `querystring-stringify` for serializing
 * JavaScript data into Query Strings (`Y.QueryString.stringify`).  You may choose to
 * include either of the submodules individually if you don't need the
 * complementary functionality, or include the rollup for both.
 *
 * @module querystring
 * @main querystring
*/
/**
 * The QueryString module adds support for serializing JavaScript objects into
 * query strings and parsing JavaScript objects from query strings format.
 * @class QueryString
 * @static
 */
_yuitest_coverfunc("build/querystring-parse/querystring-parse.js", "(anonymous 1)", 1);
_yuitest_coverline("build/querystring-parse/querystring-parse.js", 28);
var QueryString = Y.namespace("QueryString"),

// Parse a key=val string.
// These can get pretty hairy
// example flow:
// parse(foo[bar][][bla]=baz)
// return parse(foo[bar][][bla],"baz")
// return parse(foo[bar][], {bla : "baz"})
// return parse(foo[bar], [{bla:"baz"}])
// return parse(foo, {bar:[{bla:"baz"}]})
// return {foo:{bar:[{bla:"baz"}]}}
pieceParser = function (eq) {
    _yuitest_coverfunc("build/querystring-parse/querystring-parse.js", "pieceParser", 39);
_yuitest_coverline("build/querystring-parse/querystring-parse.js", 40);
return function parsePiece (key, val) {

        _yuitest_coverfunc("build/querystring-parse/querystring-parse.js", "parsePiece", 40);
_yuitest_coverline("build/querystring-parse/querystring-parse.js", 42);
var sliced, numVal, head, tail, ret;

        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 44);
if (arguments.length !== 2) {
            // key=val, called from the map/reduce
            _yuitest_coverline("build/querystring-parse/querystring-parse.js", 46);
key = key.split(eq);
            _yuitest_coverline("build/querystring-parse/querystring-parse.js", 47);
return parsePiece(
                QueryString.unescape(key.shift()),
                QueryString.unescape(key.join(eq))
            );
        }
        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 52);
key = key.replace(/^\s+|\s+$/g, '');
        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 53);
if (Y.Lang.isString(val)) {
            _yuitest_coverline("build/querystring-parse/querystring-parse.js", 54);
val = val.replace(/^\s+|\s+$/g, '');
            // convert numerals to numbers
            _yuitest_coverline("build/querystring-parse/querystring-parse.js", 56);
if (!isNaN(val)) {
                _yuitest_coverline("build/querystring-parse/querystring-parse.js", 57);
numVal = +val;
                _yuitest_coverline("build/querystring-parse/querystring-parse.js", 58);
if (val === numVal.toString(10)) {
                    _yuitest_coverline("build/querystring-parse/querystring-parse.js", 59);
val = numVal;
                }
            }
        }
        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 63);
sliced = /(.*)\[([^\]]*)\]$/.exec(key);
        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 64);
if (!sliced) {
            _yuitest_coverline("build/querystring-parse/querystring-parse.js", 65);
ret = {};
            _yuitest_coverline("build/querystring-parse/querystring-parse.js", 66);
if (key) {
                _yuitest_coverline("build/querystring-parse/querystring-parse.js", 67);
ret[key] = val;
            }
            _yuitest_coverline("build/querystring-parse/querystring-parse.js", 69);
return ret;
        }
        // ["foo[][bar][][baz]", "foo[][bar][]", "baz"]
        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 72);
tail = sliced[2];
        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 73);
head = sliced[1];

        // array: key[]=val
        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 76);
if (!tail) {
            _yuitest_coverline("build/querystring-parse/querystring-parse.js", 77);
return parsePiece(head, [val]);
        }

        // obj: key[subkey]=val
        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 81);
ret = {};
        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 82);
ret[tail] = val;
        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 83);
return parsePiece(head, ret);
    };
},

// the reducer function that merges each query piece together into one set of params
mergeParams = function(params, addition) {
    _yuitest_coverfunc("build/querystring-parse/querystring-parse.js", "mergeParams", 88);
_yuitest_coverline("build/querystring-parse/querystring-parse.js", 89);
return (
        // if it's uncontested, then just return the addition.
        (!params) ? addition
        // if the existing value is an array, then concat it.
        : (Y.Lang.isArray(params)) ? params.concat(addition)
        // if the existing value is not an array, and either are not objects, arrayify it.
        : (!Y.Lang.isObject(params) || !Y.Lang.isObject(addition)) ? [params].concat(addition)
        // else merge them as objects, which is a little more complex
        : mergeObjects(params, addition)
    );
},

// Merge two *objects* together. If this is called, we've already ruled
// out the simple cases, and need to do the for-in business.
mergeObjects = function(params, addition) {
    _yuitest_coverfunc("build/querystring-parse/querystring-parse.js", "mergeObjects", 103);
_yuitest_coverline("build/querystring-parse/querystring-parse.js", 104);
for (var i in addition) {
        _yuitest_coverline("build/querystring-parse/querystring-parse.js", 105);
if (i && addition.hasOwnProperty(i)) {
            _yuitest_coverline("build/querystring-parse/querystring-parse.js", 106);
params[i] = mergeParams(params[i], addition[i]);
        }
    }
    _yuitest_coverline("build/querystring-parse/querystring-parse.js", 109);
return params;
};

/**
 * Provides Y.QueryString.parse method to accept Query Strings and return native
 * JavaScript objects.
 *
 * @module querystring
 * @submodule querystring-parse
 * @for QueryString
 * @method parse
 * @param qs {String} Querystring to be parsed into an object.
 * @param sep {String} (optional) Character that should join param k=v pairs together. Default: "&"
 * @param eq  {String} (optional) Character that should join keys to their values. Default: "="
 * @public
 * @static
 */
_yuitest_coverline("build/querystring-parse/querystring-parse.js", 126);
QueryString.parse = function (qs, sep, eq) {
    // wouldn't Y.Array(qs.split()).map(pieceParser(eq)).reduce(mergeParams) be prettier?
    _yuitest_coverfunc("build/querystring-parse/querystring-parse.js", "parse", 126);
_yuitest_coverline("build/querystring-parse/querystring-parse.js", 128);
return Y.Array.reduce(
        Y.Array.map(
            qs.split(sep || "&"),
            pieceParser(eq || "=")
        ),
        {},
        mergeParams
    );
};

/**
 * Provides Y.QueryString.unescape method to be able to override default decoding
 * method.  This is important in cases where non-standard delimiters are used, if
 * the delimiters would not normally be handled properly by the builtin
 * (en|de)codeURIComponent functions.
 * Default: replace "+" with " ", and then decodeURIComponent behavior.
 * @module querystring
 * @submodule querystring-parse
 * @for QueryString
 * @method unescape
 * @param s {String} String to be decoded.
 * @public
 * @static
 **/
_yuitest_coverline("build/querystring-parse/querystring-parse.js", 152);
QueryString.unescape = function (s) {
    _yuitest_coverfunc("build/querystring-parse/querystring-parse.js", "unescape", 152);
_yuitest_coverline("build/querystring-parse/querystring-parse.js", 153);
return decodeURIComponent(s.replace(/\+/g, ' '));
};




}, '3.7.3', {"requires": ["yui-base", "array-extras"]});
