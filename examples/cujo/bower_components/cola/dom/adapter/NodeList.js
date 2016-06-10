(function (define) {
define(function(require) {
"use strict";

	var SortedMap, classList, NodeAdapter,
		defaultIdAttribute, defaultTemplateSelector, listElementsSelector,
		colaListBindingStates, allBindingStates, undef;

	SortedMap = require('../../SortedMap');
	classList = require('../classList');
	NodeAdapter = require('./Node');

	defaultTemplateSelector = '[data-cola-role="item-template"]';
	defaultIdAttribute = 'data-cola-id';
	listElementsSelector = 'tr,li';

	colaListBindingStates = {
		empty: 'cola-list-empty',
		bound: 'cola-list-bound',
		unbound: 'cola-list-unbound'
	};

	allBindingStates = Object.keys(colaListBindingStates).map(function(key) {
		return colaListBindingStates[key];
	}).join(' ');

	/**
	 * Manages a collection of dom trees that are synced with a data
	 * collection.
	 * @constructor
	 * @param rootNode {Node} node to serve as a template for items
	 * in the collection / list.
	 * @param {object} options
	 * @param options.comparator {Function} comparator function to use for
	 *  ordering nodes
	 * @param [options.containerNode] {Node} optional parent to all itemNodes. If
	 * omitted, the parent of rootNode is assumed to be containerNode.
	 * @param [options.querySelector] {Function} DOM query function
	 * @param [options.itemTemplateSelector] {String}
	 * @param [options.idAttribute] {String}
	 * @param [options.containerAttribute] {String}
	 */
	function NodeListAdapter (rootNode, options) {
		var container, self;

		if(!options) options = {};

		this._options = options;

		this.comparator = options.comparator;
		this.identifier = options.identifier;

		this._rootNode = rootNode;

		// 1. find templateNode
		this._templateNode = findTemplateNode(rootNode, options);

		// 2. get containerNode
		// TODO: should we get the container node just-in-time?
		container = options.containerNode || this._templateNode.parentNode;

		if (!container) {
			throw new Error('No container node found for NodeListAdapter.');
		}

		this._containerNode = container;

		this._initTemplateNode();

		// keep track of itemCount, so we can set the cola-list-XXX state
		this._itemCount = undef;
		this._checkBoundState();

		self = this;
		// list of sorted data items, nodes, and unwatch functions
		this._itemData = new SortedMap(
			function(item) {
				return self.identifier(item);
			},
			function (a, b) {
				return self.comparator(a, b);
			}
		);

		this._itemsById = {};

	}

	NodeListAdapter.prototype = {

		add: function (item) {
			var adapter, index;

			// create adapter
			adapter = this._createNodeAdapter(item);

			// add to map
			index = this._itemData.add(item, adapter);

			// figure out where to insert into dom
			if (index >= 0) {
				this._itemCount = (this._itemCount||0) + 1;
				// insert
				this._insertNodeAt(adapter._rootNode, index);
				this._checkBoundState();

				this._itemsById[this.identifier(item)] = item;
			}
		},

		remove: function (item) {
			var adapter, node;

			// grab node we're about to remove
			adapter = this._itemData.get(item);

			// remove item
			this._itemData.remove(item);

			if (adapter) {
				this._itemCount--;
				node = adapter._rootNode;
				// remove from dom
				node.parentNode.removeChild(node);
				this._checkBoundState();

				delete this._itemsById[this.identifier(item)];
			}
		},

		update: function (item) {
			var adapter, index, key;

			adapter = this._itemData.get(item);

			if (!adapter) {
				this.add(item);
			}
			else {
				this._updating = adapter;
				try {
					adapter.update(item);
					this._itemData.remove(item);
					index = this._itemData.add(item, adapter);

					key = this.identifier(item);
					this._itemsById[key] = item;

					this._insertNodeAt(adapter._rootNode, index);
				}
				finally {
					delete this._updating;
				}
			}

		},

		forEach: function (lambda) {
			this._itemData.forEach(lambda);
		},

		setComparator: function (comparator) {
			var i = 0, self = this;
			this.comparator = comparator;
			this._itemData.setComparator(comparator);
			this._itemData.forEach(function (adapter, item) {
				self._insertNodeAt(adapter._rootNode, i++);
			});
		},

		getOptions: function () {
			return this._options;
		},

		findItem: function (eventOrElement) {
			var node, idAttr, id;

			// using feature sniffing to detect if this is an event object
			// TODO: use instanceof HTMLElement where supported
			if (!(eventOrElement && eventOrElement.target && eventOrElement.stopPropagation && eventOrElement.preventDefault
				|| eventOrElement && eventOrElement.nodeName && eventOrElement.nodeType == 1))
				return; // not comments or text nodes

			// test for an event or an element (duck-typing by using
			// the same features we're sniffing below helps kill two birds...)
			node = eventOrElement.nodeType
				? eventOrElement
				: eventOrElement.target || eventOrElement.srcElement;

			if (!node) return;

			idAttr = this._options.idAttribute || defaultIdAttribute;

			// start at node and work up
			do id = node.getAttribute(idAttr);
			while (id == null && (node = node.parentNode) && node.nodeType == 1);

			return id != null && this._itemsById[id];
		},

		findNode: function (thing) {
			var item, data;

			if (!thing) return;

			// what is this thing?
			if (typeof thing == 'string' || typeof thing == 'number') {
				item = this._itemsById[thing];
			}
			else {
				// try this.get in case thing is an event or node
				// otherwise, assume it's a data item
				item = this.findItem(thing) || thing;
			}

			if (item != null) {
				// determine if this data item is ours
				data = this._itemData.get(item);
			}

			return data && data._rootNode;
		},

		/**
		 * Compares two data items.  Works just like the comparator function
		 * for Array.prototype.sort. This comparator is used to sort the
		 * items in the list.
		 * This property should be injected.  If not supplied, the list
		 * will rely on one assigned by cola.
		 * @param a {Object}
		 * @param b {Object}
		 * @returns {Number} -1, 0, 1
		 */
		comparator: undef,

		identifier: undef,

		destroy: function () {
			this._itemData.forEach(function (adapter) {
				adapter.destroy();
			});
		},

		_initTemplateNode: function () {
			var templateNode = this._templateNode;
			// remove from document
			if (templateNode.parentNode) {
				templateNode.parentNode.removeChild(templateNode);
			}
			// remove any styling to hide template node (ideally, devs
			// would use a css class for this, but whatevs)
			// css class: .cola-list-unbound .my-template-node { display: none }
			if (templateNode.style.display) {
				templateNode.style.display = '';
			}
			// remove id because we're going to duplicate
			if (templateNode.id) {
				templateNode.id = '';
			}
		},

		_createNodeAdapter: function (item) {
			var node, adapter, idAttr, origUpdate, self;

			// create NodeAdapter
			node = this._templateNode.cloneNode(true);
			adapter = new NodeAdapter(node, this._options);
			adapter.set(item);

			// label node for quick identification from events
			if (this.identifier) {
				idAttr = this._options.idAttribute || defaultIdAttribute;
				adapter._rootNode.setAttribute(idAttr, this.identifier(item));
			}

			// override update() method to call back
			origUpdate = adapter.update;
			self = this;
			adapter.update = function (item) {
				// update node(s) in NodeAdapter
				origUpdate.call(adapter, item);
				// cascade to us if we didn't initiate update()
				if (self._updating != adapter) {
					self.update(item);
				}
			};

			return adapter;
		},

		_insertNodeAt: function (node, index) {
			var parent, refNode;
			parent = this._containerNode;
			refNode = parent.childNodes[index];
			// Firefox cries when you try to insert before yourself
			// which can happen if we're moving into the same position.
			if (node != refNode) {
				parent.insertBefore(node, refNode);
			}
		},

		_checkBoundState: function () {
			var states, isBound, isEmpty;
			states = [];
			isBound = this._itemCount != null;
			isEmpty = this._itemCount == 0;

			if(!isBound) {
				states.push(colaListBindingStates.unbound);
			}

			if(isEmpty) {
				states.push(colaListBindingStates.empty);
			}

			if(isBound && !isEmpty) {
				states.push(colaListBindingStates.bound);
			}

			setBindingStates(states.join(' '), this._rootNode);
		}

	};

	NodeListAdapter.canHandle = function (obj) {
		// crude test if an object is a node.
		return obj && obj.tagName && obj.insertBefore && obj.removeChild;
	};

	function setBindingStates(states, node) {
		node.className = classList.addClass(states, classList.removeClass(allBindingStates, node.className));
	}

	function findTemplateNode (root, options) {
		var useBestGuess, node;

		// user gave no explicit instructions
		useBestGuess = !options.itemTemplateSelector;

		if (options.querySelector) {
			// if no selector, try default selector
			node = options.querySelector(options.itemTemplateSelector || defaultTemplateSelector, root);
			// if still not found, search around for a list element
			if (!node && useBestGuess) {
				node = options.querySelector(listElementsSelector, root);
			}
		}
		if (!node && useBestGuess) {
			node = root.firstChild;
		}
		// if still not found, throw
		if (!node) {
			throw new Error('NodeListAdapter: could not find itemTemplate node');
		}
		return node;
	}

	return NodeListAdapter;

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); }
));