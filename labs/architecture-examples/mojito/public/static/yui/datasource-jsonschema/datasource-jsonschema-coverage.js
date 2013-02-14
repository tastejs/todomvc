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
_yuitest_coverage["build/datasource-jsonschema/datasource-jsonschema.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datasource-jsonschema/datasource-jsonschema.js",
    code: []
};
_yuitest_coverage["build/datasource-jsonschema/datasource-jsonschema.js"].code=["YUI.add('datasource-jsonschema', function (Y, NAME) {","","/**"," * Extends DataSource with schema-parsing on JSON data."," *"," * @module datasource"," * @submodule datasource-jsonschema"," */","","/**"," * Adds schema-parsing to the DataSource Utility."," * @class DataSourceJSONSchema"," * @extends Plugin.Base"," */    ","var DataSourceJSONSchema = function() {","    DataSourceJSONSchema.superclass.constructor.apply(this, arguments);","};","","Y.mix(DataSourceJSONSchema, {","    /**","     * The namespace for the plugin. This will be the property on the host which","     * references the plugin instance.","     *","     * @property NS","     * @type String","     * @static","     * @final","     * @value \"schema\"","     */","    NS: \"schema\",","","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"dataSourceJSONSchema\"","     */","    NAME: \"dataSourceJSONSchema\",","","    /////////////////////////////////////////////////////////////////////////////","    //","    // DataSourceJSONSchema Attributes","    //","    /////////////////////////////////////////////////////////////////////////////","","    ATTRS: {","        schema: {","            //value: {}","        }","    }","});","","Y.extend(DataSourceJSONSchema, Y.Plugin.Base, {","    /**","    * Internal init() handler.","    *","    * @method initializer","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","        this.doBefore(\"_defDataFn\", this._beforeDefDataFn);","    },","","    /**","     * Parses raw data into a normalized response. To accommodate XHR responses,","     * will first look for data in data.responseText. Otherwise will just work","     * with data.","     *","     * @method _beforeDefDataFn","     * @param tId {Number} Unique transaction ID.","     * @param request {Object} The request.","     * @param callback {Object} The callback object with the following properties:","     *     <dl>","     *         <dt>success (Function)</dt> <dd>Success handler.</dd>","     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","     *     </dl>","     * @param data {Object} Raw data.","     * @protected","     */","    _beforeDefDataFn: function(e) {","        var data = e.data && (e.data.responseText || e.data),","            schema = this.get('schema'),","            payload = e.details[0];","        ","        payload.response = Y.DataSchema.JSON.apply.call(this, schema, data) || {","            meta: {},","            results: data","        };","","        this.get(\"host\").fire(\"response\", payload);","","        return new Y.Do.Halt(\"DataSourceJSONSchema plugin halted _defDataFn\");","    }","});","    ","Y.namespace('Plugin').DataSourceJSONSchema = DataSourceJSONSchema;","","","}, '3.7.3', {\"requires\": [\"datasource-local\", \"plugin\", \"dataschema-json\"]});"];
_yuitest_coverage["build/datasource-jsonschema/datasource-jsonschema.js"].lines = {"1":0,"15":0,"16":0,"19":0,"56":0,"65":0,"85":0,"89":0,"94":0,"96":0,"100":0};
_yuitest_coverage["build/datasource-jsonschema/datasource-jsonschema.js"].functions = {"DataSourceJSONSchema:15":0,"initializer:64":0,"_beforeDefDataFn:84":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datasource-jsonschema/datasource-jsonschema.js"].coveredLines = 11;
_yuitest_coverage["build/datasource-jsonschema/datasource-jsonschema.js"].coveredFunctions = 4;
_yuitest_coverline("build/datasource-jsonschema/datasource-jsonschema.js", 1);
YUI.add('datasource-jsonschema', function (Y, NAME) {

/**
 * Extends DataSource with schema-parsing on JSON data.
 *
 * @module datasource
 * @submodule datasource-jsonschema
 */

/**
 * Adds schema-parsing to the DataSource Utility.
 * @class DataSourceJSONSchema
 * @extends Plugin.Base
 */    
_yuitest_coverfunc("build/datasource-jsonschema/datasource-jsonschema.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datasource-jsonschema/datasource-jsonschema.js", 15);
var DataSourceJSONSchema = function() {
    _yuitest_coverfunc("build/datasource-jsonschema/datasource-jsonschema.js", "DataSourceJSONSchema", 15);
_yuitest_coverline("build/datasource-jsonschema/datasource-jsonschema.js", 16);
DataSourceJSONSchema.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/datasource-jsonschema/datasource-jsonschema.js", 19);
Y.mix(DataSourceJSONSchema, {
    /**
     * The namespace for the plugin. This will be the property on the host which
     * references the plugin instance.
     *
     * @property NS
     * @type String
     * @static
     * @final
     * @value "schema"
     */
    NS: "schema",

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataSourceJSONSchema"
     */
    NAME: "dataSourceJSONSchema",

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSourceJSONSchema Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        schema: {
            //value: {}
        }
    }
});

_yuitest_coverline("build/datasource-jsonschema/datasource-jsonschema.js", 56);
Y.extend(DataSourceJSONSchema, Y.Plugin.Base, {
    /**
    * Internal init() handler.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        _yuitest_coverfunc("build/datasource-jsonschema/datasource-jsonschema.js", "initializer", 64);
_yuitest_coverline("build/datasource-jsonschema/datasource-jsonschema.js", 65);
this.doBefore("_defDataFn", this._beforeDefDataFn);
    },

    /**
     * Parses raw data into a normalized response. To accommodate XHR responses,
     * will first look for data in data.responseText. Otherwise will just work
     * with data.
     *
     * @method _beforeDefDataFn
     * @param tId {Number} Unique transaction ID.
     * @param request {Object} The request.
     * @param callback {Object} The callback object with the following properties:
     *     <dl>
     *         <dt>success (Function)</dt> <dd>Success handler.</dd>
     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>
     *     </dl>
     * @param data {Object} Raw data.
     * @protected
     */
    _beforeDefDataFn: function(e) {
        _yuitest_coverfunc("build/datasource-jsonschema/datasource-jsonschema.js", "_beforeDefDataFn", 84);
_yuitest_coverline("build/datasource-jsonschema/datasource-jsonschema.js", 85);
var data = e.data && (e.data.responseText || e.data),
            schema = this.get('schema'),
            payload = e.details[0];
        
        _yuitest_coverline("build/datasource-jsonschema/datasource-jsonschema.js", 89);
payload.response = Y.DataSchema.JSON.apply.call(this, schema, data) || {
            meta: {},
            results: data
        };

        _yuitest_coverline("build/datasource-jsonschema/datasource-jsonschema.js", 94);
this.get("host").fire("response", payload);

        _yuitest_coverline("build/datasource-jsonschema/datasource-jsonschema.js", 96);
return new Y.Do.Halt("DataSourceJSONSchema plugin halted _defDataFn");
    }
});
    
_yuitest_coverline("build/datasource-jsonschema/datasource-jsonschema.js", 100);
Y.namespace('Plugin').DataSourceJSONSchema = DataSourceJSONSchema;


}, '3.7.3', {"requires": ["datasource-local", "plugin", "dataschema-json"]});
