/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Tarjan directed graph cycle detection
 * @author: brian@hovercraftstudios.com
 */
(function(define) {
define(function() {

	var undef;

	/**
	 * Tarjan directed graph cycle detection.
	 * See http://en.wikipedia.org/wiki/Tarjan's_strongly_connected_components_algorithm
	 *
	 * WARNING: For efficiency, this adds properties to the vertices in the
	 * graph.  It doesn't really matter for wire's internal purposes.
	 *
	 * @param {DirectedGraph} digraph
	 * @return {Array} each element is a set (Array) of vertices involved
	 * in a cycle.
	 */
	return function tarjan(digraph) {

		var index, stack, scc;

		index = 0;
		stack = [];

		scc = [];

		// Clear out any old cruft that may be hanging around
		// from a previous run.  Maybe should do this afterward?
		digraph.eachVertex(function(v) {
			delete v.index;
			delete v.lowlink;
			delete v.onStack;
		});

		// Start the depth first search
		digraph.eachVertex(function(v) {
			if(v.index === undef) {
				findStronglyConnected(digraph, v)
			}
		});

		// Tarjan algorithm for a single node
		function findStronglyConnected(dg, v) {
			var vertices, vertex;

			v.index = v.lowlink = index;
			index += 1;
			pushStack(stack, v);

			dg.eachEdgeFrom(v.name, function(v, w) {

				if(w.index === undef) {
					// Continue depth first search
					findStronglyConnected(dg, w);
					v.lowlink = Math.min(v.lowlink, w.lowlink);
				} else if(w.onStack) {
					v.lowlink = Math.min(v.lowlink, w.index);
				}

			});

			if(v.lowlink === v.index) {
				vertices = [];
				if(stack.length) {
					do {
						vertex = popStack(stack);
						vertices.push(vertex);
					} while(v !== vertex)
				}

				if(vertices.length) {
					scc.push(vertices);
				}
			}
		}

		return scc;
	};

	/**
	 * Push a vertex on the supplied stack, but also tag the
	 * vertex as being on the stack so we don't have to scan the
	 * stack later in order to tell.
	 * @param {Array} stack
	 * @param {object} vertex
	 */
	function pushStack(stack, vertex) {
		stack.push(vertex);
		vertex.onStack = 1;
	}

	/**
	 * Pop an item off the supplied stack, being sure to un-tag it
	 * @param {Array} stack
	 * @return {object|undefined} vertex
	 */
	function popStack(stack) {
		var v = stack.pop();
		if(v) {
			delete v.onStack;
		}

		return v;
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
