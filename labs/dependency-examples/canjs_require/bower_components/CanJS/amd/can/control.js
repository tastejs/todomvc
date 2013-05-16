/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/construct'], function (can) {
    // ## control.js
    // `can.Control`  
    // _Controller_
    // Binds an element, returns a function that unbinds.
    var bind = function (el, ev, callback) {

        can.bind.call(el, ev, callback);

        return function () {
            can.unbind.call(el, ev, callback);
        };
    },
        isFunction = can.isFunction,
        extend = can.extend,
        each = can.each,
        slice = [].slice,
        paramReplacer = /\{([^\}]+)\}/g,
        special = can.getObject("$.event.special", [can]) || {},

        // Binds an element, returns a function that unbinds.
        delegate = function (el, selector, ev, callback) {
            can.delegate.call(el, selector, ev, callback);
            return function () {
                can.undelegate.call(el, selector, ev, callback);
            };
        },

        // Calls bind or unbind depending if there is a selector.
        binder = function (el, ev, callback, selector) {
            return selector ? delegate(el, can.trim(selector), ev, callback) : bind(el, ev, callback);
        },

        basicProcessor;


    var Control = can.Control = can.Construct(

    {
        // Setup pre-processes which methods are event listeners.
        setup: function () {

            // Allow contollers to inherit "defaults" from super-classes as it 
            // done in `can.Construct`
            can.Construct.setup.apply(this, arguments);

            // If you didn't provide a name, or are `control`, don't do anything.
            if (can.Control) {

                // Cache the underscored names.
                var control = this,
                    funcName;

                // Calculate and cache actions.
                control.actions = {};
                for (funcName in control.prototype) {
                    if (control._isAction(funcName)) {
                        control.actions[funcName] = control._action(funcName);
                    }
                }
            }
        },

        // Moves `this` to the first argument, wraps it with `jQuery` if it's an element
        _shifter: function (context, name) {

            var method = typeof name == "string" ? context[name] : name;

            if (!isFunction(method)) {
                method = context[method];
            }

            return function () {
                context.called = name;
                return method.apply(context, [this.nodeName ? can.$(this) : this].concat(slice.call(arguments, 0)));
            };
        },

        // Return `true` if is an action.
        _isAction: function (methodName) {

            var val = this.prototype[methodName],
                type = typeof val;
            // if not the constructor
            return (methodName !== 'constructor') &&
            // and is a function or links to a function
            (type == "function" || (type == "string" && isFunction(this.prototype[val]))) &&
            // and is in special, a processor, or has a funny character
            !! (special[methodName] || processors[methodName] || /[^\w]/.test(methodName));
        },
        // Takes a method name and the options passed to a control
        // and tries to return the data necessary to pass to a processor
        // (something that binds things).
        _action: function (methodName, options) {

            // If we don't have options (a `control` instance), we'll run this 
            // later.  
            paramReplacer.lastIndex = 0;
            if (options || !paramReplacer.test(methodName)) {
                // If we have options, run sub to replace templates `{}` with a
                // value from the options or the window
                var convertedName = options ? can.sub(methodName, [options, window]) : methodName;
                if (!convertedName) {
                    return null;
                }
                // If a `{}` template resolves to an object, `convertedName` will be
                // an array
                var arr = can.isArray(convertedName),

                    // Get the name
                    name = arr ? convertedName[1] : convertedName,

                    // Grab the event off the end
                    parts = name.split(/\s+/g),
                    event = parts.pop();

                return {
                    processor: processors[event] || basicProcessor,
                    parts: [name, parts.join(" "), event],
                    delegate: arr ? convertedName[0] : undefined
                };
            }
        },
        // An object of `{eventName : function}` pairs that Control uses to 
        // hook up events auto-magically.
        processors: {},
        // A object of name-value pairs that act as default values for a 
        // control instance
        defaults: {}
    },

    {
        // Sets `this.element`, saves the control in `data, binds event
        // handlers.
        setup: function (element, options) {

            var cls = this.constructor,
                pluginname = cls.pluginName || cls._fullName,
                arr;

            // Want the raw element here.
            this.element = can.$(element)

            if (pluginname && pluginname !== 'can_control') {
                // Set element and `className` on element.
                this.element.addClass(pluginname);
            }

            (arr = can.data(this.element, "controls")) || can.data(this.element, "controls", arr = []);
            arr.push(this);

            // Option merging.
            this.options = extend({}, cls.defaults, options);

            // Bind all event handlers.
            this.on();

            // Get's passed into `init`.
            return [this.element, this.options];
        },

        on: function (el, selector, eventName, func) {
            if (!el) {

                // Adds bindings.
                this.off();

                // Go through the cached list of actions and use the processor 
                // to bind
                var cls = this.constructor,
                    bindings = this._bindings,
                    actions = cls.actions,
                    element = this.element,
                    destroyCB = can.Control._shifter(this, "destroy"),
                    funcName, ready;

                for (funcName in actions) {
                    // Only push if we have the action and no option is `undefined`
                    if (actions.hasOwnProperty(funcName) && (ready = actions[funcName] || cls._action(funcName, this.options))) {
                        bindings.push(ready.processor(ready.delegate || element, ready.parts[2], ready.parts[1], funcName, this));
                    }
                }


                // Setup to be destroyed...  
                // don't bind because we don't want to remove it.
                can.bind.call(element, "destroyed", destroyCB);
                bindings.push(function (el) {
                    can.unbind.call(el, "destroyed", destroyCB);
                });
                return bindings.length;
            }

            if (typeof el == 'string') {
                func = eventName;
                eventName = selector;
                selector = el;
                el = this.element;
            }

            if (func === undefined) {
                func = eventName;
                eventName = selector;
                selector = null;
            }

            if (typeof func == 'string') {
                func = can.Control._shifter(this, func);
            }

            this._bindings.push(binder(el, eventName, func, selector));

            return this._bindings.length;
        },
        // Unbinds all event handlers on the controller.
        off: function () {
            var el = this.element[0]
            each(this._bindings || [], function (value) {
                value(el);
            });
            // Adds bindings.
            this._bindings = [];
        },
        // Prepares a `control` for garbage collection
        destroy: function () {
            var Class = this.constructor,
                pluginName = Class.pluginName || Class._fullName,
                controls;

            // Unbind bindings.
            this.off();

            if (pluginName && pluginName !== 'can_control') {
                // Remove the `className`.
                this.element.removeClass(pluginName);
            }

            // Remove from `data`.
            controls = can.data(this.element, "controls");
            controls.splice(can.inArray(this, controls), 1);

            can.trigger(this, "destroyed"); // In case we want to know if the `control` is removed.
            this.element = null;
        }
    });

    var processors = can.Control.processors,
        // Processors do the binding.
        // They return a function that unbinds when called.  
        // The basic processor that binds events.
        basicProcessor = function (el, event, selector, methodName, control) {
            return binder(el, event, can.Control._shifter(control, methodName), selector);
        };

    // Set common events to be processed as a `basicProcessor`
    each(["change", "click", "contextmenu", "dblclick", "keydown", "keyup", "keypress", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "reset", "resize", "scroll", "select", "submit", "focusin", "focusout", "mouseenter", "mouseleave",
    // #104 - Add touch events as default processors
    // TOOD feature detect?
    "touchstart", "touchmove", "touchcancel", "touchend", "touchleave"], function (v) {
        processors[v] = basicProcessor;
    });

    return Control;
});