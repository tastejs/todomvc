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
_yuitest_coverage["build/widget-position/widget-position.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-position/widget-position.js",
    code: []
};
_yuitest_coverage["build/widget-position/widget-position.js"].code=["YUI.add('widget-position', function (Y, NAME) {","","/**"," * Provides basic XY positioning support for Widgets, though an extension"," *"," * @module widget-position"," */","    var Lang = Y.Lang,","        Widget = Y.Widget,","","        XY_COORD = \"xy\",","","        POSITION = \"position\",","        POSITIONED = \"positioned\",","        BOUNDING_BOX = \"boundingBox\",","        RELATIVE = \"relative\",","","        RENDERUI = \"renderUI\",","        BINDUI = \"bindUI\",","        SYNCUI = \"syncUI\",","","        UI = Widget.UI_SRC,","","        XYChange = \"xyChange\";","","    /**","     * Widget extension, which can be used to add positioning support to the base Widget class, ","     * through the <a href=\"Base.html#method_build\">Base.build</a> method.","     *","     * @class WidgetPosition","     * @param {Object} config User configuration object","     */","    function Position(config) {","        this._posNode = this.get(BOUNDING_BOX);","","        // WIDGET METHOD OVERLAP","        Y.after(this._renderUIPosition, this, RENDERUI);","        Y.after(this._syncUIPosition, this, SYNCUI);","        Y.after(this._bindUIPosition, this, BINDUI);","    }","","    /**","     * Static property used to define the default attribute ","     * configuration introduced by WidgetPosition.","     *","     * @property ATTRS","     * @static","     * @type Object","     */","    Position.ATTRS = {","","        /**","         * @attribute x","         * @type number","         * @default 0","         *","         * @description Page X co-ordinate for the widget. This attribute acts as a facade for the ","         * xy attribute. Changes in position can be monitored by listening for xyChange events.","         */","        x: {","            setter: function(val) {","                this._setX(val);","            },","            getter: function() {","                return this._getX();","            },","            lazyAdd:false","        },","","        /**","         * @attribute y","         * @type number","         * @default 0","         *","         * @description Page Y co-ordinate for the widget. This attribute acts as a facade for the ","         * xy attribute. Changes in position can be monitored by listening for xyChange events.","         */","        y: {","            setter: function(val) {","                this._setY(val);","            },","            getter: function() {","                return this._getY();","            },","            lazyAdd: false","        },","","        /**","         * @attribute xy","         * @type Array","         * @default [0,0]","         *","         * @description Page XY co-ordinate pair for the widget.","         */","        xy: {","            value:[0,0],","            validator: function(val) {","                return this._validateXY(val);","            }","        }","    };","","    /**","     * Default class used to mark the boundingBox of a positioned widget.","     *","     * @property POSITIONED_CLASS_NAME","     * @type String","     * @default \"yui-widget-positioned\"","     * @static","     */","    Position.POSITIONED_CLASS_NAME = Widget.getClassName(POSITIONED);","","    Position.prototype = {","","        /**","         * Creates/Initializes the DOM to support xy page positioning.","         * <p>","         * This method in invoked after renderUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _renderUIPosition","         * @protected","         */","        _renderUIPosition : function() {","            this._posNode.addClass(Position.POSITIONED_CLASS_NAME);","        },","","        /**","         * Synchronizes the UI to match the Widgets xy page position state.","         * <p>","         * This method in invoked after syncUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _syncUIPosition","         * @protected","         */","        _syncUIPosition : function() {","            var posNode = this._posNode;","            if (posNode.getStyle(POSITION) === RELATIVE) {","                this.syncXY();","            }","            this._uiSetXY(this.get(XY_COORD));","        },","","        /**","         * Binds event listeners responsible for updating the UI state in response to ","         * Widget position related state changes.","         * <p>","         * This method in invoked after bindUI is invoked for the Widget class","         * using YUI's aop infrastructure.","         * </p>","         * @method _bindUIPosition","         * @protected","         */","        _bindUIPosition :function() {","            this.after(XYChange, this._afterXYChange);","        },","","        /**","         * Moves the Widget to the specified page xy co-ordinate position.","         *","         * @method move","         *","         * @param {Number} x The new x position","         * @param {Number} y The new y position","         * <p>Or</p>","         * @param {Array} x, y values passed as an array ([x, y]), to support","         * simple pass through of Node.getXY results","         */","        move: function () {","            var args = arguments,","                coord = (Lang.isArray(args[0])) ? args[0] : [args[0], args[1]];","                this.set(XY_COORD, coord);","        },","","        /**","         * Synchronizes the Panel's \"xy\", \"x\", and \"y\" properties with the ","         * Widget's position in the DOM.","         *","         * @method syncXY","         */","        syncXY : function () {","            this.set(XY_COORD, this._posNode.getXY(), {src: UI});","        },","","        /**","         * Default validator for the XY attribute","         *","         * @method _validateXY","         * @protected","         * @param {Array} val The XY page co-ordinate value which is being set.","         * @return {boolean} true if valid, false if not.","         */","        _validateXY : function(val) {","            return (Lang.isArray(val) && Lang.isNumber(val[0]) && Lang.isNumber(val[1]));","        },","","        /**","         * Default setter for the X attribute. The setter passes the X value through","         * to the XY attribute, which is the sole store for the XY state.","         *","         * @method _setX","         * @protected","         * @param {Number} val The X page co-ordinate value","         */","        _setX : function(val) {","            this.set(XY_COORD, [val, this.get(XY_COORD)[1]]);","        },","","        /**","         * Default setter for the Y attribute. The setter passes the Y value through","         * to the XY attribute, which is the sole store for the XY state.","         *","         * @method _setY","         * @protected","         * @param {Number} val The Y page co-ordinate value","         */","        _setY : function(val) {","            this.set(XY_COORD, [this.get(XY_COORD)[0], val]);","        },","","        /**","         * Default getter for the X attribute. The value is retrieved from ","         * the XY attribute, which is the sole store for the XY state.","         *","         * @method _getX","         * @protected ","         * @return {Number} The X page co-ordinate value","         */","        _getX : function() {","            return this.get(XY_COORD)[0];","        },","","        /**","         * Default getter for the Y attribute. The value is retrieved from ","         * the XY attribute, which is the sole store for the XY state.","         *","         * @method _getY","         * @protected ","         * @return {Number} The Y page co-ordinate value","         */","        _getY : function() {","            return this.get(XY_COORD)[1];","        },","","        /**","         * Default attribute change listener for the xy attribute, responsible","         * for updating the UI, in response to attribute changes.","         * ","         * @method _afterXYChange","         * @protected","         * @param {EventFacade} e The event facade for the attribute change","         */","        _afterXYChange : function(e) {","            if (e.src != UI) {","                this._uiSetXY(e.newVal);","            }","        },","","        /**","         * Updates the UI to reflect the XY page co-ordinates passed in.","         * ","         * @method _uiSetXY","         * @protected","         * @param {String} val The XY page co-ordinates value to be reflected in the UI","         */","        _uiSetXY : function(val) {","            this._posNode.setXY(val);","        }","    };","","    Y.WidgetPosition = Position;","","","}, '3.7.3', {\"requires\": [\"base-build\", \"node-screen\", \"widget\"]});"];
_yuitest_coverage["build/widget-position/widget-position.js"].lines = {"1":0,"8":0,"33":0,"34":0,"37":0,"38":0,"39":0,"50":0,"62":0,"65":0,"80":0,"83":0,"98":0,"111":0,"113":0,"125":0,"138":0,"139":0,"140":0,"142":0,"156":0,"171":0,"173":0,"183":0,"195":0,"207":0,"219":0,"231":0,"243":0,"255":0,"256":0,"268":0,"272":0};
_yuitest_coverage["build/widget-position/widget-position.js"].functions = {"Position:33":0,"setter:61":0,"getter:64":0,"setter:79":0,"getter:82":0,"validator:97":0,"_renderUIPosition:124":0,"_syncUIPosition:137":0,"_bindUIPosition:155":0,"move:170":0,"syncXY:182":0,"_validateXY:194":0,"_setX:206":0,"_setY:218":0,"_getX:230":0,"_getY:242":0,"_afterXYChange:254":0,"_uiSetXY:267":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-position/widget-position.js"].coveredLines = 33;
_yuitest_coverage["build/widget-position/widget-position.js"].coveredFunctions = 19;
_yuitest_coverline("build/widget-position/widget-position.js", 1);
YUI.add('widget-position', function (Y, NAME) {

/**
 * Provides basic XY positioning support for Widgets, though an extension
 *
 * @module widget-position
 */
    _yuitest_coverfunc("build/widget-position/widget-position.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-position/widget-position.js", 8);
var Lang = Y.Lang,
        Widget = Y.Widget,

        XY_COORD = "xy",

        POSITION = "position",
        POSITIONED = "positioned",
        BOUNDING_BOX = "boundingBox",
        RELATIVE = "relative",

        RENDERUI = "renderUI",
        BINDUI = "bindUI",
        SYNCUI = "syncUI",

        UI = Widget.UI_SRC,

        XYChange = "xyChange";

    /**
     * Widget extension, which can be used to add positioning support to the base Widget class, 
     * through the <a href="Base.html#method_build">Base.build</a> method.
     *
     * @class WidgetPosition
     * @param {Object} config User configuration object
     */
    _yuitest_coverline("build/widget-position/widget-position.js", 33);
function Position(config) {
        _yuitest_coverfunc("build/widget-position/widget-position.js", "Position", 33);
_yuitest_coverline("build/widget-position/widget-position.js", 34);
this._posNode = this.get(BOUNDING_BOX);

        // WIDGET METHOD OVERLAP
        _yuitest_coverline("build/widget-position/widget-position.js", 37);
Y.after(this._renderUIPosition, this, RENDERUI);
        _yuitest_coverline("build/widget-position/widget-position.js", 38);
Y.after(this._syncUIPosition, this, SYNCUI);
        _yuitest_coverline("build/widget-position/widget-position.js", 39);
Y.after(this._bindUIPosition, this, BINDUI);
    }

    /**
     * Static property used to define the default attribute 
     * configuration introduced by WidgetPosition.
     *
     * @property ATTRS
     * @static
     * @type Object
     */
    _yuitest_coverline("build/widget-position/widget-position.js", 50);
Position.ATTRS = {

        /**
         * @attribute x
         * @type number
         * @default 0
         *
         * @description Page X co-ordinate for the widget. This attribute acts as a facade for the 
         * xy attribute. Changes in position can be monitored by listening for xyChange events.
         */
        x: {
            setter: function(val) {
                _yuitest_coverfunc("build/widget-position/widget-position.js", "setter", 61);
_yuitest_coverline("build/widget-position/widget-position.js", 62);
this._setX(val);
            },
            getter: function() {
                _yuitest_coverfunc("build/widget-position/widget-position.js", "getter", 64);
_yuitest_coverline("build/widget-position/widget-position.js", 65);
return this._getX();
            },
            lazyAdd:false
        },

        /**
         * @attribute y
         * @type number
         * @default 0
         *
         * @description Page Y co-ordinate for the widget. This attribute acts as a facade for the 
         * xy attribute. Changes in position can be monitored by listening for xyChange events.
         */
        y: {
            setter: function(val) {
                _yuitest_coverfunc("build/widget-position/widget-position.js", "setter", 79);
_yuitest_coverline("build/widget-position/widget-position.js", 80);
this._setY(val);
            },
            getter: function() {
                _yuitest_coverfunc("build/widget-position/widget-position.js", "getter", 82);
_yuitest_coverline("build/widget-position/widget-position.js", 83);
return this._getY();
            },
            lazyAdd: false
        },

        /**
         * @attribute xy
         * @type Array
         * @default [0,0]
         *
         * @description Page XY co-ordinate pair for the widget.
         */
        xy: {
            value:[0,0],
            validator: function(val) {
                _yuitest_coverfunc("build/widget-position/widget-position.js", "validator", 97);
_yuitest_coverline("build/widget-position/widget-position.js", 98);
return this._validateXY(val);
            }
        }
    };

    /**
     * Default class used to mark the boundingBox of a positioned widget.
     *
     * @property POSITIONED_CLASS_NAME
     * @type String
     * @default "yui-widget-positioned"
     * @static
     */
    _yuitest_coverline("build/widget-position/widget-position.js", 111);
Position.POSITIONED_CLASS_NAME = Widget.getClassName(POSITIONED);

    _yuitest_coverline("build/widget-position/widget-position.js", 113);
Position.prototype = {

        /**
         * Creates/Initializes the DOM to support xy page positioning.
         * <p>
         * This method in invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _renderUIPosition
         * @protected
         */
        _renderUIPosition : function() {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_renderUIPosition", 124);
_yuitest_coverline("build/widget-position/widget-position.js", 125);
this._posNode.addClass(Position.POSITIONED_CLASS_NAME);
        },

        /**
         * Synchronizes the UI to match the Widgets xy page position state.
         * <p>
         * This method in invoked after syncUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _syncUIPosition
         * @protected
         */
        _syncUIPosition : function() {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_syncUIPosition", 137);
_yuitest_coverline("build/widget-position/widget-position.js", 138);
var posNode = this._posNode;
            _yuitest_coverline("build/widget-position/widget-position.js", 139);
if (posNode.getStyle(POSITION) === RELATIVE) {
                _yuitest_coverline("build/widget-position/widget-position.js", 140);
this.syncXY();
            }
            _yuitest_coverline("build/widget-position/widget-position.js", 142);
this._uiSetXY(this.get(XY_COORD));
        },

        /**
         * Binds event listeners responsible for updating the UI state in response to 
         * Widget position related state changes.
         * <p>
         * This method in invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIPosition
         * @protected
         */
        _bindUIPosition :function() {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_bindUIPosition", 155);
_yuitest_coverline("build/widget-position/widget-position.js", 156);
this.after(XYChange, this._afterXYChange);
        },

        /**
         * Moves the Widget to the specified page xy co-ordinate position.
         *
         * @method move
         *
         * @param {Number} x The new x position
         * @param {Number} y The new y position
         * <p>Or</p>
         * @param {Array} x, y values passed as an array ([x, y]), to support
         * simple pass through of Node.getXY results
         */
        move: function () {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "move", 170);
_yuitest_coverline("build/widget-position/widget-position.js", 171);
var args = arguments,
                coord = (Lang.isArray(args[0])) ? args[0] : [args[0], args[1]];
                _yuitest_coverline("build/widget-position/widget-position.js", 173);
this.set(XY_COORD, coord);
        },

        /**
         * Synchronizes the Panel's "xy", "x", and "y" properties with the 
         * Widget's position in the DOM.
         *
         * @method syncXY
         */
        syncXY : function () {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "syncXY", 182);
_yuitest_coverline("build/widget-position/widget-position.js", 183);
this.set(XY_COORD, this._posNode.getXY(), {src: UI});
        },

        /**
         * Default validator for the XY attribute
         *
         * @method _validateXY
         * @protected
         * @param {Array} val The XY page co-ordinate value which is being set.
         * @return {boolean} true if valid, false if not.
         */
        _validateXY : function(val) {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_validateXY", 194);
_yuitest_coverline("build/widget-position/widget-position.js", 195);
return (Lang.isArray(val) && Lang.isNumber(val[0]) && Lang.isNumber(val[1]));
        },

        /**
         * Default setter for the X attribute. The setter passes the X value through
         * to the XY attribute, which is the sole store for the XY state.
         *
         * @method _setX
         * @protected
         * @param {Number} val The X page co-ordinate value
         */
        _setX : function(val) {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_setX", 206);
_yuitest_coverline("build/widget-position/widget-position.js", 207);
this.set(XY_COORD, [val, this.get(XY_COORD)[1]]);
        },

        /**
         * Default setter for the Y attribute. The setter passes the Y value through
         * to the XY attribute, which is the sole store for the XY state.
         *
         * @method _setY
         * @protected
         * @param {Number} val The Y page co-ordinate value
         */
        _setY : function(val) {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_setY", 218);
_yuitest_coverline("build/widget-position/widget-position.js", 219);
this.set(XY_COORD, [this.get(XY_COORD)[0], val]);
        },

        /**
         * Default getter for the X attribute. The value is retrieved from 
         * the XY attribute, which is the sole store for the XY state.
         *
         * @method _getX
         * @protected 
         * @return {Number} The X page co-ordinate value
         */
        _getX : function() {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_getX", 230);
_yuitest_coverline("build/widget-position/widget-position.js", 231);
return this.get(XY_COORD)[0];
        },

        /**
         * Default getter for the Y attribute. The value is retrieved from 
         * the XY attribute, which is the sole store for the XY state.
         *
         * @method _getY
         * @protected 
         * @return {Number} The Y page co-ordinate value
         */
        _getY : function() {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_getY", 242);
_yuitest_coverline("build/widget-position/widget-position.js", 243);
return this.get(XY_COORD)[1];
        },

        /**
         * Default attribute change listener for the xy attribute, responsible
         * for updating the UI, in response to attribute changes.
         * 
         * @method _afterXYChange
         * @protected
         * @param {EventFacade} e The event facade for the attribute change
         */
        _afterXYChange : function(e) {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_afterXYChange", 254);
_yuitest_coverline("build/widget-position/widget-position.js", 255);
if (e.src != UI) {
                _yuitest_coverline("build/widget-position/widget-position.js", 256);
this._uiSetXY(e.newVal);
            }
        },

        /**
         * Updates the UI to reflect the XY page co-ordinates passed in.
         * 
         * @method _uiSetXY
         * @protected
         * @param {String} val The XY page co-ordinates value to be reflected in the UI
         */
        _uiSetXY : function(val) {
            _yuitest_coverfunc("build/widget-position/widget-position.js", "_uiSetXY", 267);
_yuitest_coverline("build/widget-position/widget-position.js", 268);
this._posNode.setXY(val);
        }
    };

    _yuitest_coverline("build/widget-position/widget-position.js", 272);
Y.WidgetPosition = Position;


}, '3.7.3', {"requires": ["base-build", "node-screen", "widget"]});
