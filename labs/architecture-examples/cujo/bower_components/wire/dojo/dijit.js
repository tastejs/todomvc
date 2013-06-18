/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/dojo/dijit plugin
 * wire plugin that provides a reference resolver for dijits declared using
 * dojoType/data-dojo-type, a setter that can set dojo 1.6+ set(name, value)
 * style properties, a wire$init() function that invokes the dojo parser,
 * and an object lifecycle handler that will cleanup (e.g. destroyRecursive,
 * or destroy) dijits instantiated "programmatically" in a wiring context.
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

define(['dojo', 'dojo/parser', 'dijit', 'dijit/_Widget', '../lib/WireProxy'], function(dojo, parser, dijit, Widget, WireProxy) {
    var parsed, isArray, loadTheme, placeAtFacet, pluginInstance;

    parsed = false;

    isArray = dojo.isArray;

    /**
     * Resolver for dijits by id.  Uses dijit.byId
     * @param name dijit id to resolve
     */
    function dijitById(promise, name /*, refObj, wire */) {
        dojo.ready(
            function() {
                var resolved = dijit.byId(name);

                if (resolved) {
                    promise.resolve(resolved);
                } else {
                    throw new Error("No dijit with id: " + name);
                }
            }
        );
    }

    function isDijit(it) {
        // NOTE: It is possible to create inheritance hierarchies with dojo.declare
        // where the following evaluates to false *even though* dijit._Widget is
        // most certainly an ancestor of it.
        // So, may need to modify this test if that seems to happen in practice.
        return it instanceof Widget;
    }

	var dijitProxy = {
		get: function(name) {
			return this.target.get(name);
		},
		set: function(name, val) {
			return this.target.set(name, val);
		},
		destroy: function() {
			return destroyDijit(this.target);
		},
		clone: function() {
			return dojo.clone(this.target);
		}
	};

    function proxyDijit(proxy) {
        if (isDijit(proxy.target)) {
			return WireProxy.extend(proxy, dijitProxy);
        }
    }

    function destroyDijit(target) {
        // Prefer destroyRecursive over destroy
        if (typeof target.destroyRecursive == 'function') {
            target.destroyRecursive(false);
        } else if (typeof target.destroy == 'function') {
            target.destroy(false);
        }
    }

    loadTheme = function(theme) {
        // Clobber loadTheme so we only do it once?
        loadTheme = function() {};

        // Rely on the AMD css! plugin for now
        require(['css!' + 'dijit/themes/' + theme + '/' + theme + '.css']);
        dojo.addClass(dojo.body(), theme);
    };

    placeAtFacet = {
        /**
         * Provides a placeAt feature for dijits in the wire spec.
         * Usage:
         *      {
         *          create: //create a dijit
         *          placeAt: { $ref: 'dom!targetNode }
         *      }
         * @param resolver
         * @param proxy
         * @param wire
         */
        initialize: function(resolver, proxy, wire) {
            var dijit, nodeRef;

            dijit = proxy.target;
            nodeRef = proxy.options;

            if (isDijit(dijit)) {
                wire(nodeRef).then(
                    function(args) {
                        dijit.placeAt.apply(dijit, isArray(args) ? args : [args]);
                        resolver.resolve();
                    },
                    function(e) {
                        resolver.reject(e);
                    }
                );
            } else {
                resolver.reject("Not a dijit: " + proxy.path);
            }
        }
    };

	pluginInstance = {
		resolvers:{
			dijit:dijitById
		},
		proxies:[
			proxyDijit
		],
		facets: {
			placeAt: placeAtFacet
		}
	};

    return {
        wire$plugin:function(options) {
            // Only ever parse the page once, even if other child
            // contexts are created with this plugin present.
            if (options.parse && !parsed) {
                parsed = true;
                dojo.ready(function() {
                    parser.parse();
                });
            }

            var theme = options.theme;

            if (theme) loadTheme(theme);

            // Return plugin
            return pluginInstance;
        }
    };
});