montageDefine("af1b182","composer/press-composer",{dependencies:["../core/core","./composer","../core/event/mutable-event"],factory:function(require,exports,module){/*global require, exports*/

/**
 * @module montage/composer/press-composer
 * @requires montage/core/core
 * @requires montage/composer/composer
 * @requires montage/core/event/mutable-event
 */
var Montage = require("../core/core").Montage,
    Composer = require("./composer").Composer,
    MutableEvent = require("../core/event/mutable-event").MutableEvent;

/**
 * @class PressComposer
 * @classdesc The `PressComposer` abstracts away handling mouse and touch
 * events that represent presses, allowing generic detection of presses, long
 * presses, and cancelled presses.
 *
 * @extends Composer
 * @fires pressStart
 * @fires press
 * @fires longPress
 * @fires pressCancel
 */
var PressComposer = exports.PressComposer = Composer.specialize(/** @lends PressComposer.prototype # */ {

    /**
     * Dispatched when a press begins. It is ended by either a {@link press} or
     * {@link pressCancel} event.
     *
     * @event pressStart
     * @memberof PressComposer
     * @param {PressEvent} event
     */

    /**
     * Dispatched when a press is complete.
     *
     * @event press
     * @memberof PressComposer
     * @param {PressEvent} event
     */

    /**
     * Dispatched when a press lasts for longer than (@link longPressThreshold}
     * On a long press, the sequence of events will be:
     * - pressStart: as soon as the composer recognizes it is a press.
     * - longPress: `longPressThreshold` after the pressStart, if the press has
     *   not yet ended.
     * - press: when the press ends, if it isn't cancelled.
     *
     * Handlers of the `longPress` event can call `cancelPress` to prevent
     * `press` being triggered.
     *
     * @event longPress
     * @memberof PressComposer
     * @param {PressEvent} event
     */

    /**
     * Dispatched when a press is canceled. This could be because the pointer
     * left the element, was claimed by another component or maybe a phone call
     * came in.
     *
     * @event pressCancel
     * @memberof PressComposer
     * @param {PressEvent} event
     */

    // Load/unload

    load: {
        value: function () {
            if (window.PointerEvent) {
                this._element.addEventListener("pointerdown", this, true);

            } else if (window.MSPointerEvent && window.navigator.msPointerEnabled) {
                this._element.addEventListener("MSPointerDown", this, true);

            } else {
                this._element.addEventListener("touchstart", this, true);
                this._element.addEventListener("mousedown", this, true);
            }
        }
    },

    unload: {
        value: function () {
            if (window.PointerEvent) {
                this._element.removeEventListener("pointerdown", this, true);

            } else if (window.MSPointerEvent && window.navigator.msPointerEnabled) {
                this._element.removeEventListener("MSPointerDown", this, true);

            } else {
                this._element.removeEventListener("touchstart", this, true);
                this._element.removeEventListener("mousedown", this, true);
            }
        }
    },

    /**
     * Delegate that implements `surrenderPointer`. See Component for
     * explanation of what this method should do.
     *
     * @type {Object}
     * @default null
     */
    delegate: {
        value: null
    },


    /**
     * Cancel the current press.
     *
     * Can be used in a "longPress" event handler to prevent the "press" event
     * being fired.
     * @returns boolean true if a press was canceled, false if the composer was
     * already in a unpressed or canceled state.
     */
    cancelPress: {
        value: function () {
            if (this._state === PressComposer.PRESSED) {
                this._cancelPress();
                return true;
            }
            return false;
        }
    },

    _cancelPress: {
        value: function (event) {
            this._dispatchPressCancel(event);
            this._endInteraction();
        }
    },

    // Optimisation so that we don't set a timeout if we do not need to
    addEventListener: {
        value: function (type, listener, useCapture) {
            Composer.addEventListener.call(this, type, listener, useCapture);
            if (type === "longPress") {
                this._shouldDispatchLongPress = true;
            }
        }
    },

    UNPRESSED: {
        value: 0
    },
    PRESSED: {
        value: 1
    },
    CANCELLED: {
        value: 2
    },

    _state: {
        value: 0
    },
    state: {
        get: function () {
            return this._state;
        }
    },

    _shouldDispatchLongPress: {
        value: false
    },

    _longPressThreshold: {
        value: 1000
    },

    /**
     * How long a press has to last (in milliseconds) for a longPress event to
     * be dispatched
     * @type number
     */
    longPressThreshold: {
        get: function () {
            return this._longPressThreshold;
        },
        set: function (value) {
            if (this._longPressThreshold !== value) {
                this._longPressThreshold = value;
            }
        }
    },

    _longPressTimeout: {
        value: null
    },

    // Magic

    _observedPointer: {
        value: null
    },

    _initialCenterPositionX: {
        value : 0
    },

    _initialCenterPositionY: {
        value: 0
    },

    _shouldSaveInitialCenterPosition: {
        value: false
    },

    /**
     * Remove event listeners after an interaction has finished.
     * @private
     */
    _endInteraction: {
        value: function () {
            if (this._element) {
                this._removeEventListeners();

                if (this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this)) {
                    this.component.eventManager.forfeitPointer(this._observedPointer, this);
                }

                this._observedPointer = null;
                this._state = PressComposer.UNPRESSED;
                this._initialCenterPositionX = 0;
                this._initialCenterPositionY = 0;
                this._shouldSaveInitialCenterPosition = false;
            }
        }
    },

    /**
     * Checks if we are observing one of the changed touches. Returns the index
     * of the changed touch if one matches, otherwise returns false. Make sure
     * to check against `!== false` or `=== false` as the
     * matching index might be 0.
     *
     * @function
     * @returns {number|boolean} The index of the matching touch, or false
     * @private
     */
    _changedTouchisObserved: {
        value: function (changedTouches) {
            if (this._observedPointer === null) {
                return false;
            }

            var i = 0, changedTouchCount = changedTouches.length;

            for (; i < changedTouchCount; i++) {
                if (changedTouches[i].identifier === this._observedPointer) {
                    return i;
                }
            }
            return false;
        }
    },

    // Surrender pointer

    surrenderPointer: {
        value: function (pointer, component) {
            var shouldSurrender = this.callDelegateMethod("surrenderPointer", pointer, component);
            if (typeof shouldSurrender !== "undefined" && shouldSurrender === false) {
                return false;
            }

            this._cancelPress();

            return true;
        }
    },

    _shouldPerformPress: {
        value: function () {
            return !(("enabled" in this.component && !this.component.enabled) || this._observedPointer !== null);
        }
    },

    // Handlers

    capturePointerdown: {
        value: function (event) {
            if (event.pointerType === "touch" || (window.MSPointerEvent && event.pointerType === window.MSPointerEvent.MSPOINTER_TYPE_TOUCH)) {
                this.captureTouchstart(event);

            } else if (event.pointerType === "mouse" || (window.MSPointerEvent && event.pointerType === window.MSPointerEvent.MSPOINTER_TYPE_MOUSE)) {
                this.captureMousedown(event);
            }
        }
    },

    handlePointerup: {
        value: function (event) {
            if (event.pointerType === "touch" || (window.MSPointerEvent && event.pointerType === window.MSPointerEvent.MSPOINTER_TYPE_TOUCH)) {
                this.handleTouchend(event);

            } else if (event.pointerType === "mouse" || (window.MSPointerEvent && event.pointerType === window.MSPointerEvent.MSPOINTER_TYPE_MOUSE)) {
                this.handleMouseup(event);
            }
        }
    },

    handlePointercancel: {
        value: function (event) {
            if (event.pointerType === "touch" || (window.MSPointerEvent && event.pointerType === window.MSPointerEvent.MSPOINTER_TYPE_TOUCH)) {
                this.handleTouchcancel(event);
            }
        }
    },

    captureTouchstart: {
        value: function (event) {
            if (this._shouldPerformPress()) {
                if (event.pointerId !== void 0) { // -> pointer events support.
                    this._observedPointer = event.pointerId;

                } else if (event.changedTouches && event.changedTouches.length === 1) {
                    this._observedPointer = event.changedTouches[0].identifier;
                }

                if (this._observedPointer !== null && this.component.eventManager.claimPointer(this._observedPointer, this)) {
                    this._shouldSaveInitialCenterPosition = true;
                    this._addEventListeners();
                    this._dispatchPressStart(event);

                } else {
                    this._observedPointer = null;
                }
            }
        }
    },

    handleTouchend: {
        value: function (event) {
            if (this._observedPointer === null) {
                this._endInteraction(event);
                return;
            }

            var target;

            if (event.pointerId === this._observedPointer)  {
                target = event.target;

            } else if (this._changedTouchisObserved(event.changedTouches) !== false) {
                var touch = event.changedTouches[0];
                target = document.elementFromPoint(touch.clientX, touch.clientY);
            }

            if (target && this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this)) {
                if (this.element === target || this.element.contains(target)) {
                    this._dispatchPress(event);

                } else {
                    this._dispatchPressCancel(event);
                }

                this._endInteraction(event);
            }
        }
    },

    // The PressComposer saves the initial center position after the first move or the first wheel event,
    // in order to wait for a possible css transform (translate, scale...) appeared on its element
    // after that the PressStart event has been raised.
    _saveInitialCenterPositionIfNeeded: {
        value: function () {
            if (this._shouldSaveInitialCenterPosition) {
                this._saveInitialCenterPosition();
                this._shouldSaveInitialCenterPosition = false;
            }
        }
    },

    _handleMove: {
        value: function (event) {
            if (this._observedPointer === null) {
                this._endInteraction(event);
                return;
            }

            if ((this._observedPointer === "mouse" || event.pointerId === this._observedPointer ||
                (event.changedTouches && this._changedTouchisObserved(event.changedTouches) !== false)) &&
                this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this)) {

                this._saveInitialCenterPositionIfNeeded();

                if (this._positionChanged) {
                    this._cancelPress(event);
                }
            }
        }
    },

    captureWheel: {
        value: function (event) {
            if (this._observedPointer === null) {
                this._endInteraction(event);
                return;
            }

            if ((event.target === this.element || event.target === window ||
                (typeof event.target.contains === "function" && event.target.contains(this.element)) || this.element.contains(event.target))) {

                this._saveInitialCenterPositionIfNeeded();

                if (this._positionChanged) {
                    this._cancelPress(event);
                }
            }
        }
    },

    handleTouchcancel: {
        value: function (event) {
            if (this._observedPointer === null || event.pointerId === this._observedPointer || this._changedTouchisObserved(event.changedTouches) !== false) {
                if (this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this)) {
                    this._dispatchPressCancel(event);
                }

                this._endInteraction(event);
            }
        }
    },

    captureMousedown: {
        value: function (event) {
            if (event.button === 0 && this._shouldPerformPress()) {
                this._observedPointer = "mouse";
                this.component.eventManager.claimPointer(this._observedPointer, this);

                if (this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this)) {
                    this._shouldSaveInitialCenterPosition = true;
                    this._addEventListeners();
                    this._dispatchPressStart(event);
                } else{
                    this._observedPointer = null;
                }
            }
        }
    },

    captureScroll: {
        value: function (event) {
            if (event.target === this.element || event.target === window ||
                (typeof event.target.contains === "function" && event.target.contains(this.element)) ||
                this.element.contains(event.target)) {

                this._cancelPress(event);
            }
        }
    },

    handleMouseup: {
        value: function (event) {
            if (this._observedPointer === null) {
                this._endInteraction(event);
                return;
            }

            if (this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this)) {
                var target = event.target;

                while (target !== this._element && target && target.parentNode) {
                    target = target.parentNode;
                }

                if (target === this._element) {
                    this._dispatchPress(event);
                    this._endInteraction(event);
                    return;
                }
            }

            this._cancelPress(event);
        }
    },

    handleDragstart: {
        value: function (event) {
            this._cancelPress(event);
        }
    },

    _saveInitialCenterPosition: {
        value: function () {
            var boundingClientRect = this.element.getBoundingClientRect();

            this._initialCenterPositionX = boundingClientRect.left + (boundingClientRect.width/2);
            this._initialCenterPositionY = boundingClientRect.top + (boundingClientRect.height/2);
        }
    },

    _positionChanged: {
        get: function () {
            var boundingClientRect = this.element.getBoundingClientRect(),
                newCenterPositionX = boundingClientRect.left + (boundingClientRect.width/2),
                newCenterPositionY = boundingClientRect.top + (boundingClientRect.height/2);

            return this._initialCenterPositionX !== newCenterPositionX || this._initialCenterPositionY !== newCenterPositionY;
        }
    },

    _addEventListeners: {
        value: function () {
            if (window.PointerEvent) {
                document.addEventListener("pointerup", this, false);
                document.addEventListener("pointermove", this, false);
                document.addEventListener("pointercancel", this, false);

            } else if (window.MSPointerEvent && window.navigator.msPointerEnabled) {
                document.addEventListener("MSPointerUp", this, false);
                document.addEventListener("MSPointerMove", this, false);
                document.addEventListener("MSPointerCancel", this, false);

            } else {
                if (this._observedPointer === "mouse") {
                    document.addEventListener("mouseup", this, false);
                    document.addEventListener("mousemove", this, false);

                    // Needed to cancel the press because once a drag is started
                    // no mouse events are fired
                    // http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#initiate-the-drag-and-drop-operation
                    this._element.addEventListener("dragstart", this, false);

                } else {
                    document.addEventListener("touchend", this, false);
                    document.addEventListener("touchcancel", this, false);
                    document.addEventListener("touchmove", this, false);
                }
            }

            var wheelEventName = typeof window.onwheel !== "undefined" || typeof window.WheelEvent !== "undefined" ?
                "wheel" : "mousewheel";

            document.addEventListener(wheelEventName, this, true);
            document.addEventListener("scroll", this, true);
        }
    },

    _removeEventListeners: {
        value: function () {
            if (window.PointerEvent) {
                document.removeEventListener("pointerup", this, false);
                document.removeEventListener("pointermove", this, false);
                document.removeEventListener("pointercancel", this, false);

            } else if (window.MSPointerEvent && window.navigator.msPointerEnabled) {
                document.removeEventListener("MSPointerUp", this, false);
                document.removeEventListener("MSPointerMove", this, false);
                document.removeEventListener("MSPointerCancel", this, false);

            } else {
                if (this._observedPointer === "mouse") {
                    document.removeEventListener("mouseup", this, false);
                    document.removeEventListener("mousemove", this, false);

                    // Needed to cancel the press because once a drag is started
                    // no mouse events are fired
                    // http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#initiate-the-drag-and-drop-operation
                    this._element.removeEventListener("dragstart", this, false);

                } else {
                    document.removeEventListener("touchend", this, false);
                    document.removeEventListener("touchcancel", this, false);
                    document.removeEventListener("touchmove", this, false);
                }
            }

            var wheelEventName = typeof window.onwheel !== "undefined" || typeof window.WheelEvent !== "undefined" ?
                "wheel" : "mousewheel";

            document.removeEventListener(wheelEventName, this, true);
            document.removeEventListener("scroll", this, true);
        }
    },

    // Event dispatch

    _createPressEvent: {
        enumerable: false,
        value: function (name, event) {
            var contactPoint = event,
                pressEvent, index;

            if (!event) {
                event = document.createEvent("CustomEvent");
                event.initCustomEvent(name, true, true, null);
            }

            pressEvent = new PressEvent();
            pressEvent.event = event;
            pressEvent.type = name;
            pressEvent.pointer = this._observedPointer;
            pressEvent.targetElement = event.target;

            if (event.changedTouches && (index = this._changedTouchisObserved(event.changedTouches)) !== false) {
                contactPoint = pressEvent.touch = event.changedTouches[index];
            }

            if (contactPoint) { // a PressCancel event can be dispatched programtically, so with no event.
                pressEvent.clientX = contactPoint.clientX;
                pressEvent.clientY = contactPoint.clientY;
                pressEvent.pageX = contactPoint.pageX;
                pressEvent.pageY = contactPoint.pageY;
            }

            return pressEvent;
        }
    },

    _dispatchPressStart: {
        enumerable: false,
        value: function (event) {
            this._state = PressComposer.PRESSED;
            this.dispatchEvent(this._createPressEvent("pressStart", event));

            if (this._shouldDispatchLongPress) {
                var self = this;

                this._longPressTimeout = setTimeout(function () {
                    self._dispatchLongPress();
                }, this._longPressThreshold);
            }
        }
    },

    _dispatchPress: {
        enumerable: false,
        value: function (event) {
            if (this._shouldDispatchLongPress) {
                clearTimeout(this._longPressTimeout);
                this._longPressTimeout = null;
            }

            this.dispatchEvent(this._createPressEvent("press", event));
            this._state = PressComposer.UNPRESSED;
        }
    },

    _dispatchLongPress: {
        enumerable: false,
        value: function (event) {
            if (this._shouldDispatchLongPress) {
                this.dispatchEvent(this._createPressEvent("longPress", event));
                this._longPressTimeout = null;
            }
        }
    },

    _dispatchPressCancel: {
        enumerable: false,
        value: function (event) {
            if (this._shouldDispatchLongPress) {
                clearTimeout(this._longPressTimeout);
                this._longPressTimeout = null;
            }

            this._state = PressComposer.CANCELLED;
            this.dispatchEvent(this._createPressEvent("pressCancel", event));
        }
    }

});

PressComposer.prototype.captureMSPointerDown = PressComposer.prototype.capturePointerdown;
PressComposer.prototype.handleMSPointerUp = PressComposer.prototype.handlePointerup;
PressComposer.prototype.handleMSPointerCancel = PressComposer.prototype.handlePointercancel;
PressComposer.prototype.handleMSPointerMove = PressComposer.prototype._handleMove;
PressComposer.prototype.handlePointermove = PressComposer.prototype._handleMove;
PressComposer.prototype.handleTouchmove = PressComposer.prototype._handleMove;
PressComposer.prototype.handleMousemove = PressComposer.prototype._handleMove;
PressComposer.prototype.handleMousewheel = PressComposer.prototype.handleWheel;

/*
 * @class PressEvent
 * @inherits MutableEvent
 * @classdesc The event dispatched by the `PressComposer`, providing access to
 * the raw DOM event and proxying its properties.
 */
var PressEvent = (function (){
    var value, eventProps, typeProps, eventPropDescriptor, typePropDescriptor, i;

    value = MutableEvent.specialize({
        type: {
            value: "press"
        },
        _event: {
            enumerable: false,
            value: null
        },
        event: {
            get: function () {
                return this._event;
            },
            set: function (value) {
                this._event = value;
            }
        },
        _touch: {
            enumerable: false,
            value: null
        },
        touch: {
            get: function () {
                return this._touch;
            },
            set: function (value) {
                this._touch = value;
            }
        }
    });

    // These properties are available directly on the event
    eventProps = ["altKey", "ctrlKey", "metaKey", "shiftKey",
    "cancelBubble", "currentTarget", "defaultPrevented",
    "eventPhase", "timeStamp", "preventDefault",
    "stopImmediatePropagation", "stopPropagation"];
    // These properties are available on the event in the case of mouse, and
    // on the _touch in the case of touch
    typeProps = ["clientX", "clientY", "pageX", "pageY", "screenX", "screenY", "target"];

    eventPropDescriptor = function (prop) {
        return {
            get: function () {
                return this._event[prop];
            }
        };
    };
    typePropDescriptor = function (prop) {
        return {
            get: function () {
                return (this._touch) ? this._touch[prop] : this._event[prop];
            }
        };
    };

    for (i = eventProps.length - 1; i >= 0; i--) {
        Montage.defineProperty(value, eventProps[i], eventPropDescriptor(eventProps[i]));
    }
    for (i = typeProps.length - 1; i >= 0; i--) {
        Montage.defineProperty(value, typeProps[i], typePropDescriptor(typeProps[i]));
    }

    return value;
}());

}})
;
//*/
montageDefine("e396087","ui/text-input",{dependencies:["ui/native-control"],factory:function(require,exports,module){/**
    @module montage/ui/text-input
*/
var NativeControl = require("ui/native-control").NativeControl;

/**
    The base class for all text-based input components. You typically won't create instances of this prototype.
    @class module:montage/ui/text-input.TextInput
    @extends module:montage/ui/native-control.NativeControl
    @see {module:"montage/ui/input-date.reel".DateInput}
    @see module:"montage/ui/input-text.reel".InputText
    @see module:"montage/ui/input-number.reel".InputNumber
    @see module:"montage/ui/input-range.reel".RangeInput
    @see module:"montage/ui/textarea.reel".TextArea

*/
var TextInput = exports.TextInput =  NativeControl.specialize(/** @lends module:montage/ui/text-input.TextInput# */ {

    _hasFocus: {
        enumerable: false,
        value: false
    },

    _value: {
        enumerable: false,
        value: null
    },

    _valueSyncedWithInputField: {
        enumerable: false,
        value: false
    },

    /**
        The "typed" data value associated with the input element. When this
        property is set, if the component's <code>converter</code> property is
        non-null then its <code>revert()</code> method is invoked, passing it
        the newly assigned value. The <code>revert()</code> function is
        responsible for validating and converting the user-supplied value to
        its typed format. For example, in the case of a DateInput component
        (which extends TextInput) a user enters a string for the date (for
        example, "10-12-2005"). A <code>DateConverter</code> object is assigned
        to the component's <code>converter</code> property.

        If the comopnent doesn't specify a converter object then the raw value
        is assigned to <code>value</code>.

        @type {string}
        @default null
    */
    value: {
        get: function() {
            return this._value;
        },
        set: function(value, fromInput) {

            if(value !== this._value) {
                if(this.converter) {
                    var convertedValue;
                    try {
                        convertedValue = this.converter.revert(value);
                        this.error = null;
                        this._value = convertedValue;
                    } catch(e) {
                        // unable to convert - maybe error
                        this._value = value;
                        this.error = e;
                    }
                } else {
                    this._value = value;
                }

                if (fromInput) {
                    this._valueSyncedWithInputField = true;
                } else {
                    this._valueSyncedWithInputField = false;
                    this.needsDraw = true;
                }
            }
        }
    },

    // set value from user input
    /**
      @private
    */
    _setValue: {
        value: function() {
            var newValue = this.element.value;
            Object.getPropertyDescriptor(this, "value").set.call(this, newValue, true);
        }
    },

/**
    A reference to a Converter object whose <code>revert()</code> function is invoked when a new value is assigned to the TextInput object's <code>value</code> property. The revert() function attempts to transform the newly assigned value into a "typed" data property. For instance, a DateInput component could assign a DateConverter object to this property to convert a user-supplied date string into a standard date format.
    @type {Converter}
    @default null
    @see {@link module:montage/core/converter.Converter}
*/
    converter:{
        value: null
    },

    _error: {
        value: null
    },

/**
    If an error is thrown by the converter object during a new value assignment, this property is set to <code>true</code>, and schedules a new draw cycle so the the UI can be updated to indicate the error state. the <code>montage--invalidText</code> CSS class is assigned to the component's DOM element during the next draw cycle.
    @type {boolean}
    @default false
*/
    error: {
        get: function() {
            return this._error;
        },
        set: function(v) {
            this._error = v;
            this.errorMessage = this._error ? this._error.message : null;
            this.needsDraw = true;
        }
    },

    _errorMessage: {value: null},

/**
    The message to display when the component is in an error state.
    @type {string}
    @default null
*/
    errorMessage: {
        get: function() {
            return this._errorMessage;
        },
        set: function(v) {
            this._errorMessage = v;
        }
    },

    _updateOnInput: {
        value: true
    },

/**
    When this property and the converter's <code>allowPartialConversion</code> are both true, as the user enters text in the input element each new character is added to the component's <code>value</code> property, which triggers the conversion. Depending on the type of input element being used, this behavior may not be desirable. For instance, you likely would not want to convert a date string as a user is entering it, only when they've completed their input.
    Specifies whether
    @type {boolean}
    @default true
*/
    updateOnInput: {
        get: function() {
            return !!this._updateOnInput;
        },
        set: function(v) {
            this._updateOnInput = v;
        }
    },

    // HTMLInputElement methods

    blur: { value: function() { this._element.blur(); } },
    focus: { value: function() { this._element.focus(); } },
    // select() defined where it's allowed
    // click() deliberately omitted, use focus() instead

    // Callbacks

    enterDocument: {
        value: function(firstTime) {
            if (firstTime) {
                var el = this.element;
                el.addEventListener("focus", this);
                el.addEventListener('input', this);
                el.addEventListener('change', this);
                el.addEventListener('blur', this);
            }
        }
    },

    _setElementValue: {
        value: function(value) {
            this.element.value = (value == null ? '' : value);
        }
    },

    draw: {
        enumerable: false,
        value: function() {
            this.super();

            var el = this.element;

            if (!this._valueSyncedWithInputField) {
                this._setElementValue(this.converter ? this.converter.convert(this._value) : this._value);
            }

            if (this.error) {
                el.classList.add('montage--invalidText');
                el.title = this.error.message || '';
            } else {
                el.classList.remove("montage--invalidText");
                el.title = '';
            }
        }
    },

    didDraw: {
        enumerable: false,
        value: function() {
            if (this._hasFocus && this._value != null) {
                var length = this._value.toString().length;
                this.element.setSelectionRange(length, length);
            }
            // The value might have been changed during the draw if bindings
            // were reified, and another draw will be needed.
            if (!this.needsDraw) {
                this._valueSyncedWithInputField = true;
            }
        }
    },


    // Event handlers

    handleInput: {
        enumerable: false,
        value: function() {
            if (this.converter) {
                if (this.converter.allowPartialConversion === true && this.updateOnInput === true) {
                    this._setValue();
                }
            } else {
                this._setValue();
            }
        }
    },
/**
    Description TODO
    @function
    @param {Event Handler} event TODO
    */
    handleChange: {
        enumerable: false,
        value: function(event) {
            this._setValue();
            this._hasFocus = false;
        }
    },
/**
    Description TODO
    @function
    @param {Event Handler} event TODO
    */
    handleBlur: {
        enumerable: false,
        value: function(event) {
            this._hasFocus = false;
        }
    },
/**
    Description TODO
    @function
    @param {Event Handler} event TODO
    */
    handleFocus: {
        enumerable: false,
        value: function(event) {
            this._hasFocus = true;
        }
    }

});

// Standard <input> tag attributes - http://www.w3.org/TR/html5/the-input-element.html#the-input-element

TextInput.addAttributes({
    accept: null,
    alt: null,
    autocomplete: null,
    autofocus: {dataType: "boolean"},
    checked: {dataType: "boolean"},
    dirname: null,
    disabled: {dataType: 'boolean'},
    form: null,
    formaction: null,
    formenctype: null,
    formmethod: null,
    formnovalidate: {dataType: 'boolean'},
    formtarget: null,
    height: null,
    list: null,
    maxlength: null,
    multiple: {dataType: 'boolean'},
    name: null,
    pattern: null,
    placeholder: null,
    readonly: {dataType: 'boolean'},
    required: {dataType: 'boolean'},
    size: null,
    src: null,
    width: null
    // "type" is not bindable and "value" is handled as a special attribute
});

}})
;
//*/
montageDefine("af1b182","ui/base/abstract-radio-button",{dependencies:["./abstract-control","../../composer/press-composer","../../composer/key-composer"],factory:function(require,exports,module){/*global require, exports, document, Error*/
var AbstractControl = require("./abstract-control").AbstractControl,
    PressComposer = require("../../composer/press-composer").PressComposer,
    KeyComposer = require("../../composer/key-composer").KeyComposer;

var CLASS_PREFIX = "montage-RadioButton";

/**
 * @class AbstractRadioButton
 * @classdesc Provides common implementation details for radio buttons.
 * @extends AbstractControl
 */
var AbstractRadioButton = exports.AbstractRadioButton = AbstractControl.specialize(
    /** @lends AbstractRadioButton# */
{

    /**
     * Dispatched when the radio button is activated through a mouse click,
     * finger tap, or when focused and the spacebar is pressed.
     * @event action
     * @memberof AbstractRadioButton
     * @param {Event} event
     */

    constructor: {
        value: function AbstractRadioButton() {
            if(this.constructor === AbstractRadioButton) {
                throw new Error("AbstractRadioButton cannot be instantiated.");
            }
            AbstractControl.constructor.call(this); // super
            this._pressComposer = new PressComposer();
            this.addComposer(this._pressComposer);

            this._keyComposer = new KeyComposer();
            this._keyComposer.component = this;
            this._keyComposer.keys = "space";
            this.addComposer(this._keyComposer);

            this.defineBindings({
                // classList management
                "classList.has('montage--disabled')": {
                    "<-": "!enabled"
                },
                "classList.has('montage--active')": {
                    "<-": "active"
                },
                "classList.has('montage-RadioButton--checked')": {
                    "<-": "checked"
                }
            });
        }
    },

    /**
     * Whether the user is pressing the radio button.
     * @type {boolean}
     */
    active: {
        value: false
    },

    _checked: {
        value: null
    },

    /**
     * Whether this radio button is checked.
     * @type {boolean}
     */
    checked: {
        set: function (value) {
            this._checked = value;
        },
        get: function () {
            return this._checked;
        }
    },

    /**
     * Whether this radio button is enabled.
     * @type {boolean}
     */
    enabled: {
        value: true
    },

    _keyComposer: {
        value: null
    },

    _radioButtonController: {
        value: null
    },

    /**
     * The radio button controller that ensures that only one radio button in
     * its `content` is `checked` at any time.
     * @type {RadioButtonController}
     */
    radioButtonController: {
        set: function (value) {
            if (this._radioButtonController) {
                this._radioButtonController.unregisterRadioButton(this);
            }
            this._radioButtonController = value;
            value.registerRadioButton(this);
        },
        get: function () {
            return this._radioButtonController;
        }
    },

    _pressComposer: {
        value: null
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.element.setAttribute("role", "radio");
                this._keyComposer.addEventListener("keyPress", this, false);
                this._keyComposer.addEventListener("keyRelease", this, false);
            }
        }
    },

    draw: {
        value: function () {
            if (this.checked) {
                this.element.setAttribute("aria-checked", "true");
            } else {
                this.element.setAttribute("aria-checked", "false");
            }
        }
    },

    handlePressStart: {
        value: function (event) {
            this.active = true;

            if (event.touch) {
                // Prevent default on touchmove so that if we are inside a scroller,
                // it scrolls and not the webpage
                document.addEventListener("touchmove", this, false);
            }
        }
    },

    check: {
        value: function () {
            if (!this.enabled || this.checked) {
                return;
            }

            this.dispatchActionEvent();
            this.checked = true;
        }
    },

    /**
     Handle press event from press composer
     */
    handlePress: {
        value: function (/* event */) {
            this.active = false;
            this.check();
        }
    },

    /**
     Called when all interaction is over.
     @private
     */
    handlePressCancel: {
        value: function (/* event */) {
            this.active = false;
            document.removeEventListener("touchmove", this, false);
        }
    },

    handleKeyPress: {
        value: function () {
            this.active = true;
        }
    },

    handleKeyRelease: {
        value: function () {
            this.active = false;
            this.check();
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this._pressComposer.addEventListener("pressStart", this, false);
            this._pressComposer.addEventListener("press", this, false);
            this._pressComposer.addEventListener("pressCancel", this, false);
        }
    },

    activate: {
        value: function () {
            this.check();
        }
    }
});

}})
;
//*/
montageDefine("59d9e99","ui/todo-view.reel/todo-view",{dependencies:["montage/ui/component"],factory:function(require,exports,module){var Component = require('montage/ui/component').Component;

exports.TodoView = Component.specialize({

    todo: {
        value: null
    },

    editInput: {
        value: null
    },

    constructor: {
        value: function TodoView() {
            this.defineBinding('isCompleted', {
                '<-': 'todo.completed'
            });
        }
    },

    enterDocument: {
        value: function () {
            this.element.addEventListener('dblclick', this, false);
            this.element.addEventListener('blur', this, true);
            this.element.addEventListener('submit', this, false);
        }
    },

    exitDocument: {
        value: function () {
            this.element.removeEventListener('dblclick', this, false);
            this.element.removeEventListener('blur', this, true);
            this.element.removeEventListener('submit', this, false);
        }
    },

    captureDestroyButtonAction: {
        value: function () {
            this.dispatchDestroy();
        }
    },

    dispatchDestroy: {
        value: function () {
            this.dispatchEventNamed('destroyTodo', true, true, {todo: this.todo});
        }
    },

    handleDblclick: {
        value: function () {
            this.isEditing = true;
        }
    },

    _isEditing: {
        value: false
    },

    isEditing: {
        get: function () {
            return this._isEditing;
        },
        set: function (value) {
            if (value === this._isEditing) {
                return;
            }

            if (value) {
                this.classList.add('editing');
            } else {
                this.classList.remove('editing');
            }

            this._isEditing = value;
            this.needsDraw = true;
        }
    },

    _isCompleted: {
        value: false
    },

    isCompleted: {
        get: function () {
            return this._isCompleted;
        },
        set: function (value) {
            if (value === this._isCompleted) {
                return;
            }

            if (value) {
                this.classList.add('completed');
            } else {
                this.classList.remove('completed');
            }

            this._isCompleted = value;
            this.needsDraw = true;
        }
    },

    captureBlur: {
        value: function (evt) {
            if (this.isEditing && this.editInput.element === evt.target) {
                this._submitTitle();
            }
        }
    },

    handleSubmit: {
        value: function (evt) {
            if (this.isEditing) {
                evt.preventDefault();
                this._submitTitle();
            }
        }
    },

    _submitTitle: {
        value: function () {

            var title = this.editInput.value.trim();

            if ('' === title) {
                this.dispatchDestroy();
            } else {
                this.todo.title = title;
            }

            this.isEditing = false;
        }
    },

    draw: {
        value: function () {
            if (this.isEditing) {
                this.editInput.element.focus();
            } else {
                this.editInput.element.blur();
            }
        }
    }

});

}})
;
//*/
montageDefine("af1b182","ui/text.reel/text",{dependencies:["../component"],factory:function(require,exports,module){/**
 * @module "montage/ui/text.reel"
 */
var Component = require("../component").Component;

/**
 * A Text component shows plain text. Any text can be safely displayed without
 * escaping, but the browser will treat all sequences of white space as a
 * single space.
 *
 * The text component replaces the inner DOM of its element with a TextNode and
 * it renders the [value]{@link Text#value} string in it.
 *
 * @class Text
 * @classdesc A component that displays a string of plain text.
 * @extends Component
 */
exports.Text = Component.specialize( /** @lends Text.prototype # */ {
    /**
     * @constructs Text
     */
    constructor: {
        value: function Text() {
            this.super();
        }
    },

    hasTemplate: {
        value: false
    },

    _value: {
        value: null
    },

    /**
     * The string to be displayed. `null` is equivalent to the empty string.
     * @type {string}
     * @default null
     */
    value: {
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (this._value !== value) {
                this._value = value;
                this.needsDraw = true;
            }
        }
    },

    /**
     * An optional converter for transforming the `value` into the
     * corresponding rendered text.
     * Converters are called at time of draw.
     * @type {?Converter}
     * @default null
    */
    converter: {
        value: null
    },

    /**
     * The default string value assigned to the Text instance.
     * @type {string}
     * @default "" empty string
     */
    defaultValue: {
        value: ""
    },

    _valueNode: {
        value: null
    },

    _RANGE: {
        value: document.createRange()
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                var range = this._RANGE;
                range.selectNodeContents(this.element);
                range.deleteContents();
                this._valueNode = document.createTextNode("");
                range.insertNode(this._valueNode);
                this.element.classList.add("montage-Text");
            }
        }
    },

    draw: {
        value: function () {
            // get correct value
            var value = this._value, displayValue = (value || 0 === value ) ? value : this.defaultValue;

            if (this.converter) {
                displayValue = this.converter.convert(displayValue);
            }

            //push to DOM
            this._valueNode.data = displayValue;
        }
    }

});


}})
;
//*/
montageDefine("af1b182","ui/base/abstract-control",{dependencies:["../component","collections/dict"],factory:function(require,exports,module){/*global require, exports, document, Error*/

/**
 * @module montage/ui/base/abstract-control
 * @requires montage/ui/component
 * @requires collections/dict
 */
var Component = require("../component").Component,
    Dict = require("collections/dict");

/**
 * @class AbstractControl
 * @classdesc A basis for common behavior of control components.
 * @extends Component
 */
exports.AbstractControl = Component.specialize( /** @lends AbstractControl.prototype # */ {

    /**
     * Dispatched when the button is activated through a mouse click, finger
     * tap, or when focused and the spacebar is pressed.
     *
     * @event AbstractControl#action
     * @type {Event}
     * @property {Dict} detail - pass custom data in this property
     */

    /**
     * @function
     * @fires AbstractControl#action
     */
    dispatchActionEvent: {
        value: function () {
            return this.dispatchEvent(this.createActionEvent());
        }
    },

    /**
     * @private
     * @property {Dict} value
     * @default null
     */
    _detail: {
        value: null
    },

    /**
     * The data property of the action event.
     *
     * Example to toggle the complete class: `"detail.get('selectedItem')" : {
     * "<-" : "@repetition:iteration.object"}`
     *
     * @returns {Dict}
     */
    detail: {
        get: function () {
            if (this._detail == null) {
                this._detail = new Dict();
            }
            return this._detail;
        }
    },

    /**
     * Overrides {@link Component#createActionEvent}
     * by adding {@link AbstractControl#detail} custom data
     *
     * @function
     * @returns {AbstractControl#action}
     */
    createActionEvent: {
        value: function () {
            var actionEvent = document.createEvent("CustomEvent"),
                eventDetail;

            eventDetail = this._detail;
            actionEvent.initCustomEvent("action", true, true, eventDetail);
            return actionEvent;
        }
    }
});

}})
;
//*/
montageDefine("e396087","ui/input-text.reel/input-text",{dependencies:["ui/text-input"],factory:function(require,exports,module){/**
    @module "montage/ui/native/input-text.reel"
*/
var TextInput = require("ui/text-input").TextInput;
/**
 * Wraps the a &lt;input type="text"> element with binding support for the element's standard attributes.
   @class module:"montage/ui/native/input-text.reel".InputText
   @extends module:montage/ui/text-input.TextInput

 */
exports.InputText = TextInput.specialize({

    select: {
        value: function() {
            this._element.select();
        }
    }

});


}})
;
//*/
montageDefine("59d9e99","core/todo",{dependencies:["montage"],factory:function(require,exports,module){var Montage = require('montage').Montage;

exports.Todo = Montage.specialize({

    constructor: {
        value: function Todo() {
            this.super();
        }
    },

    initWithTitle: {
        value: function (title) {
            this.title = title;
            return this;
        }
    },

    title: {
        value: null
    },

    completed: {
        value: false
    }

});

}})
bundleLoaded("index.html.bundle-1-1.js")