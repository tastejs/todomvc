/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('widget-autohide', function (Y, NAME) {

/**
 * A widget-level extension that provides ability to hide widget when
 * certain events occur.
 *
 * @module widget-autohide
 * @author eferraiuolo, tilomitra
 * @since 3.4.0
 */


var WIDGET_AUTOHIDE    = 'widgetAutohide',
    AUTOHIDE            = 'autohide',
    CLICK_OUTSIDE     = 'clickoutside',
    FOCUS_OUTSIDE     = 'focusoutside',
    DOCUMENT            = 'document',
    KEY                 = 'key',
    PRESS_ESCAPE         = 'esc',
    BIND_UI             = 'bindUI',
    SYNC_UI             = "syncUI",
    RENDERED            = "rendered",
    BOUNDING_BOX        = "boundingBox",
    VISIBLE             = "visible",
    CHANGE              = 'Change',

    getCN               = Y.ClassNameManager.getClassName;

/**
 * The WidgetAutohide class provides the hideOn attribute which can
 * be used to hide the widget when certain events occur.
 *
 * @class WidgetAutohide
 * @param {Object} config User configuration object
 */
function WidgetAutohide(config) {
    Y.after(this._bindUIAutohide, this, BIND_UI);
    Y.after(this._syncUIAutohide, this, SYNC_UI);


    if (this.get(RENDERED)) {
        this._bindUIAutohide();
        this._syncUIAutohide();
    }

}

/**
* Static property used to define the default attribute
* configuration introduced by WidgetAutohide.
*
* @property ATTRS
* @static
* @type Object
*/
WidgetAutohide.ATTRS = {


    /**
     * @attribute hideOn
     * @type array
     *
     * @description An array of objects corresponding to the nodes, events, and keycodes to hide the widget on.
     * The implementer can supply an array of objects, with each object having the following properties:
     * <p>eventName: (string, required): The eventName to listen to.</p>
     * <p>node: (Y.Node, optional): The Y.Node that will fire the event (defaults to the boundingBox of the widget)</p>
     * <p>keyCode: (string, optional): If listening for key events, specify the keyCode</p>
     * <p>By default, this attribute consists of one object which will cause the widget to hide if the
     * escape key is pressed.</p>
     */
    hideOn: {
        validator: Y.Lang.isArray,
        valueFn  : function() {
            return [
                {
                    node: Y.one(DOCUMENT),
                    eventName: KEY,
                    keyCode: PRESS_ESCAPE
                }
            ];
        }
    }
};

WidgetAutohide.prototype = {
    // *** Instance Members *** //

        _uiHandlesAutohide : null,

        // *** Lifecycle Methods *** //

        destructor : function () {

            this._detachUIHandlesAutohide();
        },

        /**
         * Binds event listeners to the widget.
         * <p>
         * This method in invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIAutohide
         * @protected
         */
        _bindUIAutohide : function () {

            this.after(VISIBLE+CHANGE, this._afterHostVisibleChangeAutohide);
            this.after("hideOnChange", this._afterHideOnChange);
        },

        /**
         * Syncs up the widget based on its current state. In particular, removes event listeners if
         * widget is not visible, and attaches them otherwise.
         * <p>
         * This method in invoked after syncUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _syncUIAutohide
         * @protected
         */
        _syncUIAutohide : function () {

            this._uiSetHostVisibleAutohide(this.get(VISIBLE));
        },

        // *** Private Methods *** //

        /**
         * Removes event listeners if widget is not visible, and attaches them otherwise.
         *
         * @method _uiSetHostVisibleAutohide
         * @protected
         */
        _uiSetHostVisibleAutohide : function (visible) {

            if (visible) {
                //this._attachUIHandlesAutohide();
                Y.later(1, this, '_attachUIHandlesAutohide');
            } else {
                this._detachUIHandlesAutohide();
            }
        },

        /**
         * Iterates through all objects in the hideOn attribute and creates event listeners.
         *
         * @method _attachUIHandlesAutohide
         * @protected
         */
        _attachUIHandlesAutohide : function () {

            if (this._uiHandlesAutohide) { return; }

            var bb = this.get(BOUNDING_BOX),
                hide = Y.bind(this.hide,this),
                uiHandles = [],
                self = this,
                hideOn = this.get('hideOn'),
                i = 0,
                o = {node: undefined, ev: undefined, keyCode: undefined};

                //push all events on which the widget should be hidden
                for (; i < hideOn.length; i++) {

                    o.node = hideOn[i].node;
                    o.ev = hideOn[i].eventName;
                    o.keyCode = hideOn[i].keyCode;

                    //no keycode or node defined
                    if (!o.node && !o.keyCode && o.ev) {
                        uiHandles.push(bb.on(o.ev, hide));
                    }

                    //node defined, no keycode (not a keypress)
                    else if (o.node && !o.keyCode && o.ev) {
                        uiHandles.push(o.node.on(o.ev, hide));
                    }

                    //node defined, keycode defined, event defined (its a key press)
                    else if (o.node && o.keyCode && o.ev) {
                        uiHandles.push(o.node.on(o.ev, hide, o.keyCode));
                    }

                    else {
                    }

                }

            this._uiHandlesAutohide = uiHandles;
        },

        /**
         * Detaches all event listeners created by this extension
         *
         * @method _detachUIHandlesAutohide
         * @protected
         */
        _detachUIHandlesAutohide : function () {

            Y.each(this._uiHandlesAutohide, function(h){
                h.detach();
            });
            this._uiHandlesAutohide = null;
        },

        /**
         * Default function called when the visibility of the widget changes. Determines
         * whether to attach or detach event listeners based on the visibility of the widget.
         *
         * @method _afterHostVisibleChangeAutohide
         * @protected
         */
        _afterHostVisibleChangeAutohide : function (e) {

            this._uiSetHostVisibleAutohide(e.newVal);
        },

        /**
         * Default function called when hideOn Attribute is changed. Remove existing listeners and create new listeners.
         *
         * @method _afterHideOnChange
         */
        _afterHideOnChange : function(e) {
            this._detachUIHandlesAutohide();

            if (this.get(VISIBLE)) {
                this._attachUIHandlesAutohide();
            }
        }
};

Y.WidgetAutohide = WidgetAutohide;


}, '3.7.3', {"requires": ["base-build", "event-key", "event-outside", "widget"]});
