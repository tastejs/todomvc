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
_yuitest_coverage["build/datasource-cache/datasource-cache.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datasource-cache/datasource-cache.js",
    code: []
};
_yuitest_coverage["build/datasource-cache/datasource-cache.js"].code=["YUI.add('datasource-cache', function (Y, NAME) {","","/**"," * Plugs DataSource with caching functionality."," *"," * @module datasource"," * @submodule datasource-cache"," */","","/**"," * DataSourceCache extension binds Cache to DataSource."," * @class DataSourceCacheExtension"," */","var DataSourceCacheExtension = function() {","};","","Y.mix(DataSourceCacheExtension, {","    /**","     * The namespace for the plugin. This will be the property on the host which","     * references the plugin instance.","     *","     * @property NS","     * @type String","     * @static","     * @final","     * @value \"cache\"","     */","    NS: \"cache\",","","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"dataSourceCacheExtension\"","     */","    NAME: \"dataSourceCacheExtension\"","});","","DataSourceCacheExtension.prototype = {","    /**","    * Internal init() handler.","    *","    * @method initializer","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","        this.doBefore(\"_defRequestFn\", this._beforeDefRequestFn);","        this.doBefore(\"_defResponseFn\", this._beforeDefResponseFn);","    },","","    /**","     * First look for cached response, then send request to live data.","     *","     * @method _beforeDefRequestFn","     * @param e {Event.Facade} Event Facade with the following properties:","     * <dl>","     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","     * <dt>request (Object)</dt> <dd>The request.</dd>","     * <dt>callback (Object)</dt> <dd>The callback object.</dd>","     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","     * </dl>","     * @protected","     */","    _beforeDefRequestFn: function(e) {","        // Is response already in the Cache?","        var entry = (this.retrieve(e.request)) || null,","            payload = e.details[0];","","        if (entry && entry.response) {","            payload.cached   = entry.cached;","            payload.response = entry.response;","            payload.data     = entry.data;","","            this.get(\"host\").fire(\"response\", payload);","","            return new Y.Do.Halt(\"DataSourceCache extension halted _defRequestFn\");","        }","    },","","    /**","     * Adds data to cache before returning data.","     *","     * @method _beforeDefResponseFn","     * @param e {Event.Facade} Event Facade with the following properties:","     * <dl>","     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","     * <dt>request (Object)</dt> <dd>The request.</dd>","     * <dt>callback (Object)</dt> <dd>The callback object with the following properties:","     *     <dl>","     *         <dt>success (Function)</dt> <dd>Success handler.</dd>","     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","     *     </dl>","     * </dd>","     * <dt>data (Object)</dt> <dd>Raw data.</dd>","     * <dt>response (Object)</dt> <dd>Normalized response object with the following properties:","     *     <dl>","     *         <dt>cached (Object)</dt> <dd>True when response is cached.</dd>","     *         <dt>results (Object)</dt> <dd>Parsed results.</dd>","     *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>","     *         <dt>error (Object)</dt> <dd>Error object.</dd>","     *     </dl>","     * </dd>","     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","     * </dl>","     * @protected","     */","     _beforeDefResponseFn: function(e) {","        // Add to Cache before returning","        if(e.response && !e.cached) {","            this.add(e.request, e.response);","        }","     }","};","","Y.namespace(\"Plugin\").DataSourceCacheExtension = DataSourceCacheExtension;","","","","/**"," * DataSource plugin adds cache functionality."," * @class DataSourceCache"," * @extends Cache"," * @uses Plugin.Base, DataSourceCachePlugin"," */","function DataSourceCache(config) {","    var cache = config && config.cache ? config.cache : Y.Cache,","        tmpclass = Y.Base.create(\"dataSourceCache\", cache, [Y.Plugin.Base, Y.Plugin.DataSourceCacheExtension]),","        tmpinstance = new tmpclass(config);","    tmpclass.NS = \"tmpClass\";","    return tmpinstance;","}","","Y.mix(DataSourceCache, {","    /**","     * The namespace for the plugin. This will be the property on the host which","     * references the plugin instance.","     *","     * @property NS","     * @type String","     * @static","     * @final","     * @value \"cache\"","     */","    NS: \"cache\",","","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"dataSourceCache\"","     */","    NAME: \"dataSourceCache\"","});","","","Y.namespace(\"Plugin\").DataSourceCache = DataSourceCache;","","","}, '3.7.3', {\"requires\": [\"datasource-local\", \"plugin\", \"cache-base\"]});"];
_yuitest_coverage["build/datasource-cache/datasource-cache.js"].lines = {"1":0,"14":0,"17":0,"42":0,"51":0,"52":0,"70":0,"73":0,"74":0,"75":0,"76":0,"78":0,"80":0,"113":0,"114":0,"119":0,"129":0,"130":0,"133":0,"134":0,"137":0,"163":0};
_yuitest_coverage["build/datasource-cache/datasource-cache.js"].functions = {"initializer:50":0,"_beforeDefRequestFn:68":0,"_beforeDefResponseFn:111":0,"DataSourceCache:129":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datasource-cache/datasource-cache.js"].coveredLines = 22;
_yuitest_coverage["build/datasource-cache/datasource-cache.js"].coveredFunctions = 5;
_yuitest_coverline("build/datasource-cache/datasource-cache.js", 1);
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
_yuitest_coverfunc("build/datasource-cache/datasource-cache.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datasource-cache/datasource-cache.js", 14);
var DataSourceCacheExtension = function() {
};

_yuitest_coverline("build/datasource-cache/datasource-cache.js", 17);
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

_yuitest_coverline("build/datasource-cache/datasource-cache.js", 42);
DataSourceCacheExtension.prototype = {
    /**
    * Internal init() handler.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        _yuitest_coverfunc("build/datasource-cache/datasource-cache.js", "initializer", 50);
_yuitest_coverline("build/datasource-cache/datasource-cache.js", 51);
this.doBefore("_defRequestFn", this._beforeDefRequestFn);
        _yuitest_coverline("build/datasource-cache/datasource-cache.js", 52);
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
        _yuitest_coverfunc("build/datasource-cache/datasource-cache.js", "_beforeDefRequestFn", 68);
_yuitest_coverline("build/datasource-cache/datasource-cache.js", 70);
var entry = (this.retrieve(e.request)) || null,
            payload = e.details[0];

        _yuitest_coverline("build/datasource-cache/datasource-cache.js", 73);
if (entry && entry.response) {
            _yuitest_coverline("build/datasource-cache/datasource-cache.js", 74);
payload.cached   = entry.cached;
            _yuitest_coverline("build/datasource-cache/datasource-cache.js", 75);
payload.response = entry.response;
            _yuitest_coverline("build/datasource-cache/datasource-cache.js", 76);
payload.data     = entry.data;

            _yuitest_coverline("build/datasource-cache/datasource-cache.js", 78);
this.get("host").fire("response", payload);

            _yuitest_coverline("build/datasource-cache/datasource-cache.js", 80);
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
        _yuitest_coverfunc("build/datasource-cache/datasource-cache.js", "_beforeDefResponseFn", 111);
_yuitest_coverline("build/datasource-cache/datasource-cache.js", 113);
if(e.response && !e.cached) {
            _yuitest_coverline("build/datasource-cache/datasource-cache.js", 114);
this.add(e.request, e.response);
        }
     }
};

_yuitest_coverline("build/datasource-cache/datasource-cache.js", 119);
Y.namespace("Plugin").DataSourceCacheExtension = DataSourceCacheExtension;



/**
 * DataSource plugin adds cache functionality.
 * @class DataSourceCache
 * @extends Cache
 * @uses Plugin.Base, DataSourceCachePlugin
 */
_yuitest_coverline("build/datasource-cache/datasource-cache.js", 129);
function DataSourceCache(config) {
    _yuitest_coverfunc("build/datasource-cache/datasource-cache.js", "DataSourceCache", 129);
_yuitest_coverline("build/datasource-cache/datasource-cache.js", 130);
var cache = config && config.cache ? config.cache : Y.Cache,
        tmpclass = Y.Base.create("dataSourceCache", cache, [Y.Plugin.Base, Y.Plugin.DataSourceCacheExtension]),
        tmpinstance = new tmpclass(config);
    _yuitest_coverline("build/datasource-cache/datasource-cache.js", 133);
tmpclass.NS = "tmpClass";
    _yuitest_coverline("build/datasource-cache/datasource-cache.js", 134);
return tmpinstance;
}

_yuitest_coverline("build/datasource-cache/datasource-cache.js", 137);
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


_yuitest_coverline("build/datasource-cache/datasource-cache.js", 163);
Y.namespace("Plugin").DataSourceCache = DataSourceCache;


}, '3.7.3', {"requires": ["datasource-local", "plugin", "cache-base"]});
