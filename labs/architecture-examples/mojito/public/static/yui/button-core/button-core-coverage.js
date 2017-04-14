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
_yuitest_coverage["build/button-core/button-core.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/button-core/button-core.js",
    code: []
};
_yuitest_coverage["build/button-core/button-core.js"].code=["YUI.add('button-core', function (Y, NAME) {","","/**","* Provides an interface for working with button-like DOM nodes","*","* @module button-core","* @since 3.5.0","*/","","var getClassName = Y.ClassNameManager.getClassName;","","/**","* Creates a button","*","* @class ButtonCore","* @param config {Object} Configuration object","* @constructor","*/","function Button(config) {","    this.initializer(config);","}","","Button.prototype = {","    TEMPLATE: '<button/>',","","    constructor: Button,","","    /**","    * @method initializer","    * @description Internal init() handler.","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","        this._initNode(config);","        this._initAttributes(config);","        this._renderUI(config);","    },","","    /**","    * @method _initNode","    * @description Node initializer","    * @param config {Object} Config object.","    * @private","    */","    _initNode: function(config) {","        if (config.host) {","            this._host = Y.one(config.host);","        } else {","            this._host = Y.Node.create(this.TEMPLATE);","        }","    },","","    /**","    * @method _initAttributes","    * @description  Attribute initializer","    * @param config {Object} Config object.","    * @private","    */","    _initAttributes: function(config) {","        var host = this._host,","            node = host.one('.' + Button.CLASS_NAMES.LABEL) || host;","            ","        config.label = config.label || this._getLabel(node);","        Y.AttributeCore.call(this, Button.ATTRS, config);","    },","","    /**","    * @method renderUI","    * @description Renders any UI/DOM elements for Button instances","    * @param config {Object} Config object.","    * @private","    */","    _renderUI: function(config) {","        var node = this.getNode(),","            tagName = node.get('tagName').toLowerCase();","","        // Set some default node attributes","        node.addClass(Button.CLASS_NAMES.BUTTON);","        ","        if (tagName !== 'button' && tagName !== 'input') {","            node.set('role', 'button');   ","        }","    },","","    /**","    * @method enable    ","    * @description Sets the button's `disabled` DOM attribute to false","    * @public","    */","    enable: function() {","        this.set('disabled', false);","    },","","    /**","    * @method disable","    * @description Sets the button's `disabled` DOM attribute to true","    * @public","    */","    disable: function() {","        this.set('disabled', true);","    },","","    /**","    * @method getNode","    * @description Gets the host node for this button instance","    * @public","    */","    getNode: function() {","        return this._host;","    },","    ","    /**","    * @method _getLabel","    * @description Getter for a button's 'label' ATTR","    * @private","    */","    _getLabel: function () {","        var node    = this.getNode(),","            tagName = node.get('tagName').toLowerCase(),","            label;","","        if (tagName === 'input') {","            label = node.get('value');","        }","        else {","            label = (node.one('.' + Button.CLASS_NAMES.LABEL) || node).get('text');","        }","        ","        return label;","    },","    ","    /**","    * @method _uiSetLabel","    * @description Setter for a button's 'label' ATTR","    * @param label {string}","    * @private","    */","    _uiSetLabel: function (label) {","        var node    = this.getNode(),","            tagName = node.get('tagName').toLowerCase();","","        if (tagName === 'input') {","            node.set('value', label);","        } else {","            (node.one('.' + Button.CLASS_NAMES.LABEL) || node).set('text', label);","        }","","        return label;","    },","","    /**","    * @method _uiSetDisabled","    * @description Setter for the 'disabled' ATTR","    * @param value {boolean}","    * @private","    */","    _uiSetDisabled: function(value) {","        var node = this.getNode();","        ","        node.getDOMNode().disabled = value; // avoid rerunning setter when this === node","        node.toggleClass(Button.CLASS_NAMES.DISABLED, value);","        ","        return value;","    }","};","","/**","* Attribute configuration.","*","* @property ATTRS","* @type {Object}","* @private","* @static","*/","Button.ATTRS = {","    label: {","        setter: '_uiSetLabel',","        getter: '_getLabel',","        lazyAdd: false","    },","","    disabled: {","        value: false,","        setter: '_uiSetDisabled',","        lazyAdd: false","    }","};","","/**","* Name of this component.","*","* @property NAME","* @type String","* @static","*/","Button.NAME = \"button\";","","/**","* Array of static constants used to identify the classnames applied to DOM nodes","*","* @property CLASS_NAMES","* @type {Object}","* @public","* @static","*/","Button.CLASS_NAMES = {","    BUTTON  : getClassName('button'),","    DISABLED: getClassName('button', 'disabled'),","    SELECTED: getClassName('button', 'selected'),","    LABEL   : getClassName('button', 'label')","};","","/**","* Array of static constants used to for applying ARIA states","*","* @property CLASS_NAMES","* @type {Object}","* @private","* @static","*/","Button.ARIA_STATES = {","    PRESSED : 'aria-pressed',","    CHECKED : 'aria-checked'","};","","/**","* Array of static constants used to for applying ARIA roles","*","* @property CLASS_NAMES","* @type {Object}","* @private","* @static","*/","Button.ARIA_ROLES = {","    BUTTON  : 'button',","    CHECKBOX: 'checkbox',","    TOGGLE  : 'toggle'","};","","Y.mix(Button.prototype, Y.AttributeCore.prototype);","","// Export Button","Y.ButtonCore = Button;","","","}, '3.7.3', {\"requires\": [\"attribute-core\", \"classnamemanager\", \"node-base\"]});"];
_yuitest_coverage["build/button-core/button-core.js"].lines = {"1":0,"10":0,"19":0,"20":0,"23":0,"35":0,"36":0,"37":0,"47":0,"48":0,"50":0,"61":0,"64":0,"65":0,"75":0,"79":0,"81":0,"82":0,"92":0,"101":0,"110":0,"119":0,"123":0,"124":0,"127":0,"130":0,"140":0,"143":0,"144":0,"146":0,"149":0,"159":0,"161":0,"162":0,"164":0,"176":0,"197":0,"207":0,"222":0,"235":0,"241":0,"244":0};
_yuitest_coverage["build/button-core/button-core.js"].functions = {"Button:19":0,"initializer:34":0,"_initNode:46":0,"_initAttributes:60":0,"_renderUI:74":0,"enable:91":0,"disable:100":0,"getNode:109":0,"_getLabel:118":0,"_uiSetLabel:139":0,"_uiSetDisabled:158":0,"(anonymous 1):1":0};
_yuitest_coverage["build/button-core/button-core.js"].coveredLines = 42;
_yuitest_coverage["build/button-core/button-core.js"].coveredFunctions = 12;
_yuitest_coverline("build/button-core/button-core.js", 1);
YUI.add('button-core', function (Y, NAME) {

/**
* Provides an interface for working with button-like DOM nodes
*
* @module button-core
* @since 3.5.0
*/

_yuitest_coverfunc("build/button-core/button-core.js", "(anonymous 1)", 1);
_yuitest_coverline("build/button-core/button-core.js", 10);
var getClassName = Y.ClassNameManager.getClassName;

/**
* Creates a button
*
* @class ButtonCore
* @param config {Object} Configuration object
* @constructor
*/
_yuitest_coverline("build/button-core/button-core.js", 19);
function Button(config) {
    _yuitest_coverfunc("build/button-core/button-core.js", "Button", 19);
_yuitest_coverline("build/button-core/button-core.js", 20);
this.initializer(config);
}

_yuitest_coverline("build/button-core/button-core.js", 23);
Button.prototype = {
    TEMPLATE: '<button/>',

    constructor: Button,

    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        _yuitest_coverfunc("build/button-core/button-core.js", "initializer", 34);
_yuitest_coverline("build/button-core/button-core.js", 35);
this._initNode(config);
        _yuitest_coverline("build/button-core/button-core.js", 36);
this._initAttributes(config);
        _yuitest_coverline("build/button-core/button-core.js", 37);
this._renderUI(config);
    },

    /**
    * @method _initNode
    * @description Node initializer
    * @param config {Object} Config object.
    * @private
    */
    _initNode: function(config) {
        _yuitest_coverfunc("build/button-core/button-core.js", "_initNode", 46);
_yuitest_coverline("build/button-core/button-core.js", 47);
if (config.host) {
            _yuitest_coverline("build/button-core/button-core.js", 48);
this._host = Y.one(config.host);
        } else {
            _yuitest_coverline("build/button-core/button-core.js", 50);
this._host = Y.Node.create(this.TEMPLATE);
        }
    },

    /**
    * @method _initAttributes
    * @description  Attribute initializer
    * @param config {Object} Config object.
    * @private
    */
    _initAttributes: function(config) {
        _yuitest_coverfunc("build/button-core/button-core.js", "_initAttributes", 60);
_yuitest_coverline("build/button-core/button-core.js", 61);
var host = this._host,
            node = host.one('.' + Button.CLASS_NAMES.LABEL) || host;
            
        _yuitest_coverline("build/button-core/button-core.js", 64);
config.label = config.label || this._getLabel(node);
        _yuitest_coverline("build/button-core/button-core.js", 65);
Y.AttributeCore.call(this, Button.ATTRS, config);
    },

    /**
    * @method renderUI
    * @description Renders any UI/DOM elements for Button instances
    * @param config {Object} Config object.
    * @private
    */
    _renderUI: function(config) {
        _yuitest_coverfunc("build/button-core/button-core.js", "_renderUI", 74);
_yuitest_coverline("build/button-core/button-core.js", 75);
var node = this.getNode(),
            tagName = node.get('tagName').toLowerCase();

        // Set some default node attributes
        _yuitest_coverline("build/button-core/button-core.js", 79);
node.addClass(Button.CLASS_NAMES.BUTTON);
        
        _yuitest_coverline("build/button-core/button-core.js", 81);
if (tagName !== 'button' && tagName !== 'input') {
            _yuitest_coverline("build/button-core/button-core.js", 82);
node.set('role', 'button');   
        }
    },

    /**
    * @method enable    
    * @description Sets the button's `disabled` DOM attribute to false
    * @public
    */
    enable: function() {
        _yuitest_coverfunc("build/button-core/button-core.js", "enable", 91);
_yuitest_coverline("build/button-core/button-core.js", 92);
this.set('disabled', false);
    },

    /**
    * @method disable
    * @description Sets the button's `disabled` DOM attribute to true
    * @public
    */
    disable: function() {
        _yuitest_coverfunc("build/button-core/button-core.js", "disable", 100);
_yuitest_coverline("build/button-core/button-core.js", 101);
this.set('disabled', true);
    },

    /**
    * @method getNode
    * @description Gets the host node for this button instance
    * @public
    */
    getNode: function() {
        _yuitest_coverfunc("build/button-core/button-core.js", "getNode", 109);
_yuitest_coverline("build/button-core/button-core.js", 110);
return this._host;
    },
    
    /**
    * @method _getLabel
    * @description Getter for a button's 'label' ATTR
    * @private
    */
    _getLabel: function () {
        _yuitest_coverfunc("build/button-core/button-core.js", "_getLabel", 118);
_yuitest_coverline("build/button-core/button-core.js", 119);
var node    = this.getNode(),
            tagName = node.get('tagName').toLowerCase(),
            label;

        _yuitest_coverline("build/button-core/button-core.js", 123);
if (tagName === 'input') {
            _yuitest_coverline("build/button-core/button-core.js", 124);
label = node.get('value');
        }
        else {
            _yuitest_coverline("build/button-core/button-core.js", 127);
label = (node.one('.' + Button.CLASS_NAMES.LABEL) || node).get('text');
        }
        
        _yuitest_coverline("build/button-core/button-core.js", 130);
return label;
    },
    
    /**
    * @method _uiSetLabel
    * @description Setter for a button's 'label' ATTR
    * @param label {string}
    * @private
    */
    _uiSetLabel: function (label) {
        _yuitest_coverfunc("build/button-core/button-core.js", "_uiSetLabel", 139);
_yuitest_coverline("build/button-core/button-core.js", 140);
var node    = this.getNode(),
            tagName = node.get('tagName').toLowerCase();

        _yuitest_coverline("build/button-core/button-core.js", 143);
if (tagName === 'input') {
            _yuitest_coverline("build/button-core/button-core.js", 144);
node.set('value', label);
        } else {
            _yuitest_coverline("build/button-core/button-core.js", 146);
(node.one('.' + Button.CLASS_NAMES.LABEL) || node).set('text', label);
        }

        _yuitest_coverline("build/button-core/button-core.js", 149);
return label;
    },

    /**
    * @method _uiSetDisabled
    * @description Setter for the 'disabled' ATTR
    * @param value {boolean}
    * @private
    */
    _uiSetDisabled: function(value) {
        _yuitest_coverfunc("build/button-core/button-core.js", "_uiSetDisabled", 158);
_yuitest_coverline("build/button-core/button-core.js", 159);
var node = this.getNode();
        
        _yuitest_coverline("build/button-core/button-core.js", 161);
node.getDOMNode().disabled = value; // avoid rerunning setter when this === node
        _yuitest_coverline("build/button-core/button-core.js", 162);
node.toggleClass(Button.CLASS_NAMES.DISABLED, value);
        
        _yuitest_coverline("build/button-core/button-core.js", 164);
return value;
    }
};

/**
* Attribute configuration.
*
* @property ATTRS
* @type {Object}
* @private
* @static
*/
_yuitest_coverline("build/button-core/button-core.js", 176);
Button.ATTRS = {
    label: {
        setter: '_uiSetLabel',
        getter: '_getLabel',
        lazyAdd: false
    },

    disabled: {
        value: false,
        setter: '_uiSetDisabled',
        lazyAdd: false
    }
};

/**
* Name of this component.
*
* @property NAME
* @type String
* @static
*/
_yuitest_coverline("build/button-core/button-core.js", 197);
Button.NAME = "button";

/**
* Array of static constants used to identify the classnames applied to DOM nodes
*
* @property CLASS_NAMES
* @type {Object}
* @public
* @static
*/
_yuitest_coverline("build/button-core/button-core.js", 207);
Button.CLASS_NAMES = {
    BUTTON  : getClassName('button'),
    DISABLED: getClassName('button', 'disabled'),
    SELECTED: getClassName('button', 'selected'),
    LABEL   : getClassName('button', 'label')
};

/**
* Array of static constants used to for applying ARIA states
*
* @property CLASS_NAMES
* @type {Object}
* @private
* @static
*/
_yuitest_coverline("build/button-core/button-core.js", 222);
Button.ARIA_STATES = {
    PRESSED : 'aria-pressed',
    CHECKED : 'aria-checked'
};

/**
* Array of static constants used to for applying ARIA roles
*
* @property CLASS_NAMES
* @type {Object}
* @private
* @static
*/
_yuitest_coverline("build/button-core/button-core.js", 235);
Button.ARIA_ROLES = {
    BUTTON  : 'button',
    CHECKBOX: 'checkbox',
    TOGGLE  : 'toggle'
};

_yuitest_coverline("build/button-core/button-core.js", 241);
Y.mix(Button.prototype, Y.AttributeCore.prototype);

// Export Button
_yuitest_coverline("build/button-core/button-core.js", 244);
Y.ButtonCore = Button;


}, '3.7.3', {"requires": ["attribute-core", "classnamemanager", "node-base"]});
