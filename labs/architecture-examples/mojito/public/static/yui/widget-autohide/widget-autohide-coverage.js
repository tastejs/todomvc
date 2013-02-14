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
_yuitest_coverage["build/widget-autohide/widget-autohide.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-autohide/widget-autohide.js",
    code: []
};
_yuitest_coverage["build/widget-autohide/widget-autohide.js"].code=["YUI.add('widget-autohide', function (Y, NAME) {","","/**"," * A widget-level extension that provides ability to hide widget when"," * certain events occur."," *"," * @module widget-autohide"," * @author eferraiuolo, tilomitra"," * @since 3.4.0"," */","","","var WIDGET_AUTOHIDE    = 'widgetAutohide',","    AUTOHIDE            = 'autohide',","    CLICK_OUTSIDE     = 'clickoutside',","    FOCUS_OUTSIDE     = 'focusoutside',","    DOCUMENT            = 'document',","    KEY                 = 'key',","    PRESS_ESCAPE         = 'esc',","    BIND_UI             = 'bindUI',","    SYNC_UI             = \"syncUI\",","    RENDERED            = \"rendered\",","    BOUNDING_BOX        = \"boundingBox\",","    VISIBLE             = \"visible\",","    CHANGE              = 'Change',","","    getCN               = Y.ClassNameManager.getClassName;","","/**"," * The WidgetAutohide class provides the hideOn attribute which can"," * be used to hide the widget when certain events occur."," *"," * @class WidgetAutohide"," * @param {Object} config User configuration object"," */","function WidgetAutohide(config) {","    Y.after(this._bindUIAutohide, this, BIND_UI);","    Y.after(this._syncUIAutohide, this, SYNC_UI);","","","    if (this.get(RENDERED)) {","        this._bindUIAutohide();","        this._syncUIAutohide();","    }","","}","","/**","* Static property used to define the default attribute","* configuration introduced by WidgetAutohide.","*","* @property ATTRS","* @static","* @type Object","*/","WidgetAutohide.ATTRS = {","","","    /**","     * @attribute hideOn","     * @type array","     *","     * @description An array of objects corresponding to the nodes, events, and keycodes to hide the widget on.","     * The implementer can supply an array of objects, with each object having the following properties:","     * <p>eventName: (string, required): The eventName to listen to.</p>","     * <p>node: (Y.Node, optional): The Y.Node that will fire the event (defaults to the boundingBox of the widget)</p>","     * <p>keyCode: (string, optional): If listening for key events, specify the keyCode</p>","     * <p>By default, this attribute consists of one object which will cause the widget to hide if the","     * escape key is pressed.</p>","     */","    hideOn: {","        validator: Y.Lang.isArray,","        valueFn  : function() {","            return [","                {","                    node: Y.one(DOCUMENT),","                    eventName: KEY,","                    keyCode: PRESS_ESCAPE","                }","            ];","        }","    }","};","","WidgetAutohide.prototype = {","    // *** Instance Members *** //","","        _uiHandlesAutohide : null,","","        // *** Lifecycle Methods *** //","","        destructor : function () {","","            this._detachUIHandlesAutohide();","        },","","        /**","         * Binds event listeners to the widget.","         * <p>","         * This method in invoked after bindUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _bindUIAutohide","         * @protected","         */","        _bindUIAutohide : function () {","","            this.after(VISIBLE+CHANGE, this._afterHostVisibleChangeAutohide);","            this.after(\"hideOnChange\", this._afterHideOnChange);","        },","","        /**","         * Syncs up the widget based on its current state. In particular, removes event listeners if","         * widget is not visible, and attaches them otherwise.","         * <p>","         * This method in invoked after syncUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _syncUIAutohide","         * @protected","         */","        _syncUIAutohide : function () {","","            this._uiSetHostVisibleAutohide(this.get(VISIBLE));","        },","","        // *** Private Methods *** //","","        /**","         * Removes event listeners if widget is not visible, and attaches them otherwise.","         *","         * @method _uiSetHostVisibleAutohide","         * @protected","         */","        _uiSetHostVisibleAutohide : function (visible) {","","            if (visible) {","                //this._attachUIHandlesAutohide();","                Y.later(1, this, '_attachUIHandlesAutohide');","            } else {","                this._detachUIHandlesAutohide();","            }","        },","","        /**","         * Iterates through all objects in the hideOn attribute and creates event listeners.","         *","         * @method _attachUIHandlesAutohide","         * @protected","         */","        _attachUIHandlesAutohide : function () {","","            if (this._uiHandlesAutohide) { return; }","","            var bb = this.get(BOUNDING_BOX),","                hide = Y.bind(this.hide,this),","                uiHandles = [],","                self = this,","                hideOn = this.get('hideOn'),","                i = 0,","                o = {node: undefined, ev: undefined, keyCode: undefined};","","                //push all events on which the widget should be hidden","                for (; i < hideOn.length; i++) {","","                    o.node = hideOn[i].node;","                    o.ev = hideOn[i].eventName;","                    o.keyCode = hideOn[i].keyCode;","","                    //no keycode or node defined","                    if (!o.node && !o.keyCode && o.ev) {","                        uiHandles.push(bb.on(o.ev, hide));","                    }","","                    //node defined, no keycode (not a keypress)","                    else if (o.node && !o.keyCode && o.ev) {","                        uiHandles.push(o.node.on(o.ev, hide));","                    }","","                    //node defined, keycode defined, event defined (its a key press)","                    else if (o.node && o.keyCode && o.ev) {","                        uiHandles.push(o.node.on(o.ev, hide, o.keyCode));","                    }","","                    else {","                    }","","                }","","            this._uiHandlesAutohide = uiHandles;","        },","","        /**","         * Detaches all event listeners created by this extension","         *","         * @method _detachUIHandlesAutohide","         * @protected","         */","        _detachUIHandlesAutohide : function () {","","            Y.each(this._uiHandlesAutohide, function(h){","                h.detach();","            });","            this._uiHandlesAutohide = null;","        },","","        /**","         * Default function called when the visibility of the widget changes. Determines","         * whether to attach or detach event listeners based on the visibility of the widget.","         *","         * @method _afterHostVisibleChangeAutohide","         * @protected","         */","        _afterHostVisibleChangeAutohide : function (e) {","","            this._uiSetHostVisibleAutohide(e.newVal);","        },","","        /**","         * Default function called when hideOn Attribute is changed. Remove existing listeners and create new listeners.","         *","         * @method _afterHideOnChange","         */","        _afterHideOnChange : function(e) {","            this._detachUIHandlesAutohide();","","            if (this.get(VISIBLE)) {","                this._attachUIHandlesAutohide();","            }","        }","};","","Y.WidgetAutohide = WidgetAutohide;","","","}, '3.7.3', {\"requires\": [\"base-build\", \"event-key\", \"event-outside\", \"widget\"]});"];
_yuitest_coverage["build/widget-autohide/widget-autohide.js"].lines = {"1":0,"13":0,"36":0,"37":0,"38":0,"41":0,"42":0,"43":0,"56":0,"74":0,"85":0,"94":0,"108":0,"109":0,"124":0,"137":0,"139":0,"141":0,"153":0,"155":0,"164":0,"166":0,"167":0,"168":0,"171":0,"172":0,"176":0,"177":0,"181":0,"182":0,"190":0,"201":0,"202":0,"204":0,"216":0,"225":0,"227":0,"228":0,"233":0};
_yuitest_coverage["build/widget-autohide/widget-autohide.js"].functions = {"WidgetAutohide:36":0,"valueFn:73":0,"destructor:92":0,"_bindUIAutohide:106":0,"_syncUIAutohide:122":0,"_uiSetHostVisibleAutohide:135":0,"_attachUIHandlesAutohide:151":0,"(anonymous 2):201":0,"_detachUIHandlesAutohide:199":0,"_afterHostVisibleChangeAutohide:214":0,"_afterHideOnChange:224":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-autohide/widget-autohide.js"].coveredLines = 39;
_yuitest_coverage["build/widget-autohide/widget-autohide.js"].coveredFunctions = 12;
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 1);
YUI.add('widget-autohide', function (Y, NAME) {

/**
 * A widget-level extension that provides ability to hide widget when
 * certain events occur.
 *
 * @module widget-autohide
 * @author eferraiuolo, tilomitra
 * @since 3.4.0
 */


_yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 13);
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
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 36);
function WidgetAutohide(config) {
    _yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "WidgetAutohide", 36);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 37);
Y.after(this._bindUIAutohide, this, BIND_UI);
    _yuitest_coverline("build/widget-autohide/widget-autohide.js", 38);
Y.after(this._syncUIAutohide, this, SYNC_UI);


    _yuitest_coverline("build/widget-autohide/widget-autohide.js", 41);
if (this.get(RENDERED)) {
        _yuitest_coverline("build/widget-autohide/widget-autohide.js", 42);
this._bindUIAutohide();
        _yuitest_coverline("build/widget-autohide/widget-autohide.js", 43);
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
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 56);
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
            _yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "valueFn", 73);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 74);
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

_yuitest_coverline("build/widget-autohide/widget-autohide.js", 85);
WidgetAutohide.prototype = {
    // *** Instance Members *** //

        _uiHandlesAutohide : null,

        // *** Lifecycle Methods *** //

        destructor : function () {

            _yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "destructor", 92);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 94);
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

            _yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "_bindUIAutohide", 106);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 108);
this.after(VISIBLE+CHANGE, this._afterHostVisibleChangeAutohide);
            _yuitest_coverline("build/widget-autohide/widget-autohide.js", 109);
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

            _yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "_syncUIAutohide", 122);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 124);
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

            _yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "_uiSetHostVisibleAutohide", 135);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 137);
if (visible) {
                //this._attachUIHandlesAutohide();
                _yuitest_coverline("build/widget-autohide/widget-autohide.js", 139);
Y.later(1, this, '_attachUIHandlesAutohide');
            } else {
                _yuitest_coverline("build/widget-autohide/widget-autohide.js", 141);
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

            _yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "_attachUIHandlesAutohide", 151);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 153);
if (this._uiHandlesAutohide) { return; }

            _yuitest_coverline("build/widget-autohide/widget-autohide.js", 155);
var bb = this.get(BOUNDING_BOX),
                hide = Y.bind(this.hide,this),
                uiHandles = [],
                self = this,
                hideOn = this.get('hideOn'),
                i = 0,
                o = {node: undefined, ev: undefined, keyCode: undefined};

                //push all events on which the widget should be hidden
                _yuitest_coverline("build/widget-autohide/widget-autohide.js", 164);
for (; i < hideOn.length; i++) {

                    _yuitest_coverline("build/widget-autohide/widget-autohide.js", 166);
o.node = hideOn[i].node;
                    _yuitest_coverline("build/widget-autohide/widget-autohide.js", 167);
o.ev = hideOn[i].eventName;
                    _yuitest_coverline("build/widget-autohide/widget-autohide.js", 168);
o.keyCode = hideOn[i].keyCode;

                    //no keycode or node defined
                    _yuitest_coverline("build/widget-autohide/widget-autohide.js", 171);
if (!o.node && !o.keyCode && o.ev) {
                        _yuitest_coverline("build/widget-autohide/widget-autohide.js", 172);
uiHandles.push(bb.on(o.ev, hide));
                    }

                    //node defined, no keycode (not a keypress)
                    else {_yuitest_coverline("build/widget-autohide/widget-autohide.js", 176);
if (o.node && !o.keyCode && o.ev) {
                        _yuitest_coverline("build/widget-autohide/widget-autohide.js", 177);
uiHandles.push(o.node.on(o.ev, hide));
                    }

                    //node defined, keycode defined, event defined (its a key press)
                    else {_yuitest_coverline("build/widget-autohide/widget-autohide.js", 181);
if (o.node && o.keyCode && o.ev) {
                        _yuitest_coverline("build/widget-autohide/widget-autohide.js", 182);
uiHandles.push(o.node.on(o.ev, hide, o.keyCode));
                    }

                    else {
                    }}}

                }

            _yuitest_coverline("build/widget-autohide/widget-autohide.js", 190);
this._uiHandlesAutohide = uiHandles;
        },

        /**
         * Detaches all event listeners created by this extension
         *
         * @method _detachUIHandlesAutohide
         * @protected
         */
        _detachUIHandlesAutohide : function () {

            _yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "_detachUIHandlesAutohide", 199);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 201);
Y.each(this._uiHandlesAutohide, function(h){
                _yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "(anonymous 2)", 201);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 202);
h.detach();
            });
            _yuitest_coverline("build/widget-autohide/widget-autohide.js", 204);
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

            _yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "_afterHostVisibleChangeAutohide", 214);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 216);
this._uiSetHostVisibleAutohide(e.newVal);
        },

        /**
         * Default function called when hideOn Attribute is changed. Remove existing listeners and create new listeners.
         *
         * @method _afterHideOnChange
         */
        _afterHideOnChange : function(e) {
            _yuitest_coverfunc("build/widget-autohide/widget-autohide.js", "_afterHideOnChange", 224);
_yuitest_coverline("build/widget-autohide/widget-autohide.js", 225);
this._detachUIHandlesAutohide();

            _yuitest_coverline("build/widget-autohide/widget-autohide.js", 227);
if (this.get(VISIBLE)) {
                _yuitest_coverline("build/widget-autohide/widget-autohide.js", 228);
this._attachUIHandlesAutohide();
            }
        }
};

_yuitest_coverline("build/widget-autohide/widget-autohide.js", 233);
Y.WidgetAutohide = WidgetAutohide;


}, '3.7.3', {"requires": ["base-build", "event-key", "event-outside", "widget"]});
