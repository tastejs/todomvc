/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
var DataSourceTextSchema = function() {
    DataSourceTextSchema.superclass.constructor.apply(this, arguments);
};

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

Y.extend(DataSourceTextSchema, Y.Plugin.Base, {
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
        var schema = this.get('schema'),
            payload = e.details[0],
            // TODO: Do I need to sniff for DS.IO + isString(responseText)?
            data = e.data.responseText || e.data;

        payload.response = Y.DataSchema.Text.apply.call(this, schema, data) || {
            meta: {},
            results: data
        };

        this.get("host").fire("response", payload);

        return new Y.Do.Halt("DataSourceTextSchema plugin halted _defDataFn");
    }
});
    
Y.namespace('Plugin').DataSourceTextSchema = DataSourceTextSchema;


}, '3.7.3', {"requires": ["datasource-local", "plugin", "dataschema-text"]});
