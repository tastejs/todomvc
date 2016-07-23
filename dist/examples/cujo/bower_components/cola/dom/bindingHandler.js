(function (define) {
define(function (require) {
"use strict";

	var slice, guess, form;

	slice = Array.prototype.slice;
	guess = require('./guess');
	form = require('./form');

	defaultNodeHandler.inverse = defaultInverseNodeHandler;

	/*
	TODO: inverse bind handler:
	V create "on!" wire reference resolver
	2. look for inverse property in spec that acts as an each.inverse
	3. look for inverse on "each" handler
	4. provide an inverse function for our defaultNodeHandler
	5. use guess.js to guess events
	 */

	/*
	bind: {
		to: { $ref: 'colaThing' },
		map: {
			prop1: [
				{ selector: 'input.my' , attr: 'value' },
				{ selector: 'a selector', handler: { $ref: 'someFunction' } },
				{ selector: '.selector', attr: 'text', handler: { $ref: 'aNodeHandlerFunction' } }
				{
					selector: '.many',
					attr: 'text',
					each: { $ref: 'aNodeHandlerFunction' },
					all: { $ref: 'aNodeListHandlerFunction' }
				}
			]
		}
	}

	function aNodeHandlerFunction (node, data, info, doDefault) {
		var selector, attr, data, prop;
		selector = info.selector;
		attr = info.attr;
		prop = info.prop;
		doDefault(node, info);
	}

	function aNodeListHandlerFunction (nodes, data, info, doDefault) {
		var selector, attr, data, prop;
		selector = info.selector;
		attr = info.attr;
		prop = info.prop;
		nodes.forEach(function (node) {
			doDefault(node, info);
		});
	}

	*/

	/**
	 *
	 * @param rootNode {HTMLElement} the node at which to base the
	 *   nodeFinder searches
	 * @param options {Object}
	 * @param options.nodeFinder {Function} querySelector, querySelectorAll, or
	 *   another function that returns HTML elements given a string and a DOM
	 *   node to search from: function (string, root) { return nodeOrList; }
	 * @return {Function} the returned function creates a binding handler
	 *   for a given binding. it is assumed that the binding has been
	 *   normalized. function (binding, prop) { return handler; }
	 */
	return function configureHandlerCreator (rootNode, options) {
		var nodeFinder, eventBinder;

		nodeFinder = options.nodeFinder || options.querySelectorAll || options.querySelector;
		eventBinder = options.on;

		if(!nodeFinder) throw new Error('bindingHandler: options.nodeFinder must be provided');

		nodeFinder = createSafeNodeFinder(nodeFinder);

		return function createBindingHandler (binding, prop) {
			var bindingsAsArray, unlisteners, currItem;

			bindingsAsArray = normalizeBindings(binding, prop);
			unlisteners = addEventListeners();

			function handler (item) {

				currItem = item;

				bindingsAsArray.forEach(function (binding) {
					var each, all, nodes;

					each = binding.each;
					all = binding.all;

					// get all affected nodes
					nodes = nodeFinder(binding.selector, rootNode);

					// run handler for entire nodelist, if any
					if (all) all(nodes, item, binding, defaultNodeListHandler);

					// run custom or default handler for each node
					nodes.forEach(function (node) {
						each(node, item, binding, defaultNodeHandler);
					});

				});

			}

			handler.unlisten = unlistenAll;

			return handler;

			function unlistenAll () {
				unlisteners.forEach(function (unlisten) {
					unlisten();
				});
			}

			function addEventListeners () {
				return bindingsAsArray.reduce(function (unlisteners, binding) {
					var inverse, events;
					function doInverse (e) {
						inverse.call(this, currItem, e);
					}
					// grab some nodes to use to guess events to watch
					events = guess.eventsForNode(nodeFinder(binding.selector, rootNode));
					if (events.length > 0) {
						inverse = createInverseHandler(binding, handler);
						events.forEach(function (event) {
							unlisteners.push(eventBinder(rootNode, event, doInverse, binding.selector));
						});
					}
					return unlisteners;
				}, []);
			}

		};

	};

	function normalizeBindings (binding, defaultProp) {
		var normalized;

		normalized = [].concat(binding);

		return normalized.map(function (binding) {
			var norm;

			if (typeof binding == 'string') {
				norm = { selector: binding };
			} else {
				norm = Object.create(binding);
			}

			norm.each = binding.each || binding.handler || defaultNodeHandler;
			if (!norm.prop) norm.prop = defaultProp;
			return norm;
		});
	}

	function defaultNodeListHandler (nodes, data, info) {
		nodes.forEach(function (node) {
			defaultNodeHandler(node, data, info);
		})
	}

	function defaultNodeHandler (node, data, info) {
		var attr, value, current;
		if(node.form) {
			form.setValues(node.form, data, function(_, name) {
				return name === info.prop;
			});
		} else {
			attr = info.attr || guess.propForNode(node);
			value = data[info.prop];
			// always compare first to try to prevent unnecessary IE reflow/repaint
			current = guess.getNodePropOrAttr(node, attr);
			if (current !== value) {
				guess.setNodePropOrAttr(node, attr, value);
			}
		}
	}

	function defaultInverseNodeHandler (node, data, info) {
		var attr, value;

		if(node.form) {
			value = form.getValues(node.form, function(el) {
				return el === node || el.name === node.name;
			});
			data[info.prop] = value[info.prop];
		} else {
			attr = info.attr || guess.propForNode(node);
			data[info.prop] = guess.getNodePropOrAttr(node, attr);
		}
	}

	function createInverseHandler (binding, propToDom) {
		var domToProp = binding.inverse || binding.each.inverse;
		return function (item, e) {
			var node = e.target;
			// update item
			if (item) domToProp(node, item, binding);
			// is there any other way to know which binding.each/binding.all to execute?
			propToDom(item);
		}
	}

	function createSafeNodeFinder (nodeFinder) {
		return function (selector, rootNode) {
			if (!selector) return [rootNode];
			else return toArray(nodeFinder.apply(this, arguments));
		}
	}

	function toArray (any) {
		if (!any) return []; // nothin
		else if (Array.isArray(any)) return any; // array
		else if (any.length) return slice.call(any); // nodelist
		else return [any]; // single node
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));