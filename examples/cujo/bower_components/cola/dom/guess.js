(function (define) {
define(function (require) {
"use strict";

	var guess, has, classList, formValueNodeRx, formClickableRx,
		attrToProp, customAccessors;

	has = require('./has');
	classList = require('./classList');

	formValueNodeRx = /^(input|select|textarea)$/i;
	formClickableRx = /^(checkbox|radio)/i;

	attrToProp = {
		'class': 'className',
		'for': 'htmlFor'
		// textContent is added to this list if necessary
	};

	customAccessors = {
		classList: {
			get: classList.getClassList,
			set: classList.setClassList
		},
		classSet: {
			get: classList.getClassSet,
			set: classList.setClassSet
		}
	};

	guess = {
		isFormValueNode: isFormValueNode,

		eventsForNode: guessEventsFor,

		propForNode: guessPropFor,

		getNodePropOrAttr: initSetGet,

		setNodePropOrAttr: initSetGet
	};

	return guess;

	function isFormValueNode (node) {
		return formValueNodeRx.test(node.tagName);
	}

	function isClickableFormNode (node) {
		return isFormValueNode(node) && formClickableRx.test(node.type);
	}

	function guessEventsFor (node) {
		if (Array.isArray(node)) {
			// get unique list of events
			return node.reduce(function (events, node) {
				return events.concat(guessEventsFor(node).filter(function (event) {
					return event && events.indexOf(event) < 0;
				}));
			},[]);
		}
		else if (isFormValueNode(node)) {
			return [isClickableFormNode(node) ? 'click' : 'change', 'focusout'];
		}

		return [];
	}

	function guessPropFor (node) {
		return isFormValueNode(node)
			? isClickableFormNode(node) ? 'checked' : 'value'
			: 'textContent';
	}

	/**
	 * Returns a property or attribute of a node.
	 * @param node {Node}
	 * @param name {String}
	 * @returns the value of the property or attribute
	 */
	function getNodePropOrAttr (node, name) {
		var accessor, prop;
		accessor = customAccessors[name];
		prop = attrToProp[name] || name;

		if (accessor) {
			return accessor.get(node);
		}
		else if (prop in node) {
			return node[prop];
		}
		else {
			return node.getAttribute(prop);
		}
	}

	/**
	 * Sets a property of a node.
	 * @param node {Node}
	 * @param name {String}
	 * @param value
	 */
	function setNodePropOrAttr (node, name, value) {
		var accessor, prop;
		accessor = customAccessors[name];
		prop = attrToProp[name] || name;

		// this gets around a nasty IE6 bug with <option> elements
		if (node.nodeName == 'option' && prop == 'innerText') {
			prop = 'text';
		}

		if (accessor) {
			return accessor.set(node, value);
		}
		else if (prop in node) {
			node[prop] = value;
		}
		else {
			node.setAttribute(prop, value);
		}

		return value;
	}

	/**
	 * Initializes the dom setter and getter at first invocation.
	 * @private
	 * @param node
	 * @param attr
	 * @param [value]
	 * @return {*}
	 */
	function initSetGet (node, attr, value) {
		// test for innerText/textContent
		attrToProp.textContent
			= ('textContent' in node) ? 'textContent' : 'innerText';
		// continue normally
		guess.setNodePropOrAttr = setNodePropOrAttr;
		guess.getNodePropOrAttr = getNodePropOrAttr;
		return arguments.length == 3
			? setNodePropOrAttr(node, attr, value)
			: getNodePropOrAttr(node, attr);
	}

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); }
));