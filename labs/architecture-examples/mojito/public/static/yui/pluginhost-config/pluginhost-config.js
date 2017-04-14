/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('pluginhost-config', function (Y, NAME) {

    /**
     * Adds pluginhost constructor configuration and static configuration support
     * @submodule pluginhost-config
     */

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
    PluginHost.prototype._initConfigPlugins = function(config) {

        // Class Configuration
        var classes = (this._getClasses) ? this._getClasses() : [this.constructor],
            plug = [],
            unplug = {},
            constructor, i, classPlug, classUnplug, pluginClassName;

        // TODO: Room for optimization. Can we apply statically/unplug in same pass?
        for (i = classes.length - 1; i >= 0; i--) {
            constructor = classes[i];

            classUnplug = constructor._UNPLUG;
            if (classUnplug) {
                // subclasses over-write
                Y.mix(unplug, classUnplug, true);
            }

            classPlug = constructor._PLUG;
            if (classPlug) {
                // subclasses over-write
                Y.mix(plug, classPlug, true);
            }
        }

        for (pluginClassName in plug) {
            if (plug.hasOwnProperty(pluginClassName)) {
                if (!unplug[pluginClassName]) {
                    this.plug(plug[pluginClassName]);
                }
            }
        }

        // User Configuration
        if (config && config.plugins) {
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
    PluginHost.plug = function(hostClass, plugin, config) {
        // Cannot plug into Base, since Plugins derive from Base [ will cause infinite recurrsion ]
        var p, i, l, name;
    
        if (hostClass !== Y.Base) {
            hostClass._PLUG = hostClass._PLUG || {};
    
            if (!L.isArray(plugin)) {
                if (config) {
                    plugin = {fn:plugin, cfg:config};
                }
                plugin = [plugin];
            }
    
            for (i = 0, l = plugin.length; i < l;i++) {
                p = plugin[i];
                name = p.NAME || p.fn.NAME;
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
    PluginHost.unplug = function(hostClass, plugin) {
        var p, i, l, name;
    
        if (hostClass !== Y.Base) {
            hostClass._UNPLUG = hostClass._UNPLUG || {};
    
            if (!L.isArray(plugin)) {
                plugin = [plugin];
            }
    
            for (i = 0, l = plugin.length; i < l; i++) {
                p = plugin[i];
                name = p.NAME;
                if (!hostClass._PLUG[name]) {
                    hostClass._UNPLUG[name] = p;
                } else {
                    delete hostClass._PLUG[name];
                }
            }
        }
    };


}, '3.7.3', {"requires": ["pluginhost-base"]});
