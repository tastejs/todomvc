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
_yuitest_coverage["/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js",
    code: []
};
_yuitest_coverage["/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js"].code=["YUI.add('datatable-datasource-deprecated', function(Y) {","","// API Doc comments disabled to avoid deprecated class leakage into","// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the","// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.","/**","Plugs DataTable with DataSource integration.","","DEPRECATED. As of YUI 3.5.0, DataTable has been rebuilt.  This module","is designed to work with `datatable-base-deprecated` (effectively the 3.4.1","version of DataTable) and will be removed from the library in a future version.","","See http://yuilibrary.com/yui/docs/migration.html for help upgrading to the","latest version.","","For complete API docs for the classes in this and other deprecated","DataTable-related modules, refer to the static API doc files in the 3.4.1","download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip","","@module datatable-deprecated","@submodule datatable-datasource-deprecated","@deprecated","**/","","/*"," * Adds DataSource integration to DataTable."," * @class DataTableDataSource"," * @extends Plugin.Base"," */","function DataTableDataSource() {","    DataTableDataSource.superclass.constructor.apply(this, arguments);","}","","/////////////////////////////////////////////////////////////////////////////","//","// STATIC PROPERTIES","//","/////////////////////////////////////////////////////////////////////////////","Y.mix(DataTableDataSource, {","    /*","     * The namespace for the plugin. This will be the property on the host which","     * references the plugin instance.","     *","     * @property NS","     * @type String","     * @static","     * @final","     * @value \"datasource\"","     */","    NS: \"datasource\",","","    /*","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"dataTableDataSource\"","     */","    NAME: \"dataTableDataSource\",","","/////////////////////////////////////////////////////////////////////////////","//","// ATTRIBUTES","//","/////////////////////////////////////////////////////////////////////////////","    ATTRS: {","        /*","        * @attribute datasource","        * @description Pointer to DataSource instance.","        * @type {DataSource}","        */","        datasource: {","            setter: \"_setDataSource\"","        },","        ","        /*","        * @attribute initialRequest","        * @description Request sent to DataSource immediately upon initialization.","        * @type Object","        */","        initialRequest: {","            setter: \"_setInitialRequest\"","        }","    }","});","","/////////////////////////////////////////////////////////////////////////////","//","// PROTOTYPE","//","/////////////////////////////////////////////////////////////////////////////","Y.extend(DataTableDataSource, Y.Plugin.Base, {","    /////////////////////////////////////////////////////////////////////////////","    //","    // ATTRIBUTE HELPERS","    //","    /////////////////////////////////////////////////////////////////////////////","    /*","    * @method _setDataSource","    * @description Creates new DataSource instance if one is not provided.","    * @param ds {Object | Y.DataSource}","    * @return {DataSource}","    * @private","    */","    _setDataSource: function(ds) {","        return ds || new Y.DataSource.Local(ds);","    },","","    /*","    * @method _setInitialRequest","    * @description Sends request to DataSource.","    * @param request {Object} DataSource request.","    * @private","    */","    _setInitialRequest: function(request) {","    },","","    /////////////////////////////////////////////////////////////////////////////","    //","    // METHODS","    //","    /////////////////////////////////////////////////////////////////////////////","    /*","    * Initializer.","    *","    * @method initializer","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","        if(!Y.Lang.isUndefined(config.initialRequest)) {","            this.load({request:config.initialRequest});","        }","    },","","    ////////////////////////////////////////////////////////////////////////////","    //","    // DATA","    //","    ////////////////////////////////////////////////////////////////////////////","","    /*","     * Load data by calling DataSource's sendRequest() method under the hood.","     *","     * @method load","     * @param config {object} Optional configuration parameters:","     *","     * <dl>","     * <dt>request</dt><dd>Pass in a new request, or initialRequest is used.</dd>","     * <dt>callback</dt><dd>Pass in DataSource callback object, or the following default is used:","     *    <dl>","     *      <dt>success</dt><dd>datatable.onDataReturnInitializeTable</dd>","     *      <dt>failure</dt><dd>datatable.onDataReturnInitializeTable</dd>","     *      <dt>scope</dt><dd>datatable</dd>","     *      <dt>argument</dt><dd>datatable.getState()</dd>","     *    </dl>","     * </dd>","     * <dt>datasource</dt><dd>Pass in a new DataSource instance to override the current DataSource for this transaction.</dd>","     * </dl>","     */","    load: function(config) {","        config = config || {};","        config.request = config.request || this.get(\"initialRequest\");","        config.callback = config.callback || {","            success: Y.bind(this.onDataReturnInitializeTable, this),","            failure: Y.bind(this.onDataReturnInitializeTable, this),","            argument: this.get(\"host\").get(\"state\") //TODO","        };","","        var ds = (config.datasource || this.get(\"datasource\"));","        if(ds) {","            ds.sendRequest(config);","        }","    },","","    /*","     * Callback function passed to DataSource's sendRequest() method populates","     * an entire DataTable with new data, clearing previous data, if any.","     *","     * @method onDataReturnInitializeTable","     * @param e {Event.Facade} DataSource Event Facade object.","     */","    onDataReturnInitializeTable : function(e) {","        var records = (e.response && e.response.results) || [];","","        this.get(\"host\").get(\"recordset\").set(\"records\", records);","    }","});","","Y.namespace(\"Plugin\").DataTableDataSource = DataTableDataSource;","","","","","","}, '3.7.3' ,{requires:['datatable-base-deprecated','plugin','datasource-local']});"];
_yuitest_coverage["/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js"].lines = {"1":0,"30":0,"31":0,"39":0,"94":0,"108":0,"133":0,"134":0,"164":0,"165":0,"166":0,"172":0,"173":0,"174":0,"186":0,"188":0,"192":0};
_yuitest_coverage["/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js"].functions = {"DataTableDataSource:30":0,"_setDataSource:107":0,"initializer:132":0,"load:163":0,"onDataReturnInitializeTable:185":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js"].coveredLines = 17;
_yuitest_coverage["/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js"].coveredFunctions = 6;
_yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 1);
YUI.add('datatable-datasource-deprecated', function(Y) {

// API Doc comments disabled to avoid deprecated class leakage into
// non-deprecated class API docs.  See the 3.4.1 datatable API doc files in the
// download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip for reference.
/**
Plugs DataTable with DataSource integration.

DEPRECATED. As of YUI 3.5.0, DataTable has been rebuilt.  This module
is designed to work with `datatable-base-deprecated` (effectively the 3.4.1
version of DataTable) and will be removed from the library in a future version.

See http://yuilibrary.com/yui/docs/migration.html for help upgrading to the
latest version.

For complete API docs for the classes in this and other deprecated
DataTable-related modules, refer to the static API doc files in the 3.4.1
download at http://yui.zenfs.com/releases/yui3/yui_3.4.1.zip

@module datatable-deprecated
@submodule datatable-datasource-deprecated
@deprecated
**/

/*
 * Adds DataSource integration to DataTable.
 * @class DataTableDataSource
 * @extends Plugin.Base
 */
_yuitest_coverfunc("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 30);
function DataTableDataSource() {
    _yuitest_coverfunc("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", "DataTableDataSource", 30);
_yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 31);
DataTableDataSource.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 39);
Y.mix(DataTableDataSource, {
    /*
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

    /*
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
        /*
        * @attribute datasource
        * @description Pointer to DataSource instance.
        * @type {DataSource}
        */
        datasource: {
            setter: "_setDataSource"
        },
        
        /*
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
_yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 94);
Y.extend(DataTableDataSource, Y.Plugin.Base, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /*
    * @method _setDataSource
    * @description Creates new DataSource instance if one is not provided.
    * @param ds {Object | Y.DataSource}
    * @return {DataSource}
    * @private
    */
    _setDataSource: function(ds) {
        _yuitest_coverfunc("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", "_setDataSource", 107);
_yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 108);
return ds || new Y.DataSource.Local(ds);
    },

    /*
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
    /*
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        _yuitest_coverfunc("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", "initializer", 132);
_yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 133);
if(!Y.Lang.isUndefined(config.initialRequest)) {
            _yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 134);
this.load({request:config.initialRequest});
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // DATA
    //
    ////////////////////////////////////////////////////////////////////////////

    /*
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
        _yuitest_coverfunc("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", "load", 163);
_yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 164);
config = config || {};
        _yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 165);
config.request = config.request || this.get("initialRequest");
        _yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 166);
config.callback = config.callback || {
            success: Y.bind(this.onDataReturnInitializeTable, this),
            failure: Y.bind(this.onDataReturnInitializeTable, this),
            argument: this.get("host").get("state") //TODO
        };

        _yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 172);
var ds = (config.datasource || this.get("datasource"));
        _yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 173);
if(ds) {
            _yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 174);
ds.sendRequest(config);
        }
    },

    /*
     * Callback function passed to DataSource's sendRequest() method populates
     * an entire DataTable with new data, clearing previous data, if any.
     *
     * @method onDataReturnInitializeTable
     * @param e {Event.Facade} DataSource Event Facade object.
     */
    onDataReturnInitializeTable : function(e) {
        _yuitest_coverfunc("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", "onDataReturnInitializeTable", 185);
_yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 186);
var records = (e.response && e.response.results) || [];

        _yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 188);
this.get("host").get("recordset").set("records", records);
    }
});

_yuitest_coverline("/build/datatable-datasource-deprecated/datatable-datasource-deprecated.js", 192);
Y.namespace("Plugin").DataTableDataSource = DataTableDataSource;





}, '3.7.3' ,{requires:['datatable-base-deprecated','plugin','datasource-local']});
