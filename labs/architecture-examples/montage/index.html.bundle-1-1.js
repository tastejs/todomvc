montageDefine("5bf8252","ui/button.reel/button",{dependencies:["ui/native-control","montage/composer/press-composer","montage/collections/dict"],factory:function(require,exports,module){ /*global require, exports*/

/**
    @module "montage/ui/native/button.reel"
*/
var NativeControl = require("ui/native-control").NativeControl,
    PressComposer = require("montage/composer/press-composer").PressComposer,
    Dict = require("montage/collections/dict");

// TODO migrate away from using undefinedGet and undefinedSet

/**
    Wraps a native <code>&lt;button></code> or <code>&lt;input[type="button"]></code> HTML element. The element's standard attributes are exposed as bindable properties.
    @class module:"montage/ui/native/button.reel".Button
    @extends module:montage/ui/native-control.NativeControl
    @fires action
    @fires hold
    @example
<caption>JavaScript example</caption>
var b1 = new Button();
b1.element = document.querySelector("btnElement");
b1.addEventListener("action", function(event) {
    console.log("Got event 'action' event");
});
    @example
<caption>Serialized example</caption>
{
    "aButton": {
        "prototype": "montage/ui/native/button.reel",
        "properties": {
            "element": {"#": "btnElement"}
        },
        "listeners": [
            {
                "type": "action",
                "listener": {"@": "appListener"}
            }
        ]
    },
    "listener": {
        "prototype": "appListener"
    }
}
&lt;button data-montage-id="btnElement"></button>
*/
var Button = exports.Button = NativeControl.specialize(/** @lends module:"montage/ui/native/button.reel".Button# */ {

    /**
        Dispatched when the button is activated through a mouse click, finger tap,
        or when focused and the spacebar is pressed.

        @event action
        @memberof module:"montage/ui/native/button.reel".Button
        @param {Event} event
    */

    /**
        Dispatched when the button is pressed for a period of time, set by
        {@link holdThreshold}.

        @event hold
        @memberof module:"montage/ui/native/button.reel".Button
        @param {Event} event
    */

    _preventFocus: {
        enumerable: false,
        value: false
    },

/**
    Specifies whether the button should receive focus or not.
    @type {boolean}
    @default false
    @event longpress
*/
    preventFocus: {
        get: function () {
            return this._preventFocus;
        },
        set: function (value) {
            if (value === true) {
                this._preventFocus = true;
            } else {
                this._preventFocus = false;
            }
        }
    },


/**
    Enables or disables the Button from user input. When this property is set to <code>false</code>, the "disabled" CSS style is applied to the button's DOM element during the next draw cycle. When set to <code>true</code> the "disabled" CSS class is removed from the element's class list.
*/
    //TODO we should prefer positive properties like enabled vs disabled, get rid of disabled
    enabled: {
        dependencies: ["disabled"],
        get: function () {
            return !this._disabled;
        },
        set: function (value) {
            this.disabled = !value;
        }
    },

    /**
        A Montage converter object used to convert or format the label displayed by the Button instance. When a new value is assigned to <code>label</code>, the converter object's <code>convert()</code> method is invoked, passing it the newly assigned label value.
        @type {Property}
        @default null
    */
    converter: {
        value: null
    },

    /**
      Stores the node that contains this button's value. Only used for
      non-`<input>` elements.
      @private
    */
    _labelNode: {value:undefined, enumerable: false},

    _label: { value: undefined, enumerable: false },

    /**
        The displayed text on the button. In an &lt;input> element this is taken from the element's <code>value</code> attribute. On any other element (including &lt;button>) this is the first child node which is a text node. If one isn't found then it will be created.

        If the button has a non-null <code>converter</code> property, the converter object's <code>convert()</code> method is called on the value before being assigned to the button instance.

        @type {string}
        @default undefined
    */
    label: {
        get: function() {
            return this._label;
        },
        set: function(value) {
            if (value && value.length > 0 && this.converter) {
                try {
                    value = this.converter.convert(value);
                    if (this.error) {
                        this.error = null;
                    }
                } catch(e) {
                    // unable to convert - maybe error
                    this.error = e;
                }
            }

            this._label = value;
            if (this._isInputElement) {
                this._value = value;
            }

            this.needsDraw = true;
        }
    },

    setLabelInitialValue: {
        value: function(value) {
            if (this._label === undefined) {
                    this._label = value;
                }
        }
    },

    /**
        The amount of time in milliseconds the user must press and hold the button a <code>hold</code> event is dispatched. The default is 1 second.
        @type {number}
        @default 1000
    */
    holdThreshold: {
        get: function() {
            return this._pressComposer.longPressThreshold;
        },
        set: function(value) {
            this._pressComposer.longPressThreshold = value;
        }
    },

    _pressComposer: {
        enumberable: false,
        value: null
    },

    _active: {
        enumerable: false,
        value: false
    },

    /**
        This property is true when the button is being interacted with, either through mouse click or touch event, otherwise false.
        @type {boolean}
        @default false
    */
    active: {
        get: function() {
            return this._active;
        },
        set: function(value) {
            this._active = value;
            this.needsDraw = true;
        }
    },

    // HTMLInputElement/HTMLButtonElement methods

    blur: { value: function() { this._element.blur(); } },
    focus: { value: function() { this._element.focus(); } },
    // click() deliberately omitted (it isn't available on <button> anyways)

    constructor: {
        value: function NativeButton () {
            this.super();
            this._pressComposer = new PressComposer();
            this._pressComposer.longPressThreshold = this.holdThreshold;
            this.addComposer(this._pressComposer);
        }
    },

    prepareForActivationEvents: {
        value: function() {
            this._pressComposer.addEventListener("pressStart", this, false);
            this._pressComposer.addEventListener("press", this, false);
            this._pressComposer.addEventListener("pressCancel", this, false);
        }
    },

    // Optimisation
    addEventListener: {
        value: function(type, listener, useCapture) {
            this.super(type, listener, useCapture);
            if (type === "hold") {
                this._pressComposer.addEventListener("longPress", this, false);
            }
        }
    },

    // Handlers

    /**
    Called when the user starts interacting with the component.
    */
    handlePressStart: {
        value: function(event) {
            this.active = true;

            if (event.touch) {
                // Prevent default on touchmove so that if we are inside a scroller,
                // it scrolls and not the webpage
                document.addEventListener("touchmove", this, false);
            }

            if (!this._preventFocus) {
                this._element.focus();
            }
        }
    },

    /**
    Called when the user has interacted with the button.
    */
    handlePress: {
        value: function(event) {
            this.active = false;
            this._dispatchActionEvent();
            document.removeEventListener("touchmove", this, false);
        }
    },

    handleKeyup: {
        value: function(event) {
            // action event on spacebar
            if (event.keyCode === 32) {
                this.active = false;
                this._dispatchActionEvent();
            }
        }
    },

    handleLongPress: {
        value: function(event) {
            // When we fire the "hold" event we don't want to fire the
            // "action" event as well.
            this._pressComposer.cancelPress();

            var holdEvent = document.createEvent("CustomEvent");
            holdEvent.initCustomEvent("hold", true, true, null);
            this.dispatchEvent(holdEvent);
        }
    },

    /**
    Called when all interaction is over.
    @private
    */
    handlePressCancel: {
        value: function(event) {
            this.active = false;
            document.removeEventListener("touchmove", this, false);
        }
    },

    handleTouchmove: {
        value: function(event) {
            event.preventDefault();
        }
    },

    /**
    If this is an input element then the label is handled differently.
    @private
    */
    _isInputElement: {
        value: false,
        enumerable: false
    },

    enterDocument: {
        value: function(firstDraw) {
            if (NativeControl.enterDocument) {
                NativeControl.enterDocument.apply(this, arguments);
            }
            
            if(firstDraw) {
                this._isInputElement = (this.originalElement.tagName === "INPUT");
                // Only take the value from the element if it hasn't been set
                // elsewhere (i.e. in the serialization)
                if (this._isInputElement) {
                    // NOTE: This might not be the best way to do this
                    // With an input element value and label are one and the same
                    Object.defineProperty(this, "value", {
                        get: function() {
                            return this._label;
                        },
                        set: function(value) {
                            this.label = value;
                        }
                    });

                    if (this._label === undefined) {
                        this._label = this.originalElement.value;
                    }
                } else {
                    if (!this.originalElement.firstChild) {
                        this.originalElement.appendChild(document.createTextNode(""));
                    }
                    this._labelNode = this.originalElement.firstChild;
                    this.setLabelInitialValue(this._labelNode.data)
                    if (this._label === undefined) {
                        this._label = this._labelNode.data;
                    }
                }

                //this.classList.add("montage-Button");
                this.element.setAttribute("role", "button");
                this.element.addEventListener("keyup", this, false);
            }
        }
    },

    /**
    Draws the label to the DOM.
    @function
    @private
    */
    _drawLabel: {
        enumerable: false,
        value: function(value) {
            if (this._isInputElement) {
                this._element.setAttribute("value", value);
            } else {
                this._labelNode.data = value;
            }
        }
    },

    draw: {
        value: function() {
            this.super();

            if (this._disabled) {
                this._element.classList.add("disabled");
            } else {
                this._element.classList.remove("disabled");
            }

            if (this._active) {
                this._element.classList.add("active");
            } else {
                this._element.classList.remove("active");
            }

            this._drawLabel(this.label);
        }
    },

    _detail: {
        value: null
    },

    /**
        The data property of the action event.
        example to toggle the complete class: "detail.selectedItem" : { "<-" : "@repetition.objectAtCurrentIteration"}
        @type {Property}
        @default null
    */
    detail: {
        get: function() {
            if (this._detail === null) {
                this._detail = new Dict();
            }
            return this._detail;
        }
    },

    createActionEvent: {
        value: function() {
            var actionEvent = document.createEvent("CustomEvent"),
                eventDetail;

            eventDetail = this._detail;
            actionEvent.initCustomEvent("action", true, true, eventDetail);
            return actionEvent;
        }
    }
});

Button.addAttributes( /** @lends module:"montage/ui/native/button.reel".Button# */{

/**
    Specifies whether the button should be focused as soon as the page is loaded.
    @type {boolean}
    @default false
*/
    autofocus: {value: false, dataType: 'boolean'},

/**
    When true, the button is disabled to user input and "disabled" is added to its CSS class list.
    @type {boolean}
    @default false
*/
    disabled: {value: false, dataType: 'boolean'},

/**
    The value of the id attribute of the form with which to associate the component's element.
    @type {string}
    @default null
*/
    form: null,

/**
    The URL to which the form data will be sumbitted.
    @type {string}
    @default null
*/
    formaction: null,

/**
    The content type used to submit the form to the server.
    @type {string}
    @default null
*/
    formenctype: null,

/**
    The HTTP method used to submit the form.
    @type {string}
    @default null
*/
    formmethod: null,

/**
    Indicates if the form should be validated upon submission.
    @type {boolean}
    @default null
*/
    formnovalidate: {dataType: 'boolean'},

/**
    The target frame or window in which the form output should be rendered.
    @type string}
    @default null
*/
    formtarget: null,

/**
    A string indicating the input type of the component's element.
    @type {string}
    @default "button"
*/
    type: {value: 'button'},

/**
    The name associated with the component's DOM element.
    @type {string}
    @default null
*/
    name: null,

/**
    <strong>Use <code>label</code> to set the displayed text on the button</strong>
    The value associated with the element. This sets the value attribute of
    the button that gets sent when the form is submitted.
    @type {string}
    @default null
    @see label
*/
    value: null

});

}})
;
//*/
montageDefine("5bf8252","ui/text-input",{dependencies:["ui/native-control"],factory:function(require,exports,module){/**
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
montageDefine("6364dae","composer/composer",{dependencies:["montage","core/target"],factory:function(require,exports,module){/**
 * @module montage/composer/composer
 * @requires montage/core/core
 */
var Montage = require("montage").Montage,
    Target = require("core/target").Target;
/**
 * @class Composer
 * @extends Target
 * @summary The Composer prototype is the base class for all composers in Montage. There are two types of composers. One type, called _gesture_ composers listen for and aggregrate low-level events into higher order events (for example, [PressComposer]{@link PressComposer}. The second type of composer is called _calculation_ composers
 */
exports.Composer = Target.specialize( /** @lends Composer# */ {

    _component: {
        value: null
    },

/**
    The Montage component that the composer will listen for mouse events on.
    @type {Component}
    @default null
*/
    component: {
        get: function() {
            return this._component;
        },
        set: function(component) {
            this._component = component;
        }
    },

    _element: {
        value: null
    },

/**
    The DOM element that the composer will listen for events on. If no element is specified then the composer will use the element associated with its <code>component</code> property.
    @type {Component}
    @default null
*/
    element: {
        get: function() {
            return this._element;
        },
        set: function(element) {
            this._element = element;
        }
    },


    /**
     * This property controls when a composer's <code>load()</code> method is called, which is where the composer create event listeners. If `false`
     * the composer's <code>load()</code> method is called immediately as part of the next draw
     * cycle after <code>addComposer()</code> has been called on its associated component.  If
     * `true`, the loading of the composer is delayed until its associated component
     * has had its <code>prepareForActivationEvents()</code> called. Delaying the creation of event listeners until necessary can improve performance.
     * @default false
     */
    lazyLoad: {
        value: false
    },

    _needsFrame: {
        value: false
    },

    /**
        This property should be set to 'true' when the composer wants to have its <code>frame()</code> method executed during the next draw cycle.Setting this property to 'true' will cause Montage to schedule a new draw cycle if one has not already been.
        @type {boolean}
        @default false
     */
    needsFrame: {
        set: function(value) {
            if (this._needsFrame !== value) {
                this._needsFrame = value;
                if (this._component) {
                    if (value) {
                        this._component.scheduleComposer(this);
                    }
                }
            }
        },
        get: function() {
            return this._needsFrame;
        }
    },

    /**
        This method will be invoked by the framework at the beginning of a draw cycle. This is where a composer implement its update logic.
        @function
        @param {Date} timestamp The time that the draw cycle started
     */
    frame: {
        value: function(timestamp) {

        }
    },


    /*
        Invoked by the framework to default the composer's element to the component's element if necessary.
        @private
     */
    _resolveDefaults: {
        value: function() {
            if (this.element == null && this.component != null) {
                this.element = this.component.element;
            }
        }
    },

    /*
        Invoked by the framework to load this composer
        @private
     */
    _load: {
        value: function() {
            if (!this.element) {
                this._resolveDefaults();
            }
            this.load();
        }
    },

    /**
        Called when a composer should be loaded.  Any event listeners that the composer needs to install should
        be installed in this method.
        @function
     */
    load: {
        value: function() {

        }
    },

    /**
        Called when a component removes a composer.  Any event listeners that the composer needs to remove should
        be removed in this method and any additional cleanup should be performed.
        @function
     */
    unload: {
        value: function() {

        }
    },

    /*
        Called when a composer is part of a template serialization.  It's responsible for calling addComposer on
        the component.
        @private
     */
    deserializedFromTemplate: {
        value: function() {
            if (this.component) {
                this.component.addComposer(this);
            }
        }
    }

});

}})
;
//*/
montageDefine("37bb2cd","ui/todo-view.reel/todo-view",{dependencies:["montage/ui/component"],factory:function(require,exports,module){var Component = require('montage/ui/component').Component;

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
        value: function (firstTime) {
            if (firstTime) {
                this.element.addEventListener('dblclick', this, false);
                this.element.addEventListener('blur', this, true);
                this.element.addEventListener('submit', this, false);
            }
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
montageDefine("6364dae","ui/text.reel/text",{dependencies:["montage","ui/component"],factory:function(require,exports,module){/**
    @module montage/ui/text.reel
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("ui/component").Component;

/**
 @class Text
 @extends Component
 */
exports.Text = Component.specialize( /** @lends Text# */ {

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
        Description TODO
        @type {Property}
        @default null
    */
    value: {
        get: function() {
            return this._value;
        },
        set: function(value) {
            if (this._value !== value) {
                this._value = value;
                this.needsDraw = true;
            }
        }
    },

    /**
        The Montage converted used to convert or format values displayed by this Text instance.
        @type {Property}
        @default null
    */
    converter: {
        value: null
    },

    /**
        The default string value assigned to the Text instance.
        @type {Property}
        @default {String} ""
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
        value: function(firstTime) {
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
        value: function() {
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
montageDefine("5bf8252","ui/input-text.reel/input-text",{dependencies:["ui/text-input"],factory:function(require,exports,module){/**
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
montageDefine("37bb2cd","core/todo",{dependencies:["montage"],factory:function(require,exports,module){var Montage = require('montage').Montage;

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