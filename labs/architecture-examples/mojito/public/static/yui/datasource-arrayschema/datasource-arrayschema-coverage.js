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
_yuitest_coverage["build/datasource-arrayschema/datasource-arrayschema.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datasource-arrayschema/datasource-arrayschema.js",
    code: []
};
_yuitest_coverage["build/datasource-arrayschema/datasource-arrayschema.js"].code=["YUI.add('datasource-arrayschema', function (Y, NAME) {","","/**"," * Extends DataSource with schema-parsing on array data."," *"," * @module datasource"," * @submodule datasource-arrayschema"," */","","/**"," * Adds schema-parsing to the DataSource Utility."," * @class DataSourceArraySchema"," * @extends Plugin.Base"," */    ","var DataSourceArraySchema = function() {","    DataSourceArraySchema.superclass.constructor.apply(this, arguments);","};","","Y.mix(DataSourceArraySchema, {","    /**","     * The namespace for the plugin. This will be the property on the host which","     * references the plugin instance.","     *","     * @property NS","     * @type String","     * @static","     * @final","     * @value \"schema\"","     */","    NS: \"schema\",","","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"dataSourceArraySchema\"","     */","    NAME: \"dataSourceArraySchema\",","","    /////////////////////////////////////////////////////////////////////////////","    //","    // DataSourceArraySchema Attributes","    //","    /////////////////////////////////////////////////////////////////////////////","","    ATTRS: {","        schema: {","            //value: {}","        }","    }","});","","Y.extend(DataSourceArraySchema, Y.Plugin.Base, {","    /**","    * Internal init() handler.","    *","    * @method initializer","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","        this.doBefore(\"_defDataFn\", this._beforeDefDataFn);","    },","","    /**","     * Parses raw data into a normalized response.","     *","     * @method _beforeDefDataFn","     * @param tId {Number} Unique transaction ID.","     * @param request {Object} The request.","     * @param callback {Object} The callback object with the following properties:","     *     <dl>","     *         <dt>success (Function)</dt> <dd>Success handler.</dd>","     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","     *     </dl>","     * @param data {Object} Raw data.","     * @protected","     */","    _beforeDefDataFn: function(e) {","        var data = (Y.DataSource.IO && (this.get(\"host\") instanceof Y.DataSource.IO) && Y.Lang.isString(e.data.responseText)) ? e.data.responseText : e.data,","            response = Y.DataSchema.Array.apply.call(this, this.get(\"schema\"), data),","            payload = e.details[0];","            ","        // Default","        if (!response) {","            response = {","                meta: {},","                results: data","            };","        }","        ","        payload.response = response;","","        this.get(\"host\").fire(\"response\", payload);","","        return new Y.Do.Halt(\"DataSourceArraySchema plugin halted _defDataFn\");","    }","});","    ","Y.namespace('Plugin').DataSourceArraySchema = DataSourceArraySchema;","","","}, '3.7.3', {\"requires\": [\"datasource-local\", \"plugin\", \"dataschema-array\"]});"];
_yuitest_coverage["build/datasource-arrayschema/datasource-arrayschema.js"].lines = {"1":0,"15":0,"16":0,"19":0,"56":0,"65":0,"83":0,"88":0,"89":0,"95":0,"97":0,"99":0,"103":0};
_yuitest_coverage["build/datasource-arrayschema/datasource-arrayschema.js"].functions = {"DataSourceArraySchema:15":0,"initializer:64":0,"_beforeDefDataFn:82":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datasource-arrayschema/datasource-arrayschema.js"].coveredLines = 13;
_yuitest_coverage["build/datasource-arrayschema/datasource-arrayschema.js"].coveredFunctions = 4;
_yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 1);
YUI.add('datasource-arrayschema', function (Y, NAME) {

/**
 * Extends DataSource with schema-parsing on array data.
 *
 * @module datasource
 * @submodule datasource-arrayschema
 */

/**
 * Adds schema-parsing to the DataSource Utility.
 * @class DataSourceArraySchema
 * @extends Plugin.Base
 */    
_yuitest_coverfunc("build/datasource-arrayschema/datasource-arrayschema.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 15);
var DataSourceArraySchema = function() {
    _yuitest_coverfunc("build/datasource-arrayschema/datasource-arrayschema.js", "DataSourceArraySchema", 15);
_yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 16);
DataSourceArraySchema.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 19);
Y.mix(DataSourceArraySchema, {
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
     * @value "dataSourceArraySchema"
     */
    NAME: "dataSourceArraySchema",

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSourceArraySchema Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        schema: {
            //value: {}
        }
    }
});

_yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 56);
Y.extend(DataSourceArraySchema, Y.Plugin.Base, {
    /**
    * Internal init() handler.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        _yuitest_coverfunc("build/datasource-arrayschema/datasource-arrayschema.js", "initializer", 64);
_yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 65);
this.doBefore("_defDataFn", this._beforeDefDataFn);
    },

    /**
     * Parses raw data into a normalized response.
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
        _yuitest_coverfunc("build/datasource-arrayschema/datasource-arrayschema.js", "_beforeDefDataFn", 82);
_yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 83);
var data = (Y.DataSource.IO && (this.get("host") instanceof Y.DataSource.IO) && Y.Lang.isString(e.data.responseText)) ? e.data.responseText : e.data,
            response = Y.DataSchema.Array.apply.call(this, this.get("schema"), data),
            payload = e.details[0];
            
        // Default
        _yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 88);
if (!response) {
            _yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 89);
response = {
                meta: {},
                results: data
            };
        }
        
        _yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 95);
payload.response = response;

        _yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 97);
this.get("host").fire("response", payload);

        _yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 99);
return new Y.Do.Halt("DataSourceArraySchema plugin halted _defDataFn");
    }
});
    
_yuitest_coverline("build/datasource-arrayschema/datasource-arrayschema.js", 103);
Y.namespace('Plugin').DataSourceArraySchema = DataSourceArraySchema;


}, '3.7.3', {"requires": ["datasource-local", "plugin", "dataschema-array"]});
