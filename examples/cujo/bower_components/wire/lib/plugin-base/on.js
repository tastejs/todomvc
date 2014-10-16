/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/plugin-base/on
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function (define) {
define(['when', 'when/apply', '../functional', '../connection'],
function (when, apply, functional, connection) {
"use strict";

	var theseAreNotEvents, thisLooksLikeCssRx, eventSplitterRx, undef;

	theseAreNotEvents = {
		selector: 1,
		transform: 1,
		preventDefault: 1,
		stopPropagation: 1
	};

	thisLooksLikeCssRx = /#|\.|-|[^,]\s[^,]/;
	eventSplitterRx = /\s*,\s*/;

	return function createOnPlugin (options) {
		var on;

		on = options.on;

		return function eventsPlugin (options) {

			var removers = [];

			if (!options) {
				options = {};
			}

			function createConnection(source, eventsString, handler) {
				var events, prevent, stop;

				events = splitEventSelectorString(eventsString);
				prevent = options.preventDefault;
				stop = options.stopPropagation;

				removers = removers.concat(
					registerHandlers(events, source, handler, prevent, stop)
				);
			}

			function parseIncomingOn(source, targetProxy, connections, wire) {

				// NOTE: Custom parsing for incoming connections

				// target is the node to which to connect, and
				// right hand side is a specification of an event
				// and a handler method on the current component
				//
				//	component: {
				//		on: {
				//			otherComponent: {
				//				selector: 'a.nav',
				//				transform: { $ref: 'myTransformFunc' }, // optional
				//				click: 'handlerMethodOnComponent',
				//				keypress: 'anotherHandlerOnComponent'
				//			}
				//		}
				//	}
				var target, event, events, selector, prevent, stop, method, transform, promises;

				target = targetProxy.target;
				promises = [];

				// Extract options
				selector = connections.selector;
				transform = connections.transform;
				prevent = connections.preventDefault || options.preventDefault;
				stop = connections.stopPropagation || options.stopPropagation;

				/**
				 * Compose a transform pipeline and then pass it to addConnection
				 */
				function createTransformedConnection(events, targetMethod, transformPromise) {
					return when(transformPromise, function(transform) {
						var composed = functional.compose([transform, targetMethod]).bind(targetProxy.target);
						removers = removers.concat(
							registerHandlers(events, source, function() {
								return targetProxy.invoke(composed, arguments);
							}, prevent, stop)
						);
					});
				}

				for (event in connections) {
					// Skip reserved names, such as 'selector'
					if (!(event in theseAreNotEvents)) {
						// If there's an explicit transform, compose a transform pipeline manually,
						// Otherwise, let the connection lib do it's thing
						if(transform) {
							// TODO: Remove this long form?  It'd simplify the code a lot
							events = splitEventSelectorString(event, selector);
							method = connections[event];
							promises.push(createTransformedConnection(events, target[method], wire(transform)));
						} else {
							promises.push(connection.parseIncoming(source, event, targetProxy, options, connections[event], wire, createConnection));
						}
					}
				}

				return when.all(promises);
			}

			function parseOn (proxy, refName, connections, wire) {
				// First, figure out if the left-hand-side is a ref to
				// another component, or an event/delegation string
				return when(wire.resolveRef(refName),
					function (source) {
						// It's an incoming connection, parse it as such
						return parseIncomingOn(source, proxy, connections, wire);
					},
					function () {
						// Failed to resolve refName as a reference, assume it
						// is an outgoing event with the current component (which
						// must be a Node) as the source
						return connection.parseOutgoing(proxy, refName, connections, wire, createConnection);
					}
				);

			}

			function onFacet (wire, facet) {
				var promises, connections;

				connections = facet.options;
				promises = [];

				for (var ref in connections) {
					promises.push(parseOn(facet, ref, connections[ref], wire));
				}

				return when.all(promises);
			}

			return {
				context: {
					destroy: function(resolver) {
						removers.forEach(function(remover) {
							remover();
						});
						resolver.resolve();
					}
				},
				facets: {
					on: {
						connect: function (resolver, facet, wire) {
							resolver.resolve(onFacet(wire, facet));
						}
					}
				},
				resolvers: {
					on: function(resolver, name /*, refObj, wire*/) {
						resolver.resolve(name ? createOnResolver(name) : on);
					}
				}
			};
		};

		function registerHandlers (events, node, callback, prevent, stop) {
			var removers, handler;
			removers = [];
			for (var i = 0, len = events.length; i < len; i++) {
				handler = makeEventHandler(callback, prevent, stop);
				removers.push(on(node, events[i], handler, events.selector));
			}
			return removers;
		}

		/**
		 * Returns a function that creates event handlers.  The event handlers
		 * are pre-configured with one or more selectors and one
		 * or more event types.  The syntax is identical to the "on" facet.
		 * Note that the returned handler does not auto-magically call
		 * event.preventDefault() or event.stopPropagation() like the "on"
		 * facet does.
		 * @private
		 * @param eventSelector {String} event/selector string that can be
		 *   parsed by splitEventSelectorString()
		 * @return {Function} a function that can be used to create event
		 *   handlers. It returns an "unwatch" function and takes any of
		 *   the following argument signatures:
		 *     function (handler) {}
		 *     function (rootNode, handler) {}
		 */
		function createOnResolver (eventSelector) {
			var events;
			// split event/selector string
			events = splitEventSelectorString(eventSelector, '');
			return function () {
				var args, node, handler, unwatches;
				// resolve arguments
				args = Array.prototype.slice.call(arguments, 0, 3);
				node = args.length > 1 ? args.shift() : document;
				handler = args[0];

				unwatches = [];
				events.forEach(function (event) {
					// create a handler for each event
					unwatches.push(on(node, event, handler, events.selector));
				});
				// return unwatcher of all events
				return function () {
					unwatches.forEach(function (unwatch) { unwatch(); });
				};
			};
		}

	};

	function preventDefaultIfNav (e) {
		var node, nodeName, nodeType, isNavEvent;
		node = e.selectorTarget || e.target || e.srcElement;
		if (node) {
			nodeName = node.tagName;
			nodeType = node.type && node.type.toLowerCase();
			// catch links and submit buttons/inputs in forms
			isNavEvent = ('click' == e.type && 'A' == nodeName)
				|| ('submit' == nodeType && node.form)
				|| ('submit' == e.type && 'FORM' == nodeName);
			if (isNavEvent) {
				preventDefaultAlways(e);
			}
		}
	}

	function preventDefaultAlways (e) {
		e.preventDefault();
	}

	function stopPropagationAlways (e) {
		e.stopPropagation();
	}

	function never () {}

	function makeEventHandler (handler, prevent, stop) {
		var preventer, stopper;
		preventer = prevent == undef || prevent == 'auto'
			? preventDefaultIfNav
			: prevent ? preventDefaultAlways : never;
		stopper = stop ? stopPropagationAlways : never;

		// Use proxy.invoke instead of trying to call methods
		// directly on proxy.target
		return function (e) {
			preventer(e);
			stopper(e);
			return handler.apply(this, arguments);
		};
	}

	/**
	 * Splits an event-selector string into one or more combinations of
	 * selectors and event types.
	 * Examples:
	 *   ".target:click" --> {selector: '.target', event: 'click' }
	 *   ".mylist:first-child:click, .mylist:last-child:click" --> [
	 *     { selector: '.mylist:first-child', event: 'click' },
	 *     { selector: '.mylist:last-child', event: 'click' }
	 *   ]
	 *   ".mylist:first-child, .mylist:last-child:click" --> {
	 *     selector: '.mylist:first-child, .mylist:last-child',
	 *     event: 'click'
	 *   }
	 * @private
	 * @param string {String}
	 * @param defaultSelector {String}
	 * @returns {Array} an array of event names. if a selector was specified
	 *   the array has a selectors {String} property
	 */
	function splitEventSelectorString (string, defaultSelector) {
		var split, events, selectors;

		// split on first colon to get events and selectors
		split = string.split(':', 2);
		events = split[0];
		selectors = split[1] || defaultSelector;

		// look for css stuff in event (dev probably forgot event?)
		// css stuff: hash, dot, spaces without a comma
		if (thisLooksLikeCssRx.test(events)) {
			throw new Error('on! resolver: malformed event-selector string (event missing?)');
		}

		// split events
		events = events.split(eventSplitterRx);
		if (selectors) {
			events.selector = selectors;
		}

		return events;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (deps, factory) { module.exports = factory.apply(this, deps.map(require)); }
));
