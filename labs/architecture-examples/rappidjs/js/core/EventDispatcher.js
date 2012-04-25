var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {

    var a = 0;
    rAppid.defineClass("js.core.EventDispatcher",
        ["js.core.Base"],
        /**
         * Base class for trigger and listen to events
         * @export js/core/EventDispatcher
         */

            function (Base) {

            Function.prototype.on = function () {
                var events = Array.prototype.slice.call(arguments, 0);
                this._events = [];
                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    this._events.push(event);
                }
                return this;
            };

            Function.prototype.onChange = function () {
                var events = Array.prototype.slice.call(arguments, 0);
                this._events = [];
                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    event = "change:" + event;
                    this._events.push(event);
                }
                return this;
            };

            var undefinedValue;

            var EventDispatcher = Base.inherit({
                ctor: function () {
                    this.callBase();
                    this._eventHandlers = {};
                },
                bind: function (eventType, callback, scope) {
                    scope = scope || this;
                    // get the list for the event
                    var list = this._eventHandlers[eventType] || (this._eventHandlers[eventType] = []);
                    // and push the callback function
                    list.push(new EventDispatcher.EventHandler(callback, scope));

                    return this;
                },
                /**
                 *
                 * @param {String} eventType
                 * @param {js.core.EventDispatcher.Event|Object} event
                 * @param caller
                 */
                trigger: function (eventType, event, caller) {

                    if (this._eventHandlers[eventType]) {
                        if (!(event instanceof EventDispatcher.Event)) {
                            event = new EventDispatcher.Event(event);
                        }

                        if (!caller) {
                            caller = arguments.callee.caller;
                        }

                        event.type = eventType;

                        var list = this._eventHandlers[eventType];
                        for (var i = 0; i < list.length; i++) {
                            if (list[i]) {
                                var result = list[i].trigger(event, caller);

                                if (result !== undefinedValue) {
                                    ret = result;
                                    if (result === false) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }
                                }

                                if (event.isImmediatePropagationStopped) {
                                    break;
                                }
                            }
                        }
                    }

                    return event;
                },
                unbind: function (eventType, callback) {
                    if (!eventType) {
                        // remove all events
                        this._eventHandlers = {};
                    } else if (!callback) {
                        // remove all callbacks for these event
                        this._eventHandlers[eventType] = [];
                    } else if (this._eventHandlers[eventType]) {
                        var list = this._eventHandlers[eventType];
                        for (var i = list.length - 1; i >= 0; i--) {
                            if (list[i].$callback == callback) {
                                list.splice(i, 1);  // delete callback
                            }
                        }
                    }
                }
            });

            EventDispatcher.Event = Base.inherit({
                ctor: function (attributes) {
                    this.$ = attributes;

                    this.isDefaultPrevented = false;
                    this.isPropagationStopped = false;
                    this.isImmediatePropagationStopped = false;

                },
                preventDefault: function () {
                    this.isDefaultPrevented = true;

                    var e = this.orginalEvent;

                    if (e) {
                        if (e.preventDefault) {
                            e.preventDefault();
                        } else {
                            e.returnValue = false;  // IE
                        }
                    }
                },
                stopPropagation: function () {
                    this.isPropagationStopped = true;

                    var e = this.originalEvent;
                    if (e) {
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }
                        e.cancelBubble = true;
                    }
                },
                stopImmediatePropagation: function () {
                    this.isImmediatePropagationStopped = true;
                    this.stopPropagation();
                }
            });

            EventDispatcher.EventHandler = Base.inherit({
                ctor: function (callback, scope) {
                    this.scope = scope;
                    this.$callback = callback;
                },
                trigger: function (event, caller) {
                    this.$callback.call(this.scope, event, caller);
                }
            });

            return EventDispatcher;
        }
    );
});