
/*
 * ComposeJS, object composition for JavaScript, featuring
* JavaScript-style prototype inheritance and composition, multiple inheritance, 
* mixin and traits-inspired conflict resolution and composition  
 */
(function(define){

define('compose',[], function(){
	// function for creating instances from a prototype
	function Create(){
	}
	var delegate = Object.create ?
		function(proto){
			return Object.create(typeof proto == "function" ? proto.prototype : proto || Object.prototype);
		} :
		function(proto){
			Create.prototype = typeof proto == "function" ? proto.prototype : proto;
			var instance = new Create();
			Create.prototype = null;
			return instance;
		};
	function validArg(arg){
		if(!arg){
			throw new Error("Compose arguments must be functions or objects");
		}
		return arg;
	}
	// this does the work of combining mixins/prototypes
	function mixin(instance, args, i){
		// use prototype inheritance for first arg
		var value, argsLength = args.length; 
		for(; i < argsLength; i++){
			var arg = args[i];
			if(typeof arg == "function"){
				// the arg is a function, use the prototype for the properties
				var prototype = arg.prototype;
				for(var key in prototype){
					value = prototype[key];
					var own = prototype.hasOwnProperty(key);
					if(typeof value == "function" && key in instance && value !== instance[key]){
						var existing = instance[key]; 
						if(value == required){
							// it is a required value, and we have satisfied it
							value = existing;
						} 
						else if(!own){
							// if it is own property, it is considered an explicit override 
							// TODO: make faster calls on this, perhaps passing indices and caching
							if(isInMethodChain(value, key, getBases([].slice.call(args, 0, i), true))){
								// this value is in the existing method's override chain, we can use the existing method
								value = existing;
							}else if(!isInMethodChain(existing, key, getBases([arg], true))){
								// the existing method is not in the current override chain, so we are left with a conflict
								console.error("Conflicted method " + key + ", final composer must explicitly override with correct method.");
							}
						}
					}
					if(value && value.install && own && !isInMethodChain(existing, key, getBases([arg], true))){
						// apply modifier
						value.install.call(instance, key);
					}else{
						instance[key] = value;
					} 
				}
			}else{
				// it is an object, copy properties, looking for modifiers
				for(var key in validArg(arg)){
					var value = arg[key];
					if(typeof value == "function"){
						if(value.install){
							// apply modifier
							value.install.call(instance, key);
							continue;
						}
						if(key in instance){
							if(value == required){
								// required requirement met
								continue;
							} 
						}
					}
					// add it to the instance
					instance[key] = value;
				}
			}
		}
		return instance;	
	}
	// allow for override (by es5 module)
	Compose._setMixin = function(newMixin){
		mixin = newMixin;
	};
	function isInMethodChain(method, name, prototypes){
		// searches for a method in the given prototype hierarchy 
		for(var i = 0; i < prototypes.length;i++){
			var prototype = prototypes[i];
			if(prototype[name] == method){
				// found it
				return true;
			}
		}
	}
	// Decorator branding
	function Decorator(install, direct){
		function Decorator(){
			if(direct){
				return direct.apply(this, arguments);
			}
			throw new Error("Decorator not applied");
		}
		Decorator.install = install;
		return Decorator;
	}
	Compose.Decorator = Decorator;
	// aspect applier 
	function aspect(handler){
		return function(advice){
			return Decorator(function install(key){
				var baseMethod = this[key];
				(advice = this[key] = baseMethod ? handler(this, baseMethod, advice) : advice).install = install;
			}, advice);
		};
	};
	// around advice, useful for calling super methods too
	Compose.around = aspect(function(target, base, advice){
		return advice.call(target, base);
	});
	Compose.before = aspect(function(target, base, advice){
		return function(){
			var results = advice.apply(this, arguments);
			if(results !== stop){
				return base.apply(this, results || arguments);
			}
		};
	});
	var stop = Compose.stop = {};
	var undefined;
	Compose.after = aspect(function(target, base, advice){
		return function(){
			var results = base.apply(this, arguments);
			var adviceResults = advice.apply(this, arguments);
			return adviceResults === undefined ? results : adviceResults;
		};
	});
	
	// rename Decorator for calling super methods
	Compose.from = function(trait, fromKey){
		if(fromKey){
			return (typeof trait == "function" ? trait.prototype : trait)[fromKey];
		}
		return Decorator(function(key){
			if(!(this[key] = (typeof trait == "string" ? this[trait] : 
				(typeof trait == "function" ? trait.prototype : trait)[fromKey || key]))){
				throw new Error("Source method " + fromKey + " was not available to be renamed to " + key);
			}
		});
	};
	
	// Composes an instance
	Compose.create = function(base){
		// create the instance
		var instance = mixin(delegate(base), arguments, 1);
		var argsLength = arguments.length;
		// for go through the arguments and call the constructors (with no args)
		for(var i = 0; i < argsLength; i++){
			var arg = arguments[i];
			if(typeof arg == "function"){
				instance = arg.call(instance) || instance;
			}
		}
		return instance;
	}
	// The required function, just throws an error if not overriden
	function required(){
		throw new Error("This method is required and no implementation has been provided");
	};
	Compose.required = required;
	// get the value of |this| for direct function calls for this mode (strict in ES5)
	
	function extend(){
		var args = [this];
		args.push.apply(args, arguments);
		return Compose.apply(0, args);
	}
	// Compose a constructor
	function Compose(base){
		var args = arguments;
		var prototype = (args.length < 2 && typeof args[0] != "function") ? 
			args[0] : // if there is just a single argument object, just use that as the prototype 
			mixin(delegate(validArg(base)), args, 1); // normally create a delegate to start with			
		function Constructor(){
			var instance;
			if(this instanceof Constructor){
				// called with new operator, can proceed as is
				instance = this;
			}else{
				// we allow for direct calls without a new operator, in this case we need to
				// create the instance ourself.
				Create.prototype = prototype;
				instance = new Create();
			}
			// call all the constructors with the given arguments
			for(var i = 0; i < constructorsLength; i++){
				var constructor = constructors[i];
				var result = constructor.apply(instance, arguments);
				if(typeof result == "object"){
					if(result instanceof Constructor){
						instance = result;
					}else{
						for(var j in result){
							if(result.hasOwnProperty(j)){
								instance[j] = result[j];
							}
						}
					}
				}	
			}
			return instance;
		}
		// create a function that can retrieve the bases (constructors or prototypes)
		Constructor._getBases = function(prototype){
			return prototype ? prototypes : constructors;
		};
		// now get the prototypes and the constructors
		var constructors = getBases(args), 
			constructorsLength = constructors.length;
		if(typeof args[args.length - 1] == "object"){
			args[args.length - 1] = prototype;
		}
		var prototypes = getBases(args, true);
		Constructor.extend = extend;
		if(!Compose.secure){
			prototype.constructor = Constructor;
		}
		Constructor.prototype = prototype;
		return Constructor;
	};
	
	Compose.apply = function(thisObject, args){
		// apply to the target
		return thisObject ? 
			mixin(thisObject, args, 0) : // called with a target object, apply the supplied arguments as mixins to the target object
			extend.apply.call(Compose, 0, args); // get the Function.prototype apply function, call() it to apply arguments to Compose (the extend doesn't matter, just a handle way to grab apply, since we can't get it off of Compose) 
	};
	Compose.call = function(thisObject){
		// call() should correspond with apply behavior
		return mixin(thisObject, arguments, 1);
	};
	
	function getBases(args, prototype){
		// this function registers a set of constructors for a class, eliminating duplicate
		// constructors that may result from diamond construction for classes (B->A, C->A, D->B&C, then D() should only call A() once)
		var bases = [];
		function iterate(args, checkChildren){
			outer: 
			for(var i = 0; i < args.length; i++){
				var arg = args[i];
				var target = prototype && typeof arg == "function" ?
						arg.prototype : arg;
				if(prototype || typeof arg == "function"){
					var argGetBases = checkChildren && arg._getBases;
					if(argGetBases){
						iterate(argGetBases(prototype)); // don't need to check children for these, this should be pre-flattened 
					}else{
						for(var j = 0; j < bases.length; j++){
							if(target == bases[j]){
								continue outer;
							}
						}
						bases.push(target);
					}
				}
			}
		}
		iterate(args, true);
		return bases;
	}
	// returning the export of the module
	return Compose;
});
})(typeof define != "undefined" ?
	define: // AMD/RequireJS format if available
	function(deps, factory){
		if(typeof module !="undefined"){
			module.exports = factory(); // CommonJS environment, like NodeJS
		//	require("./configure");
		}else{
			Compose = factory(); // raw script, assign to Compose global
		}
	});

/*!
 * TroopJS base component
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/**
 * The base trait provides functionality for instance counting,
 * configuration and a default 'toString' method.
 */
define('troopjs-core/component/base',[ "compose", "config" ], function ComponentModule(Compose, config) {
	var COUNT = 0;

	return Compose(function Component() {
		this.instanceCount = COUNT++;
	}, {
		/**
		 * Application configuration
		 */
		config : config,

		/**
		 * Generates string representation of this object
		 * @returns Combination displayName and instanceCount
		 */
		toString : function toString() {
			var self = this;

			return (self.displayName || "component") + "@" + self.instanceCount;
		}
	});
});

/*!
 * TroopJS deferred component
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('deferred',[ "jquery" ], function DeferredModule($) {
	return $.Deferred;
});
/*!
 * TroopJS pubsub/topic module
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/pubsub/topic',[ "../component/base" ], function TopicModule(Component) {
	var ARRAY = Array;

	return Component.extend(function Topic(topic, publisher, parent) {
		var self = this;

		self.topic = topic;
		self.publisher = publisher;
		self.parent = parent;
	}, {
		displayName : "pubsub/topic",

		/**
		 * Generates string representation of this object
		 * @returns Instance topic
		 */
		toString : function toString() {
			return this.topic;
		},

		/**
		 * Traces topic origin to root
		 * @returns String representation of all topics traced down to root
		 */
		trace : function trace() {
			var current = this;
			var constructor = current.constructor;
			var parent;
			var item;
			var stack = "";
			var i;
			var iMax;

			while (current) {
				if (current.constructor === ARRAY) {
					for (i = 0, iMax = current.length; i < iMax; i++) {
						item = current[i];

						current[i] = item.constructor === constructor
							? item.trace()
							: item;
					}

					stack += current.join(",");
					break;
				}

				parent = current.parent;
				stack += parent
					? current.publisher + ":"
					: current.publisher;
				current = parent;
			}

			return stack;
		}
	});
});
/*!
 * TroopJS pubsub/hub module
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/pubsub/hub',[ "compose", "../component/base", "./topic" ], function HubModule(Compose, Component, Topic) {
	var UNDEFINED = undefined;
	var RECURSIVE = "\/" + "**";

	return Compose.create(Component, function Hub() {
		var self = this;

		self.re = /\/\w+(?=\/)|\*{1,2}$/g;
		self.context = {};
		self.topics = {};
	}, {
		displayName: "pubsub/hub",

		/**
		 * Subscribe to a topic
		 * 
		 * @param topic Topic to subscribe to
		 * @param context (optional) context to scope callbacks to
		 * @param callback Callback for this topic
		 * @returns self
		 */
		subscribe : function subscribe(topic /*, context, callback,* callback, ..*/) {
			var self = this;
			var topics = self.topics;
			var offset = 1;
			var length = arguments.length;
			var context = arguments[offset];
			var head;
			var tail;

			// No provided context, set default one
			if (context instanceof Function) {
				context = self.context;
			}
			// Context was provided, increase offset
			else {
				offset++;
			}

			// Do we have handlers
			if (topic in topics) {
				// Get last handler
				tail = topics[topic].tail;

				for (; offset < length; offset++) {
					// Set last -> last.next -> handler
					tail = tail.next = {
						"callback" : arguments[offset],
						"context" : context
					};
				}

				// Set last handler
				topics[topic].tail = tail;
			}
			// No handlers
			else {
				// Create head and tail
				head = tail = {
					"callback" : arguments[offset++],
					"context" : context
				};

				// Loop through arguments
				for (; offset < length; offset++) {
					// Set last -> last.next -> handler
					tail = tail.next = {
						"callback" : arguments[offset],
						"context" : context
					};
				}

				// Create topic list
				topics[topic] = {
					"head" : head,
					"tail" : tail
				};
			}

			return self;
		},

		/**
		 * Unsubscribes from topic
		 * 
		 * @param topic Topic to unsubscribe from
		 * @param callback (optional) Callback to unsubscribe, if none
		 *        are provided all callbacks are unsubscribed
		 * @returns self
		 */
		unsubscribe : function unsubscribe(topic /*, callback, callback, ..*/) {
			var self = this;
			var topics = self.topics;
			var offset;
			var length = arguments.length;
			var head;
			var previous = null;
			var handler;
			var callback;

			unsubscribe: {
				// Fast fail if we don't have subscribers
				if (!topic in topics) {
					break unsubscribe;
				}

				// Simply delete list if there is no callback to match
				if (length === 1) {
					delete topics[topic];
					break unsubscribe;
				}

				// Get head
				head = topics[topic].head;

				// Loop over remaining arguments
				for (offset = 1; offset < length; offset++) {
					// Store callback
					callback = arguments[offset];

					// Get first handler
					handler = previous = head;

					// Loop through handlers
					do {
						// Check if this handler should be unlinked
						if (handler.callback === callback) {
							// Is this the first handler
							if (handler === head) {
								// Re-link head and previous, then
								// continue
								head = previous = handler.next;
								continue;
							}

							// Unlink current handler, then continue
							previous.next = handler.next;
							continue;
						}

						// Update previous pointer
						previous = handler;
					} while (handler = handler.next);

					// Delete list if we've deleted all handlers
					if (head === UNDEFINED) {
						delete topics[topic];
						break unsubscribe;
					}
				}

				// Update head and tail
				topics[topic] = {
					"head" : head,
					"tail" : previous
				};
			}

			return self;
		},

		/**
		 * Publishes on a topic
		 * 
		 * @param topic Topic to publish to
		 * @param arg (optional) Argument
		 * @returns self
		 */
		publish : function publish(topic /*, arg, arg, ..*/) {
			var self = this;
			var topics = self.topics;
			var string = topic.constructor === Topic
					? topic.toString()
					: topic;
			var re = self.re;
			var candidates = new Array();
			var candidate;
			var length = 0;
			var handler;

			// Create initial set of candidates
			while (re.test(string)) {
				candidates[length++] = string.substr(0, re.lastIndex) + RECURSIVE;
			}

			// Are sub-topics even possible?
			if (length > 0) {
				// Copy second to last candidate to last, minus the last
				// char
				candidates[length] = candidates[length - 1].slice(0, -1);

				// Increase length
				length++;
			}

			// Add original topic to the candidates
			candidates[length] = string;

			// Optimise of no arguments
			if (arguments.length === 0) {
				// Loop backwards over candidates
				do {
					// Get candidate
					candidate = candidates[length];

					// Fail fast if there are no handlers for candidate
					if (!(candidate in topics)) {
						continue;
					}

					// Get first handler
					handler = topics[candidate].head;

					// Loop through handlers
					do {
						handler.callback.call(handler.context);
					} while (handler = handler.next);
				} while (length-- > 0);
			}
			// Optimise for arguments
			else {
				// Loop backwards over candidates
				do {
					// Get candidate
					candidate = candidates[length];

					// Fail fast if there are no handlers for candidate
					if (!(candidate in topics)) {
						continue;
					}

					// Get first handler
					handler = topics[candidate].head;

					// Loop through handlers
					do {
						handler.callback
								.apply(handler.context, arguments);
					} while (handler = handler.next);
				} while (length-- > 0);
			}

			return self;
		}
	});
});

/*!
 * TroopJS gadget component
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/**
 * The gadget trait provides convenient access to common application
 * logic such as pubsub* and ajax
 */
define('troopjs-core/component/gadget',[ "compose", "./base", "../pubsub/hub", "../pubsub/topic", "deferred" ], function GadgetModule(Compose, Component, hub, Topic, Deferred) {
	var NULL = null;
	var FUNCTION = Function;
	var BUILD = "build";
	var DESTROY = "destroy";
	var RE_SCAN = new RegExp("^(" + [BUILD, DESTROY].join("|") + ")/.+");
	var RE_HUB = /^hub\/(.+)/;
	var PUBLISH = hub.publish;
	var SUBSCRIBE = hub.subscribe;
	var UNSUBSCRIBE = hub.unsubscribe;

	return Component.extend(function Gadget() {
		var self = this;
		var builder = NULL;
		var destructor = NULL;
		var subscriptions = new Array();

		Compose.call(self, {
			/**
			 * First scans for build/destroy signatures and pushes them on the stack
			 * then iterates builders and executes them in reverse order
			 * @returns self
			 */
			build : function build() {
				var key = NULL;
				var value;
				var matches;
				var current;

				// Loop over each property in component
				for (key in self) {
					// Get value
					value = self[key];

					// Continue if value is not a function
					if (!(value instanceof FUNCTION)) {
						continue;
					}

					// Get matches
					matches = RE_SCAN.exec(key);

					// Make sure we have matches
					if (matches !== NULL) {
						// Switch on prefix
						switch (matches[1]) {
						case BUILD:
							// Update next
							value.next = builder;
							// Update current
							builder = value;
							break;

						case DESTROY:
							// Update next
							value.next = destructor;
							// Update current
							destructor = value;
							break;

						default:
							continue;
						}

						// Update topic
						value.topic = key;

						// NULL value
						self[key] = NULL;
					}
				}

				// Set current
				current = builder;

				while (current !== NULL) {
					current.call(self);

					current = current.next;
				}

				return self;
			},

			/**
			 * Iterates destructors and executes them in reverse order
			 * @returns self
			 */
			destroy : function iterator() {
				var current = destructor;

				while (current !== NULL) {
					current.call(self);

					current = current.next;
				}

				return self;
			},

			/**
			 * Builder for hub subscriptions
			 * @returns self
			 */
			"build/hub" : function build() {
				var key = NULL;
				var value;
				var matches;
				var topic;

				// Loop over each property in gadget
				for (key in self) {
					// Get value
					value = self[key];

					// Continue if value is not a function
					if (!(value instanceof FUNCTION)) {
						continue;
					}

					// Match signature in key
					matches = RE_HUB.exec(key);

					if (matches !== NULL) {
						// Get topic
						topic = matches[1];

						// Subscribe
						hub.subscribe(new Topic(topic, self), self, value);

						// Store in subscriptions
						subscriptions[subscriptions.length] = [topic, value];

						// NULL value
						self[key] = NULL;
					}
				}

				return self;
			},

			/**
			 * Destructor for hub subscriptions
			 * @returns self
			 */
			"destroy/hub": function destroy() {
				var subscription;

				// Loop over subscriptions
				while (subscription = subscriptions.shift()) {
					hub.unsubscribe(subscription[0], subscription[1]);
				}

				return self;
			},
		});
	}, {
		/**
		 * Calls hub.publish in self context
		 * @returns self
		 */
		publish : function publish() {
			var self = this;

			PUBLISH.apply(hub, arguments);

			return self;
		},

		/**
		 * Calls hub.subscribe in self context
		 * @returns self
		 */
		subscribe : function subscribe() {
			var self = this;

			SUBSCRIBE.apply(hub, arguments);

			return self;
		},

		/**
		 * Calls hub.unsubscribe in self context
		 * @returns self
		 */
		unsubscribe : function unsubscribe() {
			var self = this;

			UNSUBSCRIBE.apply(hub, arguments);

			return self;
		}
	});
});

/*!
 * TroopJS widget component
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/**
 * The widget trait provides common UI related logic
 */
define('troopjs-core/component/widget',[ "compose", "./gadget", "jquery" ], function WidgetModule(Compose, Gadget, $) {
	var NULL = null;
	var FUNCTION = Function;
	var ARRAY_PROTO = Array.prototype;
	var SLICE = ARRAY_PROTO.slice;
	var UNSHIFT = ARRAY_PROTO.unshift;
	var RE = /^dom(?::(\w+))?\/([^\.]+(?:\.(.+))?)/;
	var REFRESH = "widget/refresh";
	var $ELEMENT = "$element";
	var ONE = "one";
	var BIND = "bind";
	var ATTR_WEAVE = "[data-weave]";
	var ATTR_WOVEN = "[data-woven]";

	/**
	 * Creates a proxy of the inner method 'handlerProxy' with the 'topic', 'widget' and handler parameters set
	 * @param topic event topic
	 * @param widget target widget
	 * @param handler target handler
	 * @returns {Function} proxied handler
	 */
	function eventProxy(topic, widget, handler) {
		/**
		 * Creates a proxy of the outer method 'handler' that first adds 'topic' to the arguments passed
		 * @returns result of proxied hanlder invocation
		 */
		return function handlerProxy() {
			// Add topic to front of arguments
			UNSHIFT.call(arguments, topic);

			// Apply with shifted arguments to handler
			return handler.apply(widget, arguments);
		};
	}

	/**
	 * Creates a proxy of the inner method 'render' with the 'op' parameter set
	 * @param op name of jQuery method call
	 * @returns {Function} proxied render
	 */
	function renderProxy(op) {
		/**
		 * Renders contents into element
		 * @param contents (Function | String) Template/String to render
		 * @param data (Object) If contents is a template - template data
		 * @param deferred (Deferred) Deferred (optional)
		 * @returns self
		 */
		function render(contents, data, deferred) {
			var self = this;

			// If contents is a function, call it
			if (contents instanceof FUNCTION) {
				contents = contents.call(self, data);
			}
			// otherwise data makes no sense
			else {
				deferred = data;
			}

			var $element = self[$ELEMENT];

			// Defer render (as weaving it may need to load async)
			var deferredRender = $.Deferred(function deferredRender(dfdRender) {
				// Call render
				op.call($element, contents);

				// Weave element
				self.weave($element, dfdRender);
			})
			.done(function renderDone() {
				// After render is complete, trigger "widget/refresh" with woven components
				$element.trigger(REFRESH, arguments);
			});

			if (deferred) {
				deferredRender.then(deferred.resolve, deferred.reject);
			}

			return self;
		}

		return render;
	}

	return Gadget.extend(function Widget($element, displayName) {
		var self = this;
		var $proxies = new Array();

		// Extend self
		Compose.call(self, {
			"build/dom" : function build() {
				var key = NULL;
				var value;
				var matches;
				var topic;

				// Loop over each property in widget
				for (key in self) {
					// Get value
					value = self[key];

					// Continue if value is not a function
					if (!(value instanceof FUNCTION)) {
						continue;
					}

					// Match signature in key
					matches = RE.exec(key);

					if (matches !== NULL) {
						// Get topic
						topic = matches[2];

						// Replace value with a scoped proxy
						value = eventProxy(topic, self, value);

						// Either ONE or BIND element
						$element[matches[2] === ONE ? ONE : BIND](topic, self, value);

						// Store in $proxies
						$proxies[$proxies.length] = [topic, value];

						// NULL value
						self[key] = NULL;
					}
				}

				return self;
			},

			/**
			 * Destructor for dom events
			 * @returns self
			 */
			"destroy/dom" : function destroy() {
				var $proxy;

				// Loop over subscriptions
				while ($proxy = $proxies.shift()) {
					$element.unbind($proxy[0], $proxy[1]);
				}

				return self;
			},

			"$element" : $element,
			"displayName" : displayName || "component/widget"
		});
	}, {
		/**
		 * Weaves all children of $element
		 * @param $element (jQuery) Element to weave
		 * @param deferred (Deferred) Deferred (optional)
		 * @returns self
		 */
		weave : function weave($element, deferred) {
			$element.find(ATTR_WEAVE).weave(deferred);

			return this;
		},

		/**
		 * Unweaves all children of $element _and_ self
		 * @param $element (jQuery) Element to unweave
		 * @returns self
		 */
		unweave : function unweave($element) {
			$element.find(ATTR_WOVEN).andSelf().unweave();

			return this;
		},

		/**
		 * Triggers event on $element
		 * @param $event (jQuery.Event | String) Event to trigger
		 * @returns self
		 */
		trigger : function trigger($event) {
			var self = this;

			self[$ELEMENT].trigger($event, SLICE.call(arguments, 1));

			return self;
		},

		/**
		 * Renders content and inserts it before $element
		 */
		before : renderProxy($.fn.before),

		/**
		 * Renders content and inserts it after $element
		 */
		after : renderProxy($.fn.after),

		/**
		 * Renders content and replaces $element contents
		 */
		html : renderProxy($.fn.html),

		/**
		 * Renders content and appends it to $element
		 */
		append : renderProxy($.fn.append),

		/**
		 * Renders content and prepends it to $element
		 */
		prepend : renderProxy($.fn.prepend),

		/**
		 * Empties widget
		 * @param deferred (Deferred) Deferred (optional)
		 * @returns self
		 */
		empty : function empty(deferred) {
			var self = this;

			var $element = self[$ELEMENT];

			// Create deferred for emptying
			var emptyDeferred = $.Deferred(function emptyDeferred(dfd) {

				// Detach contents
				var $contents = $element.contents().detach();

				// Trigger refresh
				$element.trigger(REFRESH, arguments);

				// Get DOM elements
				var contents = $contents.get();

				// Use timeout in order to yield
				setTimeout(function emptyTimeout() {
					try {
						// Remove elements from DOM
						$contents.remove();

						// Resolve deferred
						dfd.resolve(contents);
					}
					// If there's an error
					catch (e) {
						// Reject deferred
						dfd.reject(contents);
					}
				}, 0);
			});

			// If a deferred was passed, add resolve/reject
			if (deferred) {
				emptyDeferred.then(deferred.resolve, deferred.reject);
			}

			return self;
		}
	});
});

/*!
 * TroopJS util/merge module
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/util/merge',[],function MergeModule() {
	var ARRAY = Array;
	var OBJECT = Object;

	return function merge(source) {
		var target = this;
		var key = null;
		var i;
		var iMax;
		var value;
		var constructor;

		for (i = 0, iMax = arguments.length; i < iMax; i++) {
			source = arguments[i];

			for (key in source) {
				value = source[key];
				constructor = value.constructor;
	
				if (!(key in target)) {
					target[key] = value;
				}
				else if (constructor === ARRAY) {
					target[key] = target[key].concat(value);
				}
				else if (constructor === OBJECT) {
					merge.call(target[key], value);
				}
				else {
					target[key] = value;
				}
			}
		}

		return target;
	};
});
/*!
 * TroopJS remote/ajax module
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/remote/ajax',[ "compose", "../component/gadget", "../pubsub/topic", "jquery", "../util/merge" ], function AjaxModule(Compose, Gadget, Topic, $, merge) {

	return Compose.create(Gadget, function Ajax() {
		// Build
		this.build();
	}, {
		displayName : "remote/ajax",

		"hub/ajax" : function request(topic, settings, deferred) {
			// Request
			$.ajax(merge.call({
				"headers": {
					"x-request-id": new Date().getTime(),
					"x-components": topic.constructor === Topic ? topic.trace() : topic
				}
			}, settings)).then(deferred.resolve, deferred.reject);
		}
	});
});
/*!
 * TroopJS store/base module
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/store/base',[ "compose", "../component/gadget" ], function StoreModule(Compose, Gadget) {
	return Gadget.extend({
		set : Compose.required,
		get : Compose.required,
		remove : Compose.required,
		clear : Compose.required
	});
});
/*!
 * TroopJS store/local module
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/store/local',[ "compose", "./base" ], function StoreLocalModule(Compose, Store) {

	// Grab local storage
	var STORAGE = window.localStorage;

	return Compose.create(Store, {
		displayName : "store/local",

		set : function set(key, value, deferred) {
			// JSON encoded 'value' then store as 'key'
			STORAGE.setItem(key, JSON.stringify(value));

			// Resolve deferred
			if (deferred && deferred.resolve instanceof Function) {
				deferred.resolve(value);
			}
		},

		get : function get(key, deferred) {
			// Get value from 'key', parse JSON
			var value = JSON.parse(STORAGE.getItem(key));

			// Resolve deferred
			if (deferred && deferred.resolve instanceof Function) {
				deferred.resolve(value);
			}
		},

		remove : function remove(key, deferred) {
			// Remove key
			STORAGE.removeItem(key);

			// Resolve deferred
			if (deferred && deferred.resolve instanceof Function) {
				deferred.resolve();
			}
		},

		clear : function clear(deferred) {
			// Clear
			STORAGE.clear();

			// Resolve deferred
			if (deferred && deferred.resolve instanceof Function) {
				deferred.resolve();
			}
		}
	});
});
/*!
 * TroopJS store/session module
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-core/store/session',[ "compose", "./base" ], function StoreSessionModule(Compose, Store) {

	// Grab session storage
	var STORAGE = window.sessionStorage;

	return Compose.create(Store, {
		displayName : "store/session",

		set : function set(key, value, deferred) {
			// JSON encoded 'value' then store as 'key'
			STORAGE.setItem(key, JSON.stringify(value));

			// Resolve deferred
			if (deferred && deferred.resolve instanceof Function) {
				deferred.resolve(value);
			}
		},

		get : function get(key, deferred) {
			// Get value from 'key', parse JSON
			var value = JSON.parse(STORAGE.getItem(key));

			// Resolve deferred
			if (deferred && deferred.resolve instanceof Function) {
				deferred.resolve(value);
			}
		},

		remove : function remove(key, deferred) {
			// Remove key
			STORAGE.removeItem(key);

			// Resolve deferred
			if (deferred && deferred.resolve instanceof Function) {
				deferred.resolve();
			}
		},

		clear : function clear(deferred) {
			// Clear
			STORAGE.clear();

			// Resolve deferred
			if (deferred && deferred.resolve instanceof Function) {
				deferred.resolve();
			}
		}
	});
});
/**
 * @license RequireJS text 1.0.7 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
/*jslint regexp: false, nomen: false, plusplus: false, strict: false */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false,
  define: false, window: false, process: false, Packages: false,
  java: false, location: false */

(function () {
    var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = [];

    define('text',[],function () {
        var text, get, fs;

        if (typeof window !== "undefined" && window.navigator && window.document) {
            get = function (url, callback) {
                var xhr = text.createXhr();
                xhr.open('GET', url, true);
                xhr.onreadystatechange = function (evt) {
                    //Do not explicitly handle errors, those should be
                    //visible via console output in the browser.
                    if (xhr.readyState === 4) {
                        callback(xhr.responseText);
                    }
                };
                xhr.send(null);
            };
        } else if (typeof process !== "undefined" &&
                 process.versions &&
                 !!process.versions.node) {
            //Using special require.nodeRequire, something added by r.js.
            fs = require.nodeRequire('fs');

            get = function (url, callback) {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            };
        } else if (typeof Packages !== 'undefined') {
            //Why Java, why is this so awkward?
            get = function (url, callback) {
                var encoding = "utf-8",
                    file = new java.io.File(url),
                    lineSeparator = java.lang.System.getProperty("line.separator"),
                    input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                    stringBuffer, line,
                    content = '';
                try {
                    stringBuffer = new java.lang.StringBuffer();
                    line = input.readLine();

                    // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                    // http://www.unicode.org/faq/utf_bom.html

                    // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                    // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                    if (line && line.length() && line.charAt(0) === 0xfeff) {
                        // Eat the BOM, since we've already found the encoding on this file,
                        // and we plan to concatenating this buffer with others; the BOM should
                        // only appear at the top of a file.
                        line = line.substring(1);
                    }

                    stringBuffer.append(line);

                    while ((line = input.readLine()) !== null) {
                        stringBuffer.append(lineSeparator);
                        stringBuffer.append(line);
                    }
                    //Make sure we return a JavaScript string and not a Java string.
                    content = String(stringBuffer.toString()); //String
                } finally {
                    input.close();
                }
                callback(content);
            };
        }

        text = {
            version: '1.0.7',

            strip: function (content) {
                //Strips <?xml ...?> declarations so that external SVG and XML
                //documents can be added to a document without worry. Also, if the string
                //is an HTML document, only the part inside the body tag is returned.
                if (content) {
                    content = content.replace(xmlRegExp, "");
                    var matches = content.match(bodyRegExp);
                    if (matches) {
                        content = matches[1];
                    }
                } else {
                    content = "";
                }
                return content;
            },

            jsEscape: function (content) {
                return content.replace(/(['\\])/g, '\\$1')
                    .replace(/[\f]/g, "\\f")
                    .replace(/[\b]/g, "\\b")
                    .replace(/[\n]/g, "\\n")
                    .replace(/[\t]/g, "\\t")
                    .replace(/[\r]/g, "\\r");
            },

            createXhr: function () {
                //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
                var xhr, i, progId;
                if (typeof XMLHttpRequest !== "undefined") {
                    return new XMLHttpRequest();
                } else {
                    for (i = 0; i < 3; i++) {
                        progId = progIds[i];
                        try {
                            xhr = new ActiveXObject(progId);
                        } catch (e) {}

                        if (xhr) {
                            progIds = [progId];  // so faster next time
                            break;
                        }
                    }
                }

                if (!xhr) {
                    throw new Error("createXhr(): XMLHttpRequest not available");
                }

                return xhr;
            },

            get: get,

            /**
             * Parses a resource name into its component parts. Resource names
             * look like: module/name.ext!strip, where the !strip part is
             * optional.
             * @param {String} name the resource name
             * @returns {Object} with properties "moduleName", "ext" and "strip"
             * where strip is a boolean.
             */
            parseName: function (name) {
                var strip = false, index = name.indexOf("."),
                    modName = name.substring(0, index),
                    ext = name.substring(index + 1, name.length);

                index = ext.indexOf("!");
                if (index !== -1) {
                    //Pull off the strip arg.
                    strip = ext.substring(index + 1, ext.length);
                    strip = strip === "strip";
                    ext = ext.substring(0, index);
                }

                return {
                    moduleName: modName,
                    ext: ext,
                    strip: strip
                };
            },

            xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

            /**
             * Is an URL on another domain. Only works for browser use, returns
             * false in non-browser environments. Only used to know if an
             * optimized .js version of a text resource should be loaded
             * instead.
             * @param {String} url
             * @returns Boolean
             */
            useXhr: function (url, protocol, hostname, port) {
                var match = text.xdRegExp.exec(url),
                    uProtocol, uHostName, uPort;
                if (!match) {
                    return true;
                }
                uProtocol = match[2];
                uHostName = match[3];

                uHostName = uHostName.split(':');
                uPort = uHostName[1];
                uHostName = uHostName[0];

                return (!uProtocol || uProtocol === protocol) &&
                       (!uHostName || uHostName === hostname) &&
                       ((!uPort && !uHostName) || uPort === port);
            },

            finishLoad: function (name, strip, content, onLoad, config) {
                content = strip ? text.strip(content) : content;
                if (config.isBuild) {
                    buildMap[name] = content;
                }
                onLoad(content);
            },

            load: function (name, req, onLoad, config) {
                //Name has format: some.module.filext!strip
                //The strip part is optional.
                //if strip is present, then that means only get the string contents
                //inside a body tag in an HTML string. For XML/SVG content it means
                //removing the <?xml ...?> declarations so the content can be inserted
                //into the current doc without problems.

                // Do not bother with the work if a build and text will
                // not be inlined.
                if (config.isBuild && !config.inlineText) {
                    onLoad();
                    return;
                }

                var parsed = text.parseName(name),
                    nonStripName = parsed.moduleName + '.' + parsed.ext,
                    url = req.toUrl(nonStripName),
                    useXhr = (config && config.text && config.text.useXhr) ||
                             text.useXhr;

                //Load the text. Use XHR if possible and in a browser.
                if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                    text.get(url, function (content) {
                        text.finishLoad(name, parsed.strip, content, onLoad, config);
                    });
                } else {
                    //Need to fetch the resource across domains. Assume
                    //the resource has been optimized into a JS module. Fetch
                    //by the module name + extension, but do not include the
                    //!strip part to avoid file system issues.
                    req([nonStripName], function (content) {
                        text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                        parsed.strip, content, onLoad, config);
                    });
                }
            },

            write: function (pluginName, moduleName, write, config) {
                if (moduleName in buildMap) {
                    var content = text.jsEscape(buildMap[moduleName]);
                    write.asModule(pluginName + "!" + moduleName,
                                   "define(function () { return '" +
                                       content +
                                   "';});\n");
                }
            },

            writeFile: function (pluginName, moduleName, req, write, config) {
                var parsed = text.parseName(moduleName),
                    nonStripName = parsed.moduleName + '.' + parsed.ext,
                    //Use a '.js' file name so that it indicates it is a
                    //script that can be loaded across domains.
                    fileName = req.toUrl(parsed.moduleName + '.' +
                                         parsed.ext) + '.js';

                //Leverage own load() method to load plugin value, but only
                //write out values that do not have the strip argument,
                //to avoid any potential issues with ! in file names.
                text.load(nonStripName, req, function (value) {
                    //Use own write() method to construct full module value.
                    //But need to create shell that translates writeFile's
                    //write() to the right interface.
                    var textWrite = function (contents) {
                        return write(fileName, contents);
                    };
                    textWrite.asModule = function (moduleName, contents) {
                        return write.asModule(moduleName, fileName, contents);
                    };

                    text.write(pluginName, nonStripName, textWrite, config);
                }, config);
            }
        };

        return text;
    });
}());

/*!
 * TroopJS RequireJS template plug-in
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/**
 * This plugin provides a template loader and compiler.
 */
define('template',[ "text" ], function TemplateModule(text) {
	var RE_SANITIZE = /^[\n\t\r]+|[\n\t\r]+$/g;
	var RE_BLOCK = /<%(=)?([\S\s]*?)%>/g;
	var RE_TOKENS = /<%(\d+)%>/gm;
	var RE_REPLACE = /(["\n\t\r])/gm;
	var RE_CLEAN = /o \+= "";| \+ ""/gm;
	var EMPTY = "";
	var REPLACE = {
		"\"" : "\\\"",
		"\n" : "\\n",
		"\t" : "\\t",
		"\r" : "\\r"
	};

	var buildMap = {};

	/**
	 * Compiles template
	 * 
	 * @param body Template body
	 * @returns {Function}
	 */
	function compile(body) {
		var blocks = [];
		var length = 0;

		function blocksTokens(original, prefix, block) {
			blocks[length] = prefix
				? "\" +" + block + "+ \""
				: "\";" + block + "o += \"";
			return "<%" + String(length++) + "%>";
		}

		function tokensBlocks(original, token) {
			return blocks[token];
		}

		function replace(original, token) {
			return REPLACE[token] || token;
		}

		return new Function("data", ("var o; o = \""
		// Sanitize body before we start templating
		+ body.replace(RE_SANITIZE, "")

		// Replace script blocks with tokens
		.replace(RE_BLOCK, blocksTokens)

		// Replace unwanted tokens
		.replace(RE_REPLACE, replace)

		// Replace tokens with script blocks
		.replace(RE_TOKENS, tokensBlocks)

		+ "\"; return o;")

		// Clean
		.replace(RE_CLEAN, EMPTY));
	}

	return {
		load : function(name, req, load, config) {
			text.load(name, req, function(value) {
				// Compile template and store in buildMap
				var template = buildMap[name] = compile(value);

				// Set display name for debugging
				template.displayName = name;

				// Pass template to load
				load(template);
			}, config);
		},

		write : function(pluginName, moduleName, write, config) {
			if (moduleName in buildMap) {
				write.asModule(pluginName + "!" + moduleName, "define(function () { return " + buildMap[moduleName].toString().replace(RE_SANITIZE, EMPTY) + ";});\n");
			}
		}
	};
});

/*!
 * TroopJS jQuery action plug-in
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-jquery/action',[ "jquery" ], function ActionModule($) {
	var UNDEFINED = undefined;
	var FALSE = false;
	var NULL = null;
	var SLICE = Array.prototype.slice;
	var ACTION = "action";
	var TRUE = "true";
	var ORIGINALEVENT = "originalEvent";
	var RE_ACTION = /^([\w\d\s_\-\/]+)(?:\.([\w\.]+))?(?:\((.*)\))?$/;
	var RE_SEPARATOR = /\s*,\s*/;
	var RE_DOT = /\.+/;
	var RE_STRING = /^(["']).*\1$/;
	var RE_DIGIT = /^\d+$/;
	var RE_BOOLEAN = /^false|true$/i;

	/**
	 * Namespace iterator
	 * @param namespace (string) namespace
	 * @param index (number) index
	 */
	function namespaceIterator(namespace, index) {
		return namespace ? namespace + "." + ACTION : NULL;
	}

	/**
	 * Action handler
	 * @param $event (jQuery.Event) event
	 */
	function onAction($event) {
		// Set $target
		var $target = $(this);
		// Get argv
		var argv = SLICE.call(arguments, 1);
		// Extract type
		var type = ORIGINALEVENT in $event
			? $event[ORIGINALEVENT].type
			: ACTION;
		// Extract name
		var name = $event[ACTION];

		// Reset $event.type
		$event.type = ACTION + "/" + name + "." + type;

		// Trigger 'ACTION/{name}.{type}'
		$target.trigger($event, argv);

		// No handler, try without namespace, but exclusive
		if ($event.result !== FALSE) {
			// Reset $event.type
			$event.type = ACTION + "/" + name + "!";

			// Trigger 'ACTION/{name}'
			$target.trigger($event, argv);

			// Still no handler, try generic action with namespace
			if ($event.result !== FALSE) {
				// Reset $event.type
				$event.type = ACTION + "." + type;

				// Trigger 'ACTION.{type}'
				$target.trigger($event, argv);
			}
		}
	}

	/**
	 * Internal handler
	 * 
	 * @param $event jQuery event
	 */
	function handler($event) {
		// Get closest element that has an action defined
		var $target = $($event.target).closest("[data-action]");

		// Fail fast if there is no action available
		if ($target.length === 0) {
			return;
		}

		// Extract all data in one go
		var $data = $target.data();
		// Extract matches from 'data-action'
		var matches = RE_ACTION.exec($data[ACTION]);

		// Return fast if action parameter was f*cked (no matches)
		if (matches === NULL) {
			return;
		}

		// Extract action name
		var name = matches[1];
		// Extract action namespaces
		var namespaces = matches[2];
		// Extract action args
		var args = matches[3];

		// If there are action namespaces, make sure we're only triggering action on applicable types
		if (namespaces !== UNDEFINED && !RegExp(namespaces.split(RE_DOT).join("|")).test($event.type)) {
			return;
		}

		// Split args by separator (if there were args)
		var argv = args !== UNDEFINED
			? args.split(RE_SEPARATOR)
			: [];

		// Iterate argv to determine arg type
		$.each(argv, function argsIterator(i, value) {
			if (value in $data) {
				argv[i] = $data[value];
			} else if (RE_STRING.test(value)) {
				argv[i] = value.slice(1, -1);
			} else if (RE_DIGIT.test(value)) {
				argv[i] = Number(value);
			} else if (RE_BOOLEAN.test(value)) {
				argv[i] = value === TRUE;
			} else {
				argv[i] = UNDEFINED;
			}
		});

		// Trigger exclusive ACTION event
		$target.trigger($.Event($event, {
			type: ACTION + "!",
			action: name
		}), argv);
	}

	$.event.special[ACTION] = {
		/**
		 * @param data (Anything) Whatever eventData (optional) was passed in
		 *        when binding the event.
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 * @param eventHandle (Function) The actual function that will be bound
		 *        to the browser’s native event (this is used internally for the
		 *        beforeunload event, you’ll never use it).
		 */
		setup : function onActionSetup(data, namespaces, eventHandle) {
			$(this).bind(ACTION, data, onAction);
		},

		/**
		 * Do something each time an event handler is bound to a particular element
		 * @param handleObj (Object)
		 */
		add : function onActionAdd(handleObj) {
			var events = $.map(handleObj.namespace.split(RE_DOT), namespaceIterator);

			if (events.length !== 0) {
				$(this).bind(events.join(" "), handler);
			}
		},

		/**
		 * Do something each time an event handler is unbound from a particular element
		 * @param handleObj (Object)
		 */
		remove : function onActionRemove(handleObj) {
			var events = $.map(handleObj.namespace.split(RE_DOT), namespaceIterator);

			if (events.length !== 0) {
				$(this).unbind(events.join(" "), handler);
			}
		},

		/**
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 */
		teardown : function onActionTeardown(namespaces) {
			$(this).unbind(ACTION, onAction);
		}
	};

	$.fn[ACTION] = function action(name) {
		return $(this).trigger({
			type: ACTION + "!",
			action: name
		}, SLICE.call(arguments, 1));
	};
});

/*!
 * TroopJS jQuery destroy plug-in
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-jquery/destroy',[ "jquery" ], function DestroyModule($) {
	$.event.special["destroy"] = {
		remove : function onDestroyRemove(handleObj) {
			var self = this;

			handleObj.handler.call(self, $.Event({
				"type" : handleObj.type,
				"data" : handleObj.data,
				"namespace" : handleObj.namespace,
				"target" : self
			}));
		}
	};
});

/*!
 * TroopJS jQuery dimensions plug-in
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-jquery/dimensions',[ "jquery" ], function DimensionsModule($) {
	var RE = /(w|h)(\d*)/g;
	var DIMENSIONS = "dimensions";
	var RESIZE = "resize." + DIMENSIONS;
	var W = "w";
	var H = "h";
	var _W = "_" + W;
	var _H = "_" + H;

	/**
	 * Internal comparator used for reverse sorting arrays
	 */
	function reverse(a, b) {
		return a < b ? 1 : a > b ? -1 : 0;
	}

	function onResize($event) {
		var $self = $(this);
		var w = $self.width();
		var h = $self.height();

		$.each($self.data(DIMENSIONS), function dimensionIterator(namespace, dimension) {
			var dimension_w = dimension[W];
			var dimension_w_max = dimension_w.length - 1;
			var dimension_h = dimension[H];
			var dimension_h_max = dimension_h.length - 1;

			var _w = $.grep(dimension_w, function(_w, i) {
				return _w <= w || i === dimension_w_max;
			})[0];
			var _h = $.grep(dimension_h, function(_h, i) {
				return _h <= h || i === dimension_h_max;
			})[0];

			if (_w !== dimension[_W] || _h !== dimension[_H]) {
				dimension[_W] = _w;
				dimension[_H] = _h;

				$self.trigger(DIMENSIONS + "." + namespace, [ _w, _h ]);
			}
		});
	}

	$.event.special[DIMENSIONS] = {
		/**
		 * @param data (Anything) Whatever eventData (optional) was passed in
		 *        when binding the event.
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 * @param eventHandle (Function) The actual function that will be bound
		 *        to the browser’s native event (this is used internally for the
		 *        beforeunload event, you’ll never use it).
		 */
		setup : function onDimensionsSetup(data, namespaces, eventHandle) {
			$(this)
				.bind(RESIZE, onResize)
				.data(DIMENSIONS, {});
		},

		add : function onDimensionsAdd(handleObj) {
			var namespace = handleObj.namespace;
			var dimension = {};
			var w = dimension[W] = [];
			var h = dimension[H] = [];
			var matches;

			while (matches = RE.exec(namespace)) {
				dimension[matches[1]].push(parseInt(matches[2]));
			}

			w.sort(reverse);
			h.sort(reverse);

			$.data(this, DIMENSIONS)[namespace] = dimension;
		},

		remove : function onDimensionsRemove(handleObj) {
			delete $.data(this, DIMENSIONS)[handleObj.namespace];
		},

		/**
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 */
		teardown : function onDimensionsTeardown(namespaces) {
			$(this)
				.removeData(DIMENSIONS)
				.unbind(RESIZE, onResize);
		}
	};
});
/*!
 * TroopJS jQuery hashchange plug-in
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
/**
 * Normalized hashchange event, ripped a _lot_ of code from
 * https://github.com/millermedeiros/Hasher
 */
define('troopjs-jquery/hashchange',[ "jquery" ], function HashchangeModule($) {
	var INTERVAL = "interval";
	var HASHCHANGE = "hashchange";
	var ONHASHCHANGE = "on" + HASHCHANGE;
	var RE_HASH = /#(.*)$/;
	var RE_LOCAL = /\?/;

	// hack based on this: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
	var _isIE = !+"\v1";

	function getHash(window) {
		// parsed full URL instead of getting location.hash because Firefox
		// decode hash value (and all the other browsers don't)
		// also because of IE8 bug with hash query in local file
		var result = RE_HASH.exec(window.location.href);

		return result && result[1]
			? decodeURIComponent(result[1])
			: "";
	}

	function Frame(document) {
		var self = this;
		var element;

		self.element = element = document.createElement("iframe");
		element.src = "about:blank";
		element.style.display = "none";
	}

	Frame.prototype = {
		getElement : function getElement() {
			return this.element;
		},

		getHash : function getHash() {
			return this.element.contentWindow.frameHash;
		},

		update : function update(hash) {
			var self = this;
			var document = self.element.contentWindow.document;

			// Quick return if hash has not changed
			if (self.getHash() === hash) {
				return;
			}

			// update iframe content to force new history record.
			// based on Really Simple History, SWFAddress and YUI.history.
			document.open();
			document.write("<html><head><title>' + document.title + '</title><script type='text/javascript'>var frameHash='" + hash + "';</script></head><body>&nbsp;</body></html>");
			document.close();
		}
	};

	$.event.special[HASHCHANGE] = {
		/**
		 * @param data (Anything) Whatever eventData (optional) was passed in
		 *        when binding the event.
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 * @param eventHandle (Function) The actual function that will be bound
		 *        to the browser’s native event (this is used internally for the
		 *        beforeunload event, you’ll never use it).
		 */
		setup : function hashChangeSetup(data, namespaces, eventHandle) {
			var window = this;

			// Quick return if we support onHashChange natively
			// FF3.6+, IE8+, Chrome 5+, Safari 5+
			if (ONHASHCHANGE in window) {
				return false;
			}

			// Make sure we're always a window
			if (!$.isWindow(window)) {
				throw new Error("Unable to bind 'hashchange' to a non-window object");
			}

			var $window = $(window);
			var hash = getHash(window);
			var location = window.location;

			$window.data(INTERVAL, window.setInterval(_isIE
				? (function hashChangeIntervalWrapper() {
					var document = window.document;
					var _isLocal = location.protocol === "file:";

					var frame = new Frame(document);
					document.body.appendChild(frame.getElement());
					frame.update(hash);

					return function hashChangeInterval() {
						var oldHash = hash;
						var newHash;
						var windowHash = getHash(window);
						var frameHash = frame.getHash();

						// Detect changes made pressing browser history buttons.
						// Workaround since history.back() and history.forward() doesn't
						// update hash value on IE6/7 but updates content of the iframe.
						if (frameHash !== hash && frameHash !== windowHash) {
							// Fix IE8 while offline
							newHash = decodeURIComponent(frameHash);

							if (hash !== newHash) {
								hash = newHash;
								frame.update(hash);
								$window.trigger(HASHCHANGE, [ newHash, oldHash ]);
							}

							// Sync location.hash with frameHash
							location.hash = "#" + encodeURI(_isLocal
								? frameHash.replace(RE_LOCAL, "%3F")
								: frameHash);
						}
						// detect if hash changed (manually or using setHash)
						else if (windowHash !== hash) {
							// Fix IE8 while offline
							newHash = decodeURIComponent(windowHash);

							if (hash !== newHash) {
								hash = newHash;
								$window.trigger(HASHCHANGE, [ newHash, oldHash ]);
							}
						}
					};
				})()
				: function hashChangeInterval() {
					var oldHash = hash;
					var newHash;
					var windowHash = getHash(window);

					if (windowHash !== hash) {
						// Fix IE8 while offline
						newHash = decodeURIComponent(windowHash);

						if (hash !== newHash) {
							hash = newHash;
							$window.trigger(HASHCHANGE, [ newHash, oldHash ]);
						}
					}
				}, 25));
		},

		/**
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 */
		teardown : function hashChangeTeardown(namespaces) {
			var window = this;

			// Quick return if we support onHashChange natively
			if (ONHASHCHANGE in window) {
				return false;
			}

			window.clearInterval($.data(window, INTERVAL));
		}
	};
});

/*!
 * TroopJS jQuery weave plug-in
 * @license TroopJS 0.0.1 Copyright 2012, Mikael Karon <mikael@karon.se>
 * Released under the MIT license.
 */
define('troopjs-jquery/weave',[ "jquery" ], function WeaveModule($) {
	var UNDEFINED = undefined;
	var NULL = null;
	var TRUE = true;
	var ARRAY = Array;
	var ARRAY_PROTO = ARRAY.prototype;
	var JOIN = ARRAY_PROTO.join;
	var WHEN = $.when;
	var WEAVE = "weave";
	var UNWEAVE = "unweave";
	var WOVEN = "woven";
	var DESTROY = "destroy";
	var DATA_WEAVE = "data-" + WEAVE;
	var DATA_WOVEN = "data-" + WOVEN;
	var SELECTOR_WEAVE = "[" + DATA_WEAVE + "]";
	var SELECTOR_WOVEN = "[" + DATA_WOVEN + "]";
	var RE_WEAVE = /[\s,]*([\w_\-\/]+)(?:\(([^\)]+)\))?/g;
	var RE_SEPARATOR = /\s*,\s*/;
	var RE_STRING = /^(["']).*\1$/;
	var RE_DIGIT = /^\d+$/;
	var RE_BOOLEAN = /^false|true$/i;

	/**
	 * Generic destroy handler.
	 * Simply makes sure that unweave has been called
	 * @param $event
	 */
	function onDestroy($event) {
		$(this).unweave();
	}

	$.fn[WEAVE] = function weave(/* arg, arg, arg, */ deferred) {
		var required = [];
		var i = 0;
		var $elements = $(this);

		// Make arguments into a real array
		var argx  = ARRAY.apply(ARRAY_PROTO, arguments);

		// Update deferred to the last argument
		deferred = argx.pop();

		$elements
			// Reduce to only elements that can be woven
			.filter(SELECTOR_WEAVE)
			// Iterate
			.each(function elementIterator(index, element) {
				var $element = $(element);
				var $data = $element.data();
				var weave = $element.attr(DATA_WEAVE) || "";
				var widgets = [];
				var mark = i;
				var j = 0;
				var matches;

				$element
					// Store DATA_WEAVE attribute as WEAVE
					.data(WEAVE, weave)
					// Store widgets array as WOVEN
					.data(WOVEN, widgets)
					// Make sure to remove DATA_WEAVE (so we don't try processing this again)
					.removeAttr(DATA_WEAVE);

				// Iterate widgets (while the rexep matches)
				while ((matches = RE_WEAVE.exec(weave)) !== NULL) {
					// Add deferred to required array
					required[i] = $.Deferred(function deferedRequire(dfd) {
						// Store prefixed values as they will not be available during require
						var _j = j;
						var _matches = matches;

						// Get widget name
						var name = _matches[1];

						// Get widget args
						var args = _matches[2];

						try {
							// Require widget
							require([ name ], function required(Widget) {
								var k;
								var l;
								var kMax;
								var value;
							var widget;

								// Set initial argv
								var argv = [ $element, name ];

								// Copy values from argx to argv
								for (k = 0, kMax = argx.length, l = argv.length; k < kMax; k++, l++) {
									argv[l] = arg[k];
								}

								// Any widget arguments
								if (args !== UNDEFINED) {
									// Convert args to array
									args = args.split(RE_SEPARATOR);

									// Iterate to 'cast' values
									for (k = 0, kMax = args.length, l = argv.length; k < kMax; k++, l++) {
										// Get value
										value = args[k];

										if (value in $data) {
											argv[l] = $data[value];
										} else if (RE_STRING.test(value)) {
											argv[l] = value.slice(1, -1);
										} else if (RE_DIGIT.test(value)) {
											argv[l] = Number(value);
										} else if (RE_BOOLEAN.test(value)) {
											argv[l] = value === TRUE;
										} else {
											argv[l] = value;
										}
									}
								}

								// Simple or complex instantiation
								widget = l === 2
									? Widget($element, name)
									: Widget.apply(Widget, argv);

								// Bind destroy event handler
								$element.bind(DESTROY, onDestroy);

								// Build
								widget.build();

								// Store widgets[_j] and resolve with widget instance
								dfd.resolve(widgets[_j] = widget);
							});
						}
						catch (e) {
							// Reset widgets[_j] and resolve with UNDEFINED
							dfd.resolve(widgets[_j] = UNDEFINED);
						}
					});

					// Step i, j
					i++;
					j++;
				}

				// Slice out widgets woven for this element
				WHEN.apply($, required.slice(mark, i)).done(function doneRequired() {
					// Set 'data-woven' attribute
					$element.attr(DATA_WOVEN, JOIN.call(arguments, " "));
				});
			});

		if (deferred) {
			// When all deferred are resolved, resolve original deferred
			WHEN.apply($, required).then(deferred.resolve, deferred.reject);
		}

		return $elements;
	};

	$.fn[UNWEAVE] = function unweave() {
		return $(this)
			// Reduce to only elements that are woven
			.filter(SELECTOR_WOVEN)
			// Iterate
			.each(function elementIterator(index, element) {
				var $element = $(element);
				var widgets = $element.data(WOVEN);
				var widget;

				$element
					// Remove WOVEN data
					.removeData(WOVEN)
					// Remove DATA_WOVEN attribute
					.removeAttr(DATA_WOVEN);

				// Somewhat safe(r) iterator over widgets
				while (widget = widgets.shift()) {
					// Destroy
					widget.destroy();
				}

				$element
					// Copy woven data to data-weave attribute
					.attr(DATA_WEAVE, $element.data(WEAVE))
					// Remove data fore WEAVE
					.removeData(DATA_WEAVE)
					// Make sure to clean the destroy event handler
					.unbind(DESTROY, onDestroy);
			});
	};
});