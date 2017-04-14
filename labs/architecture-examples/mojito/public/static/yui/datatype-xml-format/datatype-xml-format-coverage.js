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
_yuitest_coverage["build/datatype-xml-format/datatype-xml-format.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatype-xml-format/datatype-xml-format.js",
    code: []
};
_yuitest_coverage["build/datatype-xml-format/datatype-xml-format.js"].code=["YUI.add('datatype-xml-format', function (Y, NAME) {","","/**"," * The Number Utility provides type-conversion and string-formatting"," * convenience methods for Numbers."," *"," * @module datatype-xml"," * @submodule datatype-xml-format"," */","","/**"," * XML provides a set of utility functions to operate against XML documents."," *"," * @class XML"," * @static"," */","var LANG = Y.Lang;","","Y.mix(Y.namespace(\"XML\"), {","    /**","     * Converts data to type XMLDocument.","     *","     * @method format","     * @param data {XMLDoc} Data to convert.","     * @return {String} String.","     */","    format: function(data) {","        try {","            if(!LANG.isUndefined(data.getXml)) {","                return data.getXml();","            }","","            if(!LANG.isUndefined(XMLSerializer)) {","                return (new XMLSerializer()).serializeToString(data);","            }","        }","        catch(e) {","            if(data && data.xml) {","                return data.xml;","            }","            else {","                return (LANG.isValue(data) && data.toString) ? data.toString() : \"\";","            }","        }","    }","});","","Y.namespace(\"DataType\");","Y.DataType.XML = Y.XML;","","","}, '3.7.3');"];
_yuitest_coverage["build/datatype-xml-format/datatype-xml-format.js"].lines = {"1":0,"17":0,"19":0,"28":0,"29":0,"30":0,"33":0,"34":0,"38":0,"39":0,"42":0,"48":0,"49":0};
_yuitest_coverage["build/datatype-xml-format/datatype-xml-format.js"].functions = {"format:27":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatype-xml-format/datatype-xml-format.js"].coveredLines = 13;
_yuitest_coverage["build/datatype-xml-format/datatype-xml-format.js"].coveredFunctions = 2;
_yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 1);
YUI.add('datatype-xml-format', function (Y, NAME) {

/**
 * The Number Utility provides type-conversion and string-formatting
 * convenience methods for Numbers.
 *
 * @module datatype-xml
 * @submodule datatype-xml-format
 */

/**
 * XML provides a set of utility functions to operate against XML documents.
 *
 * @class XML
 * @static
 */
_yuitest_coverfunc("build/datatype-xml-format/datatype-xml-format.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 17);
var LANG = Y.Lang;

_yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 19);
Y.mix(Y.namespace("XML"), {
    /**
     * Converts data to type XMLDocument.
     *
     * @method format
     * @param data {XMLDoc} Data to convert.
     * @return {String} String.
     */
    format: function(data) {
        _yuitest_coverfunc("build/datatype-xml-format/datatype-xml-format.js", "format", 27);
_yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 28);
try {
            _yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 29);
if(!LANG.isUndefined(data.getXml)) {
                _yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 30);
return data.getXml();
            }

            _yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 33);
if(!LANG.isUndefined(XMLSerializer)) {
                _yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 34);
return (new XMLSerializer()).serializeToString(data);
            }
        }
        catch(e) {
            _yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 38);
if(data && data.xml) {
                _yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 39);
return data.xml;
            }
            else {
                _yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 42);
return (LANG.isValue(data) && data.toString) ? data.toString() : "";
            }
        }
    }
});

_yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 48);
Y.namespace("DataType");
_yuitest_coverline("build/datatype-xml-format/datatype-xml-format.js", 49);
Y.DataType.XML = Y.XML;


}, '3.7.3');
