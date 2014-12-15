/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Base wire plugin that provides properties, init, and destroy facets, and
 * a proxy for plain JS objects.
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define) { 'use strict';
define(function(require) {

	var when, object, functional, instantiate, createInvoker,
		whenAll, obj, pluginInstance, undef;

	when = require('when');
	object = require('../object');
	functional = require('../functional');
	instantiate = require('../instantiate');
	createInvoker = require('../invoker');

	whenAll = when.all;

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

		if(!Array.isArray(intros)) {
			intros = [intros];
		}

		resolver.resolve(when.reduce(intros, function(target, intro) {
			return doMixin(target, intro, wire);
		}, target));
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
		resolver.resolve(spec.options);
	}

	/**
	 * @deprecated Use create (instanceFactory) instead
	 * @param resolver
	 * @param componentDef
	 * @param wire
	 */
	function protoFactory(resolver, componentDef, wire) {
		var parentRef, promise;

        parentRef = componentDef.options;

        promise = typeof parentRef === 'string'
                ? wire.resolveRef(parentRef)
                : wire(parentRef);

		resolver.resolve(promise.then(Object.create));
	}

	function propertiesFacet(resolver, facet, wire) {

		var properties, path, setProperty, propertiesSet;

		properties = facet.options;
		path = facet.path;
		setProperty = facet.set.bind(facet);

		propertiesSet = when.map(Object.keys(facet.options), function(key) {
			return wire(properties[key], facet.path)
				.then(function(wiredProperty) {
					setProperty(key, wiredProperty);
				}
			);
		});

		resolver.resolve(propertiesSet);
	}

	function invokerFactory(resolver, componentDef, wire) {

		var invoker = wire(componentDef.options).then(function (invokerContext) {
			// It'd be nice to use wire.getProxy() then proxy.invoke()
			// here, but that means the invoker must always return
			// a promise.  Not sure that's best, so for now, just
			// call the method directly
			return createInvoker(invokerContext.method, invokerContext.args);
		});

		resolver.resolve(invoker);
	}

	function invokerFacet(resolver, facet, wire) {
		resolver.resolve(invokeAll(facet, wire));
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

	function cloneFactory(resolver, componentDef, wire) {
		var sourceRef, options, cloned;

		if (wire.resolver.isRef(componentDef.options.source)) {
			sourceRef = componentDef.options.source;
			options = componentDef.options;
		}
		else {
			sourceRef = componentDef.options;
			options = {};
		}

		cloned = wire(sourceRef).then(function (ref) {
			return when(wire.getProxy(ref), function (proxy) {
				if (!proxy.clone) {
					throw new Error('No clone function found for ' + componentDef.id);
				}

				return proxy.clone(options);
			});
		});

		resolver.resolve(cloned);
	}

	function moduleFactory(resolver, componentDef, wire) {
		resolver.resolve(wire.loadModule(componentDef.options));
	}

	/**
	 * Factory that uses an AMD module either directly, or as a
	 * constructor or plain function to create the resulting item.
	 *
	 * @param {Object} resolver resolver to resolve with the created component
	 * @param {Object} componentDef portion of the spec for the component to be created
	 * @param {function} wire
	 */
	function instanceFactory(resolver, componentDef, wire) {
		var create, args, isConstructor, module, instance;

		create = componentDef.options;

		if (typeof create == 'string') {
			module = wire.loadModule(create);
		} else if(wire.resolver.isRef(create)) {
			module = wire(create);
		} else if(object.isObject(create) && create.module) {
			module = wire.loadModule(create.module);
			args = create.args ? wire(asArray(create.args)) : [];
			isConstructor = create.isConstructor;
		} else {
			module = create;
		}

		instance = when.join(module, args).spread(createInstance);

		resolver.resolve(instance);

		// Load the module, and use it to create the object
		function createInstance(module, args) {
			// We'll either use the module directly, or we need
			// to instantiate/invoke it.
			return typeof module == 'function'
				? instantiate(module, args, isConstructor)
				: Object.create(module);
		}
	}

	function composeFactory(resolver, componentDef, wire) {
		var options, promise;

		options = componentDef.options;

		if(typeof options == 'string') {
			promise = functional.compose.parse(undef, options, wire);
		} else {
			// Assume it's an array of things that will wire to functions
			promise = when(wire(options), function(funcArray) {
				return functional.compose(funcArray);
			});
		}

		resolver.resolve(promise);
	}

	pluginInstance = {
		factories: {
			module: moduleFactory,
			create: instanceFactory,
			literal: literalFactory,
			prototype: protoFactory,
			clone: cloneFactory,
			compose: composeFactory,
			invoker: invokerFactory
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
				destroy: invokerFacet
			}
		}
	};

	// "introduce" is deprecated, but preserved here for now.
	pluginInstance.facets.introduce = pluginInstance.facets.mixin;

	return function(/* options */) {
		return pluginInstance;
	};
});
})(typeof define == 'function'
	? define
	: function(factory) { module.exports = factory(require); }
);
