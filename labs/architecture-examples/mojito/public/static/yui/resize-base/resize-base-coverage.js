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
_yuitest_coverage["build/resize-base/resize-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/resize-base/resize-base.js",
    code: []
};
_yuitest_coverage["build/resize-base/resize-base.js"].code=["YUI.add('resize-base', function (Y, NAME) {","","/**"," * The Resize Utility allows you to make an HTML element resizable."," * @module resize"," * @main resize"," */","","var Lang = Y.Lang,","    isArray = Lang.isArray,","    isBoolean = Lang.isBoolean,","    isNumber = Lang.isNumber,","    isString = Lang.isString,","","    yArray  = Y.Array,","    trim = Lang.trim,","    indexOf = yArray.indexOf,","","    COMMA = ',',","    DOT = '.',","    EMPTY_STR = '',","    HANDLE_SUB = '{handle}',","    SPACE = ' ',","","    ACTIVE = 'active',","    ACTIVE_HANDLE = 'activeHandle',","    ACTIVE_HANDLE_NODE = 'activeHandleNode',","    ALL = 'all',","    AUTO_HIDE = 'autoHide',","    BORDER = 'border',","    BOTTOM = 'bottom',","    CLASS_NAME = 'className',","    COLOR = 'color',","    DEF_MIN_HEIGHT = 'defMinHeight',","    DEF_MIN_WIDTH = 'defMinWidth',","    HANDLE = 'handle',","    HANDLES = 'handles',","    HANDLES_WRAPPER = 'handlesWrapper',","    HIDDEN = 'hidden',","    INNER = 'inner',","    LEFT = 'left',","    MARGIN = 'margin',","    NODE = 'node',","    NODE_NAME = 'nodeName',","    NONE = 'none',","    OFFSET_HEIGHT = 'offsetHeight',","    OFFSET_WIDTH = 'offsetWidth',","    PADDING = 'padding',","    PARENT_NODE = 'parentNode',","    POSITION = 'position',","    RELATIVE = 'relative',","    RESIZE = 'resize',","    RESIZING = 'resizing',","    RIGHT = 'right',","    STATIC = 'static',","    STYLE = 'style',","    TOP = 'top',","    WIDTH = 'width',","    WRAP = 'wrap',","    WRAPPER = 'wrapper',","    WRAP_TYPES = 'wrapTypes',","","    EV_MOUSE_UP = 'resize:mouseUp',","    EV_RESIZE = 'resize:resize',","    EV_RESIZE_ALIGN = 'resize:align',","    EV_RESIZE_END = 'resize:end',","    EV_RESIZE_START = 'resize:start',","","    T = 't',","    TR = 'tr',","    R = 'r',","    BR = 'br',","    B = 'b',","    BL = 'bl',","    L = 'l',","    TL = 'tl',","","    concat = function() {","        return Array.prototype.slice.call(arguments).join(SPACE);","    },","","    // round the passed number to get rid of pixel-flickering","    toRoundNumber = function(num) {","        return Math.round(parseFloat(num)) || 0;","    },","","    getCompStyle = function(node, val) {","        return node.getComputedStyle(val);","    },","","    handleAttrName = function(handle) {","        return HANDLE + handle.toUpperCase();","    },","","    isNode = function(v) {","        return (v instanceof Y.Node);","    },","","    toInitialCap = Y.cached(","        function(str) {","            return str.substring(0, 1).toUpperCase() + str.substring(1);","        }","    ),","","    capitalize = Y.cached(function() {","        var out = [],","            args = yArray(arguments, 0, true);","","        yArray.each(args, function(part, i) {","            if (i > 0) {","                part = toInitialCap(part);","            }","            out.push(part);","        });","","        return out.join(EMPTY_STR);","    }),","","    getCN = Y.ClassNameManager.getClassName,","","    CSS_RESIZE = getCN(RESIZE),","    CSS_RESIZE_HANDLE = getCN(RESIZE, HANDLE),","    CSS_RESIZE_HANDLE_ACTIVE = getCN(RESIZE, HANDLE, ACTIVE),","    CSS_RESIZE_HANDLE_INNER = getCN(RESIZE, HANDLE, INNER),","    CSS_RESIZE_HANDLE_INNER_PLACEHOLDER = getCN(RESIZE, HANDLE, INNER, HANDLE_SUB),","    CSS_RESIZE_HANDLE_PLACEHOLDER = getCN(RESIZE, HANDLE, HANDLE_SUB),","    CSS_RESIZE_HIDDEN_HANDLES = getCN(RESIZE, HIDDEN, HANDLES),","    CSS_RESIZE_HANDLES_WRAPPER = getCN(RESIZE, HANDLES, WRAPPER),","    CSS_RESIZE_WRAPPER = getCN(RESIZE, WRAPPER);","","/**","A base class for Resize, providing:","","   * Basic Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)","   * Applies drag handles to an element to make it resizable","   * Here is the list of valid resize handles:","       `[ 't', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl' ]`. You can","       read this list as top, top-right, right, bottom-right, bottom,","       bottom-left, left, top-left.","   * The drag handles are inserted into the element and positioned","       absolute. Some elements, such as a textarea or image, don't support","       children. To overcome that, set wrap:true in your config and the","       element willbe wrapped for you automatically.","","Quick Example:","","    var instance = new Y.Resize({","        node: '#resize1',","        preserveRatio: true,","        wrap: true,","        maxHeight: 170,","        maxWidth: 400,","        handles: 't, tr, r, br, b, bl, l, tl'","    });","","Check the list of <a href=\"Resize.html#configattributes\">Configuration Attributes</a> available for","Resize.","","@class Resize","@param config {Object} Object literal specifying widget configuration properties.","@constructor","@extends Base","*/","","function Resize() {","    Resize.superclass.constructor.apply(this, arguments);","}","","Y.mix(Resize, {","    /**","     * Static property provides a string to identify the class.","     *","     * @property NAME","     * @type String","     * @static","     */","    NAME: RESIZE,","","    /**","     * Static property used to define the default attribute","     * configuration for the Resize.","     *","     * @property ATTRS","     * @type Object","     * @static","     */","    ATTRS: {","        /**","         * Stores the active handle during the resize.","         *","         * @attribute activeHandle","         * @default null","         * @private","         * @type String","         */","        activeHandle: {","            value: null,","            validator: function(v) {","                return Y.Lang.isString(v) || Y.Lang.isNull(v);","            }","        },","","        /**","         * Stores the active handle element during the resize.","         *","         * @attribute activeHandleNode","         * @default null","         * @private","         * @type Node","         */","        activeHandleNode: {","            value: null,","            validator: isNode","        },","","        /**","         * False to ensure that the resize handles are always visible, true to","         * display them only when the user mouses over the resizable borders.","         *","         * @attribute autoHide","         * @default false","         * @type boolean","         */","        autoHide: {","            value: false,","            validator: isBoolean","        },","","        /**","         * The default minimum height of the element. Only used when","         * ResizeConstrained is not plugged.","         *","         * @attribute defMinHeight","         * @default 15","         * @type Number","         */","        defMinHeight: {","            value: 15,","            validator: isNumber","        },","","        /**","         * The default minimum width of the element. Only used when","         * ResizeConstrained is not plugged.","         *","         * @attribute defMinWidth","         * @default 15","         * @type Number","         */","        defMinWidth: {","            value: 15,","            validator: isNumber","        },","","        /**","         * The handles to use (any combination of): 't', 'b', 'r', 'l', 'bl',","         * 'br', 'tl', 'tr'. Can use a shortcut of All.","         *","         * @attribute handles","         * @default all","         * @type Array | String","         */","        handles: {","            setter: '_setHandles',","            value: ALL","        },","","        /**","         * Node to wrap the resize handles.","         *","         * @attribute handlesWrapper","         * @type Node","         */","        handlesWrapper: {","            readOnly: true,","            setter: Y.one,","            valueFn: '_valueHandlesWrapper'","        },","","        /**","         * The selector or element to resize. Required.","         *","         * @attribute node","         * @type Node","         */","        node: {","            setter: Y.one","        },","","        /**","         * True when the element is being Resized.","         *","         * @attribute resizing","         * @default false","         * @type boolean","         */","        resizing: {","            value: false,","            validator: isBoolean","        },","","        /**","         * True to wrap an element with a div if needed (required for textareas","         * and images, defaults to false) in favor of the handles config option.","         * The wrapper element type (default div) could be over-riden passing the","         * <code>wrapper</code> attribute.","         *","         * @attribute wrap","         * @default false","         * @type boolean","         */","        wrap: {","            setter: '_setWrap',","            value: false,","            validator: isBoolean","        },","","        /**","         * Elements that requires a wrapper by default. Normally are elements","         * which cannot have children elements.","         *","         * @attribute wrapTypes","         * @default /canvas|textarea|input|select|button|img/i","         * @readOnly","         * @type Regex","         */","        wrapTypes: {","            readOnly: true,","            value: /^canvas|textarea|input|select|button|img|iframe|table|embed$/i","        },","","        /**","         * Element to wrap the <code>wrapTypes</code>. This element will house","         * the handles elements.","         *","         * @attribute wrapper","         * @default div","         * @type String | Node","         * @writeOnce","         */","        wrapper: {","            readOnly: true,","            valueFn: '_valueWrapper',","            writeOnce: true","        }","    },","","    RULES: {","        b: function(instance, dx, dy) {","            var info = instance.info,","                originalInfo = instance.originalInfo;","","            info.offsetHeight = originalInfo.offsetHeight + dy;","        },","","        l: function(instance, dx) {","            var info = instance.info,","                originalInfo = instance.originalInfo;","","            info.left = originalInfo.left + dx;","            info.offsetWidth = originalInfo.offsetWidth - dx;","        },","","        r: function(instance, dx) {","            var info = instance.info,","                originalInfo = instance.originalInfo;","","            info.offsetWidth = originalInfo.offsetWidth + dx;","        },","","        t: function(instance, dx, dy) {","            var info = instance.info,","                originalInfo = instance.originalInfo;","","            info.top = originalInfo.top + dy;","            info.offsetHeight = originalInfo.offsetHeight - dy;","        },","","        tr: function() {","            this.t.apply(this, arguments);","            this.r.apply(this, arguments);","        },","","        bl: function() {","            this.b.apply(this, arguments);","            this.l.apply(this, arguments);","        },","","        br: function() {","            this.b.apply(this, arguments);","            this.r.apply(this, arguments);","        },","","        tl: function() {","            this.t.apply(this, arguments);","            this.l.apply(this, arguments);","        }","    },","","    capitalize: capitalize","});","","Y.Resize = Y.extend(","    Resize,","    Y.Base,","    {","        /**","         * Array containing all possible resizable handles.","         *","         * @property ALL_HANDLES","         * @type {String}","         */","        ALL_HANDLES: [ T, TR, R, BR, B, BL, L, TL ],","","        /**","         * Regex which matches with the handles that could change the height of","         * the resizable element.","         *","         * @property REGEX_CHANGE_HEIGHT","         * @type {String}","         */","        REGEX_CHANGE_HEIGHT: /^(t|tr|b|bl|br|tl)$/i,","","        /**","         * Regex which matches with the handles that could change the left of","         * the resizable element.","         *","         * @property REGEX_CHANGE_LEFT","         * @type {String}","         */","        REGEX_CHANGE_LEFT: /^(tl|l|bl)$/i,","","        /**","         * Regex which matches with the handles that could change the top of","         * the resizable element.","         *","         * @property REGEX_CHANGE_TOP","         * @type {String}","         */","        REGEX_CHANGE_TOP: /^(tl|t|tr)$/i,","","        /**","         * Regex which matches with the handles that could change the width of","         * the resizable element.","         *","         * @property REGEX_CHANGE_WIDTH","         * @type {String}","         */","        REGEX_CHANGE_WIDTH: /^(bl|br|l|r|tl|tr)$/i,","","        /**","         * Template used to create the resize wrapper for the handles.","         *","         * @property HANDLES_WRAP_TEMPLATE","         * @type {String}","         */","        HANDLES_WRAP_TEMPLATE: '<div class=\"'+CSS_RESIZE_HANDLES_WRAPPER+'\"></div>',","","        /**","         * Template used to create the resize wrapper node when needed.","         *","         * @property WRAP_TEMPLATE","         * @type {String}","         */","        WRAP_TEMPLATE: '<div class=\"'+CSS_RESIZE_WRAPPER+'\"></div>',","","        /**","         * Template used to create each resize handle.","         *","         * @property HANDLE_TEMPLATE","         * @type {String}","         */","        HANDLE_TEMPLATE: '<div class=\"'+concat(CSS_RESIZE_HANDLE, CSS_RESIZE_HANDLE_PLACEHOLDER)+'\">' +","                            '<div class=\"'+concat(CSS_RESIZE_HANDLE_INNER, CSS_RESIZE_HANDLE_INNER_PLACEHOLDER)+'\">&nbsp;</div>' +","                        '</div>',","","","        /**","         * Each box has a content area and optional surrounding padding and","         * border areas. This property stores the sum of all horizontal","         * surrounding * information needed to adjust the node height.","         *","         * @property totalHSurrounding","         * @default 0","         * @type number","         */","        totalHSurrounding: 0,","","        /**","         * Each box has a content area and optional surrounding padding and","         * border areas. This property stores the sum of all vertical","         * surrounding * information needed to adjust the node height.","         *","         * @property totalVSurrounding","         * @default 0","         * @type number","         */","        totalVSurrounding: 0,","","        /**","         * Stores the <a href=\"Resize.html#attr_node\">node</a>","         * surrounding information retrieved from","         * <a href=\"Resize.html#method__getBoxSurroundingInfo\">_getBoxSurroundingInfo</a>.","         *","         * @property nodeSurrounding","         * @type Object","         * @default null","         */","        nodeSurrounding: null,","","        /**","         * Stores the <a href=\"Resize.html#attr_wrapper\">wrapper</a>","         * surrounding information retrieved from","         * <a href=\"Resize.html#method__getBoxSurroundingInfo\">_getBoxSurroundingInfo</a>.","         *","         * @property wrapperSurrounding","         * @type Object","         * @default null","         */","        wrapperSurrounding: null,","","        /**","         * Whether the handle being dragged can change the height.","         *","         * @property changeHeightHandles","         * @default false","         * @type boolean","         */","        changeHeightHandles: false,","","        /**","         * Whether the handle being dragged can change the left.","         *","         * @property changeLeftHandles","         * @default false","         * @type boolean","         */","        changeLeftHandles: false,","","        /**","         * Whether the handle being dragged can change the top.","         *","         * @property changeTopHandles","         * @default false","         * @type boolean","         */","        changeTopHandles: false,","","        /**","         * Whether the handle being dragged can change the width.","         *","         * @property changeWidthHandles","         * @default false","         * @type boolean","         */","        changeWidthHandles: false,","","        /**","         * Store DD.Delegate reference for the respective Resize instance.","         *","         * @property delegate","         * @default null","         * @type Object","         */","        delegate: null,","","        /**","         * Stores the current values for the height, width, top and left. You are","         * able to manipulate these values on resize in order to change the resize","         * behavior.","         *","         * @property info","         * @type Object","         * @protected","         */","        info: null,","","        /**","         * Stores the last values for the height, width, top and left.","         *","         * @property lastInfo","         * @type Object","         * @protected","         */","        lastInfo: null,","","        /**","         * Stores the original values for the height, width, top and left, stored","         * on resize start.","         *","         * @property originalInfo","         * @type Object","         * @protected","         */","        originalInfo: null,","","        /**","         * Construction logic executed during Resize instantiation. Lifecycle.","         *","         * @method initializer","         * @protected","         */","        initializer: function() {","            this._eventHandles = [];","","            this.renderer();","        },","","        /**","         * Create the DOM structure for the Resize. Lifecycle.","         *","         * @method renderUI","         * @protected","         */","        renderUI: function() {","            var instance = this;","","            instance._renderHandles();","        },","","        /**","         * Bind the events on the Resize UI. Lifecycle.","         *","         * @method bindUI","         * @protected","         */","        bindUI: function() {","            var instance = this;","","            instance._createEvents();","            instance._bindDD();","            instance._bindHandle();","        },","","        /**","         * Sync the Resize UI.","         *","         * @method syncUI","         * @protected","         */","        syncUI: function() {","            var instance = this;","","            this.get(NODE).addClass(CSS_RESIZE);","","            // hide handles if AUTO_HIDE is true","            instance._setHideHandlesUI(","                instance.get(AUTO_HIDE)","            );","        },","","        /**","         * Destructor lifecycle implementation for the Resize class.","         * Detaches all previously attached listeners and removes the Resize handles.","         *","         * @method destructor","         * @protected","         */","        destructor: function() {","            var instance = this,","                node = instance.get(NODE),","                wrapper = instance.get(WRAPPER),","                pNode = wrapper.get(PARENT_NODE);","","            Y.each(","                instance._eventHandles,","                function(handle) {","                    handle.detach();","                }","            );","","            instance._eventHandles.length = 0;","","            // destroy handles dd and remove them from the dom","            instance.eachHandle(function(handleEl) {","                instance.delegate.dd.destroy();","","                // remove handle","                handleEl.remove(true);","            });","","            instance.delegate.destroy();","","            // unwrap node","            if (instance.get(WRAP)) {","                instance._copyStyles(wrapper, node);","","                if (pNode) {","                    pNode.insertBefore(node, wrapper);","                }","","                wrapper.remove(true);","            }","","            node.removeClass(CSS_RESIZE);","            node.removeClass(CSS_RESIZE_HIDDEN_HANDLES);","        },","","        /**","         * Creates DOM (or manipulates DOM for progressive enhancement)","         * This method is invoked by initializer(). It's chained automatically for","         * subclasses if required.","         *","         * @method renderer","         * @protected","         */","        renderer: function() {","            this.renderUI();","            this.bindUI();","            this.syncUI();","        },","","        /**","         * <p>Loop through each handle which is being used and executes a callback.</p>","         * <p>Example:</p>","         * <pre><code>instance.eachHandle(","         *      function(handleName, index) { ... }","         *  );</code></pre>","         *","         * @method eachHandle","         * @param {function} fn Callback function to be executed for each handle.","         */","        eachHandle: function(fn) {","            var instance = this;","","            Y.each(","                instance.get(HANDLES),","                function(handle, i) {","                    var handleEl = instance.get(","                        handleAttrName(handle)","                    );","","                    fn.apply(instance, [handleEl, handle, i]);","                }","            );","        },","","        /**","         * Bind the handles DragDrop events to the Resize instance.","         *","         * @method _bindDD","         * @private","         */","        _bindDD: function() {","            var instance = this;","","            instance.delegate = new Y.DD.Delegate(","                {","                    bubbleTargets: instance,","                    container: instance.get(HANDLES_WRAPPER),","                    dragConfig: {","                        clickPixelThresh: 0,","                        clickTimeThresh: 0,","                        useShim: true,","                        move: false","                    },","                    nodes: DOT+CSS_RESIZE_HANDLE,","                    target: false","                }","            );","","            instance._eventHandles.push(","                instance.on('drag:drag', instance._handleResizeEvent),","                instance.on('drag:dropmiss', instance._handleMouseUpEvent),","                instance.on('drag:end', instance._handleResizeEndEvent),","                instance.on('drag:start', instance._handleResizeStartEvent)","            );","        },","","        /**","         * Bind the events related to the handles (_onHandleMouseEnter, _onHandleMouseLeave).","         *","         * @method _bindHandle","         * @private","         */","        _bindHandle: function() {","            var instance = this,","                wrapper = instance.get(WRAPPER);","","            instance._eventHandles.push(","                wrapper.on('mouseenter', Y.bind(instance._onWrapperMouseEnter, instance)),","                wrapper.on('mouseleave', Y.bind(instance._onWrapperMouseLeave, instance)),","                wrapper.delegate('mouseenter', Y.bind(instance._onHandleMouseEnter, instance), DOT+CSS_RESIZE_HANDLE),","                wrapper.delegate('mouseleave', Y.bind(instance._onHandleMouseLeave, instance), DOT+CSS_RESIZE_HANDLE)","            );","        },","","        /**","         * Create the custom events used on the Resize.","         *","         * @method _createEvents","         * @private","         */","        _createEvents: function() {","            var instance = this,","                // create publish function for kweight optimization","                publish = function(name, fn) {","                    instance.publish(name, {","                        defaultFn: fn,","                        queuable: false,","                        emitFacade: true,","                        bubbles: true,","                        prefix: RESIZE","                    });","                };","","            /**","             * Handles the resize start event. Fired when a handle starts to be","             * dragged.","             *","             * @event resize:start","             * @preventable _defResizeStartFn","             * @param {Event.Facade} event The resize start event.","             * @bubbles Resize","             * @type {Event.Custom}","             */","            publish(EV_RESIZE_START, this._defResizeStartFn);","","            /**","             * Handles the resize event. Fired on each pixel when the handle is","             * being dragged.","             *","             * @event resize:resize","             * @preventable _defResizeFn","             * @param {Event.Facade} event The resize event.","             * @bubbles Resize","             * @type {Event.Custom}","             */","            publish(EV_RESIZE, this._defResizeFn);","","            /**","             * Handles the resize align event.","             *","             * @event resize:align","             * @preventable _defResizeAlignFn","             * @param {Event.Facade} event The resize align event.","             * @bubbles Resize","             * @type {Event.Custom}","             */","            publish(EV_RESIZE_ALIGN, this._defResizeAlignFn);","","            /**","             * Handles the resize end event. Fired when a handle stop to be","             * dragged.","             *","             * @event resize:end","             * @preventable _defResizeEndFn","             * @param {Event.Facade} event The resize end event.","             * @bubbles Resize","             * @type {Event.Custom}","             */","            publish(EV_RESIZE_END, this._defResizeEndFn);","","            /**","             * Handles the resize mouseUp event. Fired when a mouseUp event happens on a","             * handle.","             *","             * @event resize:mouseUp","             * @preventable _defMouseUpFn","             * @param {Event.Facade} event The resize mouseUp event.","             * @bubbles Resize","             * @type {Event.Custom}","             */","            publish(EV_MOUSE_UP, this._defMouseUpFn);","        },","","        /**","          * Responsible for loop each handle element and append to the wrapper.","          *","          * @method _renderHandles","          * @protected","          */","        _renderHandles: function() {","            var instance = this,","                wrapper = instance.get(WRAPPER),","                handlesWrapper = instance.get(HANDLES_WRAPPER);","","            instance.eachHandle(function(handleEl) {","                handlesWrapper.append(handleEl);","            });","","            wrapper.append(handlesWrapper);","        },","","        /**","         * Creates the handle element based on the handle name and initialize the","         * DragDrop on it.","         *","         * @method _buildHandle","         * @param {String} handle Handle name ('t', 'tr', 'b', ...).","         * @protected","         */","        _buildHandle: function(handle) {","            var instance = this;","","            return Y.Node.create(","                Y.Lang.sub(instance.HANDLE_TEMPLATE, {","                    handle: handle","                })","            );","        },","","        /**","         * Basic resize calculations.","         *","         * @method _calcResize","         * @protected","         */","        _calcResize: function() {","            var instance = this,","                handle = instance.handle,","                info = instance.info,","                originalInfo = instance.originalInfo,","","                dx = info.actXY[0] - originalInfo.actXY[0],","                dy = info.actXY[1] - originalInfo.actXY[1];","","            if (handle && Y.Resize.RULES[handle]) {","                Y.Resize.RULES[handle](instance, dx, dy);","            }","            else {","            }","        },","","        /**","         * Helper method to update the current size value on","         * <a href=\"Resize.html#property_info\">info</a> to respect the","         * min/max values and fix the top/left calculations.","         *","         * @method _checkSize","         * @param {String} offset 'offsetHeight' or 'offsetWidth'","         * @param {number} size Size to restrict the offset","         * @protected","         */","        _checkSize: function(offset, size) {","            var instance = this,","                info = instance.info,","                originalInfo = instance.originalInfo,","                axis = (offset === OFFSET_HEIGHT) ? TOP : LEFT;","","            // forcing the offsetHeight/offsetWidth to be the passed size","            info[offset] = size;","","            // predicting, based on the original information, the last left valid in case of reach the min/max dimension","            // this calculation avoid browser event leaks when user interact very fast","            if (((axis === LEFT) && instance.changeLeftHandles) ||","                ((axis === TOP) && instance.changeTopHandles)) {","","                info[axis] = originalInfo[axis] + originalInfo[offset] - size;","            }","        },","","        /**","         * Copy relevant styles of the <a href=\"Resize.html#attr_node\">node</a>","         * to the <a href=\"Resize.html#attr_wrapper\">wrapper</a>.","         *","         * @method _copyStyles","         * @param {Node} node Node from.","         * @param {Node} wrapper Node to.","         * @protected","         */","        _copyStyles: function(node, wrapper) {","            var position = node.getStyle(POSITION).toLowerCase(),","                surrounding = this._getBoxSurroundingInfo(node),","                wrapperStyle;","","            // resizable wrapper should be positioned","            if (position === STATIC) {","                position = RELATIVE;","            }","","            wrapperStyle = {","                position: position,","                left: getCompStyle(node, LEFT),","                top: getCompStyle(node, TOP)","            };","","            Y.mix(wrapperStyle, surrounding.margin);","            Y.mix(wrapperStyle, surrounding.border);","","            wrapper.setStyles(wrapperStyle);","","            // remove margin and border from the internal node","            node.setStyles({ border: 0, margin: 0 });","","            wrapper.sizeTo(","                node.get(OFFSET_WIDTH) + surrounding.totalHBorder,","                node.get(OFFSET_HEIGHT) + surrounding.totalVBorder","            );","        },","","        // extract handle name from a string","        // using Y.cached to memoize the function for performance","        _extractHandleName: Y.cached(","            function(node) {","                var className = node.get(CLASS_NAME),","","                    match = className.match(","                        new RegExp(","                            getCN(RESIZE, HANDLE, '(\\\\w{1,2})\\\\b')","                        )","                    );","","                return match ? match[1] : null;","            }","        ),","","        /**","         * <p>Generates metadata to the <a href=\"Resize.html#property_info\">info</a>","         * and <a href=\"Resize.html#property_originalInfo\">originalInfo</a></p>","         * <pre><code>bottom, actXY, left, top, offsetHeight, offsetWidth, right</code></pre>","         *","         * @method _getInfo","         * @param {Node} node","         * @param {EventFacade} event","         * @private","         */","        _getInfo: function(node, event) {","            var actXY = [0,0],","                drag = event.dragEvent.target,","                nodeXY = node.getXY(),","                nodeX = nodeXY[0],","                nodeY = nodeXY[1],","                offsetHeight = node.get(OFFSET_HEIGHT),","                offsetWidth = node.get(OFFSET_WIDTH);","","            if (event) {","                // the xy that the node will be set to. Changing this will alter the position as it's dragged.","                actXY = (drag.actXY.length ? drag.actXY : drag.lastXY);","            }","","            return {","                actXY: actXY,","                bottom: (nodeY + offsetHeight),","                left: nodeX,","                offsetHeight: offsetHeight,","                offsetWidth: offsetWidth,","                right: (nodeX + offsetWidth),","                top: nodeY","            };","        },","","        /**","         * Each box has a content area and optional surrounding margin,","         * padding and * border areas. This method get all this information from","         * the passed node. For more reference see","         * <a href=\"http://www.w3.org/TR/CSS21/box.html#box-dimensions\">","         * http://www.w3.org/TR/CSS21/box.html#box-dimensions</a>.","         *","         * @method _getBoxSurroundingInfo","         * @param {Node} node","         * @private","         * @return {Object}","         */","        _getBoxSurroundingInfo: function(node) {","            var info = {","                padding: {},","                margin: {},","                border: {}","            };","","            if (isNode(node)) {","                Y.each([ TOP, RIGHT, BOTTOM, LEFT ], function(dir) {","                    var paddingProperty = capitalize(PADDING, dir),","                        marginProperty = capitalize(MARGIN, dir),","                        borderWidthProperty = capitalize(BORDER, dir, WIDTH),","                        borderColorProperty = capitalize(BORDER, dir, COLOR),","                        borderStyleProperty = capitalize(BORDER, dir, STYLE);","","                    info.border[borderColorProperty] = getCompStyle(node, borderColorProperty);","                    info.border[borderStyleProperty] = getCompStyle(node, borderStyleProperty);","                    info.border[borderWidthProperty] = getCompStyle(node, borderWidthProperty);","                    info.margin[marginProperty] = getCompStyle(node, marginProperty);","                    info.padding[paddingProperty] = getCompStyle(node, paddingProperty);","                });","            }","","            info.totalHBorder = (toRoundNumber(info.border.borderLeftWidth) + toRoundNumber(info.border.borderRightWidth));","            info.totalHPadding = (toRoundNumber(info.padding.paddingLeft) + toRoundNumber(info.padding.paddingRight));","            info.totalVBorder = (toRoundNumber(info.border.borderBottomWidth) + toRoundNumber(info.border.borderTopWidth));","            info.totalVPadding = (toRoundNumber(info.padding.paddingBottom) + toRoundNumber(info.padding.paddingTop));","","            return info;","        },","","        /**","         * Sync the Resize UI with internal values from","         * <a href=\"Resize.html#property_info\">info</a>.","         *","         * @method _syncUI","         * @protected","         */","        _syncUI: function() {","            var instance = this,","                info = instance.info,","                wrapperSurrounding = instance.wrapperSurrounding,","                wrapper = instance.get(WRAPPER),","                node = instance.get(NODE);","","            wrapper.sizeTo(info.offsetWidth, info.offsetHeight);","","            if (instance.changeLeftHandles || instance.changeTopHandles) {","                wrapper.setXY([info.left, info.top]);","            }","","            // if a wrap node is being used","            if (!wrapper.compareTo(node)) {","                // the original internal node borders were copied to the wrapper on","                // _copyStyles, to compensate that subtract the borders from the internal node","                node.sizeTo(","                    info.offsetWidth - wrapperSurrounding.totalHBorder,","                    info.offsetHeight - wrapperSurrounding.totalVBorder","                );","            }","","            // prevent webkit textarea resize","            if (Y.UA.webkit) {","                node.setStyle(RESIZE, NONE);","            }","        },","","        /**","         * Update <code>instance.changeHeightHandles,","         * instance.changeLeftHandles, instance.changeTopHandles,","         * instance.changeWidthHandles</code> information.","         *","         * @method _updateChangeHandleInfo","         * @private","         */","        _updateChangeHandleInfo: function(handle) {","            var instance = this;","","            instance.changeHeightHandles = instance.REGEX_CHANGE_HEIGHT.test(handle);","            instance.changeLeftHandles = instance.REGEX_CHANGE_LEFT.test(handle);","            instance.changeTopHandles = instance.REGEX_CHANGE_TOP.test(handle);","            instance.changeWidthHandles = instance.REGEX_CHANGE_WIDTH.test(handle);","        },","","        /**","         * Update <a href=\"Resize.html#property_info\">info</a> values (bottom, actXY, left, top, offsetHeight, offsetWidth, right).","         *","         * @method _updateInfo","         * @private","         */","        _updateInfo: function(event) {","            var instance = this;","","            instance.info = instance._getInfo(instance.get(WRAPPER), event);","        },","","        /**","         * Update properties","         * <a href=\"Resize.html#property_nodeSurrounding\">nodeSurrounding</a>,","         * <a href=\"Resize.html#property_nodeSurrounding\">wrapperSurrounding</a>,","         * <a href=\"Resize.html#property_nodeSurrounding\">totalVSurrounding</a>,","         * <a href=\"Resize.html#property_nodeSurrounding\">totalHSurrounding</a>.","         *","         * @method _updateSurroundingInfo","         * @private","         */","        _updateSurroundingInfo: function() {","            var instance = this,","                node = instance.get(NODE),","                wrapper = instance.get(WRAPPER),","                nodeSurrounding = instance._getBoxSurroundingInfo(node),","                wrapperSurrounding = instance._getBoxSurroundingInfo(wrapper);","","            instance.nodeSurrounding = nodeSurrounding;","            instance.wrapperSurrounding = wrapperSurrounding;","","            instance.totalVSurrounding = (nodeSurrounding.totalVPadding + wrapperSurrounding.totalVBorder);","            instance.totalHSurrounding = (nodeSurrounding.totalHPadding + wrapperSurrounding.totalHBorder);","        },","","        /**","         * Set the active state of the handles.","         *","         * @method _setActiveHandlesUI","         * @param {boolean} val True to activate the handles, false to deactivate.","         * @protected","         */","        _setActiveHandlesUI: function(val) {","            var instance = this,","                activeHandleNode = instance.get(ACTIVE_HANDLE_NODE);","","            if (activeHandleNode) {","                if (val) {","                    // remove CSS_RESIZE_HANDLE_ACTIVE from all handles before addClass on the active","                    instance.eachHandle(","                        function(handleEl) {","                            handleEl.removeClass(CSS_RESIZE_HANDLE_ACTIVE);","                        }","                    );","","                    activeHandleNode.addClass(CSS_RESIZE_HANDLE_ACTIVE);","                }","                else {","                    activeHandleNode.removeClass(CSS_RESIZE_HANDLE_ACTIVE);","                }","            }","        },","","        /**","         * Setter for the handles attribute","         *","         * @method _setHandles","         * @protected","         * @param {String} val","         */","        _setHandles: function(val) {","            var instance = this,","                handles = [];","","            // handles attr accepts both array or string","            if (isArray(val)) {","                handles = val;","            }","            else if (isString(val)) {","                // if the handles attr passed in is an ALL string...","                if (val.toLowerCase() === ALL) {","                    handles = instance.ALL_HANDLES;","                }","                // otherwise, split the string to extract the handles","                else {","                    Y.each(","                        val.split(COMMA),","                        function(node) {","                            var handle = trim(node);","","                            // if its a valid handle, add it to the handles output","                            if (indexOf(instance.ALL_HANDLES, handle) > -1) {","                                handles.push(handle);","                            }","                        }","                    );","                }","            }","","            return handles;","        },","","        /**","         * Set the visibility of the handles.","         *","         * @method _setHideHandlesUI","         * @param {boolean} val True to hide the handles, false to show.","         * @protected","         */","        _setHideHandlesUI: function(val) {","            var instance = this,","                wrapper = instance.get(WRAPPER);","","            if (!instance.get(RESIZING)) {","                if (val) {","                    wrapper.addClass(CSS_RESIZE_HIDDEN_HANDLES);","                }","                else {","                    wrapper.removeClass(CSS_RESIZE_HIDDEN_HANDLES);","                }","            }","        },","","        /**","         * Setter for the wrap attribute","         *","         * @method _setWrap","         * @protected","         * @param {boolean} val","         */","        _setWrap: function(val) {","            var instance = this,","                node = instance.get(NODE),","                nodeName = node.get(NODE_NAME),","                typeRegex = instance.get(WRAP_TYPES);","","            // if nodeName is listed on WRAP_TYPES force use the wrapper","            if (typeRegex.test(nodeName)) {","                val = true;","            }","","            return val;","        },","","        /**","         * Default resize:mouseUp handler","         *","         * @method _defMouseUpFn","         * @param {EventFacade} event The Event object","         * @protected","         */","        _defMouseUpFn: function() {","            var instance = this;","","            instance.set(RESIZING, false);","        },","","        /**","         * Default resize:resize handler","         *","         * @method _defResizeFn","         * @param {EventFacade} event The Event object","         * @protected","         */","        _defResizeFn: function(event) {","            var instance = this;","","            instance._resize(event);","        },","","        /**","         * Logic method for _defResizeFn. Allow AOP.","         *","         * @method _resize","         * @param {EventFacade} event The Event object","         * @protected","         */","        _resize: function(event) {","            var instance = this;","","            instance._handleResizeAlignEvent(event.dragEvent);","","            // _syncUI of the wrapper, not using proxy","            instance._syncUI();","        },","","        /**","         * Default resize:align handler","         *","         * @method _defResizeAlignFn","         * @param {EventFacade} event The Event object","         * @protected","         */","        _defResizeAlignFn: function(event) {","            var instance = this;","","            instance._resizeAlign(event);","        },","","        /**","         * Logic method for _defResizeAlignFn. Allow AOP.","         *","         * @method _resizeAlign","         * @param {EventFacade} event The Event object","         * @protected","         */","        _resizeAlign: function(event) {","            var instance = this,","                info,","                defMinHeight,","                defMinWidth;","","            instance.lastInfo = instance.info;","","            // update the instance.info values","            instance._updateInfo(event);","","            info = instance.info;","","            // basic resize calculations","            instance._calcResize();","","            // if Y.Plugin.ResizeConstrained is not plugged, check for min dimension","            if (!instance.con) {","                defMinHeight = (instance.get(DEF_MIN_HEIGHT) + instance.totalVSurrounding);","                defMinWidth = (instance.get(DEF_MIN_WIDTH) + instance.totalHSurrounding);","","                if (info.offsetHeight <= defMinHeight) {","                    instance._checkSize(OFFSET_HEIGHT, defMinHeight);","                }","","                if (info.offsetWidth <= defMinWidth) {","                    instance._checkSize(OFFSET_WIDTH, defMinWidth);","                }","            }","        },","","        /**","         * Default resize:end handler","         *","         * @method _defResizeEndFn","         * @param {EventFacade} event The Event object","         * @protected","         */","        _defResizeEndFn: function(event) {","            var instance = this;","","            instance._resizeEnd(event);","        },","","        /**","         * Logic method for _defResizeEndFn. Allow AOP.","         *","         * @method _resizeEnd","         * @param {EventFacade} event The Event object","         * @protected","         */","        _resizeEnd: function(event) {","            var instance = this,","                drag = event.dragEvent.target;","","            // reseting actXY from drag when drag end","            drag.actXY = [];","","            // syncUI when resize end","            instance._syncUI();","","            instance._setActiveHandlesUI(false);","","            instance.set(ACTIVE_HANDLE, null);","            instance.set(ACTIVE_HANDLE_NODE, null);","","            instance.handle = null;","        },","","        /**","         * Default resize:start handler","         *","         * @method _defResizeStartFn","         * @param {EventFacade} event The Event object","         * @protected","         */","        _defResizeStartFn: function(event) {","            var instance = this;","","            instance._resizeStart(event);","        },","","        /**","         * Logic method for _defResizeStartFn. Allow AOP.","         *","         * @method _resizeStart","         * @param {EventFacade} event The Event object","         * @protected","         */","        _resizeStart: function(event) {","            var instance = this,","                wrapper = instance.get(WRAPPER);","","            instance.handle = instance.get(ACTIVE_HANDLE);","","            instance.set(RESIZING, true);","","            instance._updateSurroundingInfo();","","            // create an originalInfo information for reference","            instance.originalInfo = instance._getInfo(wrapper, event);","","            instance._updateInfo(event);","        },","","        /**","         * Fires the resize:mouseUp event.","         *","         * @method _handleMouseUpEvent","         * @param {EventFacade} event resize:mouseUp event facade","         * @protected","         */","        _handleMouseUpEvent: function(event) {","            this.fire(EV_MOUSE_UP, { dragEvent: event, info: this.info });","        },","","        /**","         * Fires the resize:resize event.","         *","         * @method _handleResizeEvent","         * @param {EventFacade} event resize:resize event facade","         * @protected","         */","        _handleResizeEvent: function(event) {","            this.fire(EV_RESIZE, { dragEvent: event, info: this.info });","        },","","        /**","         * Fires the resize:align event.","         *","         * @method _handleResizeAlignEvent","         * @param {EventFacade} event resize:resize event facade","         * @protected","         */","        _handleResizeAlignEvent: function(event) {","            this.fire(EV_RESIZE_ALIGN, { dragEvent: event, info: this.info });","        },","","        /**","         * Fires the resize:end event.","         *","         * @method _handleResizeEndEvent","         * @param {EventFacade} event resize:end event facade","         * @protected","         */","        _handleResizeEndEvent: function(event) {","            this.fire(EV_RESIZE_END, { dragEvent: event, info: this.info });","        },","","        /**","         * Fires the resize:start event.","         *","         * @method _handleResizeStartEvent","         * @param {EventFacade} event resize:start event facade","         * @protected","         */","        _handleResizeStartEvent: function(event) {","            if (!this.get(ACTIVE_HANDLE)) {","                //This handles the \"touch\" case","                this._setHandleFromNode(event.target.get('node'));","            }","            this.fire(EV_RESIZE_START, { dragEvent: event, info: this.info });","        },","","        /**","         * Mouseenter event handler for the <a href=\"Resize.html#attr_wrapper\">wrapper</a>.","         *","         * @method _onWrapperMouseEnter","         * @param {EventFacade} event","         * @protected","         */","        _onWrapperMouseEnter: function() {","            var instance = this;","","            if (instance.get(AUTO_HIDE)) {","                instance._setHideHandlesUI(false);","            }","        },","","        /**","         * Mouseleave event handler for the <a href=\"Resize.html#attr_wrapper\">wrapper</a>.","         *","         * @method _onWrapperMouseLeave","         * @param {EventFacade} event","         * @protected","         */","        _onWrapperMouseLeave: function() {","            var instance = this;","","            if (instance.get(AUTO_HIDE)) {","                instance._setHideHandlesUI(true);","            }","        },","","        /**","         * Handles setting the activeHandle from a node, used from startDrag (for touch) and mouseenter (for mouse).","         *","         * @method _setHandleFromNode","         * @param {Node} node","         * @protected","         */","        _setHandleFromNode: function(node) {","            var instance = this,","                handle = instance._extractHandleName(node);","","            if (!instance.get(RESIZING)) {","                instance.set(ACTIVE_HANDLE, handle);","                instance.set(ACTIVE_HANDLE_NODE, node);","","                instance._setActiveHandlesUI(true);","                instance._updateChangeHandleInfo(handle);","            }","        },","","        /**","         * Mouseenter event handler for the handles.","         *","         * @method _onHandleMouseEnter","         * @param {EventFacade} event","         * @protected","         */","        _onHandleMouseEnter: function(event) {","            this._setHandleFromNode(event.currentTarget);","        },","","        /**","         * Mouseout event handler for the handles.","         *","         * @method _onHandleMouseLeave","         * @param {EventFacade} event","         * @protected","         */","        _onHandleMouseLeave: function() {","            var instance = this;","","            if (!instance.get(RESIZING)) {","                instance._setActiveHandlesUI(false);","            }","        },","","        /**","         * Default value for the wrapper handles node attribute","         *","         * @method _valueHandlesWrapper","         * @protected","         * @readOnly","         */","        _valueHandlesWrapper: function() {","            return Y.Node.create(this.HANDLES_WRAP_TEMPLATE);","        },","","        /**","         * Default value for the wrapper attribute","         *","         * @method _valueWrapper","         * @protected","         * @readOnly","         */","        _valueWrapper: function() {","            var instance = this,","                node = instance.get(NODE),","                pNode = node.get(PARENT_NODE),","                // by deafult the wrapper is always the node","                wrapper = node;","","            // if the node is listed on the wrapTypes or wrap is set to true, create another wrapper","            if (instance.get(WRAP)) {","                wrapper = Y.Node.create(instance.WRAP_TEMPLATE);","","                if (pNode) {","                    pNode.insertBefore(wrapper, node);","                }","","                wrapper.append(node);","","                instance._copyStyles(node, wrapper);","","                // remove positioning of wrapped node, the WRAPPER take care about positioning","                node.setStyles({","                    position: STATIC,","                    left: 0,","                    top: 0","                });","            }","","            return wrapper;","        }","    }",");","","Y.each(Y.Resize.prototype.ALL_HANDLES, function(handle) {","    // creating ATTRS with the handles elements","    Y.Resize.ATTRS[handleAttrName(handle)] = {","        setter: function() {","            return this._buildHandle(handle);","        },","        value: null,","        writeOnce: true","    };","});","","","}, '3.7.3', {\"requires\": [\"base\", \"widget\", \"event\", \"oop\", \"dd-drag\", \"dd-delegate\", \"dd-drop\"], \"skinnable\": true});"];
_yuitest_coverage["build/resize-base/resize-base.js"].lines = {"1":0,"9":0,"79":0,"84":0,"88":0,"92":0,"96":0,"101":0,"106":0,"109":0,"110":0,"111":0,"113":0,"116":0,"165":0,"166":0,"169":0,"199":0,"350":0,"353":0,"357":0,"360":0,"361":0,"365":0,"368":0,"372":0,"375":0,"376":0,"380":0,"381":0,"385":0,"386":0,"390":0,"391":0,"395":0,"396":0,"403":0,"604":0,"606":0,"616":0,"618":0,"628":0,"630":0,"631":0,"632":0,"642":0,"644":0,"647":0,"660":0,"665":0,"668":0,"672":0,"675":0,"676":0,"679":0,"682":0,"685":0,"686":0,"688":0,"689":0,"692":0,"695":0,"696":0,"708":0,"709":0,"710":0,"724":0,"726":0,"729":0,"733":0,"745":0,"747":0,"762":0,"777":0,"780":0,"795":0,"798":0,"817":0,"829":0,"840":0,"852":0,"864":0,"874":0,"878":0,"879":0,"882":0,"894":0,"896":0,"910":0,"918":0,"919":0,"936":0,"942":0,"946":0,"949":0,"963":0,"968":0,"969":0,"972":0,"978":0,"979":0,"981":0,"984":0,"986":0,"996":0,"1004":0,"1019":0,"1027":0,"1029":0,"1032":0,"1056":0,"1062":0,"1063":0,"1064":0,"1070":0,"1071":0,"1072":0,"1073":0,"1074":0,"1078":0,"1079":0,"1080":0,"1081":0,"1083":0,"1094":0,"1100":0,"1102":0,"1103":0,"1107":0,"1110":0,"1117":0,"1118":0,"1131":0,"1133":0,"1134":0,"1135":0,"1136":0,"1146":0,"1148":0,"1162":0,"1168":0,"1169":0,"1171":0,"1172":0,"1183":0,"1186":0,"1187":0,"1189":0,"1191":0,"1195":0,"1198":0,"1211":0,"1215":0,"1216":0,"1218":0,"1220":0,"1221":0,"1225":0,"1228":0,"1231":0,"1232":0,"1239":0,"1250":0,"1253":0,"1254":0,"1255":0,"1258":0,"1271":0,"1277":0,"1278":0,"1281":0,"1292":0,"1294":0,"1305":0,"1307":0,"1318":0,"1320":0,"1323":0,"1334":0,"1336":0,"1347":0,"1352":0,"1355":0,"1357":0,"1360":0,"1363":0,"1364":0,"1365":0,"1367":0,"1368":0,"1371":0,"1372":0,"1385":0,"1387":0,"1398":0,"1402":0,"1405":0,"1407":0,"1409":0,"1410":0,"1412":0,"1423":0,"1425":0,"1436":0,"1439":0,"1441":0,"1443":0,"1446":0,"1448":0,"1459":0,"1470":0,"1481":0,"1492":0,"1503":0,"1505":0,"1507":0,"1518":0,"1520":0,"1521":0,"1533":0,"1535":0,"1536":0,"1548":0,"1551":0,"1552":0,"1553":0,"1555":0,"1556":0,"1568":0,"1579":0,"1581":0,"1582":0,"1594":0,"1605":0,"1612":0,"1613":0,"1615":0,"1616":0,"1619":0,"1621":0,"1624":0,"1631":0,"1636":0,"1638":0,"1640":0};
_yuitest_coverage["build/resize-base/resize-base.js"].functions = {"concat:78":0,"toRoundNumber:83":0,"getCompStyle:87":0,"handleAttrName:91":0,"isNode:95":0,"(anonymous 2):100":0,"(anonymous 4):109":0,"(anonymous 3):105":0,"Resize:165":0,"validator:198":0,"b:349":0,"l:356":0,"r:364":0,"t:371":0,"tr:379":0,"bl:384":0,"br:389":0,"tl:394":0,"initializer:603":0,"renderUI:615":0,"bindUI:627":0,"syncUI:641":0,"(anonymous 5):667":0,"(anonymous 6):675":0,"destructor:659":0,"renderer:707":0,"(anonymous 7):728":0,"eachHandle:723":0,"_bindDD:744":0,"_bindHandle:776":0,"publish:797":0,"_createEvents:794":0,"(anonymous 8):878":0,"_renderHandles:873":0,"_buildHandle:893":0,"_calcResize:909":0,"_checkSize:935":0,"_copyStyles:962":0,"(anonymous 9):995":0,"_getInfo:1018":0,"(anonymous 10):1063":0,"_getBoxSurroundingInfo:1055":0,"_syncUI:1093":0,"_updateChangeHandleInfo:1130":0,"_updateInfo:1145":0,"_updateSurroundingInfo:1161":0,"(anonymous 11):1190":0,"_setActiveHandlesUI:1182":0,"(anonymous 12):1227":0,"_setHandles:1210":0,"_setHideHandlesUI:1249":0,"_setWrap:1270":0,"_defMouseUpFn:1291":0,"_defResizeFn:1304":0,"_resize:1317":0,"_defResizeAlignFn:1333":0,"_resizeAlign:1346":0,"_defResizeEndFn:1384":0,"_resizeEnd:1397":0,"_defResizeStartFn:1422":0,"_resizeStart:1435":0,"_handleMouseUpEvent:1458":0,"_handleResizeEvent:1469":0,"_handleResizeAlignEvent:1480":0,"_handleResizeEndEvent:1491":0,"_handleResizeStartEvent:1502":0,"_onWrapperMouseEnter:1517":0,"_onWrapperMouseLeave:1532":0,"_setHandleFromNode:1547":0,"_onHandleMouseEnter:1567":0,"_onHandleMouseLeave:1578":0,"_valueHandlesWrapper:1593":0,"_valueWrapper:1604":0,"setter:1639":0,"(anonymous 13):1636":0,"(anonymous 1):1":0};
_yuitest_coverage["build/resize-base/resize-base.js"].coveredLines = 245;
_yuitest_coverage["build/resize-base/resize-base.js"].coveredFunctions = 76;
_yuitest_coverline("build/resize-base/resize-base.js", 1);
YUI.add('resize-base', function (Y, NAME) {

/**
 * The Resize Utility allows you to make an HTML element resizable.
 * @module resize
 * @main resize
 */

_yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/resize-base/resize-base.js", 9);
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
        _yuitest_coverfunc("build/resize-base/resize-base.js", "concat", 78);
_yuitest_coverline("build/resize-base/resize-base.js", 79);
return Array.prototype.slice.call(arguments).join(SPACE);
    },

    // round the passed number to get rid of pixel-flickering
    toRoundNumber = function(num) {
        _yuitest_coverfunc("build/resize-base/resize-base.js", "toRoundNumber", 83);
_yuitest_coverline("build/resize-base/resize-base.js", 84);
return Math.round(parseFloat(num)) || 0;
    },

    getCompStyle = function(node, val) {
        _yuitest_coverfunc("build/resize-base/resize-base.js", "getCompStyle", 87);
_yuitest_coverline("build/resize-base/resize-base.js", 88);
return node.getComputedStyle(val);
    },

    handleAttrName = function(handle) {
        _yuitest_coverfunc("build/resize-base/resize-base.js", "handleAttrName", 91);
_yuitest_coverline("build/resize-base/resize-base.js", 92);
return HANDLE + handle.toUpperCase();
    },

    isNode = function(v) {
        _yuitest_coverfunc("build/resize-base/resize-base.js", "isNode", 95);
_yuitest_coverline("build/resize-base/resize-base.js", 96);
return (v instanceof Y.Node);
    },

    toInitialCap = Y.cached(
        function(str) {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 2)", 100);
_yuitest_coverline("build/resize-base/resize-base.js", 101);
return str.substring(0, 1).toUpperCase() + str.substring(1);
        }
    ),

    capitalize = Y.cached(function() {
        _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 3)", 105);
_yuitest_coverline("build/resize-base/resize-base.js", 106);
var out = [],
            args = yArray(arguments, 0, true);

        _yuitest_coverline("build/resize-base/resize-base.js", 109);
yArray.each(args, function(part, i) {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 4)", 109);
_yuitest_coverline("build/resize-base/resize-base.js", 110);
if (i > 0) {
                _yuitest_coverline("build/resize-base/resize-base.js", 111);
part = toInitialCap(part);
            }
            _yuitest_coverline("build/resize-base/resize-base.js", 113);
out.push(part);
        });

        _yuitest_coverline("build/resize-base/resize-base.js", 116);
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

_yuitest_coverline("build/resize-base/resize-base.js", 165);
function Resize() {
    _yuitest_coverfunc("build/resize-base/resize-base.js", "Resize", 165);
_yuitest_coverline("build/resize-base/resize-base.js", 166);
Resize.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/resize-base/resize-base.js", 169);
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
                _yuitest_coverfunc("build/resize-base/resize-base.js", "validator", 198);
_yuitest_coverline("build/resize-base/resize-base.js", 199);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "b", 349);
_yuitest_coverline("build/resize-base/resize-base.js", 350);
var info = instance.info,
                originalInfo = instance.originalInfo;

            _yuitest_coverline("build/resize-base/resize-base.js", 353);
info.offsetHeight = originalInfo.offsetHeight + dy;
        },

        l: function(instance, dx) {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "l", 356);
_yuitest_coverline("build/resize-base/resize-base.js", 357);
var info = instance.info,
                originalInfo = instance.originalInfo;

            _yuitest_coverline("build/resize-base/resize-base.js", 360);
info.left = originalInfo.left + dx;
            _yuitest_coverline("build/resize-base/resize-base.js", 361);
info.offsetWidth = originalInfo.offsetWidth - dx;
        },

        r: function(instance, dx) {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "r", 364);
_yuitest_coverline("build/resize-base/resize-base.js", 365);
var info = instance.info,
                originalInfo = instance.originalInfo;

            _yuitest_coverline("build/resize-base/resize-base.js", 368);
info.offsetWidth = originalInfo.offsetWidth + dx;
        },

        t: function(instance, dx, dy) {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "t", 371);
_yuitest_coverline("build/resize-base/resize-base.js", 372);
var info = instance.info,
                originalInfo = instance.originalInfo;

            _yuitest_coverline("build/resize-base/resize-base.js", 375);
info.top = originalInfo.top + dy;
            _yuitest_coverline("build/resize-base/resize-base.js", 376);
info.offsetHeight = originalInfo.offsetHeight - dy;
        },

        tr: function() {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "tr", 379);
_yuitest_coverline("build/resize-base/resize-base.js", 380);
this.t.apply(this, arguments);
            _yuitest_coverline("build/resize-base/resize-base.js", 381);
this.r.apply(this, arguments);
        },

        bl: function() {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "bl", 384);
_yuitest_coverline("build/resize-base/resize-base.js", 385);
this.b.apply(this, arguments);
            _yuitest_coverline("build/resize-base/resize-base.js", 386);
this.l.apply(this, arguments);
        },

        br: function() {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "br", 389);
_yuitest_coverline("build/resize-base/resize-base.js", 390);
this.b.apply(this, arguments);
            _yuitest_coverline("build/resize-base/resize-base.js", 391);
this.r.apply(this, arguments);
        },

        tl: function() {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "tl", 394);
_yuitest_coverline("build/resize-base/resize-base.js", 395);
this.t.apply(this, arguments);
            _yuitest_coverline("build/resize-base/resize-base.js", 396);
this.l.apply(this, arguments);
        }
    },

    capitalize: capitalize
});

_yuitest_coverline("build/resize-base/resize-base.js", 403);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "initializer", 603);
_yuitest_coverline("build/resize-base/resize-base.js", 604);
this._eventHandles = [];

            _yuitest_coverline("build/resize-base/resize-base.js", 606);
this.renderer();
        },

        /**
         * Create the DOM structure for the Resize. Lifecycle.
         *
         * @method renderUI
         * @protected
         */
        renderUI: function() {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "renderUI", 615);
_yuitest_coverline("build/resize-base/resize-base.js", 616);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 618);
instance._renderHandles();
        },

        /**
         * Bind the events on the Resize UI. Lifecycle.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "bindUI", 627);
_yuitest_coverline("build/resize-base/resize-base.js", 628);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 630);
instance._createEvents();
            _yuitest_coverline("build/resize-base/resize-base.js", 631);
instance._bindDD();
            _yuitest_coverline("build/resize-base/resize-base.js", 632);
instance._bindHandle();
        },

        /**
         * Sync the Resize UI.
         *
         * @method syncUI
         * @protected
         */
        syncUI: function() {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "syncUI", 641);
_yuitest_coverline("build/resize-base/resize-base.js", 642);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 644);
this.get(NODE).addClass(CSS_RESIZE);

            // hide handles if AUTO_HIDE is true
            _yuitest_coverline("build/resize-base/resize-base.js", 647);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "destructor", 659);
_yuitest_coverline("build/resize-base/resize-base.js", 660);
var instance = this,
                node = instance.get(NODE),
                wrapper = instance.get(WRAPPER),
                pNode = wrapper.get(PARENT_NODE);

            _yuitest_coverline("build/resize-base/resize-base.js", 665);
Y.each(
                instance._eventHandles,
                function(handle) {
                    _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 5)", 667);
_yuitest_coverline("build/resize-base/resize-base.js", 668);
handle.detach();
                }
            );

            _yuitest_coverline("build/resize-base/resize-base.js", 672);
instance._eventHandles.length = 0;

            // destroy handles dd and remove them from the dom
            _yuitest_coverline("build/resize-base/resize-base.js", 675);
instance.eachHandle(function(handleEl) {
                _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 6)", 675);
_yuitest_coverline("build/resize-base/resize-base.js", 676);
instance.delegate.dd.destroy();

                // remove handle
                _yuitest_coverline("build/resize-base/resize-base.js", 679);
handleEl.remove(true);
            });

            _yuitest_coverline("build/resize-base/resize-base.js", 682);
instance.delegate.destroy();

            // unwrap node
            _yuitest_coverline("build/resize-base/resize-base.js", 685);
if (instance.get(WRAP)) {
                _yuitest_coverline("build/resize-base/resize-base.js", 686);
instance._copyStyles(wrapper, node);

                _yuitest_coverline("build/resize-base/resize-base.js", 688);
if (pNode) {
                    _yuitest_coverline("build/resize-base/resize-base.js", 689);
pNode.insertBefore(node, wrapper);
                }

                _yuitest_coverline("build/resize-base/resize-base.js", 692);
wrapper.remove(true);
            }

            _yuitest_coverline("build/resize-base/resize-base.js", 695);
node.removeClass(CSS_RESIZE);
            _yuitest_coverline("build/resize-base/resize-base.js", 696);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "renderer", 707);
_yuitest_coverline("build/resize-base/resize-base.js", 708);
this.renderUI();
            _yuitest_coverline("build/resize-base/resize-base.js", 709);
this.bindUI();
            _yuitest_coverline("build/resize-base/resize-base.js", 710);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "eachHandle", 723);
_yuitest_coverline("build/resize-base/resize-base.js", 724);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 726);
Y.each(
                instance.get(HANDLES),
                function(handle, i) {
                    _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 7)", 728);
_yuitest_coverline("build/resize-base/resize-base.js", 729);
var handleEl = instance.get(
                        handleAttrName(handle)
                    );

                    _yuitest_coverline("build/resize-base/resize-base.js", 733);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_bindDD", 744);
_yuitest_coverline("build/resize-base/resize-base.js", 745);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 747);
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

            _yuitest_coverline("build/resize-base/resize-base.js", 762);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_bindHandle", 776);
_yuitest_coverline("build/resize-base/resize-base.js", 777);
var instance = this,
                wrapper = instance.get(WRAPPER);

            _yuitest_coverline("build/resize-base/resize-base.js", 780);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_createEvents", 794);
_yuitest_coverline("build/resize-base/resize-base.js", 795);
var instance = this,
                // create publish function for kweight optimization
                publish = function(name, fn) {
                    _yuitest_coverfunc("build/resize-base/resize-base.js", "publish", 797);
_yuitest_coverline("build/resize-base/resize-base.js", 798);
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
            _yuitest_coverline("build/resize-base/resize-base.js", 817);
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
            _yuitest_coverline("build/resize-base/resize-base.js", 829);
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
            _yuitest_coverline("build/resize-base/resize-base.js", 840);
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
            _yuitest_coverline("build/resize-base/resize-base.js", 852);
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
            _yuitest_coverline("build/resize-base/resize-base.js", 864);
publish(EV_MOUSE_UP, this._defMouseUpFn);
        },

        /**
          * Responsible for loop each handle element and append to the wrapper.
          *
          * @method _renderHandles
          * @protected
          */
        _renderHandles: function() {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_renderHandles", 873);
_yuitest_coverline("build/resize-base/resize-base.js", 874);
var instance = this,
                wrapper = instance.get(WRAPPER),
                handlesWrapper = instance.get(HANDLES_WRAPPER);

            _yuitest_coverline("build/resize-base/resize-base.js", 878);
instance.eachHandle(function(handleEl) {
                _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 8)", 878);
_yuitest_coverline("build/resize-base/resize-base.js", 879);
handlesWrapper.append(handleEl);
            });

            _yuitest_coverline("build/resize-base/resize-base.js", 882);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_buildHandle", 893);
_yuitest_coverline("build/resize-base/resize-base.js", 894);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 896);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_calcResize", 909);
_yuitest_coverline("build/resize-base/resize-base.js", 910);
var instance = this,
                handle = instance.handle,
                info = instance.info,
                originalInfo = instance.originalInfo,

                dx = info.actXY[0] - originalInfo.actXY[0],
                dy = info.actXY[1] - originalInfo.actXY[1];

            _yuitest_coverline("build/resize-base/resize-base.js", 918);
if (handle && Y.Resize.RULES[handle]) {
                _yuitest_coverline("build/resize-base/resize-base.js", 919);
Y.Resize.RULES[handle](instance, dx, dy);
            }
            else {
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_checkSize", 935);
_yuitest_coverline("build/resize-base/resize-base.js", 936);
var instance = this,
                info = instance.info,
                originalInfo = instance.originalInfo,
                axis = (offset === OFFSET_HEIGHT) ? TOP : LEFT;

            // forcing the offsetHeight/offsetWidth to be the passed size
            _yuitest_coverline("build/resize-base/resize-base.js", 942);
info[offset] = size;

            // predicting, based on the original information, the last left valid in case of reach the min/max dimension
            // this calculation avoid browser event leaks when user interact very fast
            _yuitest_coverline("build/resize-base/resize-base.js", 946);
if (((axis === LEFT) && instance.changeLeftHandles) ||
                ((axis === TOP) && instance.changeTopHandles)) {

                _yuitest_coverline("build/resize-base/resize-base.js", 949);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_copyStyles", 962);
_yuitest_coverline("build/resize-base/resize-base.js", 963);
var position = node.getStyle(POSITION).toLowerCase(),
                surrounding = this._getBoxSurroundingInfo(node),
                wrapperStyle;

            // resizable wrapper should be positioned
            _yuitest_coverline("build/resize-base/resize-base.js", 968);
if (position === STATIC) {
                _yuitest_coverline("build/resize-base/resize-base.js", 969);
position = RELATIVE;
            }

            _yuitest_coverline("build/resize-base/resize-base.js", 972);
wrapperStyle = {
                position: position,
                left: getCompStyle(node, LEFT),
                top: getCompStyle(node, TOP)
            };

            _yuitest_coverline("build/resize-base/resize-base.js", 978);
Y.mix(wrapperStyle, surrounding.margin);
            _yuitest_coverline("build/resize-base/resize-base.js", 979);
Y.mix(wrapperStyle, surrounding.border);

            _yuitest_coverline("build/resize-base/resize-base.js", 981);
wrapper.setStyles(wrapperStyle);

            // remove margin and border from the internal node
            _yuitest_coverline("build/resize-base/resize-base.js", 984);
node.setStyles({ border: 0, margin: 0 });

            _yuitest_coverline("build/resize-base/resize-base.js", 986);
wrapper.sizeTo(
                node.get(OFFSET_WIDTH) + surrounding.totalHBorder,
                node.get(OFFSET_HEIGHT) + surrounding.totalVBorder
            );
        },

        // extract handle name from a string
        // using Y.cached to memoize the function for performance
        _extractHandleName: Y.cached(
            function(node) {
                _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 9)", 995);
_yuitest_coverline("build/resize-base/resize-base.js", 996);
var className = node.get(CLASS_NAME),

                    match = className.match(
                        new RegExp(
                            getCN(RESIZE, HANDLE, '(\\w{1,2})\\b')
                        )
                    );

                _yuitest_coverline("build/resize-base/resize-base.js", 1004);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_getInfo", 1018);
_yuitest_coverline("build/resize-base/resize-base.js", 1019);
var actXY = [0,0],
                drag = event.dragEvent.target,
                nodeXY = node.getXY(),
                nodeX = nodeXY[0],
                nodeY = nodeXY[1],
                offsetHeight = node.get(OFFSET_HEIGHT),
                offsetWidth = node.get(OFFSET_WIDTH);

            _yuitest_coverline("build/resize-base/resize-base.js", 1027);
if (event) {
                // the xy that the node will be set to. Changing this will alter the position as it's dragged.
                _yuitest_coverline("build/resize-base/resize-base.js", 1029);
actXY = (drag.actXY.length ? drag.actXY : drag.lastXY);
            }

            _yuitest_coverline("build/resize-base/resize-base.js", 1032);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_getBoxSurroundingInfo", 1055);
_yuitest_coverline("build/resize-base/resize-base.js", 1056);
var info = {
                padding: {},
                margin: {},
                border: {}
            };

            _yuitest_coverline("build/resize-base/resize-base.js", 1062);
if (isNode(node)) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1063);
Y.each([ TOP, RIGHT, BOTTOM, LEFT ], function(dir) {
                    _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 10)", 1063);
_yuitest_coverline("build/resize-base/resize-base.js", 1064);
var paddingProperty = capitalize(PADDING, dir),
                        marginProperty = capitalize(MARGIN, dir),
                        borderWidthProperty = capitalize(BORDER, dir, WIDTH),
                        borderColorProperty = capitalize(BORDER, dir, COLOR),
                        borderStyleProperty = capitalize(BORDER, dir, STYLE);

                    _yuitest_coverline("build/resize-base/resize-base.js", 1070);
info.border[borderColorProperty] = getCompStyle(node, borderColorProperty);
                    _yuitest_coverline("build/resize-base/resize-base.js", 1071);
info.border[borderStyleProperty] = getCompStyle(node, borderStyleProperty);
                    _yuitest_coverline("build/resize-base/resize-base.js", 1072);
info.border[borderWidthProperty] = getCompStyle(node, borderWidthProperty);
                    _yuitest_coverline("build/resize-base/resize-base.js", 1073);
info.margin[marginProperty] = getCompStyle(node, marginProperty);
                    _yuitest_coverline("build/resize-base/resize-base.js", 1074);
info.padding[paddingProperty] = getCompStyle(node, paddingProperty);
                });
            }

            _yuitest_coverline("build/resize-base/resize-base.js", 1078);
info.totalHBorder = (toRoundNumber(info.border.borderLeftWidth) + toRoundNumber(info.border.borderRightWidth));
            _yuitest_coverline("build/resize-base/resize-base.js", 1079);
info.totalHPadding = (toRoundNumber(info.padding.paddingLeft) + toRoundNumber(info.padding.paddingRight));
            _yuitest_coverline("build/resize-base/resize-base.js", 1080);
info.totalVBorder = (toRoundNumber(info.border.borderBottomWidth) + toRoundNumber(info.border.borderTopWidth));
            _yuitest_coverline("build/resize-base/resize-base.js", 1081);
info.totalVPadding = (toRoundNumber(info.padding.paddingBottom) + toRoundNumber(info.padding.paddingTop));

            _yuitest_coverline("build/resize-base/resize-base.js", 1083);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_syncUI", 1093);
_yuitest_coverline("build/resize-base/resize-base.js", 1094);
var instance = this,
                info = instance.info,
                wrapperSurrounding = instance.wrapperSurrounding,
                wrapper = instance.get(WRAPPER),
                node = instance.get(NODE);

            _yuitest_coverline("build/resize-base/resize-base.js", 1100);
wrapper.sizeTo(info.offsetWidth, info.offsetHeight);

            _yuitest_coverline("build/resize-base/resize-base.js", 1102);
if (instance.changeLeftHandles || instance.changeTopHandles) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1103);
wrapper.setXY([info.left, info.top]);
            }

            // if a wrap node is being used
            _yuitest_coverline("build/resize-base/resize-base.js", 1107);
if (!wrapper.compareTo(node)) {
                // the original internal node borders were copied to the wrapper on
                // _copyStyles, to compensate that subtract the borders from the internal node
                _yuitest_coverline("build/resize-base/resize-base.js", 1110);
node.sizeTo(
                    info.offsetWidth - wrapperSurrounding.totalHBorder,
                    info.offsetHeight - wrapperSurrounding.totalVBorder
                );
            }

            // prevent webkit textarea resize
            _yuitest_coverline("build/resize-base/resize-base.js", 1117);
if (Y.UA.webkit) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1118);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_updateChangeHandleInfo", 1130);
_yuitest_coverline("build/resize-base/resize-base.js", 1131);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 1133);
instance.changeHeightHandles = instance.REGEX_CHANGE_HEIGHT.test(handle);
            _yuitest_coverline("build/resize-base/resize-base.js", 1134);
instance.changeLeftHandles = instance.REGEX_CHANGE_LEFT.test(handle);
            _yuitest_coverline("build/resize-base/resize-base.js", 1135);
instance.changeTopHandles = instance.REGEX_CHANGE_TOP.test(handle);
            _yuitest_coverline("build/resize-base/resize-base.js", 1136);
instance.changeWidthHandles = instance.REGEX_CHANGE_WIDTH.test(handle);
        },

        /**
         * Update <a href="Resize.html#property_info">info</a> values (bottom, actXY, left, top, offsetHeight, offsetWidth, right).
         *
         * @method _updateInfo
         * @private
         */
        _updateInfo: function(event) {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_updateInfo", 1145);
_yuitest_coverline("build/resize-base/resize-base.js", 1146);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 1148);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_updateSurroundingInfo", 1161);
_yuitest_coverline("build/resize-base/resize-base.js", 1162);
var instance = this,
                node = instance.get(NODE),
                wrapper = instance.get(WRAPPER),
                nodeSurrounding = instance._getBoxSurroundingInfo(node),
                wrapperSurrounding = instance._getBoxSurroundingInfo(wrapper);

            _yuitest_coverline("build/resize-base/resize-base.js", 1168);
instance.nodeSurrounding = nodeSurrounding;
            _yuitest_coverline("build/resize-base/resize-base.js", 1169);
instance.wrapperSurrounding = wrapperSurrounding;

            _yuitest_coverline("build/resize-base/resize-base.js", 1171);
instance.totalVSurrounding = (nodeSurrounding.totalVPadding + wrapperSurrounding.totalVBorder);
            _yuitest_coverline("build/resize-base/resize-base.js", 1172);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_setActiveHandlesUI", 1182);
_yuitest_coverline("build/resize-base/resize-base.js", 1183);
var instance = this,
                activeHandleNode = instance.get(ACTIVE_HANDLE_NODE);

            _yuitest_coverline("build/resize-base/resize-base.js", 1186);
if (activeHandleNode) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1187);
if (val) {
                    // remove CSS_RESIZE_HANDLE_ACTIVE from all handles before addClass on the active
                    _yuitest_coverline("build/resize-base/resize-base.js", 1189);
instance.eachHandle(
                        function(handleEl) {
                            _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 11)", 1190);
_yuitest_coverline("build/resize-base/resize-base.js", 1191);
handleEl.removeClass(CSS_RESIZE_HANDLE_ACTIVE);
                        }
                    );

                    _yuitest_coverline("build/resize-base/resize-base.js", 1195);
activeHandleNode.addClass(CSS_RESIZE_HANDLE_ACTIVE);
                }
                else {
                    _yuitest_coverline("build/resize-base/resize-base.js", 1198);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_setHandles", 1210);
_yuitest_coverline("build/resize-base/resize-base.js", 1211);
var instance = this,
                handles = [];

            // handles attr accepts both array or string
            _yuitest_coverline("build/resize-base/resize-base.js", 1215);
if (isArray(val)) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1216);
handles = val;
            }
            else {_yuitest_coverline("build/resize-base/resize-base.js", 1218);
if (isString(val)) {
                // if the handles attr passed in is an ALL string...
                _yuitest_coverline("build/resize-base/resize-base.js", 1220);
if (val.toLowerCase() === ALL) {
                    _yuitest_coverline("build/resize-base/resize-base.js", 1221);
handles = instance.ALL_HANDLES;
                }
                // otherwise, split the string to extract the handles
                else {
                    _yuitest_coverline("build/resize-base/resize-base.js", 1225);
Y.each(
                        val.split(COMMA),
                        function(node) {
                            _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 12)", 1227);
_yuitest_coverline("build/resize-base/resize-base.js", 1228);
var handle = trim(node);

                            // if its a valid handle, add it to the handles output
                            _yuitest_coverline("build/resize-base/resize-base.js", 1231);
if (indexOf(instance.ALL_HANDLES, handle) > -1) {
                                _yuitest_coverline("build/resize-base/resize-base.js", 1232);
handles.push(handle);
                            }
                        }
                    );
                }
            }}

            _yuitest_coverline("build/resize-base/resize-base.js", 1239);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_setHideHandlesUI", 1249);
_yuitest_coverline("build/resize-base/resize-base.js", 1250);
var instance = this,
                wrapper = instance.get(WRAPPER);

            _yuitest_coverline("build/resize-base/resize-base.js", 1253);
if (!instance.get(RESIZING)) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1254);
if (val) {
                    _yuitest_coverline("build/resize-base/resize-base.js", 1255);
wrapper.addClass(CSS_RESIZE_HIDDEN_HANDLES);
                }
                else {
                    _yuitest_coverline("build/resize-base/resize-base.js", 1258);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_setWrap", 1270);
_yuitest_coverline("build/resize-base/resize-base.js", 1271);
var instance = this,
                node = instance.get(NODE),
                nodeName = node.get(NODE_NAME),
                typeRegex = instance.get(WRAP_TYPES);

            // if nodeName is listed on WRAP_TYPES force use the wrapper
            _yuitest_coverline("build/resize-base/resize-base.js", 1277);
if (typeRegex.test(nodeName)) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1278);
val = true;
            }

            _yuitest_coverline("build/resize-base/resize-base.js", 1281);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_defMouseUpFn", 1291);
_yuitest_coverline("build/resize-base/resize-base.js", 1292);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 1294);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_defResizeFn", 1304);
_yuitest_coverline("build/resize-base/resize-base.js", 1305);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 1307);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_resize", 1317);
_yuitest_coverline("build/resize-base/resize-base.js", 1318);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 1320);
instance._handleResizeAlignEvent(event.dragEvent);

            // _syncUI of the wrapper, not using proxy
            _yuitest_coverline("build/resize-base/resize-base.js", 1323);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_defResizeAlignFn", 1333);
_yuitest_coverline("build/resize-base/resize-base.js", 1334);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 1336);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_resizeAlign", 1346);
_yuitest_coverline("build/resize-base/resize-base.js", 1347);
var instance = this,
                info,
                defMinHeight,
                defMinWidth;

            _yuitest_coverline("build/resize-base/resize-base.js", 1352);
instance.lastInfo = instance.info;

            // update the instance.info values
            _yuitest_coverline("build/resize-base/resize-base.js", 1355);
instance._updateInfo(event);

            _yuitest_coverline("build/resize-base/resize-base.js", 1357);
info = instance.info;

            // basic resize calculations
            _yuitest_coverline("build/resize-base/resize-base.js", 1360);
instance._calcResize();

            // if Y.Plugin.ResizeConstrained is not plugged, check for min dimension
            _yuitest_coverline("build/resize-base/resize-base.js", 1363);
if (!instance.con) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1364);
defMinHeight = (instance.get(DEF_MIN_HEIGHT) + instance.totalVSurrounding);
                _yuitest_coverline("build/resize-base/resize-base.js", 1365);
defMinWidth = (instance.get(DEF_MIN_WIDTH) + instance.totalHSurrounding);

                _yuitest_coverline("build/resize-base/resize-base.js", 1367);
if (info.offsetHeight <= defMinHeight) {
                    _yuitest_coverline("build/resize-base/resize-base.js", 1368);
instance._checkSize(OFFSET_HEIGHT, defMinHeight);
                }

                _yuitest_coverline("build/resize-base/resize-base.js", 1371);
if (info.offsetWidth <= defMinWidth) {
                    _yuitest_coverline("build/resize-base/resize-base.js", 1372);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_defResizeEndFn", 1384);
_yuitest_coverline("build/resize-base/resize-base.js", 1385);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 1387);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_resizeEnd", 1397);
_yuitest_coverline("build/resize-base/resize-base.js", 1398);
var instance = this,
                drag = event.dragEvent.target;

            // reseting actXY from drag when drag end
            _yuitest_coverline("build/resize-base/resize-base.js", 1402);
drag.actXY = [];

            // syncUI when resize end
            _yuitest_coverline("build/resize-base/resize-base.js", 1405);
instance._syncUI();

            _yuitest_coverline("build/resize-base/resize-base.js", 1407);
instance._setActiveHandlesUI(false);

            _yuitest_coverline("build/resize-base/resize-base.js", 1409);
instance.set(ACTIVE_HANDLE, null);
            _yuitest_coverline("build/resize-base/resize-base.js", 1410);
instance.set(ACTIVE_HANDLE_NODE, null);

            _yuitest_coverline("build/resize-base/resize-base.js", 1412);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_defResizeStartFn", 1422);
_yuitest_coverline("build/resize-base/resize-base.js", 1423);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 1425);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_resizeStart", 1435);
_yuitest_coverline("build/resize-base/resize-base.js", 1436);
var instance = this,
                wrapper = instance.get(WRAPPER);

            _yuitest_coverline("build/resize-base/resize-base.js", 1439);
instance.handle = instance.get(ACTIVE_HANDLE);

            _yuitest_coverline("build/resize-base/resize-base.js", 1441);
instance.set(RESIZING, true);

            _yuitest_coverline("build/resize-base/resize-base.js", 1443);
instance._updateSurroundingInfo();

            // create an originalInfo information for reference
            _yuitest_coverline("build/resize-base/resize-base.js", 1446);
instance.originalInfo = instance._getInfo(wrapper, event);

            _yuitest_coverline("build/resize-base/resize-base.js", 1448);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_handleMouseUpEvent", 1458);
_yuitest_coverline("build/resize-base/resize-base.js", 1459);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_handleResizeEvent", 1469);
_yuitest_coverline("build/resize-base/resize-base.js", 1470);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_handleResizeAlignEvent", 1480);
_yuitest_coverline("build/resize-base/resize-base.js", 1481);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_handleResizeEndEvent", 1491);
_yuitest_coverline("build/resize-base/resize-base.js", 1492);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_handleResizeStartEvent", 1502);
_yuitest_coverline("build/resize-base/resize-base.js", 1503);
if (!this.get(ACTIVE_HANDLE)) {
                //This handles the "touch" case
                _yuitest_coverline("build/resize-base/resize-base.js", 1505);
this._setHandleFromNode(event.target.get('node'));
            }
            _yuitest_coverline("build/resize-base/resize-base.js", 1507);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_onWrapperMouseEnter", 1517);
_yuitest_coverline("build/resize-base/resize-base.js", 1518);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 1520);
if (instance.get(AUTO_HIDE)) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1521);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_onWrapperMouseLeave", 1532);
_yuitest_coverline("build/resize-base/resize-base.js", 1533);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 1535);
if (instance.get(AUTO_HIDE)) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1536);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_setHandleFromNode", 1547);
_yuitest_coverline("build/resize-base/resize-base.js", 1548);
var instance = this,
                handle = instance._extractHandleName(node);

            _yuitest_coverline("build/resize-base/resize-base.js", 1551);
if (!instance.get(RESIZING)) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1552);
instance.set(ACTIVE_HANDLE, handle);
                _yuitest_coverline("build/resize-base/resize-base.js", 1553);
instance.set(ACTIVE_HANDLE_NODE, node);

                _yuitest_coverline("build/resize-base/resize-base.js", 1555);
instance._setActiveHandlesUI(true);
                _yuitest_coverline("build/resize-base/resize-base.js", 1556);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_onHandleMouseEnter", 1567);
_yuitest_coverline("build/resize-base/resize-base.js", 1568);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_onHandleMouseLeave", 1578);
_yuitest_coverline("build/resize-base/resize-base.js", 1579);
var instance = this;

            _yuitest_coverline("build/resize-base/resize-base.js", 1581);
if (!instance.get(RESIZING)) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1582);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_valueHandlesWrapper", 1593);
_yuitest_coverline("build/resize-base/resize-base.js", 1594);
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
            _yuitest_coverfunc("build/resize-base/resize-base.js", "_valueWrapper", 1604);
_yuitest_coverline("build/resize-base/resize-base.js", 1605);
var instance = this,
                node = instance.get(NODE),
                pNode = node.get(PARENT_NODE),
                // by deafult the wrapper is always the node
                wrapper = node;

            // if the node is listed on the wrapTypes or wrap is set to true, create another wrapper
            _yuitest_coverline("build/resize-base/resize-base.js", 1612);
if (instance.get(WRAP)) {
                _yuitest_coverline("build/resize-base/resize-base.js", 1613);
wrapper = Y.Node.create(instance.WRAP_TEMPLATE);

                _yuitest_coverline("build/resize-base/resize-base.js", 1615);
if (pNode) {
                    _yuitest_coverline("build/resize-base/resize-base.js", 1616);
pNode.insertBefore(wrapper, node);
                }

                _yuitest_coverline("build/resize-base/resize-base.js", 1619);
wrapper.append(node);

                _yuitest_coverline("build/resize-base/resize-base.js", 1621);
instance._copyStyles(node, wrapper);

                // remove positioning of wrapped node, the WRAPPER take care about positioning
                _yuitest_coverline("build/resize-base/resize-base.js", 1624);
node.setStyles({
                    position: STATIC,
                    left: 0,
                    top: 0
                });
            }

            _yuitest_coverline("build/resize-base/resize-base.js", 1631);
return wrapper;
        }
    }
);

_yuitest_coverline("build/resize-base/resize-base.js", 1636);
Y.each(Y.Resize.prototype.ALL_HANDLES, function(handle) {
    // creating ATTRS with the handles elements
    _yuitest_coverfunc("build/resize-base/resize-base.js", "(anonymous 13)", 1636);
_yuitest_coverline("build/resize-base/resize-base.js", 1638);
Y.Resize.ATTRS[handleAttrName(handle)] = {
        setter: function() {
            _yuitest_coverfunc("build/resize-base/resize-base.js", "setter", 1639);
_yuitest_coverline("build/resize-base/resize-base.js", 1640);
return this._buildHandle(handle);
        },
        value: null,
        writeOnce: true
    };
});


}, '3.7.3', {"requires": ["base", "widget", "event", "oop", "dd-drag", "dd-delegate", "dd-drop"], "skinnable": true});
