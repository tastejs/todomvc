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
_yuitest_coverage["build/datasource-textschema/datasource-textschema.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datasource-textschema/datasource-textschema.js",
    code: []
};
_yuitest_coverage["build/datasource-textschema/datasource-textschema.js"].code=["YUI.add('datasource-textschema', function (Y, NAME) {","","/**"," * Extends DataSource with schema-parsing on text data."," *"," * @module datasource"," * @submodule datasource-textschema"," */","","/**"," * Adds schema-parsing to the DataSource Utility."," * @class DataSourceTextSchema"," * @extends Plugin.Base"," */    ","var DataSourceTextSchema = function() {","    DataSourceTextSchema.superclass.constructor.apply(this, arguments);","};","","Y.mix(DataSourceTextSchema, {","    /**","     * The namespace for the plugin. This will be the property on the host which","     * references the plugin instance.","     *","     * @property NS","     * @type String","     * @static","     * @final","     * @value \"schema\"","     */","    NS: \"schema\",","","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"dataSourceTextSchema\"","     */","    NAME: \"dataSourceTextSchema\",","","    /////////////////////////////////////////////////////////////////////////////","    //","    // DataSourceTextSchema Attributes","    //","    /////////////////////////////////////////////////////////////////////////////","","    ATTRS: {","        schema: {","            //value: {}","        }","    }","});","","Y.extend(DataSourceTextSchema, Y.Plugin.Base, {","    /**","    * Internal init() handler.","    *","    * @method initializer","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","        this.doBefore(\"_defDataFn\", this._beforeDefDataFn);","    },","","    /**","     * Parses raw data into a normalized response.","     *","     * @method _beforeDefDataFn","     * @param tId {Number} Unique transaction ID.","     * @param request {Object} The request.","     * @param callback {Object} The callback object with the following properties:","     *     <dl>","     *         <dt>success (Function)</dt> <dd>Success handler.</dd>","     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","     *     </dl>","     * @param data {Object} Raw data.","     * @protected","     */","    _beforeDefDataFn: function(e) {","        var schema = this.get('schema'),","            payload = e.details[0],","            // TODO: Do I need to sniff for DS.IO + isString(responseText)?","            data = e.data.responseText || e.data;","","        payload.response = Y.DataSchema.Text.apply.call(this, schema, data) || {","            meta: {},","            results: data","        };","","        this.get(\"host\").fire(\"response\", payload);","","        return new Y.Do.Halt(\"DataSourceTextSchema plugin halted _defDataFn\");","    }","});","    ","Y.namespace('Plugin').DataSourceTextSchema = DataSourceTextSchema;","","","}, '3.7.3', {\"requires\": [\"datasource-local\", \"plugin\", \"dataschema-text\"]});"];
_yuitest_coverage["build/datasource-textschema/datasource-textschema.js"].lines = {"1":0,"15":0,"16":0,"19":0,"56":0,"65":0,"83":0,"88":0,"93":0,"95":0,"99":0};
_yuitest_coverage["build/datasource-textschema/datasource-textschema.js"].functions = {"DataSourceTextSchema:15":0,"initializer:64":0,"_beforeDefDataFn:82":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datasource-textschema/datasource-textschema.js"].coveredLines = 11;
_yuitest_coverage["build/datasource-textschema/datasource-textschema.js"].coveredFunctions = 4;
_yuitest_coverline("build/datasource-textschema/datasource-textschema.js", 1);
YUI.add('datasource-textschema', function (Y, NAME) {

/**
 * Extends DataSource with schema-parsing on text data.
 *
 * @module datasource
 * @submodule datasource-textschema
 */

/**
 * Adds schema-parsing to the DataSource Utility.
 * @class DataSourceTextSchema
 * @extends Plugin.Base
 */    
_yuitest_coverfunc("build/datasource-textschema/datasource-textschema.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datasource-textschema/datasource-textschema.js", 15);
var DataSourceTextSchema = function() {
    _yuitest_coverfunc("build/datasource-textschema/datasource-textschema.js", "DataSourceTextSchema", 15);
_yuitest_coverline("build/datasource-textschema/datasource-textschema.js", 16);
DataSourceTextSchema.superclass.constructor.apply(this, arguments);
};

_yuitest_coverline("build/datasource-textschema/datasource-textschema.js", 19);
Y.mix(DataSourceTextSchema, {
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
     * @value "dataSourceTextSchema"
     */
    NAME: "dataSourceTextSchema",

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSourceTextSchema Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        schema: {
            //value: {}
        }
    }
});

_yuitest_coverline("build/datasource-textschema/datasource-textschema.js", 56);
Y.extend(DataSourceTextSchema, Y.Plugin.Base, {
    /**
    * Internal init() handler.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        _yuitest_coverfunc("build/datasource-textschema/datasource-textschema.js", "initializer", 64);
_yuitest_coverline("build/datasource-textschema/datasource-textschema.js", 65);
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
        _yuitest_coverfunc("build/datasource-textschema/datasource-textschema.js", "_beforeDefDataFn", 82);
_yuitest_coverline("build/datasource-textschema/datasource-textschema.js", 83);
var schema = this.get('schema'),
            payload = e.details[0],
            // TODO: Do I need to sniff for DS.IO + isString(responseText)?
            data = e.data.responseText || e.data;

        _yuitest_coverline("build/datasource-textschema/datasource-textschema.js", 88);
payload.response = Y.DataSchema.Text.apply.call(this, schema, data) || {
            meta: {},
            results: data
        };

        _yuitest_coverline("build/datasource-textschema/datasource-textschema.js", 93);
this.get("host").fire("response", payload);

        _yuitest_coverline("build/datasource-textschema/datasource-textschema.js", 95);
return new Y.Do.Halt("DataSourceTextSchema plugin halted _defDataFn");
    }
});
    
_yuitest_coverline("build/datasource-textschema/datasource-textschema.js", 99);
Y.namespace('Plugin').DataSourceTextSchema = DataSourceTextSchema;


}, '3.7.3', {"requires": ["datasource-local", "plugin", "dataschema-text"]});
