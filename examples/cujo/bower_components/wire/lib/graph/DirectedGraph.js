/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * DirectedGraph
 * @author: brian@hovercraftstudios.com
 */
(function(define) {
define(function() {

	/**
	 * A simple directed graph
	 * @constructor
	 */
	function DirectedGraph() {
		this.vertices = {};
	}

	DirectedGraph.prototype = {
		/**
		 * Add a new edge from one vertex to another
		 * @param {string} from vertex at the tail of the edge
		 * @param {string} to vertex at the head of the edge
		 */
		addEdge: function(from, to) {
			this._getOrCreateVertex(to);
			this._getOrCreateVertex(from).edges[to] = 1;
		},

		/**
		 * Adds and initializes new vertex, or returns an existing vertex
		 * if one with the supplied name already exists
		 * @param {string} name vertex name
		 * @return {object} the new vertex, with an empty edge set
		 * @private
		 */
		_getOrCreateVertex: function(name) {
			var v = this.vertices[name];
			if(!v) {
				v = this.vertices[name] = { name: name, edges: {} };
			}

			return v;
		},

		/**
		 * Removes an edge, if it exits
		 * @param {string} from vertex at the tail of the edge
		 * @param {string} to vertex at the head of the edge
		 */
		removeEdge: function(from, to) {
			var outbound = this.vertices[from];
			if(outbound) {
				delete outbound.edges[to];
			}
		},

		/**
		 * Calls lambda once for each vertex in the graph passing
		 * the vertex as the only param.
		 * @param {function} lambda
		 */
		eachVertex: function(lambda) {
			var vertices, v;

			vertices = this.vertices;
			for(v in vertices) {
				lambda(vertices[v]);
			}
		},

		/**
		 * Calls lambda once for every outbound edge of the supplied vertex
		 * @param {string} vertex vertex name whose edges will be passed to lambda
		 * @param {function} lambda
		 */
		eachEdgeFrom: function(vertex, lambda) {
			var v, e, vertices;

			vertices = this.vertices;
			v = vertices[vertex];

			if(!v) {
				return;
			}

			for(e in v.edges) {
				lambda(v, vertices[e]);
			}
		}
	};

	return DirectedGraph;

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
