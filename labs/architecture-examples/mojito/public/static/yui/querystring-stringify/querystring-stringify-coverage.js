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
_yuitest_coverage["build/querystring-stringify/querystring-stringify.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/querystring-stringify/querystring-stringify.js",
    code: []
};
_yuitest_coverage["build/querystring-stringify/querystring-stringify.js"].code=["YUI.add('querystring-stringify', function (Y, NAME) {","","/**"," * Provides Y.QueryString.stringify method for converting objects to Query Strings."," *"," * @module querystring"," * @submodule querystring-stringify"," * @for QueryString"," * @static"," */","","var QueryString = Y.namespace(\"QueryString\"),","    stack = [],","    L = Y.Lang;","","/**"," * Provides Y.QueryString.escape method to be able to override default encoding"," * method.  This is important in cases where non-standard delimiters are used, if"," * the delimiters would not normally be handled properly by the builtin"," * (en|de)codeURIComponent functions."," * Default: encodeURIComponent"," * @module querystring"," * @submodule querystring-stringify"," * @for QueryString"," * @static"," **/","QueryString.escape = encodeURIComponent;","","/**"," * <p>Converts an arbitrary value to a Query String representation.</p>"," *"," * <p>Objects with cyclical references will trigger an exception.</p>"," *"," * @method stringify"," * @public"," * @param obj {Variant} any arbitrary value to convert to query string"," * @param cfg {Object} (optional) Configuration object.  The three"," * supported configurations are:"," * <ul><li>sep: When defined, the value will be used as the key-value"," * separator.  The default value is \"&\".</li>"," * <li>eq: When defined, the value will be used to join the key to"," * the value.  The default value is \"=\".</li>"," * <li>arrayKey: When set to true, the key of an array will have the"," * '[]' notation appended to the key.  The default value is false."," * </li></ul>"," * @param name {String} (optional) Name of the current key, for handling children recursively."," * @static"," */","QueryString.stringify = function (obj, c, name) {","    var begin, end, i, l, n, s,","        sep = c && c.sep ? c.sep : \"&\",","        eq = c && c.eq ? c.eq : \"=\",","        aK = c && c.arrayKey ? c.arrayKey : false;","","    if (L.isNull(obj) || L.isUndefined(obj) || L.isFunction(obj)) {","        return name ? QueryString.escape(name) + eq : '';","    }","","    if (L.isBoolean(obj) || Object.prototype.toString.call(obj) === '[object Boolean]') {","        obj =+ obj;","    }","","    if (L.isNumber(obj) || L.isString(obj)) {","        return QueryString.escape(name) + eq + QueryString.escape(obj);","    }","","    if (L.isArray(obj)) {","        s = [];","        name = aK ? name + '[]' : name;","        l = obj.length;","        for (i = 0; i < l; i++) {","            s.push( QueryString.stringify(obj[i], c, name) );","        }","","        return s.join(sep);","    }","    // now we know it's an object.","","    // Check for cyclical references in nested objects","    for (i = stack.length - 1; i >= 0; --i) {","        if (stack[i] === obj) {","            throw new Error(\"QueryString.stringify. Cyclical reference\");","        }","    }","","    stack.push(obj);","    s = [];","    begin = name ? name + '[' : '';","    end = name ? ']' : '';","    for (i in obj) {","        if (obj.hasOwnProperty(i)) {","            n = begin + i + end;","            s.push(QueryString.stringify(obj[i], c, n));","        }","    }","","    stack.pop();","    s = s.join(sep);","    if (!s && name) {","        return name + \"=\";","    }","","    return s;","};","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/querystring-stringify/querystring-stringify.js"].lines = {"1":0,"12":0,"27":0,"49":0,"50":0,"55":0,"56":0,"59":0,"60":0,"63":0,"64":0,"67":0,"68":0,"69":0,"70":0,"71":0,"72":0,"75":0,"80":0,"81":0,"82":0,"86":0,"87":0,"88":0,"89":0,"90":0,"91":0,"92":0,"93":0,"97":0,"98":0,"99":0,"100":0,"103":0};
_yuitest_coverage["build/querystring-stringify/querystring-stringify.js"].functions = {"stringify:49":0,"(anonymous 1):1":0};
_yuitest_coverage["build/querystring-stringify/querystring-stringify.js"].coveredLines = 34;
_yuitest_coverage["build/querystring-stringify/querystring-stringify.js"].coveredFunctions = 2;
_yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 1);
YUI.add('querystring-stringify', function (Y, NAME) {

/**
 * Provides Y.QueryString.stringify method for converting objects to Query Strings.
 *
 * @module querystring
 * @submodule querystring-stringify
 * @for QueryString
 * @static
 */

_yuitest_coverfunc("build/querystring-stringify/querystring-stringify.js", "(anonymous 1)", 1);
_yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 12);
var QueryString = Y.namespace("QueryString"),
    stack = [],
    L = Y.Lang;

/**
 * Provides Y.QueryString.escape method to be able to override default encoding
 * method.  This is important in cases where non-standard delimiters are used, if
 * the delimiters would not normally be handled properly by the builtin
 * (en|de)codeURIComponent functions.
 * Default: encodeURIComponent
 * @module querystring
 * @submodule querystring-stringify
 * @for QueryString
 * @static
 **/
_yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 27);
QueryString.escape = encodeURIComponent;

/**
 * <p>Converts an arbitrary value to a Query String representation.</p>
 *
 * <p>Objects with cyclical references will trigger an exception.</p>
 *
 * @method stringify
 * @public
 * @param obj {Variant} any arbitrary value to convert to query string
 * @param cfg {Object} (optional) Configuration object.  The three
 * supported configurations are:
 * <ul><li>sep: When defined, the value will be used as the key-value
 * separator.  The default value is "&".</li>
 * <li>eq: When defined, the value will be used to join the key to
 * the value.  The default value is "=".</li>
 * <li>arrayKey: When set to true, the key of an array will have the
 * '[]' notation appended to the key.  The default value is false.
 * </li></ul>
 * @param name {String} (optional) Name of the current key, for handling children recursively.
 * @static
 */
_yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 49);
QueryString.stringify = function (obj, c, name) {
    _yuitest_coverfunc("build/querystring-stringify/querystring-stringify.js", "stringify", 49);
_yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 50);
var begin, end, i, l, n, s,
        sep = c && c.sep ? c.sep : "&",
        eq = c && c.eq ? c.eq : "=",
        aK = c && c.arrayKey ? c.arrayKey : false;

    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 55);
if (L.isNull(obj) || L.isUndefined(obj) || L.isFunction(obj)) {
        _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 56);
return name ? QueryString.escape(name) + eq : '';
    }

    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 59);
if (L.isBoolean(obj) || Object.prototype.toString.call(obj) === '[object Boolean]') {
        _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 60);
obj =+ obj;
    }

    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 63);
if (L.isNumber(obj) || L.isString(obj)) {
        _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 64);
return QueryString.escape(name) + eq + QueryString.escape(obj);
    }

    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 67);
if (L.isArray(obj)) {
        _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 68);
s = [];
        _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 69);
name = aK ? name + '[]' : name;
        _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 70);
l = obj.length;
        _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 71);
for (i = 0; i < l; i++) {
            _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 72);
s.push( QueryString.stringify(obj[i], c, name) );
        }

        _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 75);
return s.join(sep);
    }
    // now we know it's an object.

    // Check for cyclical references in nested objects
    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 80);
for (i = stack.length - 1; i >= 0; --i) {
        _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 81);
if (stack[i] === obj) {
            _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 82);
throw new Error("QueryString.stringify. Cyclical reference");
        }
    }

    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 86);
stack.push(obj);
    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 87);
s = [];
    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 88);
begin = name ? name + '[' : '';
    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 89);
end = name ? ']' : '';
    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 90);
for (i in obj) {
        _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 91);
if (obj.hasOwnProperty(i)) {
            _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 92);
n = begin + i + end;
            _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 93);
s.push(QueryString.stringify(obj[i], c, n));
        }
    }

    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 97);
stack.pop();
    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 98);
s = s.join(sep);
    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 99);
if (!s && name) {
        _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 100);
return name + "=";
    }

    _yuitest_coverline("build/querystring-stringify/querystring-stringify.js", 103);
return s;
};


}, '3.7.3', {"requires": ["yui-base"]});
