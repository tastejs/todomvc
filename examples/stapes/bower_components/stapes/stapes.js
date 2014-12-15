//
//  ____  _                           _
// / ___|| |_ __ _ _ __   ___  ___   (_)___  (*)
// \___ \| __/ _` | '_ \ / _ \/ __|  | / __|
//  ___) | || (_| | |_) |  __/\__ \_ | \__ \
// |____/ \__\__,_| .__/ \___||___(_)/ |___/
//              |_|              |__/
//
// (*) a (really) tiny Javascript MVC microframework
//
// (c) Hay Kranen < hay@bykr.org >
// Version 0.2 - Released under the terms of the MIT license
// < http://en.wikipedia.org/wiki/MIT_License >
//
// Stapes.js : http://hay.github.com/stapes

(function() {
    var VERSION = "0.2.1";

    /** Utility functions
     *
     *  Note that these functions are only used inside Stapes, and therefore
     *  aren't that failsafe as the options in libraries
     *  such as Underscore.js, so that's why they're not usable outside
     *  the private scope.
     */
    var util = {
        bind : function(fn, ctx) {
            if (Function.prototype.bind) {
                // Native
                return fn.bind(ctx);
            } else {
                // Non-native
                return function() {
                    return fn.apply(ctx, arguments);
                };
            }
        },

        create : function(context) {
            var instance;

            if (typeof Object.create === "function") {
                // Native
                instance = Object.create(context);
            } else {
                // Non-native
                var F = function(){};
                F.prototype = context;
                instance = new F();
            }

            instance._guid = guid++;
            Stapes._attributes[instance._guid] = {};
            Stapes._eventHandlers[instance._guid] = {};

            return instance;
        },

        each : function(list, fn) {
            if (util.isArray(list)) {
                if (Array.prototype.forEach) {
                    // Native forEach
                    list.forEach( fn );
                } else {
                    for (var i = 0, l = list.length; i < l; i++) {
                        fn( list[i], i);
                    }
                }
            } else {
                for (var key in list) {
                    fn( list[key], key );
                }
            }
        },

        isArray : function(val) {
            return Object.prototype.toString.call( val ) === "[object Array]";
        },

        isObject : function(val) {
            return (typeof val === "object") && (!util.isArray(val) && val !== null);
        },

        // from http://stackoverflow.com/a/2117523/152809
        makeUuid : function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        toArray : function(val) {
            if (util.isObject(val)) {
                return util.values(val);
            } else {
                return Array.prototype.slice.call(val, 0);
            }
        },

        values : function(obj) {
            var values = [];

            util.each(obj, function(value, key) {
                values.push(value);
            });

            return values;
        }
    };

    /** Private helper functions */
    function addEvent(event) {
        // If we don't have any handlers for this type of event, add a new
        // array we can use to push new handlers
        if (!Stapes._eventHandlers[event.guid][event.type]) {
            Stapes._eventHandlers[event.guid][event.type] = [];
        }

        // Push an event object
        Stapes._eventHandlers[event.guid][event.type].push({
            "guid" : event.guid,
            "handler" : event.handler,
            "scope" : event.scope,
            "type" : event.type
        });
    }

    function addEventHandler(argTypeOrMap, argHandlerOrScope, argScope) {
        var eventMap = {},
            scope;

        if (typeof argTypeOrMap === "string") {
            scope = argScope || false;
            eventMap[ argTypeOrMap ] = argHandlerOrScope;
        } else {
            scope = argHandlerOrScope || false;
            eventMap = argTypeOrMap;
        }

        util.each(eventMap, util.bind(function(handler, eventString) {
            var events = eventString.split(" ");

            util.each(events, util.bind(function(eventType) {
                addEvent.call(this, {
                    "guid" : this._guid,
                    "handler" : handler,
                    "scope" : scope,
                    "type" : eventType
                });
            }, this));
        }, this));
    }

    function emitEvents(type, data, explicitType, explicitGuid) {
        explicitType = explicitType || false;
        explicitGuid = explicitGuid || this._guid;

        util.each(Stapes._eventHandlers[explicitGuid][type], util.bind(function(event) {
            var scope = (event.scope) ? event.scope : this;
            if (explicitType) {
                event.type = explicitType;
            }
            event.scope = scope;
            event.handler.call(event.scope, data, event);
        }, this));
    }

    function setAttribute(key, value) {
        // We need to do this before we actually add the item :)
        var itemExists = this.has(key);

        // Actually add the item to the attributes
        Stapes._attributes[this._guid][key] = value;

        // Throw a generic event
        this.emit('change', key);

        // And a namespaced event as well, NOTE that we pass value instead of
        // key here!
        this.emit('change:' + key, value);

        // Also throw a specific event for this type of set
        var specificEvent = itemExists ? 'update' : 'create';

        this.emit(specificEvent, key);

        // And a namespaced event as well, NOTE that we pass value instead of key
        this.emit(specificEvent + ':' + key, value);
    }

    var guid = 1;

    var Module = {
        create : function() {
            return util.create(this);
        },

        emit : function(types, data) {
            data = data || null;

            util.each(types.split(" "), util.bind(function(type) {
                // First 'all' type events: is there an 'all' handler in the
                // global stack?
                if (Stapes._eventHandlers[-1].all) {
                    emitEvents.call(this, "all", data, type, -1);
                }

                // Catch all events for this type?
                if (Stapes._eventHandlers[-1][type]) {
                    emitEvents.call(this, type, data, type, -1);
                }

                if (typeof this._guid == 'number') {
                    // 'all' event for this specific module?
                    if (Stapes._eventHandlers[this._guid]["all"]) {
                        emitEvents.call(this, "all", data, type);
                    }

                    // Finally, normal events :)
                    if (Stapes._eventHandlers[this._guid][type]) {
                        emitEvents.call(this, type, data);
                    }
                }
            }, this));
        },

        extend : function(objectOrValues, valuesIfObject) {
            var object = (valuesIfObject) ? objectOrValues : this,
                values = (valuesIfObject) ? valuesIfObject : objectOrValues;

            util.each(values, function(value, key) {
                object[key] = value;
            });

            return this;
        },

        filter : function(fn) {
            var items = [];

            util.each(Stapes._attributes[this._guid], function(item) {
                if (fn(item)) {
                    items.push(item);
                }
            });

            return items;
        },

        get : function(input) {
            if (typeof input === "string") {
                return this.has(input) ? Stapes._attributes[this._guid][input] : null;
            } else if (typeof input === "function") {
                var items = this.filter(input);
                return (items.length) ? items[0] : false;
            }
        },

        getAll : function() {
            return Stapes._attributes[this._guid];
        },

        getAllAsArray : function() {
            var arr = [];

            util.each(Stapes._attributes[this._guid], function(value, key) {
                if (util.isObject(value)) {
                    value.id = key;
                }

                arr.push(value);
            });

            return arr;

        },

        has : function(key) {
            return (typeof Stapes._attributes[this._guid][key] !== "undefined");
        },

        init : function() {
            this.emit('ready');
            return this;
        },

        on : function() {
            addEventHandler.apply(this, arguments);
        },

        // Akin to set(), but makes a unique id
        push : function(input) {
            if (util.isArray(input)) {
                util.each(input, util.bind(function(value) {
                    setAttribute.call(this, util.makeUuid(), value);
                }, this));

                this.emit('changemany createmany', util.toArray(input).length);
            } else {
                setAttribute.call(this, util.makeUuid(), input);
            }
        },

        remove : function(input) {
            if (typeof input === "function") {
                util.each(Stapes._attributes[this._guid], util.bind(function(item, key) {
                    if (input(item)) {
                        delete Stapes._attributes[this._guid][key];
                        this.emit('remove change');
                    }
                }, this));
            } else {
                if (typeof input === "string") {
                    input = [input];
                }

                util.each(util.toArray(input), util.bind(function(id) {
                    if (this.has(id)) {
                        delete Stapes._attributes[this._guid][id];
                        this.emit('remove change');
                    }
                }, this));
            }
        },

        set : function(objOrKey, value) {
            if (util.isObject(objOrKey)) {
                util.each(objOrKey, util.bind(function(value, key) {
                    setAttribute.call(this, key, value);
                }, this));

                this.emit('changemany', objOrKey.length);
            } else {
                setAttribute.call(this, objOrKey, value);
            }
        },

        update : function(key, fn) {
            var item = this.get(key);
            setAttribute.call(this, key, fn( item ));
        }
    };

    var Stapes = {
        "_attributes" : {},

        "_eventHandlers" : {
            "-1" : {} // '-1' is used for the global event handling
        },

        "_guid" : -1,

        "create" : function() {
            return util.create(Module);
        },

        "extend" : function(obj) {
            util.each(obj, function(value, key) {
                Module[key] = value;
            });
        },

        "on" : function() {
            addEventHandler.apply(this, arguments);
        },

        "version" : VERSION
    };

    // This library can be used as an AMD module, a Node.js module, or an
    // old fashioned global
    if (typeof exports !== "undefined") {
        // Server
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = Stapes;
        }
        exports.Stapes = Stapes;
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define(function() {
            return Stapes;
        });
    } else {
        // Global scope
        window.Stapes = Stapes;
    }
})();