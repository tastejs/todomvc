/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/util/bind", "can/construct", "can/util/batch"], function (can, bind) {
	// ## map.js  
	// `can.Map`  
	// _Provides the observable pattern for JavaScript Objects._  
	//  
	// Removes all listeners.
	var bindToChildAndBubbleToParent = function (child, prop, parent) {
		can.listenTo.call(parent, child, "change", function ( /* ev, attr */ ) {
			// `batchTrigger` the type on this...
			var args = can.makeArray(arguments),
				ev = args.shift();
			args[0] = (prop === "*" ? [parent.indexOf(child), args[0]] : [prop, args[0]])
				.join(".");

			// track objects dispatched on this map		
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
	};
	var attrParts = function (attr, keepKey) {
		if (keepKey) {
			return [attr];
		}
		return can.isArray(attr) ? attr : ("" + attr)
			.split(".");
	};
	var makeBindSetup = function (wildcard) {
		return function () {
			var parent = this;
			this._each(function (child, prop) {
				if (child && child.bind) {
					bindToChildAndBubbleToParent(child, wildcard || prop, parent);
				}
			});
		};
	};
	// A map that temporarily houses a reference
	// to maps that have already been made for a plain ole JS object
	var madeMap = null;
	var teardownMap = function () {
		for (var cid in madeMap) {
			if (madeMap[cid].added) {
				delete madeMap[cid].obj._cid;
			}
		}
		madeMap = null;
	};
	var getMapFromObject = function (obj) {
		return madeMap && madeMap[obj._cid] && madeMap[obj._cid].instance;
	};

	/**
	 * @add can.Map
	 */
	//
	var Map = can.Map = can.Construct.extend({
			/**
			 * @static
			 */
			setup: function () {

				can.Construct.setup.apply(this, arguments);

				if (can.Map) {
					if (!this.defaults) {
						this.defaults = {};
					}
					// a list of the compute properties
					this._computes = [];
					for (var prop in this.prototype) {
						if (typeof this.prototype[prop] !== "function") {
							this.defaults[prop] = this.prototype[prop];
						} else if (this.prototype[prop].isComputed) {
							this._computes.push(prop);
						}
					}
				}
				// if we inerit from can.Map, but not can.List
				if (can.List && !(this.prototype instanceof can.List)) {
					this.List = Map.List({
						Map: this
					}, {});
				}

			},
			_computes: [],
			// keep so it can be overwritten
			bind: can.bindAndSetup,
			on: can.bindAndSetup,
			unbind: can.unbindAndTeardown,
			off: can.unbindAndTeardown,
			id: "id",
			helpers: {
				addToMap: function (obj, instance) {
					var teardown;
					if (!madeMap) {
						teardown = teardownMap;
						madeMap = {};
					}
					// record if it has a Cid before we add one
					var hasCid = obj._cid;
					var cid = can.cid(obj);

					// only update if there already isn't one
					if (!madeMap[cid]) {

						madeMap[cid] = {
							obj: obj,
							instance: instance,
							added: !hasCid
						};
					}
					return teardown;
				},

				canMakeObserve: function (obj) {
					return obj && !can.isDeferred(obj) && (can.isArray(obj) || can.isPlainObject(obj) || (obj instanceof can.Map));
				},
				unhookup: function (items, parent) {
					return can.each(items, function (item) {
						if (item && item.unbind) {
							can.stopListening.call(parent, item, "change");
						}
					});
				},
				// Listens to changes on `child` and "bubbles" the event up.  
				// `child` - The object to listen for changes on.  
				// `prop` - The property name is at on.  
				// `parent` - The parent object of prop.
				// `ob` - (optional) The Map object constructor
				// `list` - (optional) The observable list constructor
				hookupBubble: function (child, prop, parent, Ob, List) {
					Ob = Ob || Map;
					List = List || can.List;

					// If it's an `array` make a list, otherwise a child.
					if (child instanceof Map) {
						// We have an `map` already...
						// Make sure it is not listening to this already
						// It's only listening if it has bindings already.
						if (parent._bindings) {
							Map.helpers.unhookup([child], parent);
						}
					} else if (can.isArray(child)) {
						child = getMapFromObject(child) || new List(child);
					} else {
						child = getMapFromObject(child) || new Ob(child);
					}
					// only listen if something is listening to you
					if (parent._bindings) {
						// Listen to all changes and `batchTrigger` upwards.
						bindToChildAndBubbleToParent(child, prop, parent);
					}

					return child;
				},
				// A helper used to serialize an `Map` or `Map.List`.  
				// `map` - The observable.  
				// `how` - To serialize with `attr` or `serialize`.  
				// `where` - To put properties, in an `{}` or `[]`.
				serialize: function (map, how, where) {
					// Go through each property.
					map.each(function (val, name) {
						// If the value is an `object`, and has an `attrs` or `serialize` function.
						where[name] = Map.helpers.canMakeObserve(val) && can.isFunction(val[how]) ?
						// Call `attrs` or `serialize` to get the original data back.
						val[how]() :
						// Otherwise return the value.
						val;

						if (can.__reading) {
							can.__reading(map, name);
						}
					});

					if (can.__reading) {
						can.__reading(map, '__keys');
					}

					return where;
				},
				makeBindSetup: makeBindSetup
			},

			// starts collecting events
			// takes a callback for after they are updated
			// how could you hook into after ejs
			/**
			 * @function can.Map.keys keys
			 * @parent can.Map.static
			 * @description Iterate over the keys of an Map.
			 * @signature `can.Map.keys(map)`
			 * @param {can.Map} map the `can.Map` to get the keys from
			 * @return {Array} array An array containing the keys from _map_.
			 *
			 * @body
			 * `keys` iterates over an map to get an array of its keys.
			 *
			 * @codestart
			 * var people = new can.Map({
			 *     a: 'Alice',
			 *     b: 'Bob',
			 *     e: 'Eve'
			 * });
			 *
			 * can.Map.keys(people); // ['a', 'b', 'e']
			 * @codeend
			 */
			keys: function (map) {
				var keys = [];
				if (can.__reading) {
					can.__reading(map, '__keys');
				}
				for (var keyName in map._data) {
					keys.push(keyName);
				}
				return keys;
			}
		},
		/**
		 * @prototype
		 */
		{
			setup: function (obj) {
				// `_data` is where we keep the properties.
				this._data = {};
				/**
				 * @property {String} can.Map.prototype._cid
				 * @hide
				 *
				 * A globally unique ID for this `can.Map` instance.
				 */
				// The namespace this `object` uses to listen to events.
				can.cid(this, ".map");
				// Sets all `attrs`.
				this._init = 1;
				this._setupComputes();
				var teardownMapping = obj && can.Map.helpers.addToMap(obj, this);
				/**
				 * @property {*} can.Map.prototype.DEFAULT-ATTR
				 *
				 * @description Specify a default property and value.
				 *
				 * @option {*} A value of any type other than a function that will
				 * be set as the `DEFAULT-ATTR` attribute's value.
				 *
				 * @body
				 *
				 * ## Use
				 *
				 * When extending [can.Map], if a prototype property is not a function,
				 * it is used as a default value on instances of the extended Map.  For example:
				 *
				 *     var Paginate = can.Map.extend({
				 *       limit: 20,
				 *       offset: 0,
				 *       next: function(){
				 *         this.attr("offset", this.attr("offset")+this.attr("limit"))
				 *       }
				 *     });
				 *
				 *     var paginate = new Paginate({limit: 30});
				 *
				 *     paginate.attr("offset") //-> 0
				 *     paginate.attr("limit")  //-> 30
				 *
				 *     paginate.next();
				 *
				 *     paginate.attr("offset") //-> 30
				 */
				var data = can.extend(can.extend(true, {}, this.constructor.defaults || {}), obj);
				this.attr(data);

				if (teardownMapping) {
					teardownMapping();
				}

				this.bind('change', can.proxy(this._changes, this));

				delete this._init;
			},
			/**
			 * @property {can.compute} can.Map.prototype.COMPUTE-ATTR
			 *
			 * @description Specify an attribute that is computed from other attributes.
			 *
			 * @option {can.compute} A compute that reads values on instances of the
			 * map and returns a derived value.  The compute may also be a getter-setter
			 * compute and able to be passed a value.
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * When extending [can.Map], if a prototype property is a [can.compute]
			 * it will setup that compute to behave like a normal attribute. This means
			 * that it can be read and written to with [can.Map::attr attr] and bound to
			 * with [can.Map::bind bind].
			 *
			 * The following example makes a `fullName` attribute on `Person` maps:
			 *
			 *     var Person = can.Map.extend({
			 *       fullName: can.compute(function(){
			 *         return this.attr("first")+" "+this.attr("last")
			 *       })
			 *     })
			 *
			 *     var me = new Person({first: "Justin", last: "Meyer"})
			 *
			 *     me.attr("fullName") //-> "Justin Meyer"
			 *
			 *     me.bind("fullName", function(ev, newValue, oldValue){
			 *       newValue //-> Brian Moschel
			 *       oldValue //-> Justin Meyer
			 *     })
			 *
			 *     me.attr({first: "Brian", last: "Moschel"})
			 *
			 * ## Getter / Setter computes
			 *
			 * A compute's setter will be called if [can.Map::attr attr] is
			 * used to set the compute-property's value.
			 *
			 * The following makes `fullName` able to set `first` and `last`:
			 *
			 *     var Person = can.Map.extend({
			 *       fullName: can.compute(function(newValue){
			 *         if( arguments.length ) {
			 *           var parts = newValue.split(" ");
			 *           this.attr({
			 *             first: parts[0],
			 *             last:  parts[1]
			 *           });
			 *
			 *         } else {
			 *           return this.attr("first")+" "+this.attr("last");
			 *         }
			 *       })
			 *     })
			 *
			 *     var me = new Person({first: "Justin", last: "Meyer"})
			 *
			 *     me.attr("fullName", "Brian Moschel")
			 *     me.attr("first") //-> "Brian"
			 *     me.attr("last")  //-> "Moschel"
			 *
			 *
			 * ## Alternatives
			 *
			 * [can.Mustache] and [can.EJS] will automatically convert any function
			 * read in the template to a can.compute. So, simply having a fullName
			 * function like:
			 *
			 *     var Person = can.Map.extend({
			 *       fullName: function(){
			 *         return this.attr("first")+" "+this.attr("last")
			 *       }
			 *     })
			 *     var me = new Person({first: "Justin", last: "Meyer"})
			 *
			 * Will already be live-bound if read in a template like:
			 *
			 *     {{me.fullName}}
			 *     <%= me.attr("fullName") %>
			 *
			 * The [can.Map.setter setter] plugin can also provide similar functionality as
			 * Getter/Setter computes.
			 */
			_setupComputes: function () {
				var computes = this.constructor._computes;
				this._computedBindings = {};
				for (var i = 0, len = computes.length, prop; i < len; i++) {
					prop = computes[i];
					this[prop] = this[prop].clone(this);
					this._computedBindings[prop] = {
						count: 0
					};
				}
			},
			_bindsetup: makeBindSetup(),
			_bindteardown: function () {
				var self = this;
				this._each(function (child) {
					Map.helpers.unhookup([child], self);
				});
			},
			_changes: function (ev, attr, how, newVal, oldVal) {
				can.batch.trigger(this, {
					type: attr,
					batchNum: ev.batchNum
				}, [newVal, oldVal]);
			},
			_triggerChange: function (attr, how, newVal, oldVal) {
				can.batch.trigger(this, "change", can.makeArray(arguments));
			},
			// no live binding iterator
			_each: function (callback) {
				var data = this.__get();
				for (var prop in data) {
					if (data.hasOwnProperty(prop)) {
						callback(data[prop], prop);
					}
				}
			},
			/**
			 * @function can.Map.prototype.attr attr
			 * @description Get or set properties on an Map.
			 * @signature `map.attr()`
			 *
			 * Gets a collection of all the properties in this `can.Map`.
			 *
			 * @return {Object<String, *>} an object with all the properties in this `can.Map`.
			 *
			 * @signature `map.attr(key)`
			 *
			 * Reads a property from this `can.Map`.
			 *
			 * @param {String} key the property to read
			 * @return {*} the value assigned to _key_.
			 *
			 * @signature `map.attr(key, value)`
			 *
			 * Assigns _value_ to a property on this `can.Map` called _key_.
			 *
			 * @param {String} key the property to set
			 * @param {*} the value to assign to _key_.
			 * @return {can.Map} this Map, for chaining
			 *
			 * @signature `map.attr(obj[, removeOthers])`
			 *
			 * Assigns each value in _obj_ to a property on this `can.Map` named after the
			 * corresponding key in _obj_, effectively merging _obj_ into the Map.
			 *
			 * @param {Object<String, *>} obj a collection of key-value pairs to set.
			 * If any properties already exist on the `can.Map`, they will be overwritten.
			 *
			 * @param {bool} [removeOthers=false] whether to remove keys not present in _obj_.
			 * To remove keys without setting other keys, use `[can.Map::removeAttr removeAttr]`.
			 *
			 * @return {can.Map} this Map, for chaining
			 *
			 * @body
			 * `attr` gets or sets properties on the `can.Map` it's called on. Here's a tour through
			 * how all of its forms work:
			 *
			 * @codestart
			 * var people = new can.Map({});
			 *
			 * // set a property:
			 * people.attr('a', 'Alex');
			 *
			 * // get a property:
			 * people.attr('a'); // 'Alex'
			 *
			 * // set and merge multiple properties:
			 * people.attr({
			 *     a: 'Alice',
			 *     b: 'Bob'
			 * });
			 *
			 * // get all properties:
			 * people.attr(); // {a: 'Alice', b: 'Bob'}
			 *
			 * // set properties while removing others:
			 * people.attr({
			 *     b: 'Bill',
			 *     e: 'Eve'
			 * }, true);
			 *
			 * people.attr(); // {b: 'Bill', e: 'Eve'}
			 * @codeend
			 *
			 * ## Deep properties
			 *
			 * `attr` can also set and read deep properties. All you have to do is specify
			 * the property name as you normally would if you weren't using `attr`.
			 *
			 * @codestart
			 * var people = new can.Map({names: {}});
			 *
			 * // set a property:
			 * people.attr('names.a', 'Alice');
			 *
			 * // get a property:
			 * people.attr('names.a'); // 'Alice'
			 * people.names.attr('a'); // 'Alice'
			 *
			 * // get all properties:
			 * people.attr(); // {names: {a: 'Alice'}}
			 * @codeend
			 *
			 * Objects that are added to Observes become Observes themselves behind the scenes,
			 * so changes to deep properties fire events at each level, and you can bind at any
			 * level. As this example shows, all the same events are fired no matter what level
			 * you call `attr` at:
			 *
			 * @codestart
			 * var people = new can.Map({names: {}});
			 *
			 * people.bind('change', function(ev, attr, how, newVal, oldVal) {
			 *   console.log('people change: ' + attr + ', ' + how + ', ' + newVal + ', ' + oldVal);
			 * });
			 *
			 * people.names.bind('change', function(ev, attr, how, newVal, oldVal) {
			 *    console.log('people.names change' + attr + ', ' + how + ', ' + newVal + ', ' + oldVal);
			 * });
			 *
			 * people.bind('names', function(ev, newVal, oldVal) {
			 *     console.log('people names: ' + newVal + ', ' + oldVal);
			 * });
			 *
			 * people.names.bind('a', function(ev, newVal, oldVal) {
			 *     console.log('people.names a: ' + newVal + ', ' + oldVal);
			 * });
			 *
			 * people.bind('names.a', function(ev, newVal, oldVal) {
			 *     console.log('people names.a: ' + newVal + ', ' + oldVal);
			 * });
			 *
			 * people.attr('names.a', 'Alice'); // people change: names.a, add, Alice, undefined
			 *                                  // people.names change: a, add, Alice, undefined
			 *                                  // people.names a: Alice, undefined
			 *                                  // people names.a: Alice, undefined
			 *
			 * people.names.attr('b', 'Bob');   // people change: names.b, add, Bob, undefined
			 *                                  // people.names change: b, add, Bob, undefined
			 *                                  // people.names b: Bob, undefined
			 *                                  // people names.b: Bob, undefined
			 * @codeend
			 *
			 * ## See also
			 *
			 * For information on the events that are fired on property changes and how
			 * to listen for those events, see [can.Map.prototype.bind bind].
			 */
			attr: function (attr, val) {
				// This is super obfuscated for space -- basically, we're checking
				// if the type of the attribute is not a `number` or a `string`.
				var type = typeof attr;
				if (type !== "string" && type !== "number") {
					return this._attrs(attr, val);
				} else if (arguments.length === 1) { // If we are getting a value.
					// Let people know we are reading.
					if (can.__reading) {
						can.__reading(this, attr);
					}
					return this._get(attr);
				} else {
					// Otherwise we are setting.
					this._set(attr, val);
					return this;
				}
			},
			/**
			 * @function can.Map.prototype.each each
			 * @description Call a function on each property of an Map.
			 * @signature `map.each( callback(item, propName ) )`
			 *
			 * `each` iterates through the Map, calling a function
			 * for each property value and key.
			 *
			 * @param {function(*,String)} callback(item,propName) the function to call for each property
			 * The value and key of each property will be passed as the first and second
			 * arguments, respectively, to the callback. If the callback returns false,
			 * the loop will stop.
			 *
			 * @return {can.Map} this Map, for chaining
			 *
			 * @body
			 * @codestart
			 * var names = [];
			 * new can.Map({a: 'Alice', b: 'Bob', e: 'Eve'}).each(function(value, key) {
			 *     names.push(value);
			 * });
			 *
			 * names; // ['Alice', 'Bob', 'Eve']
			 *
			 * names = [];
			 * new can.Map({a: 'Alice', b: 'Bob', e: 'Eve'}).each(function(value, key) {
			 *     names.push(value);
			 *     if(key === 'b') {
			 *         return false;
			 *     }
			 * });
			 *
			 * names; // ['Alice', 'Bob']
			 *
			 * @codeend
			 */
			each: function () {
				if (can.__reading) {
					can.__reading(this, '__keys');
				}
				return can.each.apply(undefined, [this.__get()].concat(can.makeArray(arguments)));
			},
			/**
			 * @function can.Map.prototype.removeAttr removeAttr
			 * @description Remove a property from an Map.
			 * @signature `map.removeAttr(attrName)`
			 * @param {String} attrName the name of the property to remove
			 * @return {*} the value of the property that was removed
			 *
			 * @body
			 * `removeAttr` removes a property by name from an Map.
			 *
			 * @codestart
			 * var people = new can.Map({a: 'Alice', b: 'Bob', e: 'Eve'});
			 *
			 * people.removeAttr('b'); // 'Bob'
			 * people.attr();          // {a: 'Alice', e: 'Eve'}
			 * @codeend
			 *
			 * Removing an attribute will cause a _change_ event to fire with `'remove'`
			 * passed as the _how_ parameter and `undefined` passed as the _newVal_ to
			 * handlers. It will also cause a _property name_ event to fire with `undefined`
			 * passed as _newVal_. An in-depth description at these events can be found
			 * under `[can.Map.prototype.attr attr]`.
			 */
			removeAttr: function (attr) {
				// Info if this is List or not
				var isList = can.List && this instanceof can.List,
					// Convert the `attr` into parts (if nested).
					parts = attrParts(attr),
					// The actual property to remove.
					prop = parts.shift(),
					// The current value.
					current = isList ? this[prop] : this._data[prop];

				// If we have more parts, call `removeAttr` on that part.
				if (parts.length && current) {
					return current.removeAttr(parts);
				} else {
					if (!!~attr.indexOf('.')) {
						prop = attr;
					}
					if (isList) {
						this.splice(prop, 1);
					} else if (prop in this._data) {
						// Otherwise, `delete`.
						delete this._data[prop];
						// Create the event.
						if (!(prop in this.constructor.prototype)) {
							delete this[prop];
						}
						// Let others know the number of keys have changed
						can.batch.trigger(this, "__keys");
						this._triggerChange(prop, "remove", undefined, current);

					}
					return current;
				}
			},
			// Reads a property from the `object`.
			_get: function (attr) {
				var value;
				if (typeof attr === 'string' && !! ~attr.indexOf('.')) {
					value = this.__get(attr);
					if (value !== undefined) {
						return value;
					}
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
				if (attr) {
					if (this[attr] && this[attr].isComputed && can.isFunction(this.constructor.prototype[attr])) {
						return this[attr]();
					} else {
						return this._data[attr];
					}
				} else {
					return this._data;
				}
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
				if ( parts.length && Map.helpers.canMakeObserve(current) ) {
					// That `object` should set it (this might need to call attr).
					current._set(parts, value);
				} else if (!parts.length) {
					// We're in "real" set territory.
					if (this.__convert) {
						value = this.__convert(prop, value);
					}
					this.__set(prop, value, current);
				} else {
					throw "can.Map: Object does not exist";
				}
			},
			__set: function (prop, value, current) {

				// Otherwise, we are setting it on this `object`.
				// TODO: Check if value is object and transform
				// are we changing the value.
				if (value !== current) {
					// Check if we are adding this for the first time --
					// if we are, we need to create an `add` event.
					var changeType = this.__get()
						.hasOwnProperty(prop) ? "set" : "add";

					// Set the value on data.
					this.___set(prop,

						// If we are getting an object.
						Map.helpers.canMakeObserve(value) ?

						// Hook it up to send event.
						Map.helpers.hookupBubble(value, prop, this) :
						// Value is normal.
						value);

					if (changeType === "add") {
						// If there is no current value, let others know that
						// the the number of keys have changed

						can.batch.trigger(this, "__keys", undefined);

					}
					// `batchTrigger` the change event.
					this._triggerChange(prop, changeType, value, current);

					//can.batch.trigger(this, prop, [value, current]);
					// If we can stop listening to our old value, do it.
					if (current) {
						Map.helpers.unhookup([current], this);
					}
				}

			},
			// Directly sets a property on this `object`.
			___set: function (prop, val) {

				if (this[prop] && this[prop].isComputed && can.isFunction(this.constructor.prototype[prop])) {
					this[prop](val);
				}

				this._data[prop] = val;
				// Add property directly for easy writing.
				// Check if its on the `prototype` so we don't overwrite methods like `attrs`.
				if (!(can.isFunction(this.constructor.prototype[prop]))) {
					this[prop] = val;
				}
			},

			/**
			 * @function can.Map.prototype.bind bind
			 * @description Bind event handlers to an Map.
			 *
			 * @signature `map.bind(eventType, handler)`
			 *
			 * @param {String} eventType the type of event to bind this handler to
			 * @param {Function} handler the handler to be called when this type of event fires
			 * The signature of the handler depends on the type of event being bound. See below
			 * for details.
			 * @return {can.Map} this Map, for chaining
			 *
			 * @body
			 * `bind` binds event handlers to property changes on `can.Map`s. When you change
			 * a property using `attr`, two events are fired on the Map, allowing other parts
			 * of your application to map the changes to the object.
			 *
			 * ## The _change_ event
			 *
			 * The first event that is fired is the _change_ event. The _change_ event is useful
			 * if you want to react to all changes on an Map.
			 *
			 * @codestart
			 * var o = new can.Map({});
			 * o.bind('change', function(ev, attr, how, newVal, oldVal) {
			 *     console.log('Something changed.');
			 * });
			 * @codeend
			 *
			 * The parameters of the event handler for the _change_ event are:
			 *
			 * - _ev_ The event object.
			 * - _attr_ Which property changed.
			 * - _how_ Whether the property was added, removed, or set. Possible values are `'add'`, `'remove'`, or `'set'`.
			 * - _newVal_ The value of the property after the change. `newVal` will be `undefined` if the property was removed.
			 * - _oldVal_ Thishe value of the property before the change. `oldVal` will be `undefined` if the property was added.
			 *
			 * Here is a concrete tour through the _change_ event handler's arguments:
			 *
			 * @codestart
			 * var o = new can.Map({});
			 * o.bind('change', function(ev, attr, how, newVal, oldVal) {
			 *     console.log(ev + ', ' + attr + ', ' + how + ', ' + newVal + ', ' + oldVal);
			 * });
			 *
			 * o.attr('a', 'Alexis'); // [object Object], a, add, Alexis, undefined
			 * o.attr('a', 'Adam');   // [object Object], a, set, Adam, Alexis
			 * o.attr({
			 *     'a': 'Alice',      // [object Object], a, set, Alice, Adam
			 *     'b': 'Bob'         // [object Object], b, add, Bob, undefined
			 * });
			 * o.removeAttr('a');     // [object Object], a, remove, undefined, Alice
			 * @codeend
			 *
			 * (See also `[can.Map::removeAttr removeAttr]`, which removes properties).
			 *
			 * ## The _property name_ event
			 *
			 * The second event that is fired is an event whose type is the same as the changed
			 * property's name. This event is useful for noticing changes to a specific property.
			 *
			 * @codestart
			 * var o = new can.Map({});
			 * o.bind('a', function(ev, newVal, oldVal) {
			 *     console.log('The value of a changed.');
			 * });
			 * @codeend
			 *
			 * The parameters of the event handler for the _property name_ event are:
			 *
			 * - _ev_ The event object.
			 * - _newVal_ The value of the property after the change. `newVal` will be `undefined` if the property was removed.
			 * - _oldVal_ The value of the property before the change. `oldVal` will be `undefined` if the property was added.
			 *
			 * Here is a concrete tour through the _property name_ event handler's arguments:
			 *
			 * @codestart
			 * var o = new can.Map({});
			 * o.bind('a', function(ev, newVal, oldVal) {
			 *     console.log(ev + ', ' + newVal + ', ' + oldVal);
			 * });
			 *
			 * o.attr('a', 'Alexis'); // [object Object], Alexis, undefined
			 * o.attr('a', 'Adam');   // [object Object], Adam, Alexis
			 * o.attr({
			 *     'a': 'Alice',      // [object Object], Alice, Adam
			 *     'b': 'Bob'
			 * });
			 * o.removeAttr('a');     // [object Object], undefined, Alice
			 * @codeend
			 *
			 * ## See also
			 *
			 * More information about changing properties on Observes can be found under
			 * [can.Map.prototype.attr attr].
			 *
			 * For a more specific way to changes on Observes, see the [can.Map.delegate] plugin.
			 */
			bind: function (eventName, handler) {
				var computedBinding = this._computedBindings && this._computedBindings[eventName];
				if (computedBinding) {
					if (!computedBinding.count) {
						computedBinding.count = 1;
						var self = this;
						computedBinding.handler = function (ev, newVal, oldVal) {
							can.batch.trigger(self, {
								type: eventName,
								batchNum: ev.batchNum
							}, [newVal, oldVal]);
						};
						this[eventName].bind("change", computedBinding.handler);
					} else {
						computedBinding.count++;
					}

				}
				return can.bindAndSetup.apply(this, arguments);

			},
			/**
			 * @function can.Map.prototype.unbind unbind
			 * @description Unbind event handlers from an Map.
			 * @signature `map.unbind(eventType[, handler])`
			 * @param {String} eventType the type of event to unbind, exactly as passed to `bind`
			 * @param {Function} [handler] the handler to unbind
			 *
			 * @body
			 * `unbind` unbinds event handlers previously bound with [can.Map.prototype.bind|`bind`].
			 * If no _handler_ is passed, all handlers for the given event type will be unbound.
			 *
			 * @codestart
			 * var i = 0,
			 *     increaseBy2 = function() { i += 2; },
			 *     increaseBy3 = function() { i += 3; },
			 *     o = new can.Map();
			 *
			 * o.bind('change', increaseBy2);
			 * o.bind('change', increaseBy3);
			 * o.attr('a', 'Alice');
			 * i; // 5
			 *
			 * o.unbind('change', increaseBy2);
			 * o.attr('b', 'Bob');
			 * i; // 8
			 *
			 * o.unbind('change');
			 * o.attr('e', 'Eve');
			 * i; // 8
			 * @codeend
			 */
			unbind: function (eventName, handler) {
				var computedBinding = this._computedBindings && this._computedBindings[eventName];
				if (computedBinding) {
					if (computedBinding.count === 1) {
						computedBinding.count = 0;
						this[eventName].unbind("change", computedBinding.handler);
						delete computedBinding.handler;
					} else {
						computedBinding.count++;
					}

				}
				return can.unbindAndTeardown.apply(this, arguments);

			},
			/**
			 * @function can.Map.prototype.serialize serialize
			 * @description Serialize this object to something that
			 * can be passed to `JSON.stringify`.
			 * @signature `map.serialize()`
			 *
			 *
			 * Get the serialized Object form of the map.  Serialized
			 * data is typically used to send back to a server.
			 *
			 *     o.serialize() //-> { name: 'Justin' }
			 *
			 * Serialize currently returns the same data
			 * as [can.Map.prototype.attrs].  However, in future
			 * versions, serialize will be able to return serialized
			 * data similar to [can.Model].  The following will work:
			 *
			 *     new Map({time: new Date()})
			 *       .serialize() //-> { time: 1319666613663 }
			 *
			 * @return {Object} a JavaScript Object that can be
			 * serialized with `JSON.stringify` or other methods.
			 *
			 */
			serialize: function () {
				return can.Map.helpers.serialize(this, 'serialize', {});
			},
			/**
			 * @hide
			 * Set multiple properties on the observable
			 * @param {Object} props
			 * @param {Boolean} remove true if you should remove properties that are not in props
			 */
			_attrs: function (props, remove) {
				var self = this,
					newVal;

				if (props === undefined) {
					return Map.helpers.serialize(this, 'attr', {});
				}

				props = can.simpleExtend({}, props);

				can.batch.start();
				this.each(function (curVal, prop) {
					// you can not have a _cid property!
					if (prop === "_cid") {
						return;
					}
					newVal = props[prop];

					// If we are merging...
					if (newVal === undefined) {
						if (remove) {
							self.removeAttr(prop);
						}
						return;
					}

					if (self.__convert) {
						newVal = self.__convert(prop, newVal);
					}

					// if we're dealing with models, want to call _set to let converter run
					if (newVal instanceof can.Map) {
						self.__set(prop, newVal, curVal);
						// if its an object, let attr merge
					} else if (Map.helpers.canMakeObserve(curVal) && Map.helpers.canMakeObserve(newVal) && curVal.attr) {
						curVal.attr(newVal, remove);
						// otherwise just set
					} else if (curVal !== newVal) {
						self.__set(prop, newVal, curVal);
					}

					delete props[prop];
				});
				// Add remaining props.
				for (var prop in props) {
					if (prop !== "_cid") {
						newVal = props[prop];
						this._set(prop, newVal, true);
					}

				}
				can.batch.stop();
				return this;
			},

			/**
			 * @function can.Map.prototype.compute compute
			 * @description Make a can.compute from an observable property.
			 * @signature `map.compute(attrName)`
			 * @param {String} attrName the property to bind to
			 * @return {can.compute} a [can.compute] bound to _attrName_
			 *
			 * @body
			 * `compute` is a convenience method for making computes from properties
			 * of Observes. More information about computes can be found under [can.compute].
			 *
			 * @codestart
			 * var map = new can.Map({a: 'Alexis'});
			 * var name = map.compute('a');
			 * name.bind('change', function(ev, nevVal, oldVal) {
			 *     console.log('a changed from ' + oldVal + 'to' + newName + '.');
			 * });
			 *
			 * name(); // 'Alexis'
			 *
			 * map.attr('a', 'Adam'); // 'a changed from Alexis to Adam.'
			 * name(); // 'Adam'
			 *
			 * name('Alice'); // 'a changed from Adam to Alice.'
			 * name(); // 'Alice'
			 */
			compute: function (prop) {
				if (can.isFunction(this.constructor.prototype[prop])) {
					return can.compute(this[prop], this);
				} else {
					var reads = prop.split("."),
						last = reads.length - 1,
						options = {
							args: []
						};
					return can.compute(function (newVal) {
						if (arguments.length) {
							can.compute.read(this, reads.slice(0, last))
								.value.attr(reads[last], newVal);
						} else {
							return can.compute.read(this, reads, options)
								.value;
						}
					}, this);
				}

			}
		});

	Map.prototype.on = Map.prototype.bind;
	Map.prototype.off = Map.prototype.unbind;

	return Map;
});