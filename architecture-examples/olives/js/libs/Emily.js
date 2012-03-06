/**
 * @license Emily
 *
 * The MIT License (MIT)
 * 
 * Copyright (c) 2012 Olivier Scherrer <pode.fr@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *//**
 * Emily
 * Copyright(c) 2012 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define("CouchDBStore", 

["Store", "StateMachine", "Tools", "Promise"], 

/**
 * @class
 * CouchDBStore synchronises a Store with a CouchDB view or document
 * It subscribes to _changes to keep its data up to date.
 */
function CouchDBStore(Store, StateMachine, Tools, Promise) {
	
	/**
	 * Defines the CouchDBStore
	 * @returns {CouchDBStoreConstructor}
	 */
	function CouchDBStoreConstructor() {
		
		/**
		 * The name of the channel on which to run the requests
		 * @private
		 */
		var _channel = "CouchDB",
		
		/**
		 * The transport used to run the requests
		 * @private
		 */
		_transport = null,
		
		/**
		 * The database name
		 * @private
		 */
		_database = null,
		
		/**
		 * The name of the view
		 * @private
		 */
		_view = null,
		
		/**
		 * The name of the document
		 * @private
		 */
		_document = null,
		
		/**
		 * The name of the design document
		 * @private
		 */
		_design = null,
		
		/**
		 * An object to store info like update_sq
		 * @private
		 */
		_dbInfo = {},
		
		/**
		 * The promise that is returned by sync
		 * It's resolved when entering listening state
		 * It's rejected when no such document to sync to
		 * @private
		 */
		_syncPromise = new Promise(),
		
		/**
		 * The state machine
		 * @private
		 * it concentrates almost the whole logic.
		 * It can already be extended to handle reconnect for instance
		 */
		_stateMachine = new StateMachine("Unsynched", {
			"Unsynched": [
			              
			 ["getView", function () {
					_transport.request(_channel, {
						method: "GET",
						path: "/" + _database + "/_design/" + _design + "/" + "_view/" + _view +"?update_seq=true"
					}, function (results) {
						var json = JSON.parse(results);
						_dbInfo = {
								total_rows: json.total_rows,
								update_seq: json.update_seq,
								offset: json.offset
						};
						
						this.reset(json.rows);
						_stateMachine.event("subscribeToViewChanges", json.update_seq);
					}, this);
				}, this, "Synched"],
				
				["getDocument", function () { 
					_transport.request(_channel, {
						method: "GET",
						path: "/" + _database + "/" + _document
					}, function (results) {
						var json = JSON.parse(results);
						if (json._id) {
							this.reset(json);
							_stateMachine.event("subscribeToDocumentChanges");	
						} else {
							_syncPromise.reject(this);
						}
					}, this);
				}, this, "Synched"]],
						
			"Synched": [
			            
	            ["updateDatabase", function () {
	            	_transport.request(_channel, {
	            		method: "PUT",
	            		path: '/' + _database + '/' + _document,
	            		headers: {
	            			"Content-Type": "application/json"
	            		},
	            		data: this.toJSON()
	            	}, function () {
	            		_stateMachine.event("subscribeToDocumentChanges");
	            	});
	            }, this],
			           
			  ["subscribeToViewChanges", function (update_seq) {
					_transport.listen(_channel
					, "/" + _database + "/_changes?feed=continuous&heartbeat=20000&since="+update_seq
					, function (changes) {
						// Should I test for this very special case (heartbeat?)
						// Or do I have to try catch for any invalid json?
						if (changes == "\n") {
							return false;
						}
						
						var json = JSON.parse(changes),
							action;

						if (json.deleted) {
							action = "delete";
						} else if (json.changes[0].rev.search("1-") == 0) {
							action = "add";
						} else {
							action = "change";
						}
						_stateMachine.event(action, json.id);
					}, this);
				}, this, "Listening"],
				
				["subscribeToDocumentChanges", function () {
					_transport.listen(_channel
					, "/" + _database + "/_changes?feed=continuous&heartbeat=20000"
					, function (changes) {
						var json;
						// Should I test for this very special case (heartbeat?)
						// Or do I have to try catch for any invalid json?
						if (changes == "\n") {
							return false;
						}
						
						json = JSON.parse(changes);
						
						// The document is the modified document is the current one
						if (json.id == _document && 
							// And if it has a new revision
							json.changes.pop().rev != this.get("_rev")) {
							
							if (json.deleted) {
								_stateMachine.event("deleteDoc");
							} else {
								_stateMachine.event("updateDoc");	
							}
						 }
					}, this);
				}, this, "Listening"]],
				
			"Listening": [
			              
	              ["entry", function () {
	            	  _syncPromise.resolve(this);
	              }, this],
			              
			    ["change", function (id) {
					_transport.request(_channel,{
						method: "GET",
						path: '/'+_database+'/_design/'+_design+'/_view/'+_view
					}, function (view) {
						var json = JSON.parse(view);
						
						json.rows.some(function (value, idx) {
							if (value.id == id) {
								this.set(idx, value);
							}
						}, this);

						
					}, this);
					
				}, this],
				
				["delete", function (id) {
					this.loop(function (value, idx) {
						if (value.id == id) {
							this.del(idx);
						}
					}, this);
				}, this],
				
				["add", function (id) {
					_transport.request(_channel,{
						method: "GET",
						path: '/'+_database+'/_design/'+_design+'/_view/'+_view
					}, function (view) {
						var json = JSON.parse(view);
						
						json.rows.some(function (value, idx) {
							if (value.id == id) {
								this.alter("splice", idx, 0, value);	
							}
						}, this);
						
					}, this);
				}, this],
				
				["updateDoc", function () {
					_transport.request(_channel,{
						method: "GET",
						path: '/'+_database+'/' + _document
					}, function (doc) {
						this.reset(JSON.parse(doc));			
					}, this);
			    }, this],
			    
			    ["deleteDoc", function () {
			    	this.reset({});			
			    }, this],
			    
			    ["updateDatabase", function () {
			    	_transport.request(_channel, {
	            		method: "PUT",
	            		path: '/' + _database + '/' + _document,
	            		headers: {
	            			"Content-Type": "application/json"
	            		},
	            		data: this.toJSON()
	            	});
			    }, this],
			    
			    ["removeFromDatabase", function () {
			    	_transport.request(_channel, {
	            		method: "DELETE",
	            		path: '/' + _database + '/' + _document + '?rev=' + this.get("_rev")
	            	});
			    }, this]
			   ]
			
		});
		
		/**
		 * Synchronize the store with a view
		 * @param {String} database the name of the database where to get...
		 * @param {String} ...design the design document, in which...
		 * @param {String} view ...the view is.
		 * @returns {Boolean}
		 */
		this.sync = function sync() {
			if (typeof arguments[0] == "string" && typeof arguments[1] == "string" && typeof arguments[2] == "string") {
				_database = arguments[0];
				_design = arguments[1];
				_view = arguments[2];
				_stateMachine.event("getView");
				return _syncPromise;
			} else if (typeof arguments[0] == "string" && typeof arguments[1] == "string" && typeof arguments[2] == "undefined") {
				_database = arguments[0];
				_document = arguments[1];
				_stateMachine.event("getDocument");
				return _syncPromise;
			}
			return false;
		};
		
		/**
		 * Update the database with the current document
		 * @returns true if update called
		 */
		this.update = function update() {
			return _stateMachine.event("updateDatabase");
		};
		
		/**
		 * Remove the document from the database
		 * @returns true if remove called
		 */
		this.remove = function remove() {
			return _stateMachine.event("removeFromDatabase");
		};
		
		/**
		 * Get a specific info about the current view
		 * Should be used only for debugging
		 * @param {String} name (update_seq/offset/total_rows)
		 * Note: if you want to get the number of items, store.getNbItems() is the func for that
		 * @returns the info
		 */
		this.getDBInfo = function getDBInfo(name) {
			return _dbInfo[name];
		};
		
		/**
		 * The transport object to use
		 * @param {Object} transport the transport object
		 * @returns {Boolean} true if 
		 */
		this.setTransport = function setTransport(transport) {
			if (transport && typeof transport.listen == "function" && typeof transport.request == "function") {
				_transport = transport;
				return true;
			} else {
				return false;
			}
		};
		
		/**
		 * Get the state machine
		 * Also only useful for debugging
		 * @returns {StateMachine} the state machine
		 */
		this.getStateMachine = function getStateMachine() {
			return _stateMachine;
		};
		
		/**
		 * Get the current transport
		 * Also only useful for debugging
		 * @returns {Object} the current transport
		 */
		this.getTransport = function getTransport() {
			return _transport;
		};

	};
	
	return function CouchDBStoreFactory() {
		CouchDBStoreConstructor.prototype = new Store;
		return new CouchDBStoreConstructor;
	};
	
});/**
 * Emily
 * Copyright(c) 2012 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define("Observable",

["Tools"],
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
		 * @returns handler
		 */
		this.watch = function watch(topic, callback, scope) {
			if (typeof callback == "function") {
				var observers = _topics[topic] = _topics[topic] || [];
			
				observer = [callback, scope];
				observers.push(observer);
				return [topic,observers.indexOf(observer)];
				
			} else {
				return false;
			}
		};
		
		/**
		 * Remove an observer
		 * @param {Handler} handler returned by the watch method
		 * @returns {Boolean} true if there were subscribers
		 */
		this.unwatch = function unwatch(handler) {
			var topic = handler[0], idx = handler[1];
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
				l;

			if (observers) {
				l = observers.length;
				while (l--) {
					observers[l] && observers[l][0].apply(observers[l][1] || null, Tools.toArray(arguments).slice(1)); 
				}
				return true;
			} else {
				return false;
			}
		},
		
		/**
		 * Check if topic has the described observer
		 * @param {Handler}
		 * @returns {Boolean} true if exists
		 */
		this.hasObserver = function hasObserver(handler) {
			return !!( handler && _topics[handler[0]] && _topics[handler[0]][handler[1]]);
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
	
});/**
 * Emily
 * Copyright(c) 2012 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define("Promise",

["Observable", "StateMachine"],

/**
 * @class
 * Create a Promise
 */
function Promise(Observable, StateMachine) {
	
	return function PromiseConstructor() {
		/**
		 * The value once resolved
		 * @private
		 */
		var _resolved,
		
		/**
		 * The value once rejected
		 * @private
		 */
		_rejected,
		
		/**
		 * The stateMachine
		 * @private
		 */
		_stateMachine = new StateMachine("Unresolved", {
			"Unresolved": [["resolve", function (val) {
								_resolved = val;
								_observable.notify("success", val);
							}, "Resolved"],
							
							["reject", function (err) {
								_rejected = err;
								_observable.notify("fail", err);
							}, "Rejected"],
							
							["addSuccess", function (func, scope) {
								_observable.watch("success", func, scope);
							}],
							
							["addFail", function (func, scope) {
								_observable.watch("fail", func, scope);
							}]],
							
			"Resolved": [["addSuccess", function (func, scope) {
								func.call(scope, _resolved);
							}]],
							
			"Rejected": [["addFail", function (func, scope) {
								func.call(scope, _rejected);
							}]]
		}),
		
		/**
		 * The observable
		 * @private
		 */
		_observable = new Observable();
		
		/**
		 * Resolve the promise.
		 * A promise can be resolved only once.
		 * @param the resolution value
		 * @returns true if the resolution function was called
		 */
		this.resolve = function resolve(val) {
			return _stateMachine.event("resolve", val);
		};
		
		/**
		 * Reject the promise.
		 * A promise can be rejected only once.
		 * @param the rejection value
		 * @returns true if the rejection function was called
		 */
		this.reject = function reject(err) {
			return _stateMachine.event("reject", err);
		};
		
        /**
         * The callbacks and errbacks to call after resolution or rejection
         * @param {Function} the first parameter is a success function, it can be followed by a scope in which to run it
         * @param {Function} the second, or third parameter is an errback, it can also be followed by a scope
         * @examples:
         * 
         * then(callback)
         * then(callback, scope, errback, scope)
         * then(callback, errback)
         * then(callback, errback, scope)
         * 
         */     
		this.then = function then() {
	       if (arguments[0] instanceof Function) {
               if (arguments[1] instanceof Function) {
            	   _stateMachine.event("addSuccess", arguments[0]);
               } else {
            	   _stateMachine.event("addSuccess", arguments[0], arguments[1]);
               }
           }
           
           if (arguments[1] instanceof Function) {
        	   _stateMachine.event("addFail", arguments[1], arguments[2]);
           } 
           
           if (arguments[2] instanceof Function) {
        	   _stateMachine.event("addFail", arguments[2], arguments[3]);
           }
           return this;
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
		
	};
	
});/**
 * Emily
 * Copyright(c) 2012 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define("StateMachine", 
		
["Tools"],
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
		 * @param {String} name the name of the state
		 * @returns {State} a new state
		 */
		this.add = function add(name) {
			if (!_states[name]) {
				return _states[name] = new Transition();
			} else {
				return false;
			}

		};
		
		/**
		 * Get an existing state
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
		 * Pass an event to the state machine
		 * @param {String} name the name of the event
		 * @returns {Boolean} true if the event exists in the current state
		 */
		this.event = function event(name) {
			var nextState;
			
			nextState = _states[_currentState].event.apply(_states[_currentState].event, Tools.toArray(arguments));
			// False means that there's no such event
			// But undefined means that the state doesn't not change
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
	 */
	function Transition() {
		
		/**
		 * The list of transitions associated to a state
		 * @private
		 */
		var _transitions = {};
		
		/**
		 * Add a new transition
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
		 * @param {String} event the name of the event
		 * @returns {Boolean} true if exists
		 */
		this.has = function has(event) {
			return !!_transitions[event];
		};
		
		/**
		 * Execute the action associated to the given event
		 * @param {String} event the name of the event
		 * @param {params} params to pass to the action
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
	
});/**
 * Emily
 * Copyright(c) 2012 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define("Store", ["Observable", "Tools"],
/** 
 * @class
 * Store creates a small NoSQL database with observables
 * It can publish events on store/data changes
 */
 function Store(Observable, Tools) {
	
	/**
	 * Defines the Store
	 * @private
	 * @param values
	 * @returns
	 */
	return function StoreConstructor($data) {
		
		/**
		 * Where the data is stored
		 * @private
		 */
		var _data = Tools.clone($data) || {},
		
		/**
		 * The observable
		 * @private
		 */
		_storeObservable = new Observable(),
		
		_valueObservable = new Observable(),
		
		/**
		 * Gets the difference between two objects and notifies them
		 * @private
		 * @param previousData
		 * @returns
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
		 * @param {String} name the name of the value
		 * @param value the value to assign
		 * @returns true if value is set
		 */
		this.set = function set(name, value) {
			var ante,
				action;
			
			if (typeof name != "undefined") {
				ante = this.has(name);
				_data[name] = value;
				action = ante ? "updated" : "added";
				_storeObservable.notify(action, name, _data[name]);	
				_valueObservable.notify(name, _data[name], action);
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
		 * Watch the store's modifications
		 * @param {String} added/updated/deleted
		 * @param {Function} func the function to execute
		 * @param {Object} scope the scope in which to execute the function
		 * @returns {Handler} the subscribe's handler to use to stop watching
		 */
		this.watch = function watch(name, func, scope) {
			return _storeObservable.watch(name, func, scope);
		};
		
		/**
		 * Unwatch the store modifications
		 * @param {Handler} handler the handler returned by the watch function
		 * @returns
		 */
		this.unwatch = function unwatch(handler) {
			return _storeObservable.unwatch(handler);
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
		 * @returns true if unwatched
		 */
		this.watchValue = function watchValue(name, func, scope) {
			return _valueObservable.watch(name, func, scope);
		};
		
		/**
		 * Unwatch the value's modifications
		 * @param {Handler} handler the handler returned by the watchValue function
		 * @returns true if unwatched
		 */
		this.unwatchValue = function unwatchValue(handler) {
			return _valueObservable.unwatch(handler);
		};
		
		/**
		 * Get the observable used for watching value's modifications
		 * Should be used only for debugging
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
		 * Dumps a JSON version of all the data
		 * @returns {JSON}
		 */
		this.toJSON = function toJSON() {
			return JSON.stringify(_data);
		};
	};
});/**
 * Emily
 * Copyright(c) 2012 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define("Tools",
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
		 * @param {Object} destination object to mix values into
		 * @param {Object} source object to get values from
		 * @param {Boolean} optional, set to true to prevent overriding
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
		 * Transform array-like objects to array, such as nodeLists or arguments
		 * @param {Array-like object}
		 * @returns {Array}
		 */
		toArray: function toArray(array) {
			return Array.prototype.slice.call(array);
		},
		
		/**
		 * Small adapter for looping over objects and arrays
		 * Warning: it's not meant to be used with nodeList
		 * @param {Array/Object} iterated the array or object to loop through
		 * @param {Function} callback the function to execute for each iteration
		 * @param {Object} scope the scope in which to execute the callback
		 * @returns {Boolean} true if executed
		 */
		loop: function loop(iterated, callback, scope) {
			var i, 
				length;
			
			if (iterated instanceof Object && typeof callback == "function") {
				length = iterated.length;
				if (length) {
					for (i=0; i<length; i++) {
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
					 
					 // To get the updated
					 if (value !== before[idx] && typeof before[idx] != "undefined") {
						 updated.push(idx);
						 
					 // The unchanged	 
					 } else if (value === before[idx]) {
						 unchanged.push(idx);
					
					 // And the added
					 } else if (typeof before[idx] == "undefined") {
						 added.push(idx);
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
				return object;
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
		 * given an object such as a.b.c.d = 5, getObject(a, "b.c.d") will return 5.
		 * @param {Object} object the object to get the property from
		 * @param {String} property the path to the property as a string
		 * @returns the object or the the property value if found
		 */
		getNestedProperty: function getNestedProperty(object, property) {
			if (object && object instanceof Object) {
				if (typeof property == "string" && property != "") {
					var split = property.split(".");
					split.unshift(object);
					return split.reduce(function (obj, prop) {
						return obj[prop];
					});
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
		 * Set the property of an object nested in oen or more objects
		 * @param {Object} object
		 * @param {String} property
		 * @param value the value to set
		 * @returns object if no assignment was made or the value if the assignment was made
		 */
		setNestedProperty: function setNestedProperty(object, property, value) {
			if (object && object instanceof Object) {
				if (typeof property == "string" && property != "") {
					var split = property.split(".");
					split.unshift(object);
					return split.reduce(function (obj, prop, idx) {
						if (split.length == (idx + 1)) {
							obj[prop] = value;
						}
						return obj[prop];
					});
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
 * Copyright(c) 2012 Olivier Scherrer <pode.fr@gmail.com>
 * MIT Licensed
 */

define("Transport", 
/**
 * @class
 * Transport creates the link between your requests and Emily's requests handlers.
 * A request handler can be defined to make requets of any kind as long as it's supported
 * by your node.js. (HTTP, FileSystem, SIP...)
 */
function Transport() {
	
	/**
	 * Create a Transport
	 * @param {Object} $reqHandlers the requestHandler defined in your node.js app
	 * @returns
	 */
	return function TransportConstructor($reqHandlers) {
		
		/**
		 * The request handlers
		 * @private
		 */
		var _reqHandlers = null;
		
		/**
		 * Set the requests handlers
		 * @param {Object} reqHandlers the list of requests handlers
		 * @returns
		 */
		this.setReqHandlers = function setReqHandlers(reqHandlers) {
			if (typeof reqHandlers == "object") {
				_reqHandlers = reqHandlers;
				return true;
			} else {
				return false;
			}
		};
		
		/**
		 * Get the requests handlers
		 * @private
		 * @returns
		 */
		this.getReqHandlers = function getReqHandlers() {
			return _reqHandlers;
		};
		
		/**
		 * Make a request
		 * @param {String} channel is the name of the request handler to use
		 * @param {Object} reqData the request data
		 * @param {Function} callback the function to execute with the result
		 * @param {Object} scope the scope in which to execute the callback
		 * @returns
		 */
		this.request = function request(channel, reqData, callback, scope) {
			if (_reqHandlers && _reqHandlers[channel] && typeof reqData == "object") {
				_reqHandlers[channel](reqData, function () {
					callback.apply(scope, arguments);
				});
				return true;
			} else {
				return false;
			}
		};
		
		/**
		 * Listen to a path (Kept alive)
		 * @param {String} channel is the name of the request handler to use
		 * @param {String} url the url on which to listen
		 * @param {Function} callback the function to execute with the result
		 * @param {Object} scope the scope in which to execute the callback
		 * @returns
		 */
		this.listen = function listen(channel, url, callback, scope) {
			if (_reqHandlers && _reqHandlers[channel] &&
				typeof url == "string" && typeof callback == "function") {
				var func = function () {
					callback.apply(scope, arguments);
				},
				reqData = {
						keptAlive: true,
						method: "get",
						path: url
				},
				abort = _reqHandlers[channel](reqData, func, func);
				return function () {
					abort.func.call(abort.scope);
				};
			} else {
				return false;
			}
		};
		
		this.setReqHandlers($reqHandlers);
		
	};
	
});