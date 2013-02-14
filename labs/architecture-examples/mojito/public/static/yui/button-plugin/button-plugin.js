/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('button-plugin', function (Y, NAME) {

/**
* A Button Plugin
*
* @module button-plugin
* @since 3.5.0
*/

/**
* @class ButtonPlugin
* @param config {Object} Configuration object
* @constructor
*/
function ButtonPlugin(config) {
    ButtonPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(ButtonPlugin, Y.ButtonCore, {
    
    /**
    * @method _afterNodeGet
    * @param name {string}
    * @private
    */
    _afterNodeGet: function (name) {
        // TODO: point to method (_uiSetLabel, etc) instead of getter/setter
        var ATTRS = this.constructor.ATTRS,
            fn = ATTRS[name] && ATTRS[name].getter && this[ATTRS[name].getter];
            
        if (fn) {
            return new Y.Do.AlterReturn('get ' + name, fn.call(this));
        }
    },

    /**
    * @method _afterNodeSet
    * @param name {String}
    * @param val {String}
    * @private
    */
    _afterNodeSet: function (name, val) {
        var ATTRS = this.constructor.ATTRS,
            fn = ATTRS[name] && ATTRS[name].setter && this[ATTRS[name].setter];
            
        if (fn) {
            fn.call(this, val);
        }
    },

    /**
    * @method _initNode
    * @param config {Object}
    * @private
    */
    _initNode: function(config) {
        var node = config.host;
        this._host = node;
        
        Y.Do.after(this._afterNodeGet, node, 'get', this);
        Y.Do.after(this._afterNodeSet, node, 'set', this);
    },

    /**
    * @method destroy
    * @private
    */
    destroy: function(){
        // Nothing to do, but things are happier with it here
    }
    
}, {
    
    /**
    * Attribute configuration.
    *
    * @property ATTRS
    * @type {Object}
    * @private
    * @static
    */
    ATTRS: Y.merge(Y.ButtonCore.ATTRS),
    
    /**
    * Name of this component.
    *
    * @property NAME
    * @type String
    * @static
    */
    NAME: 'buttonPlugin',
    
    /**
    * Namespace of this component.
    *
    * @property NS
    * @type String
    * @static
    */
    NS: 'button'
    
});

/**
* @method createNode
* @description A factory that plugs a Y.Node instance with Y.Plugin.Button
* @param node {Object}
* @param config {Object}
* @returns {Object} A plugged Y.Node instance
* @public
*/
ButtonPlugin.createNode = function(node, config) {
    var template;

    if (node && !config) {
        if (! (node.nodeType || node.getDOMNode || typeof node == 'string')) {
            config = node;
            node = config.srcNode;
        }
    }

    config   = config || {};
    template = config.template || Y.Plugin.Button.prototype.TEMPLATE;
    node     = node || config.srcNode || Y.DOM.create(template);

    return Y.one(node).plug(Y.Plugin.Button, config);
};

Y.namespace('Plugin').Button = ButtonPlugin;


}, '3.7.3', {"requires": ["button-core", "cssbutton", "node-pluginhost"]});
