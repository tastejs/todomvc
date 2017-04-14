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
_yuitest_coverage["build/dataschema-base/dataschema-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dataschema-base/dataschema-base.js",
    code: []
};
_yuitest_coverage["build/dataschema-base/dataschema-base.js"].code=["YUI.add('dataschema-base', function (Y, NAME) {","","/**"," * The DataSchema utility provides a common configurable interface for widgets to"," * apply a given schema to a variety of data."," *"," * @module dataschema"," * @main dataschema"," */","","/**"," * Provides the base DataSchema implementation, which can be extended to "," * create DataSchemas for specific data formats, such XML, JSON, text and"," * arrays."," *"," * @module dataschema"," * @submodule dataschema-base"," */","","var LANG = Y.Lang,","/**"," * Base class for the YUI DataSchema Utility."," * @class DataSchema.Base"," * @static"," */","    SchemaBase = {","    /**","     * Overridable method returns data as-is.","     *","     * @method apply","     * @param schema {Object} Schema to apply.","     * @param data {Object} Data.","     * @return {Object} Schema-parsed data.","     * @static","     */","    apply: function(schema, data) {","        return data;","    },","    ","    /**","     * Applies field parser, if defined","     *","     * @method parse","     * @param value {Object} Original value.","     * @param field {Object} Field.","     * @return {Object} Type-converted value.","     */","    parse: function(value, field) {","        if(field.parser) {","            var parser = (LANG.isFunction(field.parser)) ?","            field.parser : Y.Parsers[field.parser+''];","            if(parser) {","                value = parser.call(this, value);","            }","            else {","            }","        }","        return value;","    }","};","","Y.namespace(\"DataSchema\").Base = SchemaBase;","Y.namespace(\"Parsers\");","","","}, '3.7.3', {\"requires\": [\"base\"]});"];
_yuitest_coverage["build/dataschema-base/dataschema-base.js"].lines = {"1":0,"20":0,"37":0,"49":0,"50":0,"52":0,"53":0,"58":0,"62":0,"63":0};
_yuitest_coverage["build/dataschema-base/dataschema-base.js"].functions = {"apply:36":0,"parse:48":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dataschema-base/dataschema-base.js"].coveredLines = 10;
_yuitest_coverage["build/dataschema-base/dataschema-base.js"].coveredFunctions = 3;
_yuitest_coverline("build/dataschema-base/dataschema-base.js", 1);
YUI.add('dataschema-base', function (Y, NAME) {

/**
 * The DataSchema utility provides a common configurable interface for widgets to
 * apply a given schema to a variety of data.
 *
 * @module dataschema
 * @main dataschema
 */

/**
 * Provides the base DataSchema implementation, which can be extended to 
 * create DataSchemas for specific data formats, such XML, JSON, text and
 * arrays.
 *
 * @module dataschema
 * @submodule dataschema-base
 */

_yuitest_coverfunc("build/dataschema-base/dataschema-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dataschema-base/dataschema-base.js", 20);
var LANG = Y.Lang,
/**
 * Base class for the YUI DataSchema Utility.
 * @class DataSchema.Base
 * @static
 */
    SchemaBase = {
    /**
     * Overridable method returns data as-is.
     *
     * @method apply
     * @param schema {Object} Schema to apply.
     * @param data {Object} Data.
     * @return {Object} Schema-parsed data.
     * @static
     */
    apply: function(schema, data) {
        _yuitest_coverfunc("build/dataschema-base/dataschema-base.js", "apply", 36);
_yuitest_coverline("build/dataschema-base/dataschema-base.js", 37);
return data;
    },
    
    /**
     * Applies field parser, if defined
     *
     * @method parse
     * @param value {Object} Original value.
     * @param field {Object} Field.
     * @return {Object} Type-converted value.
     */
    parse: function(value, field) {
        _yuitest_coverfunc("build/dataschema-base/dataschema-base.js", "parse", 48);
_yuitest_coverline("build/dataschema-base/dataschema-base.js", 49);
if(field.parser) {
            _yuitest_coverline("build/dataschema-base/dataschema-base.js", 50);
var parser = (LANG.isFunction(field.parser)) ?
            field.parser : Y.Parsers[field.parser+''];
            _yuitest_coverline("build/dataschema-base/dataschema-base.js", 52);
if(parser) {
                _yuitest_coverline("build/dataschema-base/dataschema-base.js", 53);
value = parser.call(this, value);
            }
            else {
            }
        }
        _yuitest_coverline("build/dataschema-base/dataschema-base.js", 58);
return value;
    }
};

_yuitest_coverline("build/dataschema-base/dataschema-base.js", 62);
Y.namespace("DataSchema").Base = SchemaBase;
_yuitest_coverline("build/dataschema-base/dataschema-base.js", 63);
Y.namespace("Parsers");


}, '3.7.3', {"requires": ["base"]});
