/**
 * trackInflightRefs
 * @author: brian@hovercraftstudios.com
 */
(function(define) {
define(function(require) {

	var timeout, findStronglyConnected, formatCycles, refCycleCheckTimeout;

	timeout = require('when/timeout');
	findStronglyConnected = require('./tarjan');
	formatCycles = require('./formatCycles');

	refCycleCheckTimeout = 5000;

	/**
	 * Advice to track inflight refs using a directed graph
	 * @param {DirectedGraph} graph
	 * @param {Resolver} resolver
	 * @param {number} cycleTimeout how long to wait for any one reference to resolve
	 *  before performing cycle detection. This basically debounces cycle detection
	 */
	return function trackInflightRefs(graph, resolver, cycleTimeout) {
		var create = resolver.create;

		if(typeof cycleTimeout != 'number') {
			cycleTimeout = refCycleCheckTimeout;
		}

		resolver.create = function() {
			var ref, resolve;

			ref = create.apply(resolver, arguments);

			resolve = ref.resolve;
			ref.resolve = function() {
				var inflight = resolve.apply(ref, arguments);
				return trackInflightRef(graph, cycleTimeout, inflight, ref.name, arguments[1]);
			};

			return ref;
		};

		return resolver;
	};


	/**
	 * Add this reference to the reference graph, and setup a timeout that will fire if the refPromise
	 * has not resolved in a reasonable amount.  If the timeout fires, check the current graph for cycles
	 * and fail wiring if we find any.
	 * @param {DirectedGraph} refGraph graph to use to track cycles
	 * @param {number} cycleTimeout how long to wait for any one reference to resolve
	 *  before performing cycle detection. This basically debounces cycle detection
	 * @param {object} refPromise promise for reference resolution
	 * @param {string} refName reference being resolved
	 * @param {string} onBehalfOf some indication of another component on whose behalf this
	 *  reference is being resolved.  Used to build a reference graph and detect cycles
	 * @return {object} promise equivalent to refPromise but that may be rejected if cycles are detected
	 */
	function trackInflightRef(refGraph, cycleTimeout, refPromise, refName, onBehalfOf) {

		onBehalfOf = onBehalfOf||'?';
		refGraph.addEdge(onBehalfOf, refName);

		return timeout(refPromise, cycleTimeout).then(
			function(resolved) {
				refGraph.removeEdge(onBehalfOf, refName);
				return resolved;
			},
			function() {
				var stronglyConnected, cycles;

				stronglyConnected = findStronglyConnected(refGraph);
				cycles = stronglyConnected.filter(function(node) {
					return node.length > 1;
				});

				if(cycles.length) {
					// Cycles detected
					throw new Error('Possible circular refs:\n'
						+ formatCycles(cycles));
				}

				return refPromise;
			}
		);
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
