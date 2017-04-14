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
_yuitest_coverage["build/pluginhost-config/pluginhost-config.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/pluginhost-config/pluginhost-config.js",
    code: []
};
_yuitest_coverage["build/pluginhost-config/pluginhost-config.js"].code=["YUI.add('pluginhost-config', function (Y, NAME) {","","    /**","     * Adds pluginhost constructor configuration and static configuration support","     * @submodule pluginhost-config","     */","","    var PluginHost = Y.Plugin.Host,","        L = Y.Lang;","","    /**","     * A protected initialization method, used by the host class to initialize","     * plugin configurations passed the constructor, through the config object.","     * ","     * Host objects should invoke this method at the appropriate time in their","     * construction lifecycle.","     * ","     * @method _initConfigPlugins","     * @param {Object} config The configuration object passed to the constructor","     * @protected","     * @for Plugin.Host","     */","    PluginHost.prototype._initConfigPlugins = function(config) {","","        // Class Configuration","        var classes = (this._getClasses) ? this._getClasses() : [this.constructor],","            plug = [],","            unplug = {},","            constructor, i, classPlug, classUnplug, pluginClassName;","","        // TODO: Room for optimization. Can we apply statically/unplug in same pass?","        for (i = classes.length - 1; i >= 0; i--) {","            constructor = classes[i];","","            classUnplug = constructor._UNPLUG;","            if (classUnplug) {","                // subclasses over-write","                Y.mix(unplug, classUnplug, true);","            }","","            classPlug = constructor._PLUG;","            if (classPlug) {","                // subclasses over-write","                Y.mix(plug, classPlug, true);","            }","        }","","        for (pluginClassName in plug) {","            if (plug.hasOwnProperty(pluginClassName)) {","                if (!unplug[pluginClassName]) {","                    this.plug(plug[pluginClassName]);","                }","            }","        }","","        // User Configuration","        if (config && config.plugins) {","            this.plug(config.plugins);","        }","    };","    ","    /**","     * Registers plugins to be instantiated at the class level (plugins ","     * which should be plugged into every instance of the class by default).","     *","     * @method plug","     * @static","     *","     * @param {Function} hostClass The host class on which to register the plugins","     * @param {Function | Array} plugin Either the plugin class, an array of plugin classes or an array of objects (with fn and cfg properties defined)","     * @param {Object} config (Optional) If plugin is the plugin class, the configuration for the plugin","     * @for Plugin.Host","     */","    PluginHost.plug = function(hostClass, plugin, config) {","        // Cannot plug into Base, since Plugins derive from Base [ will cause infinite recurrsion ]","        var p, i, l, name;","    ","        if (hostClass !== Y.Base) {","            hostClass._PLUG = hostClass._PLUG || {};","    ","            if (!L.isArray(plugin)) {","                if (config) {","                    plugin = {fn:plugin, cfg:config};","                }","                plugin = [plugin];","            }","    ","            for (i = 0, l = plugin.length; i < l;i++) {","                p = plugin[i];","                name = p.NAME || p.fn.NAME;","                hostClass._PLUG[name] = p;","            }","        }","    };","","    /**","     * Unregisters any class level plugins which have been registered by the host class, or any","     * other class in the hierarchy.","     *","     * @method unplug","     * @static","     *","     * @param {Function} hostClass The host class from which to unregister the plugins","     * @param {Function | Array} plugin The plugin class, or an array of plugin classes","     * @for Plugin.Host","     */","    PluginHost.unplug = function(hostClass, plugin) {","        var p, i, l, name;","    ","        if (hostClass !== Y.Base) {","            hostClass._UNPLUG = hostClass._UNPLUG || {};","    ","            if (!L.isArray(plugin)) {","                plugin = [plugin];","            }","    ","            for (i = 0, l = plugin.length; i < l; i++) {","                p = plugin[i];","                name = p.NAME;","                if (!hostClass._PLUG[name]) {","                    hostClass._UNPLUG[name] = p;","                } else {","                    delete hostClass._PLUG[name];","                }","            }","        }","    };","","","}, '3.7.3', {\"requires\": [\"pluginhost-base\"]});"];
_yuitest_coverage["build/pluginhost-config/pluginhost-config.js"].lines = {"1":0,"8":0,"23":0,"26":0,"32":0,"33":0,"35":0,"36":0,"38":0,"41":0,"42":0,"44":0,"48":0,"49":0,"50":0,"51":0,"57":0,"58":0,"74":0,"76":0,"78":0,"79":0,"81":0,"82":0,"83":0,"85":0,"88":0,"89":0,"90":0,"91":0,"107":0,"108":0,"110":0,"111":0,"113":0,"114":0,"117":0,"118":0,"119":0,"120":0,"121":0,"123":0};
_yuitest_coverage["build/pluginhost-config/pluginhost-config.js"].functions = {"_initConfigPlugins:23":0,"plug:74":0,"unplug:107":0,"(anonymous 1):1":0};
_yuitest_coverage["build/pluginhost-config/pluginhost-config.js"].coveredLines = 42;
_yuitest_coverage["build/pluginhost-config/pluginhost-config.js"].coveredFunctions = 4;
_yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 1);
YUI.add('pluginhost-config', function (Y, NAME) {

    /**
     * Adds pluginhost constructor configuration and static configuration support
     * @submodule pluginhost-config
     */

    _yuitest_coverfunc("build/pluginhost-config/pluginhost-config.js", "(anonymous 1)", 1);
_yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 8);
var PluginHost = Y.Plugin.Host,
        L = Y.Lang;

    /**
     * A protected initialization method, used by the host class to initialize
     * plugin configurations passed the constructor, through the config object.
     * 
     * Host objects should invoke this method at the appropriate time in their
     * construction lifecycle.
     * 
     * @method _initConfigPlugins
     * @param {Object} config The configuration object passed to the constructor
     * @protected
     * @for Plugin.Host
     */
    _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 23);
PluginHost.prototype._initConfigPlugins = function(config) {

        // Class Configuration
        _yuitest_coverfunc("build/pluginhost-config/pluginhost-config.js", "_initConfigPlugins", 23);
_yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 26);
var classes = (this._getClasses) ? this._getClasses() : [this.constructor],
            plug = [],
            unplug = {},
            constructor, i, classPlug, classUnplug, pluginClassName;

        // TODO: Room for optimization. Can we apply statically/unplug in same pass?
        _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 32);
for (i = classes.length - 1; i >= 0; i--) {
            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 33);
constructor = classes[i];

            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 35);
classUnplug = constructor._UNPLUG;
            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 36);
if (classUnplug) {
                // subclasses over-write
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 38);
Y.mix(unplug, classUnplug, true);
            }

            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 41);
classPlug = constructor._PLUG;
            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 42);
if (classPlug) {
                // subclasses over-write
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 44);
Y.mix(plug, classPlug, true);
            }
        }

        _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 48);
for (pluginClassName in plug) {
            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 49);
if (plug.hasOwnProperty(pluginClassName)) {
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 50);
if (!unplug[pluginClassName]) {
                    _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 51);
this.plug(plug[pluginClassName]);
                }
            }
        }

        // User Configuration
        _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 57);
if (config && config.plugins) {
            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 58);
this.plug(config.plugins);
        }
    };
    
    /**
     * Registers plugins to be instantiated at the class level (plugins 
     * which should be plugged into every instance of the class by default).
     *
     * @method plug
     * @static
     *
     * @param {Function} hostClass The host class on which to register the plugins
     * @param {Function | Array} plugin Either the plugin class, an array of plugin classes or an array of objects (with fn and cfg properties defined)
     * @param {Object} config (Optional) If plugin is the plugin class, the configuration for the plugin
     * @for Plugin.Host
     */
    _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 74);
PluginHost.plug = function(hostClass, plugin, config) {
        // Cannot plug into Base, since Plugins derive from Base [ will cause infinite recurrsion ]
        _yuitest_coverfunc("build/pluginhost-config/pluginhost-config.js", "plug", 74);
_yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 76);
var p, i, l, name;
    
        _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 78);
if (hostClass !== Y.Base) {
            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 79);
hostClass._PLUG = hostClass._PLUG || {};
    
            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 81);
if (!L.isArray(plugin)) {
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 82);
if (config) {
                    _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 83);
plugin = {fn:plugin, cfg:config};
                }
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 85);
plugin = [plugin];
            }
    
            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 88);
for (i = 0, l = plugin.length; i < l;i++) {
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 89);
p = plugin[i];
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 90);
name = p.NAME || p.fn.NAME;
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 91);
hostClass._PLUG[name] = p;
            }
        }
    };

    /**
     * Unregisters any class level plugins which have been registered by the host class, or any
     * other class in the hierarchy.
     *
     * @method unplug
     * @static
     *
     * @param {Function} hostClass The host class from which to unregister the plugins
     * @param {Function | Array} plugin The plugin class, or an array of plugin classes
     * @for Plugin.Host
     */
    _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 107);
PluginHost.unplug = function(hostClass, plugin) {
        _yuitest_coverfunc("build/pluginhost-config/pluginhost-config.js", "unplug", 107);
_yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 108);
var p, i, l, name;
    
        _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 110);
if (hostClass !== Y.Base) {
            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 111);
hostClass._UNPLUG = hostClass._UNPLUG || {};
    
            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 113);
if (!L.isArray(plugin)) {
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 114);
plugin = [plugin];
            }
    
            _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 117);
for (i = 0, l = plugin.length; i < l; i++) {
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 118);
p = plugin[i];
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 119);
name = p.NAME;
                _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 120);
if (!hostClass._PLUG[name]) {
                    _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 121);
hostClass._UNPLUG[name] = p;
                } else {
                    _yuitest_coverline("build/pluginhost-config/pluginhost-config.js", 123);
delete hostClass._PLUG[name];
                }
            }
        }
    };


}, '3.7.3', {"requires": ["pluginhost-base"]});
