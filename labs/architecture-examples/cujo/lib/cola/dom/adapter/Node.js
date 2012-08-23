/** MIT License (c) copyright B Cavalier & J Hann */


(function (define) {
define(function (require) {
"use strict";

	var bindingHandler;

	bindingHandler = require('../bindingHandler');

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
		if (!options.bindings) options.bindings = {};
		this._options = options;
		this._handlers = {};

		this._createItemToDomHandlers();

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

		_itemToDom: function (item, hash) {
			var p, handler;
			for (p in hash) {
				handler = this._handlers[p];
				if (handler) handler(item);
			}
		},

		_createItemToDomHandlers: function () {
			var bindings, creator;

			bindings = this._options.bindings;
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

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); }
));
