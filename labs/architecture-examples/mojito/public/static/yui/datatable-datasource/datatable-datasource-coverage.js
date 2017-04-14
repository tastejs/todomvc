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
_yuitest_coverage["build/datatable-datasource/datatable-datasource.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatable-datasource/datatable-datasource.js",
    code: []
};
_yuitest_coverage["build/datatable-datasource/datatable-datasource.js"].code=["YUI.add('datatable-datasource', function (Y, NAME) {","","/**"," * Plugs DataTable with DataSource integration."," *"," * @module datatable"," * @submodule datatable-datasource"," */","","/**"," * Adds DataSource integration to DataTable."," * @class Plugin.DataTableDataSource"," * @extends Plugin.Base"," */","function DataTableDataSource() {","    DataTableDataSource.superclass.constructor.apply(this, arguments);","}","","/////////////////////////////////////////////////////////////////////////////","//","// STATIC PROPERTIES","//","/////////////////////////////////////////////////////////////////////////////","Y.mix(DataTableDataSource, {","    /**","     * The namespace for the plugin. This will be the property on the host which","     * references the plugin instance.","     *","     * @property NS","     * @type String","     * @static","     * @final","     * @value \"datasource\"","     */","    NS: \"datasource\",","","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"dataTableDataSource\"","     */","    NAME: \"dataTableDataSource\",","","/////////////////////////////////////////////////////////////////////////////","//","// ATTRIBUTES","//","/////////////////////////////////////////////////////////////////////////////","    ATTRS: {","        /**","        * @attribute datasource","        * @description Pointer to DataSource instance.","        * @type {DataSource}","        */","        datasource: {","            setter: \"_setDataSource\"","        },","        ","        /**","        * @attribute initialRequest","        * @description Request sent to DataSource immediately upon initialization.","        * @type Object","        */","        initialRequest: {","            setter: \"_setInitialRequest\"","        }","    }","});","","/////////////////////////////////////////////////////////////////////////////","//","// PROTOTYPE","//","/////////////////////////////////////////////////////////////////////////////","Y.extend(DataTableDataSource, Y.Plugin.Base, {","    /////////////////////////////////////////////////////////////////////////////","    //","    // ATTRIBUTE HELPERS","    //","    /////////////////////////////////////////////////////////////////////////////","    /**","    * @method _setDataSource","    * @description Creates new DataSource instance if one is not provided.","    * @param ds {Object | Y.DataSource}","    * @return {DataSource}","    * @private","    */","    _setDataSource: function(ds) {","        return ds || new Y.DataSource.Local(ds);","    },","","    /**","    * @method _setInitialRequest","    * @description Sends request to DataSource.","    * @param request {Object} DataSource request.","    * @private","    */","    _setInitialRequest: function(request) {","    },","","    /////////////////////////////////////////////////////////////////////////////","    //","    // METHODS","    //","    /////////////////////////////////////////////////////////////////////////////","    /**","    * Initializer.","    *","    * @method initializer","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","        if(!Y.Lang.isUndefined(config.initialRequest)) {","            this.load({request:config.initialRequest});","        }","    },","","    ////////////////////////////////////////////////////////////////////////////","    //","    // DATA","    //","    ////////////////////////////////////////////////////////////////////////////","","    /**","     * Load data by calling DataSource's sendRequest() method under the hood.","     *","     * @method load","     * @param config {object} Optional configuration parameters:","     *","     * <dl>","     * <dt>request</dt><dd>Pass in a new request, or initialRequest is used.</dd>","     * <dt>callback</dt><dd>Pass in DataSource callback object, or the following default is used:","     *    <dl>","     *      <dt>success</dt><dd>datatable.onDataReturnInitializeTable</dd>","     *      <dt>failure</dt><dd>datatable.onDataReturnInitializeTable</dd>","     *      <dt>scope</dt><dd>datatable</dd>","     *      <dt>argument</dt><dd>datatable.getState()</dd>","     *    </dl>","     * </dd>","     * <dt>datasource</dt><dd>Pass in a new DataSource instance to override the current DataSource for this transaction.</dd>","     * </dl>","     */","    load: function(config) {","        config = config || {};","        config.request = config.request || this.get(\"initialRequest\");","        config.callback = config.callback || {","            success: Y.bind(this.onDataReturnInitializeTable, this),","            failure: Y.bind(this.onDataReturnInitializeTable, this),","            argument: this.get(\"host\").get(\"state\") //TODO","        };","","        var ds = (config.datasource || this.get(\"datasource\"));","        if(ds) {","            ds.sendRequest(config);","        }","    },","","    /**","     * Callback function passed to DataSource's sendRequest() method populates","     * an entire DataTable with new data, clearing previous data, if any.","     *","     * @method onDataReturnInitializeTable","     * @param e {Event.Facade} DataSource Event Facade object.","     */","    onDataReturnInitializeTable : function(e) {","        var records = (e.response && e.response.results) || [];","","        this.get(\"host\").set(\"data\", records);","    }","});","","Y.namespace(\"Plugin\").DataTableDataSource = DataTableDataSource;","","","}, '3.7.3', {\"requires\": [\"datatable-base\", \"plugin\", \"datasource-local\"]});"];
_yuitest_coverage["build/datatable-datasource/datatable-datasource.js"].lines = {"1":0,"15":0,"16":0,"24":0,"79":0,"93":0,"118":0,"119":0,"149":0,"150":0,"151":0,"157":0,"158":0,"159":0,"171":0,"173":0,"177":0};
_yuitest_coverage["build/datatable-datasource/datatable-datasource.js"].functions = {"DataTableDataSource:15":0,"_setDataSource:92":0,"initializer:117":0,"load:148":0,"onDataReturnInitializeTable:170":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatable-datasource/datatable-datasource.js"].coveredLines = 17;
_yuitest_coverage["build/datatable-datasource/datatable-datasource.js"].coveredFunctions = 6;
_yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 1);
YUI.add('datatable-datasource', function (Y, NAME) {

/**
 * Plugs DataTable with DataSource integration.
 *
 * @module datatable
 * @submodule datatable-datasource
 */

/**
 * Adds DataSource integration to DataTable.
 * @class Plugin.DataTableDataSource
 * @extends Plugin.Base
 */
_yuitest_coverfunc("build/datatable-datasource/datatable-datasource.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 15);
function DataTableDataSource() {
    _yuitest_coverfunc("build/datatable-datasource/datatable-datasource.js", "DataTableDataSource", 15);
_yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 16);
DataTableDataSource.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 24);
Y.mix(DataTableDataSource, {
    /**
     * The namespace for the plugin. This will be the property on the host which
     * references the plugin instance.
     *
     * @property NS
     * @type String
     * @static
     * @final
     * @value "datasource"
     */
    NS: "datasource",

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataTableDataSource"
     */
    NAME: "dataTableDataSource",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /**
        * @attribute datasource
        * @description Pointer to DataSource instance.
        * @type {DataSource}
        */
        datasource: {
            setter: "_setDataSource"
        },
        
        /**
        * @attribute initialRequest
        * @description Request sent to DataSource immediately upon initialization.
        * @type Object
        */
        initialRequest: {
            setter: "_setInitialRequest"
        }
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 79);
Y.extend(DataTableDataSource, Y.Plugin.Base, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * @method _setDataSource
    * @description Creates new DataSource instance if one is not provided.
    * @param ds {Object | Y.DataSource}
    * @return {DataSource}
    * @private
    */
    _setDataSource: function(ds) {
        _yuitest_coverfunc("build/datatable-datasource/datatable-datasource.js", "_setDataSource", 92);
_yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 93);
return ds || new Y.DataSource.Local(ds);
    },

    /**
    * @method _setInitialRequest
    * @description Sends request to DataSource.
    * @param request {Object} DataSource request.
    * @private
    */
    _setInitialRequest: function(request) {
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        _yuitest_coverfunc("build/datatable-datasource/datatable-datasource.js", "initializer", 117);
_yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 118);
if(!Y.Lang.isUndefined(config.initialRequest)) {
            _yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 119);
this.load({request:config.initialRequest});
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // DATA
    //
    ////////////////////////////////////////////////////////////////////////////

    /**
     * Load data by calling DataSource's sendRequest() method under the hood.
     *
     * @method load
     * @param config {object} Optional configuration parameters:
     *
     * <dl>
     * <dt>request</dt><dd>Pass in a new request, or initialRequest is used.</dd>
     * <dt>callback</dt><dd>Pass in DataSource callback object, or the following default is used:
     *    <dl>
     *      <dt>success</dt><dd>datatable.onDataReturnInitializeTable</dd>
     *      <dt>failure</dt><dd>datatable.onDataReturnInitializeTable</dd>
     *      <dt>scope</dt><dd>datatable</dd>
     *      <dt>argument</dt><dd>datatable.getState()</dd>
     *    </dl>
     * </dd>
     * <dt>datasource</dt><dd>Pass in a new DataSource instance to override the current DataSource for this transaction.</dd>
     * </dl>
     */
    load: function(config) {
        _yuitest_coverfunc("build/datatable-datasource/datatable-datasource.js", "load", 148);
_yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 149);
config = config || {};
        _yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 150);
config.request = config.request || this.get("initialRequest");
        _yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 151);
config.callback = config.callback || {
            success: Y.bind(this.onDataReturnInitializeTable, this),
            failure: Y.bind(this.onDataReturnInitializeTable, this),
            argument: this.get("host").get("state") //TODO
        };

        _yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 157);
var ds = (config.datasource || this.get("datasource"));
        _yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 158);
if(ds) {
            _yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 159);
ds.sendRequest(config);
        }
    },

    /**
     * Callback function passed to DataSource's sendRequest() method populates
     * an entire DataTable with new data, clearing previous data, if any.
     *
     * @method onDataReturnInitializeTable
     * @param e {Event.Facade} DataSource Event Facade object.
     */
    onDataReturnInitializeTable : function(e) {
        _yuitest_coverfunc("build/datatable-datasource/datatable-datasource.js", "onDataReturnInitializeTable", 170);
_yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 171);
var records = (e.response && e.response.results) || [];

        _yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 173);
this.get("host").set("data", records);
    }
});

_yuitest_coverline("build/datatable-datasource/datatable-datasource.js", 177);
Y.namespace("Plugin").DataTableDataSource = DataTableDataSource;


}, '3.7.3', {"requires": ["datatable-base", "plugin", "datasource-local"]});
