/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('button-group', function (Y, NAME) {

/**
* A Widget to create groups of buttons
*
* @module button-group
* @since 3.5.0
*/

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
function ButtonGroup() {
    ButtonGroup.superclass.constructor.apply(this, arguments);
}

/* ButtonGroup extends Widget */
Y.ButtonGroup = Y.extend(ButtonGroup, Y.Widget, {

    /**
     * @method renderUI
     * @description Creates a visual representation of the widget based on existing parameters.
     * @public
     */
    renderUI: function() {
        this.getButtons().plug(Y.Plugin.Button);
    },

    /**
     * @method bindUI
     * @description Hooks up events for the widget
     * @public
     */
    bindUI: function() {
        var group = this,
            cb = group.get(CONTENT_BOX);

        cb.delegate(CLICK_EVENT, group._handleClick, Y.ButtonGroup.BUTTON_SELECTOR, group);
    },

    /**
    * @method getButtons
    * @description Returns all buttons inside this this button group
    * @public
    */
    getButtons: function() {
        var cb = this.get(CONTENT_BOX);

        return cb.all(Y.ButtonGroup.BUTTON_SELECTOR);
    },

    /**
    * @method getSelectedButtons
    * @description Returns all Y.Buttons instances that are selected
    * @public
    */
    getSelectedButtons: function() {
        var group = this,
            selected = [],
            buttons = group.getButtons(),
            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED;

        buttons.each(function(node){
            if (node.hasClass(selectedClass)){
                selected.push(node);
            }
        });

        return selected;
    },

    /**
    * @method getSelectedValues
    * @description Returns the values of all Y.Button instances that are selected
    * @public
    */
    getSelectedValues: function() {
        var group = this,
            value,
            values = [],
            selected = group.getSelectedButtons(),
            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED;

        Y.Array.each(selected, function(node){
            if (node.hasClass(selectedClass)){
                value = node.getContent();
                values.push(value);
            }
        });

        return values;
    },

    /**
    * @method _handleClick
    * @description A delegated click handler for when any button is clicked in the content box
    * @param e {Object} An event object
    * @private
    */
    _handleClick: function(e){
        var group = this,
            clickedNode = e.target.ancestor('.' + ButtonGroup.CLASS_NAMES.BUTTON, true),
            type = group.get('type'),
            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED,
            isSelected = clickedNode.hasClass(selectedClass),
            buttons;

        // TODO: Anything for 'push' groups?

        if (type === 'checkbox') {
            clickedNode.toggleClass(selectedClass, !isSelected);
            /**
             * @event selectionChange
             * @description fires when any button in the group changes its checked status
             * @param {Event} the event object. It contains an "originEvent" property
             * linking to the original DOM event that triggered the selection change
             */
            group.fire('selectionChange', {originEvent: e});
        }
        else if (type === 'radio') {
            if (!isSelected) {
                buttons = group.getButtons(); // Todo: getSelectedButtons()? Need it to return an arraylist then.
                buttons.removeClass(selectedClass);
                clickedNode.addClass(selectedClass);
                group.fire('selectionChange', {originEvent: e});
            }
        }
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
