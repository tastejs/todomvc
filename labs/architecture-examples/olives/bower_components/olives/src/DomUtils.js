/**
 * Olives http://flams.github.com/olives
 * The MIT License (MIT)
 * Copyright (c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com> - Olivier Wietrich <olivier.wietrich@gmail.com>
 */

define(["Tools"], function (Tools) {

	return {
		/**
		 * Returns a NodeList including the given dom node,
		 * its childNodes and its siblingNodes
		 * @param {HTMLElement|SVGElement} dom the dom node to start with
		 * @param {String} query an optional CSS selector to narrow down the query
		 * @returns the list of nodes
		 */
		getNodes: function getNodes(dom, query) {
			if (this.isAcceptedType(dom)) {
				if (!dom.parentNode) {
					document.createDocumentFragment().appendChild(dom);
				}

				return dom.parentNode.querySelectorAll(query || "*");
			} else {
				return false;
			}
		},

		/**
		 * Get a domNode's dataset attribute. If dataset doesn't exist (IE)
		 * then the domNode is looped through to collect them.
		 * @param {HTMLElement|SVGElement} dom
		 * @returns {Object} dataset
		 */
		getDataset: function getDataset(dom) {
			var i=0,
				l,
				dataset={},
				split,
				join;

			if (this.isAcceptedType(dom)) {
				if (dom.hasOwnProperty("dataset")) {
					return dom.dataset;
				} else {
					for (l=dom.attributes.length;i<l;i++) {
						split = dom.attributes[i].name.split("-");
						if (split.shift() == "data") {
							dataset[join = split.join("-")] = dom.getAttribute("data-"+join);
						}
					}
					return dataset;
				}

			} else {
				return false;
			}
		},

		/**
		 * Olives can manipulate HTMLElement and SVGElements
		 * This function tells if an element is one of them
		 * @param {Element} type
		 * @returns true if HTMLElement or SVGElement
		 */
		isAcceptedType: function isAcceptedType(type) {
			if (type instanceof HTMLElement ||
				type instanceof SVGElement) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Assign a new value to an Element's property. Works with HTMLElement and SVGElement.
		 * @param {HTMLElement|SVGElement} node the node which property should be changed
		 * @param {String} property the name of the property
		 * @param {any} value the value to set
		 * @returns true if assigned
		 */
		setAttribute: function setAttribute(node, property, value) {
				if (node instanceof HTMLElement) {
					node[property] = value;
					return true;
				} else if (node instanceof SVGElement){
					node.setAttribute(property, value);
					return true;
				} else {
					return false;
				}
		},

		/**
		 * Determine if an element matches a certain CSS selector.
		 * @param {Element} the parent node
		 * @param {String} CSS selector
		 * @param {Element} the node to check out
		 * @param true if matches
		 */
		matches : function matches(parent, selector, node){
			return Tools.toArray(this.getNodes(parent, selector)).indexOf(node) > -1;
		}

	};

});
