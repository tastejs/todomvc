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
_yuitest_coverage["build/querystring-stringify-simple/querystring-stringify-simple.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/querystring-stringify-simple/querystring-stringify-simple.js",
    code: []
};
_yuitest_coverage["build/querystring-stringify-simple/querystring-stringify-simple.js"].code=["YUI.add('querystring-stringify-simple', function (Y, NAME) {","","/*global Y */","/**"," * <p>Provides Y.QueryString.stringify method for converting objects to Query Strings."," * This is a subset implementation of the full querystring-stringify.</p>"," * <p>This module provides the bare minimum functionality (encoding a hash of simple values),"," * without the additional support for nested data structures.  Every key-value pair is"," * encoded by encodeURIComponent.</p>"," * <p>This module provides a minimalistic way for io to handle  single-level objects"," * as transaction data.</p>"," *"," * @module querystring"," * @submodule querystring-stringify-simple"," * @for QueryString"," * @static"," */","","var QueryString = Y.namespace(\"QueryString\"),","    EUC = encodeURIComponent;","","/**"," * <p>Converts a simple object to a Query String representation.</p>"," * <p>Nested objects, Arrays, and so on, are not supported.</p>"," *"," * @method stringify"," * @for QueryString"," * @public"," * @submodule querystring-stringify-simple"," * @param obj {Object} A single-level object to convert to a querystring."," * @param cfg {Object} (optional) Configuration object.  In the simple"," *                                module, only the arrayKey setting is"," *                                supported.  When set to true, the key of an"," *                                array will have the '[]' notation appended"," *                                to the key;."," * @static"," */","QueryString.stringify = function (obj, c) {","    var qs = [],","        // Default behavior is false; standard key notation.","        s = c && c.arrayKey ? true : false,","        key, i, l;","","    for (key in obj) {","        if (obj.hasOwnProperty(key)) {","            if (Y.Lang.isArray(obj[key])) {","                for (i = 0, l = obj[key].length; i < l; i++) {","                    qs.push(EUC(s ? key + '[]' : key) + '=' + EUC(obj[key][i]));","                }","            }","            else {","                qs.push(EUC(key) + '=' + EUC(obj[key]));","            }","        }","    }","","    return qs.join('&');","};","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/querystring-stringify-simple/querystring-stringify-simple.js"].lines = {"1":0,"19":0,"38":0,"39":0,"44":0,"45":0,"46":0,"47":0,"48":0,"52":0,"57":0};
_yuitest_coverage["build/querystring-stringify-simple/querystring-stringify-simple.js"].functions = {"stringify:38":0,"(anonymous 1):1":0};
_yuitest_coverage["build/querystring-stringify-simple/querystring-stringify-simple.js"].coveredLines = 11;
_yuitest_coverage["build/querystring-stringify-simple/querystring-stringify-simple.js"].coveredFunctions = 2;
_yuitest_coverline("build/querystring-stringify-simple/querystring-stringify-simple.js", 1);
YUI.add('querystring-stringify-simple', function (Y, NAME) {

/*global Y */
/**
 * <p>Provides Y.QueryString.stringify method for converting objects to Query Strings.
 * This is a subset implementation of the full querystring-stringify.</p>
 * <p>This module provides the bare minimum functionality (encoding a hash of simple values),
 * without the additional support for nested data structures.  Every key-value pair is
 * encoded by encodeURIComponent.</p>
 * <p>This module provides a minimalistic way for io to handle  single-level objects
 * as transaction data.</p>
 *
 * @module querystring
 * @submodule querystring-stringify-simple
 * @for QueryString
 * @static
 */

_yuitest_coverfunc("build/querystring-stringify-simple/querystring-stringify-simple.js", "(anonymous 1)", 1);
_yuitest_coverline("build/querystring-stringify-simple/querystring-stringify-simple.js", 19);
var QueryString = Y.namespace("QueryString"),
    EUC = encodeURIComponent;

/**
 * <p>Converts a simple object to a Query String representation.</p>
 * <p>Nested objects, Arrays, and so on, are not supported.</p>
 *
 * @method stringify
 * @for QueryString
 * @public
 * @submodule querystring-stringify-simple
 * @param obj {Object} A single-level object to convert to a querystring.
 * @param cfg {Object} (optional) Configuration object.  In the simple
 *                                module, only the arrayKey setting is
 *                                supported.  When set to true, the key of an
 *                                array will have the '[]' notation appended
 *                                to the key;.
 * @static
 */
_yuitest_coverline("build/querystring-stringify-simple/querystring-stringify-simple.js", 38);
QueryString.stringify = function (obj, c) {
    _yuitest_coverfunc("build/querystring-stringify-simple/querystring-stringify-simple.js", "stringify", 38);
_yuitest_coverline("build/querystring-stringify-simple/querystring-stringify-simple.js", 39);
var qs = [],
        // Default behavior is false; standard key notation.
        s = c && c.arrayKey ? true : false,
        key, i, l;

    _yuitest_coverline("build/querystring-stringify-simple/querystring-stringify-simple.js", 44);
for (key in obj) {
        _yuitest_coverline("build/querystring-stringify-simple/querystring-stringify-simple.js", 45);
if (obj.hasOwnProperty(key)) {
            _yuitest_coverline("build/querystring-stringify-simple/querystring-stringify-simple.js", 46);
if (Y.Lang.isArray(obj[key])) {
                _yuitest_coverline("build/querystring-stringify-simple/querystring-stringify-simple.js", 47);
for (i = 0, l = obj[key].length; i < l; i++) {
                    _yuitest_coverline("build/querystring-stringify-simple/querystring-stringify-simple.js", 48);
qs.push(EUC(s ? key + '[]' : key) + '=' + EUC(obj[key][i]));
                }
            }
            else {
                _yuitest_coverline("build/querystring-stringify-simple/querystring-stringify-simple.js", 52);
qs.push(EUC(key) + '=' + EUC(obj[key]));
            }
        }
    }

    _yuitest_coverline("build/querystring-stringify-simple/querystring-stringify-simple.js", 57);
return qs.join('&');
};


}, '3.7.3', {"requires": ["yui-base"]});
