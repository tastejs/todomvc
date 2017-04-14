/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
Y.Node.plug = function() {
    var args = Y.Array(arguments);
    args.unshift(Y.Node);
    Y.Plugin.Host.plug.apply(Y.Base, args);
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
Y.Node.unplug = function() {
    var args = Y.Array(arguments);
    args.unshift(Y.Node);
    Y.Plugin.Host.unplug.apply(Y.Base, args);
    return Y.Node;
};

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
Y.NodeList.prototype.plug = function() {
    var args = arguments;
    Y.NodeList.each(this, function(node) {
        Y.Node.prototype.plug.apply(Y.one(node), args);
    });
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
Y.NodeList.prototype.unplug = function() {
    var args = arguments;
    Y.NodeList.each(this, function(node) {
        Y.Node.prototype.unplug.apply(Y.one(node), args);
    });
    return this;
};


}, '3.7.3', {"requires": ["node-base", "pluginhost"]});
