/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
function DataTableDataSource() {
    DataTableDataSource.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
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
        if(!Y.Lang.isUndefined(config.initialRequest)) {
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
        config = config || {};
        config.request = config.request || this.get("initialRequest");
        config.callback = config.callback || {
            success: Y.bind(this.onDataReturnInitializeTable, this),
            failure: Y.bind(this.onDataReturnInitializeTable, this),
            argument: this.get("host").get("state") //TODO
        };

        var ds = (config.datasource || this.get("datasource"));
        if(ds) {
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
        var records = (e.response && e.response.results) || [];

        this.get("host").set("data", records);
    }
});

Y.namespace("Plugin").DataTableDataSource = DataTableDataSource;


}, '3.7.3', {"requires": ["datatable-base", "plugin", "datasource-local"]});
