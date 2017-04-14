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
_yuitest_coverage["build/datatype-xml-parse/datatype-xml-parse.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatype-xml-parse/datatype-xml-parse.js",
    code: []
};
_yuitest_coverage["build/datatype-xml-parse/datatype-xml-parse.js"].code=["YUI.add('datatype-xml-parse', function (Y, NAME) {","","/**"," * Parse XML submodule."," *"," * @module datatype-xml"," * @submodule datatype-xml-parse"," * @for XML"," */","","var LANG = Y.Lang;","","Y.mix(Y.namespace(\"XML\"), {","    /**","     * Converts data to type XMLDocument.","     *","     * @method parse","     * @param data {String} Data to convert.","     * @return {XMLDoc} XML Document.","     */","    parse: function(data) {","        var xmlDoc = null;","        if(LANG.isString(data)) {","            try {","                if(!LANG.isUndefined(ActiveXObject)) {","                        xmlDoc = new ActiveXObject(\"Microsoft.XMLDOM\");","                        xmlDoc.async = false;","                        xmlDoc.loadXML(data);","                }","            }","            catch(ee) {","                try {","                    if (!LANG.isUndefined(DOMParser)) {","                        xmlDoc = new DOMParser().parseFromString(data, \"text/xml\");","                    }","                    if (!LANG.isUndefined(Windows.Data.Xml.Dom)) {","                        xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();","                        xmlDoc.loadXml(data);","                    }","                }","                catch(e) {","                }","            }","        }","        ","        if( (LANG.isNull(xmlDoc)) || (LANG.isNull(xmlDoc.documentElement)) || (xmlDoc.documentElement.nodeName === \"parsererror\") ) {","        }","        ","        return xmlDoc;","    }","});","","// Add Parsers shortcut","Y.namespace(\"Parsers\").xml = Y.XML.parse;","","Y.namespace(\"DataType\");","Y.DataType.XML = Y.XML;","","","}, '3.7.3');"];
_yuitest_coverage["build/datatype-xml-parse/datatype-xml-parse.js"].lines = {"1":0,"11":0,"13":0,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"32":0,"33":0,"34":0,"36":0,"37":0,"38":0,"46":0,"49":0,"54":0,"56":0,"57":0};
_yuitest_coverage["build/datatype-xml-parse/datatype-xml-parse.js"].functions = {"parse:21":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatype-xml-parse/datatype-xml-parse.js"].coveredLines = 21;
_yuitest_coverage["build/datatype-xml-parse/datatype-xml-parse.js"].coveredFunctions = 2;
_yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 1);
YUI.add('datatype-xml-parse', function (Y, NAME) {

/**
 * Parse XML submodule.
 *
 * @module datatype-xml
 * @submodule datatype-xml-parse
 * @for XML
 */

_yuitest_coverfunc("build/datatype-xml-parse/datatype-xml-parse.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 11);
var LANG = Y.Lang;

_yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 13);
Y.mix(Y.namespace("XML"), {
    /**
     * Converts data to type XMLDocument.
     *
     * @method parse
     * @param data {String} Data to convert.
     * @return {XMLDoc} XML Document.
     */
    parse: function(data) {
        _yuitest_coverfunc("build/datatype-xml-parse/datatype-xml-parse.js", "parse", 21);
_yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 22);
var xmlDoc = null;
        _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 23);
if(LANG.isString(data)) {
            _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 24);
try {
                _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 25);
if(!LANG.isUndefined(ActiveXObject)) {
                        _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 26);
xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                        _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 27);
xmlDoc.async = false;
                        _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 28);
xmlDoc.loadXML(data);
                }
            }
            catch(ee) {
                _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 32);
try {
                    _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 33);
if (!LANG.isUndefined(DOMParser)) {
                        _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 34);
xmlDoc = new DOMParser().parseFromString(data, "text/xml");
                    }
                    _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 36);
if (!LANG.isUndefined(Windows.Data.Xml.Dom)) {
                        _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 37);
xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
                        _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 38);
xmlDoc.loadXml(data);
                    }
                }
                catch(e) {
                }
            }
        }
        
        _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 46);
if( (LANG.isNull(xmlDoc)) || (LANG.isNull(xmlDoc.documentElement)) || (xmlDoc.documentElement.nodeName === "parsererror") ) {
        }
        
        _yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 49);
return xmlDoc;
    }
});

// Add Parsers shortcut
_yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 54);
Y.namespace("Parsers").xml = Y.XML.parse;

_yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 56);
Y.namespace("DataType");
_yuitest_coverline("build/datatype-xml-parse/datatype-xml-parse.js", 57);
Y.DataType.XML = Y.XML;


}, '3.7.3');
