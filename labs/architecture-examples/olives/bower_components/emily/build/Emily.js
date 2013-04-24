/**
 * @license Emily <VERSION> http://flams.github.com/emily
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com>
 */

/**
 * Emily
 * Copyright(c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define('Tools',[],
/**
 * @class
 * Tools is a collection of tools
 */
function Tools(){

	return {
	    /**
	     * For applications that don't run in a browser, window is not the global object.
	     * This function returns the global object wherever the application runs.
	     * @returns {Object} the global object
	     */
		getGlobal: function getGlobal() {
	    	var func = function() {
	    		return this;
	    	};
	    	return func.call(null);
	    },

		/**
		 * Mixes an object into another
		 * @param {Object} source object to get values from
		 * @param {Object} destination object to mix values into
		 * @param {Boolean} optional, set to true to prevent overriding
		 * @returns {Object} the destination object
		 */
	    mixin: function mixin(source, destination, dontOverride) {
			this.loop(source, function (value, idx) {
				if (!destination[idx] || !dontOverride) {
					destination[idx] = source[idx];
				}
			});
			return destination;
		},

		/**
		 * Count the number of properties in an object
		 * It doesn't look up in the prototype chain
		 * @param {Object} object the object to count
		 * @returns {Number}
		 */
		count: function count(object) {
			var nbItems = 0;
			this.loop(object, function () {
				nbItems++;
			});

			return nbItems;
		},

		/**
		 * Compares the properties of two objects and returns true if they're the same
		 * It's doesn't do it recursively
		 * @param {Object} first object
		 * @param {Object} second object
		 * @returns {Boolean} true if the two objets have the same properties
		 */
		compareObjects: function compareObjects(object1, object2) {
			var getOwnProperties = function (object) {
				return Object.getOwnPropertyNames(object).sort().join("");
			};
			return getOwnProperties(object1) == getOwnProperties(object2);
		},

		/**
		 * Compares two numbers and tells if the first one is bigger (1), smaller (-1) or equal (0)
		 * @param {Number} number1 the first number
		 * @param {Number} number2 the second number
		 * @returns 1 if number1>number2, -1 if number2>number1, 0 if equal
		 */
		compareNumbers: function compareNumbers(number1, number2) {
			  if (number1>number2) {
			    return 1;
			  } else if (number1<number2) {
			    return -1;
			  } else {
				 return 0;
			  }
		},

		/**
		 * Transform array-like objects to array, such as nodeLists or arguments
		 * @param {Array-like object}
		 * @returns {Array}
		 */
		toArray: function toArray(array) {
			return [].slice.call(array);
		},

		/**
		 * Small adapter for looping over objects and arrays
		 * Warning: it's not meant to be used with nodeList
		 * To use with nodeList, convert to array first
		 * @param {Array/Object} iterated the array or object to loop through
		 * @param {Function} callback the function to execute for each iteration
		 * @param {Object} scope the scope in which to execute the callback
		 * @returns {Boolean} true if executed
		 */
		loop: function loop(iterated, callback, scope) {
			var i,
				length;

			if (iterated instanceof Object && callback instanceof Function) {
				if (iterated instanceof Array) {
					for (i=0; i<iterated.length; i++) {
						callback.call(scope, iterated[i], i, iterated);
					}
				} else {
					for (i in iterated) {
						if (iterated.hasOwnProperty(i)) {
							callback.call(scope, iterated[i], i, iterated);
						}
					}
				}
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Make a diff between two objects
		 * @param {Array/Object} before is the object as it was before
		 * @param {Array/Object} after is what it is now
		 * @example:
		 * 	With objects:
		 *
		 * 	before = {a:1, b:2, c:3, d:4, f:6}
		 * 	after = {a:1, b:20, d: 4, e: 5}
		 * 	will return :
		 * 	{
		 *  	unchanged: ["a", "d"],
		 *  	updated: ["b"],
		 *  	deleted: ["f"],
		 *  	added: ["e"]
		 * 	}
		 *
		 * It also works with Arrays:
		 *
		 * 	before = [10, 20, 30]
		 * 	after = [15, 20]
		 * 	will return :
		 * 	{
		 *  	unchanged: [1],
		 *  	updated: [0],
		 *  	deleted: [2],
		 *  	added: []
		 * 	}
		 *
		 * @returns object
		 */
		objectsDiffs : function objectsDiffs(before, after) {
			if (before instanceof Object && after instanceof Object) {
				var unchanged = [],
					updated = [],
					deleted = [],
					added = [];

				 // Look through the after object
				 this.loop(after, function (value, idx) {

					 // To get the added
					 if (typeof before[idx] == "undefined") {
						 added.push(idx);

					 // The updated
					 } else if (value !== before[idx]) {
						 updated.push(idx);

					 // And the unchanged
					 } else if (value === before[idx]) {
						 unchanged.push(idx);
					 }

				 });

				 // Loop through the before object
				 this.loop(before, function (value, idx) {

					// To get the deleted
					if (typeof after[idx] == "undefined") {
						deleted.push(idx);
					}
				 });

				return {
					updated: updated,
					unchanged: unchanged,
					added: added,
					deleted: deleted
				};

			} else {
				return false;
			}
		},

		/**
		 * Transforms Arrays and Objects into valid JSON
		 * @param {Object/Array} object the object to JSONify
		 * @returns the JSONified object or false if failed
		 */
		jsonify: function jsonify(object) {
			if (object instanceof Object) {
				return JSON.parse(JSON.stringify(object));
			} else {
				return false;
			}
		},

		/**
		 * Clone an Array or an Object
		 * @param {Array/Object} object the object to clone
		 * @returns {Array/Object} the cloned object
		 */
		clone: function clone(object) {
			if (object instanceof Array) {
				return object.slice(0);
			} else if (typeof object == "object" && object !== null && !(object instanceof RegExp)) {
				return this.mixin(object, {});
			} else {
				return false;
			}
		},


		/**
		 *
		 *
		 *
		 *
		 * Refactoring needed for the following
		 *
		 *
		 *
		 *
		 *
		 */

		/**
		 * Get the property of an object nested in one or more objects
		 * given an object such as a.b.c.d = 5, getNestedProperty(a, "b.c.d") will return 5.
		 * @param {Object} object the object to get the property from
		 * @param {String} property the path to the property as a string
		 * @returns the object or the the property value if found
		 */
		getNestedProperty: function getNestedProperty(object, property) {
			if (object && object instanceof Object) {
				if (typeof property == "string" && property != "") {
					var split = property.split(".");
					return split.reduce(function (obj, prop) {
						return obj && obj[prop];
					}, object);
				} else if (typeof property == "number") {
					return object[property];
				} else {
					return object;
				}
			} else {
				return object;
			}
		},

		/**
		 * Set the property of an object nested in one or more objects
		 * If the property doesn't exist, it gets created.
		 * @param {Object} object
		 * @param {String} property
		 * @param value the value to set
		 * @returns object if no assignment was made or the value if the assignment was made
		 */
		setNestedProperty: function setNestedProperty(object, property, value) {
			if (object && object instanceof Object) {
				if (typeof property == "string" && property != "") {
					var split = property.split(".");
					return split.reduce(function (obj, prop, idx) {
						obj[prop] = obj[prop] || {};
						if (split.length == (idx + 1)) {
							obj[prop] = value;
						}
						return obj[prop];
					}, object);
				} else if (typeof property == "number") {
					object[property] = value;
					return object[property];
				} else {
					return object;
				}
			} else {
				return object;
			}
		}



	};


});


/**
 * Emily
 * Copyright(c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define('Observable',["Tools"],
/**
* @class
* Observable is an implementation of the Observer design pattern,
* which is also known as publish/subscribe.
*
* This service creates an Observable on which you can add subscribers.
*/
function Observable(Tools) {

	/**
	 * Defines the Observable
	 * @private
	 * @returns {_Observable}
	 */
	return function ObservableConstructor() {

		/**
		 * The list of topics
		 * @private
		 */
		var _topics = {};

		/**
		 * Add an observer
		 * @param {String} topic the topic to observe
		 * @param {Function} callback the callback to execute
		 * @param {Object} scope the scope in which to execute the callback
		 * @returns handle
		 */
		this.watch = function watch(topic, callback, scope) {
			if (typeof callback == "function") {
				var observers = _topics[topic] = _topics[topic] || [],
				observer = [callback, scope];

				observers.push(observer);
				return [topic,observers.indexOf(observer)];

			} else {
				return false;
			}
		};

		/**
		 * Remove an observer
		 * @param {Handle} handle returned by the watch method
		 * @returns {Boolean} true if there were subscribers
		 */
		this.unwatch = function unwatch(handle) {
			var topic = handle[0], idx = handle[1];
			if (_topics[topic] && _topics[topic][idx]) {
				// delete value so the indexes don't move
				delete _topics[topic][idx];
				// If the topic is only set with falsy values, delete it;
				if (!_topics[topic].some(function (value) {
					return !!value;
				})) {
					delete _topics[topic];
				}
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Notifies observers that a topic has a new message
		 * @param {String} topic the name of the topic to publish to
		 * @param subject
		 * @returns {Boolean} true if there was subscribers
		 */
		this.notify = function notify(topic) {
			var observers = _topics[topic],
				args = Tools.toArray(arguments).slice(1);

			if (observers) {
				Tools.loop(observers, function (value) {
					try {
						value && value[0].apply(value[1] || null, args);
					} catch (err) { }
				});
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Check if topic has the described observer
		 * @param {Handle}
		 * @returns {Boolean} true if exists
		 */
		this.hasObserver = function hasObserver(handle) {
			return !!( handle && _topics[handle[0]] && _topics[handle[0]][handle[1]]);
		};

		/**
		 * Check if a topic has observers
		 * @param {String} topic the name of the topic
		 * @returns {Boolean} true if topic is listened
		 */
		this.hasTopic = function hasTopic(topic) {
			return !!_topics[topic];
		};

		/**
		 * Unwatch all or unwatch all from topic
		 * @param {String} topic optional unwatch all from topic
		 * @returns {Boolean} true if ok
		 */
		this.unwatchAll = function unwatchAll(topic) {
			if (_topics[topic]) {
				delete _topics[topic];
			} else {
				_topics = {};
			}
			return true;
		};

	};

});

/**
 * Emily
 * Copyright(c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define('StateMachine',["Tools"],
/**
 * @class
 * Create a stateMachine
 */
function StateMachine(Tools) {

	 /**
     * @param initState {String} the initial state
     * @param diagram {Object} the diagram that describes the state machine
     * @example
     *
     *      diagram = {
     *              "State1" : [
     *                      [ message1, action, nextState], // Same as the state's add function
     *                      [ message2, action2, nextState]
     *              ],
     *
     *              "State2" :
     *                       [ message3, action3, scope3, nextState]
     *                      ... and so on ....
     *
     *   }
     *
     * @return the stateMachine object
     */
	function StateMachineConstructor($initState, $diagram) {

		/**
		 * The list of states
		 * @private
		 */
		var _states = {},

		/**
		 * The current state
		 * @private
		 */
		_currentState = "";

		/**
		 * Set the initialization state
		 * @param {String} name the name of the init state
		 * @returns {Boolean}
		 */
		this.init = function init(name) {
				if (_states[name]) {
					_currentState = name;
					return true;
				} else {
					return false;
				}
		};

		/**
		 * Add a new state
		 * @private
		 * @param {String} name the name of the state
		 * @returns {State} a new state
		 */
		this.add = function add(name) {
			if (!_states[name]) {
				return _states[name] = new Transition();
			} else {
				return _states[name];
			}
		};

		/**
		 * Get an existing state
		 * @private
		 * @param {String} name the name of the state
		 * @returns {State} the state
		 */
		this.get = function get(name) {
			return _states[name];
		};

		/**
		 * Get the current state
		 * @returns {String}
		 */
		this.getCurrent = function getCurrent() {
			return _currentState;
		};

		/**
		 * Tell if the state machine has the given state
		 * @param {String} state the name of the state
		 * @returns {Boolean} true if it has the given state
		 */
		this.has = function has(state) {
			return _states.hasOwnProperty(state);
		};

		/**
		 * Advances the state machine to a given state
		 * @param {String} state the name of the state to advance the state machine to
		 * @returns {Boolean} true if it has the given state
		 */
		this.advance = function advance(state) {
			if (this.has(state)) {
				_currentState = state;
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Pass an event to the state machine
		 * @param {String} name the name of the event
		 * @returns {Boolean} true if the event exists in the current state
		 */
		this.event = function event(name) {
			var nextState;

			nextState = _states[_currentState].event.apply(_states[_currentState].event, Tools.toArray(arguments));
			// False means that there's no such event
			// But undefined means that the state doesn't change
			if (nextState === false) {
				return false;
			} else {
				// There could be no next state, so the current one remains
				if (nextState) {
					// Call the exit action if any
					_states[_currentState].event("exit");
					_currentState = nextState;
					// Call the new state's entry action if any
					_states[_currentState].event("entry");
				}
				return true;
			}
		};

		/**
		 * Initializes the StateMachine with the given diagram
		 */
		Tools.loop($diagram, function (transition, state) {
			var myState = this.add(state);
			transition.forEach(function (params){
				myState.add.apply(null, params);
			});
		}, this);

		/**
		 * Sets its initial state
		 */
		this.init($initState);
	}

	/**
	 * Each state has associated transitions
     * @constructor
	 */
	function Transition() {

		/**
		 * The list of transitions associated to a state
		 * @private
		 */
		var _transitions = {};

		/**
		 * Add a new transition
		 * @private
		 * @param {String} event the event that will trigger the transition
		 * @param {Function} action the function that is executed
		 * @param {Object} scope [optional] the scope in which to execute the action
		 * @param {String} next [optional] the name of the state to transit to.
		 * @returns {Boolean} true if success, false if the transition already exists
		 */
		this.add = function add(event, action, scope, next) {

			var arr = [];

			if (_transitions[event]) {
				return false;
			}

			if (typeof event == "string"
				&& typeof action == "function") {

					arr[0] = action;

					if (typeof scope == "object") {
						arr[1] = scope;
					}

					if (typeof scope == "string") {
						arr[2] = scope;
					}

					if (typeof next == "string") {
						arr[2] = next;
					}

					_transitions[event] = arr;
					return true;
			}

			return false;
		};

		/**
		 * Check if a transition can be triggered with given event
		 * @private
		 * @param {String} event the name of the event
		 * @returns {Boolean} true if exists
		 */
		this.has = function has(event) {
			return !!_transitions[event];
		};

		/**
		 * Get a transition from it's event
		 * @private
		 * @param {String} event the name of the event
		 * @return the transition
		 */
		this.get = function get(event) {
			return _transitions[event] || false;
		};

		/**
		 * Execute the action associated to the given event
		 * @param {String} event the name of the event
		 * @param {params} params to pass to the action
		 * @private
		 * @returns false if error, the next state or undefined if success (that sounds weird)
		 */
		this.event = function event(event) {
			var _transition = _transitions[event];
			if (_transition) {
				_transition[0].apply(_transition[1], Tools.toArray(arguments).slice(1));
				return _transition[2];
			} else {
				return false;
			}
		};
	};

	return StateMachineConstructor;

});

/**
 * Emily
 * Copyright(c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */
define('Promise',["Observable", "StateMachine"],

/**
 * @class
 * Create a promise/A+
 */
function Promise(Observable, StateMachine) {

	return function PromiseConstructor() {

		/**
		 * The fulfilled value
		 * @private
		 */
		var _value = null,

		/**
		 * The rejection reason
		 * @private
		 */
		_reason = null,

		/**
		 * The funky observable
		 * @private
		 */
		_observable = new Observable,

		/**
		 * The state machine States & transitions
		 * @private
		 */
		_states = {

			// The promise is pending
			"Pending": [

				// It can only be fulfilled when pending
				["fulfill", function onFulfill(value) {
					_value = value;
					_observable.notify("fulfill", value);
				// Then it transits to the fulfilled state
				}, "Fulfilled"],

				// it can only be rejected when pending
				["reject", function onReject(reason) {
					_reason = reason;
					_observable.notify("reject", reason);
				// Then it transits to the rejected state
				}, "Rejected"],

				// When pending, add the resolver to an observable
				["toFulfill", function toFulfill(resolver) {
					_observable.watch("fulfill", resolver);
				}],

				// When pending, add the resolver to an observable
				["toReject", function toReject(resolver) {
					_observable.watch("reject", resolver);
				}]],

			// When fulfilled,
			"Fulfilled": [
				// We directly call the resolver with the value
				["toFulfill", function toFulfill(resolver) {
					setTimeout(function () {
						resolver(_value);
					}, 0);
				}]],

			// When rejected
			"Rejected": [
				// We directly call the resolver with the reason
				["toReject", function toReject(resolver) {
					setTimeout(function () {
						resolver(_reason);
					}, 0);
				}]]
		},

		/**
		 * The stateMachine
		 * @private
		 */
		_stateMachine = new StateMachine("Pending", _states);

		/**
		 * Fulfilled the promise.
		 * A promise can be fulfilld only once.
		 * @param the fulfillment value
		 * @returns the promise
		 */
		this.fulfill = function fulfill(value) {
			_stateMachine.event("fulfill", value);
			return this;
		};

		/**
		 * Reject the promise.
		 * A promise can be rejected only once.
		 * @param the rejection value
		 * @returns true if the rejection function was called
		 */
		this.reject = function reject(reason) {
			_stateMachine.event("reject", reason);
			return this;
		};

		/**
         * The callbacks to call after fulfillment or rejection
         * @param {Function} fulfillmentCallback the first parameter is a success function, it can be followed by a scope
         * @param {Function} the second, or third parameter is the rejection callback, it can also be followed by a scope
         * @examples:
         *
         * then(fulfillment)
         * then(fulfillment, scope, rejection, scope)
         * then(fulfillment, rejection)
         * then(fulfillment, rejection, scope)
         * then(null, rejection, scope)
         * @returns {Promise} the new promise
         */
        this.then = function then() {
        	var promise = new PromiseConstructor;

        	// If a fulfillment callback is given
          	if (arguments[0] instanceof Function) {
          		// If the second argument is also a function, then no scope is given
            	if (arguments[1] instanceof Function) {
                	_stateMachine.event("toFulfill", this.makeResolver(promise, arguments[0]));
              	} else {
              		// If the second argument is not a function, it's the scope
                	_stateMachine.event("toFulfill", this.makeResolver(promise, arguments[0], arguments[1]));
              	}
         	} else {
         		// If no fulfillment callback given, give a default one
         		_stateMachine.event("toFulfill", this.makeResolver(promise, function () {
         			promise.fulfill(_value);
         		}));
         	}

         	// if the second arguments is a callback, it's the rejection one, and the next argument is the scope
          	if (arguments[1] instanceof Function) {
            	_stateMachine.event("toReject", this.makeResolver(promise, arguments[1], arguments[2]));
          	}

          	// if the third arguments is a callback, it's the rejection one, and the next arguments is the sopce
          	if (arguments[2] instanceof Function) {
                _stateMachine.event("toReject", this.makeResolver(promise, arguments[2], arguments[3]));
          	}

          	// If no rejection callback is given, give a default one
          	if (!(arguments[1] instanceof Function) &&
          		!(arguments[2] instanceof Function)) {
          		_stateMachine.event("toReject", this.makeResolver(promise, function () {
          			promise.reject(_reason);
          		}));
          	}

          	return promise;
        };

        /**
		 * Synchronize this promise with a thenable
		 * @returns {Boolean} false if the given sync is not a thenable
		 */
		this.sync = function sync(syncWith) {
			if (syncWith instanceof Object && syncWith.then) {

				var onFulfilled = function onFulfilled(value) {
					this.fulfill(value);
				},
				onRejected = function onRejected(reason) {
					this.reject(reason);
				};

				syncWith.then(onFulfilled.bind(this),
						onRejected.bind(this));

				return true;
			} else {
				return false;
			}
		};

        /**
         * Make a resolver
         * for debugging only
         * @private
         * @returns {Function} a closure
		 */
        this.makeResolver = function makeResolver(promise, func, scope) {
			return function resolver(value) {
				var returnedPromise;

				try {
					returnedPromise = func.call(scope, value);
					if (!promise.sync(returnedPromise)) {
						promise.fulfill(returnedPromise);
					}
				} catch (err) {
					promise.reject(err);
				}

			}
        };

        /**
         * Returns the reason
         * for debugging only
         * @private
         */
        this.getReason = function getReason() {
        	return _reason;
        };

        /**
         * Returns the reason
         * for debugging only
         * @private
         */
        this.getValue = function getValue() {
        	return _value;
        };

		/**
		 * Get the promise's observable
		 * for debugging only
		 * @private
		 * @returns {Observable}
		 */
		this.getObservable = function getObservable() {
			return _observable;
		};

		/**
		 * Get the promise's stateMachine
		 * for debugging only
		 * @private
		 * @returns {StateMachine}
		 */
		this.getStateMachine = function getStateMachine() {
			return _stateMachine;
		};

		/**
		 * Get the statesMachine's states
		 * for debugging only
		 * @private
		 * @returns {Object}
		 */
		this.getStates = function getStates() {
			return _states;
		};

	}




});

/**
 * Emily
 * Copyright(c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define('Store',["Observable", "Tools"],
/**
 * @class
 * Store creates an observable structure based on a key/values object
 * or on an array
 */
 function Store(Observable, Tools) {

	/**
	 * Defines the Store
	 * @param {Array/Object} the data to initialize the store with
	 * @returns
	 */
	return function StoreConstructor($data) {

		/**
		 * Where the data is stored
		 * @private
		 */
		var _data = Tools.clone($data) || {},

		/**
		 * The observable for publishing changes on the store iself
		 * @private
		 */
		_storeObservable = new Observable(),

		/**
		 * The observable for publishing changes on a value
		 * @private
		 */
		_valueObservable = new Observable(),

		/**
		 * Gets the difference between two objects and notifies them
		 * @private
		 * @param {Object} previousData
		 */
		_notifyDiffs = function _notifyDiffs(previousData) {
			var diffs = Tools.objectsDiffs(previousData, _data);
			["updated",
			 "deleted",
			 "added"].forEach(function (value) {
				 diffs[value].forEach(function (dataIndex) {
						_storeObservable.notify(value, dataIndex, _data[dataIndex]);
						_valueObservable.notify(dataIndex, _data[dataIndex], value);
				 });
			});
		};

		/**
		 * Get the number of items in the store
		 * @returns {Number} the number of items in the store
		 */
		this.getNbItems = function() {
			return _data instanceof Array ? _data.length : Tools.count(_data);
		};

		/**
		 * Count is an alias for getNbItems
		 * @returns {Number} the number of items in the store
		 */
		this.count = this.getNbItems;

		/**
		 * Get a value from its index
		 * @param {String} name the name of the index
		 * @returns the value
		 */
		this.get = function get(name) {
			return _data[name];
		};

		/**
		 * Checks if the store has a given value
		 * @param {String} name the name of the index
		 * @returns {Boolean} true if the value exists
		 */
		this.has = function has(name) {
			return _data.hasOwnProperty(name);
		};

		/**
		 * Set a new value and overrides an existing one
		 * @param {String} name the name of the index
		 * @param value the value to assign
		 * @returns true if value is set
		 */
		this.set = function set(name, value) {
			var hasPrevious,
				previousValue,
				action;

			if (typeof name != "undefined") {
				hasPrevious = this.has(name);
				previousValue = this.get(name);
				_data[name] = value;
				action = hasPrevious ? "updated" : "added";
				_storeObservable.notify(action, name, _data[name], previousValue);
				_valueObservable.notify(name, _data[name], action, previousValue);
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Update the property of an item.
		 * @param {String} name the name of the index
		 * @param {String} property the property to modify.
		 * @param value the value to assign
		 * @returns false if the Store has no name index
		 */
		this.update = function update(name, property, value) {
			var item;
			if (this.has(name)) {
				item = this.get(name);
				Tools.setNestedProperty(item, property, value);
				_storeObservable.notify("updated", property, value);
				_valueObservable.notify(name, item, "updated");
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Delete value from its index
		 * @param {String} name the name of the index from which to delete the value
		 * @returns true if successfully deleted.
		 */
		this.del = function del(name) {
			if (this.has(name)) {
				if (!this.alter("splice", name, 1)) {
					delete _data[name];
					_storeObservable.notify("deleted", name);
					_valueObservable.notify(name, _data[name], "deleted");
				}
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Delete multiple indexes. Prefer this one over multiple del calls.
		 * @param {Array}
		 * @returns false if param is not an array.
		 */
		this.delAll = function delAll(indexes) {
			if (indexes instanceof Array) {
				// Indexes must be removed from the greatest to the lowest
				// To avoid trying to remove indexes that don't exist.
				// i.e: given [0, 1, 2], remove 1, then 2, 2 doesn't exist anymore
				indexes.sort(Tools.compareNumbers)
					.reverse()
					.forEach(this.del, this);
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Alter the data be calling one of it's method
		 * When the modifications are done, it notifies on changes.
		 * @param {String} func the name of the method
		 * @returns the result of the method call
		 */
		this.alter = function alter(func) {
			var apply,
				previousData;

			if (_data[func]) {
				previousData = Tools.clone(_data);
				apply = _data[func].apply(_data, Array.prototype.slice.call(arguments, 1));
				_notifyDiffs(previousData);
				return apply;
			} else {
				return false;
			}
		};

		/**
		 * proxy is an alias for alter
		 */
		 this.proxy = this.alter;

		/**
		 * Watch the store's modifications
		 * @param {String} added/updated/deleted
		 * @param {Function} func the function to execute
		 * @param {Object} scope the scope in which to execute the function
		 * @returns {Handle} the subscribe's handler to use to stop watching
		 */
		this.watch = function watch(name, func, scope) {
			return _storeObservable.watch(name, func, scope);
		};

		/**
		 * Unwatch the store modifications
		 * @param {Handle} handle the handler returned by the watch function
		 * @returns
		 */
		this.unwatch = function unwatch(handle) {
			return _storeObservable.unwatch(handle);
		};

		/**
		 * Get the observable used for watching store's modifications
		 * Should be used only for debugging
		 * @returns {Observable} the Observable
		 */
		this.getStoreObservable = function getStoreObservable() {
			return _storeObservable;
		};

		/**
		 * Watch a value's modifications
		 * @param {String} name the name of the value to watch for
		 * @param {Function} func the function to execute
		 * @param {Object} scope the scope in which to execute the function
		 * @returns handler to pass to unwatchValue
		 */
		this.watchValue = function watchValue(name, func, scope) {
			return _valueObservable.watch(name, func, scope);
		};

		/**
		 * Unwatch the value's modifications
		 * @param {Handler} handler the handler returned by the watchValue function
		 * @private
		 * @returns true if unwatched
		 */
		this.unwatchValue = function unwatchValue(handler) {
			return _valueObservable.unwatch(handler);
		};

		/**
		 * Get the observable used for watching value's modifications
		 * Should be used only for debugging
		 * @private
		 * @returns {Observable} the Observable
		 */
		this.getValueObservable = function getValueObservable() {
			return _valueObservable;
		};

		/**
		 * Loop through the data
		 * @param {Function} func the function to execute on each data
		 * @param {Object} scope the scope in wich to run the callback
		 */
		this.loop = function loop(func, scope) {
			Tools.loop(_data, func, scope);
		};

		/**
		 * Reset all data and get notifications on changes
		 * @param {Arra/Object} data the new data
		 * @returns {Boolean}
		 */
		this.reset = function reset(data) {
			if (data instanceof Object) {
				var previousData = Tools.clone(_data);
				_data = Tools.clone(data) || {};
				_notifyDiffs(previousData);
				return true;
			} else {
				return false;
			}

		};

		/**
		 * Returns a JSON version of the data
		 * Use dump if you want all the data as a plain js object
		 * @returns {String} the JSON
		 */
		this.toJSON = function toJSON() {
			return JSON.stringify(_data);
		};

		/**
		 * Returns the store's data
		 * @returns {Object} the data
		 */
		this.dump = function dump() {
			return _data;
		};
	};
});

/**
 * Emily
 * Copyright(c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define('Transport',[],
/**
 * @class
 * Transport hides and centralizes the logic behind requests.
 * It can issue requests to request handlers, which in turn can issue requests
 * to anything your node.js server has access to (HTTP, FileSystem, SIP...)
 */
function Transport() {

	/**
	 * Create a Transport
	 * @param {Emily Store} [optionanl] $reqHandlers an object containing the request handlers
	 * @returns
	 */
	return function TransportConstructor($reqHandlers) {

		/**
		 * The request handlers
		 * @private
		 */
		var _reqHandlers = null;

		/**
		 * Set the requests handlers object
		 * @param {Emily Store} reqHandlers an object containing the requests handlers
		 * @returns
		 */
		this.setReqHandlers = function setReqHandlers(reqHandlers) {
			if (reqHandlers instanceof Object) {
				_reqHandlers = reqHandlers;
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Get the requests handlers
		 * @returns{ Emily Store} reqHandlers the object containing the requests handlers
		 */
		this.getReqHandlers = function getReqHandlers() {
			return _reqHandlers;
		};

		/**
		 * Issue a request to a request handler
		 * @param {String} reqHandler the name of the request handler to issue the request to
		 * @param {Object} data the data, or payload, to send to the request handler
		 * @param {Function} callback the function to execute with the result
		 * @param {Object} scope the scope in which to execute the callback
		 * @returns
		 */
		this.request = function request(reqHandler, data, callback, scope) {
			if (_reqHandlers.has(reqHandler)
					&& typeof data != "undefined") {

				_reqHandlers.get(reqHandler)(data, function () {
					callback && callback.apply(scope, arguments);
				});
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Issue a request to a reqHandler but keep listening for the response as it can be sent in several chunks
		 * or remain open as long as the abort funciton is not called
		 * @param {String} reqHandler the name of the request handler to issue the request to
		 * @param {Object} data the data, or payload, to send to the request handler
		 * @param {Function} callback the function to execute with the result
		 * @param {Object} scope the scope in which to execute the callback
		 * @returns {Function} the abort function to call to stop listening
		 */
		this.listen = function listen(reqHandler, data, callback, scope) {
			if (_reqHandlers.has(reqHandler)
					&& typeof data != "undefined"
					&& typeof callback == "function") {

				var func = function () {
					callback.apply(scope, arguments);
				},
				abort;

				abort = _reqHandlers.get(reqHandler)(data, func, func);
				return function () {
					if (typeof abort == "function") {
						abort();
					} else if (typeof abort == "object" && typeof abort.func == "function") {
						abort.func.call(abort.scope);
					}
				};
			} else {
				return false;
			}
		};

		this.setReqHandlers($reqHandlers);

	};

});
