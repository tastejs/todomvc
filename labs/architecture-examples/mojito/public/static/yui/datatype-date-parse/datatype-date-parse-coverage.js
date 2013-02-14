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
_yuitest_coverage["build/datatype-date-parse/datatype-date-parse.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatype-date-parse/datatype-date-parse.js",
    code: []
};
_yuitest_coverage["build/datatype-date-parse/datatype-date-parse.js"].code=["YUI.add('datatype-date-parse', function (Y, NAME) {","","/**"," * Parse number submodule."," *"," * @module datatype-date"," * @submodule datatype-date-parse"," * @for Date"," */","var LANG = Y.Lang;","","Y.mix(Y.namespace(\"Date\"), {","    /**","     * Converts data to type Date.","     *","     * @method parse","     * @param data {String | Number} Data to convert. Values supported by the Date constructor are supported.","     * @return {Date} A Date, or null.","     */","    parse: function(data) {","        var date = null;","","        //Convert to date","        if(!(LANG.isDate(data))) {","            date = new Date(data);","        }","        else {","            return date;","        }","","        // Validate","        if(LANG.isDate(date) && (date != \"Invalid Date\") && !isNaN(date)) { // Workaround for bug 2527965","            return date;","        }","        else {","            return null;","        }","    }","});","","// Add Parsers shortcut","Y.namespace(\"Parsers\").date = Y.Date.parse;","","Y.namespace(\"DataType\");","Y.DataType.Date = Y.Date;","","","}, '3.7.3');"];
_yuitest_coverage["build/datatype-date-parse/datatype-date-parse.js"].lines = {"1":0,"10":0,"12":0,"21":0,"24":0,"25":0,"28":0,"32":0,"33":0,"36":0,"42":0,"44":0,"45":0};
_yuitest_coverage["build/datatype-date-parse/datatype-date-parse.js"].functions = {"parse:20":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatype-date-parse/datatype-date-parse.js"].coveredLines = 13;
_yuitest_coverage["build/datatype-date-parse/datatype-date-parse.js"].coveredFunctions = 2;
_yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 1);
YUI.add('datatype-date-parse', function (Y, NAME) {

/**
 * Parse number submodule.
 *
 * @module datatype-date
 * @submodule datatype-date-parse
 * @for Date
 */
_yuitest_coverfunc("build/datatype-date-parse/datatype-date-parse.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 10);
var LANG = Y.Lang;

_yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 12);
Y.mix(Y.namespace("Date"), {
    /**
     * Converts data to type Date.
     *
     * @method parse
     * @param data {String | Number} Data to convert. Values supported by the Date constructor are supported.
     * @return {Date} A Date, or null.
     */
    parse: function(data) {
        _yuitest_coverfunc("build/datatype-date-parse/datatype-date-parse.js", "parse", 20);
_yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 21);
var date = null;

        //Convert to date
        _yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 24);
if(!(LANG.isDate(data))) {
            _yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 25);
date = new Date(data);
        }
        else {
            _yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 28);
return date;
        }

        // Validate
        _yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 32);
if(LANG.isDate(date) && (date != "Invalid Date") && !isNaN(date)) { // Workaround for bug 2527965
            _yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 33);
return date;
        }
        else {
            _yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 36);
return null;
        }
    }
});

// Add Parsers shortcut
_yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 42);
Y.namespace("Parsers").date = Y.Date.parse;

_yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 44);
Y.namespace("DataType");
_yuitest_coverline("build/datatype-date-parse/datatype-date-parse.js", 45);
Y.DataType.Date = Y.Date;


}, '3.7.3');
