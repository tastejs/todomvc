montageDefine("e396087","ui/button.reel/button",{dependencies:["ui/native-control","montage/composer/press-composer","montage/collections/dict"],factory:function(require,exports,module){ /*global require, exports*/

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
montageDefine("af1b182","composer/key-composer",{dependencies:["../core/core","./composer"],factory:function(require,exports,module){/**
 * @module montage/composer/key-composer
 * @requires montage/core/core
 * @requires montage/composer/composer
 */
var Montage = require("../core/core").Montage,
    Composer = require("./composer").Composer;

// Event types dispatched by KeyComposer
var KEYPRESS_EVENT_TYPE = "keyPress",
    LONGKEYPRESS_EVENT_TYPE = "longKeyPress",
    KEYRELEASE_EVENT_TYPE = "keyRelease";

/**
 * @class KeyComposer
 * @classdesc A `Composer` that makes it easy to listen for specific key
 * combinations and react to them.
 * @extends Composer
 * @fires keyPress
 * @fires longKeyPress
 * @fires keyRelease
 * @example
 * keyComposer = KeyComposer.createKey(textComponent, "command+z", "undo");
 * keyComposer.addEventListener("keyPress", undoManager);
 * // when command+z is pressed inside textComponent,
 * // undoManager.handleUndoKeyPress() will be called.
 */
var KeyComposer = exports.KeyComposer = Composer.specialize( /** @lends KeyComposer# */ {

    _isLoaded: {
        value: false
    },

    _shouldDispatchEvent: {
        value: false
    },

    shouldDispatchLongPress: {
        value: false
    },

    _longPressTimeout: {
        value: null
    },

    _keyRegistered: {
        value: false
    },

    _keys:{
        value: null
    },

    /**
     * The keyboard shortcut to listen to. One alphanumeric character or named
     * non-alphanumeric key, possibly with modifiers connected by '+'. The full
     * list of normalized keys and modifiers is in `KeyManager`.  @example "j",
     * "shift+j", "command+shift+j", "backspace", "win+pipe"
     * @type {string}
     * @default null
     */
    keys: {
        get: function () {
            return this._keys;
        },
        set: function (keys) {
            if (this._keyRegistered) {
                KeyManagerProxy.defaultKeyManager.unregisterKey(this);
                this._keys = keys;
                KeyManagerProxy.defaultKeyManager.registerKey(this);
            } else {
                this._keys = keys;
            }
        }
    },

    load: {
        value: function () {
            // Only register the key if somebody is listening for, else let do
            // it later.
            // console.log("--- load", this.identifier);
            if (this._shouldDispatchEvent && !this._keyRegistered) {
                KeyManagerProxy.defaultKeyManager.registerKey(this);
                this._keyRegistered = true;
            }
        }
    },

    unload: {
        value: function () {
            KeyManagerProxy.defaultKeyManager.unregisterKey(this);
            this._keyRegistered = false;
        }
    },

    /**
     * Listen to find out when this `KeyComposer` detects a matching key press.
     * @function
     * @param {string} type Any of the following types: keyPress, longKeyPress
     * and keyRelease.
     * @param {Object|function} listener The listener object or function to
     * call when dispatching the event.
     * @param {boolean} useCapture Specify if the listener want to be called
     * during the capture phase of the event.
     */
    addEventListener: {
        value: function (type, listener, useCapture) {
            // Optimisation so that we don't dispatch an event if we do not need to
            // console.log("--- addEventListener", this.identifier);
            var component = this.component;

            Composer.addEventListener.call(this, type, listener, useCapture);

            if (type == KEYPRESS_EVENT_TYPE || type == LONGKEYPRESS_EVENT_TYPE || type == KEYRELEASE_EVENT_TYPE) {
                this._shouldDispatchEvent = true;
                if (type == LONGKEYPRESS_EVENT_TYPE) {
                    this._shouldDispatchLongPress = true;
                }

                if (this._isLoaded) {
                    if (!this._keyRegistered) {
                        KeyManagerProxy.defaultKeyManager.registerKey(this);
                        this._keyRegistered = true;
                    }
                } else if (component && typeof component.addComposer !== "function") {
                    // this keyComposer is not associated with an element,
                    // let's make it a global key
                    if (!this.element) {
                        this.element = window;
                    }
                    // this keyComposer is not attached to a UI Component,
                    // let's load it manually
                    this.component.loadComposer(this);
                }
            }
        }
    },

    constructor: {
        value: function () {
            // console.log("KEY CREATED")
            Composer.constructor.call(this);
        }
    },

    /**
     * Called when a composer is part of a template serialization. Responsible
     * for calling `addComposer` on the component or calling `load` on the
     * composer.
     * @private
     */
    deserializedFromTemplate: {
        value: function () {
            var component = this.component;

            if (this.identifier === null) {
                this.identifier = Montage.getInfoForObject(this).label;
            }

            if (component) {
                if (typeof component.addComposer == "function") {
                    component.addComposer(this);
                } else if (!this._isLoaded) {
                    // this keyComposer is not associated with an element,
                    // let's make it a global key
                    if (!this.element) {
                        this.element = window;
                    }
                    // this keyComposer is not attached to a UI Component,
                    // let's load it manually
                    this.component.loadComposer(this);
                }
            }
        }
    }
}, {

    /**
     * Constructs a `KeyComposer` to listen for a key combination on a
     * component.
     *
     * The composer will only respond to key events triggered by the DOM
     * elements inside its component or when its component is set as the
     * `activeTarget`.
     *
     * @param {Object} component The component to attach the `KeyComposer` to.
     * @param {Object} keys The key combination, possibly including modifier
     * keys.
     * @param {Object} identifier The identifier for events triggered by this
     * composer.
     * @returns {Object} the newly created `KeyComposer` Object
     */
    createKey: {
        value: function (component, keys, identifier) {
            var key = this;

            if (this === KeyComposer) {
                // This function has been called without creating a new
                // instance of KeyComposer first.
                key = new KeyComposer();
            }

            if (!identifier) {
                if (component.identifier) {
                    identifier = component.identifier + keys.toLowerCase().replace(/[ +]/g).toCapitalized();
                } else {
                    identifier = keys.toLowerCase().replace(/[ +]/g);
                }
            }
            key.keys = keys;
            key.identifier = identifier;

            // console.log("CREATING KEY:", component, key, key.identifier);

            component.addComposer(key);

            return key;
        }
    },

    /**
     * Constructs a `KeyComposer` listening for a key combination anywhere on
     * the page.
     *
     * The composer will respond to key events that bubble up to the `window`.
     *
     * @function
     * @param {Object} component. The component to attach the keyComposer to.
     * @param {Object} keys. The key sequence.
     * @param {Object} identifier. The identifier.
     * @returns {Object} the newly created KeyComposer Object
     */
    createGlobalKey: {
        value: function (component, keys, identifier) {
            var key = this;

            if (this === KeyComposer) {
                // This function has been called without creating a new
                // instance of KeyComposer first
                key = new KeyComposer();
            }

            key.keys = keys;
            key.identifier = identifier;
            // console.log("CREATING GLOBAL KEY:", component, key);

            component.addComposerForElement(key, window);

            return key;
        }
    }

});


/**
 * @class KeyManagerProxy
 * @classdesc Provide a proxy for lazy load of KeyManager.
 * @extends Montage
 * @private
 */
var _keyManagerProxy= null;

var KeyManagerProxy = Montage.specialize(  {

    /**
     * @private
     */
    _defaultKeyManager: {
        value: null
    },

    /**
     * @private
     */
    _loadingDefaultKeyManager: {
        value: false
    },

    /**
     * @private
     */
    _keysToRegister : {
        value: []
    },

    /**
     * @private
     */
    constructor: {
        value: function () {
            // console.log("PROXY CREATED")
        }
    },

    /**
     * Register a `KeyComposer` with the default `KeyManager`.
     * @function
     * @param {Object} keyComposer. A key composer object.
     */
    registerKey: {
        value: function (keyComposer) {
            var thisRef = this;

            if (!this._defaultKeyManager) {
                this._keysToRegister.push(keyComposer);
                if (!this._loadingDefaultKeyManager) {
                    this._loadingDefaultKeyManager = true;

                    require.async("core/event/key-manager")
                    .then(function (module) {
                        var keyManager = thisRef._defaultKeyManager = module.defaultKeyManager;
                        thisRef._keysToRegister.forEach(function (keyComposer) {
                            keyManager.registerKey(keyComposer);
                        });
                        thisRef._keysToRegister.length = 0;
                    })
                    .done();
                }
            } else {
                // This will happend only if somebody uses a cached return
                // value from KeyManagerProxy.defaultKeyManager
                this._defaultKeyManager.registerKey(keyComposer);
            }
        }
    },

    /**
     * Unregister a `KeyComposer` with the default `KeyManager`.
     * @function
     * @param {Object} keyComposer. A key composer object.
     */
    unregisterKey: {
        value: function (keyComposer) {
            if (this._defaultKeyManager) {
                this._defaultKeyManager.unregisterKey(keyComposer);
            }
        }
    }

}, {

    /**
     * Return either the default `KeyManager` or its `KeyManagerProxy`.
     * @function
     * @returns {Object} `KeyManager` or `KeyManagerProxy`.
     */
    defaultKeyManager: {
        get: function () {
            if (!_keyManagerProxy) {
                _keyManagerProxy = new KeyManagerProxy();
            }
            if (this._defaultKeyManager) {
                return this._defaultKeyManager;
            } else {
                return _keyManagerProxy;
            }
        }
    }

});

}})
;
//*/
montageDefine("59d9e99","ui/main.reel/main.html",{text:'<!DOCTYPE html><html><head>\n        <meta charset=utf-8>\n        <title>Main</title>\n\n        <link rel=stylesheet href=main.css>\n\n        <script type=text/montage-serialization>\n        {\n            "owner": {\n                "properties": {\n                    "element": {"#": "mainComponent"},\n                    "_newTodoForm": {"#": "newTodoForm"},\n                    "_newTodoInput": {"#": "newTodoField"},\n                    "_filterController": {"@": "filterController"}\n                },\n                "bindings": {\n                    "selectedFilter": {"<-": "@filterController.value"}\n                }\n            },\n\n            "todoRepetition": {\n                "prototype": "montage/ui/repetition.reel",\n                "properties": {\n                    "element": {"#": "todo-list"}\n                },\n                "bindings": {\n                    "contentController": {"<-": "@owner.todoListController"}\n                }\n            },\n\n            "todoView": {\n                "prototype": "ui/todo-view.reel",\n                "properties": {\n                    "element": {"#": "todoView"}\n                },\n                "bindings": {\n                    "todo": {"<-": "@todoRepetition:iteration.object"}\n                }\n            },\n\n            "main": {\n                "prototype": "matte/ui/dynamic-element.reel",\n                "properties": {\n                    "element": {"#": "main"}\n                },\n                "bindings": {\n                    "classList.has(\'visible\')": {\n                        "<-": "@owner.todos.length > 0"\n                    }\n                }\n            },\n\n            "footer": {\n                "prototype": "matte/ui/dynamic-element.reel",\n                "properties": {\n                    "element": {"#": "footer"}\n                },\n                "bindings": {\n                    "classList.has(\'visible\')": {\n                        "<-": "@owner.todos.length > 0"\n                    }\n                }\n            },\n\n            "toggleAllCheckbox": {\n                "prototype": "native/ui/input-checkbox.reel",\n                "properties": {\n                    "element": {"#": "toggle-all"}\n                },\n                "bindings": {\n                    "checked": {"<->": "@owner.allCompleted"}\n                }\n            },\n\n            "todoCount": {\n                "prototype": "montage/ui/text.reel",\n                "properties": {\n                    "element": {"#": "todo-count"}\n                },\n                "bindings": {\n                    "value": {\n                        "<-": "@owner.todosLeft.length"\n                    }\n                }\n            },\n\n            "todoCountWording": {\n                "prototype": "montage/ui/text.reel",\n                "properties": {\n                    "element": {"#": "todo-count-wording"}\n                },\n                "bindings": {\n                    "value": {"<-": "@owner.todosLeft.length == 1 ? \'item\' : \'items\'"}\n                }\n            },\n\n            "clearCompletedButton": {\n                "prototype": "native/ui/button.reel",\n                "properties": {\n                    "element": {"#": "clear-completed"}\n                },\n                "listeners": [\n                    {\n                        "type": "action",\n                        "listener": {"@": "owner"},\n                        "capture": false\n                    }\n                ],\n                "bindings": {\n                    "classList.has(\'visible\')": {"<-": "@owner.todosCompleted.length"}\n                }\n            },\n\n            "filterController": {\n                "prototype": "montage/core/radio-button-controller",\n                "properties": {\n                    "value": "all"\n                }\n            },\n\n            "filterAll": {\n                "prototype": "core/radio-button",\n                "properties": {\n                    "element": {"#": "filter-all"},\n                    "radioButtonController": {"@": "filterController"},\n                    "value": "all"\n                },\n                "bindings": {\n                    "classList.has(\'selected\')": {"<-": "@filterAll.checked"}\n                }\n            },\n\n            "filterActive": {\n                "prototype": "core/radio-button",\n                "properties": {\n                    "element": {"#": "filter-active"},\n                    "radioButtonController": {"@": "filterController"},\n                    "value": "active"\n                },\n                "bindings": {\n                    "classList.has(\'selected\')": {"<-": "@filterActive.checked"}\n                }\n            },\n\n            "filterCompleted": {\n                "prototype": "core/radio-button",\n                "properties": {\n                    "element": {"#": "filter-completed"},\n                    "radioButtonController": {"@": "filterController"},\n                    "value": "completed"\n                },\n                "bindings": {\n                    "classList.has(\'selected\')": {"<-": "@filterCompleted.checked"}\n                }\n            }\n        }\n        </script>\n    </head>\n    <body>\n        <div data-montage-id=mainComponent>\n\n            <section class=todoapp>\n                    <header class=header>\n                        <h1>todos</h1>\n                        <form data-montage-id=newTodoForm>\n                            <input data-montage-id=newTodoField class=new-todo placeholder="What needs to be done?" autofocus="">\n                        </form>\n                    </header>\n                    <section data-montage-id=main class=main>\n                        <input data-montage-id=toggle-all id=toggle-all class=toggle-all type=checkbox>\n                        <label for=toggle-all>Mark all as complete</label>\n                        <ul data-montage-id=todo-list class=todo-list>\n                            <li data-montage-id=todoView></li>\n                        </ul>\n                    </section>\n                    <footer data-montage-id=footer class=footer>\n                        <span class=todo-count><strong data-montage-id=todo-count>0</strong> <span data-montage-id=todo-count-wording>items</span> left</span>\n                        <ul class=filters>\n                            <li>\n                                <a data-montage-id=filter-all href="#/">All</a>\n                            </li>\n                            <li>\n                                <a data-montage-id=filter-active href=#/active>Active</a>\n                            </li>\n                            <li>\n                                <a data-montage-id=filter-completed href=#/completed>Completed</a>\n                            </li>\n                        </ul>\n                        <button data-montage-id=clear-completed class=clear-completed>Clear completed</button>\n                    </footer>\n                </section>\n                <footer class=info>\n                    <p>Double-click to edit a todo</p>\n                    <p>Created with <a href=http://github.com/montagejs/montage>Montage</a> </p>\n                    <p>Source available at <a href=http://github.com/montagejs/todo-mvc>Montage-TodoMVC</a> </p>\n                    <p>Part of <a href=http://todomvc.com>TodoMVC</a></p>\n                </footer>\n        </div>\n    \n\n</body></html>'});
;
//*/
montageDefine("949cf31","ui/dynamic-element.reel/dynamic-element",{dependencies:["montage/ui/component"],factory:function(require,exports,module){/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */
/**
    module:"matte/ui/dynamic-element.reel"
*/
var Component = require("montage/ui/component").Component;


/**
    The DynamicElement is a general purpose component that aims to expose all the properties of the element as a component.
    @class module:"matte/ui/dynamic-element.reel".DynamicElement
    @extends module:montage/ui/component.Component
*/
exports.DynamicElement = Component.specialize(/** @lends module:"matte/ui/dynamic-element.reel".DynamicElement# */ {

    hasTemplate: {
        value: false
    },

    _innerHTML: {
        value: null
    },

    _usingInnerHTML: {
        value: null
    },

    /**
        The innerHTML displayed as the content of the DynamicElement
        @type {Property}
        @default null
    */
    innerHTML: {
        get: function() {
            return this._innerHTML;
        },
        set: function(value) {
            this._usingInnerHTML = true;
            if (this._innerHTML !== value) {
                this._innerHTML = value;
                this.needsDraw = true;
            }
        }
    },

    /**
        The default html displayed if innerHTML is falsy.
        @type {Property}
        @default {String} ""
    */
    defaultHTML: {
        value: ""
    },

    _allowedTagNames: {
        value: null
    },

    /**
        White list of allowed tags in the innerHTML
        @type {Property}
        @default null
    */
    allowedTagNames: {
        get: function() {
            return this._allowedTagNames;
        },
        set: function(value) {
            if (this._allowedTagNames !== value) {
                this._allowedTagNames = value;
                this.needsDraw = true;
            }
        }
    },



    _range: {
        value: null
    },

    enterDocument: {
        value: function(firstTime) {
            if (firstTime) {
                var range = document.createRange(),
                    className = this.element.className;
                range.selectNodeContents(this.element);
                this._range = range;
            }
        }
    },

    _contentNode: {
        value: null
    },

    draw: {
        value: function() {
            // get correct value
            var displayValue = (this.innerHTML || 0 === this.innerHTML ) ? this.innerHTML : this.defaultHTML,
                content, allowedTagNames = this.allowedTagNames, range = this._range, elements;

            //push to DOM
            if(this._usingInnerHTML) {
                if (allowedTagNames !== null) {
                    //cleanup
                    this._contentNode = null;
                    range.deleteContents();
                    //test for tag white list
                    content = range.createContextualFragment( displayValue );
                    if(allowedTagNames.length !== 0) {
                        elements = content.querySelectorAll("*:not(" + allowedTagNames.join("):not(") + ")");
                    } else {
                        elements = content.childNodes;
                    }
                    if (elements.length === 0) {
                        range.insertNode(content);
                        if(range.endOffset === 0) {
                            // according to https://bugzilla.mozilla.org/show_bug.cgi?id=253609 Firefox keeps a collapsed
                            // range collapsed after insertNode
                            range.selectNodeContents(this.element);
                        }

                    } else {
                        console.warn("Some Elements Not Allowed " , elements);
                    }
                } else {
                    content = this._contentNode;
                    if(content === null) {
                        //cleanup
                        range.deleteContents();
                        this._contentNode = content = document.createTextNode(displayValue);
                        range.insertNode(content);
                        if(range.endOffset === 0) {
                            // according to https://bugzilla.mozilla.org/show_bug.cgi?id=253609 Firefox keeps a collapsed
                            // range collapsed after insert
                            range.selectNodeContents(this.element);
                        }

                    } else {
                        content.data = displayValue;
                    }
                }
            }
        }
    }
});

}})
;
//*/
montageDefine("e396087","ui/native-control",{dependencies:["montage/ui/component"],factory:function(require,exports,module){/**
    @module montage/ui/native-control
*/

var Component = require("montage/ui/component").Component;

/**
    Base component for all native components, such as RadioButton and Checkbox.
    @class module:montage/ui/native-control.NativeControl
    @extends module:montage/ui/component.Component
 */
var NativeControl = exports.NativeControl = Component.specialize(/** @lends module:montage/ui/native-control.NativeControl# */ {

    hasTemplate: {
        value: false
    },

    willPrepareForDraw: {
        value: function() {
        }
    }
});

//http://www.w3.org/TR/html5/elements.html#global-attributes
NativeControl.addAttributes( /** @lends module:montage/ui/native-control.NativeControl# */ {

/**
    Specifies the shortcut key(s) that gives focuses to or activates the element.
    @see {@link http://www.w3.org/TR/html5/editing.html#the-accesskey-attribute}
    @type {string}
    @default null
*/
    accesskey: null,

/**
    Specifies if the content is editable or not. Valid values are "true", "false", and "inherit".
    @see {@link http://www.w3.org/TR/html5/editing.html#contenteditable}
    @type {string}
    @default null

*/
    contenteditable: null,

/**
    Specifies the ID of a <code>menu</code> element in the DOM to use as the element's context menu.
    @see  {@link http://www.w3.org/TR/html5/interactive-elements.html#attr-contextmenu}
    @type {string}
    @default null
*/
    contextmenu: null,

/**
    Specifies the elements element's text directionality. Valid values are "ltr", "rtl", and "auto".
    @see {@link http://www.w3.org/TR/html5/elements.html#the-dir-attribute}
    @type {string}
    @default null
*/
    dir: null,

/**
    Specifies if the element is draggable. Valid values are "true", "false", and "auto".
    @type {string}
    @default null
    @see {@link http://www.w3.org/TR/html5/dnd.html#the-draggable-attribute}
*/
    draggable: null,

/**
    Specifies the behavior that's taken when an item is dropped on the element. Valid values are "copy", "move", and "link".
    @type {string}
    @see {@link http://www.w3.org/TR/html5/dnd.html#the-dropzone-attribute}
*/
    dropzone: null,

/**
    When specified on an element, it indicates that the element should not be displayed.
    @type {boolean}
    @default false
*/
    hidden: {dataType: 'boolean'},
    //id: null,

/**
    Specifies the primary language for the element's contents and for any of the element's attributes that contain text.
    @type {string}
    @default null
    @see {@link http://www.w3.org/TR/html5/elements.html#attr-lang}
*/
    lang: null,

/**
    Specifies if element should have its spelling and grammar checked by the browser. Valid values are "true", "false".
    @type {string}
    @default null
    @see {@link http://www.w3.org/TR/html5/editing.html#attr-spellcheck}
*/
    spellcheck: null,

/**
    The CSS styling attribute.
    @type {string}
    @default null
    @see {@link http://www.w3.org/TR/html5/elements.html#the-style-attribute}
*/
    style: null,

/**
     Specifies the relative order of the element for the purposes of sequential focus navigation.
     @type {number}
     @default null
     @see {@link http://www.w3.org/TR/html5/editing.html#attr-tabindex}
*/
    tabindex: null,

/**
    Specifies advisory information about the element, used as a tooltip when hovering over the element, and other purposes.
    @type {string}
    @default null
    @see {@link http://www.w3.org/TR/html5/elements.html#the-title-attribute}
*/
    title: null
});

}})
;
//*/
montageDefine("e396087","ui/check-input",{dependencies:["ui/native-control","montage/composer/press-composer"],factory:function(require,exports,module){/*global require, exports */

/**
    @module montage/ui/check-input
*/
var NativeControl = require("ui/native-control").NativeControl,
    PressComposer = require("montage/composer/press-composer").PressComposer;

/**
    The base class for the Checkbox component. You will not typically create this class directly but instead use the Checkbox component.
    @class module:montage/ui/check-input.CheckInput
    @extends module:montage/ui/native-control.NativeControl
*/
exports.CheckInput =  NativeControl.specialize({

    // HTMLInputElement methods

    blur: { value: function() { this._element.blur(); } },
    focus: { value: function() { this._element.focus(); } },
    // click() deliberately omitted, use checked = instead

    // Callbacks
    draw: {
        value: function() {
            this.super();
            this._element.setAttribute("aria-checked", this._checked);
        }
    },

    _pressComposer: {
        enumerable: false,
        value: null
    },

    prepareForActivationEvents: {
        value: function() {
            var pressComposer = this._pressComposer = new PressComposer();
            this.addComposer(pressComposer);
            pressComposer.addEventListener("pressStart", this, false);
            pressComposer.addEventListener("press", this, false);
        }
    },

    enterDocument: {
        value: function(firstTime) {
            if (firstTime) {
                this._element.addEventListener('change', this);
            }
        }
    },

    /**
    Fake the checking of the element.

    Changes the checked property of the element and dispatches a change event.
    Radio button overrides this.

    @private
    */
    _fakeCheck: {
        enumerable: false,
        value: function() {
            var changeEvent;
            // NOTE: this may be BAD, modifying the element outside of
            // the draw loop, but it's what a click/touch would
            // actually have done
            this._element.checked = !this._element.checked;
            changeEvent = document.createEvent("HTMLEvents");
            changeEvent.initEvent("change", true, true);
            this._element.dispatchEvent(changeEvent);
        }
    },

    /**
    Stores if we need to "fake" checking of the input element.

    When preventDefault is called on touchstart and touchend events (e.g. by
    the scroller component) the checkbox doesn't check itself, so we need
    to fake it later.

    @default false
    @private
    */
    _shouldFakeCheck: {
        enumerable: false,
        value: false
    },

    // Handlers

    handlePressStart: {
        value: function(event) {
            this._shouldFakeCheck = event.defaultPrevented;
        }
    },


    handlePress: {
        value: function(event) {
            if (this._shouldFakeCheck) {
                this._shouldFakeCheck = false;
                this._fakeCheck();
            }
        }
    },

    handleChange: {
        enumerable: false,
        value: function(event) {
            if (!this._pressComposer || this._pressComposer.state !== PressComposer.CANCELLED) {
                Object.getPropertyDescriptor(this, "checked").set.call(this,
                    this.element.checked, true);
                this._dispatchActionEvent();
            }
        }
    }
});

}})
;
//*/
montageDefine("af1b182","core/browser",{dependencies:["montage"],factory:function(require,exports,module){/*global navigator*/
var Montage = require("montage").Montage;

var regExAppleWebKit = new RegExp(/AppleWebKit\/([\d.]+)/);

var Browser = Montage.specialize({
    constructor: {
        value: function Browser(userAgent) {
            this.super();
            this._userAgent = userAgent;
            this._analyze(userAgent);
        }
    },

    _analyze: {
        value: function (userAgent) {
            if (/*isAndroidMobile*/ userAgent.indexOf("Android") > -1 && userAgent.indexOf("Mozilla/5.0") > -1 && userAgent.indexOf("AppleWebKit") > -1) {
                this.android = {};
                var resultAppleWebKitRegEx = regExAppleWebKit.exec(userAgent);
                var appleWebKitVersion = (resultAppleWebKitRegEx === null ? null : parseFloat(regExAppleWebKit.exec(userAgent)[1]));
                this.android.androidBrowser = appleWebKitVersion !== null && appleWebKitVersion < 537;
            }
        }
    },

    _userAgent: {
        value: null
    }

});

var _browser = null;

Montage.defineProperties(exports, {

    browser: {
        get: function () {
            if(_browser === null) {
                _browser = new Browser(navigator.userAgent);
            }
            return _browser;
        }
    },

    Browser: {
        value: Browser
    }

});

}})
;
//*/
montageDefine("e396087","package.json",{exports: {"name":"native","version":"0.1.3","repository":{"type":"git","url":"git+https://github.com/montagejs/native.git"},"dependencies":{"montage":"~0.13.0"},"devDependencies":{"montage-testing":"~0.2.0"},"exclude":["overview.html","overview","run-tests.html","test"],"_id":"native@0.1.3","description":"montage-native ==============","dist":{"shasum":"d2681d0415ec6e2839d30fe2753d215bf406b686","tarball":"http://registry.npmjs.org/native/-/native-0.1.3.tgz"},"_from":"native@>=0.1.2 <0.2.0","_npmVersion":"1.2.9","_npmUser":{"name":"montage-bot","email":"francoisfrisch@gmail.com"},"maintainers":[{"name":"francoisfrisch","email":"francoisfrisch@gmail.com"},{"name":"montage-bot","email":"francoisfrisch@gmail.com"}],"directories":{},"_shasum":"d2681d0415ec6e2839d30fe2753d215bf406b686","_resolved":"https://registry.npmjs.org/native/-/native-0.1.3.tgz","bugs":{"url":"https://github.com/montagejs/native/issues"},"homepage":"https://github.com/montagejs/native#readme","hash":"e396087","mappings":{"montage":{"name":"montage","hash":"af1b182","location":"../montage@af1b182/"}},"production":true,"useScriptInjection":true}})
bundleLoaded("index.html.bundle-1-0.js")