/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/base plugin
 * Base wire plugin that provides properties, init, and destroy facets, and
 * a proxy for plain JS objects.
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define) {
define(['when', './lib/object', './lib/functional', './lib/component'], function(when, object, functional, createComponent) {

	var whenAll, chain, obj, undef;

	whenAll = when.all;
	chain = when.chain;

	obj = {};

	function asArray(it) {
		return Array.isArray(it) ? it : [it];
	}

	function invoke(func, proxy, args, wire) {
        return when(wire(args, func, proxy.path),
			function (resolvedArgs) {
				return proxy.invoke(func, asArray(resolvedArgs));
			}
		);
	}

	function invokeAll(facet, wire) {
		var options = facet.options;

		if(typeof options == 'string') {
			return invoke(options, facet, [], wire);

		} else {
			var promises, funcName;
			promises = [];

			for(funcName in options) {
				promises.push(invoke(funcName, facet, options[funcName], wire));
			}

			return whenAll(promises);
		}
	}

	//
	// Mixins
	//

	function mixin(target, src) {
		var name, s;

		for(name in src) {
			s = src[name];
			if(!(name in target) || (target[name] !== s && (!(name in obj) || obj[name] !== s))) {
				target[name] = s;
			}
		}

		return target;
	}

	function doMixin(target, introduction, wire) {
		introduction = typeof introduction == 'string'
			? wire.resolveRef(introduction)
			: wire(introduction);

		return when(introduction, mixin.bind(null, target));
	}

	function mixinFacet(resolver, facet, wire) {
		var target, intros;

		target = facet.target;
		intros = facet.options;

		if(!Array.isArray(intros)) intros = [intros];

		chain(when.reduce(intros, function(target, intro) {
			return doMixin(target, intro, wire);
		}, target), resolver);
	}

    /**
     * Factory that handles cases where you need to create an object literal
     * that has a property whose name would trigger another wire factory.
     * For example, if you need an object literal with a property named "create",
     * which would normally cause wire to try to construct an instance using
     * a constructor or other function, and will probably result in an error,
     * or an unexpected result:
     * myObject: {
     *      create: "foo"
     *    ...
     * }
     *
     * You can use the literal factory to force creation of an object literal:
     * myObject: {
     *    literal: {
     *      create: "foo"
     *    }
     * }
     *
     * which will result in myObject.create == "foo" rather than attempting
     * to create an instance of an AMD module whose id is "foo".
     */
	function literalFactory(resolver, spec /*, wire */) {
		resolver.resolve(spec.literal);
	}

	/**
	 * @deprecated Use create (instanceFactory) instead
	 * @param resolver
	 * @param spec
	 * @param wire
	 */
	function protoFactory(resolver, spec, wire) {
		var parentRef, promise;

        parentRef = spec.prototype;

        promise = typeof parentRef === 'string'
                ? wire.resolveRef(parentRef)
                : wire(parentRef);

        when(promise, Object.create)
			.then(resolver.resolve, resolver.reject);
	}

	function propertiesFacet(resolver, facet, wire) {

		when.reduce(Object.keys(facet.options), function(properties, key) {
			return wire(properties[key], key, facet.path).then(
				function(wiredProperty) {
					facet.set(key, wiredProperty);
					return properties;
				}
			);
		}, facet.options).then(resolver.resolve, resolver.reject);

	}

	function invokerFacet(resolver, facet, wire) {
		chain(invokeAll(facet, wire), resolver);
	}

	function pojoProxy(object /*, spec */) {
		return {
			get: function(property) {
				return object[property];
			},
			set: function(property, value) {
				object[property] = value;
				return value;
			},
			invoke: function(method, args) {
				if(typeof method === 'string') {
					method = object[method];
				}

				return method.apply(object, args);
			},
			destroy: function() {},
			clone: function(options) {
				// don't try to clone a primitive
				if (typeof object != 'object') return object;
				// cloneThing doesn't clone functions (methods), so clone here:
				else if (typeof object == 'function') return object.bind();
				if (!options) options = {};
				return cloneThing(object, options);
			}
		};
	}

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
				if (inherited || thing.hasOwnProperty(prop)) {
					clone[prop] = deep
						? cloneThing(thing[prop], options)
						: thing[prop];
				}
			}
			return clone;
		}
	}

    //noinspection JSUnusedLocalSymbols
    /**
     * Wrapper for use with when.reduce that calls the supplied destroyFunc
     * @param [unused]
     * @param destroyFunc {Function} destroy function to call
     */
    function destroyReducer(unused, destroyFunc) {
        return destroyFunc();
    }

	function moduleFactory(resolver, spec, wire) {
		chain(wire.loadModule(spec.module, spec), resolver);
	}

	function cloneFactory(resolver, spec, wire) {
		var sourceRef, options;

		if (wire.resolver.isRef(spec.clone.source)) {
			sourceRef = spec.clone.source;
			options = spec.clone;
		}
		else {
			sourceRef = spec.clone;
			options = {};
		}

		when(wire(sourceRef), function (ref) {
			return when(wire.getProxy(ref), function (proxy) {
				if (!proxy.clone) throw new Error('No clone function found for ' + spec.id);
				return proxy.clone(options);
			});
		}).then(resolver.resolve, resolver.reject);
	}

	/**
	 * Factory that uses an AMD module either directly, or as a
	 * constructor or plain function to create the resulting item.
	 *
	 * @param resolver {Resolver} resolver to resolve with the created component
	 * @param spec {Object} portion of the spec for the component to be created
	 */
	function instanceFactory(resolver, spec, wire) {
		var create, args, isConstructor, name, promise;

		name = spec.id;
		create = spec.create;

		if (typeof create == 'string') {
			promise = wire.loadModule(create, spec);
		} else if(wire.resolver.isRef(create)) {
			promise = wire(create);
		} else {
			promise = wire(create);
			args = create.args;
			isConstructor = create.isConstructor;
		}

		chain(when(promise, handleModule), resolver);

		// Load the module, and use it to create the object
		function handleModule(module) {
			function resolve(resolvedArgs) {
				return createComponent(module, resolvedArgs, isConstructor);
			}

			// We'll either use the module directly, or we need
			// to instantiate/invoke it.
			if (typeof module == 'function') {
				// Instantiate or invoke it and use the result
				return args
					? when(wire(asArray(args)), resolve)
					: resolve([]);

			} else {
				// Simply use the module as is
				return Object.create(module);
			}
		}
	}

	function composeFactory(resolver, spec, wire) {
		var promise;

		spec = spec.compose;

		if(typeof spec == 'string') {
			promise = functional.compose.parse(undef, spec, wire);
		} else {
			// Assume it's an array of things that will wire to functions
			promise = when(wire(spec), function(funcArray) {
				return functional.compose(funcArray);
			});
		}

		when.chain(promise, resolver);
	}

	return {
		wire$plugin: function(ready, destroyed /*, options */) {
            // Components in the current context that will be destroyed
            // when this context is destroyed
			var destroyFuncs, plugin;

			destroyFuncs = [];

			when(destroyed, function() {
                return when.reduce(destroyFuncs, destroyReducer, 0);
			});

			function destroyFacet(resolver, facet, wire) {
				destroyFuncs.push(function destroyObject() {
					return invokeAll(facet, wire);
				});

				// This resolver is just related to *collecting* the functions to
				// invoke when the component is destroyed.
				resolver.resolve();
			}

			plugin = {
				factories: {
					module: moduleFactory,
					create: instanceFactory,
					literal: literalFactory,
					prototype: protoFactory,
					clone: cloneFactory,
					compose: composeFactory
				},
				facets: {
					// properties facet.  Sets properties on components
					// after creation.
					properties: {
						configure: propertiesFacet
					},
					mixin: {
						configure: mixinFacet
					},
					// init facet.  Invokes methods on components during
					// the "init" stage.
					init: {
						initialize: invokerFacet
					},
					// ready facet.  Invokes methods on components during
					// the "ready" stage.
					ready: {
						ready: invokerFacet
					},
					// destroy facet.  Registers methods to be invoked
					// on components when the enclosing context is destroyed
					destroy: {
						ready: destroyFacet
					}
				},
				proxies: [
					pojoProxy
				]
			};

			// "introduce" is deprecated, but preserved here for now.
			plugin.facets.introduce = plugin.facets.mixin;

			return plugin;
		}
	};
});
})(typeof define == 'function'
	? define
	: function(deps, factory) {
		module.exports = factory.apply(this, deps.map(function(x) {
			return require(x);
		}));
	}
);
