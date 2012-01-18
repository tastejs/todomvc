/**
 * @license Copyright (c) 2010-2011 Brian Cavalier
 * LICENSE: see the LICENSE.txt file. If file is missing, this file is subject
 * to the MIT License at: http://www.opensource.org/licenses/mit-license.php.
 */

/**
 * Base wire plugin that provides properties, init, and destroy facets, and
 * a proxy for plain JS objects.
 */
(function(define) {
define(['when'], function(when) {
    var tos, createObject, whenAll, chain;

    tos = Object.prototype.toString;

    whenAll = when.all;
    chain = when.chain;
    
	// In case Object.create isn't available
	function T() {}

	function objectCreate(prototype) {
		T.prototype = prototype;
		return new T();
	}

	createObject = Object.create || objectCreate;

    function invoke(func, target, args, wire) {
        var f;

        f = target[func];

        return typeof f == 'function'
            ? when(wire(args),
                function (resolvedArgs) {
                    return f.apply(target, (tos.call(resolvedArgs) == '[object Array]')
                        ? resolvedArgs
                        : [resolvedArgs]);
                })
            : f;
    }

    function invokeAll(facet, wire) {
		var target, options;

		target  = facet.target;
		options = facet.options;

		if(typeof options == 'string') {
			return invoke(options, target, [], wire);

		} else {
			var promises, func;
			promises = [];

			for(func in options) {
				promises.push(invoke(func, target, options[func], wire));
			}

			return whenAll(promises);
		}
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

	function protoFactory(resolver, spec, wire) {
		var parentRef, promise;
        
        parentRef = spec.prototype;
        
        promise = typeof parentRef === 'string'
                ? wire.resolveRef(parentRef)
                : wire(parentRef);
        
        when(promise,
			function(parent) {
				var child = createObject(parent);
				resolver.resolve(child);
			},
            resolver.reject
		);
	}

	function propertiesFacet(resolver, facet, wire) {
		var options, promises, prop;
		promises = [];
		options = facet.options;

		for(prop in options) {
			promises.push(setProperty(facet, prop, options[prop], wire));
		}

        whenAll(promises, resolver.resolve, resolver.reject);
	}

	function setProperty(proxy, name, val, wire) {
        return when(wire(val, name, proxy.path),
            function(resolvedValue) {
			    proxy.set(name, resolvedValue);
		    }
        );
	}

	function initFacet(resolver, facet, wire) {
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
			destroy: function() {}
		};
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

	return {
		wire$plugin: function(ready, destroyed /*, options */) {
            // Components in the current context that will be destroyed
            // when this context is destroyed
			var destroyFuncs = [];

			when(destroyed, function() {
                when.reduce(destroyFuncs, destroyReducer, {});
			});

			function destroyFacet(resolver, facet, wire) {
				var target, options, w;

				target = facet.target;
				options = facet.options;
				w = wire;

				destroyFuncs.push(function destroyObject() {
					return invokeAll({ options: options, target: target }, w);
				});

                // This resolver is just related to *collecting* the functions to
                // invoke when the component is destroyed.
				resolver.resolve();
			}

			return {
				factories: {
					literal: literalFactory,
					prototype: protoFactory
				},
				facets: {
					// properties facet.  Sets properties on components
					// after creation.
					properties: {
						configure: propertiesFacet
					},
					// init facet.  Invokes methods on components after
					// they have been configured
					init: {
						initialize: initFacet
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
		}
	};
});
})(typeof define != 'undefined'
	// use define for AMD if available
	? define
	// If no define or module, attach to current context.
	: function(deps, factory) { this.wire_base = factory(this.when); }
);
