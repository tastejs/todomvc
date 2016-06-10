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
 * Note: this shim doesn't do anything special with IE8's minimally useful
 * Object.defineProperty(domNode).
 *
 * The poly/strict module will set failIfShimmed to fail for some shims.
 * See the documentation for more information.
 *
 * IE missing enum properties fixes copied from kangax:
 * https://github.com/kangax/protolicious/blob/master/experimental/object.for_in.js
 *
 * TODO: fix Object#propertyIsEnumerable for IE's non-enumerable props to match Object.keys()
 */
define(['./lib/_base'], function (base) {
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
		'object-defineproperty': 'defineProperty',
		'object-defineproperties': 'defineProperties',
		'object-isextensible': 'isExtensible',
		'object-preventextensions': 'preventExtensions',
		'object-getownpropertydescriptor': 'getOwnPropertyDescriptor'
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
		return prop in refObj;
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
