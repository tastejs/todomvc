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
_yuitest_coverage["build/cache-plugin/cache-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/cache-plugin/cache-plugin.js",
    code: []
};
_yuitest_coverage["build/cache-plugin/cache-plugin.js"].code=["YUI.add('cache-plugin', function (Y, NAME) {","","/**"," * Provides support to use Cache as a Plugin to a Base-based class."," *"," * @module cache"," * @submodule cache-plugin"," */","","/**"," * Plugin.Cache adds pluginizability to Cache."," * @class Plugin.Cache"," * @extends Cache"," * @uses Plugin.Base"," */","function CachePlugin(config) {","    var cache = config && config.cache ? config.cache : Y.Cache,","        tmpclass = Y.Base.create(\"dataSourceCache\", cache, [Y.Plugin.Base]),","        tmpinstance = new tmpclass(config);","    tmpclass.NS = \"tmpClass\";","    return tmpinstance;","}","","Y.mix(CachePlugin, {","    /**","     * The namespace for the plugin. This will be the property on the host which","     * references the plugin instance.","     *","     * @property NS","     * @type String","     * @static","     * @final","     * @value \"cache\"","     */","    NS: \"cache\",","","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"dataSourceCache\"","     */","    NAME: \"cachePlugin\"","});","","","Y.namespace(\"Plugin\").Cache = CachePlugin;","","","}, '3.7.3', {\"requires\": [\"plugin\", \"cache-base\"]});"];
_yuitest_coverage["build/cache-plugin/cache-plugin.js"].lines = {"1":0,"16":0,"17":0,"20":0,"21":0,"24":0,"50":0};
_yuitest_coverage["build/cache-plugin/cache-plugin.js"].functions = {"CachePlugin:16":0,"(anonymous 1):1":0};
_yuitest_coverage["build/cache-plugin/cache-plugin.js"].coveredLines = 7;
_yuitest_coverage["build/cache-plugin/cache-plugin.js"].coveredFunctions = 2;
_yuitest_coverline("build/cache-plugin/cache-plugin.js", 1);
YUI.add('cache-plugin', function (Y, NAME) {

/**
 * Provides support to use Cache as a Plugin to a Base-based class.
 *
 * @module cache
 * @submodule cache-plugin
 */

/**
 * Plugin.Cache adds pluginizability to Cache.
 * @class Plugin.Cache
 * @extends Cache
 * @uses Plugin.Base
 */
_yuitest_coverfunc("build/cache-plugin/cache-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/cache-plugin/cache-plugin.js", 16);
function CachePlugin(config) {
    _yuitest_coverfunc("build/cache-plugin/cache-plugin.js", "CachePlugin", 16);
_yuitest_coverline("build/cache-plugin/cache-plugin.js", 17);
var cache = config && config.cache ? config.cache : Y.Cache,
        tmpclass = Y.Base.create("dataSourceCache", cache, [Y.Plugin.Base]),
        tmpinstance = new tmpclass(config);
    _yuitest_coverline("build/cache-plugin/cache-plugin.js", 20);
tmpclass.NS = "tmpClass";
    _yuitest_coverline("build/cache-plugin/cache-plugin.js", 21);
return tmpinstance;
}

_yuitest_coverline("build/cache-plugin/cache-plugin.js", 24);
Y.mix(CachePlugin, {
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
    NAME: "cachePlugin"
});


_yuitest_coverline("build/cache-plugin/cache-plugin.js", 50);
Y.namespace("Plugin").Cache = CachePlugin;


}, '3.7.3', {"requires": ["plugin", "cache-base"]});
