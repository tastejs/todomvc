/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function(require) {

	var object, array;

	object = require('./object');
	array = require('./array');

	/**
	 * A base proxy for all components that wire creates.  It allows wire's
	 * internals and plugins to work with components using a standard interface.
	 * WireProxy instances may be extended to specialize the behavior of the
	 * interface for a particular type of component.  For example, there is a
	 * specialized version for DOM Nodes.
	 * @param {*} target value to be proxied
	 * @constructor
	 */
	function WireProxy(target) {
		// read-only target
		Object.defineProperty(this, 'target', { value: target });
	}

	WireProxy.prototype = {
		/**
		 * Get the value of the named property. Sub-types should
		 * override to get properties from their targets in whatever
		 * specialized way is necessary.
		 * @param {string} property
		 * @returns {*} the value or undefined
		 */
		get: function (property) {
			return this.target[property];
		},

		/**
		 * Set the value of the named property. Sub-types should
		 * override to set properties on their targets in whatever
		 * specialized way is necessary.
		 * @param {string} property
		 * @param {*} value
		 * @returns {*}
		 */
		set: function (property, value) {
			this.target[property] = value;
			return value;
		},

		/**
		 * Invoke the method, with the supplied args, on the proxy's
		 * target. Sub-types should override to invoke methods their
		 * targets in whatever specialized way is necessary.
		 * @param {string|function} method name of method to invoke or
		 *  a function to call using proxy's target as the thisArg
		 * @param {array} args arguments to pass to method
		 * @returns {*} the method's return value
		 */
		invoke: function (method, args) {
			var target = this.target;

			if (typeof method === 'string') {
				method = target[method];
			}

			return method.apply(target, array.fromArguments(args));
		},

		/**
		 * Destroy the proxy's target.  Sub-types should override
		 * to destroy their targets in whatever specialized way is
		 * necessary.
		 */
		destroy: function() {},

		/**
		 * Attempt to clone this proxy's target. Sub-types should
		 * override to clone their targets in whatever specialized
		 * way is necessary.
		 * @param {object|array|function} thing thing to clone
		 * @param {object} options
		 * @param {boolean} options.deep if true and thing is an Array, try to deep clone its contents
		 * @param {boolean} options.inherited if true and thing is an object, clone inherited and own properties.
		 * @returns {*}
		 */
		clone: function (options) {
			// don't try to clone a primitive
			var target = this.target;

			if (typeof target == 'function') {
				// cloneThing doesn't clone functions, so clone here:
				return target.bind();
			} else if (typeof target != 'object') {
				return target;
			}

			return cloneThing(target, options || {});
		}
	};

	WireProxy.create = createProxy;
	WireProxy.isProxy = isProxy;
	WireProxy.getTarget = getTarget;
	WireProxy.extend = extendProxy;

	return WireProxy;

	/**
	 * Creates a new WireProxy for the supplied target. See WireProxy
	 * @param {*} target value to be proxied
	 * @returns {WireProxy}
	 */
	function createProxy(target) {
		return new WireProxy(target);
	}

	/**
	 * Returns a new WireProxy, whose prototype is proxy, with extensions
	 * as own properties.  This is the "official" way to extend the functionality
	 * of an existing WireProxy.
	 * @param {WireProxy} proxy proxy to extend
	 * @param extensions
	 * @returns {*}
	 */
	function extendProxy(proxy, extensions) {
		if(!isProxy(proxy)) {
			throw new Error('Cannot extend non-WireProxy');
		}

		return object.mixin(Object.create(proxy), extensions);
	}

	/**
	 * Returns true if it is a WireProxy
	 * @param {*} it
	 * @returns {boolean}
	 */
	function isProxy(it) {
		return it instanceof WireProxy;
	}

	/**
	 * If it is a WireProxy (see isProxy), returns it's target.  Otherwise,
	 * returns it;
	 * @param {*} it
	 * @returns {*}
	 */
	function getTarget(it) {
		return isProxy(it) ? it.target : it;
	}

	/**
	 * Try to clone thing, which can be an object, Array, or Function
	 * @param {object|array|function} thing thing to clone
	 * @param {object} options
	 * @param {boolean} options.deep if true and thing is an Array, try to deep clone its contents
	 * @param {boolean} options.inherited if true and thing is an object, clone inherited and own properties.
	 * @returns {array|object|function} cloned thing
	 */
	function cloneThing (thing, options) {
		var deep, inherited, clone, prop;
		deep = options.deep;
		inherited = options.inherited;

		// Note: this filters out primitive properties and methods
		if (typeof thing != 'object') {
			return thing;
		}
		else if (thing instanceof Date) {
			return new Date(thing.getTime());
		}
		else if (thing instanceof RegExp) {
			return new RegExp(thing);
		}
		else if (Array.isArray(thing)) {
			return deep
				? thing.map(function (i) { return cloneThing(i, options); })
				: thing.slice();
		}
		else {
			clone = thing.constructor ? new thing.constructor() : {};
			for (prop in thing) {
				if (inherited || object.hasOwn(thing, prop)) {
					clone[prop] = deep
						? cloneThing(thing[prop], options)
						: thing[prop];
				}
			}
			return clone;
		}
	}

});
})(typeof define == 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }
);