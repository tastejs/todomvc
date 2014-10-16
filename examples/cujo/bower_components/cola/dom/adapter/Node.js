/** MIT License (c) copyright B Cavalier & J Hann */


(function (define) {
define(function (require) {
"use strict";

	var bindingHandler, guess;

	bindingHandler = require('../bindingHandler');
	guess = require('../guess');

	/**
	 * Creates a cola adapter for interacting with dom nodes.  Be sure to
	 * unwatch any watches to prevent memory leaks in Internet Explorer 6-8.
	 * @constructor
	 * @param rootNode {Node}
	 * @param options {Object}
	 */
	function NodeAdapter (rootNode, options) {

		this._rootNode = rootNode;

		// set options
		options.bindings = guessBindingsFromDom(this._rootNode, options);

		this._options = options;
		this._handlers = {};

		this._createItemToDomHandlers(options.bindings);
	}

	NodeAdapter.prototype = {

		getOptions: function () {
			return this._options;
		},

		set: function (item) {
			this._item = item;
			this._itemToDom(item, this._handlers);
		},

		update: function (item) {
			this._item = item;
			this._itemToDom(item, item);
		},

		destroy: function () {
			this._handlers.forEach(function (handler) {
				if (handler.unlisten) handler.unlisten();
			});
		},

		properties: function(lambda) {
			lambda(this._item);
		},

		_itemToDom: function (item, hash) {
			var p, handler;
			for (p in hash) {
				handler = this._handlers[p];
				if (handler) handler(item);
			}
		},

		_createItemToDomHandlers: function (bindings) {
			var creator;

			creator = bindingHandler(this._rootNode, this._options);

			Object.keys(bindings).forEach(function (b) {
				this._handlers[b] = creator(bindings[b], b);
			}, this);
		}

	};

	/**
	 * Tests whether the given object is a candidate to be handled by
	 * this adapter. Returns true if this is a DOMNode (or looks like one).
	 * @param obj
	 * @returns {Boolean}
	 */
	NodeAdapter.canHandle = function (obj) {
		// crude test if an object is a node.
		return obj && obj.tagName && obj.getAttribute && obj.setAttribute;
	};

	return NodeAdapter;

	function guessBindingsFromDom(rootNode, options) {
		var nodeFinder, nodes, bindings;

		bindings = options.bindings || {};
		nodeFinder = options.nodeFinder || options.querySelectorAll || options.querySelector;

		nodes = nodeFinder('[name],[data-cola-binding]', rootNode);

		if(nodes) {
			Array.prototype.forEach.call(nodes, function(n) {
				var name, attr;

				attr = n.name ? 'name' : 'data-cola-binding';
				name = guess.getNodePropOrAttr(n, attr);
				if(name && !(name in bindings)) {
					bindings[name] = '[' + attr + '="' + name + '"]';
				}
			});
		}

		return bindings;
	}

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); }
));