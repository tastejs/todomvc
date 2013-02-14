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
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-position-constrain/widget-position-constrain.js",
    code: []
};
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"].code=["YUI.add('widget-position-constrain', function (Y, NAME) {","","/**"," * Provides constrained xy positioning support for Widgets, through an extension."," *"," * It builds on top of the widget-position module, to provide constrained positioning support."," *"," * @module widget-position-constrain"," */","var CONSTRAIN = \"constrain\",","    CONSTRAIN_XYCHANGE = \"constrain|xyChange\",","    CONSTRAIN_CHANGE = \"constrainChange\",","","    PREVENT_OVERLAP = \"preventOverlap\",","    ALIGN = \"align\",","    ","    EMPTY_STR = \"\",","","    BINDUI = \"bindUI\",","","    XY = \"xy\",","    X_COORD = \"x\",","    Y_COORD = \"y\",","","    Node = Y.Node,","","    VIEWPORT_REGION = \"viewportRegion\",","    REGION = \"region\",","","    PREVENT_OVERLAP_MAP;","","/**"," * A widget extension, which can be used to add constrained xy positioning support to the base Widget class,"," * through the <a href=\"Base.html#method_build\">Base.build</a> method. This extension requires that "," * the WidgetPosition extension be added to the Widget (before WidgetPositionConstrain, if part of the same "," * extension list passed to Base.build)."," *"," * @class WidgetPositionConstrain"," * @param {Object} User configuration object"," */","function PositionConstrain(config) {","    if (!this._posNode) {","        Y.error(\"WidgetPosition needs to be added to the Widget, before WidgetPositionConstrain is added\"); ","    }","    Y.after(this._bindUIPosConstrained, this, BINDUI);","}","","/**"," * Static property used to define the default attribute "," * configuration introduced by WidgetPositionConstrain."," *"," * @property ATTRS"," * @type Object"," * @static"," */","PositionConstrain.ATTRS = {","","    /**","     * @attribute constrain","     * @type boolean | Node","     * @default null","     * @description The node to constrain the widget's bounding box to, when setting xy. Can also be","     * set to true, to constrain to the viewport.","     */","    constrain : {","        value: null,","        setter: \"_setConstrain\"","    },","","    /**","     * @attribute preventOverlap","     * @type boolean","     * @description If set to true, and WidgetPositionAlign is also added to the Widget, ","     * constrained positioning will attempt to prevent the widget's bounding box from overlapping ","     * the element to which it has been aligned, by flipping the orientation of the alignment","     * for corner based alignments  ","     */","    preventOverlap : {","        value:false","    }","};","","/**"," * @property _PREVENT_OVERLAP"," * @static"," * @protected"," * @type Object"," * @description The set of positions for which to prevent"," * overlap."," */","PREVENT_OVERLAP_MAP = PositionConstrain._PREVENT_OVERLAP = {","    x: {","        \"tltr\": 1,","        \"blbr\": 1,","        \"brbl\": 1,","        \"trtl\": 1","    },","    y : {","        \"trbr\": 1,","        \"tlbl\": 1,","        \"bltl\": 1,","        \"brtr\": 1","    }","};","","PositionConstrain.prototype = {","","    /**","     * Calculates the constrained positions for the XY positions provided, using","     * the provided node argument is passed in. If no node value is passed in, the value of ","     * the \"constrain\" attribute is used.","     * ","     * @method getConstrainedXY","     * @param {Array} xy The xy values to constrain","     * @param {Node | boolean} node Optional. The node to constrain to, or true for the viewport","     * @return {Array} The constrained xy values","     */","    getConstrainedXY : function(xy, node) {","        node = node || this.get(CONSTRAIN);","","        var constrainingRegion = this._getRegion((node === true) ? null : node),","            nodeRegion = this._posNode.get(REGION);","","        return [","            this._constrain(xy[0], X_COORD, nodeRegion, constrainingRegion),","            this._constrain(xy[1], Y_COORD, nodeRegion, constrainingRegion)","        ];","    },","","    /**","     * Constrains the widget's bounding box to a node (or the viewport). If xy or node are not ","     * passed in, the current position and the value of \"constrain\" will be used respectively.","     * ","     * The widget's position will be changed to the constrained position.","     *","     * @method constrain ","     * @param {Array} xy Optional. The xy values to constrain","     * @param {Node | boolean} node Optional. The node to constrain to, or true for the viewport","     */","    constrain : function(xy, node) {","        var currentXY, ","            constrainedXY,","            constraint = node || this.get(CONSTRAIN);","","        if (constraint) {","            currentXY = xy || this.get(XY);","            constrainedXY = this.getConstrainedXY(currentXY, constraint);","","            if (constrainedXY[0] !== currentXY[0] || constrainedXY[1] !== currentXY[1]) {","                this.set(XY, constrainedXY, { constrained:true });","            }","        }","    },","","    /**","     * The setter implementation for the \"constrain\" attribute.","     *","     * @method _setConstrain","     * @protected","     * @param {Node | boolean} val The attribute value ","     */","    _setConstrain : function(val) {","        return (val === true) ? val : Node.one(val);","    },","","    /**","     * The method which performs the actual constrain calculations for a given axis (\"x\" or \"y\") based","     * on the regions provided.","     * ","     * @method _constrain","     * @protected","     * ","     * @param {Number} val The value to constrain","     * @param {String} axis The axis to use for constrainment","     * @param {Region} nodeRegion The region of the node to constrain","     * @param {Region} constrainingRegion The region of the node (or viewport) to constrain to","     * ","     * @return {Number} The constrained value","     */","    _constrain: function(val, axis, nodeRegion, constrainingRegion) {","        if (constrainingRegion) {","","            if (this.get(PREVENT_OVERLAP)) {","                val = this._preventOverlap(val, axis, nodeRegion, constrainingRegion);","            }","","            var x = (axis == X_COORD),","","                regionSize    = (x) ? constrainingRegion.width : constrainingRegion.height,","                nodeSize      = (x) ? nodeRegion.width : nodeRegion.height,","                minConstraint = (x) ? constrainingRegion.left : constrainingRegion.top,","                maxConstraint = (x) ? constrainingRegion.right - nodeSize : constrainingRegion.bottom - nodeSize;","","            if (val < minConstraint || val > maxConstraint) {","                if (nodeSize < regionSize) {","                    if (val < minConstraint) {","                        val = minConstraint;","                    } else if (val > maxConstraint) {","                        val = maxConstraint;","                    }","                } else {","                    val = minConstraint;","                }","            }","        }","","        return val;","    },","","    /**","     * The method which performs the preventOverlap calculations for a given axis (\"x\" or \"y\") based","     * on the value and regions provided.","     * ","     * @method _preventOverlap","     * @protected","     *","     * @param {Number} val The value being constrain","     * @param {String} axis The axis to being constrained","     * @param {Region} nodeRegion The region of the node being constrained","     * @param {Region} constrainingRegion The region of the node (or viewport) we need to constrain to","     * ","     * @return {Number} The constrained value","     */","    _preventOverlap : function(val, axis, nodeRegion, constrainingRegion) {","","        var align = this.get(ALIGN),","            x = (axis === X_COORD),","            nodeSize,","            alignRegion,","            nearEdge,","            farEdge,","            spaceOnNearSide, ","            spaceOnFarSide;","","        if (align && align.points && PREVENT_OVERLAP_MAP[axis][align.points.join(EMPTY_STR)]) {","","            alignRegion = this._getRegion(align.node);","","            if (alignRegion) {","                nodeSize        = (x) ? nodeRegion.width : nodeRegion.height;","                nearEdge        = (x) ? alignRegion.left : alignRegion.top;","                farEdge         = (x) ? alignRegion.right : alignRegion.bottom;","                spaceOnNearSide = (x) ? alignRegion.left - constrainingRegion.left : alignRegion.top - constrainingRegion.top;","                spaceOnFarSide  = (x) ? constrainingRegion.right - alignRegion.right : constrainingRegion.bottom - alignRegion.bottom;","            }"," ","            if (val > nearEdge) {","                if (spaceOnFarSide < nodeSize && spaceOnNearSide > nodeSize) {","                    val = nearEdge - nodeSize;","                }","            } else {","                if (spaceOnNearSide < nodeSize && spaceOnFarSide > nodeSize) {","                    val = farEdge;","                }","            }","        }","","        return val;","    },","","    /**","     * Binds event listeners responsible for updating the UI state in response to ","     * Widget constrained positioning related state changes.","     * <p>","     * This method is invoked after bindUI is invoked for the Widget class","     * using YUI's aop infrastructure.","     * </p>","     *","     * @method _bindUIPosConstrained","     * @protected","     */","    _bindUIPosConstrained : function() {","        this.after(CONSTRAIN_CHANGE, this._afterConstrainChange);","        this._enableConstraints(this.get(CONSTRAIN));","    },","","    /**","     * After change listener for the \"constrain\" attribute, responsible","     * for updating the UI, in response to attribute changes.","     *","     * @method _afterConstrainChange","     * @protected","     * @param {EventFacade} e The event facade","     */","    _afterConstrainChange : function(e) {","        this._enableConstraints(e.newVal);","    },","","    /**","     * Updates the UI if enabling constraints, and sets up the xyChange event listeners","     * to constrain whenever the widget is moved. Disabling constraints removes the listeners.","     * ","     * @method enable or disable constraints listeners","     * @private","     * @param {boolean} enable Enable or disable constraints ","     */","    _enableConstraints : function(enable) {","        if (enable) {","            this.constrain();","            this._cxyHandle = this._cxyHandle || this.on(CONSTRAIN_XYCHANGE, this._constrainOnXYChange);","        } else if (this._cxyHandle) {","            this._cxyHandle.detach();","            this._cxyHandle = null;    ","        }","    },","","    /**","     * The on change listener for the \"xy\" attribute. Modifies the event facade's","     * newVal property with the constrained XY value.","     *","     * @method _constrainOnXYChange","     * @protected","     * @param {EventFacade} e The event facade for the attribute change","     */","    _constrainOnXYChange : function(e) {","        if (!e.constrained) {","            e.newVal = this.getConstrainedXY(e.newVal);","        }","    },","","    /**","     * Utility method to normalize region retrieval from a node instance, ","     * or the viewport, if no node is provided. ","     * ","     * @method _getRegion","     * @private","     * @param {Node} node Optional.","     */","    _getRegion : function(node) {","        var region;","        if (!node) {","            region = this._posNode.get(VIEWPORT_REGION);","        } else {","            node = Node.one(node);","            if (node) {","                region = node.get(REGION);","            }","        }","        return region;","    }","};","","Y.WidgetPositionConstrain = PositionConstrain;","","","}, '3.7.3', {\"requires\": [\"widget-position\"]});"];
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"].lines = {"1":0,"10":0,"41":0,"42":0,"43":0,"45":0,"56":0,"91":0,"106":0,"119":0,"121":0,"124":0,"141":0,"145":0,"146":0,"147":0,"149":0,"150":0,"163":0,"181":0,"183":0,"184":0,"187":0,"194":0,"195":0,"196":0,"197":0,"198":0,"199":0,"202":0,"207":0,"226":0,"235":0,"237":0,"239":0,"240":0,"241":0,"242":0,"243":0,"244":0,"247":0,"248":0,"249":0,"252":0,"253":0,"258":0,"273":0,"274":0,"286":0,"298":0,"299":0,"300":0,"301":0,"302":0,"303":0,"316":0,"317":0,"330":0,"331":0,"332":0,"334":0,"335":0,"336":0,"339":0,"343":0};
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"].functions = {"PositionConstrain:41":0,"getConstrainedXY:118":0,"constrain:140":0,"_setConstrain:162":0,"_constrain:180":0,"_preventOverlap:224":0,"_bindUIPosConstrained:272":0,"_afterConstrainChange:285":0,"_enableConstraints:297":0,"_constrainOnXYChange:315":0,"_getRegion:329":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"].coveredLines = 65;
_yuitest_coverage["build/widget-position-constrain/widget-position-constrain.js"].coveredFunctions = 12;
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 1);
YUI.add('widget-position-constrain', function (Y, NAME) {

/**
 * Provides constrained xy positioning support for Widgets, through an extension.
 *
 * It builds on top of the widget-position module, to provide constrained positioning support.
 *
 * @module widget-position-constrain
 */
_yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 10);
var CONSTRAIN = "constrain",
    CONSTRAIN_XYCHANGE = "constrain|xyChange",
    CONSTRAIN_CHANGE = "constrainChange",

    PREVENT_OVERLAP = "preventOverlap",
    ALIGN = "align",
    
    EMPTY_STR = "",

    BINDUI = "bindUI",

    XY = "xy",
    X_COORD = "x",
    Y_COORD = "y",

    Node = Y.Node,

    VIEWPORT_REGION = "viewportRegion",
    REGION = "region",

    PREVENT_OVERLAP_MAP;

/**
 * A widget extension, which can be used to add constrained xy positioning support to the base Widget class,
 * through the <a href="Base.html#method_build">Base.build</a> method. This extension requires that 
 * the WidgetPosition extension be added to the Widget (before WidgetPositionConstrain, if part of the same 
 * extension list passed to Base.build).
 *
 * @class WidgetPositionConstrain
 * @param {Object} User configuration object
 */
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 41);
function PositionConstrain(config) {
    _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "PositionConstrain", 41);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 42);
if (!this._posNode) {
        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 43);
Y.error("WidgetPosition needs to be added to the Widget, before WidgetPositionConstrain is added"); 
    }
    _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 45);
Y.after(this._bindUIPosConstrained, this, BINDUI);
}

/**
 * Static property used to define the default attribute 
 * configuration introduced by WidgetPositionConstrain.
 *
 * @property ATTRS
 * @type Object
 * @static
 */
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 56);
PositionConstrain.ATTRS = {

    /**
     * @attribute constrain
     * @type boolean | Node
     * @default null
     * @description The node to constrain the widget's bounding box to, when setting xy. Can also be
     * set to true, to constrain to the viewport.
     */
    constrain : {
        value: null,
        setter: "_setConstrain"
    },

    /**
     * @attribute preventOverlap
     * @type boolean
     * @description If set to true, and WidgetPositionAlign is also added to the Widget, 
     * constrained positioning will attempt to prevent the widget's bounding box from overlapping 
     * the element to which it has been aligned, by flipping the orientation of the alignment
     * for corner based alignments  
     */
    preventOverlap : {
        value:false
    }
};

/**
 * @property _PREVENT_OVERLAP
 * @static
 * @protected
 * @type Object
 * @description The set of positions for which to prevent
 * overlap.
 */
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 91);
PREVENT_OVERLAP_MAP = PositionConstrain._PREVENT_OVERLAP = {
    x: {
        "tltr": 1,
        "blbr": 1,
        "brbl": 1,
        "trtl": 1
    },
    y : {
        "trbr": 1,
        "tlbl": 1,
        "bltl": 1,
        "brtr": 1
    }
};

_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 106);
PositionConstrain.prototype = {

    /**
     * Calculates the constrained positions for the XY positions provided, using
     * the provided node argument is passed in. If no node value is passed in, the value of 
     * the "constrain" attribute is used.
     * 
     * @method getConstrainedXY
     * @param {Array} xy The xy values to constrain
     * @param {Node | boolean} node Optional. The node to constrain to, or true for the viewport
     * @return {Array} The constrained xy values
     */
    getConstrainedXY : function(xy, node) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "getConstrainedXY", 118);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 119);
node = node || this.get(CONSTRAIN);

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 121);
var constrainingRegion = this._getRegion((node === true) ? null : node),
            nodeRegion = this._posNode.get(REGION);

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 124);
return [
            this._constrain(xy[0], X_COORD, nodeRegion, constrainingRegion),
            this._constrain(xy[1], Y_COORD, nodeRegion, constrainingRegion)
        ];
    },

    /**
     * Constrains the widget's bounding box to a node (or the viewport). If xy or node are not 
     * passed in, the current position and the value of "constrain" will be used respectively.
     * 
     * The widget's position will be changed to the constrained position.
     *
     * @method constrain 
     * @param {Array} xy Optional. The xy values to constrain
     * @param {Node | boolean} node Optional. The node to constrain to, or true for the viewport
     */
    constrain : function(xy, node) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "constrain", 140);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 141);
var currentXY, 
            constrainedXY,
            constraint = node || this.get(CONSTRAIN);

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 145);
if (constraint) {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 146);
currentXY = xy || this.get(XY);
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 147);
constrainedXY = this.getConstrainedXY(currentXY, constraint);

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 149);
if (constrainedXY[0] !== currentXY[0] || constrainedXY[1] !== currentXY[1]) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 150);
this.set(XY, constrainedXY, { constrained:true });
            }
        }
    },

    /**
     * The setter implementation for the "constrain" attribute.
     *
     * @method _setConstrain
     * @protected
     * @param {Node | boolean} val The attribute value 
     */
    _setConstrain : function(val) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_setConstrain", 162);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 163);
return (val === true) ? val : Node.one(val);
    },

    /**
     * The method which performs the actual constrain calculations for a given axis ("x" or "y") based
     * on the regions provided.
     * 
     * @method _constrain
     * @protected
     * 
     * @param {Number} val The value to constrain
     * @param {String} axis The axis to use for constrainment
     * @param {Region} nodeRegion The region of the node to constrain
     * @param {Region} constrainingRegion The region of the node (or viewport) to constrain to
     * 
     * @return {Number} The constrained value
     */
    _constrain: function(val, axis, nodeRegion, constrainingRegion) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_constrain", 180);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 181);
if (constrainingRegion) {

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 183);
if (this.get(PREVENT_OVERLAP)) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 184);
val = this._preventOverlap(val, axis, nodeRegion, constrainingRegion);
            }

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 187);
var x = (axis == X_COORD),

                regionSize    = (x) ? constrainingRegion.width : constrainingRegion.height,
                nodeSize      = (x) ? nodeRegion.width : nodeRegion.height,
                minConstraint = (x) ? constrainingRegion.left : constrainingRegion.top,
                maxConstraint = (x) ? constrainingRegion.right - nodeSize : constrainingRegion.bottom - nodeSize;

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 194);
if (val < minConstraint || val > maxConstraint) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 195);
if (nodeSize < regionSize) {
                    _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 196);
if (val < minConstraint) {
                        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 197);
val = minConstraint;
                    } else {_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 198);
if (val > maxConstraint) {
                        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 199);
val = maxConstraint;
                    }}
                } else {
                    _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 202);
val = minConstraint;
                }
            }
        }

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 207);
return val;
    },

    /**
     * The method which performs the preventOverlap calculations for a given axis ("x" or "y") based
     * on the value and regions provided.
     * 
     * @method _preventOverlap
     * @protected
     *
     * @param {Number} val The value being constrain
     * @param {String} axis The axis to being constrained
     * @param {Region} nodeRegion The region of the node being constrained
     * @param {Region} constrainingRegion The region of the node (or viewport) we need to constrain to
     * 
     * @return {Number} The constrained value
     */
    _preventOverlap : function(val, axis, nodeRegion, constrainingRegion) {

        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_preventOverlap", 224);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 226);
var align = this.get(ALIGN),
            x = (axis === X_COORD),
            nodeSize,
            alignRegion,
            nearEdge,
            farEdge,
            spaceOnNearSide, 
            spaceOnFarSide;

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 235);
if (align && align.points && PREVENT_OVERLAP_MAP[axis][align.points.join(EMPTY_STR)]) {

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 237);
alignRegion = this._getRegion(align.node);

            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 239);
if (alignRegion) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 240);
nodeSize        = (x) ? nodeRegion.width : nodeRegion.height;
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 241);
nearEdge        = (x) ? alignRegion.left : alignRegion.top;
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 242);
farEdge         = (x) ? alignRegion.right : alignRegion.bottom;
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 243);
spaceOnNearSide = (x) ? alignRegion.left - constrainingRegion.left : alignRegion.top - constrainingRegion.top;
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 244);
spaceOnFarSide  = (x) ? constrainingRegion.right - alignRegion.right : constrainingRegion.bottom - alignRegion.bottom;
            }
 
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 247);
if (val > nearEdge) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 248);
if (spaceOnFarSide < nodeSize && spaceOnNearSide > nodeSize) {
                    _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 249);
val = nearEdge - nodeSize;
                }
            } else {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 252);
if (spaceOnNearSide < nodeSize && spaceOnFarSide > nodeSize) {
                    _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 253);
val = farEdge;
                }
            }
        }

        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 258);
return val;
    },

    /**
     * Binds event listeners responsible for updating the UI state in response to 
     * Widget constrained positioning related state changes.
     * <p>
     * This method is invoked after bindUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>
     *
     * @method _bindUIPosConstrained
     * @protected
     */
    _bindUIPosConstrained : function() {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_bindUIPosConstrained", 272);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 273);
this.after(CONSTRAIN_CHANGE, this._afterConstrainChange);
        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 274);
this._enableConstraints(this.get(CONSTRAIN));
    },

    /**
     * After change listener for the "constrain" attribute, responsible
     * for updating the UI, in response to attribute changes.
     *
     * @method _afterConstrainChange
     * @protected
     * @param {EventFacade} e The event facade
     */
    _afterConstrainChange : function(e) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_afterConstrainChange", 285);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 286);
this._enableConstraints(e.newVal);
    },

    /**
     * Updates the UI if enabling constraints, and sets up the xyChange event listeners
     * to constrain whenever the widget is moved. Disabling constraints removes the listeners.
     * 
     * @method enable or disable constraints listeners
     * @private
     * @param {boolean} enable Enable or disable constraints 
     */
    _enableConstraints : function(enable) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_enableConstraints", 297);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 298);
if (enable) {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 299);
this.constrain();
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 300);
this._cxyHandle = this._cxyHandle || this.on(CONSTRAIN_XYCHANGE, this._constrainOnXYChange);
        } else {_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 301);
if (this._cxyHandle) {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 302);
this._cxyHandle.detach();
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 303);
this._cxyHandle = null;    
        }}
    },

    /**
     * The on change listener for the "xy" attribute. Modifies the event facade's
     * newVal property with the constrained XY value.
     *
     * @method _constrainOnXYChange
     * @protected
     * @param {EventFacade} e The event facade for the attribute change
     */
    _constrainOnXYChange : function(e) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_constrainOnXYChange", 315);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 316);
if (!e.constrained) {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 317);
e.newVal = this.getConstrainedXY(e.newVal);
        }
    },

    /**
     * Utility method to normalize region retrieval from a node instance, 
     * or the viewport, if no node is provided. 
     * 
     * @method _getRegion
     * @private
     * @param {Node} node Optional.
     */
    _getRegion : function(node) {
        _yuitest_coverfunc("build/widget-position-constrain/widget-position-constrain.js", "_getRegion", 329);
_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 330);
var region;
        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 331);
if (!node) {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 332);
region = this._posNode.get(VIEWPORT_REGION);
        } else {
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 334);
node = Node.one(node);
            _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 335);
if (node) {
                _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 336);
region = node.get(REGION);
            }
        }
        _yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 339);
return region;
    }
};

_yuitest_coverline("build/widget-position-constrain/widget-position-constrain.js", 343);
Y.WidgetPositionConstrain = PositionConstrain;


}, '3.7.3', {"requires": ["widget-position"]});
