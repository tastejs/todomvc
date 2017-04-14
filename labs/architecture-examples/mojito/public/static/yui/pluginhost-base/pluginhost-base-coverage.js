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
_yuitest_coverage["build/pluginhost-base/pluginhost-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/pluginhost-base/pluginhost-base.js",
    code: []
};
_yuitest_coverage["build/pluginhost-base/pluginhost-base.js"].code=["YUI.add('pluginhost-base', function (Y, NAME) {","","    /**","     * Provides the augmentable PluginHost interface, which can be added to any class.","     * @module pluginhost","     */","","    /**","     * Provides the augmentable PluginHost interface, which can be added to any class.","     * @module pluginhost-base","     */","","    /**","     * <p>","     * An augmentable class, which provides the augmented class with the ability to host plugins.","     * It adds <a href=\"#method_plug\">plug</a> and <a href=\"#method_unplug\">unplug</a> methods to the augmented class, which can ","     * be used to add or remove plugins from instances of the class.","     * </p>","     *","     * <p>Plugins can also be added through the constructor configuration object passed to the host class' constructor using","     * the \"plugins\" property. Supported values for the \"plugins\" property are those defined by the <a href=\"#method_plug\">plug</a> method. ","     * ","     * For example the following code would add the AnimPlugin and IOPlugin to Overlay (the plugin host):","     * <xmp>","     * var o = new Overlay({plugins: [ AnimPlugin, {fn:IOPlugin, cfg:{section:\"header\"}}]});","     * </xmp>","     * </p>","     * <p>","     * Plug.Host's protected <a href=\"#method_initPlugins\">_initPlugins</a> and <a href=\"#method_destroyPlugins\">_destroyPlugins</a> ","     * methods should be invoked by the host class at the appropriate point in the host's lifecyle.  ","     * </p>","     *","     * @class Plugin.Host","     */","","    var L = Y.Lang;","","    function PluginHost() {","        this._plugins = {};","    }","","    PluginHost.prototype = {","","        /**","         * Adds a plugin to the host object. This will instantiate the ","         * plugin and attach it to the configured namespace on the host object.","         *","         * @method plug","         * @chainable","         * @param P {Function | Object |Array} Accepts the plugin class, or an ","         * object with a \"fn\" property specifying the plugin class and ","         * a \"cfg\" property specifying the configuration for the Plugin.","         * <p>","         * Additionally an Array can also be passed in, with the above function or ","         * object values, allowing the user to add multiple plugins in a single call.","         * </p>","         * @param config (Optional) If the first argument is the plugin class, the second argument","         * can be the configuration for the plugin.","         * @return {Base} A reference to the host object","         */","        plug: function(Plugin, config) {","            var i, ln, ns;","","            if (L.isArray(Plugin)) {","                for (i = 0, ln = Plugin.length; i < ln; i++) {","                    this.plug(Plugin[i]);","                }","            } else {","                if (Plugin && !L.isFunction(Plugin)) {","                    config = Plugin.cfg;","                    Plugin = Plugin.fn;","                }","","                // Plugin should be fn by now","                if (Plugin && Plugin.NS) {","                    ns = Plugin.NS;","        ","                    config = config || {};","                    config.host = this;","        ","                    if (this.hasPlugin(ns)) {","                        // Update config","                        if (this[ns].setAttrs) {","                            this[ns].setAttrs(config);","                        }","                    } else {","                        // Create new instance","                        this[ns] = new Plugin(config);","                        this._plugins[ns] = Plugin;","                    }","                }","            }","            return this;","        },","","        /**","         * Removes a plugin from the host object. This will destroy the ","         * plugin instance and delete the namespace from the host object. ","         *","         * @method unplug","         * @param {String | Function} plugin The namespace of the plugin, or the plugin class with the static NS namespace property defined. If not provided,","         * all registered plugins are unplugged.","         * @return {Base} A reference to the host object","         * @chainable","         */","        unplug: function(plugin) {","            var ns = plugin, ","                plugins = this._plugins;","            ","            if (plugin) {","                if (L.isFunction(plugin)) {","                    ns = plugin.NS;","                    if (ns && (!plugins[ns] || plugins[ns] !== plugin)) {","                        ns = null;","                    }","                }","        ","                if (ns) {","                    if (this[ns]) {","                        if (this[ns].destroy) {","                            this[ns].destroy();","                        }","                        delete this[ns];","                    }","                    if (plugins[ns]) {","                        delete plugins[ns];","                    }","                }","            } else {","                for (ns in this._plugins) {","                    if (this._plugins.hasOwnProperty(ns)) {","                        this.unplug(ns);","                    }","                }","            }","            return this;","        },","","        /**","         * Determines if a plugin has plugged into this host.","         *","         * @method hasPlugin","         * @param {String} ns The plugin's namespace","         * @return {Plugin} Returns a truthy value (the plugin instance) if present, or undefined if not.","         */","        hasPlugin : function(ns) {","            return (this._plugins[ns] && this[ns]);","        },","","        /**","         * Initializes static plugins registered on the host (using the","         * Base.plug static method) and any plugins passed to the ","         * instance through the \"plugins\" configuration property.","         *","         * @method _initPlugins","         * @param {Config} config The configuration object with property name/value pairs.","         * @private","         */","        ","        _initPlugins: function(config) {","            this._plugins = this._plugins || {};","","            if (this._initConfigPlugins) {","                this._initConfigPlugins(config);","            }","        },","","        /**","         * Unplugs and destroys all plugins on the host","         * @method _destroyPlugins","         * @private","         */","        _destroyPlugins: function() {","            this.unplug();","        }","    };","","    Y.namespace(\"Plugin\").Host = PluginHost;","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/pluginhost-base/pluginhost-base.js"].lines = {"1":0,"36":0,"38":0,"39":0,"42":0,"62":0,"64":0,"65":0,"66":0,"69":0,"70":0,"71":0,"75":0,"76":0,"78":0,"79":0,"81":0,"83":0,"84":0,"88":0,"89":0,"93":0,"107":0,"110":0,"111":0,"112":0,"113":0,"114":0,"118":0,"119":0,"120":0,"121":0,"123":0,"125":0,"126":0,"130":0,"131":0,"132":0,"136":0,"147":0,"161":0,"163":0,"164":0,"174":0,"178":0};
_yuitest_coverage["build/pluginhost-base/pluginhost-base.js"].functions = {"PluginHost:38":0,"plug:61":0,"unplug:106":0,"hasPlugin:146":0,"_initPlugins:160":0,"_destroyPlugins:173":0,"(anonymous 1):1":0};
_yuitest_coverage["build/pluginhost-base/pluginhost-base.js"].coveredLines = 45;
_yuitest_coverage["build/pluginhost-base/pluginhost-base.js"].coveredFunctions = 7;
_yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 1);
YUI.add('pluginhost-base', function (Y, NAME) {

    /**
     * Provides the augmentable PluginHost interface, which can be added to any class.
     * @module pluginhost
     */

    /**
     * Provides the augmentable PluginHost interface, which can be added to any class.
     * @module pluginhost-base
     */

    /**
     * <p>
     * An augmentable class, which provides the augmented class with the ability to host plugins.
     * It adds <a href="#method_plug">plug</a> and <a href="#method_unplug">unplug</a> methods to the augmented class, which can 
     * be used to add or remove plugins from instances of the class.
     * </p>
     *
     * <p>Plugins can also be added through the constructor configuration object passed to the host class' constructor using
     * the "plugins" property. Supported values for the "plugins" property are those defined by the <a href="#method_plug">plug</a> method. 
     * 
     * For example the following code would add the AnimPlugin and IOPlugin to Overlay (the plugin host):
     * <xmp>
     * var o = new Overlay({plugins: [ AnimPlugin, {fn:IOPlugin, cfg:{section:"header"}}]});
     * </xmp>
     * </p>
     * <p>
     * Plug.Host's protected <a href="#method_initPlugins">_initPlugins</a> and <a href="#method_destroyPlugins">_destroyPlugins</a> 
     * methods should be invoked by the host class at the appropriate point in the host's lifecyle.  
     * </p>
     *
     * @class Plugin.Host
     */

    _yuitest_coverfunc("build/pluginhost-base/pluginhost-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 36);
var L = Y.Lang;

    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 38);
function PluginHost() {
        _yuitest_coverfunc("build/pluginhost-base/pluginhost-base.js", "PluginHost", 38);
_yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 39);
this._plugins = {};
    }

    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 42);
PluginHost.prototype = {

        /**
         * Adds a plugin to the host object. This will instantiate the 
         * plugin and attach it to the configured namespace on the host object.
         *
         * @method plug
         * @chainable
         * @param P {Function | Object |Array} Accepts the plugin class, or an 
         * object with a "fn" property specifying the plugin class and 
         * a "cfg" property specifying the configuration for the Plugin.
         * <p>
         * Additionally an Array can also be passed in, with the above function or 
         * object values, allowing the user to add multiple plugins in a single call.
         * </p>
         * @param config (Optional) If the first argument is the plugin class, the second argument
         * can be the configuration for the plugin.
         * @return {Base} A reference to the host object
         */
        plug: function(Plugin, config) {
            _yuitest_coverfunc("build/pluginhost-base/pluginhost-base.js", "plug", 61);
_yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 62);
var i, ln, ns;

            _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 64);
if (L.isArray(Plugin)) {
                _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 65);
for (i = 0, ln = Plugin.length; i < ln; i++) {
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 66);
this.plug(Plugin[i]);
                }
            } else {
                _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 69);
if (Plugin && !L.isFunction(Plugin)) {
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 70);
config = Plugin.cfg;
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 71);
Plugin = Plugin.fn;
                }

                // Plugin should be fn by now
                _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 75);
if (Plugin && Plugin.NS) {
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 76);
ns = Plugin.NS;
        
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 78);
config = config || {};
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 79);
config.host = this;
        
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 81);
if (this.hasPlugin(ns)) {
                        // Update config
                        _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 83);
if (this[ns].setAttrs) {
                            _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 84);
this[ns].setAttrs(config);
                        }
                    } else {
                        // Create new instance
                        _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 88);
this[ns] = new Plugin(config);
                        _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 89);
this._plugins[ns] = Plugin;
                    }
                }
            }
            _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 93);
return this;
        },

        /**
         * Removes a plugin from the host object. This will destroy the 
         * plugin instance and delete the namespace from the host object. 
         *
         * @method unplug
         * @param {String | Function} plugin The namespace of the plugin, or the plugin class with the static NS namespace property defined. If not provided,
         * all registered plugins are unplugged.
         * @return {Base} A reference to the host object
         * @chainable
         */
        unplug: function(plugin) {
            _yuitest_coverfunc("build/pluginhost-base/pluginhost-base.js", "unplug", 106);
_yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 107);
var ns = plugin, 
                plugins = this._plugins;
            
            _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 110);
if (plugin) {
                _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 111);
if (L.isFunction(plugin)) {
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 112);
ns = plugin.NS;
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 113);
if (ns && (!plugins[ns] || plugins[ns] !== plugin)) {
                        _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 114);
ns = null;
                    }
                }
        
                _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 118);
if (ns) {
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 119);
if (this[ns]) {
                        _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 120);
if (this[ns].destroy) {
                            _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 121);
this[ns].destroy();
                        }
                        _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 123);
delete this[ns];
                    }
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 125);
if (plugins[ns]) {
                        _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 126);
delete plugins[ns];
                    }
                }
            } else {
                _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 130);
for (ns in this._plugins) {
                    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 131);
if (this._plugins.hasOwnProperty(ns)) {
                        _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 132);
this.unplug(ns);
                    }
                }
            }
            _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 136);
return this;
        },

        /**
         * Determines if a plugin has plugged into this host.
         *
         * @method hasPlugin
         * @param {String} ns The plugin's namespace
         * @return {Plugin} Returns a truthy value (the plugin instance) if present, or undefined if not.
         */
        hasPlugin : function(ns) {
            _yuitest_coverfunc("build/pluginhost-base/pluginhost-base.js", "hasPlugin", 146);
_yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 147);
return (this._plugins[ns] && this[ns]);
        },

        /**
         * Initializes static plugins registered on the host (using the
         * Base.plug static method) and any plugins passed to the 
         * instance through the "plugins" configuration property.
         *
         * @method _initPlugins
         * @param {Config} config The configuration object with property name/value pairs.
         * @private
         */
        
        _initPlugins: function(config) {
            _yuitest_coverfunc("build/pluginhost-base/pluginhost-base.js", "_initPlugins", 160);
_yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 161);
this._plugins = this._plugins || {};

            _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 163);
if (this._initConfigPlugins) {
                _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 164);
this._initConfigPlugins(config);
            }
        },

        /**
         * Unplugs and destroys all plugins on the host
         * @method _destroyPlugins
         * @private
         */
        _destroyPlugins: function() {
            _yuitest_coverfunc("build/pluginhost-base/pluginhost-base.js", "_destroyPlugins", 173);
_yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 174);
this.unplug();
        }
    };

    _yuitest_coverline("build/pluginhost-base/pluginhost-base.js", 178);
Y.namespace("Plugin").Host = PluginHost;


}, '3.7.3', {"requires": ["yui-base"]});
