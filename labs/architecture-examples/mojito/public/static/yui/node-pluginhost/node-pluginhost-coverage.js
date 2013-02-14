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
_yuitest_coverage["build/node-pluginhost/node-pluginhost.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/node-pluginhost/node-pluginhost.js",
    code: []
};
_yuitest_coverage["build/node-pluginhost/node-pluginhost.js"].code=["YUI.add('node-pluginhost', function (Y, NAME) {","","/**"," * @module node"," * @submodule node-pluginhost"," */","","/**"," * Registers plugins to be instantiated at the class level (plugins"," * which should be plugged into every instance of Node by default)."," *"," * @method plug"," * @static"," * @for Node"," * @param {Function | Array} plugin Either the plugin class, an array of plugin classes or an array of objects (with fn and cfg properties defined)"," * @param {Object} config (Optional) If plugin is the plugin class, the configuration for the plugin"," */","Y.Node.plug = function() {","    var args = Y.Array(arguments);","    args.unshift(Y.Node);","    Y.Plugin.Host.plug.apply(Y.Base, args);","    return Y.Node;","};","","/**"," * Unregisters any class level plugins which have been registered by the Node"," *"," * @method unplug"," * @static"," *"," * @param {Function | Array} plugin The plugin class, or an array of plugin classes"," */","Y.Node.unplug = function() {","    var args = Y.Array(arguments);","    args.unshift(Y.Node);","    Y.Plugin.Host.unplug.apply(Y.Base, args);","    return Y.Node;","};","","Y.mix(Y.Node, Y.Plugin.Host, false, null, 1);","","// allow batching of plug/unplug via NodeList","// doesn't use NodeList.importMethod because we need real Nodes (not tmpNode)","/**"," * Adds a plugin to each node in the NodeList."," * This will instantiate the plugin and attach it to the configured namespace on each node"," * @method plug"," * @for NodeList"," * @param P {Function | Object |Array} Accepts the plugin class, or an "," * object with a \"fn\" property specifying the plugin class and "," * a \"cfg\" property specifying the configuration for the Plugin."," * <p>"," * Additionally an Array can also be passed in, with the above function or "," * object values, allowing the user to add multiple plugins in a single call."," * </p>"," * @param config (Optional) If the first argument is the plugin class, the second argument"," * can be the configuration for the plugin."," * @chainable"," */","Y.NodeList.prototype.plug = function() {","    var args = arguments;","    Y.NodeList.each(this, function(node) {","        Y.Node.prototype.plug.apply(Y.one(node), args);","    });","    return this;","};","","/**"," * Removes a plugin from all nodes in the NodeList. This will destroy the "," * plugin instance and delete the namespace each node. "," * @method unplug"," * @for NodeList"," * @param {String | Function} plugin The namespace of the plugin, or the plugin class with the static NS namespace property defined. If not provided,"," * all registered plugins are unplugged."," * @chainable"," */","Y.NodeList.prototype.unplug = function() {","    var args = arguments;","    Y.NodeList.each(this, function(node) {","        Y.Node.prototype.unplug.apply(Y.one(node), args);","    });","    return this;","};","","","}, '3.7.3', {\"requires\": [\"node-base\", \"pluginhost\"]});"];
_yuitest_coverage["build/node-pluginhost/node-pluginhost.js"].lines = {"1":0,"18":0,"19":0,"20":0,"21":0,"22":0,"33":0,"34":0,"35":0,"36":0,"37":0,"40":0,"60":0,"61":0,"62":0,"63":0,"65":0,"77":0,"78":0,"79":0,"80":0,"82":0};
_yuitest_coverage["build/node-pluginhost/node-pluginhost.js"].functions = {"plug:18":0,"unplug:33":0,"(anonymous 2):62":0,"plug:60":0,"(anonymous 3):79":0,"unplug:77":0,"(anonymous 1):1":0};
_yuitest_coverage["build/node-pluginhost/node-pluginhost.js"].coveredLines = 22;
_yuitest_coverage["build/node-pluginhost/node-pluginhost.js"].coveredFunctions = 7;
_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 1);
YUI.add('node-pluginhost', function (Y, NAME) {

/**
 * @module node
 * @submodule node-pluginhost
 */

/**
 * Registers plugins to be instantiated at the class level (plugins
 * which should be plugged into every instance of Node by default).
 *
 * @method plug
 * @static
 * @for Node
 * @param {Function | Array} plugin Either the plugin class, an array of plugin classes or an array of objects (with fn and cfg properties defined)
 * @param {Object} config (Optional) If plugin is the plugin class, the configuration for the plugin
 */
_yuitest_coverfunc("build/node-pluginhost/node-pluginhost.js", "(anonymous 1)", 1);
_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 18);
Y.Node.plug = function() {
    _yuitest_coverfunc("build/node-pluginhost/node-pluginhost.js", "plug", 18);
_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 19);
var args = Y.Array(arguments);
    _yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 20);
args.unshift(Y.Node);
    _yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 21);
Y.Plugin.Host.plug.apply(Y.Base, args);
    _yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 22);
return Y.Node;
};

/**
 * Unregisters any class level plugins which have been registered by the Node
 *
 * @method unplug
 * @static
 *
 * @param {Function | Array} plugin The plugin class, or an array of plugin classes
 */
_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 33);
Y.Node.unplug = function() {
    _yuitest_coverfunc("build/node-pluginhost/node-pluginhost.js", "unplug", 33);
_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 34);
var args = Y.Array(arguments);
    _yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 35);
args.unshift(Y.Node);
    _yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 36);
Y.Plugin.Host.unplug.apply(Y.Base, args);
    _yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 37);
return Y.Node;
};

_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 40);
Y.mix(Y.Node, Y.Plugin.Host, false, null, 1);

// allow batching of plug/unplug via NodeList
// doesn't use NodeList.importMethod because we need real Nodes (not tmpNode)
/**
 * Adds a plugin to each node in the NodeList.
 * This will instantiate the plugin and attach it to the configured namespace on each node
 * @method plug
 * @for NodeList
 * @param P {Function | Object |Array} Accepts the plugin class, or an 
 * object with a "fn" property specifying the plugin class and 
 * a "cfg" property specifying the configuration for the Plugin.
 * <p>
 * Additionally an Array can also be passed in, with the above function or 
 * object values, allowing the user to add multiple plugins in a single call.
 * </p>
 * @param config (Optional) If the first argument is the plugin class, the second argument
 * can be the configuration for the plugin.
 * @chainable
 */
_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 60);
Y.NodeList.prototype.plug = function() {
    _yuitest_coverfunc("build/node-pluginhost/node-pluginhost.js", "plug", 60);
_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 61);
var args = arguments;
    _yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 62);
Y.NodeList.each(this, function(node) {
        _yuitest_coverfunc("build/node-pluginhost/node-pluginhost.js", "(anonymous 2)", 62);
_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 63);
Y.Node.prototype.plug.apply(Y.one(node), args);
    });
    _yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 65);
return this;
};

/**
 * Removes a plugin from all nodes in the NodeList. This will destroy the 
 * plugin instance and delete the namespace each node. 
 * @method unplug
 * @for NodeList
 * @param {String | Function} plugin The namespace of the plugin, or the plugin class with the static NS namespace property defined. If not provided,
 * all registered plugins are unplugged.
 * @chainable
 */
_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 77);
Y.NodeList.prototype.unplug = function() {
    _yuitest_coverfunc("build/node-pluginhost/node-pluginhost.js", "unplug", 77);
_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 78);
var args = arguments;
    _yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 79);
Y.NodeList.each(this, function(node) {
        _yuitest_coverfunc("build/node-pluginhost/node-pluginhost.js", "(anonymous 3)", 79);
_yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 80);
Y.Node.prototype.unplug.apply(Y.one(node), args);
    });
    _yuitest_coverline("build/node-pluginhost/node-pluginhost.js", 82);
return this;
};


}, '3.7.3', {"requires": ["node-base", "pluginhost"]});
