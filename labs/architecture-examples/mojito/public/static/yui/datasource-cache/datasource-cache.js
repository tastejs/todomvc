/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datasource-cache', function (Y, NAME) {

/**
 * Plugs DataSource with caching functionality.
 *
 * @module datasource
 * @submodule datasource-cache
 */

/**
 * DataSourceCache extension binds Cache to DataSource.
 * @class DataSourceCacheExtension
 */
var DataSourceCacheExtension = function() {
};

Y.mix(DataSourceCacheExtension, {
    /**
     * The namespace for the plugin. This will be the property on the host which
     * references the plugin instance.
     *
     * @property NS
     * @type String
     * @static
     * @final
     * @value "cache"
     */
    NS: "cache",

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataSourceCacheExtension"
     */
    NAME: "dataSourceCacheExtension"
});

DataSourceCacheExtension.prototype = {
    /**
    * Internal init() handler.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        this.doBefore("_defRequestFn", this._beforeDefRequestFn);
        this.doBefore("_defResponseFn", this._beforeDefResponseFn);
    },

    /**
     * First look for cached response, then send request to live data.
     *
     * @method _beforeDefRequestFn
     * @param e {Event.Facade} Event Facade with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object.</dd>
     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>
     * </dl>
     * @protected
     */
    _beforeDefRequestFn: function(e) {
        // Is response already in the Cache?
        var entry = (this.retrieve(e.request)) || null,
            payload = e.details[0];

        if (entry && entry.response) {
            payload.cached   = entry.cached;
            payload.response = entry.response;
            payload.data     = entry.data;

            this.get("host").fire("response", payload);

            return new Y.Do.Halt("DataSourceCache extension halted _defRequestFn");
        }
    },

    /**
     * Adds data to cache before returning data.
     *
     * @method _beforeDefResponseFn
     * @param e {Event.Facade} Event Facade with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object with the following properties:
     *     <dl>
     *         <dt>success (Function)</dt> <dd>Success handler.</dd>
     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>
     *     </dl>
     * </dd>
     * <dt>data (Object)</dt> <dd>Raw data.</dd>
     * <dt>response (Object)</dt> <dd>Normalized response object with the following properties:
     *     <dl>
     *         <dt>cached (Object)</dt> <dd>True when response is cached.</dd>
     *         <dt>results (Object)</dt> <dd>Parsed results.</dd>
     *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
     *         <dt>error (Object)</dt> <dd>Error object.</dd>
     *     </dl>
     * </dd>
     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>
     * </dl>
     * @protected
     */
     _beforeDefResponseFn: function(e) {
        // Add to Cache before returning
        if(e.response && !e.cached) {
            this.add(e.request, e.response);
        }
     }
};

Y.namespace("Plugin").DataSourceCacheExtension = DataSourceCacheExtension;



/**
 * DataSource plugin adds cache functionality.
 * @class DataSourceCache
 * @extends Cache
 * @uses Plugin.Base, DataSourceCachePlugin
 */
function DataSourceCache(config) {
    var cache = config && config.cache ? config.cache : Y.Cache,
        tmpclass = Y.Base.create("dataSourceCache", cache, [Y.Plugin.Base, Y.Plugin.DataSourceCacheExtension]),
        tmpinstance = new tmpclass(config);
    tmpclass.NS = "tmpClass";
    return tmpinstance;
}

Y.mix(DataSourceCache, {
    /**
     * The namespace for the plugin. This will be the property on the host which
     * references the plugin instance.
     *
     * @property NS
     * @type String
     * @static
     * @final
     * @value "cache"
     */
    NS: "cache",

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataSourceCache"
     */
    NAME: "dataSourceCache"
});


Y.namespace("Plugin").DataSourceCache = DataSourceCache;


}, '3.7.3', {"requires": ["datasource-local", "plugin", "cache-base"]});
