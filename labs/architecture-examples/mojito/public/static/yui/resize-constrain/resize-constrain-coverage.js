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
_yuitest_coverage["build/resize-constrain/resize-constrain.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/resize-constrain/resize-constrain.js",
    code: []
};
_yuitest_coverage["build/resize-constrain/resize-constrain.js"].code=["YUI.add('resize-constrain', function (Y, NAME) {","","var Lang = Y.Lang,","    isBoolean = Lang.isBoolean,","    isNumber = Lang.isNumber,","    isString = Lang.isString,","    capitalize = Y.Resize.capitalize,","","    isNode = function(v) {","        return (v instanceof Y.Node);","    },","","    toNumber = function(num) {","        return parseFloat(num) || 0;","    },","","    BORDER_BOTTOM_WIDTH = 'borderBottomWidth',","    BORDER_LEFT_WIDTH = 'borderLeftWidth',","    BORDER_RIGHT_WIDTH = 'borderRightWidth',","    BORDER_TOP_WIDTH = 'borderTopWidth',","    BORDER = 'border',","    BOTTOM = 'bottom',","    CON = 'con',","    CONSTRAIN = 'constrain',","    HOST = 'host',","    LEFT = 'left',","    MAX_HEIGHT = 'maxHeight',","    MAX_WIDTH = 'maxWidth',","    MIN_HEIGHT = 'minHeight',","    MIN_WIDTH = 'minWidth',","    NODE = 'node',","    OFFSET_HEIGHT = 'offsetHeight',","    OFFSET_WIDTH = 'offsetWidth',","    PRESEVE_RATIO = 'preserveRatio',","    REGION = 'region',","    RESIZE_CONTRAINED = 'resizeConstrained',","    RIGHT = 'right',","    TICK_X = 'tickX',","    TICK_Y = 'tickY',","    TOP = 'top',","    WIDTH = 'width',","    VIEW = 'view',","    VIEWPORT_REGION = 'viewportRegion';","","/**","A Resize plugin that will attempt to constrain the resize node to the boundaries.","@module resize","@submodule resize-contrain","@class ResizeConstrained","@param config {Object} Object literal specifying widget configuration properties.","@constructor","@extends Plugin.Base","@namespace Plugin","*/","","function ResizeConstrained() {","    ResizeConstrained.superclass.constructor.apply(this, arguments);","}","","Y.mix(ResizeConstrained, {","    NAME: RESIZE_CONTRAINED,","","    NS: CON,","","    ATTRS: {","        /**","        * Will attempt to constrain the resize node to the boundaries. Arguments:<br>","        * 'view': Contrain to Viewport<br>","        * '#selector_string': Constrain to this node<br>","        * '{Region Object}': An Object Literal containing a valid region (top, right, bottom, left) of page positions","        *","        * @attribute constrain","        * @type {String|Object|Node}","        */","        constrain: {","            setter: function(v) {","                if (v && (isNode(v) || isString(v) || v.nodeType)) {","                    v = Y.one(v);","                }","","                return v;","            }","        },","","        /**","         * The minimum height of the element","         *","         * @attribute minHeight","         * @default 15","         * @type Number","         */","        minHeight: {","            value: 15,","            validator: isNumber","        },","","        /**","         * The minimum width of the element","         *","         * @attribute minWidth","         * @default 15","         * @type Number","         */","        minWidth: {","            value: 15,","            validator: isNumber","        },","","        /**","         * The maximum height of the element","         *","         * @attribute maxHeight","         * @default Infinity","         * @type Number","         */","        maxHeight: {","            value: Infinity,","            validator: isNumber","        },","","        /**","         * The maximum width of the element","         *","         * @attribute maxWidth","         * @default Infinity","         * @type Number","         */","        maxWidth: {","            value: Infinity,","            validator: isNumber","        },","","        /**","         * Maintain the element's ratio when resizing.","         *","         * @attribute preserveRatio","         * @default false","         * @type boolean","         */","        preserveRatio: {","            value: false,","            validator: isBoolean","        },","","        /**","         * The number of x ticks to span the resize to.","         *","         * @attribute tickX","         * @default false","         * @type Number | false","         */","        tickX: {","            value: false","        },","","        /**","         * The number of y ticks to span the resize to.","         *","         * @attribute tickY","         * @default false","         * @type Number | false","         */","        tickY: {","            value: false","        }","    }","});","","Y.extend(ResizeConstrained, Y.Plugin.Base, {","    /**","     * Stores the <code>constrain</code>","     * surrounding information retrieved from","     * <a href=\"Resize.html#method__getBoxSurroundingInfo\">_getBoxSurroundingInfo</a>.","     *","     * @property constrainSurrounding","     * @type Object","     * @default null","     */","    constrainSurrounding: null,","","    initializer: function() {","        var instance = this,","            host = instance.get(HOST);","","        host.delegate.dd.plug(","            Y.Plugin.DDConstrained,","            {","                tickX: instance.get(TICK_X),","                tickY: instance.get(TICK_Y)","            }","        );","","        host.after('resize:align', Y.bind(instance._handleResizeAlignEvent, instance));","        host.on('resize:start', Y.bind(instance._handleResizeStartEvent, instance));","    },","","    /**","     * Helper method to update the current values on","     * <a href=\"Resize.html#property_info\">info</a> to respect the","     * constrain node.","     *","     * @method _checkConstrain","     * @param {String} axis 'top' or 'left'","     * @param {String} axisConstrain 'bottom' or 'right'","     * @param {String} offset 'offsetHeight' or 'offsetWidth'","     * @protected","     */","    _checkConstrain: function(axis, axisConstrain, offset) {","        var instance = this,","            point1,","            point1Constrain,","            point2,","            point2Constrain,","            host = instance.get(HOST),","            info = host.info,","            constrainBorders = instance.constrainSurrounding.border,","            region = instance._getConstrainRegion();","","        if (region) {","            point1 = info[axis] + info[offset];","            point1Constrain = region[axisConstrain] - toNumber(constrainBorders[capitalize(BORDER, axisConstrain, WIDTH)]);","","            if (point1 >= point1Constrain) {","                info[offset] -= (point1 - point1Constrain);","            }","","            point2 = info[axis];","            point2Constrain = region[axis] + toNumber(constrainBorders[capitalize(BORDER, axis, WIDTH)]);","","            if (point2 <= point2Constrain) {","                info[axis] += (point2Constrain - point2);","                info[offset] -= (point2Constrain - point2);","            }","        }","    },","","    /**","     * Update the current values on <a href=\"Resize.html#property_info\">info</a>","     * to respect the maxHeight and minHeight.","     *","     * @method _checkHeight","     * @protected","     */","    _checkHeight: function() {","        var instance = this,","            host = instance.get(HOST),","            info = host.info,","            maxHeight = (instance.get(MAX_HEIGHT) + host.totalVSurrounding),","            minHeight = (instance.get(MIN_HEIGHT) + host.totalVSurrounding);","","        instance._checkConstrain(TOP, BOTTOM, OFFSET_HEIGHT);","","        if (info.offsetHeight > maxHeight) {","            host._checkSize(OFFSET_HEIGHT, maxHeight);","        }","","        if (info.offsetHeight < minHeight) {","            host._checkSize(OFFSET_HEIGHT, minHeight);","        }","    },","","    /**","     * Update the current values on <a href=\"Resize.html#property_info\">info</a>","     * calculating the correct ratio for the other values.","     *","     * @method _checkRatio","     * @protected","     */","    _checkRatio: function() {","        var instance = this,","            host = instance.get(HOST),","            info = host.info,","            originalInfo = host.originalInfo,","            oWidth = originalInfo.offsetWidth,","            oHeight = originalInfo.offsetHeight,","            oTop = originalInfo.top,","            oLeft = originalInfo.left,","            oBottom = originalInfo.bottom,","            oRight = originalInfo.right,","            // wRatio/hRatio functions keep the ratio information always synced with the current info information","            // RETURN: percentage how much width/height has changed from the original width/height","            wRatio = function() {","                return (info.offsetWidth/oWidth);","            },","            hRatio = function() {","                return (info.offsetHeight/oHeight);","            },","            isClosestToHeight = host.changeHeightHandles,","            bottomDiff,","            constrainBorders,","            constrainRegion,","            leftDiff,","            rightDiff,","            topDiff;","","        // check whether the resizable node is closest to height or not","        if (instance.get(CONSTRAIN) && host.changeHeightHandles && host.changeWidthHandles) {","            constrainRegion = instance._getConstrainRegion();","            constrainBorders = instance.constrainSurrounding.border;","            bottomDiff = (constrainRegion.bottom - toNumber(constrainBorders[BORDER_BOTTOM_WIDTH])) - oBottom;","            leftDiff = oLeft - (constrainRegion.left + toNumber(constrainBorders[BORDER_LEFT_WIDTH]));","            rightDiff = (constrainRegion.right - toNumber(constrainBorders[BORDER_RIGHT_WIDTH])) - oRight;","            topDiff = oTop - (constrainRegion.top + toNumber(constrainBorders[BORDER_TOP_WIDTH]));","","            if (host.changeLeftHandles && host.changeTopHandles) {","                isClosestToHeight = (topDiff < leftDiff);","            }","            else if (host.changeLeftHandles) {","                isClosestToHeight = (bottomDiff < leftDiff);","            }","            else if (host.changeTopHandles) {","                isClosestToHeight = (topDiff < rightDiff);","            }","            else {","                isClosestToHeight = (bottomDiff < rightDiff);","            }","        }","","        // when the height of the resizable element touch the border of the constrain first","        // force the offsetWidth to be calculated based on the height ratio","        if (isClosestToHeight) {","            info.offsetWidth = oWidth*hRatio();","            instance._checkWidth();","            info.offsetHeight = oHeight*wRatio();","        }","        else {","            info.offsetHeight = oHeight*wRatio();","            instance._checkHeight();","            info.offsetWidth = oWidth*hRatio();","        }","","        // fixing the top on handles which are able to change top","        // the idea here is change the top based on how much the height has changed instead of follow the dy","        if (host.changeTopHandles) {","            info.top = oTop + (oHeight - info.offsetHeight);","        }","","        // fixing the left on handles which are able to change left","        // the idea here is change the left based on how much the width has changed instead of follow the dx","        if (host.changeLeftHandles) {","            info.left = oLeft + (oWidth - info.offsetWidth);","        }","","        // rounding values to avoid pixel jumpings","        Y.each(info, function(value, key) {","            if (isNumber(value)) {","                info[key] = Math.round(value);","            }","        });","    },","","    /**","     * Check whether the resizable node is inside the constrain region.","     *","     * @method _checkRegion","     * @protected","     * @return {boolean}","     */","    _checkRegion: function() {","        var instance = this,","            host = instance.get(HOST),","            region = instance._getConstrainRegion();","","        return Y.DOM.inRegion(null, region, true, host.info);","    },","","    /**","     * Update the current values on <a href=\"Resize.html#property_info\">info</a>","     * to respect the maxWidth and minWidth.","     *","     * @method _checkWidth","     * @protected","     */","    _checkWidth: function() {","        var instance = this,","            host = instance.get(HOST),","            info = host.info,","            maxWidth = (instance.get(MAX_WIDTH) + host.totalHSurrounding),","            minWidth = (instance.get(MIN_WIDTH) + host.totalHSurrounding);","","        instance._checkConstrain(LEFT, RIGHT, OFFSET_WIDTH);","","        if (info.offsetWidth < minWidth) {","            host._checkSize(OFFSET_WIDTH, minWidth);","        }","","        if (info.offsetWidth > maxWidth) {","            host._checkSize(OFFSET_WIDTH, maxWidth);","        }","    },","","    /**","     * Get the constrain region based on the <code>constrain</code>","     * attribute.","     *","     * @method _getConstrainRegion","     * @protected","     * @return {Object Region}","     */","    _getConstrainRegion: function() {","        var instance = this,","            host = instance.get(HOST),","            node = host.get(NODE),","            constrain = instance.get(CONSTRAIN),","            region = null;","","        if (constrain) {","            if (constrain === VIEW) {","                region = node.get(VIEWPORT_REGION);","            }","            else if (isNode(constrain)) {","                region = constrain.get(REGION);","            }","            else {","                region = constrain;","            }","        }","","        return region;","    },","","    _handleResizeAlignEvent: function() {","        var instance = this,","            host = instance.get(HOST);","","        // check the max/min height and locking top when these values are reach","        instance._checkHeight();","","        // check the max/min width and locking left when these values are reach","        instance._checkWidth();","","        // calculating the ratio, for proportionally resizing","        if (instance.get(PRESEVE_RATIO)) {","            instance._checkRatio();","        }","","        if (instance.get(CONSTRAIN) && !instance._checkRegion()) {","            host.info = host.lastInfo;","        }","    },","","    _handleResizeStartEvent: function() {","        var instance = this,","            constrain = instance.get(CONSTRAIN),","            host = instance.get(HOST);","","        instance.constrainSurrounding = host._getBoxSurroundingInfo(constrain);","    }","});","","Y.namespace('Plugin');","Y.Plugin.ResizeConstrained = ResizeConstrained;","","","}, '3.7.3', {\"requires\": [\"plugin\", \"resize-base\"]});"];
_yuitest_coverage["build/resize-constrain/resize-constrain.js"].lines = {"1":0,"3":0,"10":0,"14":0,"56":0,"57":0,"60":0,"77":0,"78":0,"81":0,"169":0,"182":0,"185":0,"193":0,"194":0,"209":0,"219":0,"220":0,"221":0,"223":0,"224":0,"227":0,"228":0,"230":0,"231":0,"232":0,"245":0,"251":0,"253":0,"254":0,"257":0,"258":0,"270":0,"283":0,"286":0,"297":0,"298":0,"299":0,"300":0,"301":0,"302":0,"303":0,"305":0,"306":0,"308":0,"309":0,"311":0,"312":0,"315":0,"321":0,"322":0,"323":0,"324":0,"327":0,"328":0,"329":0,"334":0,"335":0,"340":0,"341":0,"345":0,"346":0,"347":0,"360":0,"364":0,"375":0,"381":0,"383":0,"384":0,"387":0,"388":0,"401":0,"407":0,"408":0,"409":0,"411":0,"412":0,"415":0,"419":0,"423":0,"427":0,"430":0,"433":0,"434":0,"437":0,"438":0,"443":0,"447":0,"451":0,"452":0};
_yuitest_coverage["build/resize-constrain/resize-constrain.js"].functions = {"isNode:9":0,"toNumber:13":0,"ResizeConstrained:56":0,"setter:76":0,"initializer:181":0,"_checkConstrain:208":0,"_checkHeight:244":0,"wRatio:282":0,"hRatio:285":0,"(anonymous 2):345":0,"_checkRatio:269":0,"_checkRegion:359":0,"_checkWidth:374":0,"_getConstrainRegion:400":0,"_handleResizeAlignEvent:422":0,"_handleResizeStartEvent:442":0,"(anonymous 1):1":0};
_yuitest_coverage["build/resize-constrain/resize-constrain.js"].coveredLines = 90;
_yuitest_coverage["build/resize-constrain/resize-constrain.js"].coveredFunctions = 17;
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 1);
YUI.add('resize-constrain', function (Y, NAME) {

_yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "(anonymous 1)", 1);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 3);
var Lang = Y.Lang,
    isBoolean = Lang.isBoolean,
    isNumber = Lang.isNumber,
    isString = Lang.isString,
    capitalize = Y.Resize.capitalize,

    isNode = function(v) {
        _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "isNode", 9);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 10);
return (v instanceof Y.Node);
    },

    toNumber = function(num) {
        _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "toNumber", 13);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 14);
return parseFloat(num) || 0;
    },

    BORDER_BOTTOM_WIDTH = 'borderBottomWidth',
    BORDER_LEFT_WIDTH = 'borderLeftWidth',
    BORDER_RIGHT_WIDTH = 'borderRightWidth',
    BORDER_TOP_WIDTH = 'borderTopWidth',
    BORDER = 'border',
    BOTTOM = 'bottom',
    CON = 'con',
    CONSTRAIN = 'constrain',
    HOST = 'host',
    LEFT = 'left',
    MAX_HEIGHT = 'maxHeight',
    MAX_WIDTH = 'maxWidth',
    MIN_HEIGHT = 'minHeight',
    MIN_WIDTH = 'minWidth',
    NODE = 'node',
    OFFSET_HEIGHT = 'offsetHeight',
    OFFSET_WIDTH = 'offsetWidth',
    PRESEVE_RATIO = 'preserveRatio',
    REGION = 'region',
    RESIZE_CONTRAINED = 'resizeConstrained',
    RIGHT = 'right',
    TICK_X = 'tickX',
    TICK_Y = 'tickY',
    TOP = 'top',
    WIDTH = 'width',
    VIEW = 'view',
    VIEWPORT_REGION = 'viewportRegion';

/**
A Resize plugin that will attempt to constrain the resize node to the boundaries.
@module resize
@submodule resize-contrain
@class ResizeConstrained
@param config {Object} Object literal specifying widget configuration properties.
@constructor
@extends Plugin.Base
@namespace Plugin
*/

_yuitest_coverline("build/resize-constrain/resize-constrain.js", 56);
function ResizeConstrained() {
    _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "ResizeConstrained", 56);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 57);
ResizeConstrained.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/resize-constrain/resize-constrain.js", 60);
Y.mix(ResizeConstrained, {
    NAME: RESIZE_CONTRAINED,

    NS: CON,

    ATTRS: {
        /**
        * Will attempt to constrain the resize node to the boundaries. Arguments:<br>
        * 'view': Contrain to Viewport<br>
        * '#selector_string': Constrain to this node<br>
        * '{Region Object}': An Object Literal containing a valid region (top, right, bottom, left) of page positions
        *
        * @attribute constrain
        * @type {String|Object|Node}
        */
        constrain: {
            setter: function(v) {
                _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "setter", 76);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 77);
if (v && (isNode(v) || isString(v) || v.nodeType)) {
                    _yuitest_coverline("build/resize-constrain/resize-constrain.js", 78);
v = Y.one(v);
                }

                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 81);
return v;
            }
        },

        /**
         * The minimum height of the element
         *
         * @attribute minHeight
         * @default 15
         * @type Number
         */
        minHeight: {
            value: 15,
            validator: isNumber
        },

        /**
         * The minimum width of the element
         *
         * @attribute minWidth
         * @default 15
         * @type Number
         */
        minWidth: {
            value: 15,
            validator: isNumber
        },

        /**
         * The maximum height of the element
         *
         * @attribute maxHeight
         * @default Infinity
         * @type Number
         */
        maxHeight: {
            value: Infinity,
            validator: isNumber
        },

        /**
         * The maximum width of the element
         *
         * @attribute maxWidth
         * @default Infinity
         * @type Number
         */
        maxWidth: {
            value: Infinity,
            validator: isNumber
        },

        /**
         * Maintain the element's ratio when resizing.
         *
         * @attribute preserveRatio
         * @default false
         * @type boolean
         */
        preserveRatio: {
            value: false,
            validator: isBoolean
        },

        /**
         * The number of x ticks to span the resize to.
         *
         * @attribute tickX
         * @default false
         * @type Number | false
         */
        tickX: {
            value: false
        },

        /**
         * The number of y ticks to span the resize to.
         *
         * @attribute tickY
         * @default false
         * @type Number | false
         */
        tickY: {
            value: false
        }
    }
});

_yuitest_coverline("build/resize-constrain/resize-constrain.js", 169);
Y.extend(ResizeConstrained, Y.Plugin.Base, {
    /**
     * Stores the <code>constrain</code>
     * surrounding information retrieved from
     * <a href="Resize.html#method__getBoxSurroundingInfo">_getBoxSurroundingInfo</a>.
     *
     * @property constrainSurrounding
     * @type Object
     * @default null
     */
    constrainSurrounding: null,

    initializer: function() {
        _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "initializer", 181);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 182);
var instance = this,
            host = instance.get(HOST);

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 185);
host.delegate.dd.plug(
            Y.Plugin.DDConstrained,
            {
                tickX: instance.get(TICK_X),
                tickY: instance.get(TICK_Y)
            }
        );

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 193);
host.after('resize:align', Y.bind(instance._handleResizeAlignEvent, instance));
        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 194);
host.on('resize:start', Y.bind(instance._handleResizeStartEvent, instance));
    },

    /**
     * Helper method to update the current values on
     * <a href="Resize.html#property_info">info</a> to respect the
     * constrain node.
     *
     * @method _checkConstrain
     * @param {String} axis 'top' or 'left'
     * @param {String} axisConstrain 'bottom' or 'right'
     * @param {String} offset 'offsetHeight' or 'offsetWidth'
     * @protected
     */
    _checkConstrain: function(axis, axisConstrain, offset) {
        _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "_checkConstrain", 208);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 209);
var instance = this,
            point1,
            point1Constrain,
            point2,
            point2Constrain,
            host = instance.get(HOST),
            info = host.info,
            constrainBorders = instance.constrainSurrounding.border,
            region = instance._getConstrainRegion();

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 219);
if (region) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 220);
point1 = info[axis] + info[offset];
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 221);
point1Constrain = region[axisConstrain] - toNumber(constrainBorders[capitalize(BORDER, axisConstrain, WIDTH)]);

            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 223);
if (point1 >= point1Constrain) {
                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 224);
info[offset] -= (point1 - point1Constrain);
            }

            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 227);
point2 = info[axis];
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 228);
point2Constrain = region[axis] + toNumber(constrainBorders[capitalize(BORDER, axis, WIDTH)]);

            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 230);
if (point2 <= point2Constrain) {
                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 231);
info[axis] += (point2Constrain - point2);
                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 232);
info[offset] -= (point2Constrain - point2);
            }
        }
    },

    /**
     * Update the current values on <a href="Resize.html#property_info">info</a>
     * to respect the maxHeight and minHeight.
     *
     * @method _checkHeight
     * @protected
     */
    _checkHeight: function() {
        _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "_checkHeight", 244);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 245);
var instance = this,
            host = instance.get(HOST),
            info = host.info,
            maxHeight = (instance.get(MAX_HEIGHT) + host.totalVSurrounding),
            minHeight = (instance.get(MIN_HEIGHT) + host.totalVSurrounding);

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 251);
instance._checkConstrain(TOP, BOTTOM, OFFSET_HEIGHT);

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 253);
if (info.offsetHeight > maxHeight) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 254);
host._checkSize(OFFSET_HEIGHT, maxHeight);
        }

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 257);
if (info.offsetHeight < minHeight) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 258);
host._checkSize(OFFSET_HEIGHT, minHeight);
        }
    },

    /**
     * Update the current values on <a href="Resize.html#property_info">info</a>
     * calculating the correct ratio for the other values.
     *
     * @method _checkRatio
     * @protected
     */
    _checkRatio: function() {
        _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "_checkRatio", 269);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 270);
var instance = this,
            host = instance.get(HOST),
            info = host.info,
            originalInfo = host.originalInfo,
            oWidth = originalInfo.offsetWidth,
            oHeight = originalInfo.offsetHeight,
            oTop = originalInfo.top,
            oLeft = originalInfo.left,
            oBottom = originalInfo.bottom,
            oRight = originalInfo.right,
            // wRatio/hRatio functions keep the ratio information always synced with the current info information
            // RETURN: percentage how much width/height has changed from the original width/height
            wRatio = function() {
                _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "wRatio", 282);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 283);
return (info.offsetWidth/oWidth);
            },
            hRatio = function() {
                _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "hRatio", 285);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 286);
return (info.offsetHeight/oHeight);
            },
            isClosestToHeight = host.changeHeightHandles,
            bottomDiff,
            constrainBorders,
            constrainRegion,
            leftDiff,
            rightDiff,
            topDiff;

        // check whether the resizable node is closest to height or not
        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 297);
if (instance.get(CONSTRAIN) && host.changeHeightHandles && host.changeWidthHandles) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 298);
constrainRegion = instance._getConstrainRegion();
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 299);
constrainBorders = instance.constrainSurrounding.border;
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 300);
bottomDiff = (constrainRegion.bottom - toNumber(constrainBorders[BORDER_BOTTOM_WIDTH])) - oBottom;
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 301);
leftDiff = oLeft - (constrainRegion.left + toNumber(constrainBorders[BORDER_LEFT_WIDTH]));
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 302);
rightDiff = (constrainRegion.right - toNumber(constrainBorders[BORDER_RIGHT_WIDTH])) - oRight;
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 303);
topDiff = oTop - (constrainRegion.top + toNumber(constrainBorders[BORDER_TOP_WIDTH]));

            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 305);
if (host.changeLeftHandles && host.changeTopHandles) {
                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 306);
isClosestToHeight = (topDiff < leftDiff);
            }
            else {_yuitest_coverline("build/resize-constrain/resize-constrain.js", 308);
if (host.changeLeftHandles) {
                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 309);
isClosestToHeight = (bottomDiff < leftDiff);
            }
            else {_yuitest_coverline("build/resize-constrain/resize-constrain.js", 311);
if (host.changeTopHandles) {
                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 312);
isClosestToHeight = (topDiff < rightDiff);
            }
            else {
                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 315);
isClosestToHeight = (bottomDiff < rightDiff);
            }}}
        }

        // when the height of the resizable element touch the border of the constrain first
        // force the offsetWidth to be calculated based on the height ratio
        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 321);
if (isClosestToHeight) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 322);
info.offsetWidth = oWidth*hRatio();
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 323);
instance._checkWidth();
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 324);
info.offsetHeight = oHeight*wRatio();
        }
        else {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 327);
info.offsetHeight = oHeight*wRatio();
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 328);
instance._checkHeight();
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 329);
info.offsetWidth = oWidth*hRatio();
        }

        // fixing the top on handles which are able to change top
        // the idea here is change the top based on how much the height has changed instead of follow the dy
        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 334);
if (host.changeTopHandles) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 335);
info.top = oTop + (oHeight - info.offsetHeight);
        }

        // fixing the left on handles which are able to change left
        // the idea here is change the left based on how much the width has changed instead of follow the dx
        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 340);
if (host.changeLeftHandles) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 341);
info.left = oLeft + (oWidth - info.offsetWidth);
        }

        // rounding values to avoid pixel jumpings
        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 345);
Y.each(info, function(value, key) {
            _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "(anonymous 2)", 345);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 346);
if (isNumber(value)) {
                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 347);
info[key] = Math.round(value);
            }
        });
    },

    /**
     * Check whether the resizable node is inside the constrain region.
     *
     * @method _checkRegion
     * @protected
     * @return {boolean}
     */
    _checkRegion: function() {
        _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "_checkRegion", 359);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 360);
var instance = this,
            host = instance.get(HOST),
            region = instance._getConstrainRegion();

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 364);
return Y.DOM.inRegion(null, region, true, host.info);
    },

    /**
     * Update the current values on <a href="Resize.html#property_info">info</a>
     * to respect the maxWidth and minWidth.
     *
     * @method _checkWidth
     * @protected
     */
    _checkWidth: function() {
        _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "_checkWidth", 374);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 375);
var instance = this,
            host = instance.get(HOST),
            info = host.info,
            maxWidth = (instance.get(MAX_WIDTH) + host.totalHSurrounding),
            minWidth = (instance.get(MIN_WIDTH) + host.totalHSurrounding);

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 381);
instance._checkConstrain(LEFT, RIGHT, OFFSET_WIDTH);

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 383);
if (info.offsetWidth < minWidth) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 384);
host._checkSize(OFFSET_WIDTH, minWidth);
        }

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 387);
if (info.offsetWidth > maxWidth) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 388);
host._checkSize(OFFSET_WIDTH, maxWidth);
        }
    },

    /**
     * Get the constrain region based on the <code>constrain</code>
     * attribute.
     *
     * @method _getConstrainRegion
     * @protected
     * @return {Object Region}
     */
    _getConstrainRegion: function() {
        _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "_getConstrainRegion", 400);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 401);
var instance = this,
            host = instance.get(HOST),
            node = host.get(NODE),
            constrain = instance.get(CONSTRAIN),
            region = null;

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 407);
if (constrain) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 408);
if (constrain === VIEW) {
                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 409);
region = node.get(VIEWPORT_REGION);
            }
            else {_yuitest_coverline("build/resize-constrain/resize-constrain.js", 411);
if (isNode(constrain)) {
                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 412);
region = constrain.get(REGION);
            }
            else {
                _yuitest_coverline("build/resize-constrain/resize-constrain.js", 415);
region = constrain;
            }}
        }

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 419);
return region;
    },

    _handleResizeAlignEvent: function() {
        _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "_handleResizeAlignEvent", 422);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 423);
var instance = this,
            host = instance.get(HOST);

        // check the max/min height and locking top when these values are reach
        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 427);
instance._checkHeight();

        // check the max/min width and locking left when these values are reach
        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 430);
instance._checkWidth();

        // calculating the ratio, for proportionally resizing
        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 433);
if (instance.get(PRESEVE_RATIO)) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 434);
instance._checkRatio();
        }

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 437);
if (instance.get(CONSTRAIN) && !instance._checkRegion()) {
            _yuitest_coverline("build/resize-constrain/resize-constrain.js", 438);
host.info = host.lastInfo;
        }
    },

    _handleResizeStartEvent: function() {
        _yuitest_coverfunc("build/resize-constrain/resize-constrain.js", "_handleResizeStartEvent", 442);
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 443);
var instance = this,
            constrain = instance.get(CONSTRAIN),
            host = instance.get(HOST);

        _yuitest_coverline("build/resize-constrain/resize-constrain.js", 447);
instance.constrainSurrounding = host._getBoxSurroundingInfo(constrain);
    }
});

_yuitest_coverline("build/resize-constrain/resize-constrain.js", 451);
Y.namespace('Plugin');
_yuitest_coverline("build/resize-constrain/resize-constrain.js", 452);
Y.Plugin.ResizeConstrained = ResizeConstrained;


}, '3.7.3', {"requires": ["plugin", "resize-base"]});
