/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
var DataSourceJSONSchema = function() {
    DataSourceJSONSchema.superclass.constructor.apply(this, arguments);
};

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

Y.extend(DataSourceJSONSchema, Y.Plugin.Base, {
    /**
    * Internal init() handler.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
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
        var data = e.data && (e.data.responseText || e.data),
            schema = this.get('schema'),
            payload = e.details[0];
        
        payload.response = Y.DataSchema.JSON.apply.call(this, schema, data) || {
            meta: {},
            results: data
        };

        this.get("host").fire("response", payload);

        return new Y.Do.Halt("DataSourceJSONSchema plugin halted _defDataFn");
    }
});
    
Y.namespace('Plugin').DataSourceJSONSchema = DataSourceJSONSchema;


}, '3.7.3', {"requires": ["datasource-local", "plugin", "dataschema-json"]});
