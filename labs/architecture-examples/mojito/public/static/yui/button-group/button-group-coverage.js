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
_yuitest_coverage["build/button-group/button-group.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/button-group/button-group.js",
    code: []
};
_yuitest_coverage["build/button-group/button-group.js"].code=["YUI.add('button-group', function (Y, NAME) {","","/**","* A Widget to create groups of buttons","*","* @module button-group","* @since 3.5.0","*/","","var CONTENT_BOX = \"contentBox\",","    CLICK_EVENT = \"click\",","    CLASS_NAMES = Y.ButtonCore.CLASS_NAMES;","","/**","* Creates a ButtonGroup","*","* @class ButtonGroup","* @extends Widget","* @param config {Object} Configuration object","* @constructor","*/","function ButtonGroup() {","    ButtonGroup.superclass.constructor.apply(this, arguments);","}","","/* ButtonGroup extends Widget */","Y.ButtonGroup = Y.extend(ButtonGroup, Y.Widget, {","","    /**","     * @method renderUI","     * @description Creates a visual representation of the widget based on existing parameters.","     * @public","     */","    renderUI: function() {","        this.getButtons().plug(Y.Plugin.Button);","    },","","    /**","     * @method bindUI","     * @description Hooks up events for the widget","     * @public","     */","    bindUI: function() {","        var group = this,","            cb = group.get(CONTENT_BOX);","","        cb.delegate(CLICK_EVENT, group._handleClick, Y.ButtonGroup.BUTTON_SELECTOR, group);","    },","","    /**","    * @method getButtons","    * @description Returns all buttons inside this this button group","    * @public","    */","    getButtons: function() {","        var cb = this.get(CONTENT_BOX);","","        return cb.all(Y.ButtonGroup.BUTTON_SELECTOR);","    },","","    /**","    * @method getSelectedButtons","    * @description Returns all Y.Buttons instances that are selected","    * @public","    */","    getSelectedButtons: function() {","        var group = this,","            selected = [],","            buttons = group.getButtons(),","            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED;","","        buttons.each(function(node){","            if (node.hasClass(selectedClass)){","                selected.push(node);","            }","        });","","        return selected;","    },","","    /**","    * @method getSelectedValues","    * @description Returns the values of all Y.Button instances that are selected","    * @public","    */","    getSelectedValues: function() {","        var group = this,","            value,","            values = [],","            selected = group.getSelectedButtons(),","            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED;","","        Y.Array.each(selected, function(node){","            if (node.hasClass(selectedClass)){","                value = node.getContent();","                values.push(value);","            }","        });","","        return values;","    },","","    /**","    * @method _handleClick","    * @description A delegated click handler for when any button is clicked in the content box","    * @param e {Object} An event object","    * @private","    */","    _handleClick: function(e){","        var group = this,","            clickedNode = e.target.ancestor('.' + ButtonGroup.CLASS_NAMES.BUTTON, true),","            type = group.get('type'),","            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED,","            isSelected = clickedNode.hasClass(selectedClass),","            buttons;","","        // TODO: Anything for 'push' groups?","","        if (type === 'checkbox') {","            clickedNode.toggleClass(selectedClass, !isSelected);","            /**","             * @event selectionChange","             * @description fires when any button in the group changes its checked status","             * @param {Event} the event object. It contains an \"originEvent\" property","             * linking to the original DOM event that triggered the selection change","             */","            group.fire('selectionChange', {originEvent: e});","        }","        else if (type === 'radio') {","            if (!isSelected) {","                buttons = group.getButtons(); // Todo: getSelectedButtons()? Need it to return an arraylist then.","                buttons.removeClass(selectedClass);","                clickedNode.addClass(selectedClass);","                group.fire('selectionChange', {originEvent: e});","            }","        }","    }","","}, {","    // Y.ButtonGroup static properties","","    /**","     * The identity of the widget.","     *","     * @property NAME","     * @type {String}","     * @default 'buttongroup'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'buttongroup',","","    /**","    * Static property used to define the default attribute configuration of","    * the Widget.","    *","    * @property ATTRS","    * @type {Object}","    * @protected","    * @static","    */","    ATTRS: {","        type: {","            writeOnce: 'initOnly',","            value: 'radio'","        }","    },","","    /**","     * List of class names to use for ButtonGroups","     *","     * @property CLASS_NAMES","     * @type {Object}","     * @static","     */","    CLASS_NAMES: CLASS_NAMES,","    ","    /**","     * Selector used to find buttons inside a ButtonGroup","     * @type {String}","     */","    BUTTON_SELECTOR: \"button, input[type=button], input[type=reset], input[type=submit], input[type=radio], input[type=checkbox]\"","});","","","}, '3.7.3', {\"requires\": [\"button-plugin\", \"cssbutton\", \"widget\"]});"];
_yuitest_coverage["build/button-group/button-group.js"].lines = {"1":0,"10":0,"22":0,"23":0,"27":0,"35":0,"44":0,"47":0,"56":0,"58":0,"67":0,"72":0,"73":0,"74":0,"78":0,"87":0,"93":0,"94":0,"95":0,"96":0,"100":0,"110":0,"119":0,"120":0,"127":0,"129":0,"130":0,"131":0,"132":0,"133":0,"134":0};
_yuitest_coverage["build/button-group/button-group.js"].functions = {"ButtonGroup:22":0,"renderUI:34":0,"bindUI:43":0,"getButtons:55":0,"(anonymous 2):72":0,"getSelectedButtons:66":0,"(anonymous 3):93":0,"getSelectedValues:86":0,"_handleClick:109":0,"(anonymous 1):1":0};
_yuitest_coverage["build/button-group/button-group.js"].coveredLines = 31;
_yuitest_coverage["build/button-group/button-group.js"].coveredFunctions = 10;
_yuitest_coverline("build/button-group/button-group.js", 1);
YUI.add('button-group', function (Y, NAME) {

/**
* A Widget to create groups of buttons
*
* @module button-group
* @since 3.5.0
*/

_yuitest_coverfunc("build/button-group/button-group.js", "(anonymous 1)", 1);
_yuitest_coverline("build/button-group/button-group.js", 10);
var CONTENT_BOX = "contentBox",
    CLICK_EVENT = "click",
    CLASS_NAMES = Y.ButtonCore.CLASS_NAMES;

/**
* Creates a ButtonGroup
*
* @class ButtonGroup
* @extends Widget
* @param config {Object} Configuration object
* @constructor
*/
_yuitest_coverline("build/button-group/button-group.js", 22);
function ButtonGroup() {
    _yuitest_coverfunc("build/button-group/button-group.js", "ButtonGroup", 22);
_yuitest_coverline("build/button-group/button-group.js", 23);
ButtonGroup.superclass.constructor.apply(this, arguments);
}

/* ButtonGroup extends Widget */
_yuitest_coverline("build/button-group/button-group.js", 27);
Y.ButtonGroup = Y.extend(ButtonGroup, Y.Widget, {

    /**
     * @method renderUI
     * @description Creates a visual representation of the widget based on existing parameters.
     * @public
     */
    renderUI: function() {
        _yuitest_coverfunc("build/button-group/button-group.js", "renderUI", 34);
_yuitest_coverline("build/button-group/button-group.js", 35);
this.getButtons().plug(Y.Plugin.Button);
    },

    /**
     * @method bindUI
     * @description Hooks up events for the widget
     * @public
     */
    bindUI: function() {
        _yuitest_coverfunc("build/button-group/button-group.js", "bindUI", 43);
_yuitest_coverline("build/button-group/button-group.js", 44);
var group = this,
            cb = group.get(CONTENT_BOX);

        _yuitest_coverline("build/button-group/button-group.js", 47);
cb.delegate(CLICK_EVENT, group._handleClick, Y.ButtonGroup.BUTTON_SELECTOR, group);
    },

    /**
    * @method getButtons
    * @description Returns all buttons inside this this button group
    * @public
    */
    getButtons: function() {
        _yuitest_coverfunc("build/button-group/button-group.js", "getButtons", 55);
_yuitest_coverline("build/button-group/button-group.js", 56);
var cb = this.get(CONTENT_BOX);

        _yuitest_coverline("build/button-group/button-group.js", 58);
return cb.all(Y.ButtonGroup.BUTTON_SELECTOR);
    },

    /**
    * @method getSelectedButtons
    * @description Returns all Y.Buttons instances that are selected
    * @public
    */
    getSelectedButtons: function() {
        _yuitest_coverfunc("build/button-group/button-group.js", "getSelectedButtons", 66);
_yuitest_coverline("build/button-group/button-group.js", 67);
var group = this,
            selected = [],
            buttons = group.getButtons(),
            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED;

        _yuitest_coverline("build/button-group/button-group.js", 72);
buttons.each(function(node){
            _yuitest_coverfunc("build/button-group/button-group.js", "(anonymous 2)", 72);
_yuitest_coverline("build/button-group/button-group.js", 73);
if (node.hasClass(selectedClass)){
                _yuitest_coverline("build/button-group/button-group.js", 74);
selected.push(node);
            }
        });

        _yuitest_coverline("build/button-group/button-group.js", 78);
return selected;
    },

    /**
    * @method getSelectedValues
    * @description Returns the values of all Y.Button instances that are selected
    * @public
    */
    getSelectedValues: function() {
        _yuitest_coverfunc("build/button-group/button-group.js", "getSelectedValues", 86);
_yuitest_coverline("build/button-group/button-group.js", 87);
var group = this,
            value,
            values = [],
            selected = group.getSelectedButtons(),
            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED;

        _yuitest_coverline("build/button-group/button-group.js", 93);
Y.Array.each(selected, function(node){
            _yuitest_coverfunc("build/button-group/button-group.js", "(anonymous 3)", 93);
_yuitest_coverline("build/button-group/button-group.js", 94);
if (node.hasClass(selectedClass)){
                _yuitest_coverline("build/button-group/button-group.js", 95);
value = node.getContent();
                _yuitest_coverline("build/button-group/button-group.js", 96);
values.push(value);
            }
        });

        _yuitest_coverline("build/button-group/button-group.js", 100);
return values;
    },

    /**
    * @method _handleClick
    * @description A delegated click handler for when any button is clicked in the content box
    * @param e {Object} An event object
    * @private
    */
    _handleClick: function(e){
        _yuitest_coverfunc("build/button-group/button-group.js", "_handleClick", 109);
_yuitest_coverline("build/button-group/button-group.js", 110);
var group = this,
            clickedNode = e.target.ancestor('.' + ButtonGroup.CLASS_NAMES.BUTTON, true),
            type = group.get('type'),
            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED,
            isSelected = clickedNode.hasClass(selectedClass),
            buttons;

        // TODO: Anything for 'push' groups?

        _yuitest_coverline("build/button-group/button-group.js", 119);
if (type === 'checkbox') {
            _yuitest_coverline("build/button-group/button-group.js", 120);
clickedNode.toggleClass(selectedClass, !isSelected);
            /**
             * @event selectionChange
             * @description fires when any button in the group changes its checked status
             * @param {Event} the event object. It contains an "originEvent" property
             * linking to the original DOM event that triggered the selection change
             */
            _yuitest_coverline("build/button-group/button-group.js", 127);
group.fire('selectionChange', {originEvent: e});
        }
        else {_yuitest_coverline("build/button-group/button-group.js", 129);
if (type === 'radio') {
            _yuitest_coverline("build/button-group/button-group.js", 130);
if (!isSelected) {
                _yuitest_coverline("build/button-group/button-group.js", 131);
buttons = group.getButtons(); // Todo: getSelectedButtons()? Need it to return an arraylist then.
                _yuitest_coverline("build/button-group/button-group.js", 132);
buttons.removeClass(selectedClass);
                _yuitest_coverline("build/button-group/button-group.js", 133);
clickedNode.addClass(selectedClass);
                _yuitest_coverline("build/button-group/button-group.js", 134);
group.fire('selectionChange', {originEvent: e});
            }
        }}
    }

}, {
    // Y.ButtonGroup static properties

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
    NAME: 'buttongroup',

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
            writeOnce: 'initOnly',
            value: 'radio'
        }
    },

    /**
     * List of class names to use for ButtonGroups
     *
     * @property CLASS_NAMES
     * @type {Object}
     * @static
     */
    CLASS_NAMES: CLASS_NAMES,
    
    /**
     * Selector used to find buttons inside a ButtonGroup
     * @type {String}
     */
    BUTTON_SELECTOR: "button, input[type=button], input[type=reset], input[type=submit], input[type=radio], input[type=checkbox]"
});


}, '3.7.3', {"requires": ["button-plugin", "cssbutton", "widget"]});
