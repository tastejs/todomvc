/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * dom plugin helper
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
define(['wire/domReady', 'when', '../dom/base', '../object'], function(domReady, when, base, object) {

	function getElementFactory (resolver, componentDef, wire) {
		when(wire(componentDef.options), function (element) {

			if (!element || !element.nodeType || !element.tagName) {
				throw new Error('dom: non-element reference provided to element factory');
			}

			return element;
		}).then(resolver.resolve, resolver.reject);
	}

	return function createDomPlugin(options) {

		var getById, query, first, addClass, removeClass, placeAt,
			doById, doPlaceAt, resolveQuery;

		getById = options.byId || base.byId;
		query = options.query || base.querySelectorAll;
		first = options.first || base.querySelector;
		addClass = options.addClass;
		placeAt = options.placeAt || base.placeAt;
		removeClass = options.removeClass;

		function doByIdImpl(resolver, name) {
			var node;

			// if dev omitted name, they're looking for the resolver itself
			if (!name) {
				return resolver.resolve(getById);
			}

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
				if (object.hasOwn(options, p)) {
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

			if (!queryFunc) {
				queryFunc = query;
			}

			// if dev omitted name, they're looking for the resolver itself
			if (!name) {
				return resolver.resolve(queryFunc);
			}

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
			};
		}

		function handleClasses(node, add, remove) {
			if(add) {
				addClass(node, add);
			}

			if(remove) {
				removeClass(node, remove);
			}
		}

		/**
		 * DOM plugin factory
		 */
		return function(options) {
			var classes, resolvers, facets, factories, context, htmlElement;

			options.at = makeQueryRoot(options.at);
			classes = options.classes;
			context = {};

			if(classes) {
				domReady(function() {
					htmlElement = document.getElementsByTagName('html')[0];
				});

				context.initialize = function (resolver) {
					domReady(function () {
						handleClasses(htmlElement, classes.init);
						resolver.resolve();
					});
				};
				context.ready = function (resolver) {
					domReady(function () {
						handleClasses(htmlElement, classes.ready, classes.init);
						resolver.resolve();
					});
				};
				if(classes.ready) {
					context.destroy = function (resolver) {
						domReady(function () {
							handleClasses(htmlElement, null, classes.ready);
							resolver.resolve();
						});
					};
				}
			}

			factories = {
				element: getElementFactory
			};

			facets = {
				insert: {
					initialize: doPlaceAt
				}
			};

			resolvers = {};
			// id and dom are synonyms
			// dom is deprecated and for backward compat only
			resolvers.id = resolvers.dom = doById;

			if (query) {
				// dom.first is deprecated
				resolvers.first = createResolver(resolveFirst, options);
				resolvers['dom.first'] = function() {
					// TODO: Deprecation warning
					resolvers.first.apply(resolvers, arguments);
				};

				// all and query are synonyms
				resolvers.all = resolvers.query = createResolver(resolveQuery, options);
				resolvers['dom.all'] = resolvers['dom.query'] = function() {
					// TODO: Deprecation warning
					resolvers.query.apply(resolvers, arguments);
				};
			}

			return {
				context: context,
				resolvers: resolvers,
				facets: facets,
				factories: factories,
				proxies: [
					base.proxyNode
				]
			};

		};
	};
});
