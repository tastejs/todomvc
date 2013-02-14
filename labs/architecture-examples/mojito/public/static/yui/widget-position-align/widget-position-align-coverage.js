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
_yuitest_coverage["build/widget-position-align/widget-position-align.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-position-align/widget-position-align.js",
    code: []
};
_yuitest_coverage["build/widget-position-align/widget-position-align.js"].code=["YUI.add('widget-position-align', function (Y, NAME) {","","/**","Provides extended/advanced XY positioning support for Widgets, through an","extension.","","It builds on top of the `widget-position` module, to provide alignment and","centering support. Future releases aim to add constrained and fixed positioning","support.","","@module widget-position-align","**/","var Lang = Y.Lang,","","    ALIGN        = 'align',","    ALIGN_ON     = 'alignOn',","","    VISIBLE      = 'visible',","    BOUNDING_BOX = 'boundingBox',","","    OFFSET_WIDTH    = 'offsetWidth',","    OFFSET_HEIGHT   = 'offsetHeight',","    REGION          = 'region',","    VIEWPORT_REGION = 'viewportRegion';","","/**","Widget extension, which can be used to add extended XY positioning support to","the base Widget class, through the `Base.create` method.","","**Note:** This extension requires that the `WidgetPosition` extension be added","to the Widget (before `WidgetPositionAlign`, if part of the same extension list","passed to `Base.build`).","","@class WidgetPositionAlign","@param {Object} config User configuration object.","@constructor","**/","function PositionAlign (config) {","    if ( ! this._posNode) {","        Y.error('WidgetPosition needs to be added to the Widget, ' + ","            'before WidgetPositionAlign is added'); ","    }","","    Y.after(this._bindUIPosAlign, this, 'bindUI');","    Y.after(this._syncUIPosAlign, this, 'syncUI');","}","","PositionAlign.ATTRS = {","","    /**","    The alignment configuration for this widget.","","    The `align` attribute is used to align a reference point on the widget, with","    the reference point on another `Node`, or the viewport. The object which","    `align` expects has the following properties:","","      * __`node`__: The `Node` to which the widget is to be aligned. If set to","        `null`, or not provided, the widget is aligned to the viewport.","    ","      * __`points`__: A two element Array, defining the two points on the widget","        and `Node`/viewport which are to be aligned. The first element is the","        point on the widget, and the second element is the point on the","        `Node`/viewport. Supported alignment points are defined as static","        properties on `WidgetPositionAlign`.","    ","    @example Aligns the top-right corner of the widget with the top-left corner ","    of the viewport:","","        myWidget.set('align', {","            points: [Y.WidgetPositionAlign.TR, Y.WidgetPositionAlign.TL]","        });","    ","    @attribute align","    @type Object","    @default null","    **/","    align: {","        value: null","    },","","    /**","    A convenience Attribute, which can be used as a shortcut for the `align` ","    Attribute.","    ","    If set to `true`, the widget is centered in the viewport. If set to a `Node` ","    reference or valid selector String, the widget will be centered within the ","    `Node`. If set to `false`, no center positioning is applied.","","    @attribute centered","    @type Boolean|Node","    @default false","    **/","    centered: {","        setter : '_setAlignCenter',","        lazyAdd:false,","        value  :false","    },","","    /**","    An Array of Objects corresponding to the `Node`s and events that will cause","    the alignment of this widget to be synced to the DOM.","","    The `alignOn` Attribute is expected to be an Array of Objects with the ","    following properties:","","      * __`eventName`__: The String event name to listen for.","","      * __`node`__: The optional `Node` that will fire the event, it can be a ","        `Node` reference or a selector String. This will default to the widget's ","        `boundingBox`.","","    @example Sync this widget's alignment on window resize:","","        myWidget.set('alignOn', [","            {","                node     : Y.one('win'),","                eventName: 'resize'","            }","        ]);","","    @attribute alignOn","    @type Array","    @default []","    **/","    alignOn: {","        value    : [],","        validator: Y.Lang.isArray","    }","};","","/**","Constant used to specify the top-left corner for alignment","","@property TL","@type String","@value 'tl'","@static","**/","PositionAlign.TL = 'tl';","","/**","Constant used to specify the top-right corner for alignment"," ","@property TR","@type String","@value 'tr'","@static","**/","PositionAlign.TR = 'tr';","","/**","Constant used to specify the bottom-left corner for alignment"," ","@property BL","@type String","@value 'bl'","@static","**/","PositionAlign.BL = 'bl';","","/**","Constant used to specify the bottom-right corner for alignment","","@property BR","@type String","@value 'br'","@static","**/","PositionAlign.BR = 'br';","","/**","Constant used to specify the top edge-center point for alignment","","@property TC","@type String","@value 'tc'","@static","**/","PositionAlign.TC = 'tc';","","/**","Constant used to specify the right edge, center point for alignment"," ","@property RC","@type String","@value 'rc'","@static","**/","PositionAlign.RC = 'rc';","","/**","Constant used to specify the bottom edge, center point for alignment"," ","@property BC","@type String","@value 'bc'","@static","**/","PositionAlign.BC = 'bc';","","/**","Constant used to specify the left edge, center point for alignment"," ","@property LC","@type String","@value 'lc'","@static","**/","PositionAlign.LC = 'lc';","","/**","Constant used to specify the center of widget/node/viewport for alignment","","@property CC","@type String","@value 'cc'","@static","*/","PositionAlign.CC = 'cc';","","PositionAlign.prototype = {","    // -- Protected Properties -------------------------------------------------","","    /**","    Holds the alignment-syncing event handles.","","    @property _posAlignUIHandles","    @type Array","    @default null","    @protected","    **/","    _posAlignUIHandles: null,","","    // -- Lifecycle Methods ----------------------------------------------------","","    destructor: function () {","        this._detachPosAlignUIHandles();","    },","","    /**","    Bind event listeners responsible for updating the UI state in response to","    the widget's position-align related state changes.","","    This method is invoked after `bindUI` has been invoked for the `Widget`","    class using the AOP infrastructure.","","    @method _bindUIPosAlign","    @protected","    **/","    _bindUIPosAlign: function () {","        this.after('alignChange', this._afterAlignChange);","        this.after('alignOnChange', this._afterAlignOnChange);","        this.after('visibleChange', this._syncUIPosAlign);","    },","","    /**","    Synchronizes the current `align` Attribute value to the DOM.","","    This method is invoked after `syncUI` has been invoked for the `Widget`","    class using the AOP infrastructure.","","    @method _syncUIPosAlign","    @protected","    **/","    _syncUIPosAlign: function () {","        var align = this.get(ALIGN);","","        this._uiSetVisiblePosAlign(this.get(VISIBLE));","","        if (align) {","            this._uiSetAlign(align.node, align.points);","        }","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Aligns this widget to the provided `Node` (or viewport) using the provided","    points. This method can be invoked with no arguments which will cause the ","    widget's current `align` Attribute value to be synced to the DOM.","","    @example Aligning to the top-left corner of the `<body>`:","","        myWidget.align('body',","            [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.TR]);","","    @method align","    @param {Node|String|null} [node] A reference (or selector String) for the","      `Node` which with the widget is to be aligned. If null is passed in, the","      widget will be aligned with the viewport.","    @param {Array[2]} [points] A two item array specifying the points on the ","      widget and `Node`/viewport which will to be aligned. The first entry is ","      the point on the widget, and the second entry is the point on the ","      `Node`/viewport. Valid point references are defined as static constants on ","      the `WidgetPositionAlign` extension.","    @chainable","    **/","    align: function (node, points) {","        if (arguments.length) {","            // Set the `align` Attribute.","            this.set(ALIGN, {","                node  : node,","                points: points","            });","        } else {","            // Sync the current `align` Attribute value to the DOM.","            this._syncUIPosAlign();","        }","","        return this;","    },","","    /**","    Centers the widget in the viewport, or if a `Node` is passed in, it will ","    be centered to that `Node`.","","    @method centered","    @param {Node|String} [node] A `Node` reference or selector String defining ","      the `Node` which the widget should be centered. If a `Node` is not  passed","      in, then the widget will be centered to the viewport.","    @chainable","    **/","    centered: function (node) {","        return this.align(node, [PositionAlign.CC, PositionAlign.CC]);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Default setter for `center` Attribute changes. Sets up the appropriate","    value, and passes it through the to the align attribute.","","    @method _setAlignCenter","    @param {Boolean|Node} val The Attribute value being set.","    @return {Boolean|Node} the value passed in.","    @protected","    **/","    _setAlignCenter: function (val) {","        if (val) {","            this.set(ALIGN, {","                node  : val === true ? null : val,","                points: [PositionAlign.CC, PositionAlign.CC]","            });","        }","","        return val;","    },","","    /**","    Updates the UI to reflect the `align` value passed in.","","    **Note:** See the `align` Attribute documentation, for the Object structure","    expected.","","    @method _uiSetAlign","    @param {Node|String|null} [node] The node to align to, or null to indicate","      the viewport.","    @param {Array} points The alignment points.","    @protected","    **/","    _uiSetAlign: function (node, points) {","        if ( ! Lang.isArray(points) || points.length !== 2) {","            Y.error('align: Invalid Points Arguments');","            return;","        }","","        var nodeRegion = this._getRegion(node), ","            widgetPoint, nodePoint, xy;","","        if ( ! nodeRegion) {","            // No-op, nothing to align to.","            return;","        }","","        widgetPoint = points[0];","        nodePoint   = points[1];","","        // TODO: Optimize KWeight - Would lookup table help?","        switch (nodePoint) {","        case PositionAlign.TL:","            xy = [nodeRegion.left, nodeRegion.top];","            break;","","        case PositionAlign.TR:","            xy = [nodeRegion.right, nodeRegion.top];","            break;","","        case PositionAlign.BL:","            xy = [nodeRegion.left, nodeRegion.bottom];","            break;","","        case PositionAlign.BR:","            xy = [nodeRegion.right, nodeRegion.bottom];","            break;","","        case PositionAlign.TC:","            xy = [","                nodeRegion.left + Math.floor(nodeRegion.width / 2),","                nodeRegion.top","            ];","            break;","","        case PositionAlign.BC:","            xy = [","                nodeRegion.left + Math.floor(nodeRegion.width / 2),","                nodeRegion.bottom","            ];","            break;","","        case PositionAlign.LC:","            xy = [","                nodeRegion.left,","                nodeRegion.top + Math.floor(nodeRegion.height / 2)","            ];","            break;","","        case PositionAlign.RC:","            xy = [","                nodeRegion.right,","                nodeRegion.top + Math.floor(nodeRegion.height / 2)","            ];","            break;","","        case PositionAlign.CC:","            xy = [","                nodeRegion.left + Math.floor(nodeRegion.width / 2),","                nodeRegion.top + Math.floor(nodeRegion.height / 2)","            ];","            break;","","        default:","            break;","","        }","","        if (xy) {","            this._doAlign(widgetPoint, xy[0], xy[1]);","        }","    },","","    /**","    Attaches or detaches alignment-syncing event handlers based on the widget's","    `visible` Attribute state.","","    @method _uiSetVisiblePosAlign","    @param {Boolean} visible The current value of the widget's `visible`","      Attribute.","    @protected","    **/","    _uiSetVisiblePosAlign: function (visible) {","        if (visible) {","            this._attachPosAlignUIHandles();","        } else {","            this._detachPosAlignUIHandles();","        }","    },","","    /**","    Attaches the alignment-syncing event handlers.","","    @method _attachPosAlignUIHandles","    @protected","    **/","    _attachPosAlignUIHandles: function () {","        if (this._posAlignUIHandles) {","            // No-op if we have already setup the event handlers.","            return;","        }","","        var bb        = this.get(BOUNDING_BOX),","            syncAlign = Y.bind(this._syncUIPosAlign, this),","            handles   = [];","","        Y.Array.each(this.get(ALIGN_ON), function (o) {","            var event = o.eventName,","                node  = Y.one(o.node) || bb;","            ","            if (event) {","                handles.push(node.on(event, syncAlign));","            }","        });","","        this._posAlignUIHandles = handles;","    },","","    /**","    Detaches the alignment-syncing event handlers.","","    @method _detachPosAlignUIHandles","    @protected","    **/","    _detachPosAlignUIHandles: function () {","        var handles = this._posAlignUIHandles;","        if (handles) {","            new Y.EventHandle(handles).detach();","            this._posAlignUIHandles = null;","        }","    },","","    // -- Private Methods ------------------------------------------------------","","    /**","    Helper method, used to align the given point on the widget, with the XY page","    coordinates provided.","","    @method _doAlign","    @param {String} widgetPoint Supported point constant","      (e.g. WidgetPositionAlign.TL)","    @param {Number} x X page coordinate to align to.","    @param {Number} y Y page coordinate to align to.","    @private","    **/","    _doAlign: function (widgetPoint, x, y) {","        var widgetNode = this._posNode,","            xy;","","        switch (widgetPoint) {","        case PositionAlign.TL:","            xy = [x, y];","            break;","","        case PositionAlign.TR:","            xy = [","                x - widgetNode.get(OFFSET_WIDTH),","                y","            ];","            break;","","        case PositionAlign.BL:","            xy = [","                x,","                y - widgetNode.get(OFFSET_HEIGHT)","            ];","            break;","","        case PositionAlign.BR:","            xy = [","                x - widgetNode.get(OFFSET_WIDTH),","                y - widgetNode.get(OFFSET_HEIGHT)","            ];","            break;","","        case PositionAlign.TC:","            xy = [","                x - (widgetNode.get(OFFSET_WIDTH) / 2),","                y","            ];","            break;","","        case PositionAlign.BC:","            xy = [","                x - (widgetNode.get(OFFSET_WIDTH) / 2),","                y - widgetNode.get(OFFSET_HEIGHT)","            ];","            break;","","        case PositionAlign.LC:","            xy = [","                x,","                y - (widgetNode.get(OFFSET_HEIGHT) / 2)","            ];","            break;","","        case PositionAlign.RC:","            xy = [","                x - widgetNode.get(OFFSET_WIDTH),","                y - (widgetNode.get(OFFSET_HEIGHT) / 2)","            ];","            break;","","        case PositionAlign.CC:","            xy = [","                x - (widgetNode.get(OFFSET_WIDTH) / 2),","                y - (widgetNode.get(OFFSET_HEIGHT) / 2)","            ];","            break;","","        default:","            break;","","        }","","        if (xy) {","            this.move(xy);","        }","    },","","    /**","    Returns the region of the passed-in `Node`, or the viewport region if","    calling with passing in a `Node`.","","    @method _getRegion","    @param {Node} [node] The node to get the region of.","    @return {Object} The node's region.","    @private","    **/","    _getRegion: function (node) {","        var nodeRegion;","","        if ( ! node) {","            nodeRegion = this._posNode.get(VIEWPORT_REGION);","        } else {","            node = Y.Node.one(node);","            if (node) {","                nodeRegion = node.get(REGION);","            }","        }","","        return nodeRegion;","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `alignChange` events by updating the UI in response to `align`","    Attribute changes.","","    @method _afterAlignChange","    @param {EventFacade} e","    @protected","    **/","    _afterAlignChange: function (e) {","        var align = e.newVal;","        if (align) {","            this._uiSetAlign(align.node, align.points);               ","        }","    },","","    /**","    Handles `alignOnChange` events by updating the alignment-syncing event","    handlers.","","    @method _afterAlignOnChange","    @param {EventFacade} e","    @protected","    **/","    _afterAlignOnChange: function(e) {","        this._detachPosAlignUIHandles();","","        if (this.get(VISIBLE)) {","            this._attachPosAlignUIHandles();","        }","    }","};","","Y.WidgetPositionAlign = PositionAlign;","","","}, '3.7.3', {\"requires\": [\"widget-position\"]});"];
_yuitest_coverage["build/widget-position-align/widget-position-align.js"].lines = {"1":0,"13":0,"38":0,"39":0,"40":0,"44":0,"45":0,"48":0,"139":0,"149":0,"159":0,"169":0,"179":0,"189":0,"199":0,"209":0,"219":0,"221":0,"237":0,"251":0,"252":0,"253":0,"266":0,"268":0,"270":0,"271":0,"299":0,"301":0,"307":0,"310":0,"324":0,"339":0,"340":0,"346":0,"362":0,"363":0,"364":0,"367":0,"370":0,"372":0,"375":0,"376":0,"379":0,"381":0,"382":0,"385":0,"386":0,"389":0,"390":0,"393":0,"394":0,"397":0,"401":0,"404":0,"408":0,"411":0,"415":0,"418":0,"422":0,"425":0,"429":0,"432":0,"436":0,"437":0,"451":0,"452":0,"454":0,"465":0,"467":0,"470":0,"474":0,"475":0,"478":0,"479":0,"483":0,"493":0,"494":0,"495":0,"496":0,"514":0,"517":0,"519":0,"520":0,"523":0,"527":0,"530":0,"534":0,"537":0,"541":0,"544":0,"548":0,"551":0,"555":0,"558":0,"562":0,"565":0,"569":0,"572":0,"576":0,"579":0,"583":0,"584":0,"598":0,"600":0,"601":0,"603":0,"604":0,"605":0,"609":0,"623":0,"624":0,"625":0,"638":0,"640":0,"641":0,"646":0};
_yuitest_coverage["build/widget-position-align/widget-position-align.js"].functions = {"PositionAlign:38":0,"destructor:236":0,"_bindUIPosAlign:250":0,"_syncUIPosAlign:265":0,"align:298":0,"centered:323":0,"_setAlignCenter:338":0,"_uiSetAlign:361":0,"_uiSetVisiblePosAlign:450":0,"(anonymous 2):474":0,"_attachPosAlignUIHandles:464":0,"_detachPosAlignUIHandles:492":0,"_doAlign:513":0,"_getRegion:597":0,"_afterAlignChange:622":0,"_afterAlignOnChange:637":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-position-align/widget-position-align.js"].coveredLines = 116;
_yuitest_coverage["build/widget-position-align/widget-position-align.js"].coveredFunctions = 17;
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 1);
YUI.add('widget-position-align', function (Y, NAME) {

/**
Provides extended/advanced XY positioning support for Widgets, through an
extension.

It builds on top of the `widget-position` module, to provide alignment and
centering support. Future releases aim to add constrained and fixed positioning
support.

@module widget-position-align
**/
_yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 13);
var Lang = Y.Lang,

    ALIGN        = 'align',
    ALIGN_ON     = 'alignOn',

    VISIBLE      = 'visible',
    BOUNDING_BOX = 'boundingBox',

    OFFSET_WIDTH    = 'offsetWidth',
    OFFSET_HEIGHT   = 'offsetHeight',
    REGION          = 'region',
    VIEWPORT_REGION = 'viewportRegion';

/**
Widget extension, which can be used to add extended XY positioning support to
the base Widget class, through the `Base.create` method.

**Note:** This extension requires that the `WidgetPosition` extension be added
to the Widget (before `WidgetPositionAlign`, if part of the same extension list
passed to `Base.build`).

@class WidgetPositionAlign
@param {Object} config User configuration object.
@constructor
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 38);
function PositionAlign (config) {
    _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "PositionAlign", 38);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 39);
if ( ! this._posNode) {
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 40);
Y.error('WidgetPosition needs to be added to the Widget, ' + 
            'before WidgetPositionAlign is added'); 
    }

    _yuitest_coverline("build/widget-position-align/widget-position-align.js", 44);
Y.after(this._bindUIPosAlign, this, 'bindUI');
    _yuitest_coverline("build/widget-position-align/widget-position-align.js", 45);
Y.after(this._syncUIPosAlign, this, 'syncUI');
}

_yuitest_coverline("build/widget-position-align/widget-position-align.js", 48);
PositionAlign.ATTRS = {

    /**
    The alignment configuration for this widget.

    The `align` attribute is used to align a reference point on the widget, with
    the reference point on another `Node`, or the viewport. The object which
    `align` expects has the following properties:

      * __`node`__: The `Node` to which the widget is to be aligned. If set to
        `null`, or not provided, the widget is aligned to the viewport.
    
      * __`points`__: A two element Array, defining the two points on the widget
        and `Node`/viewport which are to be aligned. The first element is the
        point on the widget, and the second element is the point on the
        `Node`/viewport. Supported alignment points are defined as static
        properties on `WidgetPositionAlign`.
    
    @example Aligns the top-right corner of the widget with the top-left corner 
    of the viewport:

        myWidget.set('align', {
            points: [Y.WidgetPositionAlign.TR, Y.WidgetPositionAlign.TL]
        });
    
    @attribute align
    @type Object
    @default null
    **/
    align: {
        value: null
    },

    /**
    A convenience Attribute, which can be used as a shortcut for the `align` 
    Attribute.
    
    If set to `true`, the widget is centered in the viewport. If set to a `Node` 
    reference or valid selector String, the widget will be centered within the 
    `Node`. If set to `false`, no center positioning is applied.

    @attribute centered
    @type Boolean|Node
    @default false
    **/
    centered: {
        setter : '_setAlignCenter',
        lazyAdd:false,
        value  :false
    },

    /**
    An Array of Objects corresponding to the `Node`s and events that will cause
    the alignment of this widget to be synced to the DOM.

    The `alignOn` Attribute is expected to be an Array of Objects with the 
    following properties:

      * __`eventName`__: The String event name to listen for.

      * __`node`__: The optional `Node` that will fire the event, it can be a 
        `Node` reference or a selector String. This will default to the widget's 
        `boundingBox`.

    @example Sync this widget's alignment on window resize:

        myWidget.set('alignOn', [
            {
                node     : Y.one('win'),
                eventName: 'resize'
            }
        ]);

    @attribute alignOn
    @type Array
    @default []
    **/
    alignOn: {
        value    : [],
        validator: Y.Lang.isArray
    }
};

/**
Constant used to specify the top-left corner for alignment

@property TL
@type String
@value 'tl'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 139);
PositionAlign.TL = 'tl';

/**
Constant used to specify the top-right corner for alignment
 
@property TR
@type String
@value 'tr'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 149);
PositionAlign.TR = 'tr';

/**
Constant used to specify the bottom-left corner for alignment
 
@property BL
@type String
@value 'bl'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 159);
PositionAlign.BL = 'bl';

/**
Constant used to specify the bottom-right corner for alignment

@property BR
@type String
@value 'br'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 169);
PositionAlign.BR = 'br';

/**
Constant used to specify the top edge-center point for alignment

@property TC
@type String
@value 'tc'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 179);
PositionAlign.TC = 'tc';

/**
Constant used to specify the right edge, center point for alignment
 
@property RC
@type String
@value 'rc'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 189);
PositionAlign.RC = 'rc';

/**
Constant used to specify the bottom edge, center point for alignment
 
@property BC
@type String
@value 'bc'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 199);
PositionAlign.BC = 'bc';

/**
Constant used to specify the left edge, center point for alignment
 
@property LC
@type String
@value 'lc'
@static
**/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 209);
PositionAlign.LC = 'lc';

/**
Constant used to specify the center of widget/node/viewport for alignment

@property CC
@type String
@value 'cc'
@static
*/
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 219);
PositionAlign.CC = 'cc';

_yuitest_coverline("build/widget-position-align/widget-position-align.js", 221);
PositionAlign.prototype = {
    // -- Protected Properties -------------------------------------------------

    /**
    Holds the alignment-syncing event handles.

    @property _posAlignUIHandles
    @type Array
    @default null
    @protected
    **/
    _posAlignUIHandles: null,

    // -- Lifecycle Methods ----------------------------------------------------

    destructor: function () {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "destructor", 236);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 237);
this._detachPosAlignUIHandles();
    },

    /**
    Bind event listeners responsible for updating the UI state in response to
    the widget's position-align related state changes.

    This method is invoked after `bindUI` has been invoked for the `Widget`
    class using the AOP infrastructure.

    @method _bindUIPosAlign
    @protected
    **/
    _bindUIPosAlign: function () {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_bindUIPosAlign", 250);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 251);
this.after('alignChange', this._afterAlignChange);
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 252);
this.after('alignOnChange', this._afterAlignOnChange);
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 253);
this.after('visibleChange', this._syncUIPosAlign);
    },

    /**
    Synchronizes the current `align` Attribute value to the DOM.

    This method is invoked after `syncUI` has been invoked for the `Widget`
    class using the AOP infrastructure.

    @method _syncUIPosAlign
    @protected
    **/
    _syncUIPosAlign: function () {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_syncUIPosAlign", 265);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 266);
var align = this.get(ALIGN);

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 268);
this._uiSetVisiblePosAlign(this.get(VISIBLE));

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 270);
if (align) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 271);
this._uiSetAlign(align.node, align.points);
        }
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Aligns this widget to the provided `Node` (or viewport) using the provided
    points. This method can be invoked with no arguments which will cause the 
    widget's current `align` Attribute value to be synced to the DOM.

    @example Aligning to the top-left corner of the `<body>`:

        myWidget.align('body',
            [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.TR]);

    @method align
    @param {Node|String|null} [node] A reference (or selector String) for the
      `Node` which with the widget is to be aligned. If null is passed in, the
      widget will be aligned with the viewport.
    @param {Array[2]} [points] A two item array specifying the points on the 
      widget and `Node`/viewport which will to be aligned. The first entry is 
      the point on the widget, and the second entry is the point on the 
      `Node`/viewport. Valid point references are defined as static constants on 
      the `WidgetPositionAlign` extension.
    @chainable
    **/
    align: function (node, points) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "align", 298);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 299);
if (arguments.length) {
            // Set the `align` Attribute.
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 301);
this.set(ALIGN, {
                node  : node,
                points: points
            });
        } else {
            // Sync the current `align` Attribute value to the DOM.
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 307);
this._syncUIPosAlign();
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 310);
return this;
    },

    /**
    Centers the widget in the viewport, or if a `Node` is passed in, it will 
    be centered to that `Node`.

    @method centered
    @param {Node|String} [node] A `Node` reference or selector String defining 
      the `Node` which the widget should be centered. If a `Node` is not  passed
      in, then the widget will be centered to the viewport.
    @chainable
    **/
    centered: function (node) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "centered", 323);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 324);
return this.align(node, [PositionAlign.CC, PositionAlign.CC]);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Default setter for `center` Attribute changes. Sets up the appropriate
    value, and passes it through the to the align attribute.

    @method _setAlignCenter
    @param {Boolean|Node} val The Attribute value being set.
    @return {Boolean|Node} the value passed in.
    @protected
    **/
    _setAlignCenter: function (val) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_setAlignCenter", 338);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 339);
if (val) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 340);
this.set(ALIGN, {
                node  : val === true ? null : val,
                points: [PositionAlign.CC, PositionAlign.CC]
            });
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 346);
return val;
    },

    /**
    Updates the UI to reflect the `align` value passed in.

    **Note:** See the `align` Attribute documentation, for the Object structure
    expected.

    @method _uiSetAlign
    @param {Node|String|null} [node] The node to align to, or null to indicate
      the viewport.
    @param {Array} points The alignment points.
    @protected
    **/
    _uiSetAlign: function (node, points) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_uiSetAlign", 361);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 362);
if ( ! Lang.isArray(points) || points.length !== 2) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 363);
Y.error('align: Invalid Points Arguments');
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 364);
return;
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 367);
var nodeRegion = this._getRegion(node), 
            widgetPoint, nodePoint, xy;

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 370);
if ( ! nodeRegion) {
            // No-op, nothing to align to.
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 372);
return;
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 375);
widgetPoint = points[0];
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 376);
nodePoint   = points[1];

        // TODO: Optimize KWeight - Would lookup table help?
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 379);
switch (nodePoint) {
        case PositionAlign.TL:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 381);
xy = [nodeRegion.left, nodeRegion.top];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 382);
break;

        case PositionAlign.TR:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 385);
xy = [nodeRegion.right, nodeRegion.top];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 386);
break;

        case PositionAlign.BL:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 389);
xy = [nodeRegion.left, nodeRegion.bottom];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 390);
break;

        case PositionAlign.BR:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 393);
xy = [nodeRegion.right, nodeRegion.bottom];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 394);
break;

        case PositionAlign.TC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 397);
xy = [
                nodeRegion.left + Math.floor(nodeRegion.width / 2),
                nodeRegion.top
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 401);
break;

        case PositionAlign.BC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 404);
xy = [
                nodeRegion.left + Math.floor(nodeRegion.width / 2),
                nodeRegion.bottom
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 408);
break;

        case PositionAlign.LC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 411);
xy = [
                nodeRegion.left,
                nodeRegion.top + Math.floor(nodeRegion.height / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 415);
break;

        case PositionAlign.RC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 418);
xy = [
                nodeRegion.right,
                nodeRegion.top + Math.floor(nodeRegion.height / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 422);
break;

        case PositionAlign.CC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 425);
xy = [
                nodeRegion.left + Math.floor(nodeRegion.width / 2),
                nodeRegion.top + Math.floor(nodeRegion.height / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 429);
break;

        default:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 432);
break;

        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 436);
if (xy) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 437);
this._doAlign(widgetPoint, xy[0], xy[1]);
        }
    },

    /**
    Attaches or detaches alignment-syncing event handlers based on the widget's
    `visible` Attribute state.

    @method _uiSetVisiblePosAlign
    @param {Boolean} visible The current value of the widget's `visible`
      Attribute.
    @protected
    **/
    _uiSetVisiblePosAlign: function (visible) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_uiSetVisiblePosAlign", 450);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 451);
if (visible) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 452);
this._attachPosAlignUIHandles();
        } else {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 454);
this._detachPosAlignUIHandles();
        }
    },

    /**
    Attaches the alignment-syncing event handlers.

    @method _attachPosAlignUIHandles
    @protected
    **/
    _attachPosAlignUIHandles: function () {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_attachPosAlignUIHandles", 464);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 465);
if (this._posAlignUIHandles) {
            // No-op if we have already setup the event handlers.
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 467);
return;
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 470);
var bb        = this.get(BOUNDING_BOX),
            syncAlign = Y.bind(this._syncUIPosAlign, this),
            handles   = [];

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 474);
Y.Array.each(this.get(ALIGN_ON), function (o) {
            _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "(anonymous 2)", 474);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 475);
var event = o.eventName,
                node  = Y.one(o.node) || bb;
            
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 478);
if (event) {
                _yuitest_coverline("build/widget-position-align/widget-position-align.js", 479);
handles.push(node.on(event, syncAlign));
            }
        });

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 483);
this._posAlignUIHandles = handles;
    },

    /**
    Detaches the alignment-syncing event handlers.

    @method _detachPosAlignUIHandles
    @protected
    **/
    _detachPosAlignUIHandles: function () {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_detachPosAlignUIHandles", 492);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 493);
var handles = this._posAlignUIHandles;
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 494);
if (handles) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 495);
new Y.EventHandle(handles).detach();
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 496);
this._posAlignUIHandles = null;
        }
    },

    // -- Private Methods ------------------------------------------------------

    /**
    Helper method, used to align the given point on the widget, with the XY page
    coordinates provided.

    @method _doAlign
    @param {String} widgetPoint Supported point constant
      (e.g. WidgetPositionAlign.TL)
    @param {Number} x X page coordinate to align to.
    @param {Number} y Y page coordinate to align to.
    @private
    **/
    _doAlign: function (widgetPoint, x, y) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_doAlign", 513);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 514);
var widgetNode = this._posNode,
            xy;

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 517);
switch (widgetPoint) {
        case PositionAlign.TL:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 519);
xy = [x, y];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 520);
break;

        case PositionAlign.TR:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 523);
xy = [
                x - widgetNode.get(OFFSET_WIDTH),
                y
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 527);
break;

        case PositionAlign.BL:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 530);
xy = [
                x,
                y - widgetNode.get(OFFSET_HEIGHT)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 534);
break;

        case PositionAlign.BR:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 537);
xy = [
                x - widgetNode.get(OFFSET_WIDTH),
                y - widgetNode.get(OFFSET_HEIGHT)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 541);
break;

        case PositionAlign.TC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 544);
xy = [
                x - (widgetNode.get(OFFSET_WIDTH) / 2),
                y
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 548);
break;

        case PositionAlign.BC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 551);
xy = [
                x - (widgetNode.get(OFFSET_WIDTH) / 2),
                y - widgetNode.get(OFFSET_HEIGHT)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 555);
break;

        case PositionAlign.LC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 558);
xy = [
                x,
                y - (widgetNode.get(OFFSET_HEIGHT) / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 562);
break;

        case PositionAlign.RC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 565);
xy = [
                x - widgetNode.get(OFFSET_WIDTH),
                y - (widgetNode.get(OFFSET_HEIGHT) / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 569);
break;

        case PositionAlign.CC:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 572);
xy = [
                x - (widgetNode.get(OFFSET_WIDTH) / 2),
                y - (widgetNode.get(OFFSET_HEIGHT) / 2)
            ];
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 576);
break;

        default:
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 579);
break;

        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 583);
if (xy) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 584);
this.move(xy);
        }
    },

    /**
    Returns the region of the passed-in `Node`, or the viewport region if
    calling with passing in a `Node`.

    @method _getRegion
    @param {Node} [node] The node to get the region of.
    @return {Object} The node's region.
    @private
    **/
    _getRegion: function (node) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_getRegion", 597);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 598);
var nodeRegion;

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 600);
if ( ! node) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 601);
nodeRegion = this._posNode.get(VIEWPORT_REGION);
        } else {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 603);
node = Y.Node.one(node);
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 604);
if (node) {
                _yuitest_coverline("build/widget-position-align/widget-position-align.js", 605);
nodeRegion = node.get(REGION);
            }
        }

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 609);
return nodeRegion;
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `alignChange` events by updating the UI in response to `align`
    Attribute changes.

    @method _afterAlignChange
    @param {EventFacade} e
    @protected
    **/
    _afterAlignChange: function (e) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_afterAlignChange", 622);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 623);
var align = e.newVal;
        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 624);
if (align) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 625);
this._uiSetAlign(align.node, align.points);               
        }
    },

    /**
    Handles `alignOnChange` events by updating the alignment-syncing event
    handlers.

    @method _afterAlignOnChange
    @param {EventFacade} e
    @protected
    **/
    _afterAlignOnChange: function(e) {
        _yuitest_coverfunc("build/widget-position-align/widget-position-align.js", "_afterAlignOnChange", 637);
_yuitest_coverline("build/widget-position-align/widget-position-align.js", 638);
this._detachPosAlignUIHandles();

        _yuitest_coverline("build/widget-position-align/widget-position-align.js", 640);
if (this.get(VISIBLE)) {
            _yuitest_coverline("build/widget-position-align/widget-position-align.js", 641);
this._attachPosAlignUIHandles();
        }
    }
};

_yuitest_coverline("build/widget-position-align/widget-position-align.js", 646);
Y.WidgetPositionAlign = PositionAlign;


}, '3.7.3', {"requires": ["widget-position"]});
