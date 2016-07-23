/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library"], function (can) {
	/**
	 * @property {Object} can.view.elements
	 * @parent can.view
	 *
	 * Provides helper methods for and information about the behavior
	 * of DOM elements.
	 */
	var elements = {
		tagToContentPropMap: {
			option: 'textContent' in document.createElement('option') ? 'textContent' : 'innerText',
			textarea: 'value'
		},
		/**
		 * @property {Object.<String,(String|Boolean|function)>} can.view.elements.attrMap
		 * @parent can.view.elements
		 *
		 *
		 * A mapping of
		 * special attributes to their JS property. For example:
		 *
		 *     "class" : "className"
		 *
		 * means get or set `element.className`. And:
		 *
		 *      "checked" : true
		 *
		 * means set `element.checked = true`.
		 *
		 *
		 * If the attribute name is not found, it's assumed to use
		 * `element.getAttribute` and `element.setAttribute`.
		 */
		attrMap: {
			'class': 'className',
			'value': 'value',
			'innerText': 'innerText',
			'textContent': 'textContent',
			'checked': true,
			'disabled': true,
			'readonly': true,
			'required': true,
			src: function (el, val) {
				if (val === null || val === '') {
					el.removeAttribute('src');
				} else {
					el.setAttribute('src', val);
				}
			}
		},
		attrReg: /([^\s=]+)[\s]*=[\s]*/,
		// elements whos default value we should set
		defaultValue: ["input", "textarea"],
		// a map of parent element to child elements
		/**
		 * @property {Object.<String,String>} can.view.elements.tagMap
		 * @parent can.view.elements
		 *
		 * A mapping of parent node names to child node names that can be inserted within
		 * the parent node name.  For example: `table: "tbody"` means that
		 * if you want a placeholder element within a `table`, a `tbody` will be
		 * created.
		 */
		tagMap: {
			'': 'span',
			table: 'tbody',
			tr: 'td',
			ol: 'li',
			ul: 'li',
			tbody: 'tr',
			thead: 'tr',
			tfoot: 'tr',
			select: 'option',
			optgroup: 'option'
		},
		// a tag's parent element
		reverseTagMap: {
			tr: 'tbody',
			option: 'select',
			td: 'tr',
			th: 'tr',
			li: 'ul'
		},
		// Used to determine the parentNode if el is directly within a documentFragment
		getParentNode: function (el, defaultParentNode) {
			return defaultParentNode && el.parentNode.nodeType === 11 ? defaultParentNode : el.parentNode;
		},
		// Set an attribute on an element
		setAttr: function (el, attrName, val) {
			var tagName = el.nodeName.toString()
				.toLowerCase(),
				prop = elements.attrMap[attrName];
			// if this is a special property
			if (typeof prop === "function") {
				prop(el, val);
			} else if (prop === true && attrName === "checked" && el.type === "radio") {
				// IE7 bugs sometimes if defaultChecked isn't set first
				if (can.inArray(tagName, elements.defaultValue) >= 0) {
					el.defaultChecked = true;
				}
				el[attrName] = true;
			} else if (prop === true) {
				el[attrName] = true;
			} else if (prop) {
				// set the value as true / false
				el[prop] = val;
				if (prop === 'value' && can.inArray(tagName, elements.defaultValue) >= 0) {
					el.defaultValue = val;
				}
			} else {
				el.setAttribute(attrName, val);
			}
		},
		// Gets the value of an attribute.
		getAttr: function (el, attrName) {
			// Default to a blank string for IE7/8
			return (elements.attrMap[attrName] && el[elements.attrMap[attrName]] ? el[elements.attrMap[attrName]] : el.getAttribute(attrName)) || '';
		},
		// Removes the attribute.
		removeAttr: function (el, attrName) {
			var setter = elements.attrMap[attrName];
			if (setter === true) {
				el[attrName] = false;
			} else if (typeof setter === 'string') {
				el[setter] = '';
			} else {
				el.removeAttribute(attrName);
			}
		},
		// Gets a "pretty" value for something
		contentText: function (text) {
			if (typeof text === 'string') {
				return text;
			}
			// If has no value, return an empty string.
			if (!text && text !== 0) {
				return '';
			}
			return '' + text;
		},
		/**
		 * @function can.view.elements.after
		 * @parent can.view.elements
		 *
		 * Inserts newFrag after oldElements.
		 *
		 * @param {Array.<HTMLElement>} oldElements
		 * @param {DocumentFragment} newFrag
		 */
		after: function (oldElements, newFrag) {
			var last = oldElements[oldElements.length - 1];
			// Insert it in the `document` or `documentFragment`
			if (last.nextSibling) {
				can.insertBefore(last.parentNode, newFrag, last.nextSibling);
			} else {
				can.appendChild(last.parentNode, newFrag);
			}
		},
		/**
		 * @function can.view.elements.replace
		 * @parent can.view.elements
		 *
		 * Replaces `oldElements` with `newFrag`
		 *
		 * @param {Array.<HTMLElement>} oldElements
		 * @param {DocumentFragment} newFrag
		 */
		replace: function (oldElements, newFrag) {
			elements.after(oldElements, newFrag);
			can.remove(can.$(oldElements));
		}
	};
	// TODO: this doesn't seem to be doing anything
	// feature detect if setAttribute works with styles
	(function () {
		// feature detect if
		var div = document.createElement('div');
		div.setAttribute('style', 'width: 5px');
		div.setAttribute('style', 'width: 10px');
		// make style use cssText
		elements.attrMap.style = function (el, val) {
			el.style.cssText = val || '';
		};
	}());
	return elements;
});