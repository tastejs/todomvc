/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Plugin that allows wire to be used as a plugin within a wire spec
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define) {
define(function(require) {

	var when, object;

	when = require('when');
	object = require('../object');

	return function(/* options */) {

		var ready = when.defer();

		return {
			context: {
				ready: function(resolver) {
					ready.resolve();
					resolver.resolve();
				}
			},
			resolvers: {
				wire: wireResolver
			},
			factories: {
				wire: wireFactory
			}
		};

		/**
		 * Factory that creates either a child context, or a *function* that will create
		 * that child context.  In the case that a child is created, this factory returns
		 * a promise that will resolve when the child has completed wiring.
		 *
		 * @param {Object} resolver used to resolve with the created component
		 * @param {Object} componentDef component spec for the component to be created
		 * @param {function} wire scoped wire function
		 */
		function wireFactory(resolver, componentDef, wire) {
			var options, module, provide, defer, waitParent, result;

			options = componentDef.options;

			// Get child spec and options
			if(object.isObject(options) && 'spec' in options) {
				module = options.spec;
				waitParent = options.waitParent;
				defer = options.defer;
				provide = options.provide;
			} else {
				module = options;
			}

			function init(context) {
				var initialized;

				if(provide) {
					initialized = when(wire(provide), function(provides) {
						object.mixin(context.instances, provides);
					});
				}

				return initialized;
			}

			function createChild(/** {Object|String}? */ mixin) {
				var spec, config;

				spec = mixin ? [].concat(module, mixin) : module;
				config = { initializers: [init] };

				var child = wire.createChild(spec, config);
				return defer ? child
					: when(child, function(child) {
					return object.hasOwn(child, '$exports') ? child.$exports : child;
				});
			}

			if (defer) {
				// Resolve with the createChild *function* itself
				// which can be used later to wire the spec
				result = createChild;

			} else if(waitParent) {

				var childPromise = when(ready.promise, function() {
					// ensure nothing is passed to createChild here
					return createChild();
				});

				result = wrapChild(childPromise);

			} else {
				result = createChild(componentDef.spec);
			}

			resolver.resolve(result);
		}
	};

	function wrapChild(promise) {
		return { promise: promise };
	}

	/**
	 * Builtin reference resolver that resolves to the context-specific
	 * wire function.
	 */
	function wireResolver(resolver, _, __, wire) {
		resolver.resolve(wire.createChild);
	}

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
