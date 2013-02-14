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
_yuitest_coverage["build/base-pluginhost/base-pluginhost.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/base-pluginhost/base-pluginhost.js",
    code: []
};
_yuitest_coverage["build/base-pluginhost/base-pluginhost.js"].code=["YUI.add('base-pluginhost', function (Y, NAME) {","","    /**","     * The base-pluginhost submodule adds Plugin support to Base, by augmenting Base with ","     * Plugin.Host and setting up static (class level) Base.plug and Base.unplug methods.","     *","     * @module base","     * @submodule base-pluginhost","     * @for Base","     */","","    var Base = Y.Base,","        PluginHost = Y.Plugin.Host;","","    Y.mix(Base, PluginHost, false, null, 1);","","    /**","     * Alias for <a href=\"Plugin.Host.html#method_Plugin.Host.plug\">Plugin.Host.plug</a>. See aliased ","     * method for argument and return value details.","     *","     * @method plug","     * @static","     */","    Base.plug = PluginHost.plug;","","    /**","     * Alias for <a href=\"Plugin.Host.html#method_Plugin.Host.unplug\">Plugin.Host.unplug</a>. See the ","     * aliased method for argument and return value details.","     *","     * @method unplug","     * @static","     */","    Base.unplug = PluginHost.unplug;","","","}, '3.7.3', {\"requires\": [\"base-base\", \"pluginhost\"]});"];
_yuitest_coverage["build/base-pluginhost/base-pluginhost.js"].lines = {"1":0,"12":0,"15":0,"24":0,"33":0};
_yuitest_coverage["build/base-pluginhost/base-pluginhost.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/base-pluginhost/base-pluginhost.js"].coveredLines = 5;
_yuitest_coverage["build/base-pluginhost/base-pluginhost.js"].coveredFunctions = 1;
_yuitest_coverline("build/base-pluginhost/base-pluginhost.js", 1);
YUI.add('base-pluginhost', function (Y, NAME) {

    /**
     * The base-pluginhost submodule adds Plugin support to Base, by augmenting Base with 
     * Plugin.Host and setting up static (class level) Base.plug and Base.unplug methods.
     *
     * @module base
     * @submodule base-pluginhost
     * @for Base
     */

    _yuitest_coverfunc("build/base-pluginhost/base-pluginhost.js", "(anonymous 1)", 1);
_yuitest_coverline("build/base-pluginhost/base-pluginhost.js", 12);
var Base = Y.Base,
        PluginHost = Y.Plugin.Host;

    _yuitest_coverline("build/base-pluginhost/base-pluginhost.js", 15);
Y.mix(Base, PluginHost, false, null, 1);

    /**
     * Alias for <a href="Plugin.Host.html#method_Plugin.Host.plug">Plugin.Host.plug</a>. See aliased 
     * method for argument and return value details.
     *
     * @method plug
     * @static
     */
    _yuitest_coverline("build/base-pluginhost/base-pluginhost.js", 24);
Base.plug = PluginHost.plug;

    /**
     * Alias for <a href="Plugin.Host.html#method_Plugin.Host.unplug">Plugin.Host.unplug</a>. See the 
     * aliased method for argument and return value details.
     *
     * @method unplug
     * @static
     */
    _yuitest_coverline("build/base-pluginhost/base-pluginhost.js", 33);
Base.unplug = PluginHost.unplug;


}, '3.7.3', {"requires": ["base-base", "pluginhost"]});
