/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/construct'], function (can) {
    // ## observe.js  
    // `can.Observe`  
    // _Provides the observable pattern for JavaScript Objects._  
    // Returns `true` if something is an object with properties of its own.
    var canMakeObserve = function (obj) {
        return obj && (can.isArray(obj) || can.isPlainObject(obj) || (obj instanceof can.Observe));
    },

        // Removes all listeners.
        unhookup = function (items, namespace) {
            return can.each(items, function (item) {
                if (item && item.unbind) {
                    item.unbind("change" + namespace);
                }
            });
        },
        // Listens to changes on `val` and "bubbles" the event up.  
        // `val` - The object to listen for changes on.  
        // `prop` - The property name is at on.  
        // `parent` - The parent object of prop.
        // `ob` - (optional) The Observe object constructor
        // `list` - (optional) The observable list constructor
        hookupBubble = function (val, prop, parent, Ob, List) {
            Ob = Ob || Observe;
            List = List || Observe.List;

            // If it's an `array` make a list, otherwise a val.
            if (val instanceof Observe) {
                // We have an `observe` already...
                // Make sure it is not listening to this already
                unhookup([val], parent._cid);
            } else if (can.isArray(val)) {
                val = new List(val);
            } else {
                val = new Ob(val);
            }

            // Listen to all changes and `batchTrigger` upwards.
            val.bind("change" + parent._cid, function () {
                // `batchTrigger` the type on this...
                var args = can.makeArray(arguments),
                    ev = args.shift();
                args[0] = (prop === "*" ? [parent.indexOf(val), args[0]] : [prop, args[0]]).join(".");

                // track objects dispatched on this observe		
                ev.triggeredNS = ev.triggeredNS || {};

                // if it has already been dispatched exit
                if (ev.triggeredNS[parent._cid]) {
                    return;
                }

                ev.triggeredNS[parent._cid] = true;
                // send change event with modified attr to parent	
                can.trigger(parent, ev, args);
                // send modified attr event to parent
                //can.trigger(parent, args[0], args);
            });

            return val;
        },

        // An `id` to track events for a given observe.
        observeId = 0,
        // A helper used to serialize an `Observe` or `Observe.List`.  
        // `observe` - The observable.  
        // `how` - To serialize with `attr` or `serialize`.  
        // `where` - To put properties, in an `{}` or `[]`.
        serialize = function (observe, how, where) {
            // Go through each property.
            observe.each(function (val, name) {
                // If the value is an `object`, and has an `attrs` or `serialize` function.
                where[name] = canMakeObserve(val) && can.isFunction(val[how]) ?
                // Call `attrs` or `serialize` to get the original data back.
                val[how]() :
                // Otherwise return the value.
                val;
            });
            return where;
        },
        $method = function (name) {
            return function () {
                return can[name].apply(this, arguments);
            };
        },
        bind = $method('addEvent'),
        unbind = $method('removeEvent'),
        attrParts = function (attr, keepKey) {
            if (keepKey) {
                return [attr];
            }
            return can.isArray(attr) ? attr : ("" + attr).split(".");
        },
        // Which batch of events this is for -- might not want to send multiple
        // messages on the same batch.  This is mostly for event delegation.
        batchNum = 1,
        // how many times has start been called without a stop
        transactions = 0,
        // an array of events within a transaction
        batchEvents = [],
        stopCallbacks = [];




    var Observe = can.Observe = can.Construct({

        // keep so it can be overwritten
        bind: bind,
        unbind: unbind,
        id: "id",
        canMakeObserve: canMakeObserve,
        // starts collecting events
        // takes a callback for after they are updated
        // how could you hook into after ejs
        startBatch: function (batchStopHandler) {
            transactions++;
            batchStopHandler && stopCallbacks.push(batchStopHandler);
        },

        stopBatch: function (force, callStart) {
            if (force) {
                transactions = 0;
            } else {
                transactions--;
            }

            if (transactions == 0) {
                var items = batchEvents.slice(0),
                    callbacks = stopCallbacks.slice(0);
                batchEvents = [];
                stopCallbacks = [];
                batchNum++;
                callStart && this.startBatch();
                can.each(items, function (args) {
                    can.trigger.apply(can, args);
                });
                can.each(callbacks, function (cb) {
                    cb();
                });
            }
        },

        triggerBatch: function (item, event, args) {
            // Don't send events if initalizing.
            if (!item._init) {
                if (transactions == 0) {
                    return can.trigger(item, event, args);
                } else {
                    event = typeof event === "string" ? {
                        type: event
                    } : event;
                    event.batchNum = batchNum;
                    batchEvents.push([
                    item, event, args]);
                }
            }
        },

        keys: function (observe) {
            var keys = [];
            Observe.__reading && Observe.__reading(observe, '__keys');
            for (var keyName in observe._data) {
                keys.push(keyName);
            }
            return keys;
        }
    },

    {
        setup: function (obj) {
            // `_data` is where we keep the properties.
            this._data = {};

            // The namespace this `object` uses to listen to events.
            can.cid(this, ".observe");
            // Sets all `attrs`.
            this._init = 1;
            this.attr(obj);
            this.bind('change' + this._cid, can.proxy(this._changes, this));
            delete this._init;
        },
        _changes: function (ev, attr, how, newVal, oldVal) {
            Observe.triggerBatch(this, {
                type: attr,
                batchNum: ev.batchNum
            }, [newVal, oldVal]);
        },
        _triggerChange: function (attr, how, newVal, oldVal) {
            Observe.triggerBatch(this, "change", can.makeArray(arguments))
        },

        attr: function (attr, val) {
            // This is super obfuscated for space -- basically, we're checking
            // if the type of the attribute is not a `number` or a `string`.
            var type = typeof attr;
            if (type !== "string" && type !== "number") {
                return this._attrs(attr, val)
            } else if (val === undefined) { // If we are getting a value.
                // Let people know we are reading.
                Observe.__reading && Observe.__reading(this, attr)
                return this._get(attr)
            } else {
                // Otherwise we are setting.
                this._set(attr, val);
                return this;
            }
        },

        each: function () {
            Observe.__reading && Observe.__reading(this, '__keys');
            return can.each.apply(undefined, [this.__get()].concat(can.makeArray(arguments)))
        },

        removeAttr: function (attr) {
            // Info if this is List or not
            var isList = this instanceof can.Observe.List,
                // Convert the `attr` into parts (if nested).
                parts = attrParts(attr),
                // The actual property to remove.
                prop = parts.shift(),
                // The current value.
                current = isList ? this[prop] : this._data[prop];

            // If we have more parts, call `removeAttr` on that part.
            if (parts.length) {
                return current.removeAttr(parts)
            } else {
                if (isList) {
                    this.splice(prop, 1)
                } else if (prop in this._data) {
                    // Otherwise, `delete`.
                    delete this._data[prop];
                    // Create the event.
                    if (!(prop in this.constructor.prototype)) {
                        delete this[prop]
                    }
                    // Let others know the number of keys have changed
                    Observe.triggerBatch(this, "__keys");
                    this._triggerChange(prop, "remove", undefined, current);

                }
                return current;
            }
        },
        // Reads a property from the `object`.
        _get: function (attr) {
            var value = typeof attr === 'string' && !! ~attr.indexOf('.') && this.__get(attr);
            if (value) {
                return value;
            }

            // break up the attr (`"foo.bar"`) into `["foo","bar"]`
            var parts = attrParts(attr),
                // get the value of the first attr name (`"foo"`)
                current = this.__get(parts.shift());
            // if there are other attributes to read
            return parts.length ?
            // and current has a value
            current ?
            // lookup the remaining attrs on current
            current._get(parts) :
            // or if there's no current, return undefined
            undefined :
            // if there are no more parts, return current
            current;
        },
        // Reads a property directly if an `attr` is provided, otherwise
        // returns the "real" data object itself.
        __get: function (attr) {
            return attr ? this._data[attr] : this._data;
        },
        // Sets `attr` prop as value on this object where.
        // `attr` - Is a string of properties or an array  of property values.
        // `value` - The raw value to set.
        _set: function (attr, value, keepKey) {
            // Convert `attr` to attr parts (if it isn't already).
            var parts = attrParts(attr, keepKey),
                // The immediate prop we are setting.
                prop = parts.shift(),
                // The current value.
                current = this.__get(prop);

            // If we have an `object` and remaining parts.
            if (canMakeObserve(current) && parts.length) {
                // That `object` should set it (this might need to call attr).
                current._set(parts, value)
            } else if (!parts.length) {
                // We're in "real" set territory.
                if (this.__convert) {
                    value = this.__convert(prop, value)
                }
                this.__set(prop, value, current)
            } else {
                throw "can.Observe: Object does not exist"
            }
        },
        __set: function (prop, value, current) {

            // Otherwise, we are setting it on this `object`.
            // TODO: Check if value is object and transform
            // are we changing the value.
            if (value !== current) {
                // Check if we are adding this for the first time --
                // if we are, we need to create an `add` event.
                var changeType = this.__get().hasOwnProperty(prop) ? "set" : "add";

                // Set the value on data.
                this.___set(prop,

                // If we are getting an object.
                canMakeObserve(value) ?

                // Hook it up to send event.
                hookupBubble(value, prop, this) :
                // Value is normal.
                value);

                if (changeType == "add") {
                    // If there is no current value, let others know that
                    // the the number of keys have changed
                    Observe.triggerBatch(this, "__keys", undefined);

                }
                // `batchTrigger` the change event.
                this._triggerChange(prop, changeType, value, current);

                //Observe.triggerBatch(this, prop, [value, current]);
                // If we can stop listening to our old value, do it.
                current && unhookup([current], this._cid);
            }

        },
        // Directly sets a property on this `object`.
        ___set: function (prop, val) {
            this._data[prop] = val;
            // Add property directly for easy writing.
            // Check if its on the `prototype` so we don't overwrite methods like `attrs`.
            if (!(prop in this.constructor.prototype)) {
                this[prop] = val
            }
        },


        bind: bind,

        unbind: unbind,

        serialize: function () {
            return serialize(this, 'serialize', {});
        },

        _attrs: function (props, remove) {

            if (props === undefined) {
                return serialize(this, 'attr', {})
            }

            props = can.extend({}, props);
            var prop, self = this,
                newVal;
            Observe.startBatch();
            this.each(function (curVal, prop) {
                newVal = props[prop];

                // If we are merging...
                if (newVal === undefined) {
                    remove && self.removeAttr(prop);
                    return;
                }

                if (self.__convert) {
                    newVal = self.__convert(prop, newVal)
                }

                // if we're dealing with models, want to call _set to let converter run
                if (newVal instanceof can.Observe) {
                    self.__set(prop, newVal, curVal)
                    // if its an object, let attr merge
                } else if (canMakeObserve(curVal) && canMakeObserve(newVal) && curVal.attr) {
                    curVal.attr(newVal, remove)
                    // otherwise just set
                } else if (curVal != newVal) {
                    self.__set(prop, newVal, curVal)
                }

                delete props[prop];
            })
            // Add remaining props.
            for (var prop in props) {
                newVal = props[prop];
                this._set(prop, newVal, true)
            }
            Observe.stopBatch()
            return this;
        },


        compute: function (prop) {
            var self = this,
                computer = function (val) {
                    return self.attr(prop, val);
                };

            return can.compute ? can.compute(computer) : computer;
        }
    });
    // Helpers for `observable` lists.
    var splice = [].splice,
        list = Observe(

        {
            setup: function (instances, options) {
                this.length = 0;
                can.cid(this, ".observe")
                this._init = 1;
                if (can.isDeferred(instances)) {
                    this.replace(instances)
                } else {
                    this.push.apply(this, can.makeArray(instances || []));
                }
                this.bind('change' + this._cid, can.proxy(this._changes, this));
                can.extend(this, options);
                delete this._init;
            },
            _triggerChange: function (attr, how, newVal, oldVal) {

                Observe.prototype._triggerChange.apply(this, arguments)
                // `batchTrigger` direct add and remove events...
                if (!~attr.indexOf('.')) {

                    if (how === 'add') {
                        Observe.triggerBatch(this, how, [newVal, +attr]);
                        Observe.triggerBatch(this, 'length', [this.length]);
                    } else if (how === 'remove') {
                        Observe.triggerBatch(this, how, [oldVal, +attr]);
                        Observe.triggerBatch(this, 'length', [this.length]);
                    } else {
                        Observe.triggerBatch(this, how, [newVal, +attr])
                    }

                }

            },
            __get: function (attr) {
                return attr ? this[attr] : this;
            },
            ___set: function (attr, val) {
                this[attr] = val;
                if (+attr >= this.length) {
                    this.length = (+attr + 1)
                }
            },
            // Returns the serialized form of this list.
            serialize: function () {
                return serialize(this, 'serialize', []);
            },

            splice: function (index, howMany) {
                var args = can.makeArray(arguments),
                    i;

                for (i = 2; i < args.length; i++) {
                    var val = args[i];
                    if (canMakeObserve(val)) {
                        args[i] = hookupBubble(val, "*", this, this.constructor.Observe, this.constructor)
                    }
                }
                if (howMany === undefined) {
                    howMany = args[1] = this.length - index;
                }
                var removed = splice.apply(this, args);
                can.Observe.startBatch();
                if (howMany > 0) {
                    this._triggerChange("" + index, "remove", undefined, removed);
                    unhookup(removed, this._cid);
                }
                if (args.length > 2) {
                    this._triggerChange("" + index, "add", args.slice(2), removed);
                }
                can.Observe.stopBatch();
                return removed;
            },

            _attrs: function (items, remove) {
                if (items === undefined) {
                    return serialize(this, 'attr', []);
                }

                // Create a copy.
                items = can.makeArray(items);

                Observe.startBatch();
                this._updateAttrs(items, remove);
                Observe.stopBatch()
            },

            _updateAttrs: function (items, remove) {
                var len = Math.min(items.length, this.length);

                for (var prop = 0; prop < len; prop++) {
                    var curVal = this[prop],
                        newVal = items[prop];

                    if (canMakeObserve(curVal) && canMakeObserve(newVal)) {
                        curVal.attr(newVal, remove)
                    } else if (curVal != newVal) {
                        this._set(prop, newVal)
                    } else {

                    }
                }
                if (items.length > this.length) {
                    // Add in the remaining props.
                    this.push.apply(this, items.slice(this.length));
                } else if (items.length < this.length && remove) {
                    this.splice(items.length)
                }
            }
        }),

        // Converts to an `array` of arguments.
        getArgs = function (args) {
            return args[0] && can.isArray(args[0]) ? args[0] : can.makeArray(args);
        };
    // Create `push`, `pop`, `shift`, and `unshift`
    can.each({

        push: "length",

        unshift: 0
    },
    // Adds a method
    // `name` - The method name.
    // `where` - Where items in the `array` should be added.


    function (where, name) {
        var orig = [][name]
        list.prototype[name] = function () {
            // Get the items being added.
            var args = [],
                // Where we are going to add items.
                len = where ? this.length : 0,
                i = arguments.length,
                res, val, constructor = this.constructor;

            // Go through and convert anything to an `observe` that needs to be converted.
            while (i--) {
                val = arguments[i];
                args[i] = canMakeObserve(val) ? hookupBubble(val, "*", this, this.constructor.Observe, this.constructor) : val;
            }

            // Call the original method.
            res = orig.apply(this, args);

            if (!this.comparator || args.length) {

                this._triggerChange("" + len, "add", args, undefined);
            }

            return res;
        }
    });

    can.each({

        pop: "length",

        shift: 0
    },
    // Creates a `remove` type method


    function (where, name) {
        list.prototype[name] = function () {

            var args = getArgs(arguments),
                len = where && this.length ? this.length - 1 : 0;

            var res = [][name].apply(this, args)

            // Create a change where the args are
            // `*` - Change on potentially multiple properties.
            // `remove` - Items removed.
            // `undefined` - The new values (there are none).
            // `res` - The old, removed values (should these be unbound).
            // `len` - Where these items were removed.
            this._triggerChange("" + len, "remove", undefined, [res])

            if (res && res.unbind) {
                res.unbind("change" + this._cid)
            }
            return res;
        }
    });

    can.extend(list.prototype, {

        indexOf: function (item) {
            this.attr('length')
            return can.inArray(item, this)
        },


        join: [].join,


        reverse: [].reverse,


        slice: function () {
            var temp = Array.prototype.slice.apply(this, arguments);
            return new this.constructor(temp);
        },


        concat: function () {
            var args = [];
            can.each(can.makeArray(arguments), function (arg, i) {
                args[i] = arg instanceof can.Observe.List ? arg.serialize() : arg;
            });
            return new this.constructor(Array.prototype.concat.apply(this.serialize(), args));
        },


        forEach: function (cb, thisarg) {
            can.each(this, cb, thisarg || this);
        },


        replace: function (newList) {
            if (can.isDeferred(newList)) {
                newList.then(can.proxy(this.replace, this));
            } else {
                this.splice.apply(this, [0, this.length].concat(can.makeArray(newList || [])));
            }

            return this;
        }
    });

    Observe.List = list;
    Observe.setup = function () {
        can.Construct.setup.apply(this, arguments);
        // I would prefer not to do it this way. It should
        // be using the attributes plugin to do this type of conversion.
        this.List = Observe.List({
            Observe: this
        }, {});
    }
    return Observe;
});