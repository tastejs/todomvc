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
montageDefine("6607c26","ui/main.reel/main",{dependencies:["montage/ui/component","montage/core/range-controller","core/todo","montage/core/serialization"],factory:function(require,exports,module){var Component = require('montage/ui/component').Component;
var RangeController = require('montage/core/range-controller').RangeController;
var Todo = require('core/todo').Todo;
var Serializer = require('montage/core/serialization').Serializer;
var Deserializer = require('montage/core/serialization').Deserializer;
var LOCAL_STORAGE_KEY = 'todos-montage';

exports.Main = Component.specialize({

	_newTodoForm: {
		value: null
	},

	_newTodoInput: {
		value: null
	},

	todoListController: {
		value: null
	},

	constructor: {
		value: function Main() {
			this.todoListController = new RangeController();
			this.addPathChangeListener('todos.every{completed}', this, 'handleTodosCompletedChanged');

			this.defineBindings({
				'todos': {'<-': 'todoListController.organizedContent'},
				'todosLeft': {'<-': 'todos.filter{!completed}'},
				'todosCompleted': {'<-': 'todos.filter{completed}'}
			});
		}
	},

	templateDidLoad: {
		value: function () {
			this.load();
		}
	},

	load: {
		value: function () {
			if (localStorage) {
				var todoSerialization = localStorage.getItem(LOCAL_STORAGE_KEY);

				if (todoSerialization) {
					var deserializer = new Deserializer(),
						self = this;

					deserializer.init(todoSerialization, require)
					.deserializeObject()
					.then(function (todos) {
						self.todoListController.content = todos;
					}).fail(function (error) {
						console.error('Could not load saved tasks.');
						console.debug('Could not deserialize', todoSerialization);
						console.log(error.stack);
					});
				}
			}
		}
	},

	save: {
		value: function () {
			if (localStorage) {
				var todos = this.todoListController.content,
					serializer = new Serializer().initWithRequire(require);

				localStorage.setItem(LOCAL_STORAGE_KEY, serializer.serializeObject(todos));
			}
		}
	},

	enterDocument: {
		value: function (firstTime) {
			if (firstTime) {
				this._newTodoForm.identifier = 'newTodoForm';
				this._newTodoForm.addEventListener('submit', this, false);

				this.addEventListener('destroyTodo', this, true);

				window.addEventListener('beforeunload', this, true);
			}
		}
	},

	captureDestroyTodo: {
		value: function (evt) {
			this.destroyTodo(evt.detail.todo);
		}
	},

	createTodo: {
		value: function (title) {
			var todo = new Todo().initWithTitle(title);
			this.todoListController.add(todo);
			return todo;
		}
	},

	destroyTodo: {
		value: function (todo) {
			this.todoListController.delete(todo);
			return todo;
		}
	},

	_allCompleted: {
		value: null
	},

	allCompleted: {
		get: function () {
			return this._allCompleted;
		},
		set: function (value) {
			this._allCompleted = value;
			this.todoListController.organizedContent.forEach(function (member) {
				member.completed = value;
			});
		}
	},

	todos: {
		value: null
	},

	todosLeft: {
		value: null
	},

	todosCompleted: {
		value: null
	},

	// Handlers

	handleNewTodoFormSubmit: {
		value: function (evt) {
			evt.preventDefault();

			var title = this._newTodoInput.value.trim();

			if (title === '') {
				return;
			}

			this.createTodo(title);
			this._newTodoInput.value = null;
		}
	},

	handleTodosCompletedChanged: {
		value: function (value) {
			this._allCompleted = value;
			this.dispatchOwnPropertyChange('allCompleted', value);
		}
	},

	handleClearCompletedButtonAction: {
		value: function () {
			var completedTodos = this.todoListController.organizedContent.filter(function (todo) {
				return todo.completed;
			});

			if (completedTodos.length > 0) {
				this.todoListController.deleteEach(completedTodos);
			}
		}
	},

	captureBeforeunload: {
		value: function () {
			this.save();
		}
	}
});

}})
;
//*/
montageDefine("6607c26","ui/todo-view.reel/todo-view",{dependencies:["montage/ui/component"],factory:function(require,exports,module){var Component = require('montage/ui/component').Component;

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
montageDefine("6607c26","ui/todo-view.reel/todo-view.html",{text:'<!doctype html>\n<html>\n	<head>\n		<meta charset=utf-8>\n		<title>TodoView</title>\n\n		<script type="text/montage-serialization">\n		{\n			"owner": {\n				"properties": {\n					"element": {"#": "todoView"},\n					"editInput": {"@": "editInput"}\n				}\n			},\n\n			"todoTitle": {\n				"prototype": "montage/ui/text.reel",\n				"properties": {\n					"element": {"#": "todoTitle"}\n				},\n				"bindings": {\n					"value": {"<-": "@owner.todo.title"}\n				}\n			},\n\n			"todoCompletedCheckbox": {\n				"prototype": "native/ui/input-checkbox.reel",\n				"properties": {\n					"element": {"#": "todoCompletedCheckbox"}\n				},\n				"bindings": {\n					"checked": {"<->": "@owner.todo.completed"}\n				}\n			},\n\n			"destroyButton": {\n				"prototype": "native/ui/button.reel",\n				"properties": {\n					"element": {"#": "destroyButton"}\n				},\n				"listeners": [\n					{\n						"type": "action",\n						"listener": {"@": "owner"},\n						"capture": true\n					}\n				]\n			},\n\n			"editInput": {\n				"prototype": "native/ui/input-text.reel",\n				"properties": {\n					"element": {"#": "edit-input"}\n				},\n				"bindings": {\n					"value": {"<-": "@owner.todo.title"}\n				}\n			}\n		}\n		</script>\n	</head>\n	<body>\n		<li data-montage-id=todoView>\n			<div class=view>\n				<input type=checkbox data-montage-id=todoCompletedCheckbox class=toggle>\n				<label data-montage-id=todoTitle></label>\n				<button data-montage-id=destroyButton class=destroy></button>\n			</div>\n			<form data-montage-id=edit>\n				<input data-montage-id=edit-input class=edit value="Rule the web">\n			</form>\n		</li>\n	</body>\n</html>'});
bundleLoaded("index.html.bundle-1-2.js")