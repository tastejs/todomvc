/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('widget-position-align', function (Y, NAME) {

/**
Provides extended/advanced XY positioning support for Widgets, through an
extension.

It builds on top of the `widget-position` module, to provide alignment and
centering support. Future releases aim to add constrained and fixed positioning
support.

@module widget-position-align
**/
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
function PositionAlign (config) {
    if ( ! this._posNode) {
        Y.error('WidgetPosition needs to be added to the Widget, ' + 
            'before WidgetPositionAlign is added'); 
    }

    Y.after(this._bindUIPosAlign, this, 'bindUI');
    Y.after(this._syncUIPosAlign, this, 'syncUI');
}

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
PositionAlign.TL = 'tl';

/**
Constant used to specify the top-right corner for alignment
 
@property TR
@type String
@value 'tr'
@static
**/
PositionAlign.TR = 'tr';

/**
Constant used to specify the bottom-left corner for alignment
 
@property BL
@type String
@value 'bl'
@static
**/
PositionAlign.BL = 'bl';

/**
Constant used to specify the bottom-right corner for alignment

@property BR
@type String
@value 'br'
@static
**/
PositionAlign.BR = 'br';

/**
Constant used to specify the top edge-center point for alignment

@property TC
@type String
@value 'tc'
@static
**/
PositionAlign.TC = 'tc';

/**
Constant used to specify the right edge, center point for alignment
 
@property RC
@type String
@value 'rc'
@static
**/
PositionAlign.RC = 'rc';

/**
Constant used to specify the bottom edge, center point for alignment
 
@property BC
@type String
@value 'bc'
@static
**/
PositionAlign.BC = 'bc';

/**
Constant used to specify the left edge, center point for alignment
 
@property LC
@type String
@value 'lc'
@static
**/
PositionAlign.LC = 'lc';

/**
Constant used to specify the center of widget/node/viewport for alignment

@property CC
@type String
@value 'cc'
@static
*/
PositionAlign.CC = 'cc';

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
        this.after('alignChange', this._afterAlignChange);
        this.after('alignOnChange', this._afterAlignOnChange);
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
        var align = this.get(ALIGN);

        this._uiSetVisiblePosAlign(this.get(VISIBLE));

        if (align) {
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
        if (arguments.length) {
            // Set the `align` Attribute.
            this.set(ALIGN, {
                node  : node,
                points: points
            });
        } else {
            // Sync the current `align` Attribute value to the DOM.
            this._syncUIPosAlign();
        }

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
        if (val) {
            this.set(ALIGN, {
                node  : val === true ? null : val,
                points: [PositionAlign.CC, PositionAlign.CC]
            });
        }

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
        if ( ! Lang.isArray(points) || points.length !== 2) {
            Y.error('align: Invalid Points Arguments');
            return;
        }

        var nodeRegion = this._getRegion(node), 
            widgetPoint, nodePoint, xy;

        if ( ! nodeRegion) {
            // No-op, nothing to align to.
            return;
        }

        widgetPoint = points[0];
        nodePoint   = points[1];

        // TODO: Optimize KWeight - Would lookup table help?
        switch (nodePoint) {
        case PositionAlign.TL:
            xy = [nodeRegion.left, nodeRegion.top];
            break;

        case PositionAlign.TR:
            xy = [nodeRegion.right, nodeRegion.top];
            break;

        case PositionAlign.BL:
            xy = [nodeRegion.left, nodeRegion.bottom];
            break;

        case PositionAlign.BR:
            xy = [nodeRegion.right, nodeRegion.bottom];
            break;

        case PositionAlign.TC:
            xy = [
                nodeRegion.left + Math.floor(nodeRegion.width / 2),
                nodeRegion.top
            ];
            break;

        case PositionAlign.BC:
            xy = [
                nodeRegion.left + Math.floor(nodeRegion.width / 2),
                nodeRegion.bottom
            ];
            break;

        case PositionAlign.LC:
            xy = [
                nodeRegion.left,
                nodeRegion.top + Math.floor(nodeRegion.height / 2)
            ];
            break;

        case PositionAlign.RC:
            xy = [
                nodeRegion.right,
                nodeRegion.top + Math.floor(nodeRegion.height / 2)
            ];
            break;

        case PositionAlign.CC:
            xy = [
                nodeRegion.left + Math.floor(nodeRegion.width / 2),
                nodeRegion.top + Math.floor(nodeRegion.height / 2)
            ];
            break;

        default:
            break;

        }

        if (xy) {
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
        if (visible) {
            this._attachPosAlignUIHandles();
        } else {
            this._detachPosAlignUIHandles();
        }
    },

    /**
    Attaches the alignment-syncing event handlers.

    @method _attachPosAlignUIHandles
    @protected
    **/
    _attachPosAlignUIHandles: function () {
        if (this._posAlignUIHandles) {
            // No-op if we have already setup the event handlers.
            return;
        }

        var bb        = this.get(BOUNDING_BOX),
            syncAlign = Y.bind(this._syncUIPosAlign, this),
            handles   = [];

        Y.Array.each(this.get(ALIGN_ON), function (o) {
            var event = o.eventName,
                node  = Y.one(o.node) || bb;
            
            if (event) {
                handles.push(node.on(event, syncAlign));
            }
        });

        this._posAlignUIHandles = handles;
    },

    /**
    Detaches the alignment-syncing event handlers.

    @method _detachPosAlignUIHandles
    @protected
    **/
    _detachPosAlignUIHandles: function () {
        var handles = this._posAlignUIHandles;
        if (handles) {
            new Y.EventHandle(handles).detach();
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
        var widgetNode = this._posNode,
            xy;

        switch (widgetPoint) {
        case PositionAlign.TL:
            xy = [x, y];
            break;

        case PositionAlign.TR:
            xy = [
                x - widgetNode.get(OFFSET_WIDTH),
                y
            ];
            break;

        case PositionAlign.BL:
            xy = [
                x,
                y - widgetNode.get(OFFSET_HEIGHT)
            ];
            break;

        case PositionAlign.BR:
            xy = [
                x - widgetNode.get(OFFSET_WIDTH),
                y - widgetNode.get(OFFSET_HEIGHT)
            ];
            break;

        case PositionAlign.TC:
            xy = [
                x - (widgetNode.get(OFFSET_WIDTH) / 2),
                y
            ];
            break;

        case PositionAlign.BC:
            xy = [
                x - (widgetNode.get(OFFSET_WIDTH) / 2),
                y - widgetNode.get(OFFSET_HEIGHT)
            ];
            break;

        case PositionAlign.LC:
            xy = [
                x,
                y - (widgetNode.get(OFFSET_HEIGHT) / 2)
            ];
            break;

        case PositionAlign.RC:
            xy = [
                x - widgetNode.get(OFFSET_WIDTH),
                y - (widgetNode.get(OFFSET_HEIGHT) / 2)
            ];
            break;

        case PositionAlign.CC:
            xy = [
                x - (widgetNode.get(OFFSET_WIDTH) / 2),
                y - (widgetNode.get(OFFSET_HEIGHT) / 2)
            ];
            break;

        default:
            break;

        }

        if (xy) {
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
        var nodeRegion;

        if ( ! node) {
            nodeRegion = this._posNode.get(VIEWPORT_REGION);
        } else {
            node = Y.Node.one(node);
            if (node) {
                nodeRegion = node.get(REGION);
            }
        }

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
        var align = e.newVal;
        if (align) {
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
        this._detachPosAlignUIHandles();

        if (this.get(VISIBLE)) {
            this._attachPosAlignUIHandles();
        }
    }
};

Y.WidgetPositionAlign = PositionAlign;


}, '3.7.3', {"requires": ["widget-position"]});
