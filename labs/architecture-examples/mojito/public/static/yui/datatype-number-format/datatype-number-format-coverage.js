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
_yuitest_coverage["build/datatype-number-format/datatype-number-format.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatype-number-format/datatype-number-format.js",
    code: []
};
_yuitest_coverage["build/datatype-number-format/datatype-number-format.js"].code=["YUI.add('datatype-number-format', function (Y, NAME) {","","/**"," * The Number Utility provides type-conversion and string-formatting"," * convenience methods for Numbers."," *"," * @module datatype-number"," * @main datatype-number"," */","","/**"," * Format number submodule."," *"," * @module datatype-number"," * @submodule datatype-number-format"," */"," ","/**"," * Number provides a set of utility functions to operate against Number objects."," *"," * @class Number"," * @static"," */","var LANG = Y.Lang;","","Y.mix(Y.namespace(\"Number\"), {","     /**","     * Takes a Number and formats to string for display to user.","     *","     * @method format","     * @param data {Number} Number.","     * @param config {Object} (Optional) Optional configuration values:","     *  <dl>","     *   <dt>prefix {HTML}</dd>","     *   <dd>String prepended before each number, like a currency designator \"$\"</dd>","     *   <dt>decimalPlaces {Number}</dd>","     *   <dd>Number of decimal places to round. Must be a number 0 to 20.</dd>","     *   <dt>decimalSeparator {HTML}</dd>","     *   <dd>Decimal separator</dd>","     *   <dt>thousandsSeparator {HTML}</dd>","     *   <dd>Thousands separator</dd>","     *   <dt>suffix {HTML}</dd>","     *   <dd>String appended after each number, like \" items\" (note the space)</dd>","     *  </dl>","     * @return {HTML} Formatted number for display. Note, the following values","     * return as \"\": null, undefined, NaN, \"\".","     */","    format: function(data, config) {","        if(LANG.isNumber(data)) {","            config = config || {};","","            var isNeg = (data < 0),","                output = data + \"\",","                decPlaces = config.decimalPlaces,","                decSep = config.decimalSeparator || \".\",","                thouSep = config.thousandsSeparator,","                decIndex,","                newOutput, count, i;","","            // Decimal precision","            if(LANG.isNumber(decPlaces) && (decPlaces >= 0) && (decPlaces <= 20)) {","                // Round to the correct decimal place","                output = data.toFixed(decPlaces);","            }","","            // Decimal separator","            if(decSep !== \".\"){","                output = output.replace(\".\", decSep);","            }","","            // Add the thousands separator","            if(thouSep) {","                // Find the dot or where it would be","                decIndex = output.lastIndexOf(decSep);","                decIndex = (decIndex > -1) ? decIndex : output.length;","                // Start with the dot and everything to the right","                newOutput = output.substring(decIndex);","                // Working left, every third time add a separator, every time add a digit","                for (count = 0, i=decIndex; i>0; i--) {","                    if ((count%3 === 0) && (i !== decIndex) && (!isNeg || (i > 1))) {","                        newOutput = thouSep + newOutput;","                    }","                    newOutput = output.charAt(i-1) + newOutput;","                    count++;","                }","                output = newOutput;","            }","","            // Prepend prefix","            output = (config.prefix) ? config.prefix + output : output;","","            // Append suffix","            output = (config.suffix) ? output + config.suffix : output;","","            return output;","        }","        // Not a Number, just return as string","        else {","            return (LANG.isValue(data) && data.toString) ? data.toString() : \"\";","        }","    }","});","","Y.namespace(\"DataType\");","Y.DataType.Number = Y.Number;","","","}, '3.7.3');"];
_yuitest_coverage["build/datatype-number-format/datatype-number-format.js"].lines = {"1":0,"24":0,"26":0,"49":0,"50":0,"52":0,"61":0,"63":0,"67":0,"68":0,"72":0,"74":0,"75":0,"77":0,"79":0,"80":0,"81":0,"83":0,"84":0,"86":0,"90":0,"93":0,"95":0,"99":0,"104":0,"105":0};
_yuitest_coverage["build/datatype-number-format/datatype-number-format.js"].functions = {"format:48":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatype-number-format/datatype-number-format.js"].coveredLines = 26;
_yuitest_coverage["build/datatype-number-format/datatype-number-format.js"].coveredFunctions = 2;
_yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 1);
YUI.add('datatype-number-format', function (Y, NAME) {

/**
 * The Number Utility provides type-conversion and string-formatting
 * convenience methods for Numbers.
 *
 * @module datatype-number
 * @main datatype-number
 */

/**
 * Format number submodule.
 *
 * @module datatype-number
 * @submodule datatype-number-format
 */
 
/**
 * Number provides a set of utility functions to operate against Number objects.
 *
 * @class Number
 * @static
 */
_yuitest_coverfunc("build/datatype-number-format/datatype-number-format.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 24);
var LANG = Y.Lang;

_yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 26);
Y.mix(Y.namespace("Number"), {
     /**
     * Takes a Number and formats to string for display to user.
     *
     * @method format
     * @param data {Number} Number.
     * @param config {Object} (Optional) Optional configuration values:
     *  <dl>
     *   <dt>prefix {HTML}</dd>
     *   <dd>String prepended before each number, like a currency designator "$"</dd>
     *   <dt>decimalPlaces {Number}</dd>
     *   <dd>Number of decimal places to round. Must be a number 0 to 20.</dd>
     *   <dt>decimalSeparator {HTML}</dd>
     *   <dd>Decimal separator</dd>
     *   <dt>thousandsSeparator {HTML}</dd>
     *   <dd>Thousands separator</dd>
     *   <dt>suffix {HTML}</dd>
     *   <dd>String appended after each number, like " items" (note the space)</dd>
     *  </dl>
     * @return {HTML} Formatted number for display. Note, the following values
     * return as "": null, undefined, NaN, "".
     */
    format: function(data, config) {
        _yuitest_coverfunc("build/datatype-number-format/datatype-number-format.js", "format", 48);
_yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 49);
if(LANG.isNumber(data)) {
            _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 50);
config = config || {};

            _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 52);
var isNeg = (data < 0),
                output = data + "",
                decPlaces = config.decimalPlaces,
                decSep = config.decimalSeparator || ".",
                thouSep = config.thousandsSeparator,
                decIndex,
                newOutput, count, i;

            // Decimal precision
            _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 61);
if(LANG.isNumber(decPlaces) && (decPlaces >= 0) && (decPlaces <= 20)) {
                // Round to the correct decimal place
                _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 63);
output = data.toFixed(decPlaces);
            }

            // Decimal separator
            _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 67);
if(decSep !== "."){
                _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 68);
output = output.replace(".", decSep);
            }

            // Add the thousands separator
            _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 72);
if(thouSep) {
                // Find the dot or where it would be
                _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 74);
decIndex = output.lastIndexOf(decSep);
                _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 75);
decIndex = (decIndex > -1) ? decIndex : output.length;
                // Start with the dot and everything to the right
                _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 77);
newOutput = output.substring(decIndex);
                // Working left, every third time add a separator, every time add a digit
                _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 79);
for (count = 0, i=decIndex; i>0; i--) {
                    _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 80);
if ((count%3 === 0) && (i !== decIndex) && (!isNeg || (i > 1))) {
                        _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 81);
newOutput = thouSep + newOutput;
                    }
                    _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 83);
newOutput = output.charAt(i-1) + newOutput;
                    _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 84);
count++;
                }
                _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 86);
output = newOutput;
            }

            // Prepend prefix
            _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 90);
output = (config.prefix) ? config.prefix + output : output;

            // Append suffix
            _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 93);
output = (config.suffix) ? output + config.suffix : output;

            _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 95);
return output;
        }
        // Not a Number, just return as string
        else {
            _yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 99);
return (LANG.isValue(data) && data.toString) ? data.toString() : "";
        }
    }
});

_yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 104);
Y.namespace("DataType");
_yuitest_coverline("build/datatype-number-format/datatype-number-format.js", 105);
Y.DataType.Number = Y.Number;


}, '3.7.3');
