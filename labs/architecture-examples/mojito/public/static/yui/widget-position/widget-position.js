/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('widget-position', function (Y, NAME) {

/**
 * Provides basic XY positioning support for Widgets, though an extension
 *
 * @module widget-position
 */
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
    function Position(config) {
        this._posNode = this.get(BOUNDING_BOX);

        // WIDGET METHOD OVERLAP
        Y.after(this._renderUIPosition, this, RENDERUI);
        Y.after(this._syncUIPosition, this, SYNCUI);
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
                this._setX(val);
            },
            getter: function() {
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
                this._setY(val);
            },
            getter: function() {
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
    Position.POSITIONED_CLASS_NAME = Widget.getClassName(POSITIONED);

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
            var posNode = this._posNode;
            if (posNode.getStyle(POSITION) === RELATIVE) {
                this.syncXY();
            }
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
            var args = arguments,
                coord = (Lang.isArray(args[0])) ? args[0] : [args[0], args[1]];
                this.set(XY_COORD, coord);
        },

        /**
         * Synchronizes the Panel's "xy", "x", and "y" properties with the 
         * Widget's position in the DOM.
         *
         * @method syncXY
         */
        syncXY : function () {
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
            if (e.src != UI) {
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
            this._posNode.setXY(val);
        }
    };

    Y.WidgetPosition = Position;


}, '3.7.3', {"requires": ["base-build", "node-screen", "widget"]});
