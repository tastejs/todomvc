montageDefine("6364dae","composer/press-composer",{dependencies:["montage","composer/composer","core/event/mutable-event"],factory:function(require,exports,module){/*global require, exports*/
/**
	@module montage/composer/press-composer
    @requires montage
    @requires montage/composer/composer
    @requires montage/core/event/mutable-event
*/
var Montage = require("montage").Montage,
    Composer = require("composer/composer").Composer,
    MutableEvent = require("core/event/mutable-event").MutableEvent;
/**
 * @class PressComposer
 * @extends Composer
 * @fires pressStart
 * @fires press
 * @fires longPress
 * @fires pressCancel
 */
var PressComposer = exports.PressComposer = Composer.specialize(/** @lends PressComposer# */ {

    /**
        Dispatched when a press begins. It is ended by either a {@link press} or
        {@link pressCancel} event.

        @event pressStart
        @memberof PressComposer
        @param {PressEvent} event
    */

    /**
        Dispatched when a press is complete.

        @event press
        @memberof PressComposer
        @param {PressEvent} event
    */

    /**
        Dispatched when a press lasts for longer than (@link longPressThreshold}

        @event longPress
        @memberof PressComposer
        @param {PressEvent} event
    */

    /**
        Dispatched when a press is canceled. This could be because the pointer
        left the element, was claimed by another component or maybe a phone call
        came in.

        @event pressCancel
        @memberof PressComposer
        @param {PressEvent} event
    */

    // Load/unload

    load: {
        value: function() {
            if (window.Touch) {
                this._element.addEventListener("touchstart", this, true);
            } else {
                this._element.addEventListener("mousedown", this, true);
            }
        }
    },

    unload: {
        value: function() {
            if (window.Touch) {
                this._element.removeEventListener("touchstart", this);
            } else {
                this._element.removeEventListener("mousedown", this);
            }
        }
    },

    /**
    Delegate that implements <code>surrenderPointer</code>. See Component for
    explanation of what this method should do.

    @type {Object}
    @default null
    */
    delegate: {
        value: null
    },


    /**
    Cancel the current press.

    Can be used in a "longPress" event handler to prevent the "press" event
    being fired.
    @returns Boolean true if a press was canceled, false if the composer was
                     already in a unpressed or canceled state.
    */
    cancelPress: {
        value: function() {
            if (this._state === PressComposer.PRESSED) {
                this._dispatchPressCancel();
                this._endInteraction();
                return true;
            }
            return false;
        }
    },

    // Optimisation so that we don't set a timeout if we do not need to
    addEventListener: {
        value: function(type, listener, useCapture) {
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
        enumerable: false,
        value: 0
    },
    state: {
        get: function() {
            return this._state;
        }
    },

    _shouldDispatchLongPress: {
        enumerable: false,
        value: false
    },

    _longPressThreshold: {
        enumerable: false,
        value: 1000
    },
    /**
    How long a press has to last for a longPress event to be dispatched
    */
    longPressThreshold: {
        get: function() {
            return this._longPressThreshold;
        },
        set: function(value) {
            if (this._longPressThreshold !== value) {
                this._longPressThreshold = value;
            }
        }
    },

    _longPressTimeout: {
        enumberable: false,
        value: null
    },

    // Magic

    /**
    @default null
    @private
    */
    _observedPointer: {
        enumerable: false,
        value: null
    },

    // TODO: maybe this should be split and moved into handleTouchstart
    // and handleMousedown
    _startInteraction: {
        enumerable: false,
        value: function(event) {
            if (
                ("enabled" in this.component && !this.component.enabled) ||
                this._observedPointer !== null
            ) {
                return false;
            }

            var i = 0, changedTouchCount;

            if (event.type === "touchstart") {
                changedTouchCount = event.changedTouches.length;
                for (; i < changedTouchCount; i++) {
                    if (!this.component.eventManager.componentClaimingPointer(event.changedTouches[i].identifier)) {
                        this._observedPointer = event.changedTouches[i].identifier;
                        break;
                    }
                 }

                if (this._observedPointer === null) {
                    // All touches have been claimed
                    return false;
                }

                document.addEventListener("touchend", this, false);
                document.addEventListener("touchcancel", this, false);
            } else if (event.type === "mousedown") {
                this._observedPointer = "mouse";
                // Needed to cancel the press if mouseup'd when not on the component
                document.addEventListener("mouseup", this, false);
                // Needed to preventDefault if another component has claimed
                // the pointer
                document.addEventListener("click", this, false);
            }

            // Needed to cancel the press because once a drag is started
            // no mouse events are fired
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#initiate-the-drag-and-drop-operation
            this._element.addEventListener("dragstart", this, false);

            this.component.eventManager.claimPointer(this._observedPointer, this);

            this._dispatchPressStart(event);
        }
    },

    /**
    Decides what should be done based on an interaction.

    @param {Event} event The event that caused this to be called.
    */
    _interpretInteraction: {
        value: function(event) {
            // TODO maybe the code should be moved out to handleClick and
            // handleMouseup
            var isSurrendered, target, isTarget;

            if (this._observedPointer === null) {
                this._endInteraction(event);
                return;
            }

            isSurrendered = !this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this);
            target = event.target;
            while (target !== this._element && target && target.parentNode) {
                target = target.parentNode;
            }
            isTarget = target === this._element;

            if (isSurrendered && event.type === "click") {
                // Pointer surrendered, so prevent the default action
                event.preventDefault();
                // No need to dispatch an event as pressCancel was dispatched
                // in surrenderPointer, just end the interaction.
                this._endInteraction(event);
                return;
            } else if (event.type === "mouseup") {

                if (!isSurrendered && isTarget) {
                    this._dispatchPress(event);
                    this._endInteraction(event);
                    return;
                } else if (!isSurrendered && !isTarget) {
                    this._dispatchPressCancel(event);
                    this._endInteraction(event);
                    return;
                } else if (isSurrendered && !isTarget) {
                    this._endInteraction(event);
                }
            }
        }
    },

    /**
    Remove event listeners after an interaction has finished.
    */
    _endInteraction: {
        value: function(event) {
            if (!event || event.type === "touchend" || event.type === "touchcancel") {
                document.removeEventListener("touchend", this);
                document.removeEventListener("touchcancel", this);
            } else if (!event || event.type === "click" || event.type === "mouseup") {
                document.removeEventListener("click", this);
                document.removeEventListener("mouseup", this);
            }

            if (this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this)) {
                this.component.eventManager.forfeitPointer(this._observedPointer, this);
            }
            this._observedPointer = null;
            this._state = PressComposer.UNPRESSED;
        }
    },

    /**
    Checks if we are observing one of the changed touches. Returns the index
    of the changed touch if one matches, otherwise returns false. Make sure
    to check against <code>!== false</code> or <code>=== false</code> as the
    matching index might be 0.

    @function
    @private
    @returns {Number|Boolean} The index of the matching touch, or false
    */
    _changedTouchisObserved: {
        value: function(changedTouches) {
            if (this._observedPointer === null) {
                return false;
            }

            var i = 0, changedTouchCount = event.changedTouches.length;

            for (; i < changedTouchCount; i++) {
                if (event.changedTouches[i].identifier === this._observedPointer) {
                    return i;
                }
            }
            return false;
        }
    },

    // Surrender pointer

    surrenderPointer: {
        value: function(pointer, component) {
            var shouldSurrender = this.callDelegateMethod("surrenderPointer", pointer, component);
            if (typeof shouldSurrender !== "undefined" && shouldSurrender === false) {
                return false;
            }

            this._dispatchPressCancel();
            return true;
        }
    },

    // Handlers

    captureTouchstart: {
        value: function(event) {
            this._startInteraction(event);
        }
    },
    handleTouchend: {
        value: function(event) {
            if (this._observedPointer === null) {
                this._endInteraction(event);
                return;
            }

            if (this._changedTouchisObserved(event.changedTouches) !== false) {
                if (this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this)) {
                    this._dispatchPress(event);
                } else {
                    event.preventDefault();
                }
                this._endInteraction(event);
            }
        }
    },
    handleTouchcancel: {
        value: function(event) {
            if (this._observedPointer === null || this._changedTouchisObserved(event.changedTouches) !== false) {
                if (this.component.eventManager.isPointerClaimedByComponent(this._observedPointer, this)) {
                    this._dispatchPressCancel(event);
                }
                this._endInteraction(event);
            }
        }
    },

    captureMousedown: {
        value: function(event) {
            this._startInteraction(event);
        }
    },
    handleClick: {
        value: function(event) {
            this._interpretInteraction(event);
        }
    },
    handleMouseup: {
        value: function(event) {
            this._interpretInteraction(event);
        }
    },
    handleDragstart: {
        value: function(event) {
            this._dispatchPressCancel(event);
            this._endInteraction();
        }
    },

    // Event dispatch

    _createPressEvent: {
        enumerable: false,
        value: function(name, event) {
            var pressEvent, detail, index;

            if (!event) {
                event = document.createEvent("CustomEvent");
                event.initCustomEvent(name, true, true, null);
            }

            pressEvent = new PressEvent();
            pressEvent.event = event;
            pressEvent.type = name;
            pressEvent.pointer = this._observedPointer;
            pressEvent.targetElement = event.target;

            if (event.changedTouches &&
                (index = this._changedTouchisObserved(event.changedTouches)) !== false
            ) {
                pressEvent.touch = event.changedTouches[index];
            }

            return pressEvent;
        }
    },

    /**
    Dispatch the pressStart event
    @private
    */
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

    /**
    Dispatch the press event
    @private
    */
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

    /**
    Dispatch the long press event
    @private
    */
    _dispatchLongPress: {
        enumerable: false,
        value: function (event) {
            if (this._shouldDispatchLongPress) {
                this.dispatchEvent(this._createPressEvent("longPress", event));
                this._longPressTimeout = null;
            }
        }
    },

    /**
    Dispatch the pressCancel event
    @private
    */
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


var PressEvent = (function(){
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
            get: function() {
                return this._event;
            },
            set: function(value) {
                this._event = value;
            }
        },
        _touch: {
            enumerable: false,
            value: null
        },
        touch: {
            get: function() {
                return this._touch;
            },
            set: function(value) {
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

    eventPropDescriptor = function(prop) {
        return {
            get: function() {
                return this._event[prop];
            }
        };
    };
    typePropDescriptor = function(prop) {
        return {
            get: function() {
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
montageDefine("37bb2cd","ui/main.reel/main.html",{text:'<!doctype html>\n<html>\n    <head>\n        <meta charset=utf-8>\n        <title>Main</title>\n\n        <link rel=stylesheet href=main.css>\n\n        <script type="text/montage-serialization">\n        {\n            "owner": {\n                "properties": {\n                    "element": {"#": "mainComponent"},\n                    "_newTodoForm": {"#": "newTodoForm"},\n                    "_newTodoInput": {"#": "newTodoField"}\n                }\n            },\n\n            "todoRepetition": {\n                "prototype": "montage/ui/repetition.reel",\n                "properties": {\n                    "element": {"#": "todo-list"}\n                },\n                "bindings": {\n                    "contentController": {"<-": "@owner.todoListController"}\n                }\n            },\n\n            "todoView": {\n                "prototype": "ui/todo-view.reel",\n                "properties": {\n                    "element": {"#": "todoView"}\n                },\n                "bindings": {\n                    "todo": {"<-": "@todoRepetition.objectAtCurrentIteration"}\n                }\n            },\n\n            "main": {\n                "prototype": "matte/ui/dynamic-element.reel",\n                "properties": {\n                    "element": {"#": "main"}\n                },\n                "bindings": {\n                    "classList.has(\'visible\')": {\n                        "<-": "@owner.todos.length > 0"\n                    }\n                }\n            },\n\n            "footer": {\n                "prototype": "matte/ui/dynamic-element.reel",\n                "properties": {\n                    "element": {"#": "footer"}\n                },\n                "bindings": {\n                    "classList.has(\'visible\')": {\n                        "<-": "@owner.todos.length > 0"\n                    }\n                }\n            },\n\n            "toggleAllCheckbox": {\n                "prototype": "native/ui/input-checkbox.reel",\n                "properties": {\n                    "element": {"#": "toggle-all"}\n                },\n                "bindings": {\n                    "checked": {"<->": "@owner.allCompleted"}\n                }\n            },\n\n            "todoCount": {\n                "prototype": "montage/ui/text.reel",\n                "properties": {\n                    "element": {"#": "todo-count"}\n                },\n                "bindings": {\n                    "value": {\n                        "<-": "@owner.todosLeft.length"\n                    }\n                }\n            },\n\n            "todoCountWording": {\n                "prototype": "montage/ui/text.reel",\n                "properties": {\n                    "element": {"#": "todo-count-wording"}\n                },\n                "bindings": {\n                    "value": {"<-": "@owner.todosLeft.length == 1 ? \'item\' : \'items\'"}\n                }\n            },\n\n            "completedCount": {\n                "prototype": "montage/ui/text.reel",\n                "properties": {\n                    "element": {"#": "completed-count"}\n                },\n                "bindings": {\n                    "value": {\n                        "<-": "@owner.todosCompleted.length"\n                    }\n                }\n            },\n\n            "clearCompletedContainer": {\n                "prototype": "matte/ui/dynamic-element.reel",\n                "properties": {\n                    "element": {"#": "clear-completed-container"}\n                },\n                "bindings": {\n                    "classList.has(\'visible\')": {\n                        "<-": "@owner.todosCompleted.length"\n                    }\n                }\n            },\n\n            "clearCompletedButton": {\n                "prototype": "native/ui/button.reel",\n                "properties": {\n                    "element": {"#": "clear-completed"}\n                },\n                "listeners": [\n                    {\n                        "type": "action",\n                        "listener": {"@": "owner"},\n                        "capture": false\n                    }\n                ]\n            }\n        }\n        </script>\n    </head>\n    <body>\n        <div data-montage-id=mainComponent>\n\n            <section id=todoapp>\n                    <header id=header>\n                        <h1>todos</h1>\n                        <form data-montage-id=newTodoForm>\n                            <input data-montage-id=newTodoField id=new-todo placeholder="What needs to be done?" autofocus="">\n                        </form>\n                    </header>\n                    <section data-montage-id=main id=main>\n                        <input type=checkbox data-montage-id=toggle-all id=toggle-all>\n                        <label for=toggle-all>Mark all as complete</label>\n                        <ul data-montage-id=todo-list id=todo-list>\n                            <li data-montage-id=todoView></li>\n                        </ul>\n                    </section>\n                    <footer data-montage-id=footer id=footer>\n                        <span id=todo-count><strong data-montage-id=todo-count>0</strong> <span data-montage-id=todo-count-wording>items</span> left</span>\n                        <div data-montage-id=clear-completed-container id=clear-completed-container>\n                            <button data-montage-id=clear-completed id=clear-completed>Clear completed (<span data-montage-id=completed-count>0</span>)</button>\n                        </div>\n                    </footer>\n                </section>\n                <footer id=info>\n                    <p>Double-click to edit a todo</p>\n                    <p>Created with <a href="http://github.com/montagejs/montage">Montage</a> </p>\n                    <p>Source available at <a href="http://github.com/montagejs/todo-mvc">Montage-TodoMVC</a> </p>\n                    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>\n                </footer>\n        </div>\n    </body>\n</html>'});
;
//*/
montageDefine("37bb2cd","ui/main.reel/main",{dependencies:["montage/ui/component","montage/core/range-controller","core/todo","montage/core/serialization"],factory:function(require,exports,module){var Component = require('montage/ui/component').Component;
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
montageDefine("5bf8252","ui/check-input",{dependencies:["ui/native-control","montage/composer/press-composer"],factory:function(require,exports,module){/*global require, exports */

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
montageDefine("262b1a4","package.json",{exports: {"name":"matte","version":"0.1.3","repository":{"type":"git","url":"https://github.com/montagejs/matte.git"},"dependencies":{"montage":"~0.13.0","native":"~0.1.1"},"devDependencies":{"montage-testing":"~0.2.0"},"exclude":["overview.html","overview","run-tests.html","test"],"readme":"matte\n==============\n\nThis is the Montage package template.\n\nNote: Before working on your package you will need to add montage to it.\n\n```\nnpm install .\n```\n\nLayout\n------\n\nThe template contains the following files and directories:\n\n* `ui/` – Directory containing all the UI .reel directories.\n* `package.json` – Describes your app and its dependencies\n* `README.md` – This readme. Replace the current content with a description of your app\n* `overview.html`\n* `overview/` – Directory that contains the files for the overview page. This is a different package so you will need to require the component using matte/*.\n  * `main.reel` – The main interface component where you can add the components to show.\n* `node_modules/` – Directory containing all npm packages needed, including Montage. Any packages here must be included as `dependencies` in `package.json` for the Montage require to find them.\n* `test/` – Directory containing tests for your package.\n  * `all.js` – Module that point the test runner to all your jasmine specs.\n* `run-tests.html` – Page to run jasmine tests manually in your browser\n* `testacular.conf.js` – This is the testacular configuration file. You can start testacular by running `node_modules/testacular/bin/testacular start`\n\nCreate the following directories if you need them:\n\n* `locale/` – Directory containing localized content.\n* `scripts/` – Directory containing other JS libraries. If a library doesn’t support the CommonJS \"exports\" object it will need to be loaded through a `<script>` tag.\n\n","readmeFilename":"README.md","description":"matte ==============","bugs":{"url":"https://github.com/montagejs/matte/issues"},"_id":"matte@0.1.3","_from":"matte@~0.1.3","directories":{"lib":"./"},"hash":"262b1a4","mappings":{"montage":{"name":"montage","hash":"6364dae","location":"../montage@6364dae/"},"native":{"name":"native","hash":"5bf8252","location":"../native@5bf8252/"}},"production":true,"useScriptInjection":true}})
;
//*/
montageDefine("5bf8252","ui/input-checkbox.reel/input-checkbox",{dependencies:["ui/check-input"],factory:function(require,exports,module){/**
    @module "montage/ui/native/input-checkbox.reel"
    @requires montage/core/core
    @requires montage/ui/check-input
*/
var CheckInput = require("ui/check-input").CheckInput;

/**

    @class module:"montage/ui/native/input-checkbox.reel".InputCheckbox
    @extends module:montage/ui/check-input.CheckInput
*/
var InputCheckbox = exports.InputCheckbox = CheckInput.specialize({

});
InputCheckbox.addAttributes( /** @lends module:"montage/ui/native/input-checkbox.reel".InputCheckbox# */ {

/**
    Specifies if the checkbox control should receive focus when the document loads. Because Montage components are loaded asynchronously after the document has loaded, setting this property has no effect on the element's focus state.
    @type {boolean}
    @default false
*/
    autofocus: {value: false, dataType: 'boolean'},

/**
    Specifies if the checkbox control is disabled.
    @type {boolean}
    @default false
*/
    disabled: {value: false, dataType: 'boolean'},

/**
    Specifies if the checkbox is in it checked state or not.
    @type {boolean}
    @default false
*/
    checked: {value: false, dataType: 'boolean'},

/**
    The value of the id attribute of the form with which to associate the element.
    @type {string}
    @default null
*/
    form: null,

/**
    The name part of the name/value pair associated with this element for the purposes of form submission.
    @type {string}
    @default null
*/
    name: null,

/**
    Specifies if this control is readonly.
    @type {boolean}
    @default false
*/
    readonly: {value: false, dataType: 'boolean'},

/**
    A string the browser displays in a tooltip when the user hovers their mouse over the element.
    @type {string}
    @default null
*/
    title: null,
    /*
    The value associated with the checkbox. Per the WC3 specification, if the element has a <code>value</code> attribute then the value of that attribute's value is returned; otherwise, it returns "on".
    @type {string}
    @default "on"
    */
    value: {value: 'on'}
});

}})
bundleLoaded("index.html.bundle-1-2.js")