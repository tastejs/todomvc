/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * dom plugin helper
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
define(['wire/domReady', 'when', '../dom/base'], function(domReady, when, base) {

	function getElementFactory (resolver, spec, wire) {
		when(wire(spec.element), function (element) {

			if (!element || !element.nodeType || !element.tagName) {
				throw new Error('dom: non-element reference provided to element factory');
			}

			return element;
		}).then(resolver.resolve, resolver.reject);
	}

	return function createDomPlugin(options) {

		var getById, query, first, init, addClass, removeClass, placeAt,
			doById, doPlaceAt, resolveQuery;

		getById = options.byId || base.byId;
		query = options.query || base.querySelectorAll;
		first = options.first || base.querySelector;
		init = options.init;
		addClass = options.addClass;
		placeAt = options.placeAt || base.placeAt;
		removeClass = options.removeClass;

		function doByIdImpl(resolver, name) {
			var node;

			// if dev omitted name, they're looking for the resolver itself
			if (!name) return resolver.resolve(getById);

			node = getById(name);
			if (node) {
				resolver.resolve(node);
			} else {
				resolver.reject(new Error("No DOM node with id: " + name));
			}
		}

		doById = function(resolver, name /*, refObj, wire*/) {
			domReady(function() {
				doById = doByIdImpl;
				doByIdImpl(resolver, name);
			});
		};

		function doQuery(name, refObj, root, queryFunc) {
			var result, i;

			result = queryFunc(name, root);

			// if dev supplied i, try to use it
			if (typeof refObj.i != 'undefined') {
				i = refObj.i;
				if (result[i]) { // do not use `i in result` since IE gives a false positive
					return result[i];
				} else {
					throw new Error("Query '" + name + "' did not find an item at position " + i);
				}
			} else if (queryFunc == first && !result) {
				throw new Error("Query '" + name + "' did not find anything");
			} else {
				return result;
			}
		}

		function doPlaceAtImpl(resolver, facet, wire) {
			var futureRefNode, node, options, operation;

			options = facet.options;
			node = facet.target;

			// get first property and use it as the operation
			for (var p in options) {
				if (options.hasOwnProperty(p)) {
					operation = p;
					break;
				}
			}

			futureRefNode = wire(makeQueryRef(options[operation]));

			when(futureRefNode, function (refNode) {
				return placeAt(node, refNode, operation);
			}).then(resolver.resolve, resolver.reject);
		}

		doPlaceAt = function(resolver, facet, wire) {
			domReady(function() {
				doPlaceAt = doPlaceAtImpl;
				doPlaceAtImpl(resolver, facet, wire);
			});
		};

		function resolveQueryImpl(resolver, name, refObj, wire, queryFunc) {
			var futureRoot;

			if (!queryFunc) queryFunc = query;

			// if dev omitted name, they're looking for the resolver itself
			if (!name) return resolver.resolve(queryFunc);

			// get string ref or object ref
			if (refObj.at && !refObj.isRoot) {
				futureRoot = wire(makeQueryRoot(refObj.at));
			}

			// sizzle will default to document if refObj.at is unspecified
			when(futureRoot, function (root) {
				return doQuery(name, refObj, root, queryFunc);
			}).then(resolver.resolve, resolver.reject);
		}

		/**
		 *
		 * @param resolver {Resolver} resolver to notify when the ref has been resolved
		 * @param name {String} the dom query
		 * @param refObj {Object} the full reference object, including options
		 * @param wire {Function} wire()
		 * @param [queryFunc] {Function} the function to use to query the dom
		 */
		resolveQuery = function(resolver, name, refObj, wire, queryFunc) {

			domReady(function() {
				resolveQuery = resolveQueryImpl;
				resolveQueryImpl(resolver, name, refObj, wire, queryFunc);
			});

		};

		/**
		 * dom.first! resolver.
		 *
		 * @param resolver {Resolver} resolver to notify when the ref has been resolved
		 * @param name {String} the dom query
		 * @param refObj {Object} the full reference object, including options
		 * @param wire {Function} wire()
		 */
		function resolveFirst(resolver, name, refObj, wire) {
			resolveQuery(resolver, name, refObj, wire, first);
		}

		function makeQueryRoot(ref) {

			var root = makeQueryRef(ref);

			if(root) {
				root.isRoot = true;
			}

			return root;
		}

		function makeQueryRef(ref) {
			return typeof ref == 'string' ? { $ref: ref } : ref;
		}

		function createResolver(resolverFunc, options) {
			return function(resolver, name, refObj, wire) {
				if(!refObj.at) {
					refObj.at = options.at;
				} else {
					refObj.at = makeQueryRoot(refObj.at);
				}

				return resolverFunc(resolver, name, refObj, wire);
			}
		}

		function handleClasses(node, add, remove) {
			if(add) addClass(node, add);
			if(remove) removeClass(node, remove);
		}

		return {
			wire$plugin: function(ready, destroyed, options) {
				var classes, resolvers, facets, factories;

				options.at = makeQueryRoot(options.at);

				if (init) init(ready, destroyed, options);

				classes = options.classes;

				// Add/remove lifecycle classes if specified
				if (classes) {
					domReady(function () {
						var node = document.getElementsByTagName('html')[0];

						// Add classes for wiring start
						handleClasses(node, classes.init);

						// Add/remove classes for context ready
						ready.then(function () {
							handleClasses(node, classes.ready, classes.init);
						});

						if (classes.ready) {
							// Remove classes for context destroyed
							destroyed.then(function () {
								handleClasses(node, null, classes.ready);
							});
						}
					});
				}

				resolvers = {
					'dom': doById
				};

				facets = {
					'insert': {
						initialize: doPlaceAt
					}
				};

				factories = {
					'element': getElementFactory
				};

				if (query) {
					resolvers['dom.first'] = createResolver(resolveFirst, options);

					// dom.all and dom.query are synonyms
					resolvers['dom.all']
						= resolvers['dom.query'] = createResolver(resolveQuery, options);
				}

				return {
					resolvers: resolvers,
					facets: facets,
					factories: factories,
					proxies: [
						// this allows base.nodeProxy to be overridden
						function (node) { return base.nodeProxy(node); }
					]
				};

			}
		};
	}
});
