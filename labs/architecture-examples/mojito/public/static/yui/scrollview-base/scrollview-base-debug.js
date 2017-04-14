/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('scrollview-base', function (Y, NAME) {

/**
 * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators
 *
 * @module scrollview
 * @submodule scrollview-base
 */
var getClassName = Y.ClassNameManager.getClassName,
    DOCUMENT = Y.config.doc,
    WINDOW = Y.config.win,
    IE = Y.UA.ie,
    NATIVE_TRANSITIONS = Y.Transition.useNative,
    vendorPrefix = Y.Transition._VENDOR_PREFIX, // Todo: This is a private property, and alternative approaches should be investigated
    SCROLLVIEW = 'scrollview',
    CLASS_NAMES = {
        vertical: getClassName(SCROLLVIEW, 'vert'),
        horizontal: getClassName(SCROLLVIEW, 'horiz')
    },
    EV_SCROLL_END = 'scrollEnd',
    FLICK = 'flick',
    DRAG = 'drag',
    MOUSEWHEEL = 'mousewheel',
    UI = 'ui',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',
    PX = 'px',
    AXIS = 'axis',
    SCROLL_Y = 'scrollY',
    SCROLL_X = 'scrollX',
    BOUNCE = 'bounce',
    DISABLED = 'disabled',
    DECELERATION = 'deceleration',
    DIM_X = 'x',
    DIM_Y = 'y',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    GESTURE_MOVE = 'gesturemove',
    START = 'start',
    END = 'end',
    EMPTY = '',
    ZERO = '0s',
    SNAP_DURATION = 'snapDuration',
    SNAP_EASING = 'snapEasing', 
    EASING = 'easing', 
    FRAME_DURATION = 'frameDuration', 
    BOUNCE_RANGE = 'bounceRange',
    
    _constrain = function (val, min, max) {
        return Math.min(Math.max(val, min), max);
    };

/**
 * ScrollView provides a scrollable widget, supporting flick gestures,
 * across both touch and mouse based devices.
 *
 * @class ScrollView
 * @param config {Object} Object literal with initial attribute values
 * @extends Widget
 * @constructor
 */
function ScrollView() {
    ScrollView.superclass.constructor.apply(this, arguments);
}

Y.ScrollView = Y.extend(ScrollView, Y.Widget, {

    // *** Y.ScrollView prototype

    /**
     * Flag driving whether or not we should try and force H/W acceleration when transforming. Currently enabled by default for Webkit.
     * Used by the _transform method.
     *
     * @property _forceHWTransforms
     * @type boolean
     * @protected
     */
    _forceHWTransforms: Y.UA.webkit ? true : false,

    /**
     * <p>Used to control whether or not ScrollView's internal
     * gesturemovestart, gesturemove and gesturemoveend
     * event listeners should preventDefault. The value is an
     * object, with "start", "move" and "end" properties used to
     * specify which events should preventDefault and which shouldn't:</p>
     *
     * <pre>
     * {
     *    start: false,
     *    move: true,
     *    end: false
     * }
     * </pre>
     *
     * <p>The default values are set up in order to prevent panning,
     * on touch devices, while allowing click listeners on elements inside
     * the ScrollView to be notified as expected.</p>
     *
     * @property _prevent
     * @type Object
     * @protected
     */
    _prevent: {
        start: false,
        move: true,
        end: false
    },

    /**
     * Contains the distance (postive or negative) in pixels by which 
     * the scrollview was last scrolled. This is useful when setting up 
     * click listeners on the scrollview content, which on mouse based 
     * devices are always fired, even after a drag/flick. 
     * 
     * <p>Touch based devices don't currently fire a click event, 
     * if the finger has been moved (beyond a threshold) so this 
     * check isn't required, if working in a purely touch based environment</p>
     * 
     * @property lastScrolledAmt
     * @type Number
     * @public
     * @default 0
     */
    lastScrolledAmt: 0,

    /**
     * Designated initializer
     *
     * @method initializer
     * @param {config} Configuration object for the plugin
     */
    initializer: function (config) {
        var sv = this;

        // Cache these values, since they aren't going to change.
        sv._bb = sv.get(BOUNDING_BOX);
        sv._cb = sv.get(CONTENT_BOX);

        // Cache some attributes
        sv._cAxis = sv.get(AXIS);
        sv._cBounce = sv.get(BOUNCE);
        sv._cBounceRange = sv.get(BOUNCE_RANGE);
        sv._cDeceleration = sv.get(DECELERATION);
        sv._cFrameDuration = sv.get(FRAME_DURATION);
    },

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function () {
        var sv = this;

        // Bind interaction listers
        sv._bindFlick(sv.get(FLICK));
        sv._bindDrag(sv.get(DRAG));
        sv._bindMousewheel(true);
        
        // Bind change events
        sv._bindAttrs();

        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.
        if (IE) {
            sv._fixIESelect(sv._bb, sv._cb);
        }

        // Set any deprecated static properties
        if (ScrollView.SNAP_DURATION) {
            sv.set(SNAP_DURATION, ScrollView.SNAP_DURATION);
        }

        if (ScrollView.SNAP_EASING) {
            sv.set(SNAP_EASING, ScrollView.SNAP_EASING);
        }

        if (ScrollView.EASING) {
            sv.set(EASING, ScrollView.EASING);
        }

        if (ScrollView.FRAME_STEP) {
            sv.set(FRAME_DURATION, ScrollView.FRAME_STEP);
        }

        if (ScrollView.BOUNCE_RANGE) {
            sv.set(BOUNCE_RANGE, ScrollView.BOUNCE_RANGE);
        }

        // Recalculate dimension properties
        // TODO: This should be throttled.
        // Y.one(WINDOW).after('resize', sv._afterDimChange, sv);
    },

    /**
     * Bind event listeners
     *
     * @method _bindAttrs
     * @private
     */
    _bindAttrs: function () {
        var sv = this,
            scrollChangeHandler = sv._afterScrollChange,
            dimChangeHandler = sv._afterDimChange;

        // Bind any change event listeners
        sv.after({
            'scrollEnd': sv._afterScrollEnd,
            'disabledChange': sv._afterDisabledChange,
            'flickChange': sv._afterFlickChange,
            'dragChange': sv._afterDragChange,
            'axisChange': sv._afterAxisChange,
            'scrollYChange': scrollChangeHandler,
            'scrollXChange': scrollChangeHandler,
            'heightChange': dimChangeHandler,
            'widthChange': dimChangeHandler
        });
    },

    /**
     * Bind (or unbind) gesture move listeners required for drag support
     *
     * @method _bindDrag
     * @param drag {boolean} If true, the method binds listener to enable drag (gesturemovestart). If false, the method unbinds gesturemove listeners for drag support.
     * @private
     */
    _bindDrag: function (drag) {
        var sv = this,
            bb = sv._bb;

        // Unbind any previous 'drag' listeners
        bb.detach(DRAG + '|*');

        if (drag) {
            bb.on(DRAG + '|' + GESTURE_MOVE + START, Y.bind(sv._onGestureMoveStart, sv));
        }
    },

    /**
     * Bind (or unbind) flick listeners.
     *
     * @method _bindFlick
     * @param flick {Object|boolean} If truthy, the method binds listeners for flick support. If false, the method unbinds flick listeners.
     * @private
     */
    _bindFlick: function (flick) {
        var sv = this,
            bb = sv._bb;

        // Unbind any previous 'flick' listeners
        bb.detach(FLICK + '|*');

        if (flick) {
            bb.on(FLICK + '|' + FLICK, Y.bind(sv._flick, sv), flick);

            // Rebind Drag, becuase _onGestureMoveEnd always has to fire -after- _flick
            sv._bindDrag(sv.get(DRAG));
        }
    },

    /**
     * Bind (or unbind) mousewheel listeners.
     *
     * @method _bindMousewheel
     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for mousewheel support. If false, the method unbinds mousewheel listeners.
     * @private
     */
    _bindMousewheel: function (mousewheel) {
        var sv = this,
            bb = sv._bb;

        // Unbind any previous 'mousewheel' listeners
        bb.detach(MOUSEWHEEL + '|*');

        // Only enable for vertical scrollviews
        if (mousewheel) {
            // Bound to document, because that's where mousewheel events fire off of.
            Y.one(DOCUMENT).on(MOUSEWHEEL, Y.bind(sv._mousewheel, sv));
        }
    },

    /**
     * syncUI implementation.
     *
     * Update the scroll position, based on the current value of scrollX/scrollY.
     *
     * @method syncUI
     */
    syncUI: function () {
        var sv = this,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight;

        // If the axis is undefined, auto-calculate it
        if (sv._cAxis === undefined) {
            // This should only ever be run once (for now).
            // In the future SV might post-load axis changes
            sv._cAxis = {
                x: (scrollWidth > width),
                y: (scrollHeight > height)
            };

            sv._set(AXIS, sv._cAxis);
        }
        
        // get text direction on or inherited by scrollview node
        sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');

        // Cache the disabled value
        sv._cDisabled = sv.get(DISABLED);

        // Run this to set initial values
        sv._uiDimensionsChange();

        // If we're out-of-bounds, snap back.
        if (sv._isOutOfBounds()) {
            sv._snapBack();
        }
    },

    /**
     * Utility method to obtain widget dimensions
     * 
     * @method _getScrollDims
     * @returns {Object} The offsetWidth, offsetHeight, scrollWidth and scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth, scrollHeight]
     * @private
     */
    _getScrollDims: function () {
        var sv = this,
            cb = sv._cb,
            bb = sv._bb,
            TRANS = ScrollView._TRANSITION,
            // Ideally using CSSMatrix - don't think we have it normalized yet though.
            // origX = (new WebKitCSSMatrix(cb.getComputedStyle("transform"))).e,
            // origY = (new WebKitCSSMatrix(cb.getComputedStyle("transform"))).f,
            origX = sv.get(SCROLL_X),
            origY = sv.get(SCROLL_Y),
            origHWTransform,
            dims;

        // TODO: Is this OK? Just in case it's called 'during' a transition.
        if (NATIVE_TRANSITIONS) {
            cb.setStyle(TRANS.DURATION, ZERO);
            cb.setStyle(TRANS.PROPERTY, EMPTY);
        }

        origHWTransform = sv._forceHWTransforms;
        sv._forceHWTransforms = false; // the z translation was causing issues with picking up accurate scrollWidths in Chrome/Mac.

        sv._moveTo(cb, 0, 0);
        dims = {
            'offsetWidth': bb.get('offsetWidth'),
            'offsetHeight': bb.get('offsetHeight'),
            'scrollWidth': bb.get('scrollWidth'),
            'scrollHeight': bb.get('scrollHeight')
        };
        sv._moveTo(cb, -(origX), -(origY));

        sv._forceHWTransforms = origHWTransform;

        return dims;
    },

    /**
     * This method gets invoked whenever the height or width attributes change,
     * allowing us to determine which scrolling axes need to be enabled.
     *
     * @method _uiDimensionsChange
     * @protected
     */
    _uiDimensionsChange: function () {
        var sv = this,
            bb = sv._bb,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight,
            rtl = sv.rtl,
            svAxis = sv._cAxis;
            
        if (svAxis && svAxis.x) {
            bb.addClass(CLASS_NAMES.horizontal);
        }

        if (svAxis && svAxis.y) {
            bb.addClass(CLASS_NAMES.vertical);
        }

        /**
         * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis
         *
         * @property _minScrollX
         * @type number
         * @protected
         */
        sv._minScrollX = (rtl) ? Math.min(0, -(scrollWidth - width)) : 0;

        /**
         * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis
         *
         * @property _maxScrollX
         * @type number
         * @protected
         */
        sv._maxScrollX = (rtl) ? 0 : Math.max(0, scrollWidth - width);

        /**
         * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis
         *
         * @property _minScrollY
         * @type number
         * @protected
         */
        sv._minScrollY = 0;

        /**
         * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis
         *
         * @property _maxScrollY
         * @type number
         * @protected
         */
        sv._maxScrollY = Math.max(0, scrollHeight - height);
    },

    /**
     * Scroll the element to a given xy coordinate
     *
     * @method scrollTo
     * @param x {Number} The x-position to scroll to. (null for no movement)
     * @param y {Number} The y-position to scroll to. (null for no movement)
     * @param {Number} [duration] ms of the scroll animation. (default is 0)
     * @param {String} [easing] An easing equation if duration is set. (default is `easing` attribute)
     * @param {String} [node] The node to transform.  Setting this can be useful in dual-axis paginated instances. (default is the instance's contentBox)
     */
    scrollTo: function (x, y, duration, easing, node) {
        // Check to see if widget is disabled
        if (this._cDisabled) {
            return;
        }

        var sv = this,
            cb = sv._cb,
            TRANS = ScrollView._TRANSITION,
            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this
            newX = 0,
            newY = 0,
            transition = {},
            transform;

        // default the optional arguments
        duration = duration || 0;
        easing = easing || sv.get(EASING); // @TODO: Cache this
        node = node || cb;

        if (x !== null) {
            sv.set(SCROLL_X, x, {src:UI});
            newX = -(x);
        }

        if (y !== null) {
            sv.set(SCROLL_Y, y, {src:UI});
            newY = -(y);
        }

        transform = sv._transform(newX, newY);

        if (NATIVE_TRANSITIONS) {
            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.
            node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);
        }

        // Move
        if (duration === 0) {
            if (NATIVE_TRANSITIONS) {
                node.setStyle('transform', transform);
            }
            else {
                // TODO: If both set, batch them in the same update
                // Update: Nope, setStyles() just loops through each property and applies it.
                if (x !== null) {
                    node.setStyle(LEFT, newX + PX);
                }
                if (y !== null) {
                    node.setStyle(TOP, newY + PX);
                }
            }
        }

        // Animate
        else {
            transition.easing = easing;
            transition.duration = duration / 1000;

            if (NATIVE_TRANSITIONS) {
                transition.transform = transform;
            }
            else {
                transition.left = newX + PX;
                transition.top = newY + PX;
            }

            node.transition(transition, callback);
        }
    },

    /**
     * Utility method, to create the translate transform string with the
     * x, y translation amounts provided.
     *
     * @method _transform
     * @param {Number} x Number of pixels to translate along the x axis
     * @param {Number} y Number of pixels to translate along the y axis
     * @private
     */
    _transform: function (x, y) {
        // TODO: Would we be better off using a Matrix for this?
        var prop = 'translate(' + x + 'px, ' + y + 'px)';

        if (this._forceHWTransforms) {
            prop += ' translateZ(0)';
        }

        return prop;
    },

    /**
    * Utility method, to move the given element to the given xy position
    *
    * @method _moveTo
    * @param node {Node} The node to move
    * @param x {Number} The x-position to move to
    * @param y {Number} The y-position to move to
    * @private
    */
    _moveTo : function(node, x, y) {
        if (NATIVE_TRANSITIONS) {
            node.setStyle('transform', this._transform(x, y));
        } else {
            node.setStyle(LEFT, x + PX);
            node.setStyle(TOP, y + PX);
        }
    },


    /**
     * Content box transition callback
     *
     * @method _onTransEnd
     * @param {Event.Facade} e The event facade
     * @private
     */
    _onTransEnd: function (e) {
        var sv = this;

        /**
         * Notification event fired at the end of a scroll transition
         *
         * @event scrollEnd
         * @param e {EventFacade} The default event facade.
         */
        sv.fire(EV_SCROLL_END);
    },

    /**
     * gesturemovestart event handler
     *
     * @method _onGestureMoveStart
     * @param e {Event.Facade} The gesturemovestart event facade
     * @private
     */
    _onGestureMoveStart: function (e) {

        if (this._cDisabled) {
            return false;
        }

        var sv = this,
            bb = sv._bb,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            clientX = e.clientX,
            clientY = e.clientY;

        if (sv._prevent.start) {
            e.preventDefault();
        }

        // if a flick animation is in progress, cancel it
        if (sv._flickAnim) {
            // Cancel and delete sv._flickAnim
            sv._flickAnim.cancel();
            delete sv._flickAnim;
            sv._onTransEnd();
        }

        // TODO: Review if neccesary (#2530129)
        e.stopPropagation();

        // Reset lastScrolledAmt
        sv.lastScrolledAmt = 0;

        // Stores data for this gesture cycle.  Cleaned up later
        sv._gesture = {

            // Will hold the axis value
            axis: null,

            // The current attribute values
            startX: currentX,
            startY: currentY,

            // The X/Y coordinates where the event began
            startClientX: clientX,
            startClientY: clientY,

            // The X/Y coordinates where the event will end
            endClientX: null,
            endClientY: null,

            // The current delta of the event
            deltaX: null,
            deltaY: null,

            // Will be populated for flicks
            flick: null,

            // Create some listeners for the rest of the gesture cycle
            onGestureMove: bb.on(DRAG + '|' + GESTURE_MOVE, Y.bind(sv._onGestureMove, sv)),
            
            // @TODO: Don't bind gestureMoveEnd if it's a Flick?
            onGestureMoveEnd: bb.on(DRAG + '|' + GESTURE_MOVE + END, Y.bind(sv._onGestureMoveEnd, sv))
        };
    },

    /**
     * gesturemove event handler
     *
     * @method _onGestureMove
     * @param e {Event.Facade} The gesturemove event facade
     * @private
     */
    _onGestureMove: function (e) {
        var sv = this,
            gesture = sv._gesture,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            startX = gesture.startX,
            startY = gesture.startY,
            startClientX = gesture.startClientX,
            startClientY = gesture.startClientY,
            clientX = e.clientX,
            clientY = e.clientY;

        if (sv._prevent.move) {
            e.preventDefault();
        }

        gesture.deltaX = startClientX - clientX;
        gesture.deltaY = startClientY - clientY;

        // Determine if this is a vertical or horizontal movement
        // @TODO: This is crude, but it works.  Investigate more intelligent ways to detect intent
        if (gesture.axis === null) {
            gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;
        }

        // Move X or Y.  @TODO: Move both if dualaxis.        
        if (gesture.axis === DIM_X && svAxisX) {
            sv.set(SCROLL_X, startX + gesture.deltaX);
        }
        else if (gesture.axis === DIM_Y && svAxisY) {
            sv.set(SCROLL_Y, startY + gesture.deltaY);
        }
    },

    /**
     * gesturemoveend event handler
     *
     * @method _onGestureMoveEnd
     * @param e {Event.Facade} The gesturemoveend event facade
     * @private
     */
    _onGestureMoveEnd: function (e) {
        var sv = this,
            gesture = sv._gesture,
            flick = gesture.flick,
            clientX = e.clientX,
            clientY = e.clientY;

        if (sv._prevent.end) {
            e.preventDefault();
        }

        // Store the end X/Y coordinates
        gesture.endClientX = clientX;
        gesture.endClientY = clientY;

        // Cleanup the event handlers
        gesture.onGestureMove.detach();
        gesture.onGestureMoveEnd.detach();

        // If this wasn't a flick, wrap up the gesture cycle
        if (!flick) {
            // @TODO: Be more intelligent about this. Look at the Flick attribute to see 
            // if it is safe to assume _flick did or didn't fire.  
            // Then, the order _flick and _onGestureMoveEnd fire doesn't matter?

            // If there was movement (_onGestureMove fired)
            if (gesture.deltaX !== null && gesture.deltaY !== null) {

                // If we're out-out-bounds, then snapback
                if (sv._isOutOfBounds()) {
                    sv._snapBack();
                }

                // Inbounds
                else {
                    // Don't fire scrollEnd on the gesture axis is the same as paginator's
                    // Not totally confident this is ideal to access a plugin's properties from a host, @TODO revisit
                    if (sv.pages && !sv.pages.get(AXIS)[gesture.axis]) {
                        sv._onTransEnd();
                    }
                }
            }
        }
    },

    /**
     * Execute a flick at the end of a scroll action
     *
     * @method _flick
     * @param e {Event.Facade} The Flick event facade
     * @private
     */
    _flick: function (e) {
        if (this._cDisabled) {
            return false;
        }

        var sv = this,
            svAxis = sv._cAxis,
            flick = e.flick,
            flickAxis = flick.axis,
            flickVelocity = flick.velocity,
            axisAttr = flickAxis === DIM_X ? SCROLL_X : SCROLL_Y,
            startPosition = sv.get(axisAttr);

        // Sometimes flick is enabled, but drag is disabled
        if (sv._gesture) {
            sv._gesture.flick = flick;
        }

        // Prevent unneccesary firing of _flickFrame if we can't scroll on the flick axis
        if (svAxis[flickAxis]) {
            sv._flickFrame(flickVelocity, flickAxis, startPosition);
        }
    },

    /**
     * Execute a single frame in the flick animation
     *
     * @method _flickFrame
     * @param velocity {Number} The velocity of this animated frame
     * @param flickAxis {String} The axis on which to animate
     * @param startPosition {Number} The starting X/Y point to flick from
     * @protected
     */
    _flickFrame: function (velocity, flickAxis, startPosition) {

        var sv = this,
            axisAttr = flickAxis === DIM_X ? SCROLL_X : SCROLL_Y,

            // Localize cached values
            bounce = sv._cBounce,
            bounceRange = sv._cBounceRange,
            deceleration = sv._cDeceleration,
            frameDuration = sv._cFrameDuration,

            // Calculate
            newVelocity = velocity * deceleration,
            newPosition = startPosition - (frameDuration * newVelocity),

            // Some convinience conditions
            min = flickAxis === DIM_X ? sv._minScrollX : sv._minScrollY,
            max = flickAxis === DIM_X ? sv._maxScrollX : sv._maxScrollY,
            belowMin       = (newPosition < min),
            belowMax       = (newPosition < max),
            aboveMin       = (newPosition > min),
            aboveMax       = (newPosition > max),
            belowMinRange  = (newPosition < (min - bounceRange)),
            belowMaxRange  = (newPosition < (max + bounceRange)),
            withinMinRange = (belowMin && (newPosition > (min - bounceRange))),
            withinMaxRange = (aboveMax && (newPosition < (max + bounceRange))),
            aboveMinRange  = (newPosition > (min - bounceRange)),
            aboveMaxRange  = (newPosition > (max + bounceRange)),
            tooSlow;

        // If we're within the range but outside min/max, dampen the velocity
        if (withinMinRange || withinMaxRange) {
            newVelocity *= bounce;
        }

        // Is the velocity too slow to bother?
        tooSlow = (Math.abs(newVelocity).toFixed(4) < 0.015);

        // If the velocity is too slow or we're outside the range
        if (tooSlow || belowMinRange || aboveMaxRange) {
            // Cancel and delete sv._flickAnim
            if (sv._flickAnim) {
                sv._flickAnim.cancel();
                delete sv._flickAnim;
            }

            // If we're inside the scroll area, just end
            if (aboveMin && belowMax) {
                sv._onTransEnd();
            }

            // We're outside the scroll area, so we need to snap back
            else {
                sv._snapBack();
            }
        }

        // Otherwise, animate to the next frame
        else {
            // @TODO: maybe use requestAnimationFrame instead
            sv._flickAnim = Y.later(frameDuration, sv, '_flickFrame', [newVelocity, flickAxis, newPosition]);
            sv.set(axisAttr, newPosition);
        }
    },

    /**
     * Handle mousewheel events on the widget
     *
     * @method _mousewheel
     * @param e {Event.Facade} The mousewheel event facade
     * @private
     */
    _mousewheel: function (e) {
        var sv = this,
            scrollY = sv.get(SCROLL_Y),
            bb = sv._bb,
            scrollOffset = 10, // 10px
            isForward = (e.wheelDelta > 0),
            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);

        scrollToY = _constrain(scrollToY, sv._minScrollY, sv._maxScrollY);

        // Because Mousewheel events fire off 'document', every ScrollView widget will react
        // to any mousewheel anywhere on the page. This check will ensure that the mouse is currently
        // over this specific ScrollView.  Also, only allow mousewheel scrolling on Y-axis, 
        // becuase otherwise the 'prevent' will block page scrolling.
        if (bb.contains(e.target) && sv._cAxis[DIM_Y]) {

            // Reset lastScrolledAmt
            sv.lastScrolledAmt = 0;

            // Jump to the new offset
            sv.set(SCROLL_Y, scrollToY);

            // if we have scrollbars plugin, update & set the flash timer on the scrollbar
            // @TODO: This probably shouldn't be in this module
            if (sv.scrollbars) {
                // @TODO: The scrollbars should handle this themselves
                sv.scrollbars._update();
                sv.scrollbars.flash();
                // or just this
                // sv.scrollbars._hostDimensionsChange();
            }

            // Fire the 'scrollEnd' event
            sv._onTransEnd();

            // prevent browser default behavior on mouse scroll
            e.preventDefault();
        }
    },

    /**
     * Checks to see the current scrollX/scrollY position beyond the min/max boundary
     *
     * @method _isOutOfBounds
     * @param x {Number} [optional] The X position to check
     * @param y {Number} [optional] The Y position to check
     * @returns {boolen} Whether the current X/Y position is out of bounds (true) or not (false)
     * @private
     */
    _isOutOfBounds: function (x, y) {
        var sv = this,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            currentX = x || sv.get(SCROLL_X),
            currentY = y || sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            minY = sv._minScrollY,
            maxX = sv._maxScrollX,
            maxY = sv._maxScrollY;

        return (svAxisX && (currentX < minX || currentX > maxX)) || (svAxisY && (currentY < minY || currentY > maxY));
    },

    /**
     * Bounces back
     * @TODO: Should be more generalized and support both X and Y detection
     *
     * @method _snapBack
     * @private
     */
    _snapBack: function () {
        var sv = this,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            minX = sv._minScrollX,
            minY = sv._minScrollY,
            maxX = sv._maxScrollX,
            maxY = sv._maxScrollY,
            newY = _constrain(currentY, minY, maxY),
            newX = _constrain(currentX, minX, maxX),
            duration = sv.get(SNAP_DURATION),
            easing = sv.get(SNAP_EASING);

        if (newX !== currentX) {
            sv.set(SCROLL_X, newX, {duration:duration, easing:easing});
        }
        else if (newY !== currentY) {
            sv.set(SCROLL_Y, newY, {duration:duration, easing:easing});
        }
        else {
            // It shouldn't ever get here, but in case it does, fire scrollEnd
            sv._onTransEnd();
        }
    },

    /**
     * After listener for changes to the scrollX or scrollY attribute
     *
     * @method _afterScrollChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterScrollChange: function (e) {

        if (e.src === ScrollView.UI_SRC) {
            return false;
        }

        var sv = this,
            duration = e.duration,
            easing = e.easing,
            val = e.newVal,
            scrollToArgs = [];

        // Set the scrolled value
        sv.lastScrolledAmt = sv.lastScrolledAmt + (e.newVal - e.prevVal);

        // Generate the array of args to pass to scrollTo()
        if (e.attrName === SCROLL_X) {
            scrollToArgs.push(val);
            scrollToArgs.push(sv.get(SCROLL_Y));
        }
        else {
            scrollToArgs.push(sv.get(SCROLL_X));
            scrollToArgs.push(val);
        }

        scrollToArgs.push(duration);
        scrollToArgs.push(easing);

        sv.scrollTo.apply(sv, scrollToArgs);
    },

    /**
     * After listener for changes to the flick attribute
     *
     * @method _afterFlickChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterFlickChange: function (e) {
        this._bindFlick(e.newVal);
    },

    /**
     * After listener for changes to the disabled attribute
     *
     * @method _afterDisabledChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDisabledChange: function (e) {
        // Cache for performance - we check during move
        this._cDisabled = e.newVal;
    },

    /**
     * After listener for the axis attribute
     *
     * @method _afterAxisChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterAxisChange: function (e) {
        this._cAxis = e.newVal;
    },

    /**
     * After listener for changes to the drag attribute
     *
     * @method _afterDragChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDragChange: function (e) {
        this._bindDrag(e.newVal);
    },

    /**
     * After listener for the height or width attribute
     *
     * @method _afterDimChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDimChange: function () {
        this._uiDimensionsChange();
    },

    /**
     * After listener for scrollEnd, for cleanup
     *
     * @method _afterScrollEnd
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterScrollEnd: function (e) {
        var sv = this;

        // @TODO: Move to sv._cancelFlick()
        if (sv._flickAnim) {
            // Cancel the flick (if it exists)
            sv._flickAnim.cancel();

            // Also delete it, otherwise _onGestureMoveStart will think we're still flicking
            delete sv._flickAnim;
        }

        // If for some reason we're OOB, snapback
        if (sv._isOutOfBounds()) {
            sv._snapBack();
        }

        // Ideally this should be removed, but doing so causing some JS errors with fast swiping 
        // because _gesture is being deleted after the previous one has been overwritten
        // delete sv._gesture; // TODO: Move to sv.prevGesture?
    },

    /**
     * Setter for 'axis' attribute
     *
     * @method _axisSetter
     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on
     * @param name {String} The attribute name
     * @return {Object} An object to specify scrollability on the x & y axes
     * 
     * @protected
     */
    _axisSetter: function (val, name) {

        // Turn a string into an axis object
        if (Y.Lang.isString(val)) {
            return {
                x: val.match(/x/i) ? true : false,
                y: val.match(/y/i) ? true : false
            };
        }
    },
    
    /**
    * The scrollX, scrollY setter implementation
    *
    * @method _setScroll
    * @private
    * @param {Number} val
    * @param {String} dim
    *
    * @return {Number} The value
    */
    _setScroll : function(val, dim) {

        // Just ensure the widget is not disabled
        if (this._cDisabled) {
            val = Y.Attribute.INVALID_VALUE;
        } 

        return val;
    },

    /**
    * Setter for the scrollX attribute
    *
    * @method _setScrollX
    * @param val {Number} The new scrollX value
    * @return {Number} The normalized value
    * @protected
    */
    _setScrollX: function(val) {
        return this._setScroll(val, DIM_X);
    },

    /**
    * Setter for the scrollY ATTR
    *
    * @method _setScrollY
    * @param val {Number} The new scrollY value
    * @return {Number} The normalized value
    * @protected
    */
    _setScrollY: function(val) {
        return this._setScroll(val, DIM_Y);
    }

    // End prototype properties

}, {

    // Static properties

    /**
     * The identity of the widget.
     *
     * @property NAME
     * @type String
     * @default 'scrollview'
     * @readOnly
     * @protected
     * @static
     */
    NAME: 'scrollview',

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property ATTRS
     * @type {Object}
     * @protected
     * @static
     */
    ATTRS: {

        /**
         * Specifies ability to scroll on x, y, or x and y axis/axes.
         *
         * @attribute axis
         * @type String
         */
        axis: {
            setter: '_axisSetter',
            writeOnce: 'initOnly'
        },

        /**
         * The current scroll position in the x-axis
         *
         * @attribute scrollX
         * @type Number
         * @default 0
         */
        scrollX: {
            value: 0,
            setter: '_setScrollX'
        },

        /**
         * The current scroll position in the y-axis
         *
         * @attribute scrollY
         * @type Number
         * @default 0
         */
        scrollY: {
            value: 0,
            setter: '_setScrollY'
        },

        /**
         * Drag coefficent for inertial scrolling. The closer to 1 this
         * value is, the less friction during scrolling.
         *
         * @attribute deceleration
         * @default 0.93
         */
        deceleration: {
            value: 0.93
        },

        /**
         * Drag coefficient for intertial scrolling at the upper
         * and lower boundaries of the scrollview. Set to 0 to
         * disable "rubber-banding".
         *
         * @attribute bounce
         * @type Number
         * @default 0.1
         */
        bounce: {
            value: 0.1
        },

        /**
         * The minimum distance and/or velocity which define a flick. Can be set to false,
         * to disable flick support (note: drag support is enabled/disabled separately)
         *
         * @attribute flick
         * @type Object
         * @default Object with properties minDistance = 10, minVelocity = 0.3.
         */
        flick: {
            value: {
                minDistance: 10,
                minVelocity: 0.3
            }
        },

        /**
         * Enable/Disable dragging the ScrollView content (note: flick support is enabled/disabled separately)
         * @attribute drag
         * @type boolean
         * @default true
         */
        drag: {
            value: true
        },

        /**
         * The default duration to use when animating the bounce snap back.
         *
         * @attribute snapDuration
         * @type Number
         * @default 400
         */
        snapDuration: {
            value: 400
        },

        /**
         * The default easing to use when animating the bounce snap back.
         *
         * @attribute snapEasing
         * @type String
         * @default 'ease-out'
         */
        snapEasing: {
            value: 'ease-out'
        },

        /**
         * The default easing used when animating the flick
         *
         * @attribute easing
         * @type String
         * @default 'cubic-bezier(0, 0.1, 0, 1.0)'
         */
        easing: {
            value: 'cubic-bezier(0, 0.1, 0, 1.0)'
        },

        /**
         * The interval (ms) used when animating the flick for JS-timer animations
         *
         * @attribute frameDuration
         * @type Number
         * @default 15
         */
        frameDuration: {
            value: 15
        },

        /**
         * The default bounce distance in pixels
         *
         * @attribute bounceRange
         * @type Number
         * @default 150
         */
        bounceRange: {
            value: 150
        }
    },

    /**
     * List of class names used in the scrollview's DOM
     *
     * @property CLASS_NAMES
     * @type Object
     * @static
     */
    CLASS_NAMES: CLASS_NAMES,

    /**
     * Flag used to source property changes initiated from the DOM
     *
     * @property UI_SRC
     * @type String
     * @static
     * @default 'ui'
     */
    UI_SRC: UI,

    /**
     * Object map of style property names used to set transition properties.
     * Defaults to the vendor prefix established by the Transition module.
     * The configured property names are `_TRANSITION.DURATION` (e.g. "WebkitTransitionDuration") and
     * `_TRANSITION.PROPERTY (e.g. "WebkitTransitionProperty").
     *
     * @property _TRANSITION
     * @private
     */
    _TRANSITION: {
        DURATION: (vendorPrefix ? vendorPrefix + 'TransitionDuration' : 'transitionDuration'),
        PROPERTY: (vendorPrefix ? vendorPrefix + 'TransitionProperty' : 'transitionProperty')
    },

    /**
     * The default bounce distance in pixels
     *
     * @property BOUNCE_RANGE
     * @type Number
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    BOUNCE_RANGE: false,

    /**
     * The interval (ms) used when animating the flick
     *
     * @property FRAME_STEP
     * @type Number
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    FRAME_STEP: false,

    /**
     * The default easing used when animating the flick
     *
     * @property EASING
     * @type String
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    EASING: false,

    /**
     * The default easing to use when animating the bounce snap back.
     *
     * @property SNAP_EASING
     * @type String
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    SNAP_EASING: false,

    /**
     * The default duration to use when animating the bounce snap back.
     *
     * @property SNAP_DURATION
     * @type Number
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    SNAP_DURATION: false

    // End static properties

});

}, '3.7.3', {"requires": ["widget", "event-gestures", "event-mousewheel", "transition"], "skinnable": true});
