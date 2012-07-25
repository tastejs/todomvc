/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * functional
 * Helper library for working with pure functions in wire and wire plugins
 *
 * NOTE: This lib assumes Function.prototype.bind is available
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function (define) {
define(['when'], function (when) {
"use strict";

	var slice = [].slice;

	/**
	 * Create a partial function
	 * @param f {Function}
	 * @param [args] {*} additional arguments will be bound to the returned partial
	 * @return {Function}
	 */
	function partial(f, args/*...*/) {
		// What we want here is to allow the partial function to be called in
		// any context, by attaching it to an object, or using partialed.call/apply
		// That's why we're not using Function.bind() here.  It has no way to bind
		// arguments but allow the context to default.  In other words, you MUST bind
		// the the context to something with Function.bind().

		// Optimization: return f if no args provided
		if(arguments.length == 1) return f;

		args = slice.call(arguments, 1);

		return function() {
			return f.apply(this, args.concat(slice.call(arguments)));
		}
	}

	/**
	 * Creates a partial function that weaves arguments into returned function
	 * @param f {Function}
	 * @param weaves {Object} sparse array-like object (with length property)
	 *   These weaves are spliced into the run-time arguments.  Each property
	 *   whose is a positive integer describes a point at which to splice
	 *   an argument.
	 * @return {Function}
	 */
	function weave (f, weaves) {
		return function () {
			var length = Math.max(weaves.length || 0, arguments.length, f.length);
			return f.apply(this, injectArgs(weaves, length, arguments));
		}
	}

	/**
	 * @private
	 * @param weaves {Object} sparse array-like object (with length property)
	 * @param length {Number} how long the resulting arguments list should be
	 * @param args {Arguments} run-time arguments
	 * @return {Array} interwoven arguments
	 */
	function injectArgs (weaves, length, args) {
		var woven = [], i;
		args = slice.call(args); // copy
		for (i = 0; i < length; i++) {
			if (i in weaves) {
				woven.push(weaves[i]);
			}
			if (args.length > 0) {
				woven.push(args.shift());
			}
		}
		return woven;
	}

	/**
	 * Compose functions
	 * @param funcs {Array} array of functions to compose
	 * @return {Function} composed function
	 */
	function compose(funcs /*, ...*/) {

		if(arguments.length > 1) funcs = slice.call(arguments);

		return function composed(x) {
			var context = this;
			return funcs.reduce(function(result, f) {
				return f.call(context, result);
			}, x);
		};
	}

	/**
	 * Parses the function composition string, resolving references as needed, and
	 * composes a function from the resolved refs.
	 * @param proxy {Object} wire proxy on which to invoke the final method of the composition
	 * @param composeString {String} function composition string
	 *  of the form: 'transform1 | transform2 | ... | methodOnProxyTarget"
	 * @param wire.resolveRef {Function} function to use is resolving references, returns a promise
	 * @param wire.getProxy {Function} function used to obtain a proxy for a component
	 * @return {Promise} a promise for the composed function
	 */
	compose.parse = function parseCompose(proxy, composeString, wire) {

		var bindSpecs, resolveRef, getProxy;

		if(typeof composeString != 'string') {
			return wire(composeString, function(func) {
				return createProxyInvoker(proxy, func);
			});
		}

		bindSpecs = composeString.split(/\s*\|\s*/);
		resolveRef = wire.resolveRef;
		getProxy = wire.getProxy;

		function createProxyInvoker(proxy, method) {
			return function() {
				return proxy.invoke(method, arguments);
			}
		}

		function createBound(bindSpec) {
			var target, method;

			target = bindSpec.split('.');

			if(target.length > 2) throw new Error('Only 1 "." is allowed in refs: ' + bindSpec);

			if(target.length > 1) {
				method = target[1];
				target = target[0];
				if(!target) {
					return function(target) {
						return target[method].apply(target, slice.call(arguments, 1));
					}
				}
				return when(getProxy(target), function(proxy) {
					return createProxyInvoker(proxy, method);
				});
			} else {
				return when(resolveRef(bindSpec),
					null,
					function() {
						return createProxyInvoker(proxy, bindSpec);
					}
				);
			}

		}

		// First, resolve each transform function, stuffing it into an array
		// The result of this reduce will an array of concrete functions
		// Then add the final context[method] to the array of funcs and
		// return the composition.
		return when.reduce(bindSpecs, function(funcs, bindSpec) {
			return when(createBound(bindSpec), function(func) {
				funcs.push(func);
				return funcs;
			});
		}, []).then(
			function(funcs) {
				var context = proxy && proxy.target;
				return (funcs.length == 1 ? funcs[0] : compose(funcs)).bind(context);
			}
		);
	};

	return {
		compose: compose,
		partial: partial,
		weave: weave
	};

});
})(typeof define == 'function'
	// AMD
	? define
	// CommonJS
	: function(deps, factory) {
		module.exports = factory.apply(this, deps.map(function(x) {
			return require(x);
		}));
	}
);
