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
_yuitest_coverage["build/button-plugin/button-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/button-plugin/button-plugin.js",
    code: []
};
_yuitest_coverage["build/button-plugin/button-plugin.js"].code=["YUI.add('button-plugin', function (Y, NAME) {","","/**","* A Button Plugin","*","* @module button-plugin","* @since 3.5.0","*/","","/**","* @class ButtonPlugin","* @param config {Object} Configuration object","* @constructor","*/","function ButtonPlugin(config) {","    ButtonPlugin.superclass.constructor.apply(this, arguments);","}","","Y.extend(ButtonPlugin, Y.ButtonCore, {","    ","    /**","    * @method _afterNodeGet","    * @param name {string}","    * @private","    */","    _afterNodeGet: function (name) {","        // TODO: point to method (_uiSetLabel, etc) instead of getter/setter","        var ATTRS = this.constructor.ATTRS,","            fn = ATTRS[name] && ATTRS[name].getter && this[ATTRS[name].getter];","            ","        if (fn) {","            return new Y.Do.AlterReturn('get ' + name, fn.call(this));","        }","    },","","    /**","    * @method _afterNodeSet","    * @param name {String}","    * @param val {String}","    * @private","    */","    _afterNodeSet: function (name, val) {","        var ATTRS = this.constructor.ATTRS,","            fn = ATTRS[name] && ATTRS[name].setter && this[ATTRS[name].setter];","            ","        if (fn) {","            fn.call(this, val);","        }","    },","","    /**","    * @method _initNode","    * @param config {Object}","    * @private","    */","    _initNode: function(config) {","        var node = config.host;","        this._host = node;","        ","        Y.Do.after(this._afterNodeGet, node, 'get', this);","        Y.Do.after(this._afterNodeSet, node, 'set', this);","    },","","    /**","    * @method destroy","    * @private","    */","    destroy: function(){","        // Nothing to do, but things are happier with it here","    }","    ","}, {","    ","    /**","    * Attribute configuration.","    *","    * @property ATTRS","    * @type {Object}","    * @private","    * @static","    */","    ATTRS: Y.merge(Y.ButtonCore.ATTRS),","    ","    /**","    * Name of this component.","    *","    * @property NAME","    * @type String","    * @static","    */","    NAME: 'buttonPlugin',","    ","    /**","    * Namespace of this component.","    *","    * @property NS","    * @type String","    * @static","    */","    NS: 'button'","    ","});","","/**","* @method createNode","* @description A factory that plugs a Y.Node instance with Y.Plugin.Button","* @param node {Object}","* @param config {Object}","* @returns {Object} A plugged Y.Node instance","* @public","*/","ButtonPlugin.createNode = function(node, config) {","    var template;","","    if (node && !config) {","        if (! (node.nodeType || node.getDOMNode || typeof node == 'string')) {","            config = node;","            node = config.srcNode;","        }","    }","","    config   = config || {};","    template = config.template || Y.Plugin.Button.prototype.TEMPLATE;","    node     = node || config.srcNode || Y.DOM.create(template);","","    return Y.one(node).plug(Y.Plugin.Button, config);","};","","Y.namespace('Plugin').Button = ButtonPlugin;","","","}, '3.7.3', {\"requires\": [\"button-core\", \"cssbutton\", \"node-pluginhost\"]});"];
_yuitest_coverage["build/button-plugin/button-plugin.js"].lines = {"1":0,"15":0,"16":0,"19":0,"28":0,"31":0,"32":0,"43":0,"46":0,"47":0,"57":0,"58":0,"60":0,"61":0,"112":0,"113":0,"115":0,"116":0,"117":0,"118":0,"122":0,"123":0,"124":0,"126":0,"129":0};
_yuitest_coverage["build/button-plugin/button-plugin.js"].functions = {"ButtonPlugin:15":0,"_afterNodeGet:26":0,"_afterNodeSet:42":0,"_initNode:56":0,"createNode:112":0,"(anonymous 1):1":0};
_yuitest_coverage["build/button-plugin/button-plugin.js"].coveredLines = 25;
_yuitest_coverage["build/button-plugin/button-plugin.js"].coveredFunctions = 6;
_yuitest_coverline("build/button-plugin/button-plugin.js", 1);
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
_yuitest_coverfunc("build/button-plugin/button-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/button-plugin/button-plugin.js", 15);
function ButtonPlugin(config) {
    _yuitest_coverfunc("build/button-plugin/button-plugin.js", "ButtonPlugin", 15);
_yuitest_coverline("build/button-plugin/button-plugin.js", 16);
ButtonPlugin.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/button-plugin/button-plugin.js", 19);
Y.extend(ButtonPlugin, Y.ButtonCore, {
    
    /**
    * @method _afterNodeGet
    * @param name {string}
    * @private
    */
    _afterNodeGet: function (name) {
        // TODO: point to method (_uiSetLabel, etc) instead of getter/setter
        _yuitest_coverfunc("build/button-plugin/button-plugin.js", "_afterNodeGet", 26);
_yuitest_coverline("build/button-plugin/button-plugin.js", 28);
var ATTRS = this.constructor.ATTRS,
            fn = ATTRS[name] && ATTRS[name].getter && this[ATTRS[name].getter];
            
        _yuitest_coverline("build/button-plugin/button-plugin.js", 31);
if (fn) {
            _yuitest_coverline("build/button-plugin/button-plugin.js", 32);
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
        _yuitest_coverfunc("build/button-plugin/button-plugin.js", "_afterNodeSet", 42);
_yuitest_coverline("build/button-plugin/button-plugin.js", 43);
var ATTRS = this.constructor.ATTRS,
            fn = ATTRS[name] && ATTRS[name].setter && this[ATTRS[name].setter];
            
        _yuitest_coverline("build/button-plugin/button-plugin.js", 46);
if (fn) {
            _yuitest_coverline("build/button-plugin/button-plugin.js", 47);
fn.call(this, val);
        }
    },

    /**
    * @method _initNode
    * @param config {Object}
    * @private
    */
    _initNode: function(config) {
        _yuitest_coverfunc("build/button-plugin/button-plugin.js", "_initNode", 56);
_yuitest_coverline("build/button-plugin/button-plugin.js", 57);
var node = config.host;
        _yuitest_coverline("build/button-plugin/button-plugin.js", 58);
this._host = node;
        
        _yuitest_coverline("build/button-plugin/button-plugin.js", 60);
Y.Do.after(this._afterNodeGet, node, 'get', this);
        _yuitest_coverline("build/button-plugin/button-plugin.js", 61);
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
_yuitest_coverline("build/button-plugin/button-plugin.js", 112);
ButtonPlugin.createNode = function(node, config) {
    _yuitest_coverfunc("build/button-plugin/button-plugin.js", "createNode", 112);
_yuitest_coverline("build/button-plugin/button-plugin.js", 113);
var template;

    _yuitest_coverline("build/button-plugin/button-plugin.js", 115);
if (node && !config) {
        _yuitest_coverline("build/button-plugin/button-plugin.js", 116);
if (! (node.nodeType || node.getDOMNode || typeof node == 'string')) {
            _yuitest_coverline("build/button-plugin/button-plugin.js", 117);
config = node;
            _yuitest_coverline("build/button-plugin/button-plugin.js", 118);
node = config.srcNode;
        }
    }

    _yuitest_coverline("build/button-plugin/button-plugin.js", 122);
config   = config || {};
    _yuitest_coverline("build/button-plugin/button-plugin.js", 123);
template = config.template || Y.Plugin.Button.prototype.TEMPLATE;
    _yuitest_coverline("build/button-plugin/button-plugin.js", 124);
node     = node || config.srcNode || Y.DOM.create(template);

    _yuitest_coverline("build/button-plugin/button-plugin.js", 126);
return Y.one(node).plug(Y.Plugin.Button, config);
};

_yuitest_coverline("build/button-plugin/button-plugin.js", 129);
Y.namespace('Plugin').Button = ButtonPlugin;


}, '3.7.3', {"requires": ["button-core", "cssbutton", "node-pluginhost"]});
