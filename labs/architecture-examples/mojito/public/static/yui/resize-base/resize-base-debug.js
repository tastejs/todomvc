/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('resize-base', function (Y, NAME) {

/**
 * The Resize Utility allows you to make an HTML element resizable.
 * @module resize
 * @main resize
 */

var Lang = Y.Lang,
    isArray = Lang.isArray,
    isBoolean = Lang.isBoolean,
    isNumber = Lang.isNumber,
    isString = Lang.isString,

    yArray  = Y.Array,
    trim = Lang.trim,
    indexOf = yArray.indexOf,

    COMMA = ',',
    DOT = '.',
    EMPTY_STR = '',
    HANDLE_SUB = '{handle}',
    SPACE = ' ',

    ACTIVE = 'active',
    ACTIVE_HANDLE = 'activeHandle',
    ACTIVE_HANDLE_NODE = 'activeHandleNode',
    ALL = 'all',
    AUTO_HIDE = 'autoHide',
    BORDER = 'border',
    BOTTOM = 'bottom',
    CLASS_NAME = 'className',
    COLOR = 'color',
    DEF_MIN_HEIGHT = 'defMinHeight',
    DEF_MIN_WIDTH = 'defMinWidth',
    HANDLE = 'handle',
    HANDLES = 'handles',
    HANDLES_WRAPPER = 'handlesWrapper',
    HIDDEN = 'hidden',
    INNER = 'inner',
    LEFT = 'left',
    MARGIN = 'margin',
    NODE = 'node',
    NODE_NAME = 'nodeName',
    NONE = 'none',
    OFFSET_HEIGHT = 'offsetHeight',
    OFFSET_WIDTH = 'offsetWidth',
    PADDING = 'padding',
    PARENT_NODE = 'parentNode',
    POSITION = 'position',
    RELATIVE = 'relative',
    RESIZE = 'resize',
    RESIZING = 'resizing',
    RIGHT = 'right',
    STATIC = 'static',
    STYLE = 'style',
    TOP = 'top',
    WIDTH = 'width',
    WRAP = 'wrap',
    WRAPPER = 'wrapper',
    WRAP_TYPES = 'wrapTypes',

    EV_MOUSE_UP = 'resize:mouseUp',
    EV_RESIZE = 'resize:resize',
    EV_RESIZE_ALIGN = 'resize:align',
    EV_RESIZE_END = 'resize:end',
    EV_RESIZE_START = 'resize:start',

    T = 't',
    TR = 'tr',
    R = 'r',
    BR = 'br',
    B = 'b',
    BL = 'bl',
    L = 'l',
    TL = 'tl',

    concat = function() {
        return Array.prototype.slice.call(arguments).join(SPACE);
    },

    // round the passed number to get rid of pixel-flickering
    toRoundNumber = function(num) {
        return Math.round(parseFloat(num)) || 0;
    },

    getCompStyle = function(node, val) {
        return node.getComputedStyle(val);
    },

    handleAttrName = function(handle) {
        return HANDLE + handle.toUpperCase();
    },

    isNode = function(v) {
        return (v instanceof Y.Node);
    },

    toInitialCap = Y.cached(
        function(str) {
            return str.substring(0, 1).toUpperCase() + str.substring(1);
        }
    ),

    capitalize = Y.cached(function() {
        var out = [],
            args = yArray(arguments, 0, true);

        yArray.each(args, function(part, i) {
            if (i > 0) {
                part = toInitialCap(part);
            }
            out.push(part);
        });

        return out.join(EMPTY_STR);
    }),

    getCN = Y.ClassNameManager.getClassName,

    CSS_RESIZE = getCN(RESIZE),
    CSS_RESIZE_HANDLE = getCN(RESIZE, HANDLE),
    CSS_RESIZE_HANDLE_ACTIVE = getCN(RESIZE, HANDLE, ACTIVE),
    CSS_RESIZE_HANDLE_INNER = getCN(RESIZE, HANDLE, INNER),
    CSS_RESIZE_HANDLE_INNER_PLACEHOLDER = getCN(RESIZE, HANDLE, INNER, HANDLE_SUB),
    CSS_RESIZE_HANDLE_PLACEHOLDER = getCN(RESIZE, HANDLE, HANDLE_SUB),
    CSS_RESIZE_HIDDEN_HANDLES = getCN(RESIZE, HIDDEN, HANDLES),
    CSS_RESIZE_HANDLES_WRAPPER = getCN(RESIZE, HANDLES, WRAPPER),
    CSS_RESIZE_WRAPPER = getCN(RESIZE, WRAPPER);

/**
A base class for Resize, providing:

   * Basic Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)
   * Applies drag handles to an element to make it resizable
   * Here is the list of valid resize handles:
       `[ 't', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl' ]`. You can
       read this list as top, top-right, right, bottom-right, bottom,
       bottom-left, left, top-left.
   * The drag handles are inserted into the element and positioned
       absolute. Some elements, such as a textarea or image, don't support
       children. To overcome that, set wrap:true in your config and the
       element willbe wrapped for you automatically.

Quick Example:

    var instance = new Y.Resize({
        node: '#resize1',
        preserveRatio: true,
        wrap: true,
        maxHeight: 170,
        maxWidth: 400,
        handles: 't, tr, r, br, b, bl, l, tl'
    });

Check the list of <a href="Resize.html#configattributes">Configuration Attributes</a> available for
Resize.

@class Resize
@param config {Object} Object literal specifying widget configuration properties.
@constructor
@extends Base
*/

function Resize() {
    Resize.superclass.constructor.apply(this, arguments);
}

Y.mix(Resize, {
    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: RESIZE,

    /**
     * Static property used to define the default attribute
     * configuration for the Resize.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {
        /**
         * Stores the active handle during the resize.
         *
         * @attribute activeHandle
         * @default null
         * @private
         * @type String
         */
        activeHandle: {
            value: null,
            validator: function(v) {
                return Y.Lang.isString(v) || Y.Lang.isNull(v);
            }
        },

        /**
         * Stores the active handle element during the resize.
         *
         * @attribute activeHandleNode
         * @default null
         * @private
         * @type Node
         */
        activeHandleNode: {
            value: null,
            validator: isNode
        },

        /**
         * False to ensure that the resize handles are always visible, true to
         * display them only when the user mouses over the resizable borders.
         *
         * @attribute autoHide
         * @default false
         * @type boolean
         */
        autoHide: {
            value: false,
            validator: isBoolean
        },

        /**
         * The default minimum height of the element. Only used when
         * ResizeConstrained is not plugged.
         *
         * @attribute defMinHeight
         * @default 15
         * @type Number
         */
        defMinHeight: {
            value: 15,
            validator: isNumber
        },

        /**
         * The default minimum width of the element. Only used when
         * ResizeConstrained is not plugged.
         *
         * @attribute defMinWidth
         * @default 15
         * @type Number
         */
        defMinWidth: {
            value: 15,
            validator: isNumber
        },

        /**
         * The handles to use (any combination of): 't', 'b', 'r', 'l', 'bl',
         * 'br', 'tl', 'tr'. Can use a shortcut of All.
         *
         * @attribute handles
         * @default all
         * @type Array | String
         */
        handles: {
            setter: '_setHandles',
            value: ALL
        },

        /**
         * Node to wrap the resize handles.
         *
         * @attribute handlesWrapper
         * @type Node
         */
        handlesWrapper: {
            readOnly: true,
            setter: Y.one,
            valueFn: '_valueHandlesWrapper'
        },

        /**
         * The selector or element to resize. Required.
         *
         * @attribute node
         * @type Node
         */
        node: {
            setter: Y.one
        },

        /**
         * True when the element is being Resized.
         *
         * @attribute resizing
         * @default false
         * @type boolean
         */
        resizing: {
            value: false,
            validator: isBoolean
        },

        /**
         * True to wrap an element with a div if needed (required for textareas
         * and images, defaults to false) in favor of the handles config option.
         * The wrapper element type (default div) could be over-riden passing the
         * <code>wrapper</code> attribute.
         *
         * @attribute wrap
         * @default false
         * @type boolean
         */
        wrap: {
            setter: '_setWrap',
            value: false,
            validator: isBoolean
        },

        /**
         * Elements that requires a wrapper by default. Normally are elements
         * which cannot have children elements.
         *
         * @attribute wrapTypes
         * @default /canvas|textarea|input|select|button|img/i
         * @readOnly
         * @type Regex
         */
        wrapTypes: {
            readOnly: true,
            value: /^canvas|textarea|input|select|button|img|iframe|table|embed$/i
        },

        /**
         * Element to wrap the <code>wrapTypes</code>. This element will house
         * the handles elements.
         *
         * @attribute wrapper
         * @default div
         * @type String | Node
         * @writeOnce
         */
        wrapper: {
            readOnly: true,
            valueFn: '_valueWrapper',
            writeOnce: true
        }
    },

    RULES: {
        b: function(instance, dx, dy) {
            var info = instance.info,
                originalInfo = instance.originalInfo;

            info.offsetHeight = originalInfo.offsetHeight + dy;
        },

        l: function(instance, dx) {
            var info = instance.info,
                originalInfo = instance.originalInfo;

            info.left = originalInfo.left + dx;
            info.offsetWidth = originalInfo.offsetWidth - dx;
        },

        r: function(instance, dx) {
            var info = instance.info,
                originalInfo = instance.originalInfo;

            info.offsetWidth = originalInfo.offsetWidth + dx;
        },

        t: function(instance, dx, dy) {
            var info = instance.info,
                originalInfo = instance.originalInfo;

            info.top = originalInfo.top + dy;
            info.offsetHeight = originalInfo.offsetHeight - dy;
        },

        tr: function() {
            this.t.apply(this, arguments);
            this.r.apply(this, arguments);
        },

        bl: function() {
            this.b.apply(this, arguments);
            this.l.apply(this, arguments);
        },

        br: function() {
            this.b.apply(this, arguments);
            this.r.apply(this, arguments);
        },

        tl: function() {
            this.t.apply(this, arguments);
            this.l.apply(this, arguments);
        }
    },

    capitalize: capitalize
});

Y.Resize = Y.extend(
    Resize,
    Y.Base,
    {
        /**
         * Array containing all possible resizable handles.
         *
         * @property ALL_HANDLES
         * @type {String}
         */
        ALL_HANDLES: [ T, TR, R, BR, B, BL, L, TL ],

        /**
         * Regex which matches with the handles that could change the height of
         * the resizable element.
         *
         * @property REGEX_CHANGE_HEIGHT
         * @type {String}
         */
        REGEX_CHANGE_HEIGHT: /^(t|tr|b|bl|br|tl)$/i,

        /**
         * Regex which matches with the handles that could change the left of
         * the resizable element.
         *
         * @property REGEX_CHANGE_LEFT
         * @type {String}
         */
        REGEX_CHANGE_LEFT: /^(tl|l|bl)$/i,

        /**
         * Regex which matches with the handles that could change the top of
         * the resizable element.
         *
         * @property REGEX_CHANGE_TOP
         * @type {String}
         */
        REGEX_CHANGE_TOP: /^(tl|t|tr)$/i,

        /**
         * Regex which matches with the handles that could change the width of
         * the resizable element.
         *
         * @property REGEX_CHANGE_WIDTH
         * @type {String}
         */
        REGEX_CHANGE_WIDTH: /^(bl|br|l|r|tl|tr)$/i,

        /**
         * Template used to create the resize wrapper for the handles.
         *
         * @property HANDLES_WRAP_TEMPLATE
         * @type {String}
         */
        HANDLES_WRAP_TEMPLATE: '<div class="'+CSS_RESIZE_HANDLES_WRAPPER+'"></div>',

        /**
         * Template used to create the resize wrapper node when needed.
         *
         * @property WRAP_TEMPLATE
         * @type {String}
         */
        WRAP_TEMPLATE: '<div class="'+CSS_RESIZE_WRAPPER+'"></div>',

        /**
         * Template used to create each resize handle.
         *
         * @property HANDLE_TEMPLATE
         * @type {String}
         */
        HANDLE_TEMPLATE: '<div class="'+concat(CSS_RESIZE_HANDLE, CSS_RESIZE_HANDLE_PLACEHOLDER)+'">' +
                            '<div class="'+concat(CSS_RESIZE_HANDLE_INNER, CSS_RESIZE_HANDLE_INNER_PLACEHOLDER)+'">&nbsp;</div>' +
                        '</div>',


        /**
         * Each box has a content area and optional surrounding padding and
         * border areas. This property stores the sum of all horizontal
         * surrounding * information needed to adjust the node height.
         *
         * @property totalHSurrounding
         * @default 0
         * @type number
         */
        totalHSurrounding: 0,

        /**
         * Each box has a content area and optional surrounding padding and
         * border areas. This property stores the sum of all vertical
         * surrounding * information needed to adjust the node height.
         *
         * @property totalVSurrounding
         * @default 0
         * @type number
         */
        totalVSurrounding: 0,

        /**
         * Stores the <a href="Resize.html#attr_node">node</a>
         * surrounding information retrieved from
         * <a href="Resize.html#method__getBoxSurroundingInfo">_getBoxSurroundingInfo</a>.
         *
         * @property nodeSurrounding
         * @type Object
         * @default null
         */
        nodeSurrounding: null,

        /**
         * Stores the <a href="Resize.html#attr_wrapper">wrapper</a>
         * surrounding information retrieved from
         * <a href="Resize.html#method__getBoxSurroundingInfo">_getBoxSurroundingInfo</a>.
         *
         * @property wrapperSurrounding
         * @type Object
         * @default null
         */
        wrapperSurrounding: null,

        /**
         * Whether the handle being dragged can change the height.
         *
         * @property changeHeightHandles
         * @default false
         * @type boolean
         */
        changeHeightHandles: false,

        /**
         * Whether the handle being dragged can change the left.
         *
         * @property changeLeftHandles
         * @default false
         * @type boolean
         */
        changeLeftHandles: false,

        /**
         * Whether the handle being dragged can change the top.
         *
         * @property changeTopHandles
         * @default false
         * @type boolean
         */
        changeTopHandles: false,

        /**
         * Whether the handle being dragged can change the width.
         *
         * @property changeWidthHandles
         * @default false
         * @type boolean
         */
        changeWidthHandles: false,

        /**
         * Store DD.Delegate reference for the respective Resize instance.
         *
         * @property delegate
         * @default null
         * @type Object
         */
        delegate: null,

        /**
         * Stores the current values for the height, width, top and left. You are
         * able to manipulate these values on resize in order to change the resize
         * behavior.
         *
         * @property info
         * @type Object
         * @protected
         */
        info: null,

        /**
         * Stores the last values for the height, width, top and left.
         *
         * @property lastInfo
         * @type Object
         * @protected
         */
        lastInfo: null,

        /**
         * Stores the original values for the height, width, top and left, stored
         * on resize start.
         *
         * @property originalInfo
         * @type Object
         * @protected
         */
        originalInfo: null,

        /**
         * Construction logic executed during Resize instantiation. Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            this._eventHandles = [];

            this.renderer();
        },

        /**
         * Create the DOM structure for the Resize. Lifecycle.
         *
         * @method renderUI
         * @protected
         */
        renderUI: function() {
            var instance = this;

            instance._renderHandles();
        },

        /**
         * Bind the events on the Resize UI. Lifecycle.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var instance = this;

            instance._createEvents();
            instance._bindDD();
            instance._bindHandle();
        },

        /**
         * Sync the Resize UI.
         *
         * @method syncUI
         * @protected
         */
        syncUI: function() {
            var instance = this;

            this.get(NODE).addClass(CSS_RESIZE);

            // hide handles if AUTO_HIDE is true
            instance._setHideHandlesUI(
                instance.get(AUTO_HIDE)
            );
        },

        /**
         * Destructor lifecycle implementation for the Resize class.
         * Detaches all previously attached listeners and removes the Resize handles.
         *
         * @method destructor
         * @protected
         */
        destructor: function() {
            var instance = this,
                node = instance.get(NODE),
                wrapper = instance.get(WRAPPER),
                pNode = wrapper.get(PARENT_NODE);

            Y.each(
                instance._eventHandles,
                function(handle) {
                    handle.detach();
                }
            );

            instance._eventHandles.length = 0;

            // destroy handles dd and remove them from the dom
            instance.eachHandle(function(handleEl) {
                instance.delegate.dd.destroy();

                // remove handle
                handleEl.remove(true);
            });

            instance.delegate.destroy();

            // unwrap node
            if (instance.get(WRAP)) {
                instance._copyStyles(wrapper, node);

                if (pNode) {
                    pNode.insertBefore(node, wrapper);
                }

                wrapper.remove(true);
            }

            node.removeClass(CSS_RESIZE);
            node.removeClass(CSS_RESIZE_HIDDEN_HANDLES);
        },

        /**
         * Creates DOM (or manipulates DOM for progressive enhancement)
         * This method is invoked by initializer(). It's chained automatically for
         * subclasses if required.
         *
         * @method renderer
         * @protected
         */
        renderer: function() {
            this.renderUI();
            this.bindUI();
            this.syncUI();
        },

        /**
         * <p>Loop through each handle which is being used and executes a callback.</p>
         * <p>Example:</p>
         * <pre><code>instance.eachHandle(
         *      function(handleName, index) { ... }
         *  );</code></pre>
         *
         * @method eachHandle
         * @param {function} fn Callback function to be executed for each handle.
         */
        eachHandle: function(fn) {
            var instance = this;

            Y.each(
                instance.get(HANDLES),
                function(handle, i) {
                    var handleEl = instance.get(
                        handleAttrName(handle)
                    );

                    fn.apply(instance, [handleEl, handle, i]);
                }
            );
        },

        /**
         * Bind the handles DragDrop events to the Resize instance.
         *
         * @method _bindDD
         * @private
         */
        _bindDD: function() {
            var instance = this;

            instance.delegate = new Y.DD.Delegate(
                {
                    bubbleTargets: instance,
                    container: instance.get(HANDLES_WRAPPER),
                    dragConfig: {
                        clickPixelThresh: 0,
                        clickTimeThresh: 0,
                        useShim: true,
                        move: false
                    },
                    nodes: DOT+CSS_RESIZE_HANDLE,
                    target: false
                }
            );

            instance._eventHandles.push(
                instance.on('drag:drag', instance._handleResizeEvent),
                instance.on('drag:dropmiss', instance._handleMouseUpEvent),
                instance.on('drag:end', instance._handleResizeEndEvent),
                instance.on('drag:start', instance._handleResizeStartEvent)
            );
        },

        /**
         * Bind the events related to the handles (_onHandleMouseEnter, _onHandleMouseLeave).
         *
         * @method _bindHandle
         * @private
         */
        _bindHandle: function() {
            var instance = this,
                wrapper = instance.get(WRAPPER);

            instance._eventHandles.push(
                wrapper.on('mouseenter', Y.bind(instance._onWrapperMouseEnter, instance)),
                wrapper.on('mouseleave', Y.bind(instance._onWrapperMouseLeave, instance)),
                wrapper.delegate('mouseenter', Y.bind(instance._onHandleMouseEnter, instance), DOT+CSS_RESIZE_HANDLE),
                wrapper.delegate('mouseleave', Y.bind(instance._onHandleMouseLeave, instance), DOT+CSS_RESIZE_HANDLE)
            );
        },

        /**
         * Create the custom events used on the Resize.
         *
         * @method _createEvents
         * @private
         */
        _createEvents: function() {
            var instance = this,
                // create publish function for kweight optimization
                publish = function(name, fn) {
                    instance.publish(name, {
                        defaultFn: fn,
                        queuable: false,
                        emitFacade: true,
                        bubbles: true,
                        prefix: RESIZE
                    });
                };

            /**
             * Handles the resize start event. Fired when a handle starts to be
             * dragged.
             *
             * @event resize:start
             * @preventable _defResizeStartFn
             * @param {Event.Facade} event The resize start event.
             * @bubbles Resize
             * @type {Event.Custom}
             */
            publish(EV_RESIZE_START, this._defResizeStartFn);

            /**
             * Handles the resize event. Fired on each pixel when the handle is
             * being dragged.
             *
             * @event resize:resize
             * @preventable _defResizeFn
             * @param {Event.Facade} event The resize event.
             * @bubbles Resize
             * @type {Event.Custom}
             */
            publish(EV_RESIZE, this._defResizeFn);

            /**
             * Handles the resize align event.
             *
             * @event resize:align
             * @preventable _defResizeAlignFn
             * @param {Event.Facade} event The resize align event.
             * @bubbles Resize
             * @type {Event.Custom}
             */
            publish(EV_RESIZE_ALIGN, this._defResizeAlignFn);

            /**
             * Handles the resize end event. Fired when a handle stop to be
             * dragged.
             *
             * @event resize:end
             * @preventable _defResizeEndFn
             * @param {Event.Facade} event The resize end event.
             * @bubbles Resize
             * @type {Event.Custom}
             */
            publish(EV_RESIZE_END, this._defResizeEndFn);

            /**
             * Handles the resize mouseUp event. Fired when a mouseUp event happens on a
             * handle.
             *
             * @event resize:mouseUp
             * @preventable _defMouseUpFn
             * @param {Event.Facade} event The resize mouseUp event.
             * @bubbles Resize
             * @type {Event.Custom}
             */
            publish(EV_MOUSE_UP, this._defMouseUpFn);
        },

        /**
          * Responsible for loop each handle element and append to the wrapper.
          *
          * @method _renderHandles
          * @protected
          */
        _renderHandles: function() {
            var instance = this,
                wrapper = instance.get(WRAPPER),
                handlesWrapper = instance.get(HANDLES_WRAPPER);

            instance.eachHandle(function(handleEl) {
                handlesWrapper.append(handleEl);
            });

            wrapper.append(handlesWrapper);
        },

        /**
         * Creates the handle element based on the handle name and initialize the
         * DragDrop on it.
         *
         * @method _buildHandle
         * @param {String} handle Handle name ('t', 'tr', 'b', ...).
         * @protected
         */
        _buildHandle: function(handle) {
            var instance = this;

            return Y.Node.create(
                Y.Lang.sub(instance.HANDLE_TEMPLATE, {
                    handle: handle
                })
            );
        },

        /**
         * Basic resize calculations.
         *
         * @method _calcResize
         * @protected
         */
        _calcResize: function() {
            var instance = this,
                handle = instance.handle,
                info = instance.info,
                originalInfo = instance.originalInfo,

                dx = info.actXY[0] - originalInfo.actXY[0],
                dy = info.actXY[1] - originalInfo.actXY[1];

            if (handle && Y.Resize.RULES[handle]) {
                Y.Resize.RULES[handle](instance, dx, dy);
            }
            else {
                Y.log('Handle rule not found: ' + handle, 'warn', 'resize');
            }
        },

        /**
         * Helper method to update the current size value on
         * <a href="Resize.html#property_info">info</a> to respect the
         * min/max values and fix the top/left calculations.
         *
         * @method _checkSize
         * @param {String} offset 'offsetHeight' or 'offsetWidth'
         * @param {number} size Size to restrict the offset
         * @protected
         */
        _checkSize: function(offset, size) {
            var instance = this,
                info = instance.info,
                originalInfo = instance.originalInfo,
                axis = (offset === OFFSET_HEIGHT) ? TOP : LEFT;

            // forcing the offsetHeight/offsetWidth to be the passed size
            info[offset] = size;

            // predicting, based on the original information, the last left valid in case of reach the min/max dimension
            // this calculation avoid browser event leaks when user interact very fast
            if (((axis === LEFT) && instance.changeLeftHandles) ||
                ((axis === TOP) && instance.changeTopHandles)) {

                info[axis] = originalInfo[axis] + originalInfo[offset] - size;
            }
        },

        /**
         * Copy relevant styles of the <a href="Resize.html#attr_node">node</a>
         * to the <a href="Resize.html#attr_wrapper">wrapper</a>.
         *
         * @method _copyStyles
         * @param {Node} node Node from.
         * @param {Node} wrapper Node to.
         * @protected
         */
        _copyStyles: function(node, wrapper) {
            var position = node.getStyle(POSITION).toLowerCase(),
                surrounding = this._getBoxSurroundingInfo(node),
                wrapperStyle;

            // resizable wrapper should be positioned
            if (position === STATIC) {
                position = RELATIVE;
            }

            wrapperStyle = {
                position: position,
                left: getCompStyle(node, LEFT),
                top: getCompStyle(node, TOP)
            };

            Y.mix(wrapperStyle, surrounding.margin);
            Y.mix(wrapperStyle, surrounding.border);

            wrapper.setStyles(wrapperStyle);

            // remove margin and border from the internal node
            node.setStyles({ border: 0, margin: 0 });

            wrapper.sizeTo(
                node.get(OFFSET_WIDTH) + surrounding.totalHBorder,
                node.get(OFFSET_HEIGHT) + surrounding.totalVBorder
            );
        },

        // extract handle name from a string
        // using Y.cached to memoize the function for performance
        _extractHandleName: Y.cached(
            function(node) {
                var className = node.get(CLASS_NAME),

                    match = className.match(
                        new RegExp(
                            getCN(RESIZE, HANDLE, '(\\w{1,2})\\b')
                        )
                    );

                return match ? match[1] : null;
            }
        ),

        /**
         * <p>Generates metadata to the <a href="Resize.html#property_info">info</a>
         * and <a href="Resize.html#property_originalInfo">originalInfo</a></p>
         * <pre><code>bottom, actXY, left, top, offsetHeight, offsetWidth, right</code></pre>
         *
         * @method _getInfo
         * @param {Node} node
         * @param {EventFacade} event
         * @private
         */
        _getInfo: function(node, event) {
            var actXY = [0,0],
                drag = event.dragEvent.target,
                nodeXY = node.getXY(),
                nodeX = nodeXY[0],
                nodeY = nodeXY[1],
                offsetHeight = node.get(OFFSET_HEIGHT),
                offsetWidth = node.get(OFFSET_WIDTH);

            if (event) {
                // the xy that the node will be set to. Changing this will alter the position as it's dragged.
                actXY = (drag.actXY.length ? drag.actXY : drag.lastXY);
            }

            return {
                actXY: actXY,
                bottom: (nodeY + offsetHeight),
                left: nodeX,
                offsetHeight: offsetHeight,
                offsetWidth: offsetWidth,
                right: (nodeX + offsetWidth),
                top: nodeY
            };
        },

        /**
         * Each box has a content area and optional surrounding margin,
         * padding and * border areas. This method get all this information from
         * the passed node. For more reference see
         * <a href="http://www.w3.org/TR/CSS21/box.html#box-dimensions">
         * http://www.w3.org/TR/CSS21/box.html#box-dimensions</a>.
         *
         * @method _getBoxSurroundingInfo
         * @param {Node} node
         * @private
         * @return {Object}
         */
        _getBoxSurroundingInfo: function(node) {
            var info = {
                padding: {},
                margin: {},
                border: {}
            };

            if (isNode(node)) {
                Y.each([ TOP, RIGHT, BOTTOM, LEFT ], function(dir) {
                    var paddingProperty = capitalize(PADDING, dir),
                        marginProperty = capitalize(MARGIN, dir),
                        borderWidthProperty = capitalize(BORDER, dir, WIDTH),
                        borderColorProperty = capitalize(BORDER, dir, COLOR),
                        borderStyleProperty = capitalize(BORDER, dir, STYLE);

                    info.border[borderColorProperty] = getCompStyle(node, borderColorProperty);
                    info.border[borderStyleProperty] = getCompStyle(node, borderStyleProperty);
                    info.border[borderWidthProperty] = getCompStyle(node, borderWidthProperty);
                    info.margin[marginProperty] = getCompStyle(node, marginProperty);
                    info.padding[paddingProperty] = getCompStyle(node, paddingProperty);
                });
            }

            info.totalHBorder = (toRoundNumber(info.border.borderLeftWidth) + toRoundNumber(info.border.borderRightWidth));
            info.totalHPadding = (toRoundNumber(info.padding.paddingLeft) + toRoundNumber(info.padding.paddingRight));
            info.totalVBorder = (toRoundNumber(info.border.borderBottomWidth) + toRoundNumber(info.border.borderTopWidth));
            info.totalVPadding = (toRoundNumber(info.padding.paddingBottom) + toRoundNumber(info.padding.paddingTop));

            return info;
        },

        /**
         * Sync the Resize UI with internal values from
         * <a href="Resize.html#property_info">info</a>.
         *
         * @method _syncUI
         * @protected
         */
        _syncUI: function() {
            var instance = this,
                info = instance.info,
                wrapperSurrounding = instance.wrapperSurrounding,
                wrapper = instance.get(WRAPPER),
                node = instance.get(NODE);

            wrapper.sizeTo(info.offsetWidth, info.offsetHeight);

            if (instance.changeLeftHandles || instance.changeTopHandles) {
                wrapper.setXY([info.left, info.top]);
            }

            // if a wrap node is being used
            if (!wrapper.compareTo(node)) {
                // the original internal node borders were copied to the wrapper on
                // _copyStyles, to compensate that subtract the borders from the internal node
                node.sizeTo(
                    info.offsetWidth - wrapperSurrounding.totalHBorder,
                    info.offsetHeight - wrapperSurrounding.totalVBorder
                );
            }

            // prevent webkit textarea resize
            if (Y.UA.webkit) {
                node.setStyle(RESIZE, NONE);
            }
        },

        /**
         * Update <code>instance.changeHeightHandles,
         * instance.changeLeftHandles, instance.changeTopHandles,
         * instance.changeWidthHandles</code> information.
         *
         * @method _updateChangeHandleInfo
         * @private
         */
        _updateChangeHandleInfo: function(handle) {
            var instance = this;

            instance.changeHeightHandles = instance.REGEX_CHANGE_HEIGHT.test(handle);
            instance.changeLeftHandles = instance.REGEX_CHANGE_LEFT.test(handle);
            instance.changeTopHandles = instance.REGEX_CHANGE_TOP.test(handle);
            instance.changeWidthHandles = instance.REGEX_CHANGE_WIDTH.test(handle);
        },

        /**
         * Update <a href="Resize.html#property_info">info</a> values (bottom, actXY, left, top, offsetHeight, offsetWidth, right).
         *
         * @method _updateInfo
         * @private
         */
        _updateInfo: function(event) {
            var instance = this;

            instance.info = instance._getInfo(instance.get(WRAPPER), event);
        },

        /**
         * Update properties
         * <a href="Resize.html#property_nodeSurrounding">nodeSurrounding</a>,
         * <a href="Resize.html#property_nodeSurrounding">wrapperSurrounding</a>,
         * <a href="Resize.html#property_nodeSurrounding">totalVSurrounding</a>,
         * <a href="Resize.html#property_nodeSurrounding">totalHSurrounding</a>.
         *
         * @method _updateSurroundingInfo
         * @private
         */
        _updateSurroundingInfo: function() {
            var instance = this,
                node = instance.get(NODE),
                wrapper = instance.get(WRAPPER),
                nodeSurrounding = instance._getBoxSurroundingInfo(node),
                wrapperSurrounding = instance._getBoxSurroundingInfo(wrapper);

            instance.nodeSurrounding = nodeSurrounding;
            instance.wrapperSurrounding = wrapperSurrounding;

            instance.totalVSurrounding = (nodeSurrounding.totalVPadding + wrapperSurrounding.totalVBorder);
            instance.totalHSurrounding = (nodeSurrounding.totalHPadding + wrapperSurrounding.totalHBorder);
        },

        /**
         * Set the active state of the handles.
         *
         * @method _setActiveHandlesUI
         * @param {boolean} val True to activate the handles, false to deactivate.
         * @protected
         */
        _setActiveHandlesUI: function(val) {
            var instance = this,
                activeHandleNode = instance.get(ACTIVE_HANDLE_NODE);

            if (activeHandleNode) {
                if (val) {
                    // remove CSS_RESIZE_HANDLE_ACTIVE from all handles before addClass on the active
                    instance.eachHandle(
                        function(handleEl) {
                            handleEl.removeClass(CSS_RESIZE_HANDLE_ACTIVE);
                        }
                    );

                    activeHandleNode.addClass(CSS_RESIZE_HANDLE_ACTIVE);
                }
                else {
                    activeHandleNode.removeClass(CSS_RESIZE_HANDLE_ACTIVE);
                }
            }
        },

        /**
         * Setter for the handles attribute
         *
         * @method _setHandles
         * @protected
         * @param {String} val
         */
        _setHandles: function(val) {
            var instance = this,
                handles = [];

            // handles attr accepts both array or string
            if (isArray(val)) {
                handles = val;
            }
            else if (isString(val)) {
                // if the handles attr passed in is an ALL string...
                if (val.toLowerCase() === ALL) {
                    handles = instance.ALL_HANDLES;
                }
                // otherwise, split the string to extract the handles
                else {
                    Y.each(
                        val.split(COMMA),
                        function(node) {
                            var handle = trim(node);

                            // if its a valid handle, add it to the handles output
                            if (indexOf(instance.ALL_HANDLES, handle) > -1) {
                                handles.push(handle);
                            }
                        }
                    );
                }
            }

            return handles;
        },

        /**
         * Set the visibility of the handles.
         *
         * @method _setHideHandlesUI
         * @param {boolean} val True to hide the handles, false to show.
         * @protected
         */
        _setHideHandlesUI: function(val) {
            var instance = this,
                wrapper = instance.get(WRAPPER);

            if (!instance.get(RESIZING)) {
                if (val) {
                    wrapper.addClass(CSS_RESIZE_HIDDEN_HANDLES);
                }
                else {
                    wrapper.removeClass(CSS_RESIZE_HIDDEN_HANDLES);
                }
            }
        },

        /**
         * Setter for the wrap attribute
         *
         * @method _setWrap
         * @protected
         * @param {boolean} val
         */
        _setWrap: function(val) {
            var instance = this,
                node = instance.get(NODE),
                nodeName = node.get(NODE_NAME),
                typeRegex = instance.get(WRAP_TYPES);

            // if nodeName is listed on WRAP_TYPES force use the wrapper
            if (typeRegex.test(nodeName)) {
                val = true;
            }

            return val;
        },

        /**
         * Default resize:mouseUp handler
         *
         * @method _defMouseUpFn
         * @param {EventFacade} event The Event object
         * @protected
         */
        _defMouseUpFn: function() {
            var instance = this;

            instance.set(RESIZING, false);
        },

        /**
         * Default resize:resize handler
         *
         * @method _defResizeFn
         * @param {EventFacade} event The Event object
         * @protected
         */
        _defResizeFn: function(event) {
            var instance = this;

            instance._resize(event);
        },

        /**
         * Logic method for _defResizeFn. Allow AOP.
         *
         * @method _resize
         * @param {EventFacade} event The Event object
         * @protected
         */
        _resize: function(event) {
            var instance = this;

            instance._handleResizeAlignEvent(event.dragEvent);

            // _syncUI of the wrapper, not using proxy
            instance._syncUI();
        },

        /**
         * Default resize:align handler
         *
         * @method _defResizeAlignFn
         * @param {EventFacade} event The Event object
         * @protected
         */
        _defResizeAlignFn: function(event) {
            var instance = this;

            instance._resizeAlign(event);
        },

        /**
         * Logic method for _defResizeAlignFn. Allow AOP.
         *
         * @method _resizeAlign
         * @param {EventFacade} event The Event object
         * @protected
         */
        _resizeAlign: function(event) {
            var instance = this,
                info,
                defMinHeight,
                defMinWidth;

            instance.lastInfo = instance.info;

            // update the instance.info values
            instance._updateInfo(event);

            info = instance.info;

            // basic resize calculations
            instance._calcResize();

            // if Y.Plugin.ResizeConstrained is not plugged, check for min dimension
            if (!instance.con) {
                defMinHeight = (instance.get(DEF_MIN_HEIGHT) + instance.totalVSurrounding);
                defMinWidth = (instance.get(DEF_MIN_WIDTH) + instance.totalHSurrounding);

                if (info.offsetHeight <= defMinHeight) {
                    instance._checkSize(OFFSET_HEIGHT, defMinHeight);
                }

                if (info.offsetWidth <= defMinWidth) {
                    instance._checkSize(OFFSET_WIDTH, defMinWidth);
                }
            }
        },

        /**
         * Default resize:end handler
         *
         * @method _defResizeEndFn
         * @param {EventFacade} event The Event object
         * @protected
         */
        _defResizeEndFn: function(event) {
            var instance = this;

            instance._resizeEnd(event);
        },

        /**
         * Logic method for _defResizeEndFn. Allow AOP.
         *
         * @method _resizeEnd
         * @param {EventFacade} event The Event object
         * @protected
         */
        _resizeEnd: function(event) {
            var instance = this,
                drag = event.dragEvent.target;

            // reseting actXY from drag when drag end
            drag.actXY = [];

            // syncUI when resize end
            instance._syncUI();

            instance._setActiveHandlesUI(false);

            instance.set(ACTIVE_HANDLE, null);
            instance.set(ACTIVE_HANDLE_NODE, null);

            instance.handle = null;
        },

        /**
         * Default resize:start handler
         *
         * @method _defResizeStartFn
         * @param {EventFacade} event The Event object
         * @protected
         */
        _defResizeStartFn: function(event) {
            var instance = this;

            instance._resizeStart(event);
        },

        /**
         * Logic method for _defResizeStartFn. Allow AOP.
         *
         * @method _resizeStart
         * @param {EventFacade} event The Event object
         * @protected
         */
        _resizeStart: function(event) {
            var instance = this,
                wrapper = instance.get(WRAPPER);

            instance.handle = instance.get(ACTIVE_HANDLE);

            instance.set(RESIZING, true);

            instance._updateSurroundingInfo();

            // create an originalInfo information for reference
            instance.originalInfo = instance._getInfo(wrapper, event);

            instance._updateInfo(event);
        },

        /**
         * Fires the resize:mouseUp event.
         *
         * @method _handleMouseUpEvent
         * @param {EventFacade} event resize:mouseUp event facade
         * @protected
         */
        _handleMouseUpEvent: function(event) {
            this.fire(EV_MOUSE_UP, { dragEvent: event, info: this.info });
        },

        /**
         * Fires the resize:resize event.
         *
         * @method _handleResizeEvent
         * @param {EventFacade} event resize:resize event facade
         * @protected
         */
        _handleResizeEvent: function(event) {
            this.fire(EV_RESIZE, { dragEvent: event, info: this.info });
        },

        /**
         * Fires the resize:align event.
         *
         * @method _handleResizeAlignEvent
         * @param {EventFacade} event resize:resize event facade
         * @protected
         */
        _handleResizeAlignEvent: function(event) {
            this.fire(EV_RESIZE_ALIGN, { dragEvent: event, info: this.info });
        },

        /**
         * Fires the resize:end event.
         *
         * @method _handleResizeEndEvent
         * @param {EventFacade} event resize:end event facade
         * @protected
         */
        _handleResizeEndEvent: function(event) {
            this.fire(EV_RESIZE_END, { dragEvent: event, info: this.info });
        },

        /**
         * Fires the resize:start event.
         *
         * @method _handleResizeStartEvent
         * @param {EventFacade} event resize:start event facade
         * @protected
         */
        _handleResizeStartEvent: function(event) {
            if (!this.get(ACTIVE_HANDLE)) {
                //This handles the "touch" case
                this._setHandleFromNode(event.target.get('node'));
            }
            this.fire(EV_RESIZE_START, { dragEvent: event, info: this.info });
        },

        /**
         * Mouseenter event handler for the <a href="Resize.html#attr_wrapper">wrapper</a>.
         *
         * @method _onWrapperMouseEnter
         * @param {EventFacade} event
         * @protected
         */
        _onWrapperMouseEnter: function() {
            var instance = this;

            if (instance.get(AUTO_HIDE)) {
                instance._setHideHandlesUI(false);
            }
        },

        /**
         * Mouseleave event handler for the <a href="Resize.html#attr_wrapper">wrapper</a>.
         *
         * @method _onWrapperMouseLeave
         * @param {EventFacade} event
         * @protected
         */
        _onWrapperMouseLeave: function() {
            var instance = this;

            if (instance.get(AUTO_HIDE)) {
                instance._setHideHandlesUI(true);
            }
        },

        /**
         * Handles setting the activeHandle from a node, used from startDrag (for touch) and mouseenter (for mouse).
         *
         * @method _setHandleFromNode
         * @param {Node} node
         * @protected
         */
        _setHandleFromNode: function(node) {
            var instance = this,
                handle = instance._extractHandleName(node);

            if (!instance.get(RESIZING)) {
                instance.set(ACTIVE_HANDLE, handle);
                instance.set(ACTIVE_HANDLE_NODE, node);

                instance._setActiveHandlesUI(true);
                instance._updateChangeHandleInfo(handle);
            }
        },

        /**
         * Mouseenter event handler for the handles.
         *
         * @method _onHandleMouseEnter
         * @param {EventFacade} event
         * @protected
         */
        _onHandleMouseEnter: function(event) {
            this._setHandleFromNode(event.currentTarget);
        },

        /**
         * Mouseout event handler for the handles.
         *
         * @method _onHandleMouseLeave
         * @param {EventFacade} event
         * @protected
         */
        _onHandleMouseLeave: function() {
            var instance = this;

            if (!instance.get(RESIZING)) {
                instance._setActiveHandlesUI(false);
            }
        },

        /**
         * Default value for the wrapper handles node attribute
         *
         * @method _valueHandlesWrapper
         * @protected
         * @readOnly
         */
        _valueHandlesWrapper: function() {
            return Y.Node.create(this.HANDLES_WRAP_TEMPLATE);
        },

        /**
         * Default value for the wrapper attribute
         *
         * @method _valueWrapper
         * @protected
         * @readOnly
         */
        _valueWrapper: function() {
            var instance = this,
                node = instance.get(NODE),
                pNode = node.get(PARENT_NODE),
                // by deafult the wrapper is always the node
                wrapper = node;

            // if the node is listed on the wrapTypes or wrap is set to true, create another wrapper
            if (instance.get(WRAP)) {
                wrapper = Y.Node.create(instance.WRAP_TEMPLATE);

                if (pNode) {
                    pNode.insertBefore(wrapper, node);
                }

                wrapper.append(node);

                instance._copyStyles(node, wrapper);

                // remove positioning of wrapped node, the WRAPPER take care about positioning
                node.setStyles({
                    position: STATIC,
                    left: 0,
                    top: 0
                });
            }

            return wrapper;
        }
    }
);

Y.each(Y.Resize.prototype.ALL_HANDLES, function(handle) {
    // creating ATTRS with the handles elements
    Y.Resize.ATTRS[handleAttrName(handle)] = {
        setter: function() {
            return this._buildHandle(handle);
        },
        value: null,
        writeOnce: true
    };
});


}, '3.7.3', {"requires": ["base", "widget", "event", "oop", "dd-drag", "dd-delegate", "dd-drop"], "skinnable": true});
