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
_yuitest_coverage["build/plugin/plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/plugin/plugin.js",
    code: []
};
_yuitest_coverage["build/plugin/plugin.js"].code=["YUI.add('plugin', function (Y, NAME) {","","    /**","     * Provides the base Plugin class, which plugin developers should extend, when creating custom plugins","     *","     * @module plugin","     */","","    /**","     * The base class for all Plugin instances.","     *","     * @class Plugin.Base ","     * @extends Base","     * @param {Object} config Configuration object with property name/value pairs.","     */","    function Plugin(config) {","        if (! (this.hasImpl && this.hasImpl(Y.Plugin.Base)) ) {","            Plugin.superclass.constructor.apply(this, arguments);","        } else {","            Plugin.prototype.initializer.apply(this, arguments);","        }","    }","","    /**","     * Object defining the set of attributes supported by the Plugin.Base class","     * ","     * @property ATTRS","     * @type Object","     * @static","     */","    Plugin.ATTRS = {","","        /**","         * The plugin's host object.","         *","         * @attribute host","         * @writeonce","         * @type Plugin.Host","         */","        host : {","            writeOnce: true","        }","    };","","    /**","     * The string identifying the Plugin.Base class. Plugins extending","     * Plugin.Base should set their own NAME value.","     *","     * @property NAME","     * @type String","     * @static","     */","    Plugin.NAME = 'plugin';","","    /**","     * The name of the property the the plugin will be attached to","     * when plugged into a Plugin Host. Plugins extending Plugin.Base,","     * should set their own NS value.","     *","     * @property NS","     * @type String","     * @static","     */","    Plugin.NS = 'plugin';","","    Y.extend(Plugin, Y.Base, {","","        /**","         * The list of event handles for event listeners or AOP injected methods","         * applied by the plugin to the host object.","         *","         * @property _handles","         * @private","         * @type Array","         * @value null","         */","        _handles: null,","","        /**","         * Initializer lifecycle implementation.","         *","         * @method initializer","         * @param {Object} config Configuration object with property name/value pairs.","         */","        initializer : function(config) {","            this._handles = [];","        },","","        /**","         * Destructor lifecycle implementation.","         *","         * Removes any event listeners or injected methods applied by the Plugin","         *","         * @method destructor","         */","        destructor: function() {","            // remove all handles","            if (this._handles) {","                for (var i = 0, l = this._handles.length; i < l; i++) {","                   this._handles[i].detach();","                }","            }","        },","","        /**","         * Listens for the \"on\" moment of events fired by the host, ","         * or injects code \"before\" a given method on the host.","         *","         * @method doBefore","         *","         * @param strMethod {String} The event to listen for, or method to inject logic before.","         * @param fn {Function} The handler function. For events, the \"on\" moment listener. For methods, the function to execute before the given method is executed.","         * @param context {Object} An optional context to call the handler with. The default context is the plugin instance.","         * @return handle {EventHandle} The detach handle for the handler.","         */","        doBefore: function(strMethod, fn, context) {","            var host = this.get(\"host\"), handle;","","            if (strMethod in host) { // method","                handle = this.beforeHostMethod(strMethod, fn, context);","            } else if (host.on) { // event","                handle = this.onHostEvent(strMethod, fn, context);","            }","","            return handle;","        },","","        /**","         * Listens for the \"after\" moment of events fired by the host, ","         * or injects code \"after\" a given method on the host.","         *","         * @method doAfter","         *","         * @param strMethod {String} The event to listen for, or method to inject logic after.","         * @param fn {Function} The handler function. For events, the \"after\" moment listener. For methods, the function to execute after the given method is executed.","         * @param context {Object} An optional context to call the handler with. The default context is the plugin instance.","         * @return handle {EventHandle} The detach handle for the listener.","         */","        doAfter: function(strMethod, fn, context) {","            var host = this.get(\"host\"), handle;","","            if (strMethod in host) { // method","                handle = this.afterHostMethod(strMethod, fn, context);","            } else if (host.after) { // event","                handle = this.afterHostEvent(strMethod, fn, context);","            }","","            return handle;","        },","","        /**","         * Listens for the \"on\" moment of events fired by the host object.","         *","         * Listeners attached through this method will be detached when the plugin is unplugged.","         * ","         * @method onHostEvent","         * @param {String | Object} type The event type.","         * @param {Function} fn The listener.","         * @param {Object} context The execution context. Defaults to the plugin instance.","         * @return handle {EventHandle} The detach handle for the listener. ","         */","        onHostEvent : function(type, fn, context) {","            var handle = this.get(\"host\").on(type, fn, context || this);","            this._handles.push(handle);","            return handle;","        },","","        /**","         * Listens for the \"after\" moment of events fired by the host object.","         *","         * Listeners attached through this method will be detached when the plugin is unplugged.","         * ","         * @method afterHostEvent","         * @param {String | Object} type The event type.","         * @param {Function} fn The listener.","         * @param {Object} context The execution context. Defaults to the plugin instance.","         * @return handle {EventHandle} The detach handle for the listener. ","         */","        afterHostEvent : function(type, fn, context) {","            var handle = this.get(\"host\").after(type, fn, context || this);","            this._handles.push(handle);","            return handle;","        },","","        /**","         * Injects a function to be executed before a given method on host object.","         *","         * The function will be detached when the plugin is unplugged.","         *","         * @method beforeHostMethod","         * @param {String} method The name of the method to inject the function before.","         * @param {Function} fn The function to inject.","         * @param {Object} context The execution context. Defaults to the plugin instance.","         * @return handle {EventHandle} The detach handle for the injected function. ","         */","        beforeHostMethod : function(strMethod, fn, context) {","            var handle = Y.Do.before(fn, this.get(\"host\"), strMethod, context || this);","            this._handles.push(handle);","            return handle;","        },","","        /**","         * Injects a function to be executed after a given method on host object.","         *","         * The function will be detached when the plugin is unplugged.","         *","         * @method afterHostMethod","         * @param {String} method The name of the method to inject the function after.","         * @param {Function} fn The function to inject.","         * @param {Object} context The execution context. Defaults to the plugin instance.","         * @return handle {EventHandle} The detach handle for the injected function. ","         */","        afterHostMethod : function(strMethod, fn, context) {","            var handle = Y.Do.after(fn, this.get(\"host\"), strMethod, context || this);","            this._handles.push(handle);","            return handle;","        },","","        toString: function() {","            return this.constructor.NAME + '[' + this.constructor.NS + ']';","        }","    });","","    Y.namespace(\"Plugin\").Base = Plugin;","","","}, '3.7.3', {\"requires\": [\"base-base\"]});"];
_yuitest_coverage["build/plugin/plugin.js"].lines = {"1":0,"16":0,"17":0,"18":0,"20":0,"31":0,"53":0,"64":0,"66":0,"86":0,"98":0,"99":0,"100":0,"117":0,"119":0,"120":0,"121":0,"122":0,"125":0,"140":0,"142":0,"143":0,"144":0,"145":0,"148":0,"163":0,"164":0,"165":0,"180":0,"181":0,"182":0,"197":0,"198":0,"199":0,"214":0,"215":0,"216":0,"220":0,"224":0};
_yuitest_coverage["build/plugin/plugin.js"].functions = {"Plugin:16":0,"initializer:85":0,"destructor:96":0,"doBefore:116":0,"doAfter:139":0,"onHostEvent:162":0,"afterHostEvent:179":0,"beforeHostMethod:196":0,"afterHostMethod:213":0,"toString:219":0,"(anonymous 1):1":0};
_yuitest_coverage["build/plugin/plugin.js"].coveredLines = 39;
_yuitest_coverage["build/plugin/plugin.js"].coveredFunctions = 11;
_yuitest_coverline("build/plugin/plugin.js", 1);
YUI.add('plugin', function (Y, NAME) {

    /**
     * Provides the base Plugin class, which plugin developers should extend, when creating custom plugins
     *
     * @module plugin
     */

    /**
     * The base class for all Plugin instances.
     *
     * @class Plugin.Base 
     * @extends Base
     * @param {Object} config Configuration object with property name/value pairs.
     */
    _yuitest_coverfunc("build/plugin/plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/plugin/plugin.js", 16);
function Plugin(config) {
        _yuitest_coverfunc("build/plugin/plugin.js", "Plugin", 16);
_yuitest_coverline("build/plugin/plugin.js", 17);
if (! (this.hasImpl && this.hasImpl(Y.Plugin.Base)) ) {
            _yuitest_coverline("build/plugin/plugin.js", 18);
Plugin.superclass.constructor.apply(this, arguments);
        } else {
            _yuitest_coverline("build/plugin/plugin.js", 20);
Plugin.prototype.initializer.apply(this, arguments);
        }
    }

    /**
     * Object defining the set of attributes supported by the Plugin.Base class
     * 
     * @property ATTRS
     * @type Object
     * @static
     */
    _yuitest_coverline("build/plugin/plugin.js", 31);
Plugin.ATTRS = {

        /**
         * The plugin's host object.
         *
         * @attribute host
         * @writeonce
         * @type Plugin.Host
         */
        host : {
            writeOnce: true
        }
    };

    /**
     * The string identifying the Plugin.Base class. Plugins extending
     * Plugin.Base should set their own NAME value.
     *
     * @property NAME
     * @type String
     * @static
     */
    _yuitest_coverline("build/plugin/plugin.js", 53);
Plugin.NAME = 'plugin';

    /**
     * The name of the property the the plugin will be attached to
     * when plugged into a Plugin Host. Plugins extending Plugin.Base,
     * should set their own NS value.
     *
     * @property NS
     * @type String
     * @static
     */
    _yuitest_coverline("build/plugin/plugin.js", 64);
Plugin.NS = 'plugin';

    _yuitest_coverline("build/plugin/plugin.js", 66);
Y.extend(Plugin, Y.Base, {

        /**
         * The list of event handles for event listeners or AOP injected methods
         * applied by the plugin to the host object.
         *
         * @property _handles
         * @private
         * @type Array
         * @value null
         */
        _handles: null,

        /**
         * Initializer lifecycle implementation.
         *
         * @method initializer
         * @param {Object} config Configuration object with property name/value pairs.
         */
        initializer : function(config) {
            _yuitest_coverfunc("build/plugin/plugin.js", "initializer", 85);
_yuitest_coverline("build/plugin/plugin.js", 86);
this._handles = [];
        },

        /**
         * Destructor lifecycle implementation.
         *
         * Removes any event listeners or injected methods applied by the Plugin
         *
         * @method destructor
         */
        destructor: function() {
            // remove all handles
            _yuitest_coverfunc("build/plugin/plugin.js", "destructor", 96);
_yuitest_coverline("build/plugin/plugin.js", 98);
if (this._handles) {
                _yuitest_coverline("build/plugin/plugin.js", 99);
for (var i = 0, l = this._handles.length; i < l; i++) {
                   _yuitest_coverline("build/plugin/plugin.js", 100);
this._handles[i].detach();
                }
            }
        },

        /**
         * Listens for the "on" moment of events fired by the host, 
         * or injects code "before" a given method on the host.
         *
         * @method doBefore
         *
         * @param strMethod {String} The event to listen for, or method to inject logic before.
         * @param fn {Function} The handler function. For events, the "on" moment listener. For methods, the function to execute before the given method is executed.
         * @param context {Object} An optional context to call the handler with. The default context is the plugin instance.
         * @return handle {EventHandle} The detach handle for the handler.
         */
        doBefore: function(strMethod, fn, context) {
            _yuitest_coverfunc("build/plugin/plugin.js", "doBefore", 116);
_yuitest_coverline("build/plugin/plugin.js", 117);
var host = this.get("host"), handle;

            _yuitest_coverline("build/plugin/plugin.js", 119);
if (strMethod in host) { // method
                _yuitest_coverline("build/plugin/plugin.js", 120);
handle = this.beforeHostMethod(strMethod, fn, context);
            } else {_yuitest_coverline("build/plugin/plugin.js", 121);
if (host.on) { // event
                _yuitest_coverline("build/plugin/plugin.js", 122);
handle = this.onHostEvent(strMethod, fn, context);
            }}

            _yuitest_coverline("build/plugin/plugin.js", 125);
return handle;
        },

        /**
         * Listens for the "after" moment of events fired by the host, 
         * or injects code "after" a given method on the host.
         *
         * @method doAfter
         *
         * @param strMethod {String} The event to listen for, or method to inject logic after.
         * @param fn {Function} The handler function. For events, the "after" moment listener. For methods, the function to execute after the given method is executed.
         * @param context {Object} An optional context to call the handler with. The default context is the plugin instance.
         * @return handle {EventHandle} The detach handle for the listener.
         */
        doAfter: function(strMethod, fn, context) {
            _yuitest_coverfunc("build/plugin/plugin.js", "doAfter", 139);
_yuitest_coverline("build/plugin/plugin.js", 140);
var host = this.get("host"), handle;

            _yuitest_coverline("build/plugin/plugin.js", 142);
if (strMethod in host) { // method
                _yuitest_coverline("build/plugin/plugin.js", 143);
handle = this.afterHostMethod(strMethod, fn, context);
            } else {_yuitest_coverline("build/plugin/plugin.js", 144);
if (host.after) { // event
                _yuitest_coverline("build/plugin/plugin.js", 145);
handle = this.afterHostEvent(strMethod, fn, context);
            }}

            _yuitest_coverline("build/plugin/plugin.js", 148);
return handle;
        },

        /**
         * Listens for the "on" moment of events fired by the host object.
         *
         * Listeners attached through this method will be detached when the plugin is unplugged.
         * 
         * @method onHostEvent
         * @param {String | Object} type The event type.
         * @param {Function} fn The listener.
         * @param {Object} context The execution context. Defaults to the plugin instance.
         * @return handle {EventHandle} The detach handle for the listener. 
         */
        onHostEvent : function(type, fn, context) {
            _yuitest_coverfunc("build/plugin/plugin.js", "onHostEvent", 162);
_yuitest_coverline("build/plugin/plugin.js", 163);
var handle = this.get("host").on(type, fn, context || this);
            _yuitest_coverline("build/plugin/plugin.js", 164);
this._handles.push(handle);
            _yuitest_coverline("build/plugin/plugin.js", 165);
return handle;
        },

        /**
         * Listens for the "after" moment of events fired by the host object.
         *
         * Listeners attached through this method will be detached when the plugin is unplugged.
         * 
         * @method afterHostEvent
         * @param {String | Object} type The event type.
         * @param {Function} fn The listener.
         * @param {Object} context The execution context. Defaults to the plugin instance.
         * @return handle {EventHandle} The detach handle for the listener. 
         */
        afterHostEvent : function(type, fn, context) {
            _yuitest_coverfunc("build/plugin/plugin.js", "afterHostEvent", 179);
_yuitest_coverline("build/plugin/plugin.js", 180);
var handle = this.get("host").after(type, fn, context || this);
            _yuitest_coverline("build/plugin/plugin.js", 181);
this._handles.push(handle);
            _yuitest_coverline("build/plugin/plugin.js", 182);
return handle;
        },

        /**
         * Injects a function to be executed before a given method on host object.
         *
         * The function will be detached when the plugin is unplugged.
         *
         * @method beforeHostMethod
         * @param {String} method The name of the method to inject the function before.
         * @param {Function} fn The function to inject.
         * @param {Object} context The execution context. Defaults to the plugin instance.
         * @return handle {EventHandle} The detach handle for the injected function. 
         */
        beforeHostMethod : function(strMethod, fn, context) {
            _yuitest_coverfunc("build/plugin/plugin.js", "beforeHostMethod", 196);
_yuitest_coverline("build/plugin/plugin.js", 197);
var handle = Y.Do.before(fn, this.get("host"), strMethod, context || this);
            _yuitest_coverline("build/plugin/plugin.js", 198);
this._handles.push(handle);
            _yuitest_coverline("build/plugin/plugin.js", 199);
return handle;
        },

        /**
         * Injects a function to be executed after a given method on host object.
         *
         * The function will be detached when the plugin is unplugged.
         *
         * @method afterHostMethod
         * @param {String} method The name of the method to inject the function after.
         * @param {Function} fn The function to inject.
         * @param {Object} context The execution context. Defaults to the plugin instance.
         * @return handle {EventHandle} The detach handle for the injected function. 
         */
        afterHostMethod : function(strMethod, fn, context) {
            _yuitest_coverfunc("build/plugin/plugin.js", "afterHostMethod", 213);
_yuitest_coverline("build/plugin/plugin.js", 214);
var handle = Y.Do.after(fn, this.get("host"), strMethod, context || this);
            _yuitest_coverline("build/plugin/plugin.js", 215);
this._handles.push(handle);
            _yuitest_coverline("build/plugin/plugin.js", 216);
return handle;
        },

        toString: function() {
            _yuitest_coverfunc("build/plugin/plugin.js", "toString", 219);
_yuitest_coverline("build/plugin/plugin.js", 220);
return this.constructor.NAME + '[' + this.constructor.NS + ']';
        }
    });

    _yuitest_coverline("build/plugin/plugin.js", 224);
Y.namespace("Plugin").Base = Plugin;


}, '3.7.3', {"requires": ["base-base"]});
