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
_yuitest_coverage["build/button/button.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/button/button.js",
    code: []
};
_yuitest_coverage["build/button/button.js"].code=["YUI.add('button', function (Y, NAME) {","","/**","* A Button Widget","*","* @module button","* @since 3.5.0","*/","","var CLASS_NAMES = Y.ButtonCore.CLASS_NAMES,","    ARIA_STATES = Y.ButtonCore.ARIA_STATES,","    ARIA_ROLES  = Y.ButtonCore.ARIA_ROLES;","","/**","* Creates a Button","*","* @class Button","* @extends Widget","* @param config {Object} Configuration object","* @constructor","*/","function Button(config) {","    Button.superclass.constructor.apply(this, arguments);","}","","/* Button extends Widget */","Y.extend(Button, Y.Widget,  {","","    BOUNDING_TEMPLATE: Y.ButtonCore.prototype.TEMPLATE,","","    CONTENT_TEMPLATE: null,","","    /**","    * @method initializer","    * @description Internal init() handler.","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","        this._host = this.get('boundingBox');","    },","","    /**","     * bindUI implementation","     *","     * @description Hooks up events for the widget","     * @method bindUI","     */","    bindUI: function() {","        var button = this;","        button.after('labelChange', button._afterLabelChange);","        button.after('disabledChange', button._afterDisabledChange);","    },","","    /**","     * @method syncUI","     * @description Updates button attributes","     */","    syncUI: function() {","        var button = this;","        button._uiSetLabel(button.get('label'));","        button._uiSetDisabled(button.get('disabled'));","    },","","    /**","    * @method _afterLabelChange","    * @private","    */","    _afterLabelChange: function(e) {","        this._uiSetLabel(e.newVal);","    },","","    /**","    * @method _afterDisabledChange","    * @private","    */","    _afterDisabledChange: function(e) {","        this._uiSetDisabled(e.newVal);","    }","","}, {","    // Y.Button static properties","","    /**","     * The identity of the widget.","     *","     * @property NAME","     * @type String","     * @default 'button'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'button',","","    /**","    * Static property used to define the default attribute configuration of","    * the Widget.","    *","    * @property ATTRS","    * @type {Object}","    * @protected","    * @static","    */","    ATTRS: {","        label: {","            value: Y.ButtonCore.ATTRS.label.value","        },","","        disabled: {","            value: false","        }","    },","","    /**","    * @property HTML_PARSER","    * @type {Object}","    * @protected","    * @static","    */","    HTML_PARSER: {","        label: function(node) {","            this._host = node; // TODO: remove","            return this._getLabel();","        },","","        disabled: function(node) {","            return node.getDOMNode().disabled;","        }","    },","","    /**","     * List of class names used in the ButtonGroup's DOM","     *","     * @property CLASS_NAMES","     * @type Object","     * @static","     */","    CLASS_NAMES: CLASS_NAMES","});","","Y.mix(Button.prototype, Y.ButtonCore.prototype);","","/**","* Creates a ToggleButton","*","* @class ToggleButton","* @extends Button","* @param config {Object} Configuration object","* @constructor","*/","function ToggleButton(config) {","    Button.superclass.constructor.apply(this, arguments);","}","","// TODO: move to ButtonCore subclass to enable toggle plugin, widget, etc.","/* ToggleButton extends Button */","Y.extend(ToggleButton, Button,  {","    ","    trigger: 'click',","    selectedAttrName: '',","    ","    initializer: function (config) {","        var button = this,","            type = button.get('type'),","            selectedAttrName = (type === \"checkbox\" ? 'checked' : 'pressed'),","            selectedState = config[selectedAttrName] || false;","        ","        // Create the checked/pressed attribute","        button.addAttr(selectedAttrName, {","            value: selectedState","        });","        ","        button.selectedAttrName = selectedAttrName;","    },","    ","    destructor: function () {","        delete this.selectedAttrName;","    },","    ","    /**","     * @method bindUI","     * @description Hooks up events for the widget","     */","    bindUI: function() {","         var button = this,","             cb = button.get('contentBox');","        ","        ToggleButton.superclass.bindUI.call(button);","        ","        cb.on(button.trigger, button.toggle, button);","        button.after(button.selectedAttrName + 'Change', button._afterSelectedChange);","    },","","    /**","     * @method syncUI","     * @description Syncs the UI for the widget","     */","    syncUI: function() {","        var button = this,","            cb = button.get('contentBox'),","            type = button.get('type'),","            ROLES = ToggleButton.ARIA_ROLES,","            role = (type === 'checkbox' ? ROLES.CHECKBOX : ROLES.TOGGLE),","            selectedAttrName = button.selectedAttrName;","","        ToggleButton.superclass.syncUI.call(button);","        ","        cb.set('role', role);","        button._uiSetSelected(button.get(selectedAttrName));","    },","    ","    _afterSelectedChange: function(e){","        this._uiSetSelected(e.newVal);","    },","    ","    /**","    * @method _uiSetSelected","    * @private","    */","    _uiSetSelected: function(value) {","        var button = this,","            cb = button.get('contentBox'),","            STATES = ToggleButton.ARIA_STATES,","            type = button.get('type'),","            ariaState = (type === 'checkbox' ? STATES.CHECKED : STATES.PRESSED);","        ","        cb.toggleClass(Button.CLASS_NAMES.SELECTED, value);","        cb.set(ariaState, value);","    },","    ","    /**","    * @method toggle","    * @description Toggles the selected/pressed/checked state of a ToggleButton","    * @public","    */","    toggle: function() {","        var button = this;","        button._set(button.selectedAttrName, !button.get(button.selectedAttrName));","    }","","}, {","    ","    /**","    * The identity of the widget.","    *","    * @property NAME","    * @type {String}","    * @default 'buttongroup'","    * @readOnly","    * @protected","    * @static","    */","    NAME: 'toggleButton',","    ","    /**","    * Static property used to define the default attribute configuration of","    * the Widget.","    *","    * @property ATTRS","    * @type {Object}","    * @protected","    * @static","    */","    ATTRS: {","        type: {","            value: 'toggle',","            writeOnce: 'initOnly'","        }","    },","    ","    /**","    * @property HTML_PARSER","    * @type {Object}","    * @protected","    * @static","    */","    HTML_PARSER: {","        checked: function(node) {","            return node.hasClass(CLASS_NAMES.SELECTED);","        },","        pressed: function(node) {","            return node.hasClass(CLASS_NAMES.SELECTED);","        }","    },","    ","    /**","    * @property ARIA_STATES","    * @type {Object}","    * @protected","    * @static","    */","    ARIA_STATES: ARIA_STATES,","","    /**","    * @property ARIA_ROLES","    * @type {Object}","    * @protected","    * @static","    */","    ARIA_ROLES: ARIA_ROLES,","","    /**","     * Array of static constants used to identify the classnames applied to DOM nodes","     *","     * @property CLASS_NAMES","     * @type Object","     * @static","     */","    CLASS_NAMES: CLASS_NAMES","    ","});","","// Export","Y.Button = Button;","Y.ToggleButton = ToggleButton;","","","}, '3.7.3', {\"requires\": [\"button-core\", \"cssbutton\", \"widget\"]});"];
_yuitest_coverage["build/button/button.js"].lines = {"1":0,"10":0,"22":0,"23":0,"27":0,"40":0,"50":0,"51":0,"52":0,"60":0,"61":0,"62":0,"70":0,"78":0,"123":0,"124":0,"128":0,"142":0,"152":0,"153":0,"158":0,"164":0,"170":0,"174":0,"178":0,"186":0,"189":0,"191":0,"192":0,"200":0,"207":0,"209":0,"210":0,"214":0,"222":0,"228":0,"229":0,"238":0,"239":0,"280":0,"283":0,"315":0,"316":0};
_yuitest_coverage["build/button/button.js"].functions = {"Button:22":0,"initializer:39":0,"bindUI:49":0,"syncUI:59":0,"_afterLabelChange:69":0,"_afterDisabledChange:77":0,"label:122":0,"disabled:127":0,"ToggleButton:152":0,"initializer:163":0,"destructor:177":0,"bindUI:185":0,"syncUI:199":0,"_afterSelectedChange:213":0,"_uiSetSelected:221":0,"toggle:237":0,"checked:279":0,"pressed:282":0,"(anonymous 1):1":0};
_yuitest_coverage["build/button/button.js"].coveredLines = 43;
_yuitest_coverage["build/button/button.js"].coveredFunctions = 19;
_yuitest_coverline("build/button/button.js", 1);
YUI.add('button', function (Y, NAME) {

/**
* A Button Widget
*
* @module button
* @since 3.5.0
*/

_yuitest_coverfunc("build/button/button.js", "(anonymous 1)", 1);
_yuitest_coverline("build/button/button.js", 10);
var CLASS_NAMES = Y.ButtonCore.CLASS_NAMES,
    ARIA_STATES = Y.ButtonCore.ARIA_STATES,
    ARIA_ROLES  = Y.ButtonCore.ARIA_ROLES;

/**
* Creates a Button
*
* @class Button
* @extends Widget
* @param config {Object} Configuration object
* @constructor
*/
_yuitest_coverline("build/button/button.js", 22);
function Button(config) {
    _yuitest_coverfunc("build/button/button.js", "Button", 22);
_yuitest_coverline("build/button/button.js", 23);
Button.superclass.constructor.apply(this, arguments);
}

/* Button extends Widget */
_yuitest_coverline("build/button/button.js", 27);
Y.extend(Button, Y.Widget,  {

    BOUNDING_TEMPLATE: Y.ButtonCore.prototype.TEMPLATE,

    CONTENT_TEMPLATE: null,

    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        _yuitest_coverfunc("build/button/button.js", "initializer", 39);
_yuitest_coverline("build/button/button.js", 40);
this._host = this.get('boundingBox');
    },

    /**
     * bindUI implementation
     *
     * @description Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function() {
        _yuitest_coverfunc("build/button/button.js", "bindUI", 49);
_yuitest_coverline("build/button/button.js", 50);
var button = this;
        _yuitest_coverline("build/button/button.js", 51);
button.after('labelChange', button._afterLabelChange);
        _yuitest_coverline("build/button/button.js", 52);
button.after('disabledChange', button._afterDisabledChange);
    },

    /**
     * @method syncUI
     * @description Updates button attributes
     */
    syncUI: function() {
        _yuitest_coverfunc("build/button/button.js", "syncUI", 59);
_yuitest_coverline("build/button/button.js", 60);
var button = this;
        _yuitest_coverline("build/button/button.js", 61);
button._uiSetLabel(button.get('label'));
        _yuitest_coverline("build/button/button.js", 62);
button._uiSetDisabled(button.get('disabled'));
    },

    /**
    * @method _afterLabelChange
    * @private
    */
    _afterLabelChange: function(e) {
        _yuitest_coverfunc("build/button/button.js", "_afterLabelChange", 69);
_yuitest_coverline("build/button/button.js", 70);
this._uiSetLabel(e.newVal);
    },

    /**
    * @method _afterDisabledChange
    * @private
    */
    _afterDisabledChange: function(e) {
        _yuitest_coverfunc("build/button/button.js", "_afterDisabledChange", 77);
_yuitest_coverline("build/button/button.js", 78);
this._uiSetDisabled(e.newVal);
    }

}, {
    // Y.Button static properties

    /**
     * The identity of the widget.
     *
     * @property NAME
     * @type String
     * @default 'button'
     * @readOnly
     * @protected
     * @static
     */
    NAME: 'button',

    /**
    * Static property used to define the default attribute configuration of
    * the Widget.
    *
    * @property ATTRS
    * @type {Object}
    * @protected
    * @static
    */
    ATTRS: {
        label: {
            value: Y.ButtonCore.ATTRS.label.value
        },

        disabled: {
            value: false
        }
    },

    /**
    * @property HTML_PARSER
    * @type {Object}
    * @protected
    * @static
    */
    HTML_PARSER: {
        label: function(node) {
            _yuitest_coverfunc("build/button/button.js", "label", 122);
_yuitest_coverline("build/button/button.js", 123);
this._host = node; // TODO: remove
            _yuitest_coverline("build/button/button.js", 124);
return this._getLabel();
        },

        disabled: function(node) {
            _yuitest_coverfunc("build/button/button.js", "disabled", 127);
_yuitest_coverline("build/button/button.js", 128);
return node.getDOMNode().disabled;
        }
    },

    /**
     * List of class names used in the ButtonGroup's DOM
     *
     * @property CLASS_NAMES
     * @type Object
     * @static
     */
    CLASS_NAMES: CLASS_NAMES
});

_yuitest_coverline("build/button/button.js", 142);
Y.mix(Button.prototype, Y.ButtonCore.prototype);

/**
* Creates a ToggleButton
*
* @class ToggleButton
* @extends Button
* @param config {Object} Configuration object
* @constructor
*/
_yuitest_coverline("build/button/button.js", 152);
function ToggleButton(config) {
    _yuitest_coverfunc("build/button/button.js", "ToggleButton", 152);
_yuitest_coverline("build/button/button.js", 153);
Button.superclass.constructor.apply(this, arguments);
}

// TODO: move to ButtonCore subclass to enable toggle plugin, widget, etc.
/* ToggleButton extends Button */
_yuitest_coverline("build/button/button.js", 158);
Y.extend(ToggleButton, Button,  {
    
    trigger: 'click',
    selectedAttrName: '',
    
    initializer: function (config) {
        _yuitest_coverfunc("build/button/button.js", "initializer", 163);
_yuitest_coverline("build/button/button.js", 164);
var button = this,
            type = button.get('type'),
            selectedAttrName = (type === "checkbox" ? 'checked' : 'pressed'),
            selectedState = config[selectedAttrName] || false;
        
        // Create the checked/pressed attribute
        _yuitest_coverline("build/button/button.js", 170);
button.addAttr(selectedAttrName, {
            value: selectedState
        });
        
        _yuitest_coverline("build/button/button.js", 174);
button.selectedAttrName = selectedAttrName;
    },
    
    destructor: function () {
        _yuitest_coverfunc("build/button/button.js", "destructor", 177);
_yuitest_coverline("build/button/button.js", 178);
delete this.selectedAttrName;
    },
    
    /**
     * @method bindUI
     * @description Hooks up events for the widget
     */
    bindUI: function() {
         _yuitest_coverfunc("build/button/button.js", "bindUI", 185);
_yuitest_coverline("build/button/button.js", 186);
var button = this,
             cb = button.get('contentBox');
        
        _yuitest_coverline("build/button/button.js", 189);
ToggleButton.superclass.bindUI.call(button);
        
        _yuitest_coverline("build/button/button.js", 191);
cb.on(button.trigger, button.toggle, button);
        _yuitest_coverline("build/button/button.js", 192);
button.after(button.selectedAttrName + 'Change', button._afterSelectedChange);
    },

    /**
     * @method syncUI
     * @description Syncs the UI for the widget
     */
    syncUI: function() {
        _yuitest_coverfunc("build/button/button.js", "syncUI", 199);
_yuitest_coverline("build/button/button.js", 200);
var button = this,
            cb = button.get('contentBox'),
            type = button.get('type'),
            ROLES = ToggleButton.ARIA_ROLES,
            role = (type === 'checkbox' ? ROLES.CHECKBOX : ROLES.TOGGLE),
            selectedAttrName = button.selectedAttrName;

        _yuitest_coverline("build/button/button.js", 207);
ToggleButton.superclass.syncUI.call(button);
        
        _yuitest_coverline("build/button/button.js", 209);
cb.set('role', role);
        _yuitest_coverline("build/button/button.js", 210);
button._uiSetSelected(button.get(selectedAttrName));
    },
    
    _afterSelectedChange: function(e){
        _yuitest_coverfunc("build/button/button.js", "_afterSelectedChange", 213);
_yuitest_coverline("build/button/button.js", 214);
this._uiSetSelected(e.newVal);
    },
    
    /**
    * @method _uiSetSelected
    * @private
    */
    _uiSetSelected: function(value) {
        _yuitest_coverfunc("build/button/button.js", "_uiSetSelected", 221);
_yuitest_coverline("build/button/button.js", 222);
var button = this,
            cb = button.get('contentBox'),
            STATES = ToggleButton.ARIA_STATES,
            type = button.get('type'),
            ariaState = (type === 'checkbox' ? STATES.CHECKED : STATES.PRESSED);
        
        _yuitest_coverline("build/button/button.js", 228);
cb.toggleClass(Button.CLASS_NAMES.SELECTED, value);
        _yuitest_coverline("build/button/button.js", 229);
cb.set(ariaState, value);
    },
    
    /**
    * @method toggle
    * @description Toggles the selected/pressed/checked state of a ToggleButton
    * @public
    */
    toggle: function() {
        _yuitest_coverfunc("build/button/button.js", "toggle", 237);
_yuitest_coverline("build/button/button.js", 238);
var button = this;
        _yuitest_coverline("build/button/button.js", 239);
button._set(button.selectedAttrName, !button.get(button.selectedAttrName));
    }

}, {
    
    /**
    * The identity of the widget.
    *
    * @property NAME
    * @type {String}
    * @default 'buttongroup'
    * @readOnly
    * @protected
    * @static
    */
    NAME: 'toggleButton',
    
    /**
    * Static property used to define the default attribute configuration of
    * the Widget.
    *
    * @property ATTRS
    * @type {Object}
    * @protected
    * @static
    */
    ATTRS: {
        type: {
            value: 'toggle',
            writeOnce: 'initOnly'
        }
    },
    
    /**
    * @property HTML_PARSER
    * @type {Object}
    * @protected
    * @static
    */
    HTML_PARSER: {
        checked: function(node) {
            _yuitest_coverfunc("build/button/button.js", "checked", 279);
_yuitest_coverline("build/button/button.js", 280);
return node.hasClass(CLASS_NAMES.SELECTED);
        },
        pressed: function(node) {
            _yuitest_coverfunc("build/button/button.js", "pressed", 282);
_yuitest_coverline("build/button/button.js", 283);
return node.hasClass(CLASS_NAMES.SELECTED);
        }
    },
    
    /**
    * @property ARIA_STATES
    * @type {Object}
    * @protected
    * @static
    */
    ARIA_STATES: ARIA_STATES,

    /**
    * @property ARIA_ROLES
    * @type {Object}
    * @protected
    * @static
    */
    ARIA_ROLES: ARIA_ROLES,

    /**
     * Array of static constants used to identify the classnames applied to DOM nodes
     *
     * @property CLASS_NAMES
     * @type Object
     * @static
     */
    CLASS_NAMES: CLASS_NAMES
    
});

// Export
_yuitest_coverline("build/button/button.js", 315);
Y.Button = Button;
_yuitest_coverline("build/button/button.js", 316);
Y.ToggleButton = ToggleButton;


}, '3.7.3', {"requires": ["button-core", "cssbutton", "widget"]});
