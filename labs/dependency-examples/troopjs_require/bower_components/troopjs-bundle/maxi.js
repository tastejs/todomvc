/**
 * troopjs-bundle - 2.0.0-93-g5b9d048
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */



/**
 * TroopJS utils/unique
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-utils/unique',[],function UniqueModule() {
	/*jshint strict:false */

	var LENGTH = "length";

	/**
	 * Reduces array to only contain unique values (evals left-right)
	 * @returns {Number} New length of array
	 */
	return function unique(comparator) {
		var arg;
		var args = this;
		var i;
		var j;
		var k;
		var iMax = args[LENGTH];

		// Did we provide a comparator?
		if (comparator) {
			comparator_outer: for (i = k = 0; i < iMax; i++) {
				arg = args[i];

				for (j = 0; j < i; j++) {
					if (comparator.call(args, arg, [j]) === true) {
						continue comparator_outer;
					}
				}

				args[k++] = arg;
			}
		}
		// Otherwise use strict equality
		else {
			outer: for (i = k = 0; i < iMax; i++) {
				arg = args[i];

				for (j = 0; j < i; j++) {
					if (arg === args[j]) {
						continue outer;
					}
				}

				args[k++] = arg;
			}
		}

		// Assign and return new length
		return args[LENGTH] = k;
	};
});
/**
 * poly common functions
 *
 * (c) copyright 2011-2013 Brian Cavalier and John Hann
 *
 * This module is part of the cujo.js family of libraries (http://cujojs.com/).
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */
define('poly/lib/_base',['require','exports','module'],function (require, exports, module) {

	var toString;

	toString = ({}).toString;

	exports.isFunction = function (o) {
		return typeof o == 'function';
	};

	exports.isString = function (o) {
		return toString.call(o) == '[object String]';
	};

	exports.toString = function (o) {
		return toString.apply(o);
	};

	exports.createCaster = function (caster, name) {
		return function cast (o) {
			if (o == null) throw new TypeError(name + ' method called on null or undefined');
			return caster(o);
		}
	}

});

/**
 * Object polyfill / shims
 *
 * (c) copyright 2011-2013 Brian Cavalier and John Hann
 *
 * This module is part of the cujo.js family of libraries (http://cujojs.com/).
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 */
/**
 * The goal of these shims is to emulate a JavaScript 1.8.5+ environments as
 * much as possible.  While it's not feasible to fully shim Object,
 * we can try to maximize code compatibility with older js engines.
 *
 * Note: these shims cannot fix `for (var p in obj) {}`. Instead, use this:
 *     Object.keys(obj).forEach(function (p) {}); // shimmed Array
 *
 * Also, these shims can't prevent writing to object properties.
 *
 * If you want your code to fail loudly if a shim can't mimic ES5 closely
 * then set the AMD loader config option `failIfShimmed`.  Possible values
 * for `failIfShimmed` include:
 *
 * true: fail on every shimmed Object function
 * false: fail never
 * function: fail for shims whose name returns true from function (name) {}
 *
 * By default, no shims fail.
 *
 * The following functions are safely shimmed:
 * create (unless the second parameter is specified since that calls defineProperties)
 * keys
 * getOwnPropertyNames
 * getPrototypeOf
 * isExtensible
 *
 * In order to play nicely with several third-party libs (including Promises/A
 * implementations), the following functions don't fail by default even though
 * they can't be correctly shimmed:
 * freeze
 * seal
 * isFrozen
 * isSealed
 *
 * The poly/strict module will set failIfShimmed to fail for some shims.
 * See the documentation for more information.
 *
 * IE missing enum properties fixes copied from kangax:
 * https://github.com/kangax/protolicious/blob/master/experimental/object.for_in.js
 *
 * TODO: fix Object#propertyIsEnumerable for IE's non-enumerable props to match Object.keys()
 */
define('poly/object',['./lib/_base'], function (base) {
"use strict";

	var refObj,
		refProto,
		has__proto__,
		hasNonEnumerableProps,
		getPrototypeOf,
		keys,
		featureMap,
		shims,
		secrets,
		protoSecretProp,
		hasOwnProp = 'hasOwnProperty',
		undef;

	refObj = Object;
	refProto = refObj.prototype;

	has__proto__ = typeof {}.__proto__ == 'object';

	hasNonEnumerableProps = (function () {
		for (var p in { valueOf: 1 }) return false;
		return true;
	}());

	// TODO: this still doesn't work for IE6-8 since object.constructor && object.constructor.prototype are clobbered/replaced when using `new` on a constructor that has a prototype. srsly.
	// devs will have to do the following if they want this to work in IE6-8:
	// Ctor.prototype.constructor = Ctor
	getPrototypeOf = has__proto__
		? function (object) { assertIsObject(object); return object.__proto__; }
		: function (object) {
			assertIsObject(object);
			return protoSecretProp && object[protoSecretProp](secrets)
				? object[protoSecretProp](secrets.proto)
				: object.constructor ? object.constructor.prototype : refProto;
		};

	keys = !hasNonEnumerableProps
		? _keys
		: (function (masked) {
			return function (object) {
				var result = _keys(object), i = 0, m;
				while (m = masked[i++]) {
					if (hasProp(object, m)) result.push(m);
				}
				return result;
			}
		}([ 'constructor', hasOwnProp, 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'toLocaleString', 'valueOf' ]));

	featureMap = {
		'object-create': 'create',
		'object-freeze': 'freeze',
		'object-isfrozen': 'isFrozen',
		'object-seal': 'seal',
		'object-issealed': 'isSealed',
		'object-getprototypeof': 'getPrototypeOf',
		'object-keys': 'keys',
		'object-getownpropertynames': 'getOwnPropertyNames',
		'object-defineproperty': function hasDefineProperty(object) {
			try {
				return 'defineProperty' in object && "sentinel" in Object.defineProperty({}, "sentinel", {});
			}
			catch (e) {
			}
		},
		'object-defineproperties': 'defineProperties',
		'object-isextensible': 'isExtensible',
		'object-preventextensions': 'preventExtensions',
		'object-getownpropertydescriptor': function hasGetOwnPropertyDescriptorObject(object) {
			try {
				return 'getOwnPropertyDescriptor' in object && Object.getOwnPropertyDescriptor({"sentinel":0}).value === 0;
			}
			catch (e) {
			}
		}
	};

	shims = {};

	secrets = {
		proto: {}
	};

	protoSecretProp = !has('object-getprototypeof') && !has__proto__ && hasNonEnumerableProps && hasOwnProp;

	function createFlameThrower (feature) {
		return function () {
			throw new Error('poly/object: ' + feature + ' is not safely supported.');
		}
	}

	function has (feature) {
		var prop = featureMap[feature];
		return base.isFunction(prop) ? prop(refObj) : prop in refObj;
	}

	function PolyBase () {}

	// for better compression
	function hasProp (object, name) {
		return object.hasOwnProperty(name);
	}

	function _keys (object) {
		var result = [];
		for (var p in object) {
			if (hasProp(object, p)) {
				result.push(p);
			}
		}
		return result;
	}

	// we might create an owned property to hold the secrets, but make it look
	// like it's not an owned property.  (affects getOwnPropertyNames, too)
	if (protoSecretProp) (function (_hop) {
		refProto[hasOwnProp] = function (name) {
			if (name == protoSecretProp) return false;
			return _hop.call(this, name);
		};
	}(refProto[hasOwnProp]));

	if (!has('object-create')) {
		Object.create = shims.create = function create (proto, props) {
			var obj;

			if (typeof proto != 'object') throw new TypeError('prototype is not of type Object or Null.');

			PolyBase.prototype = proto;
			obj = new PolyBase();
			PolyBase.prototype = null;

			// provide a mechanism for retrieving the prototype in IE 6-8
			if (protoSecretProp) {
				var orig = obj[protoSecretProp];
				obj[protoSecretProp] = function (name) {
					if (name == secrets) return true; // yes, we're using secrets
					if (name == secrets.proto) return proto;
					return orig.call(this, name);
				};
			}

			if (arguments.length > 1) {
				// defineProperties could throw depending on `failIfShimmed`
				Object.defineProperties(obj, props);
			}

			return obj;
		};
	}

	if (!has('object-freeze')) {
		Object.freeze = shims.freeze = function freeze (object) {
			return object;
		};
	}

	if (!has('object-isfrozen')) {
		Object.isFrozen = shims.isFrozen = function isFrozen (object) {
			return false;
		};
	}

	if (!has('object-seal')) {
		Object.seal = shims.seal = function seal (object) {
			return object;
		};
	}

	if (!has('object-issealed')) {
		Object.isSealed = shims.isSealed = function isSealed (object) {
			return false;
		};
	}

	if (!has('object-getprototypeof')) {
		Object.getPrototypeOf = shims.getPrototypeOf = getPrototypeOf;
	}

	if (!has('object-keys')) {
		Object.keys = keys;
	}

	if (!has('object-getownpropertynames')) {
		Object.getOwnPropertyNames = shims.getOwnPropertyNames = function getOwnPropertyNames (object) {
			return keys(object);
		};
	}

	if (!has('object-defineproperty') || !has('object-defineproperties')) {
		Object.defineProperty = shims.defineProperty = function defineProperty (object, name, descriptor) {
			object[name] = descriptor && descriptor.value;
			return object;
		};
	}

	if (!has('object-defineproperties') || !has('object-create')) {
		Object.defineProperties = shims.defineProperties = function defineProperties (object, descriptors) {
			var names, name;
			names = keys(descriptors);
			while ((name = names.pop())) {
				Object.defineProperty(object, name, descriptors[name]);
			}
			return object;
		};
	}

	if (!has('object-isextensible')) {
		Object.isExtensible = shims.isExtensible = function isExtensible (object) {
			var prop = '_poly_';
			try {
				// create unique property name
				while (prop in object) prop += '_';
				// try to set it
				object[prop] = 1;
				return hasProp(object, prop);
			}
			catch (ex) { return false; }
			finally {
				try { delete object[prop]; } catch (ex) { /* squelch */ }
			}
		};
	}

	if (!has('object-preventextensions')) {
		Object.preventExtensions = shims.preventExtensions = function preventExtensions (object) {
			return object;
		};
	}

	if (!has('object-getownpropertydescriptor')) {
		Object.getOwnPropertyDescriptor = shims.getOwnPropertyDescriptor = function getOwnPropertyDescriptor (object, name) {
			return hasProp(object, name)
				? {
					value: object[name],
					enumerable: true,
					configurable: true,
					writable: true
				}
				: undef;
		};
	}

	function failIfShimmed (failTest) {
		var shouldThrow;

		if (typeof failTest == 'function') {
			shouldThrow = failTest;
		}
		else {
			// assume truthy/falsey
			shouldThrow = function () { return failTest; };
		}

		// create throwers for some features
		for (var feature in shims) {
			Object[feature] = shouldThrow(feature)
				? createFlameThrower(feature)
				: shims[feature];
		}
	}

	function assertIsObject (o) { if (typeof o != 'object') throw new TypeError('Object.getPrototypeOf called on non-object'); }

	return {
		failIfShimmed: failIfShimmed
	};

});

/**
 * TroopJS core/component/factory
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:true*/
define('troopjs-core/component/factory',[ "troopjs-utils/unique", "poly/object" ], function ComponentFactoryModule(unique) {
	/*jshint laxbreak:true */

	var PROTOTYPE = "prototype";
	var TOSTRING = "toString";
	var ARRAY_PROTO = Array[PROTOTYPE];
	var ARRAY_PUSH = ARRAY_PROTO.push;
	var ARRAY_UNSHIFT = ARRAY_PROTO.unshift;
	var OBJECT_TOSTRING = Object[PROTOTYPE][TOSTRING];
	var TYPEOF_FUNCTION = "function";
	var DISPLAYNAME = "displayName";
	var LENGTH = "length";
	var EXTEND = "extend";
	var CREATE = "create";
	var DECORATE = "decorate";
	var DECORATED = "decorated";
	var BEFORE = "before";
	var AFTER = "after";
	var AROUND = "around";
	var CONSTRUCTOR = "constructor";
	var CONSTRUCTORS = "constructors";
	var SPECIALS = "specials";
	var GROUP = "group";
	var VALUE = "value";
	var FEATURES = "features";
	var TYPE = "type";
	var NAME = "name";
	var RE_SPECIAL = /^(\w+)(?::([^\/]+))?\/(.+)/;
	var NOOP = function noop () {};
	var factoryDescriptors = {};

	/**
	 * Create a component
	 * @returns {*}
	 */
	function create() {
		return extend.apply(this, arguments)();
	}

	/**
	 * Extends a component
	 * @returns {*} New component
	 */
	function extend() {
		var args = [this];
		ARRAY_PUSH.apply(args, arguments);
		return Factory.apply(null, args);
	}

	/**
	 * Creates new Decorator
	 * @param {Function} decorated Original function
	 * @param {Function} decorate Function to re-write descriptor
	 * @constructor
	 */
	function Decorator(decorated, decorate) {
		var descriptor = {};

		// Add DECORATED to descriptor
		descriptor[DECORATED] = {
			"value" : decorated
		};

		// Add DECORATE to descriptor
		descriptor[DECORATE] = {
			"value" : decorate
		};

		// Define properties
		Object.defineProperties(this, descriptor);
	}

	/**
	 * Before advise
	 * @param {Function} decorated Original function
	 * @returns {ComponentFactoryModule.Decorator}
	 */
	function before(decorated) {
		return new Decorator(decorated, before[DECORATE]);
	}

	/**
	 * Describe before
	 * @param descriptor
	 * @returns {*}
	 */
	before[DECORATE] = function (descriptor) {
		var previous = this[DECORATED];
		var next = descriptor[VALUE];

		descriptor[VALUE] = next
			? function () {
			var self = this;
			var args = arguments;
			return next.apply(self, args = previous.apply(self, args) || args);
		}
			: previous;

		return descriptor;
	};

	/**
	 * After decorator
	 * @param decorated
	 * @returns {ComponentFactoryModule.Decorator}
	 */
	function after(decorated) {
		return new Decorator(decorated, after[DECORATE]);
	}

	/**
	 * Decorate after
	 * @param descriptor
	 * @returns {*}
	 */
	after[DECORATE] = function (descriptor) {
		var previous = descriptor[VALUE];
		var next = this[DECORATED];


		descriptor[VALUE] = previous
			? function () {
			var self = this;
			var args = arguments;
			return next.apply(self, args = previous.apply(self, args) || args);
		}
			: next;

		return descriptor;
	};

	/**
	 * Around decorator
	 * @param decorated
	 * @returns {ComponentFactoryModule.Decorator}
	 */
	function around(decorated) {
		return new Decorator(decorated, around[DECORATE]);
	}

	/**
	 * Decorate around
	 * @param descriptor
	 * @returns {*}
	 */
	around[DECORATE] = function (descriptor) {
		descriptor[VALUE] = this[DECORATED](descriptor[VALUE] || NOOP);

		return descriptor;
	};

	/**
	 * Returns a string representation of this constructor
	 * @returns {String}
	 */
	function ConstructorToString() {
		var self = this;
		var prototype = self[PROTOTYPE];

		return DISPLAYNAME in prototype
			? prototype[DISPLAYNAME]
			: OBJECT_TOSTRING.call(self);
	}

	/**
	 * Creates components
	 * @returns {*} New component
	 * @constructor
	 */
	function Factory () {
		var special;
		var specials = [];
		var specialsLength;
		var arg;
		var args = arguments;
		var argsLength = args[LENGTH];
		var constructors = [];
		var constructorsLength;
		var name;
		var names;
		var namesLength;
		var i;
		var j;
		var group;
		var type;
		var matches;
		var value;
		var descriptor;
		var prototype = {};
		var prototypeDescriptors = {};
		var constructorDescriptors = {};

		// Iterate arguments
		for (i = 0; i < argsLength; i++) {
			// Get arg
			arg = args[i];

			// If this is a function we're going to add it as a constructor candidate
			if(typeof arg === TYPEOF_FUNCTION) {
				// If this is a synthetic constructor then add (child) constructors
				if (CONSTRUCTORS in arg) {
					ARRAY_PUSH.apply(constructors, arg[CONSTRUCTORS]);
				}
				// Otherwise add as usual
				else {
					ARRAY_PUSH.call(constructors, arg);
				}

				// If we have SPECIALS then unshift arg[SPECIALS] onto specials
				if (SPECIALS in arg) {
					ARRAY_UNSHIFT.apply(specials, arg[SPECIALS]);
				}

				// Continue if this is a dead cause
				if (arg === arg[PROTOTYPE][CONSTRUCTOR]) {
					continue;
				}

				// Arg is now arg prototype
				arg = arg[PROTOTYPE];
			}

			// Get arg names
			names = Object.getOwnPropertyNames(arg);

			// Iterate names
			for (j = 0, namesLength = names[LENGTH]; j < namesLength; j++) {
				// Get name
				name = names[j];

				// Check if this matches a SPECIAL signature
				if ((matches = RE_SPECIAL.exec(name))) {
					// Create special
					special = {};

					// Set special properties
					special[GROUP] = group = matches[1];
					special[FEATURES] = matches[2];
					special[TYPE] = type = matches[3];
					special[NAME] = group + "/" + type;
					special[VALUE] = arg[name];

					// Unshift special onto specials
					ARRAY_UNSHIFT.call(specials, special);
				}
				// Otherwise just add to prototypeDescriptors
				else {
					// Get descriptor for arg
					descriptor = Object.getOwnPropertyDescriptor(arg, name);

					// Get value
					value = descriptor[VALUE];

					// If value is instanceof Advice, we should re-describe, otherwise just use the original desciptor
					prototypeDescriptors[name] = value instanceof Decorator
						? value[DECORATE](prototypeDescriptors[name] || {
							"enumerable" : true,
							"configurable" : true,
							"writable" : true
						})
						: descriptor;
				}
			}
		}

		// Define properties on prototype
		Object.defineProperties(prototype, prototypeDescriptors);

		// Reduce constructors to unique values
		constructorsLength = unique.call(constructors);

		// Reduce specials to unique values
		specialsLength = unique.call(specials);

		// Iterate specials
		for (i = 0; i < specialsLength; i++) {
			// Get special
			special = specials[i];

			// Get special properties
			group = special[GROUP];
			type = special[TYPE];
			name = special[NAME];

			// Get or create group object
			group = group in specials
				? specials[group]
				: specials[group] = [];

			// Get or create type object
			type = type in group
				? group[type]
				: group[type] = specials[name] = [];

			// Store special in group/type
			group[group[LENGTH]] = type[type[LENGTH]] = special;
		}

		/**
		 * Component constructor
		 * @returns {Constructor} Constructor
		 * @constructor
		 */
		function Constructor () {
			// Allow to be created either via 'new' or direct invocation
			var instance = this instanceof Constructor
				? this
				: Object.create(prototype);

			var _args = arguments;
			var _i;

			// Set the constructor on instance
			Object.defineProperty(instance, CONSTRUCTOR, {
				"value" : Constructor
			});

			// Iterate constructors
			for (_i = 0; _i < constructorsLength; _i++) {
				// Capture result as _args to pass to next constructor
				_args = constructors[_i].apply(instance, _args) || _args;
			}

			return instance;
		}

		// Add PROTOTYPE to constructorDescriptors
		constructorDescriptors[PROTOTYPE] = {
			"value" : prototype
		};

		// Add CONSTRUCTORS to constructorDescriptors
		constructorDescriptors[CONSTRUCTORS] = {
			"value" : constructors
		};

		// Add SPECIALS to constructorDescriptors
		constructorDescriptors[SPECIALS] = {
			"value" : specials
		};

		constructorDescriptors[TOSTRING] = {
			"value" : ConstructorToString
		};

		// Add EXTEND to constructorDescriptors
		constructorDescriptors[EXTEND] = {
			"value" : extend
		};

		// Add CREATE to constructorDescriptors
		constructorDescriptors[CREATE] = {
			"value" : create
		};

		// Define prototypeDescriptors on Constructor
		Object.defineProperties(Constructor, constructorDescriptors);

		// Return Constructor
		return Constructor;
	}

	// Add CREATE to factoryDescriptors
	factoryDescriptors[CREATE] = {
		"value" : function FactoryCreate() {
			return Factory.apply(null, arguments)();
		}
	};

	// Add BEFORE to factoryDescriptors
	factoryDescriptors[BEFORE] = {
		"value" : before
	};

	// Add AFTER to factoryDescriptors
	factoryDescriptors[AFTER] = {
		"value" : after
	};

	// Add AROUND to factoryDescriptors
	factoryDescriptors[AROUND] = {
		"value" : around
	};

	// Define factoryDescriptors on Factory
	Object.defineProperties(Factory, factoryDescriptors);

	// Return Factory
	return Factory;
});
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * A lightweight CommonJS Promises/A and when() implementation
 * when is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author Brian Cavalier
 * @author John Hann
 * @version 2.1.0
 */
(function(define, global) { 'use strict';
define('when/when',[],function () {

	// Public API

	when.defer     = defer;      // Create a deferred
	when.resolve   = resolve;    // Create a resolved promise
	when.reject    = reject;     // Create a rejected promise

	when.join      = join;       // Join 2 or more promises

	when.all       = all;        // Resolve a list of promises
	when.map       = map;        // Array.map() for promises
	when.reduce    = reduce;     // Array.reduce() for promises
	when.settle    = settle;     // Settle a list of promises

	when.any       = any;        // One-winner race
	when.some      = some;       // Multi-winner race

	when.isPromise = isPromise;  // Determine if a thing is a promise

	when.promise   = promise;    // EXPERIMENTAL: May change. Use at your own risk

	/**
	 * Register an observer for a promise or immediate value.
	 *
	 * @param {*} promiseOrValue
	 * @param {function?} [onFulfilled] callback to be called when promiseOrValue is
	 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
	 *   will be invoked immediately.
	 * @param {function?} [onRejected] callback to be called when promiseOrValue is
	 *   rejected.
	 * @param {function?} [onProgress] callback to be called when progress updates
	 *   are issued for promiseOrValue.
	 * @returns {Promise} a new {@link Promise} that will complete with the return
	 *   value of callback or errback or the completion value of promiseOrValue if
	 *   callback and/or errback is not supplied.
	 */
	function when(promiseOrValue, onFulfilled, onRejected, onProgress) {
		// Get a trusted promise for the input promiseOrValue, and then
		// register promise handlers
		return resolve(promiseOrValue).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Trusted Promise constructor.  A Promise created from this constructor is
	 * a trusted when.js promise.  Any other duck-typed promise is considered
	 * untrusted.
	 * @constructor
	 * @name Promise
	 */
	function Promise(then, inspect) {
		this.then = then;
		this.inspect = inspect;
	}

	Promise.prototype = {
		/**
		 * Register a rejection handler.  Shortcut for .then(undefined, onRejected)
		 * @param {function?} onRejected
		 * @return {Promise}
		 */
		otherwise: function(onRejected) {
			return this.then(undef, onRejected);
		},

		/**
		 * Ensures that onFulfilledOrRejected will be called regardless of whether
		 * this promise is fulfilled or rejected.  onFulfilledOrRejected WILL NOT
		 * receive the promises' value or reason.  Any returned value will be disregarded.
		 * onFulfilledOrRejected may throw or return a rejected promise to signal
		 * an additional error.
		 * @param {function} onFulfilledOrRejected handler to be called regardless of
		 *  fulfillment or rejection
		 * @returns {Promise}
		 */
		ensure: function(onFulfilledOrRejected) {
			return this.then(injectHandler, injectHandler).yield(this);

			function injectHandler() {
				return resolve(onFulfilledOrRejected());
			}
		},

		/**
		 * Shortcut for .then(function() { return value; })
		 * @param  {*} value
		 * @return {Promise} a promise that:
		 *  - is fulfilled if value is not a promise, or
		 *  - if value is a promise, will fulfill with its value, or reject
		 *    with its reason.
		 */
		'yield': function(value) {
			return this.then(function() {
				return value;
			});
		},

		/**
		 * Assumes that this promise will fulfill with an array, and arranges
		 * for the onFulfilled to be called with the array as its argument list
		 * i.e. onFulfilled.apply(undefined, array).
		 * @param {function} onFulfilled function to receive spread arguments
		 * @return {Promise}
		 */
		spread: function(onFulfilled) {
			return this.then(function(array) {
				// array may contain promises, so resolve its contents.
				return all(array, function(array) {
					return onFulfilled.apply(undef, array);
				});
			});
		},

		/**
		 * Shortcut for .then(onFulfilledOrRejected, onFulfilledOrRejected)
		 * @deprecated
		 */
		always: function(onFulfilledOrRejected, onProgress) {
			return this.then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress);
		}
	};

	/**
	 * Returns a resolved promise. The returned promise will be
	 *  - fulfilled with promiseOrValue if it is a value, or
	 *  - if promiseOrValue is a promise
	 *    - fulfilled with promiseOrValue's value after it is fulfilled
	 *    - rejected with promiseOrValue's reason after it is rejected
	 * @param  {*} value
	 * @return {Promise}
	 */
	function resolve(value) {
		return promise(function(resolve) {
			resolve(value);
		});
	}

	/**
	 * Returns a rejected promise for the supplied promiseOrValue.  The returned
	 * promise will be rejected with:
	 * - promiseOrValue, if it is a value, or
	 * - if promiseOrValue is a promise
	 *   - promiseOrValue's value after it is fulfilled
	 *   - promiseOrValue's reason after it is rejected
	 * @param {*} promiseOrValue the rejected value of the returned {@link Promise}
	 * @return {Promise} rejected {@link Promise}
	 */
	function reject(promiseOrValue) {
		return when(promiseOrValue, rejected);
	}

	/**
	 * Creates a new Deferred with fully isolated resolver and promise parts,
	 * either or both of which may be given out safely to consumers.
	 * The resolver has resolve, reject, and progress.  The promise
	 * only has then.
	 *
	 * @return {{
	 * promise: Promise,
	 * resolve: function:Promise,
	 * reject: function:Promise,
	 * notify: function:Promise
	 * resolver: {
	 *	resolve: function:Promise,
	 *	reject: function:Promise,
	 *	notify: function:Promise
	 * }}}
	 */
	function defer() {
		var deferred, pending, resolved;

		// Optimize object shape
		deferred = {
			promise: undef, resolve: undef, reject: undef, notify: undef,
			resolver: { resolve: undef, reject: undef, notify: undef }
		};

		deferred.promise = pending = promise(makeDeferred);

		return deferred;

		function makeDeferred(resolvePending, rejectPending, notifyPending) {
			deferred.resolve = deferred.resolver.resolve = function(value) {
				if(resolved) {
					return resolve(value);
				}
				resolved = true;
				resolvePending(value);
				return pending;
			};

			deferred.reject  = deferred.resolver.reject  = function(reason) {
				if(resolved) {
					return resolve(rejected(reason));
				}
				resolved = true;
				rejectPending(reason);
				return pending;
			};

			deferred.notify  = deferred.resolver.notify  = function(update) {
				notifyPending(update);
				return update;
			};
		}
	}

	/**
	 * Creates a new promise whose fate is determined by resolver.
	 * @private (for now)
	 * @param {function} resolver function(resolve, reject, notify)
	 * @returns {Promise} promise whose fate is determine by resolver
	 */
	function promise(resolver) {
		var value, handlers = [];

		// Call the provider resolver to seal the promise's fate
		try {
			resolver(promiseResolve, promiseReject, promiseNotify);
		} catch(e) {
			promiseReject(e);
		}

		// Return the promise
		return new Promise(then, inspect);

		/**
		 * Register handlers for this promise.
		 * @param [onFulfilled] {Function} fulfillment handler
		 * @param [onRejected] {Function} rejection handler
		 * @param [onProgress] {Function} progress handler
		 * @return {Promise} new Promise
		 */
		function then(onFulfilled, onRejected, onProgress) {
			return promise(function(resolve, reject, notify) {
				handlers
				// Call handlers later, after resolution
				? handlers.push(function(value) {
					value.then(onFulfilled, onRejected, onProgress)
						.then(resolve, reject, notify);
				})
				// Call handlers soon, but not in the current stack
				: enqueue(function() {
					value.then(onFulfilled, onRejected, onProgress)
						.then(resolve, reject, notify);
				});
			});
		}

		function inspect() {
			return value ? value.inspect() : toPendingState();
		}

		/**
		 * Transition from pre-resolution state to post-resolution state, notifying
		 * all listeners of the ultimate fulfillment or rejection
		 * @param {*|Promise} val resolution value
		 */
		function promiseResolve(val) {
			if(!handlers) {
				return;
			}

			value = coerce(val);
			scheduleHandlers(handlers, value);

			handlers = undef;
		}

		/**
		 * Reject this promise with the supplied reason, which will be used verbatim.
		 * @param {*} reason reason for the rejection
		 */
		function promiseReject(reason) {
			promiseResolve(rejected(reason));
		}

		/**
		 * Issue a progress event, notifying all progress listeners
		 * @param {*} update progress event payload to pass to all listeners
		 */
		function promiseNotify(update) {
			if(handlers) {
				scheduleHandlers(handlers, progressing(update));
			}
		}
	}

	/**
	 * Coerces x to a trusted Promise
	 *
	 * @private
	 * @param {*} x thing to coerce
	 * @returns {Promise} Guaranteed to return a trusted Promise.  If x
	 *   is trusted, returns x, otherwise, returns a new, trusted, already-resolved
	 *   Promise whose resolution value is:
	 *   * the resolution value of x if it's a foreign promise, or
	 *   * x if it's a value
	 */
	function coerce(x) {
		if(x instanceof Promise) {
			return x;
		}

		if (!(x === Object(x) && 'then' in x)) {
			return fulfilled(x);
		}

		return promise(function(resolve, reject, notify) {
			enqueue(function() {
				try {
					// We must check and assimilate in the same tick, but not the
					// current tick, careful only to access promiseOrValue.then once.
					var untrustedThen = x.then;

					if(typeof untrustedThen === 'function') {
						fcall(untrustedThen, x, resolve, reject, notify);
					} else {
						// It's a value, create a fulfilled wrapper
						resolve(fulfilled(x));
					}

				} catch(e) {
					// Something went wrong, reject
					reject(e);
				}
			});
		});
	}

	/**
	 * Create an already-fulfilled promise for the supplied value
	 * @private
	 * @param {*} value
	 * @return {Promise} fulfilled promise
	 */
	function fulfilled(value) {
		var self = new Promise(function (onFulfilled) {
			try {
				return typeof onFulfilled == 'function'
					? coerce(onFulfilled(value)) : self;
			} catch (e) {
				return rejected(e);
			}
		}, function() {
			return toFulfilledState(value);
		});

		return self;
	}

	/**
	 * Create an already-rejected promise with the supplied rejection reason.
	 * @private
	 * @param {*} reason
	 * @return {Promise} rejected promise
	 */
	function rejected(reason) {
		var self = new Promise(function (_, onRejected) {
			try {
				return typeof onRejected == 'function'
					? coerce(onRejected(reason)) : self;
			} catch (e) {
				return rejected(e);
			}
		}, function() {
			return toRejectedState(reason);
		});

		return self;
	}

	/**
	 * Create a progress promise with the supplied update.
	 * @private
	 * @param {*} update
	 * @return {Promise} progress promise
	 */
	function progressing(update) {
		var self = new Promise(function (_, __, onProgress) {
			try {
				return typeof onProgress == 'function'
					? progressing(onProgress(update)) : self;
			} catch (e) {
				return progressing(e);
			}
		});

		return self;
	}

	/**
	 * Schedule a task that will process a list of handlers
	 * in the next queue drain run.
	 * @private
	 * @param {Array} handlers queue of handlers to execute
	 * @param {*} value passed as the only arg to each handler
	 */
	function scheduleHandlers(handlers, value) {
		enqueue(function() {
			var handler, i = 0;
			while (handler = handlers[i++]) {
				handler(value);
			}
		});
	}

	/**
	 * Determines if promiseOrValue is a promise or not
	 *
	 * @param {*} promiseOrValue anything
	 * @returns {boolean} true if promiseOrValue is a {@link Promise}
	 */
	function isPromise(promiseOrValue) {
		return promiseOrValue && typeof promiseOrValue.then === 'function';
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * howMany of the supplied promisesOrValues have resolved, or will reject when
	 * it becomes impossible for howMany to resolve, for example, when
	 * (promisesOrValues.length - howMany) + 1 input promises reject.
	 *
	 * @param {Array} promisesOrValues array of anything, may contain a mix
	 *      of promises and values
	 * @param howMany {number} number of promisesOrValues to resolve
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise} promise that will resolve to an array of howMany values that
	 *  resolved first, or will reject with an array of
	 *  (promisesOrValues.length - howMany) + 1 rejection reasons.
	 */
	function some(promisesOrValues, howMany, onFulfilled, onRejected, onProgress) {

		return when(promisesOrValues, function(promisesOrValues) {

			return promise(resolveSome).then(onFulfilled, onRejected, onProgress);

			function resolveSome(resolve, reject, notify) {
				var toResolve, toReject, values, reasons, fulfillOne, rejectOne, len, i;

				len = promisesOrValues.length >>> 0;

				toResolve = Math.max(0, Math.min(howMany, len));
				values = [];

				toReject = (len - toResolve) + 1;
				reasons = [];

				// No items in the input, resolve immediately
				if (!toResolve) {
					resolve(values);

				} else {
					rejectOne = function(reason) {
						reasons.push(reason);
						if(!--toReject) {
							fulfillOne = rejectOne = identity;
							reject(reasons);
						}
					};

					fulfillOne = function(val) {
						// This orders the values based on promise resolution order
						values.push(val);
						if (!--toResolve) {
							fulfillOne = rejectOne = identity;
							resolve(values);
						}
					};

					for(i = 0; i < len; ++i) {
						if(i in promisesOrValues) {
							when(promisesOrValues[i], fulfiller, rejecter, notify);
						}
					}
				}

				function rejecter(reason) {
					rejectOne(reason);
				}

				function fulfiller(val) {
					fulfillOne(val);
				}
			}
		});
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * any one of the supplied promisesOrValues has resolved or will reject when
	 * *all* promisesOrValues have rejected.
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise} promise that will resolve to the value that resolved first, or
	 * will reject with an array of all rejected inputs.
	 */
	function any(promisesOrValues, onFulfilled, onRejected, onProgress) {

		function unwrapSingleResult(val) {
			return onFulfilled ? onFulfilled(val[0]) : val[0];
		}

		return some(promisesOrValues, 1, unwrapSingleResult, onRejected, onProgress);
	}

	/**
	 * Return a promise that will resolve only once all the supplied promisesOrValues
	 * have resolved. The resolution value of the returned promise will be an array
	 * containing the resolution values of each of the promisesOrValues.
	 * @memberOf when
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise}
	 */
	function all(promisesOrValues, onFulfilled, onRejected, onProgress) {
		return _map(promisesOrValues, identity).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Joins multiple promises into a single returned promise.
	 * @return {Promise} a promise that will fulfill when *all* the input promises
	 * have fulfilled, or will reject when *any one* of the input promises rejects.
	 */
	function join(/* ...promises */) {
		return _map(arguments, identity);
	}

	/**
	 * Settles all input promises such that they are guaranteed not to
	 * be pending once the returned promise fulfills. The returned promise
	 * will always fulfill, except in the case where `array` is a promise
	 * that rejects.
	 * @param {Array|Promise} array or promise for array of promises to settle
	 * @returns {Promise} promise that always fulfills with an array of
	 *  outcome snapshots for each input promise.
	 */
	function settle(array) {
		return _map(array, toFulfilledState, toRejectedState);
	}

	/**
	 * Promise-aware array map function, similar to `Array.prototype.map()`,
	 * but input array may contain promises or values.
	 * @param {Array|Promise} array array of anything, may contain promises and values
	 * @param {function} mapFunc map function which may return a promise or value
	 * @returns {Promise} promise that will fulfill with an array of mapped values
	 *  or reject if any input promise rejects.
	 */
	function map(array, mapFunc) {
		return _map(array, mapFunc);
	}

	/**
	 * Internal map that allows a fallback to handle rejections
	 * @param {Array|Promise} array array of anything, may contain promises and values
	 * @param {function} mapFunc map function which may return a promise or value
	 * @param {function?} fallback function to handle rejected promises
	 * @returns {Promise} promise that will fulfill with an array of mapped values
	 *  or reject if any input promise rejects.
	 */
	function _map(array, mapFunc, fallback) {
		return when(array, function(array) {

			return promise(resolveMap);

			function resolveMap(resolve, reject, notify) {
				var results, len, toResolve, resolveOne, i;

				// Since we know the resulting length, we can preallocate the results
				// array to avoid array expansions.
				toResolve = len = array.length >>> 0;
				results = [];

				if(!toResolve) {
					resolve(results);
					return;
				}

				resolveOne = function(item, i) {
					when(item, mapFunc, fallback).then(function(mapped) {
						results[i] = mapped;

						if(!--toResolve) {
							resolve(results);
						}
					}, reject, notify);
				};

				// Since mapFunc may be async, get all invocations of it into flight
				for(i = 0; i < len; i++) {
					if(i in array) {
						resolveOne(array[i], i);
					} else {
						--toResolve;
					}
				}
			}
		});
	}

	/**
	 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
	 * input may contain promises and/or values, and reduceFunc
	 * may return either a value or a promise, *and* initialValue may
	 * be a promise for the starting value.
	 *
	 * @param {Array|Promise} promise array or promise for an array of anything,
	 *      may contain a mix of promises and values.
	 * @param {function} reduceFunc reduce function reduce(currentValue, nextValue, index, total),
	 *      where total is the total number of items being reduced, and will be the same
	 *      in each call to reduceFunc.
	 * @returns {Promise} that will resolve to the final reduced value
	 */
	function reduce(promise, reduceFunc /*, initialValue */) {
		var args = fcall(slice, arguments, 1);

		return when(promise, function(array) {
			var total;

			total = array.length;

			// Wrap the supplied reduceFunc with one that handles promises and then
			// delegates to the supplied.
			args[0] = function (current, val, i) {
				return when(current, function (c) {
					return when(val, function (value) {
						return reduceFunc(c, value, i, total);
					});
				});
			};

			return reduceArray.apply(array, args);
		});
	}

	// Snapshot states

	/**
	 * Creates a fulfilled state snapshot
	 * @private
	 * @param {*} x any value
	 * @returns {{state:'fulfilled',value:*}}
	 */
	function toFulfilledState(x) {
		return { state: 'fulfilled', value: x };
	}

	/**
	 * Creates a rejected state snapshot
	 * @private
	 * @param {*} x any reason
	 * @returns {{state:'rejected',reason:*}}
	 */
	function toRejectedState(x) {
		return { state: 'rejected', reason: x };
	}

	/**
	 * Creates a pending state snapshot
	 * @private
	 * @returns {{state:'pending'}}
	 */
	function toPendingState() {
		return { state: 'pending' };
	}

	//
	// Utilities, etc.
	//

	var reduceArray, slice, fcall, nextTick, handlerQueue,
		setTimeout, funcProto, call, arrayProto, undef;

	//
	// Shared handler queue processing
	//
	// Credit to Twisol (https://github.com/Twisol) for suggesting
	// this type of extensible queue + trampoline approach for
	// next-tick conflation.

	handlerQueue = [];

	/**
	 * Enqueue a task. If the queue is not currently scheduled to be
	 * drained, schedule it.
	 * @param {function} task
	 */
	function enqueue(task) {
		if(handlerQueue.push(task) === 1) {
			scheduleDrainQueue();
		}
	}

	/**
	 * Schedule the queue to be drained after the stack has cleared.
	 */
	function scheduleDrainQueue() {
		nextTick(drainQueue);
	}

	/**
	 * Drain the handler queue entirely, being careful to allow the
	 * queue to be extended while it is being processed, and to continue
	 * processing until it is truly empty.
	 */
	function drainQueue() {
		var task, i = 0;

		while(task = handlerQueue[i++]) {
			task();
		}

		handlerQueue = [];
	}

	//
	// Capture function and array utils
	//
	/*global setImmediate,process,vertx*/

	// capture setTimeout to avoid being caught by fake timers used in time based tests
	setTimeout = global.setTimeout;
	// Prefer setImmediate, cascade to node, vertx and finally setTimeout
	nextTick = typeof setImmediate === 'function' ? setImmediate.bind(global)
		: typeof process === 'object' && process.nextTick ? process.nextTick
		: typeof vertx === 'object' ? vertx.runOnLoop // vert.x
			: function(task) { setTimeout(task, 0); }; // fallback

	// Safe function calls
	funcProto = Function.prototype;
	call = funcProto.call;
	fcall = funcProto.bind
		? call.bind(call)
		: function(f, context) {
			return f.apply(context, slice.call(arguments, 2));
		};

	// Safe array ops
	arrayProto = [];
	slice = arrayProto.slice;

	// ES5 reduce implementation if native not available
	// See: http://es5.github.com/#x15.4.4.21 as there are many
	// specifics and edge cases.  ES5 dictates that reduce.length === 1
	// This implementation deviates from ES5 spec in the following ways:
	// 1. It does not check if reduceFunc is a Callable
	reduceArray = arrayProto.reduce ||
		function(reduceFunc /*, initialValue */) {
			/*jshint maxcomplexity: 7*/
			var arr, args, reduced, len, i;

			i = 0;
			arr = Object(this);
			len = arr.length >>> 0;
			args = arguments;

			// If no initialValue, use first item of array (we know length !== 0 here)
			// and adjust i to start at second item
			if(args.length <= 1) {
				// Skip to the first real element in the array
				for(;;) {
					if(i in arr) {
						reduced = arr[i++];
						break;
					}

					// If we reached the end of the array without finding any real
					// elements, it's a TypeError
					if(++i >= len) {
						throw new TypeError();
					}
				}
			} else {
				// If initialValue provided, use it
				reduced = args[1];
			}

			// Do the actual reduce
			for(;i < len; ++i) {
				if(i in arr) {
					reduced = reduceFunc(reduced, arr[i], i, arr);
				}
			}

			return reduced;
		};

	function identity(x) {
		return x;
	}

	return when;
});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(); },
	this
);

define('when', ['when/when'], function (main) { return main; });

/**
 * TroopJS utils/merge module
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-utils/merge',[ "poly/object" ], function MergeModule() {
	/*jshint strict:false */

	var LENGTH = "length";
	var ARRAY_PROTO = Array.prototype;
	var ARRAY_CONCAT = ARRAY_PROTO.concat;
	var OBJECT_PROTO = Object.prototype;
	var OBJECT_TOSTRING = OBJECT_PROTO.toString;
	var TOSTRING_OBJECT = OBJECT_TOSTRING.call(OBJECT_PROTO);
	var TOSTRING_ARRAY = OBJECT_TOSTRING.call(ARRAY_PROTO);

	return function merge(source) {
		var target = this;
		var key;
		var keys;
		var i;
		var j;
		var iMax;
		var jMax;
		var source_value;
		var target_value;
		var source_tostring;
		var target_tostring;

		// Iterate arguments
		for (i = 0, iMax = arguments[LENGTH]; i < iMax; i++) {
			// Get source
			source = arguments[i];

			// Get source keys
			keys = Object.keys(source);

			// Iterate keys
			for (j = 0, jMax = keys[LENGTH]; j < jMax; j++) {
				key = keys[j];
				source_value = source[key];
				target_value = target[key];

				// No merge - copy source_value
				if (!(key in target)) {
					target[key] = source_value;
					continue;
				}

				// Get 'types'
				source_tostring = OBJECT_TOSTRING.call(source_value);
				target_tostring = OBJECT_TOSTRING.call(target_value);

				// Can we merge objects?
				if (target_tostring === TOSTRING_OBJECT && source_tostring === TOSTRING_OBJECT) {
					merge.call(target_value, source_value);
				}
				// Can we merge arrays?
				else if (target_tostring === TOSTRING_ARRAY && source_tostring === TOSTRING_ARRAY) {
					target[key] = ARRAY_CONCAT.call(target_value, source_value);
				}
				// No merge - override target[key]
				else {
					target[key] = source_value;
				}
			}
		}

		return target;
	};
});
/**
 * TroopJS core/component/base
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-core/component/base',[ "./factory", "when", "troopjs-utils/merge" ], function ComponentModule(Factory, when, merge) {
	/*jshint laxbreak:true */

	var ARRAY_PROTO = Array.prototype;
	var ARRAY_PUSH = ARRAY_PROTO.push;
	var ARRAY_SLICE = ARRAY_PROTO.slice;
	var INSTANCE_COUNT = "instanceCount";
	var CONFIGURATION = "configuration";
	var PHASE = "phase";
	var VALUE = "value";
	var SIG = "sig";
	var COUNT = 0;

	return Factory(
	/**
	 * Creates a new component
	 * @constructor
	 */
	function Component() {
		var self = this;

		// Update instance count
		self[INSTANCE_COUNT] = ++COUNT;
		self[CONFIGURATION] = {};
	}, {
		"instanceCount" : COUNT,

		"displayName" : "core/component/base",

		/**
		 * Configures component
		 * @returns {Object} Updated configuration
		 */
		"configure" : function configure() {
			return merge.apply(this[CONFIGURATION], arguments);
		},

		/**
		 * Signals the component
		 * @param _signal {String} Signal
		 * @return {*}
		 */
		"signal" : function onSignal(_signal) {
			var self = this;
			var args = ARRAY_SLICE.call(arguments, 1);
			var specials = self.constructor.specials;
			var signals = (SIG in specials && specials[SIG][_signal]) || [];
			var signal;
			var index = 0;
			var result = [];
			var resultLength = -2;

			function next(_args) {
				// Add result if resultLength is within bounds
				if (++resultLength > -1) {
					result[resultLength] = _args;
				}

				// Return a chained promise of next callback, or a promise resolved with _signal
				return (signal = signals[index++])
					? when(signal[VALUE].apply(self, args), next)
					: when.resolve(result);
			}

			// Return promise
			return next(args);
		},

		/**
		 * Start the component
		 * @return {*}
		 */
		"start" : function start() {
			var self = this;
			var signal = self.signal;
			var args = [ self[PHASE] = "initialize" ];

			// Add signal to arguments
			ARRAY_PUSH.apply(args, arguments);

			return signal.apply(self, args).then(function initialized(_initialized) {
				// Modify args to change signal (and store in PHASE)
				args[0] = self[PHASE] = "start";

				return signal.apply(self, args).then(function started(_started) {
					// Update phase
					self[PHASE] = "started";

					// Return concatenated result
					return ARRAY_PROTO.concat(_initialized, _started);
				});
			});
		},

		/**
		 * Stops the component
		 * @return {*}
		 */
		"stop" : function stop() {
			var self = this;
			var signal = self.signal;
			var args = [ self[PHASE] = "stop" ];

			// Add signal to arguments
			ARRAY_PUSH.apply(args, arguments);

			return signal.apply(self, args).then(function stopped(_stopped) {
				// Modify args to change signal (and store in PHASE)
				args[0] = self[PHASE] = "finalize";

				return signal.apply(self, args).then(function finalized(_finalized) {
					// Update phase
					self[PHASE] = "finalized";

					// Return concatenated result
					return ARRAY_PROTO.concat(_stopped, _finalized);
				});
			});
		},

		/**
		 * Generates string representation of this object
		 * @returns {string} displayName and instanceCount
		 */
		"toString" : function _toString() {
			var self = this;

			return self.displayName + "@" + self[INSTANCE_COUNT];
		}
	});
});

/**
 * TroopJS core/logger/console
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-core/logger/console',[ "../component/base" ], function ConsoleLogger(Component) {
	var CONSOLE = console;

	function noop() {}

	return Component.create({
			"displayName" : "core/logger/console"
		},
		CONSOLE
			? {
			"log" : CONSOLE.log.bind(CONSOLE),
			"warn" : CONSOLE.warn.bind(CONSOLE),
			"debug" : CONSOLE.debug.bind(CONSOLE),
			"info" : CONSOLE.info.bind(CONSOLE),
			"error" : CONSOLE.error.bind(CONSOLE)
		}
			: {
			"log" : noop,
			"warn" : noop,
			"debug" : noop,
			"info" : noop,
			"error" : noop
		});
});
/*
	Array -- a stand-alone module for using Javascript 1.6 array features
	in lame-o browsers that don't support Javascript 1.6

	(c) copyright 2011-2013 Brian Cavalier and John Hann

	This module is part of the cujo.js family of libraries (http://cujojs.com/).

	Licensed under the MIT License at:
		http://www.opensource.org/licenses/mit-license.php
*/
/*
	This module is under 1kB when compiled/gzipped and is compatible with
	has() pre-processors (<400 bytes when compiled for modern browsers).

	wrapper API:

	This module will wrap native methods to normalize array calls to
	be unified across js engines that support the array methods
	natively with those that don't:

	define(['poly/lib/shim/array'], function (array) {
		var items = [1, 2, 3];
		array.forEach(items, function (item) {
			console.log(item);
		};
	});

	forEach(array, lambda [, context]);
	every(array, lambda [, context]);
	some(array, lambda [, context]);
	filter(array, lambda [, context]);
	map(array, lambda [, context]);
	indexOf(arr, item [, fromIndex]);
	lastIndexOf(arr, item [, fromIndex]);
	reduce(arr, reduceFunc [, initialValue]);
	reduceRight(arr, reduceFunc [, initialValue]);
	isArray(object)

	polyfill API:

	You may also use this module to augment the Array.prototype of
	older js engines by loading it via the poly! plugin prefix:

	define(['poly!poly/lib/shim/array'], function () {
		var items = [1, 2, 3];
		items.forEach(function (item) {
			console.log(item);
		};
	});

	All of the wrapper API methods are shimmed and are reasonably close to
	the ES5 specification, but may vary slightly in unforeseen edge cases:

	var array = [1, 2, 3];

	array.forEach(lambda [, context]);
	array.every(lambda [, context]);
	array.some(lambda [, context]);
	array.filter(lambda [, context]);
	array.map(lambda [, context]);
	array.indexOf(item [, fromIndex]);
	array.lastIndexOf(item [, fromIndex]);
	array.reduce(reduceFunc [, initialValue]);
	array.reduceRight(reduceFunc [, initialValue]);
	Array.isArray(object)

 */

define('poly/array',['./lib/_base'], function (base) {
"use strict";

	var proto = Array.prototype,
		toString = {}.toString,
		featureMap,
		toObject,
		_reduce,
		_find,
		undef;

	featureMap = {
		'array-foreach': 'forEach',
		'array-every': 'every',
		'array-some': 'some',
		'array-map': 'map',
		'array-filter': 'filter',
		'array-reduce': 'reduce',
		'array-reduceright': 'reduceRight',
		'array-indexof': 'indexOf',
		'array-lastindexof': 'lastIndexOf'
	};

	toObject = base.createCaster(Object, 'Array');

	function toArrayLike (o) {
		return (base.toString(o) == '[object String]')
			? o.split('')
			: toObject(o);
	}

	function isArray (o) {
		return toString.call(o) == '[object Array]';
	}

	function has (feature) {
		var prop = featureMap[feature];
		return base.isFunction(proto[prop]);
	}

	function returnTruthy () {
		return 1;
	}

	function returnValue (val) {
		return val;
	}

	/***** iterators *****/

	function _iterate (arr, lambda, continueFunc, context, start, inc) {

		var alo, len, i, end;

		alo = toArrayLike(arr);
		len = alo.length >>> 0;

		if (start === undef) start = 0;
		if (!inc) inc = 1;
		end = inc < 0 ? -1 : len;

		if (!base.isFunction(lambda)) {
			throw new TypeError(lambda + ' is not a function');
		}
		if (start == end) {
			return false;
		}
		if ((start <= end) ^ (inc > 0)) {
			throw new TypeError('Invalid length or starting index');
		}

		for (i = start; i != end; i = i + inc) {
			if (i in alo) {
				if (!continueFunc(lambda.call(context, alo[i], i, alo), i, alo[i])) {
					return false;
				}
			}
		}

		return true;
	}

	if (!has('array-foreach')) {
		proto.forEach = function forEach (lambda) {
			// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
			_iterate(this, lambda, returnTruthy, arguments[+1]);
		};
	}

	if (!has('array-every')) {
		proto.every = function every (lambda) {
			// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
			return _iterate(this, lambda, returnValue, arguments[+1]);
		};
	}

	if (!has('array-some')) {
		proto.some = function some (lambda) {
			// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
			return _iterate(this, lambda, function (val) { return !val; }, arguments[+1]);
		};
	}

	/***** mutators *****/

	if(!has('array-map')) {
		proto.map = function map (lambda) {
			var arr, result;

			arr = this;
			result = new Array(arr.length);

			// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
			_iterate(arr, lambda, function (val, i) { result[i] = val; return 1; }, arguments[+1]);

			return result;
		};
	}

	if (!has('array-filter')) {
		proto.filter = function filter (lambda) {
			var arr, result;

			arr = this;
			result = [];

			_iterate(arr, lambda, function (val, i, orig) {
				// use a copy of the original value in case
				// the lambda function changed it
				if (val) {
					result.push(orig);
				}
				return 1;
			}, arguments[1]);

			return result;
		};
	}

	/***** reducers *****/

	if (!has('array-reduce') || !has('array-reduceright')) {

		_reduce = function _reduce (reduceFunc, inc, initialValue, hasInitialValue) {
			var reduced, startPos, initialValuePos;

			startPos = initialValuePos = inc > 0 ? -1 : toArrayLike(this).length >>> 0;

			// If no initialValue, use first item of array (we know length !== 0 here)
			// and adjust i to start at second item
			if (!hasInitialValue) {
				_iterate(this, returnValue, function (val, i) {
					reduced = val;
					initialValuePos = i;
				}, null, startPos + inc, inc);
				if (initialValuePos == startPos) {
					// no intial value and no items in array!
					throw new TypeError();
				}
			}
			else {
				// If initialValue provided, use it
				reduced = initialValue;
			}

			// Do the actual reduce
			_iterate(this, function (item, i, arr) {
				reduced = reduceFunc(reduced, item, i, arr);
			}, returnTruthy, null, initialValuePos + inc, inc);

			// we have a reduced value!
			return reduced;
		};

		if (!has('array-reduce')) {
			proto.reduce = function reduce (reduceFunc /*, initialValue */) {
				return _reduce.call(this, reduceFunc, 1, arguments[+1], arguments.length > 1);
			};
		}

		if (!has('array-reduceright')) {
			proto.reduceRight = function reduceRight (reduceFunc /*, initialValue */) {
				return _reduce.call(this, reduceFunc, -1, arguments[+1], arguments.length > 1);
			};
		}
	}

	/***** finders *****/

	if (!has('array-indexof') || !has('array-lastindexof')) {

		_find = function _find (arr, item, from, forward) {
			var len = toArrayLike(arr).length >>> 0, foundAt = -1;

			// convert to number, or default to start or end positions
			from = isNaN(from) ? (forward ? 0 : len - 1) : Number(from);
			// negative means it's an offset from the end position
			if (from < 0) {
				from = len + from - 1;
			}

			_iterate(arr, returnValue, function (val, i) {
				if (val === item) {
					foundAt = i;
				}
				return foundAt == -1;
			}, null, from, forward ? 1 : -1);

			return foundAt;
		};

		if (!has('array-indexof')) {
			proto.indexOf = function indexOf (item) {
				// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
				return _find(this, item, arguments[+1], true);
			};
		}

		if (!has('array-lastindexof')) {
			proto.lastIndexOf = function lastIndexOf (item) {
				// arguments[+1] is to fool google closure compiler into NOT adding a function argument!
				return _find(this, item, arguments[+1], false);
			};
		}
	}

	if (!Array.isArray) {
		Array.isArray = isArray;
	}

});

/**
 * TroopJS core/event/emitter
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-core/event/emitter',[ "../component/base", "when", "poly/array" ], function EventEmitterModule(Component, when) {
	/*jshint laxbreak:true */

	var UNDEFINED;
	var NULL = null;
	var MEMORY = "memory";
	var CONTEXT = "context";
	var CALLBACK = "callback";
	var LENGTH = "length";
	var HEAD = "head";
	var TAIL = "tail";
	var NEXT = "next";
	var HANDLED = "handled";
	var HANDLERS = "handlers";
	var PHASE = "phase";
	var RE_HINT = /^(\w+)(?::(pipeline|sequence))/;
	var RE_PHASE = /^(?:initi|fin)alized?$/;
	var ARRAY_SLICE = Array.prototype.slice;
	var ARRAY_ISARRAY = Array.isArray;
	var OBJECT_TOSTRING = Object.prototype.toString;
	var TOSTRING_FUNCTION = OBJECT_TOSTRING.call(Function.prototype);

	/**
	 * Constructs a function that executes handlers in sequence without overlap
	 * @private
	 * @param {Array} handlers Array of handlers
	 * @param {Number} handled Handled counter
	 * @param {Array} [result=[]] Result array
	 * @returns {Function}
	 */
	function sequence(handlers, handled, result) {
		// Default value for result
		result = result || [];

		var handlersCount = 0;
		var resultLength = result[LENGTH];
		var resultCount = resultLength - 1;

		/**
		 * Internal function for sequential execution of handlers handlers
		 * @private
		 * @param {Array} [args] result from previous handler callback
		 * @return {Promise} promise of next handler callback execution
		 */
		var next = function (args) {
			var context;
			var handler;

			// Check that args is an array
			if (!ARRAY_ISARRAY(args)) {
				throw new Error("Result from handler has to be of type array");
			}

			// Store result
			if (resultCount++ >= resultLength) {
				result[resultCount] = args;
			}

			// Iterate until we find a handler in a blocked phase
			while ((handler = handlers[handlersCount++])	// Has next handler
				&& (context = handler[CONTEXT])				// Has context
				&& RE_PHASE.test(context[PHASE]));			// In blocked phase

			// Return promise of next callback, or a promise resolved with result
			return handler
				? (handler[HANDLED] = handled) === handled && when(handler[CALLBACK].apply(context, args), next)
				: when.resolve(result);
		};

		return next;
	}

	/**
	 * Constructs a function that executes handlers in a pipeline without overlap
	 * @private
	 * @param {Array} handlers Array of handlers
	 * @param {Number} handled Handled counter
	 * @param {Object} [anchor={}] Object for saving MEMORY on
	 * @returns {Function}
	 */
	function pipeline(handlers, handled, anchor) {
		// Default value for anchor
		anchor = anchor || {};

		var handlersCount = 0;
		var result;

		/**
		 * Internal function for piped execution of handlers handlers
		 * @private
		 * @param {Array} [args] result from previous handler callback
		 * @return {Promise} promise of next handler callback execution
		 */
		var next = function (args) {
			var context;
			var handler;

			// Check that we have args
			if (args !== UNDEFINED) {

				if (!ARRAY_ISARRAY(args)) {
					throw new Error("Result from handler has to be of type array");
				}

				// Update memory and result
				anchor[MEMORY] = result = args;
			}

			// Iterate until we find a handler in a blocked phase
			while ((handler = handlers[handlersCount++])	// Has next handler
				&& (context = handler[CONTEXT])				// Has context
				&& RE_PHASE.test(context[PHASE]));			// In blocked phase

			// Return promise of next callback,or promise resolved with result
			return handler
				? (handler[HANDLED] = handled) === handled && when(handler[CALLBACK].apply(context, result), next)
				: when.resolve(result);
		};

		return next;
	}

	return Component.extend(
	/**
	 * Creates a new EventEmitter
	 * @constructor
	 */
	function EventEmitter() {
		this[HANDLERS] = {};
	}, {
		"displayName" : "core/event/emitter",

		/**
		 * Adds a listener for the specified event.
		 * @param {String} event to subscribe to
		 * @param {Object} context to scope callbacks to
		 * @param {...Function} callback for this event
		 * @returns {Object} instance of this
		 */
		"on" : function on(event, context, callback) {
			var self = this;
			var args = arguments;
			var handlers = self[HANDLERS];
			var handler;
			var head;
			var tail;
			var offset = 2;

			// Get callback from next arg
			if ((callback = args[offset++]) === UNDEFINED) {
				throw new Error("no callback provided");
			}

			// Test if callback is a function
			if (OBJECT_TOSTRING.call(callback) !== TOSTRING_FUNCTION) {
				throw new Error(OBJECT_TOSTRING.call(callback) + " is not a function");
			}

			// Have handlers
			if (event in handlers) {
				// Get handlers
				handlers = handlers[event];

				// Create new handler
				handler = {};

				// Set handler callback
				handler[CALLBACK] = callback;

				// Set handler context
				handler[CONTEXT] = context;

				// Get tail handler
				tail = TAIL in handlers
					// Have tail, update handlers[TAIL][NEXT] to point to handler
					? handlers[TAIL][NEXT] = handler
					// Have no tail, update handlers[HEAD] to point to handler
					: handlers[HEAD] = handler;

				// Iterate callbacks
				while ((callback = args[offset++]) !== UNDEFINED) {
					// Test if callback is a function
					if (OBJECT_TOSTRING.call(callback) !== TOSTRING_FUNCTION) {
						throw new Error(OBJECT_TOSTRING.call(callback) + " is not a function");
					}

					// Set tail -> tail[NEXT] -> handler
					tail = tail[NEXT] = handler = {};

					// Set handler callback
					handler[CALLBACK] = callback;

					// Set handler context
					handler[CONTEXT] = context;
				}

				// Set tail handler
				handlers[TAIL] = tail;
			}
			// No handlers
			else {
				// Create head and tail
				head = tail = handler = {};

				// Set handler callback
				handler[CALLBACK] = callback;

				// Set handler context
				handler[CONTEXT] = context;

				// Iterate callbacks
				while ((callback = args[offset++]) !== UNDEFINED) {
					// Test if callback is a function
					if (OBJECT_TOSTRING.call(callback) !== TOSTRING_FUNCTION) {
						throw new Error(OBJECT_TOSTRING.call(callback) + " is not a function");
					}

					// Set tail -> tail[NEXT] -> handler
					tail = tail[NEXT] = handler = {};

					// Set handler callback
					handler[CALLBACK] = callback;

					// Set handler context
					handler[CONTEXT] = context;
				}

				// Create event handlers
				handlers = handlers[event] = {};

				// Initialize event handlers
				handlers[HEAD] = head;
				handlers[TAIL] = tail;
				handlers[HANDLED] = 0;
			}

			return self;
		},

		/**
		 * Remove a listener for the specified event.
		 * @param {String} event to remove callback from
		 * @param {Object} [context] to scope callback to
		 * @param {...Function} [callback] to remove
		 * @returns {Object} instance of this
		 */
		"off" : function off(event, context, callback) {
			var self = this;
			var args = arguments;
			var argsLength = args[LENGTH];
			var handlers = self[HANDLERS];
			var handler;
			var head;
			var tail;
			var offset;
			var found;

			// Return fast if we don't have subscribers
			if (!(event in handlers)) {
				return self;
			}

			// Get handlers
			handlers = handlers[event];

			// Return fast if there's no HEAD
			if (!(HEAD in handlers)) {
				return self;
			}

			// Get first handler
			handler = handlers[HEAD];

			// Iterate handlers
			do {
				// Should we remove?
				remove : {
					// If no context or context does not match we should break
					if (context && handler[CONTEXT] && handler[CONTEXT] !== context) {
						break remove;
					}

					// Reset offset, then loop callbacks
					for (found = false, offset = 2; offset < argsLength; offset++) {
						// If handler CALLBACK matches update found and break
						if (handler[CALLBACK] === args[offset]) {
							found = true;
							break;
						}
					}

					// If nothing is found break
					if (!found) {
						break remove;
					}

					// Remove this handler, just continue
					continue;
				}

				// It there's no head - link head -> tail -> handler
				if (!head) {
					head = tail = handler;
				}
				// Otherwise just link tail -> tail[NEXT] -> handler
				else {
					tail = tail[NEXT] = handler;
				}
			}
			// While there's a next handler
			while ((handler = handler[NEXT]));

			// If we have both head and tail we should update handlers
			if (head && tail) {
				// Set handlers HEAD and TAIL
				handlers[HEAD] = head;
				handlers[TAIL] = tail;

				// Make sure to remove NEXT from tail
				delete tail[NEXT];
			}
			// Otherwise we remove the handlers list
			else {
				delete handlers[HEAD];
				delete handlers[TAIL];
			}

			return self;
		},

		/**
		 * Execute each of the listeners in order with the supplied arguments
		 * @param {String} event to emit
		 * @returns {Promise} promise that resolves with results from all listeners
		 */
		"emit" : function emit(event) {
			var self = this;
			var args = ARRAY_SLICE.call(arguments, 1);
			var handlers = self[HANDLERS];
			var handler;
			var candidates;
			var candidatesCount;
			var matches;
			var method;

			// See if we should override event and method
			if ((matches = RE_HINT.exec(event)) !== NULL) {
				event = matches[1];
				method = matches[2];
			}

			// Have event in handlers
			if (event in handlers) {
				// Get handlers
				handlers = handlers[event];

				// Have head in handlers
				if (HEAD in handlers) {
					// Create candidates array and count
					candidates = [];
					candidatesCount = 0;

					// Get first handler
					handler = handlers[HEAD];

					// Step handlers
					do {
						// Push handler on candidates
						candidates[candidatesCount++] = handler;
					}
					// While there is a next handler
					while ((handler = handler[NEXT]));

					// Return promise
					return (method === "sequence")
						? sequence(candidates, ++handlers[HANDLED])(args)
						: pipeline(candidates, ++handlers[HANDLED], handlers)(args);
				}
			}
			// No event in handlers
			else {
				// Create handlers and store with event
				handlers[event] = handlers = {};

				// Set handled
				handlers[HANDLED] = 0;
			}

			// Remember arg
			handlers[MEMORY] = args;

			// Return promise resolved with arg
			return when.resolve(args);
		},

		/**
		 * Reemit event from memory
		 * @param {String} event to reemit
		 * @param {Boolean} senile flag to indicate if already trigger callbacks should still be called
		 * @param {Object} [context] to scope callback to
		 * @param {...Function} [callback] to reemit
		 * @returns {Object} instance of this
		 */
		"reemit" : function reemit(event, senile, context, callback) {
			var self = this;
			var args = arguments;
			var argsLength = args[LENGTH];
			var handlers = self[HANDLERS];
			var handler;
			var handled;
			var candidates;
			var candidatesCount;
			var matches;
			var method;
			var offset;
			var found;

			// See if we should override event and method
			if ((matches = RE_HINT.exec(event)) !== NULL) {
				event = matches[1];
				method = matches[2];
			}

			// Have event in handlers
			if (event in handlers) {
				// Get handlers
				handlers = handlers[event];

				// Have memory in handlers
				if (MEMORY in handlers) {
					// If we have no HEAD we can return a promise resolved with memory
					if (!(HEAD in handlers)) {
						return when.resolve(handlers[MEMORY]);
					}

					// Create candidates array and count
					candidates = [];
					candidatesCount = 0;

					// Get first handler
					handler = handlers[HEAD];

					// Get handled
					handled = handlers[HANDLED];

					// Iterate handlers
					do {
						add : {
							// If no context or context does not match we should break
							if (context && handler[CONTEXT] && handler[CONTEXT] !== context) {
								break add;
							}

							// Reset found and offset, iterate args
							for (found = false, offset = 3; offset < argsLength; offset++) {
								// If callback matches set found and break
								if (handler[CALLBACK] === args[offset]) {
									found = true;
									break;
								}
							}

							// If we found a callback and are already handled and not senile break add
							if (found && handler[HANDLED] === handled && !senile) {
								break add;
							}

							// Push handler on candidates
							candidates[candidatesCount++] = handler;
						}
					}
					// While there's a next handler
					while ((handler = handler[NEXT]));

					// Return promise
					return (method === "sequence")
						? sequence(candidates, handled)(handlers[MEMORY])
						: pipeline(candidates, handled)(handlers[MEMORY]);
				}
			}

			// Return resolved promise
			return when.resolve();
		}
	});
});

/**
 * TroopJS core/pubsub/hub
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-core/pubsub/hub',[ "../event/emitter" ], function HubModule(Emitter) {
	/*jshint strict:false */

	var COMPONENT_PROTOTYPE = Emitter.prototype;

	return Emitter.create({
		"displayName": "core/pubsub/hub",
		"subscribe" : COMPONENT_PROTOTYPE.on,
		"unsubscribe" : COMPONENT_PROTOTYPE.off,
		"publish" : COMPONENT_PROTOTYPE.emit,
		"republish" : COMPONENT_PROTOTYPE.reemit
	});
});

/**
 * TroopJS core/logger/pubsub
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-core/logger/pubsub',[ "../component/base", "../pubsub/hub" ], function PubSubLogger(Component, hub) {
	var ARRAY_PUSH = Array.prototype.push;
	var PUBLISH = hub.publish;

	return Component.create({
		"displayName" : "core/logger/pubsub",

		"log": function log() {
			var args = [ "logger/log" ];
			ARRAY_PUSH.apply(args, arguments);
			PUBLISH.apply(hub, args);
		},

		"warn" : function warn() {
			var args = [ "logger/warn" ];
			ARRAY_PUSH.apply(args, arguments);
			PUBLISH.apply(hub, args);
		},

		"debug" : function debug() {
			var args = [ "logger/debug" ];
			ARRAY_PUSH.apply(args, arguments);
			PUBLISH.apply(hub, args);
		},

		"info" : function info() {
			var args = [ "logger/info" ];
			ARRAY_PUSH.apply(args, arguments);
			PUBLISH.apply(hub, args);
		},

		"error" : function info() {
			var args = [ "logger/error" ];
			ARRAY_PUSH.apply(args, arguments);
			PUBLISH.apply(hub, args);
		}
	});
});
/**
 * TroopJS core/component/gadget
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-core/component/gadget',[ "../event/emitter", "when", "../pubsub/hub" ], function GadgetModule(Emitter, when, hub) {
	/*jshint laxbreak:true */

	var ARRAY_PROTO = Array.prototype;
	var ARRAY_SLICE = ARRAY_PROTO.slice;
	var ARRAY_PUSH = ARRAY_PROTO.push;
	var PUBLISH = hub.publish;
	var REPUBLISH = hub.republish;
	var SUBSCRIBE = hub.subscribe;
	var UNSUBSCRIBE = hub.unsubscribe;
	var LENGTH = "length";
	var FEATURES = "features";
	var TYPE = "type";
	var VALUE = "value";
	var SUBSCRIPTIONS = "subscriptions";
	var EMITTER_PROTO = Emitter.prototype;
	var ON = EMITTER_PROTO.on;
	var OFF = EMITTER_PROTO.off;
	var REEMITT = EMITTER_PROTO.reemit;

	return Emitter.extend(function Gadget() {
		this[SUBSCRIPTIONS] = [];
	}, {
		"displayName" : "core/component/gadget",

		/**
		 * Signal handler for 'initialize'
		 */
		"sig/initialize" : function initialize() {
			var self = this;
			var subscription;
			var subscriptions = self[SUBSCRIPTIONS];
			var special;
			var specials = self.constructor.specials.hub;
			var i;
			var iMax;
			var type;
			var value;

			// Iterate specials
			for (i = 0, iMax = specials ? specials[LENGTH] : 0; i < iMax; i++) {
				// Get special
				special = specials[i];

				// Create subscription
				subscription = subscriptions[i] = {};

				// Set subscription properties
				subscription[TYPE] = type = special[TYPE];
				subscription[FEATURES] = special[FEATURES];
				subscription[VALUE] = value = special[VALUE];

				// Subscribe
				SUBSCRIBE.call(hub, type, self, value);
			}
		},

		/**
		 * Signal handler for 'start'
		 */
		"sig/start" : function start() {
			var self = this;
			var args = arguments;
			var subscription;
			var subscriptions = self[SUBSCRIPTIONS];
			var results = [];
			var resultsLength = 0;
			var i;
			var iMax;

			// Iterate subscriptions
			for (i = 0, iMax = subscriptions[LENGTH]; i < iMax; i++) {
				// Get subscription
				subscription = subscriptions[i];

				// If this is not a "memory" subscription - continue
				if (subscription[FEATURES] !== "memory") {
					continue;
				}

				// Republish, store result
				results[resultsLength++] = REPUBLISH.call(hub, subscription[TYPE], false, self, subscription[VALUE]);
			}

			// Return promise that will be fulfilled when all results are
			return when.all(results, function () {
				// Return original arguments
				return args;
			});
		},

		/**
		 * Signal handler for 'finalize'
		 */
		"sig/finalize" : function finalize() {
			var self = this;
			var subscription;
			var subscriptions = self[SUBSCRIPTIONS];
			var i;
			var iMax;

			// Iterate subscriptions
			for (i = 0, iMax = subscriptions[LENGTH]; i < iMax; i++) {
				// Get subscription
				subscription = subscriptions[i];

				// Unsubscribe
				UNSUBSCRIBE.call(hub, subscription[TYPE], self, subscription[VALUE]);
			}
		},

		/**
		 * Reemits event with forced context to this
		 * @param {String} event to publish
		 * @param {Boolean} senile flag
		 * @param {...Function} callback to limit reemit to
		 * @returns {Promise}
		 */
		"reemit" : function reemit(event, senile, callback) {
			var self = this;
			var args = [ event, senile, self ];

			// Add args
			ARRAY_PUSH.apply(args, ARRAY_SLICE.call(arguments, 2));

			// Forward
			return REEMITT.apply(self, args);
		},

		/**
		 * Adds callback to event with forced context to this
		 * @param {String} event to publish
		 * @param {...Function} callback to add
		 * @returns {Object} instance of this
		 */
		"on": function on(event, callback) {
			var self = this;
			var args = [ event, self ];

			// Add args
			ARRAY_PUSH.apply(args, ARRAY_SLICE.call(arguments, 1));

			// Forward
			return ON.apply(self, args);
		},

		/**
		 * Removes callback from event with forced context to this
		 * @param {String} event to remove callback from
		 * @param {...Function} callback to remove
		 * @returns {Object} instance of this
		 */
		"off" : function off(event, callback) {
			var self = this;
			var args = [ event, self ];

			// Add args
			ARRAY_PUSH.apply(args, ARRAY_SLICE.call(arguments, 1));

			// Forward
			return OFF.apply(self, args);
		},

		/**
		 * Calls hub.publish
		 * @arg {String} event to publish
		 * @arg {...*} arg to pass to subscribed callbacks
		 * @returns {Promise}
		 */
		"publish" : function publish(event, arg) {
			return PUBLISH.apply(hub, arguments);
		},

		/**
		 * Calls hub.republish
		 * @param {String} event to publish
		 * @param {Boolean} senile flag
		 * @param {...Function} callback to limit republish to
		 * @returns {Promise}
		 */
		"republish" : function republish(event, senile, callback) {
			var self = this;
			var args = [ event, senile, self ];

			// Add args
			ARRAY_PUSH.apply(args, ARRAY_SLICE.call(arguments, 2));

			// Republish
			return REPUBLISH.apply(hub, args);
		},

		/**
		 * Calls hub.subscribe
		 * @param {String} event to subscribe to
		 * @param {...Function} callback to subscribe
		 * @returns {Object} instance of this
		 */
		"subscribe" : function subscribe(event, callback) {
			var self = this;
			var args = [ event, self ];

			// Add args
			ARRAY_PUSH.apply(args, ARRAY_SLICE.call(arguments, 1));

			// Subscribe
			SUBSCRIBE.apply(hub, args);

			return self;
		},

		/**
		 * Calls hub.unsubscribe
		 * @param {String} event to unsubscribe from
		 * @param {...Function} callback to unsubscribe
		 * @returns {Object} instance of this
		 */
		"unsubscribe" : function unsubscribe(event, callback) {
			var self = this;
			var args = [ event, self ];

			// Add args
			ARRAY_PUSH.apply(args, ARRAY_SLICE.call(arguments, 1));

			// Unsubscribe
			UNSUBSCRIBE.apply(hub, args);

			return self;
		}
	});
});

/**
 * TroopJS core/component/service
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-core/component/service',[ "./gadget" ], function ServiceModule(Gadget) {
	return Gadget.extend({
		"displayName" : "core/component/service",

		"sig/initialize" : function onStart() {
			var self = this;

			return self.publish("registry/add", self);
		},

		"sig/finalize" : function onFinalize() {
			var self = this;

			return self.publish("registry/remove", self);
		}
	});
});
/**
 * TroopJS core/logger/pubsub
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-core/logger/service',[ "../component/service", "troopjs-utils/merge", "when" ], function logger(Service, merge, when) {
	var ARRAY_PROTO = Array.prototype;
	var ARRAY_SLICE = ARRAY_PROTO.slice;
	var ARRAY_PUSH = ARRAY_PROTO.push;
	var OBJECT_TOSTRING = Object.prototype.toString;
	var TOSTRING_OBJECT = "[object Object]";
	var LENGTH = "length";
	var APPENDERS = "appenders";

	function forward(_signal, _args) {
		var self = this;
		var signal = self.signal;
		var args = [ _signal ];
		var appenders = self[APPENDERS];
		var index = 0;

		ARRAY_PUSH.apply(args, _args);

		var next = function () {
			var appender;

			return (appender = appenders[index++])
				? when(signal.apply(appender, args), next)
				: when.resolve(_args);
		};

		return next();
	}

	function convert(cat, message) {
		var result = {
			"cat" : cat,
			"time": new Date().getTime()
		};

		if (OBJECT_TOSTRING.call(message) === TOSTRING_OBJECT) {
			merge.call(result, message);
		}
		else {
			result.msg = message;
		}

		return result;
	}

	function append(obj) {
		var self = this;
		var appenders = self[APPENDERS];
		var i;
		var iMax;

		for (i = 0, iMax = appenders[LENGTH]; i < iMax; i++) {
			appenders[i].append(obj);
		}
	}

	return Service.extend(function LoggerService() {
		this[APPENDERS] = ARRAY_SLICE.call(arguments);
	}, {
		displayName : "core/logger/service",

		"sig/initialize" : function onInitialize() {
			return forward.call(this, "initialize", arguments);
		},
		"sig/start" : function onStart() {
			return forward.call(this, "start", arguments);
		},
		"sig/stop" : function onStop() {
			return forward.call(this, "stop", arguments);
		},
		"sig/finalize" : function onFinalize() {
			return forward.call(this, "finalize", arguments);
		},

		"hub/logger/log" : function onLog(message) {
			append.call(this, convert("log", message));
		},

		"hub/logger/warn" : function onWarn(message) {
			append.call(this, convert("warn", message));
		},

		"hub/logger/debug" : function onDebug(message) {
			append.call(this, convert("debug", message));
		},

		"hub/logger/info" : function onInfo(message) {
			append.call(this, convert("info", message));
		},

		"hub/logger/error" : function onError(message) {
			append.call(this, convert("error", message));
		}
	});
});

/**
 * TroopJS browser/ajax/service
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-browser/ajax/service',[ "troopjs-core/component/service", "jquery", "troopjs-utils/merge", "when" ], function AjaxModule(Service, $, merge, when) {
	var ARRAY_SLICE = Array.prototype.slice;

	return Service.extend({
		"displayName" : "browser/ajax/service",

		"hub/ajax" : function ajax(settings) {
			// Request
			var request = $.ajax(merge.call({
				"headers": {
					"x-request-id": new Date().getTime()
				}
			}, settings));

			// Wrap and return
			return when(request, function () {
				return ARRAY_SLICE.call(arguments);
			});
		}
	});
});
/**
 * TroopJS utils/getargs
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-utils/getargs',[],function GetArgsModule() {
	/*jshint strict:false */

	var PUSH = Array.prototype.push;
	var SUBSTRING = String.prototype.substring;
	var RE_BOOLEAN = /^(?:false|true)$/i;
	var RE_BOOLEAN_TRUE = /^true$/i;
	var RE_DIGIT = /^\d+$/;

	return function getargs() {
		var self = this;
		var result = [];
		var length;
		var from;
		var to;
		var i;
		var c;
		var a;
		var q = false;

		// Iterate over string
		for (from = to = i = 0, length = self.length; i < length; i++) {
			// Get char
			c = self.charAt(i);

			switch(c) {
				case "\"" :
				case "'" :
					// If we are currently quoted...
					if (q === c) {
						// Stop quote
						q = false;

						// Store result (no need to convert, we know this is a string)
						PUSH.call(result, SUBSTRING.call(self, from, to));
					}
					// Otherwise
					else {
						// Start quote
						q = c;
					}

					// Update from/to
					from = to = i + 1;
					break;

				case "," :
					// Continue if we're quoted
					if (q) {
						to = i + 1;
						break;
					}

					// If we captured something...
					if (from !== to) {
						a = SUBSTRING.call(self, from, to);

						if (RE_BOOLEAN.test(a)) {
							a = RE_BOOLEAN_TRUE.test(a);
						}
						else if (RE_DIGIT.test(a)) {
							a = +a;
						}

						// Store result
						PUSH.call(result, a);
					}

					// Update from/to
					from = to = i + 1;
					break;

				case " " :
				case "\t" :
					// Continue if we're quoted
					if (q) {
						to = i + 1;
						break;
					}

					// Update from/to
					if (from === to) {
						from = to = i + 1;
					}
					break;

				default :
					// Update to
					to = i + 1;
			}
		}

		// If we captured something...
		if (from !== to) {
			a = SUBSTRING.call(self, from, to);

			if (RE_BOOLEAN.test(a)) {
				a = RE_BOOLEAN_TRUE.test(a);
			}
			else if (RE_DIGIT.test(a)) {
				a = +a;
			}

			// Store result
			PUSH.call(result, a);
		}

		return result;
	};
});
/**
 * TroopJS utils/filter
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-utils/filter',[],function FilterModule() {
	/*jshint strict:false */

	var LENGTH = "length";

	/**
	 * Reduces array to only contain filtered values (evals left-right)
	 * @returns {Number} New length of array
	 */
	return function filter(callback) {
		var arg;
		var args = this;
		var i;
		var j;
		var iMax = args[LENGTH];

		for (i = j = 0; i < iMax; i++) {
			arg = args[i];

			if (callback.call(args, arg, i) === false) {
				continue;
			}

			args[j++] = arg;
		}

		// Assign and return new length
		return args[LENGTH] = j;
	};
});

/**
 * TroopJS jquery/destroy
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-jquery/destroy',[ "jquery" ], function DestroyModule($) {
	/*jshint strict:false, smarttabs:true */

	var DESTROY = "destroy";

	$.event.special[DESTROY] = {
		"noBubble" : true,

		"trigger" : function () {
			return false;
		},

		"remove" : function onDestroyRemove(handleObj) {
			var self = this;

			if (handleObj) {
				handleObj.handler.call(self, $.Event({
					"type" : handleObj.type,
					"data" : handleObj.data,
					"namespace" : handleObj.namespace,
					"target" : self
				}));
			}
		}
	};
});

/**
 * String polyfill / shims
 *
 * (c) copyright 2011-2013 Brian Cavalier and John Hann
 *
 * This module is part of the cujo.js family of libraries (http://cujojs.com/).
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 * Adds str.trim(), str.trimRight(), and str.trimLeft()
 *
 * Note: we don't bother trimming all possible ES5 white-space characters.
 * If you truly need strict ES5 whitespace compliance in all browsers,
 * create your own trim function.
 * from http://perfectionkills.com/whitespace-deviations/
 * '\x09-\x0D\x20\xA0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000\u2028\u2029'
 */
define ('poly/string',['./lib/_base'], function (base) {
	"use strict";

	var proto = String.prototype,
		featureMap,
		has,
		toString;

	featureMap = {
		'string-trim': 'trim',
		'string-trimleft': 'trimLeft',
		'string-trimright': 'trimRight'
	};

	function checkFeature (feature) {
		var prop = featureMap[feature];
		return base.isFunction(proto[prop]);
	}

	function neg () { return false; }

	has = checkFeature;

	// compressibility helper
	function remove (str, rx) {
		return str.replace(rx, '');
	}

	toString = base.createCaster(String, 'String');

	var trimRightRx, trimLeftRx;

	trimRightRx = /\s+$/;
	trimLeftRx = /^\s+/;

	function checkShims () {
		if (!has('string-trim')) {
			proto.trim = function trim () {
				return remove(remove(toString(this), trimLeftRx), trimRightRx);
			};
		}

		if (!has('string-trimleft')) {
			proto.trimLeft = function trimLeft () {
				return remove(toString(this), trimLeftRx);
			};
		}

		if (!has('string-trimright')) {
			proto.trimRight = function trimRight () {
				return remove(toString(this), trimRightRx);
			};
		}

	}

	checkShims();

	return {
		setWhitespaceChars: function (wsc) {
			trimRightRx = new RegExp(wsc + '$');
			trimLeftRx = new RegExp('^' + wsc);
			// fail all has() checks and check shims again
			has = neg;
			checkShims();
		}
	};

});

/**
 * TroopJS jquery/weave
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-jquery/weave',[ "require", "jquery", "when", "troopjs-utils/getargs", "troopjs-utils/filter", "./destroy", "poly/array", "poly/string" ], function WeaveModule(parentRequire, $, when, getargs, filter) {
	/*jshint strict:false, laxbreak:true, newcap:false, es5:true */

	var UNDEFINED;
	var ARRAY_PROTO = Array.prototype;
	var ARRAY_MAP = ARRAY_PROTO.map;
	var ARRAY_PUSH = ARRAY_PROTO.push;
	var $FN = $.fn;
	var $EXPR = $.expr;
	var $CREATEPSEUDO = $EXPR.createPseudo;
	var WIDGETS = "widgets";
	var WEAVE = "weave";
	var UNWEAVE = "unweave";
	var WOVEN = "woven";
	var DESTROY = "destroy";
	var LENGTH = "length";
	var DATA = "data-";
	var DATA_WEAVE = DATA + WEAVE;
	var DATA_WOVEN = DATA + WOVEN;
	var DATA_UNWEAVE = DATA + UNWEAVE;
	var SELECTOR_WEAVE = "[" + DATA_WEAVE + "]";
	var SELECTOR_UNWEAVE = "[" + DATA_WOVEN + "]";
	var RE_SEPARATOR = /[\s,]+/;

	/**
	 * Generic destroy handler.
	 * Simply makes sure that unweave has been called
	 */
	function onDestroy() {
		$(this).unweave();
	}

	/**
	 * Tests if element has a data-weave attribute
	 * @param element to test
	 * @returns {boolean}
	 * @private
	 */
	function hasDataWeaveAttr(element) {
		return $(element).attr(DATA_WEAVE) !== UNDEFINED;
	}

	/**
	 * Tests if element has a data-woven attribute
	 * @param element to test
	 * @returns {boolean}
	 * @private
	 */
	function hasDataWovenAttr(element) {
		return $(element).attr(DATA_WOVEN) !== UNDEFINED;
	}

	/**
	 * :weave expression
	 * @type {*}
	 */
	$EXPR[":"][WEAVE] = $CREATEPSEUDO
		// If we have jQuery >= 1.8 we want to use .createPseudo
		? $CREATEPSEUDO(function (widgets) {
			// If we don't have widgets to test, quick return optimized expression
			if (widgets === UNDEFINED) {
				return hasDataWeaveAttr;
			}

			// Convert widgets to RegExp
			widgets = RegExp(getargs.call(widgets).map(function (widget) {
				return "^" + widget;
			}).join("|"), "m");

			// Return expression
			return function (element) {
				// Get weave attribute
				var weave = $(element).attr(DATA_WEAVE);

				// Check that weave is not UNDEFINED, and that widgets test against a processed weave
				return weave !== UNDEFINED && widgets.test(weave.replace(RE_SEPARATOR, "\n"));
			};
		})
		// Otherwise fall back to legacy
		: function (element, index, match) {
			var weave = $(element).attr(DATA_WEAVE);

			return weave === UNDEFINED
				? false
				: match === UNDEFINED
					? true
					: RegExp(getargs.call(match[3]).map(function (widget) {
							return "^" + widget;
						}).join("|"), "m").test(weave.replace(RE_SEPARATOR, "\n"));
			};

	/**
	 * :woven expression
	 * @type {*}
	 */
	$EXPR[":"][WOVEN] = $CREATEPSEUDO
		// If we have jQuery >= 1.8 we want to use .createPseudo
		? $CREATEPSEUDO(function (widgets) {
			// If we don't have widgets to test, quick return optimized expression
			if (widgets === UNDEFINED) {
				return hasDataWovenAttr;
			}

			// Convert widgets to RegExp
			widgets = RegExp(getargs.call(widgets).map(function (widget) {
				return "^" + widget;
			}).join("|"), "m");

			// Return expression
			return function (element) {
				// Get woven attribute
				var woven = $(element).attr(DATA_WOVEN);

				// Check that woven is not UNDEFINED, and that widgets test against a processed woven
				return woven !== UNDEFINED && widgets.test(woven.replace(RE_SEPARATOR, "\n"));
			};
		})
		// Otherwise fall back to legacy
		: function (element, index, match) {
			var woven = $(element).attr(DATA_WOVEN);

			return woven === UNDEFINED
				? false
				: match === UNDEFINED
					? true
					: RegExp(getargs.call(match[3]).map(function (widget) {
						return "^" + widget;
					}).join("|"), "m").test(woven.replace(RE_SEPARATOR, "\n"));
		};

	/**
	 * Weaves elements
	 * @returns {Promise} of weaving
	 */
	$FN[WEAVE] = function () {
		var $elements = $(this);
		var weave_args = arguments;
		var woven = [];
		var wovenLength = 0;

		// Prepare $elements for weaving
		$elements
			// Reduce to only elements that can be woven
			.filter(SELECTOR_WEAVE)
				// Reduce to only elements that don't have a the destroy handler attached
				.filter(function () {
					// Get events
					var events = $._data(this, "events");

					// Check if we can find the onDestroy event handler in events
					var found = events && $.grep(events[DESTROY] || false, function (handleObj) {
						return handleObj.handler === onDestroy;
					}).length > 0;

					// Return true if not found, false if we did
					return !found;
				})
				// Attach onDestroy event
				.on(DESTROY, onDestroy)
				// Back to previous filtering
				.end()
			// Iterate
			.each(function (index, element) {
				var $element = $(element);
				var $data = $element.data();
				var $widgets = $data[WIDGETS] || ($data[WIDGETS] = []);
				var $widgetsLength = $widgets[LENGTH];
				var $woven = [];
				var $wovenLength = 0;
				var matches;
				var attr_weave = $element.attr(DATA_WEAVE);
				var attr_args;
				var i;
				var iMax;
				var value;
				var re = /[\s,]*([\w_\-\/\.]+)(?:\(([^\)]+)\))?/g;

				// Make sure to remove DATA_WEAVE (so we don't try processing this again)
				$element.removeAttr(DATA_WEAVE);

				// Iterate attr_weave (while re matches)
				// matches[0] : original matching string - " widget/name(1, 'string', false)"
				// matches[2] : widget name - "widget/name"
				// matches[3] : widget arguments - "1, 'string', false"
				while ((matches = re.exec(attr_weave)) !== null) {
					// Create attr_args
					attr_args = [ $element, matches[1] ];

					// Store trimmed matches[0] as WEAVE on attr_args
					attr_args[WEAVE] = matches[0].trim();

					// Transfer arguments from getargs (if any exist)
					if (matches[2]) {
						ARRAY_PUSH.apply(attr_args, getargs.call(matches[2]));
					}

					// Iterate end of attr_args to copy from $data
					for (i = 2, iMax = attr_args[LENGTH]; i < iMax; i++) {
						// Get value
						value = attr_args[i];

						// Override if value is in $data
						attr_args[i] = value in $data
							? $data[value]
							: value;
					}

					// Store $woven arguments
					$woven[$wovenLength++] = attr_args;
				}

				// Iterate $woven
				$woven.forEach(function (widget_args, $wovenIndex) {
					// Create deferred and resolver
					var deferred = when.defer();
					var resolver = deferred.resolver;
					var promise = $widgets[$widgetsLength++] = $woven[$wovenIndex] = deferred.promise;

					// Copy WEAVE
					promise[WEAVE] = widget_args[WEAVE];

					// Require module, add error handler
					parentRequire([ widget_args[1] ], function (Widget) {
						var widget;

						try {
							// Create widget instance
							widget = Widget.apply(Widget, widget_args);

							// Add WOVEN to promise
							promise[WOVEN] = widget.toString();

							// Resolve with start yielding widget
							resolver.resolve(widget.start.apply(widget, weave_args).yield(widget));
						}
						catch (e) {
							// Reject resolver
							resolver.reject(e);
						}
					}, resolver.reject);
				});

				// Add promise to woven (and for legacy to $data[WOVEN])
				$data[WOVEN] = woven[wovenLength++] = when.all($woven, function (widgets) {
					// Get current DATA_WOVEN attribute
					var attr_woven = $element.attr(DATA_WOVEN);

					// Convert to array
					attr_woven = attr_woven === UNDEFINED
						? []
						: [ attr_woven ];

					// Push orinal weave
					ARRAY_PUSH.apply(attr_woven, widgets.map(function (widget) { return widget.toString(); }));

					// Either set or remove DATA_WOVEN attribute
					if (attr_woven[LENGTH] !== 0) {
						$element.attr(DATA_WOVEN, attr_woven.join(" "));
					}
					else {
						$element.removeAttr(DATA_WOVEN);
					}

					// Trigger event on $element indicating widget(s) were woven
					$element.triggerHandler(WEAVE, widgets);

					// Return widgets
					return widgets;
				});
			});

		// Return promise of all woven
		return when.all(woven);
	};

	/**
	 * Unweaves elements
	 * @returns {Promise} of unweaving
	 */
	$FN[UNWEAVE] = function () {
		var $elements = $(this);
		var unweave_args = arguments;
		var unwoven = [];
		var unwovenLength = 0;

		// Prepare $elements for unweaving
		$elements
			// Reduce to only elements that can be unwoven
			.filter(SELECTOR_UNWEAVE)
			// Iterate
			.each(function (index, element) {
				var $element = $(element);
				var $data = $element.data();
				var $widgets = $data[WIDGETS] || ($data[WIDGETS] = []);
				var $unwoven = [];
				var $unwovenLength = 0;
				var attr_unweave = $element.attr(DATA_UNWEAVE);
				var i;
				var iMax;
				var re;

				// Remove DATA_UNWEAVE attribute
				$element.removeAttr(DATA_UNWEAVE);

				// If we have attr_unweave, we need to filter
				if (attr_unweave) {
					// Create regexp to match widgets
					re = RegExp(attr_unweave.split(RE_SEPARATOR).map(function (widget) {
						return "^" + widget;
					}).join("|"), "m");

					// Filter $widgets
					filter.call($widgets, function ($widget) {
						var filtered = re.test($widget[WOVEN]);

						if (filtered) {
							$unwoven[$unwovenLength++] = $widget;
						}

						return !filtered;
					});

					// When all $widgets are fulfilled
					when.all($widgets, function (widgets) {
						// Either set or remove DATA_WOVEN argument
						if (widgets[LENGTH] !== 0) {
							$element.attr(DATA_WOVEN, widgets.join(" "));
						}
						else {
							$element.removeAttr(DATA_WOVEN);
						}

						// Return widgets
						return widgets;
					});
				}
				// Otherwise unweave all widgets
				else {
					// Copy from $widgets to $unwoven
					for (i = 0, iMax = $widgets[LENGTH]; i < iMax; i++) {
						$unwoven[$unwovenLength++] = $widgets[i];
					}

					// Truncate $widgets
					$widgets[LENGTH] = 0;

					// Remove DATA_WOVEN attribute
					$element.removeAttr(DATA_WOVEN);
				}

				// Iterate $unwoven
				$unwoven.forEach(function ($widget, $unwovenIndex) {
					// Redefine $unwoven
					$unwoven[$unwovenIndex] = when($widget, function (widget) {
						// Chain deferred to stop, resolve with widget
						var promise = widget.stop.apply(widget, unweave_args).yield(widget);

						// Copy WEAVE
						promise[WEAVE] = $widget[WEAVE];

						// Return promise
						return promise;
					});
				});

				// Add to unwoven
				unwoven[unwovenLength++] = when.all($unwoven, function (widgets) {
					// Get current DATA_WEAVE attribute
					var attr_weave = $element.attr(DATA_WEAVE);

					// Convert to array
					attr_weave = attr_weave === UNDEFINED
						? []
						: [ attr_weave ];

					// Push orinal weave
					ARRAY_PUSH.apply(attr_weave, $unwoven.map(function ($widget) { return $widget[WEAVE]; }));

					// Either set or remove DATA_WEAVE attribute
					if (attr_weave[LENGTH] !== 0) {
						$element.attr(DATA_WEAVE, attr_weave.join(" "));
					}
					else {
						$element.removeAttr(DATA_WEAVE);
					}

					// Trigger event on $element indicating widget(s) were unwoven
					$element.triggerHandler(UNWEAVE, widgets);

					// Return widgets
					return widgets;
				});
			});

		// Return promise of all unwoven
		return when.all(unwoven);
	};

	/**
	 * Gets woven widgets
	 * @returns {Promise} of woven widgets
	 */
	$FN[WOVEN] = function () {
		var woven = [];
		var wovenLength = 0;
		var re;

		// If we have arguments we have convert and filter
		if (arguments[LENGTH] > 0) {
			// Map arguments to a regexp
			re = RegExp(ARRAY_MAP.call(arguments, function (widget) {
				return "^" + widget;
			}).join("|"), "m");

			// Iterate
			$(this).each(function (index, element) {
				// Filter widget promises
				var $widgets = ($.data(element, WIDGETS) || []).filter(function ($widget) {
					return re.test($widget[WOVEN]);
				});

				// Add promise of widgets to woven
				woven[wovenLength++] = when.all($widgets);
			});
		}
		// Otherwise we can use a faster approach
		else {
			// Iterate
			$(this).each(function (index, element) {
				// Add promise of widgets to woven
				woven[wovenLength++] = when.all($.data(element, WIDGETS));
			});
		}

		// Return promise of woven
		return when.all(woven);
	};
});

/**
 * TroopJS browser/component/widget
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-browser/component/widget',[ "troopjs-core/component/gadget", "jquery", "troopjs-jquery/weave" ], function WidgetModule(Gadget, $) {

	var UNDEFINED;
	var ARRAY_PROTO = Array.prototype;
	var ARRAY_SLICE = ARRAY_PROTO.slice;
	var TYPEOF_FUNCTION = "function";
	var $WEAVE = $.fn.weave;
	var $UNWEAVE = $.fn.unweave;
	var $ELEMENT = "$element";
	var $HANDLERS = "$handlers";
	var ATTR_WEAVE = "[data-weave]";
	var ATTR_WOVEN = "[data-woven]";
	var LENGTH = "length";
	var FEATURES = "features";
	var TYPE = "type";
	var VALUE = "value";
	var PROXY = "proxy";
	var GUID = "guid";

	/**
	 * Creates a proxy that executes 'handler' in 'widget' scope
	 * @private
	 * @param {Object} widget target widget
	 * @param {Function} handler target handler
	 * @returns {function} proxied handler
	 */
	function eventProxy(widget, handler) {
		/**
		 * Creates a proxy of the outer method 'handler' that first adds 'topic' to the arguments passed
		 * @returns result of proxied hanlder invocation
		 */
		return function handlerProxy() {
			// Apply with shifted arguments to handler
			return handler.apply(widget, arguments);
		};
	}

	/**
	 * Creates a proxy of the inner method 'render' with the '$fn' parameter set
	 * @private
	 * @param $fn jQuery method
	 * @returns {Function} proxied render
	 */
	function renderProxy($fn) {
		/**
		 * Renders contents into element
		 * @private
		 * @param {Function|String} contents Template/String to render
		 * @param {Object..} [data] If contents is a template - template data
		 * @returns {Object} self
		 */
		function render(contents, data) {
			var self = this;
			var args = ARRAY_SLICE.call(arguments, 1);

			// Call render with contents (or result of contents if it's a function)
			return $fn.call(self[$ELEMENT], typeof contents === TYPEOF_FUNCTION ? contents.apply(self, args) : contents)
				.find(ATTR_WEAVE)
				.weave();
		}

		return render;
	}

	return Gadget.extend(function Widget($element, displayName) {
		var self = this;

		if ($element === UNDEFINED) {
			throw new Error("No $element provided");
		}

		self[$ELEMENT] = $element;
		self[$HANDLERS] = [];

		if (displayName !== UNDEFINED) {
			self.displayName = displayName;
		}
	}, {
		"displayName" : "browser/component/widget",

		/**
		 * Signal handler for 'initialize'
		 */
		"sig/initialize" : function initialize() {
			var self = this;
			var $element = self[$ELEMENT];
			var $handler;
			var $handlers = self[$HANDLERS];
			var special;
			var specials = self.constructor.specials.dom;
			var type;
			var features;
			var value;
			var proxy;
			var i;
			var iMax;

			// Iterate specials
			for (i = 0, iMax = specials ? specials[LENGTH] : 0; i < iMax; i++) {
				// Get special
				special = specials[i];

				// Create $handler
				$handler = $handlers[i] = {};

				// Set $handler properties
				$handler[TYPE] = type = special[TYPE];
				$handler[FEATURES] = features = special[FEATURES];
				$handler[VALUE] = value = special[VALUE];
				$handler[PROXY] = proxy = eventProxy(self, value);

				// Attach proxy
				$element.on(type, features, self, proxy);

				// Copy GUID from proxy to value (so you can use .off to remove it)
				value[GUID] = proxy[GUID]
			}
		},

		/**
		 * Signal handler for 'finalize'
		 */
		"sig/finalize" : function finalize() {
			var self = this;
			var $element = self[$ELEMENT];
			var $handler;
			var $handlers = self[$HANDLERS];
			var i;
			var iMax;

			// Iterate $handlers
			for (i = 0, iMax = $handlers[LENGTH]; i < iMax; i++) {
				// Get $handler
				$handler = $handlers[i];

				// Detach event handler
				$element.off($handler[TYPE], $handler[FEATURES], $handler[PROXY]);
			}
		},

		/**
		 * Weaves all children of $element
		 * @returns {Promise} from $WEAVE
		 */
		"weave" : function weave() {
			return $WEAVE.apply(this[$ELEMENT].find(ATTR_WEAVE), arguments);
		},

		/**
		 * Unweaves all children of $element _and_ self
		 * @returns {Promise} from $UNWEAVE
		 */
		"unweave" : function unweave() {
			return $UNWEAVE.apply(this[$ELEMENT].find(ATTR_WOVEN).addBack(), arguments);
		},

		/**
		 * Renders content and inserts it before $element
		 */
		"before" : renderProxy($.fn.before),

		/**
		 * Renders content and inserts it after $element
		 */
		"after" : renderProxy($.fn.after),

		/**
		 * Renders content and replaces $element contents
		 */
		"html" : renderProxy($.fn.html),

		/**
		 * Renders content and replaces $element contents
		 */
		"text" : renderProxy($.fn.text),

		/**
		 * Renders content and appends it to $element
		 */
		"append" : renderProxy($.fn.append),

		/**
		 * Renders content and prepends it to $element
		 */
		"prepend" : renderProxy($.fn.prepend)
	});
});

/**
 * TroopJS core/registry/service
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-core/registry/service',[ "../component/service", "poly/object", "poly/array" ], function RegistryServiceModule(Service) {
	var SERVICES = "services";

	return Service.extend(function RegistryService() {
		var self = this;

		self[SERVICES] = {};

		self.add(self);
	},{
		"displayName" : "core/registry/service",

		"add" : function add(service) {
			this[SERVICES][service.toString()] = service;
		},

		"remove": function remove(service) {
			delete this[SERVICES][service.toString()];
		},

		"get" : function get(pattern) {
			var re = new RegExp(pattern);
			var services = this[SERVICES];

			return Object.keys(services)
				.filter(function filter(serviceName) {
					return re.test(serviceName);
				})
				.map(function map(serviceName) {
					return services[serviceName];
				});
		},

		"hub/registry/add" : function onAdd(service) {
			return this.add(service);
		},

		"hub/registry/remove" : function onRemove(service) {
			return this.remove(service);
		},

		"hub/registry/get" : function onGet(pattern) {
			return this.get(pattern);
		}
	});
});
/**
 * TroopJS browser/application/widget
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-browser/application/widget',[ "module", "../component/widget", "when", "troopjs-core/registry/service", "poly/array" ], function ApplicationWidgetModule(module, Widget, when, RegistryService) {
	/*jshint laxbreak:true */

	var ARRAY_PROTO = Array.prototype;
	var ARRAY_SLICE = ARRAY_PROTO.slice;
	var ARRAY_PUSH = ARRAY_PROTO.push;
	var REGISTRY = "registry";

	/**
	 * Forwards _signal to components
	 * @private
	 * @param {String} _signal Signal to forward
	 * @param {Array} _args Signal arguments
	 * @returns {Function}
	 */
	function forward(_signal, _args) {
		var self = this;
		var signal = self.signal;
		var args = [ _signal ];
		var components = self[REGISTRY].get();
		var index = 0;

		ARRAY_PUSH.apply(args, _args);

		var next = function () {
			var component;

			return (component = components[index++])
				? when(signal.apply(component, args), next)
				: when.resolve(_args);
		};

		return next();
	}

	return Widget.extend(function ApplicationWidget() {
		// Create registry
		var registry = this[REGISTRY] = RegistryService();

		// Slice and iterate arguments
		ARRAY_SLICE.call(arguments, 2).forEach(function (component) {
			// Register component
			registry.add(component);
		});
	}, {
		"displayName" : "browser/application/widget",

		"sig/initialize" : function onInitialize() {
			return forward.call(this, "initialize", arguments);
		},

		"sig/start" : function onStart() {
			var self = this;
			var weave = self.weave;
			var args = arguments;

			return forward.call(self, "start", args).then(function started() {
				return weave.apply(self, args);
			});
		},

		"sig/stop" : function onStop() {
			var self = this;
			var unweave = self.unweave;
			var args = arguments;

			return unweave.apply(self, args).then(function stopped() {
				return forward.call(self, "stop", args);
			});
		},

		"sig/finalize" : function onFinalize() {
			return forward.call(this, "finalize", arguments);
		}
	});
});
/**
 * TroopJS browser/route/uri
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 *
 * Parts of code from parseUri 1.2.2 Copyright Steven Levithan <stevenlevithan.com>
 */
/*global define:false */
define('troopjs-browser/route/uri',[ "troopjs-core/component/factory" ], function URIModule(Factory) {
	/*jshint strict:false, smarttabs:true, laxbreak:true, newcap:false, forin:false, loopfunc:true */

	var NULL = null;
	var ARRAY_PROTO = Array.prototype;
	var OBJECT_PROTO = Object.prototype;
	var ARRAY_PUSH = ARRAY_PROTO.push;
	var STRING_SPLIT = String.prototype.split;
	var TOSTRING = OBJECT_PROTO.toString;
	var TOSTRING_OBJECT = TOSTRING.call(OBJECT_PROTO);
	var TOSTRING_ARRAY = TOSTRING.call(ARRAY_PROTO);
	var TOSTRING_FUNCTION = TOSTRING.call(Function.prototype);
	var RE_URI = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?(?:([^?#]*)(?:\?([^#]*))?(?:#(.*))?)/;

	var PROTOCOL = "protocol";
	var AUTHORITY = "authority";
	var PATH = "path";
	var QUERY = "query";
	var ANCHOR = "anchor";

	var KEYS = [ "source",
		PROTOCOL,
		AUTHORITY,
		"userInfo",
		"user",
		"password",
		"host",
		"port",
		PATH,
		QUERY,
		ANCHOR ];

	function Query(arg) {
		var result = {};
		var matches;
		var key = NULL;
		var value;
		var re = /(?:&|^)([^&=]*)=?([^&]*)/g;

		result.toString = Query.toString;

		if (TOSTRING.call(arg) === TOSTRING_OBJECT) {
			for (key in arg) {
				result[key] = arg[key];
			}
		} else {
			while ((matches = re.exec(arg)) !== NULL) {
				key = matches[1];

				if (key in result) {
					value = result[key];

					if (TOSTRING.call(value) === TOSTRING_ARRAY) {
						value[value.length] = matches[2];
					}
					else {
						result[key] = [ value, matches[2] ];
					}
				}
				else {
					result[key] = matches[2];
				}
			}
		}

		return result;
	}

	Query.toString = function QueryToString() {
		var self = this;
		var key;
		var value;
		var values;
		var query = [];
		var i = 0;
		var j;

		for (key in self) {
			if (TOSTRING.call(self[key]) === TOSTRING_FUNCTION) {
				continue;
			}

			query[i++] = key;
		}

		query.sort();

		while (i--) {
			key = query[i];
			value = self[key];

			if (TOSTRING.call(value) === TOSTRING_ARRAY) {
				values = value.slice(0);

				values.sort();

				j = values.length;

				while (j--) {
					value = values[j];

					values[j] = value === ""
						? key
						: key + "=" + value;
				}

				query[i] = values.join("&");
			}
			else {
				query[i] = value === ""
					? key
					: key + "=" + value;
			}
		}

		return query.join("&");
	};

	// Extend on the instance of array rather than subclass it
	function Path(arg) {
		var result = [];
		
		result.toString = Path.toString;

		ARRAY_PUSH.apply(result, TOSTRING.call(arg) === TOSTRING_ARRAY
			? arg
			: STRING_SPLIT.call(arg, "/"));

		return result;
	}

	Path.toString = function PathToString() {
		return this.join("/");
	};

	var URI = Factory(function URI(str) {
		var self = this;
		var value;
		var matches;
		var i;

		if ((matches = RE_URI.exec(str)) !== NULL) {
			i = matches.length;

			while (i--) {
				value = matches[i];

				if (value) {
					self[KEYS[i]] = value;
				}
			}
		}

		if (QUERY in self) {
			self[QUERY] = Query(self[QUERY]);
		}

		if (PATH in self) {
			self[PATH] = Path(self[PATH]);
		}
	}, {
		"displayName" : "browser/route/uri",

		"toString" : function URIToString() {
			var self = this;
			var uri = [ PROTOCOL , "://", AUTHORITY, PATH, "?", QUERY, "#", ANCHOR ];
			var i;
			var key;

			if (!(PROTOCOL in self)) {
				uri[0] = uri[1] = "";
			}

			if (!(AUTHORITY in self)) {
				uri[2] = "";
			}

			if (!(PATH in self)) {
				uri[3] = "";
			}

			if (!(QUERY in self)) {
				uri[4] = uri[5] = "";
			}

			if (!(ANCHOR in self)) {
				uri[6] = uri[7] = "";
			}

			i = uri.length;

			while (i--) {
				key = uri[i];

				if (key in self) {
					uri[i] = self[key];
				}
			}

			return uri.join("");
		}
	});

	URI.Path = Path;
	URI.Query = Query;

	return URI;
});
/**
 * TroopJS jquery/hashchange
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 *
 * Normalized hashchange event, ripped a _lot_ of code from
 * https://github.com/millermedeiros/Hasher
 */
/*global define:false */
define('troopjs-jquery/hashchange',[ "jquery" ], function HashchangeModule($) {
	/*jshint strict:false, smarttabs:true, laxbreak:true, evil:true */

	var INTERVAL = "interval";
	var HASHCHANGE = "hashchange";
	var ONHASHCHANGE = "on" + HASHCHANGE;
	var RE_HASH = /#(.*)$/;
	var RE_LOCAL = /\?/;

	// hack based on this: http://code.google.com/p/closure-compiler/issues/detail?id=47#c13
	var _isIE = /**@preserve@cc_on !@*/0;

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
		"getElement" : function () {
			return this.element;
		},

		"getHash" : function () {
			return this.element.contentWindow.frameHash;
		},

		"update" : function (hash) {
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
		"setup" : function onHashChangeSetup(data, namespaces, eventHandle) {
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
				? (function () {
					var document = window.document;
					var _isLocal = location.protocol === "file:";

					var frame = new Frame(document);
					document.body.appendChild(frame.getElement());
					frame.update(hash);

					return function () {
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
				: function () {
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
		"teardown" : function onHashChangeTeardown(namespaces) {
			var window = this;

			// Quick return if we support onHashChange natively
			if (ONHASHCHANGE in window) {
				return false;
			}

			window.clearInterval($.data(window, INTERVAL));
		}
	};
});

/**
 * TroopJS browser/route/widget module
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-browser/route/widget',[ "../component/widget", "./uri", "troopjs-jquery/hashchange" ], function RouteWidgetModule(Widget, URI) {
	var $ELEMENT = "$element";
	var HASHCHANGE = "hashchange";
	var ROUTE = "route";
	var RE = /^#/;

	function onHashChange($event) {
		var self = $event.data;

		// Create URI
		var uri = URI($event.target.location.hash.replace(RE, ""));

		// Convert to string
		var route = uri.toString();

		// Did anything change?
		if (route !== self[ROUTE]) {
			// Store new value
			self[ROUTE] = route;

			// Publish route
			self.publish(self.displayName, uri, $event);
		}
	}

	return Widget.extend({
		"displayName" :"browser/route/widget",

		"sig/initialize" : function initialize() {
			var self = this;

			self[$ELEMENT].on(HASHCHANGE, self, onHashChange);
		},

		"sig/start" : function start() {
			this[$ELEMENT].trigger(HASHCHANGE);
		},

		"sig/finalize" : function finalize() {
			this[$ELEMENT].off(HASHCHANGE, onHashChange);
		}
	});
});
/**
 * TroopJS requirejs/template
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 *
 * Parts of code from require-cs 0.4.0+ Copyright (c) 2010-2011, The Dojo Foundation
 */
/*global define:false, require:false*/
define('troopjs-requirejs/template',[],function TemplateModule() {
	/*jshint strict:false, smarttabs:true, laxbreak:true, newcap:false, loopfunc:true */

	var FACTORIES = {
		"node" : function () {
			// Using special require.nodeRequire, something added by r.js.
			var fs = require.nodeRequire("fs");

			return function fetchText(path, callback) {
				var file = fs.readFileSync(path, 'utf8');
				//Remove BOM (Byte Mark Order) from utf8 files if it is there.
				if (file.indexOf('\uFEFF') === 0) {
					file = file.substring(1);
				}
				callback(file);
			};
		},

		"browser" : function () {
			// Would love to dump the ActiveX crap in here. Need IE 6 to die first.
			var progIds = [ "Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"];
			var progId;
			var XHR;
			var i;

			if (typeof XMLHttpRequest !== "undefined") {
				XHR = XMLHttpRequest;
			}
			else {
				for (i = 0; i < 3; i++) {
					progId = progIds[i];

					try {
						new ActiveXObject(progId);
						XHR = function(){
							return new ActiveXObject(progId);
						};
						break;
					}
					catch (e) {
					}
				}

				if (!XHR){
					throw new Error("XHR: XMLHttpRequest not available");
				}
			}

			return function fetchText(url, callback) {
				var xhr = new XHR();
				xhr.open('GET', url, true);
				xhr.onreadystatechange = function (evt) {
					// Do not explicitly handle errors, those should be
					// visible via console output in the browser.
					if (xhr.readyState === 4) {
						callback(xhr.responseText);
					}
				};
				xhr.send(null);
			};
		},

		"rhino" : function () {
			var encoding = "utf-8";
			var lineSeparator = java.lang.System.getProperty("line.separator");

			// Why Java, why is this so awkward?
			return function fetchText(path, callback) {
				var file = new java.io.File(path);
				var input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding));
				var stringBuffer = new java.lang.StringBuffer();
				var line;
				var content = "";

				try {
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
					// Make sure we return a JavaScript string and not a Java string.
					content = String(stringBuffer.toString()); // String
				} finally {
					input.close();
				}

				callback(content);
			};
		},

		"borked" : function () {
			return function fetchText() {
				throw new Error("Environment unsupported.");
			};
		}
	};

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

		return ("function template(data) { var o = \""
		// Sanitize body before we start templating
		+ body.replace(RE_SANITIZE, "")

		// Replace script blocks with tokens
		.replace(RE_BLOCK, blocksTokens)

		// Replace unwanted tokens
		.replace(RE_REPLACE, replace)

		// Replace tokens with script blocks
		.replace(RE_TOKENS, tokensBlocks)

		+ "\"; return o; }")

		// Clean
		.replace(RE_CLEAN, EMPTY);
	}

	var buildMap = {};
	var fetchText = FACTORIES[ typeof process !== "undefined" && process.versions && !!process.versions.node
		? "node"
		: (typeof window !== "undefined" && window.navigator && window.document) || typeof importScripts !== "undefined"
			? "browser"
			: typeof Packages !== "undefined"
				? "rhino"
				: "borked" ]();

	return {
		load: function (name, parentRequire, load, config) {
			var path = parentRequire.toUrl(name);

			fetchText(path, function (text) {
				try {
					text = "define(function() { return " + compile(text, name, path, config.template) + "; })";
				}
				catch (err) {
					err.message = "In " + path + ", " + err.message;
					throw(err);
				}

				if (config.isBuild) {
					buildMap[name] = text;
				}

				// IE with conditional comments on cannot handle the
				// sourceURL trick, so skip it if enabled
				/*@if (@_jscript) @else @*/
				else {
					text += "\n//@ sourceURL='" + path +"'";
				}
				/*@end@*/

				load.fromText(name, text);

				// Give result to load. Need to wait until the module
				// is fully parse, which will happen after this
				// execution.
				parentRequire([name], function (value) {
					load(value);
				});
			});
		},

		write: function (pluginName, name, write) {
			if (buildMap.hasOwnProperty(name)) {
				write.asModule(pluginName + "!" + name, buildMap[name]);
			}
		}
	};
});

define('troopjs-bundle/micro',[
	"troopjs-core/logger/console",
	"troopjs-core/logger/pubsub",
	"troopjs-core/logger/service",
	"troopjs-browser/ajax/service",
	"troopjs-browser/application/widget",
	"troopjs-browser/route/widget",
	"troopjs-requirejs/template"
]);
/**
 * TroopJS data/store/component module
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-data/store/component',[ "troopjs-core/component/gadget", "when" ], function StoreModule(Gadget, when) {
	var UNDEFINED;
	var ADAPTER = "adapter";
	var LOCK = "lock";

	return Gadget.extend(function StoreComponent(adapter) {
		if (adapter === UNDEFINED) {
			throw new Error("No adapter provided");
		}

		this[ADAPTER] = adapter;
	}, {
		"displayName" : "data/store/component",

		"ready" : function ready(onFulfilled, onRejected, onProgress) {
			var self = this;

			return self[LOCK] = when(self[LOCK], onFulfilled, onRejected, onProgress);
		},

		"set" : function set(key, value, onFulfilled, onRejected, onProgress) {
			return when(this[ADAPTER].set(key, value), onFulfilled, onRejected, onProgress);
		},

		"get" : function get(key, onFulfilled, onRejected, onProgress) {
			return when(this[ADAPTER].get(key), onFulfilled, onRejected, onProgress);
		},

		"remove" : function remove(key, onFulfilled, onRejected, onProgress) {
			return when(this[ADAPTER].remove(key), onFulfilled, onRejected, onProgress);
		},

		"clear" : function clear(onFulfilled, onRejected, onProgress) {
			return when(this[ADAPTER].clear(), onFulfilled, onRejected, onProgress);
		}
	});
});
/**
 * TroopJS data/cache/component
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-data/cache/component', [ "troopjs-core/component/base" ], function CacheModule(Component) {
	/*jshint laxbreak:true */

	var UNDEFINED;
	var FALSE = false;
	var NULL = null;
	var OBJECT = Object;
	var ARRAY = Array;

	var SECOND = 1000;
	var INTERVAL = "interval";
	var GENERATIONS = "generations";
	var AGE = "age";
	var HEAD = "head";
	var NEXT = "next";
	var EXPIRES = "expires";
	var CONSTRUCTOR = "constructor";
	var LENGTH = "length";

	var _ID = "id";
	var _MAXAGE = "maxAge";
	var _EXPIRES = "expires";
	var _INDEXED = "indexed";
	var _COLLAPSED = "collapsed";

	/**
	 * Internal method to put a node in the cache
	 * @param node Node
	 * @param _constructor Constructor of value
	 * @param now Current time (seconds)
	 * @returns Cached node
	 */
	function _put(node, _constructor, now) {
		var self = this;
		var result;
		var id;
		var i;
		var iMax;
		var expires;
		var expired;
		var head;
		var current;
		var next;
		var generation;
		var generations = self[GENERATIONS];
		var property;
		var value;

		// First add node to cache (or get the already cached instance)
		cache : {
			// Can't cache if there is no _ID
			if (!(_ID in node)) {
				result = node;          // Reuse ref to node (avoids object creation)
				break cache;
			}

			// Get _ID
			id = node[_ID];

			// In cache, get it!
			if (id in self) {
				result = self[id];
				break cache;
			}

			// Not in cache, add it!
			result = self[id] = node;   // Reuse ref to node (avoids object creation)

			// Update _INDEXED
			result[_INDEXED] = now;
		}

		// We have to deep traverse the graph before we do any expiration (as more data for this object can be available)

		// Check that this is an ARRAY
		if (_constructor === ARRAY) {
			// Index all values
			for (i = 0, iMax = node[LENGTH]; i < iMax; i++) {

				// Keep value
				value = node[i];

				// Get _constructor of value (safely, falling back to UNDEFINED)
				_constructor = value === NULL || value === UNDEFINED
					? UNDEFINED
					: value[CONSTRUCTOR];

				// Do magic comparison to see if we recursively put this in the cache, or plain put
				result[i] = (_constructor === OBJECT || _constructor === ARRAY && value[LENGTH] !== 0)
					? _put.call(self, value, _constructor, now)
					: value;
			}
		}

		// Check that this is an OBJECT
		else if (_constructor === OBJECT) {
			// Index all properties
			for (property in node) {
				// Except the _ID property
				// or the _COLLAPSED property, if it's false
				if (property === _ID
					|| (property === _COLLAPSED && result[_COLLAPSED] === FALSE)) {
					continue;
				}

				// Keep value
				value = node[property];

				// Get _constructor of value (safely, falling back to UNDEFINED)
				_constructor = value === NULL || value === UNDEFINED
					? UNDEFINED
					: value[CONSTRUCTOR];

				// Do magic comparison to see if we recursively put this in the cache, or plain put
				result[property] = (_constructor === OBJECT || _constructor === ARRAY && value[LENGTH] !== 0)
					? _put.call(self, value, _constructor, now)
					: value;
			}
		}

		// Check if we need to move result between generations
		move : {
			// Break fast if id is NULL
			if (id === NULL) {
				break move;
			}

			// Calculate expiration and floor
			// '>>>' means convert anything other than posiitive integer into 0
			expires = 0 | now + (result[_MAXAGE] >>> 0);

			remove : {
				// Fail fast if there is no old expiration
				if (!(_EXPIRES in result)) {
					break remove;
				}

				// Get current expiration
				expired = result[_EXPIRES];

				// If expiration has not changed, we can continue
				if (expired === expires) {
					break move;
				}

				// Remove ref from generation (if that generation exists)
				if (expired in generations) {
					delete generations[expired][id];
				}
			}

			add : {
				// Update expiration time
				result[_EXPIRES] = expires;

				// Existing generation
				if (expires in generations) {
					// Add result to generation
					generations[expires][id] = result;
					break add;
				}

				// Create generation with expiration set
				(generation = generations[expires] = {})[EXPIRES] = expires;

				// Add result to generation
				generation[id] = result;

				// Short circuit if there is no head
				if (generations[HEAD] === UNDEFINED) {
					generations[HEAD] = generation;
					break add;
				}

				// Step through list as long as there is a next, and expiration is "older" than the next expiration
				for (current = head = generations[HEAD]; (next = current[NEXT]) !== UNDEFINED && next[EXPIRES] < expires; current = next);

				// Check if we're still on the head and if we're younger
				if (current === head && current[EXPIRES] > expires) {
					// Next generation is the current one (head)
					generation[NEXT] = current;

					// Reset head to new generation
					generations[HEAD] = generation;
					break add;
				}

				// Insert new generation between current and current.next
				generation[NEXT] = current[NEXT];
				current[NEXT] = generation;
			}
		}

		return result;
	}

	return Component.extend(function CacheComponent(age) {
		var me = this;

		me[AGE] = age || (60 * SECOND);
		me[GENERATIONS] = {};
	}, {
		"displayName" : "data/cache/component",

		"sig/start" : function start() {
			var self = this;
			var generations = self[GENERATIONS];

			// Create new sweep interval
			self[INTERVAL] = INTERVAL in self
				? self[INTERVAL]
				: setInterval(function sweep() {
				// Calculate expiration of this generation
				var expires = 0 | new Date().getTime() / SECOND;

				var property;
				var current;

				// Get head
				current = generations[HEAD];

				// Fail fast if there's no head
				if (current === UNDEFINED) {
					return;
				}

				do {
					// Exit if this generation is to young
					if (current[EXPIRES] > expires) {
						break;
					}

					// Iterate all properties on current
					for (property in current) {
						// And is it not a reserved property
						if (property === EXPIRES || property === NEXT || property === GENERATIONS) {
							continue;
						}

						// Delete from self (cache)
						delete self[property];
					}

					// Delete generation
					delete generations[current[EXPIRES]];
				}
				// While there's a next
				while ((current = current[NEXT]));

				// Reset head
				generations[HEAD] = current;
			}, self[AGE]);
		},

		"sig/stop" : function stop() {
			var self = this;

			// Only do this if we have an interval
			if (INTERVAL in self) {
				// Clear interval
				clearInterval(self[INTERVAL]);

				// Reset interval
				delete self[INTERVAL];
			}
		},

		"sig/finalize" : function finalize() {
			var self = this;
			var property;

			// Iterate all properties on self
			for (property in self) {
				// Don't delete non-objects or objects that don't ducktype cachable
				if (self[property][CONSTRUCTOR] !== OBJECT || !(_ID in self[property])) {
					continue;
				}

				// Delete from self (cache)
				delete self[property];
			}
		},

		/**
		 * Puts a node into the cache
		 * @param node Node to add (object || array)
		 * @returns Cached node (if it existed in the cache before), otherwise the node sent in
		 */
		"put" : function put(node) {
			var self = this;

			// Get _constructor of node (safely, falling back to UNDEFINED)
			var _constructor = node === NULL || node === UNDEFINED
				? UNDEFINED
				: node[CONSTRUCTOR];

			// Do magic comparison to see if we should cache this object
			return _constructor === OBJECT || _constructor === ARRAY && node[LENGTH] !== 0
				? _put.call(self, node, _constructor, 0 | new Date().getTime() / SECOND)
				: node;
		}
	});
});

/**
 * TroopJS data/query/component
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-data/query/component', [ "troopjs-core/component/base" ], function QueryModule(Component) {
	/*jshint laxbreak:true */

	var UNDEFINED;
	var TRUE = true;
	var FALSE = false;
	var OBJECT = Object;
	var ARRAY = Array;
	var CONSTRUCTOR = "constructor";
	var LENGTH = "length";

	var OP = "op";
	var OP_ID = "!";
	var OP_PROPERTY = ".";
	var OP_PATH = ",";
	var OP_QUERY = "|";
	var TEXT = "text";
	var RAW = "raw";
	var RESOLVED = "resolved";
	var _ID = "id";
	var _EXPIRES = "expires";
	var _COLLAPSED = "collapsed";
	var _AST = "_ast";
	var _QUERY = "_query";

	var RE_TEXT = /("|')(.*?)\1/;
	var TO_RAW = "$2";
	var RE_RAW = /!(.*[!,|.\s]+.*)/;
	var TO_TEXT = "!'$1'";

	return Component.extend(function QueryComponent(query) {
		var self = this;

		if (query !== UNDEFINED) {
			self[_QUERY] = query;
		}
	}, {
		"displayName" : "data/query/component",

		"parse" : function parse(query) {
			var self = this;

			// Reset _AST
			delete self[_AST];

			// Set _QUERY
			query = self[_QUERY] = (query || self[_QUERY] || "");

			var i;          // Index
			var l;          // Length
			var c;          // Current character
			var m;          // Current mark
			var q;          // Current quote
			var o;          // Current operation
			var ast = [];   // _AST

			// Step through the query
			for (i = m = 0, l = query[LENGTH]; i < l; i++) {
				c = query.charAt(i);

				switch (c) {
					case "\"" : // Double quote
					case "'" :  // Single quote
						// Set / unset quote char
						q = q === c
							? UNDEFINED
							: c;
						break;

					case OP_ID :
						// Break fast if we're quoted
						if (q !== UNDEFINED) {
							break;
						}

						// Init new op
						o = {};
						o[OP] = c;
						break;

					case OP_PROPERTY :
					case OP_PATH :
						// Break fast if we're quoted
						if (q !== UNDEFINED) {
							break;
						}

						// If there's an active op, store TEXT and push on _AST
						if (o !== UNDEFINED) {
							o[RAW] = (o[TEXT] = query.substring(m, i)).replace(RE_TEXT, TO_RAW);
							ast.push(o);
						}

						// Init new op
						o = {};
						o[OP] = c;

						// Set mark
						m = i + 1;
						break;

					case OP_QUERY :
					case " " :  // Space
					case "\t" : // Horizontal tab
					case "\r" : // Carriage return
					case "\n" : // Newline
						// Break fast if we're quoted
						if (q !== UNDEFINED) {
							break;
						}

						// If there's an active op, store TEXT and push on _AST
						if (o !== UNDEFINED) {
							o[RAW] = (o[TEXT] = query.substring(m, i)).replace(RE_TEXT, TO_RAW);
							ast.push(o);
						}

						// Reset op
						o = UNDEFINED;

						// Set mark
						m = i + 1;
						break;
				}
			}

			// If there's an active op, store TEXT and push on _AST
			if (o !== UNDEFINED) {
				o[RAW] = (o[TEXT] = query.substring(m, l)).replace(RE_TEXT, TO_RAW);
				ast.push(o);
			}

			// Set _AST
			self[_AST] = ast;

			return self;
		},

		"reduce" : function reduce(cache) {
			var self = this;
			var now = 0 | new Date().getTime() / 1000;

			// If we're not parsed - parse
			if (!(_AST in self)) {
				self.parse();
			}

			var ast = self[_AST]; // _AST
			var result = [];    // Result
			var i;              // Index
			var j;
			var c;
			var l;              // Length
			var o;              // Current operation
			var x;              // Current raw
			var r;              // Current root
			var n;              // Current node
			var k = FALSE;      // Keep flag

			// First step is to resolve what we can from the _AST
			for (i = 0, l = ast[LENGTH]; i < l; i++) {
				o = ast[i];

				switch (o[OP]) {
					case OP_ID :
						// Set root
						r = o;

						// Get e from o
						x = o[RAW];

						// Do we have this item in cache
						if (x in cache) {
							// Set current node
							n = cache[x];
							// Set RESOLVED if we're not collapsed or expired
							o[RESOLVED] = n[_COLLAPSED] !== TRUE && !(_EXPIRES in n) || n[_EXPIRES] > now;
						}
						else {
							// Reset current root and node
							n = UNDEFINED;
							// Reset RESOLVED
							o[RESOLVED] = FALSE;
						}
						break;

					case OP_PROPERTY :
						// Get e from o
						x = o[RAW];

						// Do we have a node and this item in the node
						if (n && x in n) {
							// Set current node
							n = n[x];

							// Get constructor
							c = n[CONSTRUCTOR];

							// If the constructor is an array
							if (c === ARRAY) {
								// Set naive resolved
								o[RESOLVED] = TRUE;

								// Iterate backwards over n
								for (j = n[LENGTH]; j-- > 0;) {
									// Get item
									c = n[j];

									// If the constructor is not an object
									// or the object does not duck-type _ID
									// or the object is not collapsed
									// and the object does not duck-type _EXPIRES
									// or the objects is not expired
									if (c[CONSTRUCTOR] !== OBJECT
										|| !(_ID in c)
										|| c[_COLLAPSED] !== TRUE
										&& !(_EXPIRES in c)
										|| c[_EXPIRES] > now) {
										continue;
									}

									// Change RESOLVED
									o[RESOLVED] = FALSE;
									break;
								}
							}
							// If the constructor is _not_ an object or n does not duck-type _ID
							else if (c !== OBJECT || !(_ID in n)) {
								o[RESOLVED] = TRUE;
							}
							// We know c _is_ and object and n _does_ duck-type _ID
							else {
								// Change OP to OP_ID
								o[OP] = OP_ID;
								// Update RAW to _ID and TEXT to escaped version of RAW
								o[TEXT] = (o[RAW] = n[_ID]).replace(RE_RAW, TO_TEXT);
								// Set RESOLVED if we're not collapsed or expired
								o[RESOLVED] = n[_COLLAPSED] !== TRUE && !(_EXPIRES in n) || n[_EXPIRES] > now;
							}
						}
						else {
							// Reset current node and RESOLVED
							n = UNDEFINED;
							o[RESOLVED] = FALSE;
						}
						break;

					case OP_PATH :
						// Get e from r
						x = r[RAW];

						// Set current node
						n = cache[x];

						// Change OP to OP_ID
						o[OP] = OP_ID;

						// Copy properties from r
						o[TEXT] = r[TEXT];
						o[RAW] = x;
						o[RESOLVED] = r[RESOLVED];
						break;
				}
			}

			// After that we want to reduce 'dead' operations from the _AST
			while (l-- > 0) {
				o = ast[l];

				switch(o[OP]) {
					case OP_ID :
						// If the keep flag is set, or the op is not RESOLVED
						if (k || o[RESOLVED] !== TRUE) {
							result.unshift(o);
						}

						// Reset keep flag
						k = FALSE;
						break;

					case OP_PROPERTY :
						result.unshift(o);

						// Set keep flag
						k = TRUE;
						break;
				}
			}

			// Update _AST
			self[_AST] = result;

			return self;
		},

		"ast" : function ast() {
			var self = this;

			// If we're not parsed - parse
			if (!(_AST in self)) {
				self.parse();
			}

			return self[_AST];
		},

		"rewrite" : function rewrite() {
			var self = this;

			// If we're not parsed - parse
			if (!(_AST in self)) {
				self.parse();
			}

			var ast = self[_AST]; // AST
			var result = "";    // Result
			var l;              // Current length
			var i;              // Current index
			var o;              // Current operation

			// Step through AST
			for (i = 0, l = ast[LENGTH]; i < l; i++) {
				o = ast[i];

				switch(o[OP]) {
					case OP_ID :
						// If this is the first OP_ID, there's no need to add OP_QUERY
						result += i === 0
							? o[TEXT]
							: OP_QUERY + o[TEXT];
						break;

					case OP_PROPERTY :
						result += OP_PROPERTY + o[TEXT];
						break;
				}
			}

			return result;
		}
	});
});
/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * apply.js
 * Helper for using arguments-based and variadic callbacks with any
 * {@link Promise} that resolves to an array.
 *
 * @author brian@hovercraftstudios.com
 */

(function(define) {
define('when/apply',[],function() {

    var toString = Object.prototype.toString;

    /**
     * Creates a function that accepts a function that takes individual
     * arguments (it can be variadic, too), and returns a new function that
     * takes a single array as its only param:
     *
     * function argBased(a, b, c) {
     *   return a + b + c;
     * }
     *
     * argBased(1, 2, 3); // 6
     *
     * // Create an array-based version of argBased
     * var arrayBased = apply(argBased);
     * var inputs = [1, 2, 3];
     *
     * arrayBased(inputs); // 6
     *
     * With promises:
     *
     * var d = when.defer();
     * d.promise.then(arrayBased);
     *
     * d.resolve([1, 2, 3]); // arrayBased called with args 1, 2, 3 -> 6
     *
     * @param f {Function} arguments-based function
     *
     * @returns {Function} a new function that accepts an array
     */
    return function(f) {
        /**
         * @param array {Array} must be an array of arguments to use to apply the original function
         *
         * @returns the result of applying f with the arguments in array.
         */
        return function(array) {
            // It better be an array
            if(toString.call(array) != '[object Array]') {
                throw new Error('apply called with non-array arg');
            }

            return f.apply(null, array);
        };
    };

});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);



/**
 * TroopJS data/query/service
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-data/query/service',[ "module", "troopjs-core/component/service", "./component", "troopjs-utils/merge", "when", "when/apply" ], function QueryServiceModule(module, Service, Query, merge, when, apply) {
	/*jshint laxbreak:true */

	var UNDEFINED;
	var ARRAY_PROTO = Array.prototype;
	var ARRAY_SLICE = ARRAY_PROTO.slice;
	var ARRAY_CONCAT = ARRAY_PROTO.concat;
	var ARRAY_PUSH = ARRAY_PROTO.push;
	var LENGTH = "length";
	var BATCHES = "batches";
	var INTERVAL = "interval";
	var CACHE = "cache";
	var QUERIES = "queries";
	var RESOLVED = "resolved";
	var CONFIGURATION = "configuration";
	var RAW = "raw";
	var ID = "id";
	var Q = "q";
	var MODULE_CONFIG = module.config();

	return Service.extend(function QueryService(cache) {
		var self = this;

		if (cache === UNDEFINED) {
			throw new Error("No cache provided");
		}

		self[BATCHES] = [];
		self[CACHE] = cache;

		self.configure(MODULE_CONFIG);
	}, {
		"displayName" : "data/query/service",

		"sig/start" : function start() {
			var self = this;
			var cache = self[CACHE];

			// Set interval (if we don't have one)
			self[INTERVAL] = INTERVAL in self
				? self[INTERVAL]
				: setInterval(function scan() {
				var batches = self[BATCHES];

				// Return fast if there is nothing to do
				if (batches[LENGTH] === 0) {
					return;
				}

				// Reset batches
				self[BATCHES] = [];

				function request() {
					var q = [];
					var i;

					// Iterate batches
					for (i = batches[LENGTH]; i--;) {
						// Add batch[Q] to q
						ARRAY_PUSH.apply(q, batches[i][Q]);
					}

					// Publish ajax
					return self.publish("ajax", merge.call({
						"data": {
							"q": q.join("|")
						}
					}, self[CONFIGURATION]));
				}

				function done(data) {
					var batch;
					var queries;
					var id;
					var i;
					var j;

					// Add all new data to cache
					cache.put(data);

					// Iterate batches
					for (i = batches[LENGTH]; i--;) {
						batch = batches[i];
						queries = batch[QUERIES];
						id = batch[ID];

						// Iterate queries
						for (j = queries[LENGTH]; j--;) {
							// If we have a corresponding ID, fetch from cache
							if (j in id) {
								queries[j] = cache[id[j]];
							}
						}

						// Resolve batch
						batch.resolve(queries);
					}
				}

				function fail() {
					var batch;
					var i;

					// Iterate batches
					for (i = batches[LENGTH]; i--;) {
						batch = batches[i];

						// Reject (with original queries as argument)
						batch.reject(batch[QUERIES]);
					}
				}

				// Request and handle response
				request().then(apply(done), fail);
			}, 200);
		},

		"sig/stop" : function stop() {
			var self = this;

			// Only do this if we have an interval
			if (INTERVAL in self) {
				// Clear interval
				clearInterval(self[INTERVAL]);

				// Reset interval
				delete self[INTERVAL];
			}
		},

		"hub/query" : function hubQuery(/* query, query, query, .., */) {
			var self = this;
			var batches = self[BATCHES];
			var cache = self[CACHE];
			var q = [];
			var id = [];
			var ast;
			var i;
			var j;
			var iMax;
			var queries;
			var query;

			// Create deferred batch
			var deferred = when.defer();
			var resolver = deferred.resolver;

			try {
				// Slice and flatten queries
				queries = ARRAY_CONCAT.apply(ARRAY_PROTO, ARRAY_SLICE.call(arguments));

				// Iterate queries
				for (i = 0, iMax = queries[LENGTH]; i < iMax; i++) {
					// Init Query
					query = Query(queries[i]);

					// Get AST
					ast = query.ast();

					// If we have an ID
					if (ast[LENGTH] > 0) {
						// Store raw ID
						id[i] = ast[0][RAW];
					}

					// Get reduced AST
					ast = query.reduce(cache).ast();

					// Step backwards through AST
					for (j = ast[LENGTH]; j-- > 0;) {
						// If this op is not resolved
						if (!ast[j][RESOLVED]) {
							// Add rewritten (and reduced) query to q
							ARRAY_PUSH.call(q, query.rewrite());
							break;
						}
					}
				}

				// If all queries were fully reduced, we can quick resolve
				if (q[LENGTH] === 0) {
					// Iterate queries
					for (i = 0; i < iMax; i++) {
						// If we have a corresponding ID, fetch from cache
						if (i in id) {
							queries[i] = cache[id[i]];
						}
					}

					// Resolve batch resolver
					resolver.resolve(queries);
				}
				else {
					// Store properties on batch
					resolver[QUERIES] = queries;
					resolver[ID] = id;
					resolver[Q] = q;

					// Add batch to batches
					batches.push(resolver);
				}
			}
			catch (e) {
				resolver.reject(e);
			}

			// Return promise
			return deferred.promise;
		}
	});
});

/**
 * TroopJS data/component/widget
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-data/component/widget',[ "troopjs-browser/component/widget" ], function WidgetModule(Widget) {

	var ARRAY_PUSH = Array.prototype.push;

	return Widget.extend({
		"displayName" : "data/component/widget",

		/**
		 * Issues publish on query topic
		 * @returns {Promise} of query result(s)
		 */
		"query" : function query() {
			var self = this;
			var args = [ "query" ];

			ARRAY_PUSH.apply(args, arguments);

			return self.publish.apply(self, args);
		}
	});
});

define('troopjs-bundle/mini',[
	"./micro",
	"troopjs-data/store/component",
	"troopjs-data/cache/component",
	"troopjs-data/query/service",
	"troopjs-data/component/widget"
]);
/**
 * TroopJS browser/store/adapter/base module
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-browser/store/adapter/base',[ "troopjs-core/component/gadget" ], function BaseAdapterModule(Gadget) {
	var STORAGE = "storage";

	return Gadget.extend({
		"displayName" : "browser/store/adapter/base",

		"set" : function set(key, value) {
			this[STORAGE].setItem(key, JSON.stringify(value));

			return value;
		},

		"get" : function get(key) {
			return JSON.parse(this[STORAGE].getItem(key));
		},

		"remove" : function remove(key) {
			return this[STORAGE].removeItem(key);
		},

		"clear" : function clear() {
			return this[STORAGE].clear();
		}
	});
});
/**
 * TroopJS browser/store/adapter/local module
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-browser/store/adapter/local',[ "./base" ], function LocalAdapterModule(Store) {
	return Store.extend({
		"displayName" : "browser/store/adapter/local",

		"storage" : window.localStorage
	});
});
/**
 * TroopJS browser/store/adapter/session module
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-browser/store/adapter/session',[ "./base" ], function SessionAdapterModule(Store) {
	return Store.extend({
		"displayName" : "browser/store/adapter/session",

		"storage": window.sessionStorage
	});
});

/**
 * TroopJS utils/tr
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-utils/tr',[],function TrModule() {
	/*jshint strict:false */

	var TYPEOF_NUMBER = "number";

	return function tr(callback) {
		var self = this;
		var result = [];
		var i;
		var length = self.length;
		var key;

		// Is this an array? Basically, is length a number, is it 0 or is it greater than 0 and that we have index 0 and index length-1
		if (typeof length === TYPEOF_NUMBER && length === 0 || length > 0 && 0 in self && length - 1 in self) {
			for (i = 0; i < length; i++) {
				result.push(callback.call(self, self[i], i));
			}
		// Otherwise we'll iterate it as an object
		} else if (self){
			for (key in self) {
				result.push(callback.call(self, self[key], key));
			}
		}

		return result;
	};
});
/**
 * TroopJS jquery/action
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 */
/*global define:false */
define('troopjs-jquery/action',[ "jquery", "troopjs-utils/getargs" ], function ActionModule($, getargs) {
	/*jshint strict:false, smarttabs:true, laxbreak:true */

	var UNDEFINED;
	var FALSE = false;
	var NULL = null;
	var SLICE = Array.prototype.slice;
	var ACTION = "action";
	var ORIGINALEVENT = "originalEvent";
	var RE_ACTION = /^([\w\d\s_\-\/]+)(?:\.([\w\.]+))?(?:\((.*)\))?$/;
	var RE_DOT = /\.+/;

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
			? getargs.call(args)
			: [];

		// Iterate argv to determine arg type
		$.each(argv, function argsIterator(i, value) {
			if (value in $data) {
				argv[i] = $data[value];
			}
		});

		$target
			// Trigger exclusive ACTION event
			.trigger($.Event($event, {
				type: ACTION + "!",
				action: name
			}), argv);

		// Since we've translated the event, stop propagation
		$event.stopPropagation();
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

/**
 * TroopJS jquery/resize
 * @license MIT http://troopjs.mit-license.org/ © Mikael Karon mailto:mikael@karon.se
 *
 * Heavy inspiration from https://github.com/cowboy/jquery-resize.git
 */
/*global define:false */
define('troopjs-jquery/resize',[ "jquery" ], function ResizeModule($) {
	/*jshint strict:false, smarttabs:true */

	var NULL = null;
	var RESIZE = "resize";
	var W = "w";
	var H = "h";
	var $ELEMENTS = $([]);
	var INTERVAL = NULL;

	/**
	 * Iterator
	 * @param index
	 * @param self
	 */
	function iterator(index, self) {
		// Get data
		var $data = $.data(self);

		// Get reference to $self
		var $self = $(self);

		// Get previous width and height
		var w = $self.width();
		var h = $self.height();

		// Check if width or height has changed since last check
		if (w !== $data[W] || h !== $data[H]) {
			$self.trigger(RESIZE, [$data[W] = w, $data[H] = h]);
		}
	}

	/**
	 * Internal interval
	 */
	function interval() {
		$ELEMENTS.each(iterator);
	}

	$.event.special[RESIZE] = {
		/**
		 * @param data (Anything) Whatever eventData (optional) was passed in
		 *        when binding the event.
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 * @param eventHandle (Function) The actual function that will be bound
		 *        to the browser’s native event (this is used internally for the
		 *        beforeunload event, you’ll never use it).
		 */
		"setup" : function onResizeSetup(data, namespaces, eventHandle) {
			var self = this;

			// window has a native resize event, exit fast
			if ($.isWindow(self)) {
				return false;
			}

			// Store data
			var $data = $.data(self, RESIZE, {});

			// Get reference to $self
			var $self = $(self);

			// Initialize data
			$data[W] = $self.width();
			$data[H] = $self.height();

			// Add to tracked collection
			$ELEMENTS = $ELEMENTS.add(self);

			// If this is the first element, start interval
			if($ELEMENTS.length === 1) {
				INTERVAL = setInterval(interval, 100);
			}
		},

		/**
		 * @param namespaces (Array) An array of namespaces specified when
		 *        binding the event.
		 */
		"teardown" : function onResizeTeardown(namespaces) {
			var self = this;

			// window has a native resize event, exit fast
			if ($.isWindow(self)) {
				return false;
			}

			// Remove data
			$.removeData(self, RESIZE);

			// Remove from tracked collection
			$ELEMENTS = $ELEMENTS.not(self);

			// If this is the last element, stop interval
			if($ELEMENTS.length === 0 && INTERVAL !== NULL) {
				clearInterval(INTERVAL);
			}
		}
	};
});

define('troopjs-bundle/maxi',[
	"./mini",
	"troopjs-browser/store/adapter/local",
	"troopjs-browser/store/adapter/session",
	"troopjs-utils/filter",
	"troopjs-utils/getargs",
	"troopjs-utils/merge",
	"troopjs-utils/tr",
	"troopjs-utils/unique",
	"troopjs-jquery/action",
	"troopjs-jquery/resize"
]);
