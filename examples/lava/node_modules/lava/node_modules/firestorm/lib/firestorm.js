(function (_global) {

/*
Credits:
Some code is taken from Metamorph (https://github.com/tomhuda/metamorph.js/)
and MooTools (http://mootools.net/)
*/

/**
 * Low-level DOM manipulation and utility library
 */
var Firestorm = {

	/** @ignore */
	schema: null,
	/** @ignore */
	Environment: null,
	/** @ignore */
	DOM: null,
	/** @ignore */
	Element: null,
	/** @ignore */
	String: null,
	/** @ignore */
	Array: null,
	/** @ignore */
	Object: null,
	/** @ignore */
	Date: null,

	/**
	 * The map of numbered exception messages. May be excluded from production build
	 * @type {Object.<number, string>}
	 */
	KNOWN_EXCEPTIONS: null,

	/**
	 * Used by {@link Firestorm#getType}
	 * @type {Object.<string, string>}
	 */
	_descriptor_to_type: {
		"[object Boolean]": 'boolean',
		"[object Number]": 'number',
		"[object String]": 'string',
		"[object Function]": 'function',
		"[object Array]": 'array',
		"[object Date]": 'date',
		"[object RegExp]": 'regexp',
		"[object Object]": 'object',
		"[object Error]": 'error',
		"[object Null]": 'null',
		"[object Undefined]": 'undefined'
	},

	/**
	 * Browser key codes from keyboard events
	 * @enum {number}
	 */
	KEY_CODES: {
		ENTER: 13,
		ESCAPE: 27,
		LEFT_ARROW: 37,
		UP_ARROW: 38,
		RIGHT_ARROW: 39,
		DOWN_ARROW: 40
	},

	/**
	 * Framework must be initialized before it can be used
	 */
	init: function() {

		if (typeof(window) != 'undefined') {

			if (!('id' in window.document)) Firestorm.t("MooTools isn't loaded");

			this.Environment && this.Environment.init();
			this.DOM && this.DOM.init();

		}

		// You must know this yourself:
		// for (var name in {}) Firestorm.t("Firestorm framework can not coexist with frameworks that modify native object's prototype");

	},

	/**
	 * Get actual type of any JavaScript value
	 * @param {*} value Any value
	 * @returns {string} The type name, like "null", "object" or "regex"
	 */
	getType: function(value) {

		var result = 'null';

		// note: Regexp type may be both an object and a function in different browsers
		if (value !== null) {

			result = typeof(value);
			if (result == "object" || result == "function") {
				// this.toString refers to plain object's toString
				result = this._descriptor_to_type[this.toString.call(value)] || "object";
			}

		}

		return result;

	},

	/**
	 * Get HTML element by it's id attribute
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
	getElementById: function(id) {

		return document.id(id);

	},

	/**
	 * Copy all properties from `partial` to `base`
	 * @param {Object} base
	 * @param {Object} partial
	 */
	extend: function(base, partial) {

		for (var name in partial) {

			base[name] = partial[name];

		}

	},

	/**
	 * Copy all properties from `partial` to `base`, but do not overwrite existing properties
	 * @param {Object} base
	 * @param {Object} partial
	 */
	implement: function(base, partial) {

		for (var name in partial) {

			if (!(name in base)) {

				base[name] = partial[name];

			}

		}

	},

	/**
	 * Return all elements which match the given selector
	 * @param {string} selector CSS selector
	 * @returns {Array.<HTMLElement>}
	 */
	selectElements: function(selector) {

		return Slick.search(window.document, selector, []);

	},

	/**
	 * Get all elements with given tag name
	 * @param {string} tag_name
	 * @returns {NodeList}
	 */
	getElementsByTagName: function(tag_name) {

		return document.getElementsByTagName(tag_name);

	},

	/**
	 * Deep clone of given value
	 * @param {*} value
	 * @returns {*}
	 */
	clone: function(value) {

		switch (this.getType(value)) {
			case 'array':
				return this.Array.clone(value);
			case 'object':
				return this.Object.clone(value);
			default:
				return value;
		}

	},

	noConflict: null,

	/**
	 * Throw an exception
	 * @param [message] Exception message
	 */
	t: function(message) {

		if (typeof(message) == 'number' && this.KNOWN_EXCEPTIONS && (message in this.KNOWN_EXCEPTIONS)) {
			throw new Error(this.KNOWN_EXCEPTIONS[message]);
		}

		throw new Error(message || 'Debug assertion failed');

	},

	/**
	 * Return <kw>true</kw>
	 * @returns {boolean} <kw>true</kw>
	 */
	'true': function() {return true},
	/**
	 * Return <kw>false</kw>
	 * @returns {boolean} <kw>false</kw>
	 */
	'false': function() {return false}

};
/**
 * Settings for the Firestorm library
 */
Firestorm.schema = {
	dom: {
		/**
		 * Allow using of Range API, if browser is capable of it
		 * @const
		 */
		PREFER_RANGE_API: false
	},
	/**
	 * Perform DEBUG checks. May be <kw>false</kw> in production,
	 * but it's strictly recommended to keep it <kw>true</kw> during development and testing
	 * @define
	 */
	DEBUG: true
};

// you may remove this file from release build
Firestorm.KNOWN_EXCEPTIONS = {
	'1': "Firestorm: framework requires initialization"
};
/**
 * Checks for browser bugs and capabilities, provides common interfaces for browser-specific extensions
 */
Firestorm.Environment = {

	/**
	 * opera|ie|firefox|chrome|safari|unknown
	 * @type {string}
	 */
	browser_name: null,
	/**
	 * Browser version number
	 * @type {string}
	 */
	browser_version: null,
	/**
	 * ios|windows|other|?
	 * @type {number}
	 */
	platform: null,

	//SUPPORTS_FUNCTION_SERIALIZATION: false,
	/**
	 * Supports HTML Range API
	 */
	SUPPORTS_RANGE: false,
	/**
	 * Internet Explorer < 9 strips SCRIPT and STYLE tags from beginning of innerHTML
	 */
	STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS: false,
	/**
	 * IE 8 (and likely earlier) likes to move whitespace preceding a script tag to appear after it.
	 * This means that we can accidentally remove whitespace when updating a morph
	 */
	MOVES_WHITESPACE_BEFORE_SCRIPT: false,
	/**
	 * IE8 and IE9 have bugs in "input" event, see
	 * http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
	 */
	NEEDS_INPUT_EVENT_SHIM: false,
	/**
	 * Calls requestAnimationFrame, if browser supports it. Actual method name may have a vendor prefix in different browsers.
	 * If browser does not support requestAnimationFrame - this method will be <kw>null</kw>
	 * @param {function} callback
	 */
	requestAnimationFrame: function(callback) { Firestorm.t(1); },

	/**
	 * Perform the object initialization
	 */
	init: function() {

		var document = window.document,
			test_node,
			requestAnimationFrame;

		this.browser_name = Browser.name;
		this.browser_version = Browser.version;
		this.platform = Browser.platform;

		// all, even old browsers, must be able to convert a function back to sources
		//this.SUPPORTS_FUNCTION_SERIALIZATION = /xyz/.test(function(){xyz;});

		// last check is for IE9 which only partially supports ranges
		this.SUPPORTS_RANGE = ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment;

		test_node = document.createElement('div');
		test_node.innerHTML = "<div></div>";
		test_node.firstChild.innerHTML = "<script></script>";
		this.STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS = test_node.firstChild.innerHTML === '';

		test_node.innerHTML = "Test: <script type='text/x-placeholder'></script>Value";
		this.MOVES_WHITESPACE_BEFORE_SCRIPT = test_node.childNodes[0].nodeValue === 'Test:' && test_node.childNodes[2].nodeValue === ' Value';

		requestAnimationFrame =
			window.requestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.msRequestAnimationFrame;

		this.requestAnimationFrame = requestAnimationFrame ? function(fn) { requestAnimationFrame.call(window, fn); } : null;

		this.NEEDS_INPUT_EVENT_SHIM = ("documentMode" in document) && document.documentMode < 10;

	}

};
/**
 * Methods for working with DOM elements
 */
Firestorm.Element = {

	/**
	 * Attach DOM listener to an element
	 * @param {HTMLElement} element The DOM element for attaching the event
	 * @param {string} event_name Name of DOM event
	 * @param {function} callback Callback for the listener
	 * @param {boolean} capture Use capturing phase
	 */
	addListener: function(element, event_name, callback, capture) {

		document.id(element).addEvent(event_name, callback, capture);

	},

	/**
	 * Detach DOM listener
	 * @param {HTMLElement} element
	 * @param {string} event_name
	 * @param {function} callback
	 */
	removeListener: function(element, event_name, callback) {

		document.id(element).removeEvent(event_name, callback);

	},

	/**
	 * Route events from elements inside `element` that match the `selector`
	 * @param {HTMLElement} element
	 * @param {string} event_name
	 * @param {string} selector CSS selector
	 * @param {function} callback
	 */
	addDelegation: function(element, event_name, selector, callback) {

		document.id(element).addEvent(event_name + ':relay(' + selector + ')', callback);

	},

	/**
	 * Stop delegating events
	 * @param {HTMLElement} element
	 * @param {string} event_name
	 * @param {string} selector CSS selector
	 * @param {function} callback
	 */
	removeDelegation: function(element, event_name, selector, callback) {

		document.id(element).removeEvent(event_name + ':relay(' + selector + ')', callback);

	},

	/**
	 * Remove an element from DOM and clean all framework dependencies on that element.
	 * Destroyed elements cannot be reused
	 * @param {HTMLElement} element
	 */
	destroy: function(element) {

		document.id(element).destroy();

	},

	/**
	 * Remove the element from DOM tree. After removal it may be inserted back
	 * @param {HTMLElement} element
	 */
	remove: function(element) {

		if (element.parentNode) {

			element.parentNode.removeChild(element);

		}

	},

	/**
	 * Perform search by id for {@link Firestorm.Element#findChildById}
	 * @param {HTMLElement} element
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
	_findChildById: function(element, id) {

		var count,
			i,
			node,
			result = null;

		for (i = 0, count = element.childNodes.length; i < count; i++) {

			node = element.childNodes[i];
			if (node.nodeType == 1) {

				if (node.getAttribute('id') === id) {

					result = node;
					break;

				} else {

					result = this.findChildById(node, id);
					if (result) {
						break;
					}

				}

			}

		}

		return result;

	},

	/**
	 * Traverse element's children and find a child with given `id`
	 * @param {HTMLElement} element
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
	findChildById: function(element, id) {

		return (element.getAttribute('id') === id) ? element : this._findChildById(element, id);

	},

	/**
	 * Insert an element relatively to `parent` element
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 * @param {_eInsertPosition} where
	 */
	insertElement: function(parent, element, where) {

		this['insertElement' + where](parent, element);

	},

	/**
	 * Insert an element inside `parent`, at the top of it
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 */
	insertElementTop: function(parent, element) {

		parent.insertBefore(element, parent.firstChild);

	},

	/**
	 * Insert an element inside `parent`, at the bottom of it
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} element
	 */
	insertElementBottom: function(parent, element) {

		parent.appendChild(element);

	},

	/**
	 * Insert `target_element` just before `context`
	 * @param {HTMLElement} context
	 * @param {HTMLElement} target_element Element that is being inserted
	 */
	insertElementBefore: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context);

	},

	/**
	 * Insert `target_element` after `context`
	 * @param {HTMLElement} context
	 * @param {HTMLElement} target_element Element that is being inserted
	 */
	insertElementAfter: function(context, target_element) {

		context.parentNode.insertBefore(target_element, context.nextSibling);

	},

	/**
	 * Get elements, that are children of `element` and match the given `selector`
	 * @param {HTMLElement} element Root element
	 * @param {string} selector CSS selector
	 * @returns {Array.<HTMLElement>}
	 */
	selectElements: function(element, selector) {

		return Slick.search(element, selector, []);

	}

};

Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

	/**
	 * Set a property on an element
	 * @param {HTMLElement} element Target element
	 * @param {string} name Property name
	 * @param {*} value Property value
	 */
	setProperty: function(element, name, value) {

		document.id(element).set(name, value);

	},

	/**
	 * Get element's property
	 * @param {HTMLElement} element
	 * @param {string} name
	 * @returns {*}
	 */
	getProperty: function(element, name) {

		return document.id(element).get(name);

	},

	/**
	 * Remove property from the element
	 * @param {HTMLElement} element
	 * @param {string} name
	 */
	removeProperty: function(element, name) {

		document.id(element).setProperty(name, null);

	},

	/**
	 * Does an element have an attribute
	 * @param {HTMLElement} element
	 * @param {string} name Attribute name
	 * @returns {boolean} True, if attribute exists
	 */
	hasAttribute: function(element, name) {

		return Slick.hasAttribute(element, name);

	},

	/**
	 * Get attribute value from the element
	 * @param {HTMLElement} element
	 * @param {string} name Attribute name
	 * @returns {string} The attribute value
	 */
	getAttribute: function(element, name) {

		return Slick.getAttribute(element, name);

	},

	/**
	 * Get element's tag name
	 * @param {HTMLElement} element
	 * @returns {string}
	 */
	getTagName: function(element) {

		return element.nodeName.toLowerCase();

	},

	/**
	 * Get element's `outerHTML`
	 * @param {HTMLElement} element
	 * @returns {string}
	 */
	getOuterHTML: function(element) {

		return element.outerHTML;

	}

});

Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

	/**
	 * Get element's dimensions
	 * @param element
	 * @returns {{x: number, y: number}} An object with element's dimensions
	 */
	getSize: function(element) {

		if (Firestorm.schema.DEBUG && (['body', 'html'].indexOf(element.nodeName.toLowerCase()) != -1))
			Firestorm.t('This method requires an element inside the body tag.');

		return {x: element.offsetWidth, y: element.offsetHeight};

	}

});

Firestorm.extend(
Firestorm.Element,
/**
 * @lends Firestorm.Element
 */
{

	/**
	 * Set one CSS property in element's "style" attribute
	 * @param {HTMLElement} element
	 * @param {string} name
	 * @param {string} value
	 */
	setStyle: function(element, name, value) {

		document.id(element).setStyle(name, value);

	},

	/**
	 * Set CSS property, which accepts a list of pixel values (like <str>"border: 1px 2px 3px 4px"</str>)
	 * Rounds numbers and adds 'px' before setting them to element
	 *
	 * @param {HTMLElement} element
	 * @param {string} name
	 * @param {(Array.<(number)>)} value
	 */
	setPixels: function(element, name, value) {

		var style = '';

		for (var i = 0, count = value.length; i < count; i++) {

			if (Firestorm.schema.DEBUG && typeof value[i] != "number") Firestorm.t("Invalid argument passed to setPixels");
			style += Math.round(value[i]) + 'px ';

		}

		this.setStyle(element, name, style);

	},

	/**
	 * Get value of CSS style property
	 * @param {HTMLElement} element
	 * @param {string} name Name of the property, like <str>"height"</str>
	 * @returns {*}
	 */
	getStyle: function(element, name) {

		return document.id(element).getStyle(name);

	},

	/**
	 * Set element's opacity
	 * @param {HTMLElement} element
	 * @param {(string|number)} value 0 <= value <= 1
	 */
	setOpacity: function(element, value) {

		document.id(element).set('opacity', value);

	},

	/**
	 * Get element's opacity
	 * @param {HTMLElement} element
	 * @returns {*}
	 */
	getOpacity: function(element) {

		return document.id(element).get('opacity');

	},

	/**
	 * Add another class to collection of element's classes. Will not do anything, if class already exists
	 * @param {HTMLElement} element
	 * @param {string} class_name The class name to add
	 */
	addClass: function(element, class_name) {

		document.id(element).addClass(class_name);

	},

	/**
	 * Remove a class from the list of element's classes. Will do nothing, if class does not exist
	 * @param {HTMLElement} element
	 * @param {string} class_name
	 */
	removeClass: function(element, class_name) {

		document.id(element).removeClass(class_name);

	},

	/**
	 * Add a list of classes to element
	 * @param {HTMLElement} element
	 * @param {Array.<string>} class_list
	 */
	addClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.addClass(element, class_list[i]);

		}

	},

	/**
	 * Remove a list of classes from an element
	 * @param {HTMLElement} element
	 * @param {Array.<string>} class_list
	 */
	removeClasses: function(element, class_list) {

		if (Firestorm.schema.DEBUG && typeof(class_list) == 'string') Firestorm.t();

		for (var i = 0, count = class_list.length; i < count; i++) {

			this.removeClass(element, class_list[i]);

		}

	}

});
/**
 * DOM manipulation methods
 */
Firestorm.DOM = {

	/**
	 * When turning HTML into nodes - it must be inserted into appropriate tags to stay valid
	 */
	_wrap_map: {
		select: [1, "<select multiple='multiple'>", "</select>"],
		fieldset: [1, "<fieldset>", "</fieldset>"],
		table: [1, "<table>", "</table>"],
		tbody: [2, "<table><tbody>", "</tbody></table>"],
		thead: [2, "<table><tbody>", "</tbody></table>"],
		tfoot: [2, "<table><tbody>", "</tbody></table>"],
		tr: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
		colgroup: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
		map: [1, "<map>", "</map>"]
	},

	/**
	 * Workaround for browser bugs in IE. Copied from {@link Firestorm.Environment#STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS}
	 */
	_needs_shy: false,
	/**
	 * Workaround for browser bugs in IE. Copied from {@link Firestorm.Environment#MOVES_WHITESPACE_BEFORE_SCRIPT}
	 */
	_moves_whitespace: false,

	/**
	 * Init the object: choose appropriate methods for DOM manipulation, depending on browser capabilities
	 */
	init: function() {

		var e = Firestorm.Environment;

		this._needs_shy = e.STRIPS_INNER_HTML_SCRIPT_AND_STYLE_TAGS;
		this._moves_whitespace = e.MOVES_WHITESPACE_BEFORE_SCRIPT;

		if (Firestorm.schema.dom.PREFER_RANGE_API && e.SUPPORTS_RANGE) {

			this.insertHTMLBefore = this.insertHTMLBefore_Range;
			this.insertHTMLAfter = this.insertHTMLAfter_Range;
			this.insertHTMLTop = this.insertHTMLTop_Range;
			this.insertHTMLBottom = this.insertHTMLBottom_Range;
			this.clearOuterRange = this.clearOuterRange_Range;
			this.clearInnerRange = this.clearInnerRange_Range;
			this.replaceInnerRange = this.replaceInnerRange_Range;
			this.moveRegionAfter = this.moveRegionAfter_Range;
			this.moveRegionBefore = this.moveRegionBefore_Range;

		} else {

			this.insertHTMLBefore = this.insertHTMLBefore_Nodes;
			this.insertHTMLAfter = this.insertHTMLAfter_Nodes;
			this.insertHTMLTop = this.insertHTMLTop_Nodes;
			this.insertHTMLBottom = this.insertHTMLBottom_Nodes;
			this.clearOuterRange = this.clearOuterRange_Nodes;
			this.clearInnerRange = this.clearInnerRange_Nodes;
			this.replaceInnerRange = this.replaceInnerRange_Nodes;
			this.moveRegionAfter = this.moveRegionAfter_Nodes;
			this.moveRegionBefore = this.moveRegionBefore_Nodes;

		}

	},

	/**
	 * Turn given HTML into DOM nodes and insert them before the given element
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBefore: function(element, html) { Firestorm.t(1); },
	/**
	 * Turn given HTML into DOM nodes and insert them after the given element
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLAfter: function(element, html) { Firestorm.t(1); },
	/**
	 * Turn given HTML into DOM nodes and insert them inside the given element, at the top of it
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLTop: function(element, html) { Firestorm.t(1); },
	/**
	 * Turn given HTML into DOM nodes and insert them inside the given element, at the bottom
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBottom: function(element, html) { Firestorm.t(1); },

	/**
	 * Remove all HTML nodes between the given elements and elements themselves
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearOuterRange: function(start_element, end_element) { Firestorm.t(1); },
	/**
	 * Remove all HTML nodes between the given elements
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearInnerRange: function(start_element, end_element) { Firestorm.t(1); },
	/**
	 * Remove all HTML nodes between the elements and insert the given html there
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @param {string} html
	 */
	replaceInnerRange: function(start_element, end_element, html) { Firestorm.t(1); },
	/**
	 * Move `region_start_element`, `region_end_element` and all elements between them before `target`
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionBefore: function(target, region_start_element, region_end_element) { Firestorm.t(1); },
	/**
	 * Move `region_start_element`, `region_end_element` and all elements between them after `target`
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionAfter: function(target, region_start_element, region_end_element) { Firestorm.t(1); },

	/**
	 * Turn HTML into nodes and insert them relatively to the given element
	 * @param {HTMLElement} element
	 * @param {string} html
	 * @param {_eInsertPosition} [position='Bottom']
	 */
	insertHTML: function(element, html, position) {

		this['insertHTML' + (position || 'Bottom')](element, html);

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// nodes api

	/**
	 * Set the element's innerHTML, taking into account various browser bugs
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	_setInnerHTML: function(element, html) {

		var matches,
			count,
			i,
			script;

		if (this._moves_whitespace) {
			matches = [];
			// Right now we only check for script tags with ids with the goal of targeting morphs.
			// Remove space before script to insert it later.
			html = html.replace(/(\s+)(<script id='([^']+)')/g, function(match, spaces, tag, id) {
				matches.push([id, spaces]);
				return tag;
			});

		}

		element.innerHTML = html;

		// If we have to do any whitespace adjustments, do them now
		if (matches && matches.length > 0) {

			count = matches.length;
			for (i = 0; i < count; i++) {
				script = Firestorm.Element.findChildById(element, matches[i][0]);
				script.parentNode.insertBefore(document.createTextNode(matches[i][1]), script);
			}

		}

	},

	/**
	 * Given a parent node and some HTML, generate a set of nodes. Return the first
	 * node, which will allow us to traverse the rest using nextSibling.
	 *
	 * In cases of certain elements like tables and lists we cannot just assign innerHTML and get the nodes,
	 * cause innerHTML is either readonly on them in IE, or it would destroy some of the content
	 *
	 * @param {HTMLElement} parentNode
	 * @param {string} html
	 **/
	_firstNodeFor: function(parentNode, html) {

		var map = this._wrap_map[parentNode.nodeName.toLowerCase()] || [ 0, "", "" ],
			depth = map[0],
			start = map[1],
			end = map[2],
			element,
			i,
			shy_element;

		if (this._needs_shy) {
			// make the first tag an invisible text node to retain scripts and styles at the beginning
			html = '&shy;' + html;
		}

		element = document.createElement('div');

		this._setInnerHTML(element, start + html + end);

		for (i = 0; i <= depth; i++) {

			element = element.firstChild;

		}

		if (this._needs_shy) {

			// Look for &shy; to remove it.
			shy_element = element;

			// Sometimes we get nameless elements with the shy inside
			while (shy_element.nodeType === 1 && !shy_element.nodeName) {
				shy_element = shy_element.firstChild;
			}

			// At this point it's the actual unicode character.
			if (shy_element.nodeType === 3 && shy_element.nodeValue.charAt(0) === "\u00AD") {
				shy_element.nodeValue = shy_element.nodeValue.slice(1);
			}

		}

		return element;

	},

	/**
	 * Remove everything between two tags
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearInnerRange_Nodes: function(start_element, end_element) {

		var parent_node = start_element.parentNode,
			node = start_element.nextSibling;

		while (node && node !== end_element) {

			parent_node.removeChild(node);
			node = start_element.nextSibling;

		}

	},

	/**
	 * Version of clearOuterRange, which manipulates HTML nodes
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearOuterRange_Nodes: function(start_element, end_element) {

		this.clearInnerRange_Nodes(start_element, end_element);
		start_element.parentNode.removeChild(start_element);
		end_element.parentNode.removeChild(end_element);

	},

	/**
	 * Version of replaceInnerRange, which manipulates HTML nodes
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @param {string} html
	 */
	replaceInnerRange_Nodes: function(start_element, end_element, html) {

		this.clearInnerRange_Nodes(start_element, end_element);
		this.insertHTMLBefore_Nodes(end_element, html);

	},

	/**
	 * Turn HTML into nodes with respect to the parent node and sequentially insert them before `insert_before` element
	 * @param {HTMLElement} parent_node
	 * @param {string} html
	 * @param {HTMLElement} insert_before
	 */
	_insertHTMLBefore: function(parent_node, html, insert_before) {

		var node,
			next_sibling;

		node = this._firstNodeFor(parent_node, html);

		while (node) {
			next_sibling = node.nextSibling;
			parent_node.insertBefore(node, insert_before);
			node = next_sibling;
		}

	},

	/**
	 * Version of insertHTMLAfter which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLAfter_Nodes: function(element, html) {

		this._insertHTMLBefore(element.parentNode, html, element.nextSibling);

	},

	/**
	 * Version of insertHTMLBefore which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBefore_Nodes: function(element, html) {

		this._insertHTMLBefore(element.parentNode, html, element);

	},

	/**
	 * Version of insertHTMLTop which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLTop_Nodes: function(element, html) {

		this._insertHTMLBefore(element, html, element.firstChild);

	},

	/**
	 * Version of insertHTMLBottom which works with nodes
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBottom_Nodes: function(element, html) {

		this._insertHTMLBefore(element, html, null);

	},

	/**
	 * Perform movement of a range of nodes
	 * @param {HTMLElement} parent
	 * @param {HTMLElement} target
	 * @param {HTMLElement} node
	 * @param {HTMLElement} region_end_element
	 */
	_moveRegionBefore: function(parent, target, node, region_end_element) {

		var next_sibling;

		while (node && node !== region_end_element) {
			next_sibling = node.nextSibling;
			parent.insertBefore(node, target);
			node = next_sibling;
		}
		parent.insertBefore(region_end_element, target);

	},

	/**
	 * Version of `moveRegionBefore`, which works with DOM nodes.
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionBefore_Nodes: function(target, region_start_element, region_end_element) {

		this._moveRegionBefore(target.parentNode, target, region_start_element, region_end_element);

	},

	/**
	 * Version of `moveRegionAfter`, which works with DOM nodes.
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionAfter_Nodes: function(target, region_start_element, region_end_element) {

		this._moveRegionBefore(target.parentNode, target.nextSibling, region_start_element, region_end_element);

	},

	// endL nodes api
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// range api

	/**
	 * Create a Range object, with limits between the given elements
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @returns {Range|TextRange}
	 */
	_createInnerRange: function(start_element, end_element) {

		var range = document.createRange();
		range.setStartAfter(start_element);
		range.setEndBefore(end_element);
		return range;

	},

	/**
	 * Create a Range object, which includes the given elements
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @returns {Range|TextRange}
	 */
	_createOuterRange: function(start_element, end_element) {

		var range = document.createRange();
		range.setStartBefore(start_element);
		range.setEndAfter(end_element);
		return range;

	},

	/**
	 * Version of replaceInnerRange, which works with Range API
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 * @param {string} html
	 */
	replaceInnerRange_Range: function(start_element, end_element, html) {

		var range = this._createInnerRange(start_element, end_element);

		range.deleteContents();
		range.insertNode(range.createContextualFragment(html));
	},

	/**
	 * Version of clearOuterRange, which works with Range API
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearOuterRange_Range: function(start_element, end_element) {

		var range = this._createOuterRange(start_element, end_element);
		range.deleteContents();

	},

	/**
	 * Version of clearInnerRange, which works with Range API
	 * @param {HTMLElement} start_element
	 * @param {HTMLElement} end_element
	 */
	clearInnerRange_Range: function(start_element, end_element) {

		var range = this._createInnerRange(start_element, end_element);
		range.deleteContents();

	},

	/**
	 * Version of insertHTMLAfter, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLAfter_Range: function(element, html) {

		var range = document.createRange();
		range.setStartAfter(element);
		range.setEndAfter(element);

		range.insertNode(range.createContextualFragment(html));

	},

	/**
	 * Version of insertHTMLBefore, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBefore_Range: function(element, html) {

		var range = document.createRange();
		range.setStartBefore(element);
		range.setEndBefore(element);

		range.insertNode(range.createContextualFragment(html));

	},

	/**
	 * Version of insertHTMLTop, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLTop_Range: function(element, html) {

		var range = document.createRange();
		range.setStart(element, 0);
		range.collapse(true);
		range.insertNode(range.createContextualFragment(html));

	},

	/**
	 * Version of insertHTMLBottom, which works with Range API
	 * @param {HTMLElement} element
	 * @param {string} html
	 */
	insertHTMLBottom_Range: function(element, html) {

		var last_child = element.lastChild,
			range;

		if (last_child) {

			range = document.createRange();
			range.setStartAfter(last_child);
			range.collapse(true);
			range.insertNode(range.createContextualFragment(html));

		} else {

			this.insertHTMLTop_Range(element, html);

		}

	},

	/**
	 * Version of `moveRegionBefore`, which works with ranges
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionBefore_Range: function(target, region_start_element, region_end_element) {

		target.parentNode.insertBefore(
			this._createOuterRange(region_start_element, region_end_element).extractContents(),
			target
		);

	},

	/**
	 * Version of `moveRegionAfter`, which works with ranges
	 * @param {HTMLElement} target
	 * @param {HTMLElement} region_start_element
	 * @param {HTMLElement} region_end_element
	 */
	moveRegionAfter_Range: function(target, region_start_element, region_end_element) {

		target.parentNode.insertBefore(
			this._createOuterRange(region_start_element, region_end_element).extractContents(),
			target.nextSibling
		);

	}

	// end: range api
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

};
/**
 * Collection of methods to manipulate arrays
 */
Firestorm.Array = {

	/**
	 * Swap two elements in given array
	 * @param array
	 * @param index_a
	 * @param index_b
	 */
	swap: function(array, index_a, index_b) {
		var temp = array[index_a];
		array[index_a] = array[index_b];
		array[index_b] = temp;
	},

	/**
	 * If array does not contain the given `value` - then push the value into array
	 * @param {Array} array
	 * @param {*} value
	 * @returns {boolean} <kw>true</kw>, if array did not contain the element, <kw>false</kw> if it was already there
	 */
	include: function(array, value) {
		if (array.indexOf(value) == -1) {
			array.push(value);
			return true;
		}
		return false;
	},

	/**
	 * Include all unique values from `source_array` into `dest_array`
	 * @param {Array} dest_array
	 * @param {Array} source_array
	 */
	includeUnique: function(dest_array, source_array) {

		var i = 0,
			count = source_array.length;

		for (; i < count; i++) {
			if (dest_array.indexOf(source_array[i]) == -1) {
				dest_array.push(source_array[i]);
			}
		}

	},

	/**
	 * Remove the first occurence of `value` from `array`
	 * @param {Array} array
	 * @param {*} value
	 * @returns {boolean} <kw>true</kw>, if element was present in array
	 */
	exclude: function(array, value) {
		var index = array.indexOf(value);
		if (index == -1) return false;
		else array.splice(index, 1);
		return true;
	},

	/**
	 * Remove the first occurrence of each value from array. Does not exclude duplicate occurrences
	 * @param array
	 * @param values
	 */
	excludeAll: function(array, values) {
		var index;
		for (var i = 0, count = values.length; i < count; i++) {
			index = array.indexOf(values[i]);
			if (index != -1) {
				array.splice(index, 1);
			}
		}
	},

	/**
	 * Deep clone of array
	 * @param array
	 * @returns {Array}
	 */
	clone: function(array) {

		var count = array.length,
			i = 0,
			result = new Array(count);

		for (;i < count; i++) {

			result[i] = Firestorm.clone(array[i]);

		}

		return result;

	},

	/**
	 * Find the first occurrence `old_value` and replace it with `new_value`
	 * @param array
	 * @param old_value
	 * @param new_value
	 */
	replace: function(array, old_value, new_value) {

		var index = array.indexOf(old_value);
		if (index == -1) Firestorm.t("Array.replace: value is not in array");
		array[index] = new_value;

	}

};

/**
 * Methods and regular expressions to manipulate strings
 */
Firestorm.String = {

	// taken from json2
	/**
	 * Special characters, which must be escaped when serializing (quoting) a string
	 */
	QUOTE_ESCAPE_REGEX: /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	/**
	 * Map for escaping special characters
	 * @type {Object.<string, string>}
	 */
	quote_escape_map: {
		// without these comments JSDoc throws errors
		// https://github.com/jsdoc3/jsdoc/issues/549
		'\b': '\\b',
		/** @alias _1
		 * @ignore */
		'\t': '\\t',
		/** @alias _2
		 * @ignore */
		'\n': '\\n',
		/** @alias _3
		 * @ignore */
		'\f': '\\f',
		/** @alias _4
		 * @ignore */
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	},

	/**
	 * HTML special entities that must be escaped in attributes and similar cases
	 * @type {Object.<string, string>}
	 */
	escape_chars: {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#x27;",
		"`": "&#x60;"
	},

	/**
	 * Reverse map of HTML entities to perform unescaping
	 */
	unescape_chars: {
		"&amp;": "&",
		"&lt;": "<",
		"&gt;": ">",
		"&quot;": '"',
		"&#x27;": "'",
		"&#x60;": "`"
	},

	/**
	 * Characters which must be escaped in a string, which is part of HTML document
	 */
	HTML_ESCAPE_REGEX: /[<>\&]/g,
	/**
	 * Characters that nust be escaped in HTML attributes
	 */
	ATTRIBUTE_ESCAPE_REGEX: /[&<>\"\'\`]/g,
	/**
	 * Characters that must be escaped when creating a &lt;textarea&gt; tag with initial content
	 */
	TEXTAREA_ESCAPE_REGEX: /[<>&\'\"]/g,
	/**
	 * Characters, which are escaped by the browser, when getting innerHTML of elements
	 */
	UNESCAPE_REGEX: /(&amp;|&lt;|&gt;)/g,

	/**
	 * Turn "dashed-string" into "camelCased" string
	 * @param {string} string
	 * @returns {string}
	 */
	camelCase: function(string){

		return string.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});

	},

	/**
	 * Turn "camelCased" string into "dashed-string"
	 * @param {string} string
	 * @returns {string}
	 */
	hyphenate: function(string){

		return string.replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});

	},

	/**
	 * Uppercase the first letter of all words
	 * @param {string} string
	 * @returns {string}
	 */
	capitalize: function(string){
		return string.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	/**
	 * Escape HTML entities found by `regex` argument
	 * @param {string} string
	 * @param {RegExp} regex A regular expression object, such as {@link Firestorm.String#HTML_ESCAPE_REGEX}
	 * @returns {string}
	 */
	escape: function(string, regex) {
		var escape_chars = this.escape_chars;
		return string.replace(
			regex,
			function(chr) { return escape_chars[chr]; }
		);
	},

	/**
	 * Unescape html entities which are escaped by browser (see {@link Firestorm.String#UNESCAPE_REGEX})
	 * @param {string} string
	 * @returns {string}
	 */
	unescape: function(string) {
		var unescape_chars = this.unescape_chars;
		return string.replace(
			this.UNESCAPE_REGEX,
			function(chr) { return unescape_chars[chr] }
		);
	},

	/**
	 * Serialize a string into it's JavaScript representation. If you eval() the result - you will get the original value
	 * @param string
	 * @returns {*}
	 */
	quote: function(string) {

		var result,
			map = this.quote_escape_map;

		if (this.QUOTE_ESCAPE_REGEX.test(string)) {
			result = '"' + string.replace(this.QUOTE_ESCAPE_REGEX, function (a) {
				var c = map[a];
				return typeof c == 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"';
		} else {
			result = '"' + string + '"';
		}

		return result;

	},

	/**
	 * Before constructing regular expressions from user input - you must escape them
	 * @param {string} string
	 * @returns {string}
	 */
	escapeStringForRegExp: function(string) {

		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

	},

	/**
	 * Repeat string `count` times
	 * @param {string} string
	 * @param {number} count
	 * @returns {string}
	 */
	repeat: function(string, count) {

		var result = '';

		while (count > 1) {
			if ((count & 1)) {
				result += string;
			}
			count >>= 1;
			string += string;
		}

		return result + string;

	}

};

/**
 * Collection of methods to manipulate objects
 */
Firestorm.Object = {

	/**
	 * Return <kw>true</kw> for object with no properties, and <kw>false</kw> otherwise
	 * @param {Object} object_instance
	 * @returns {boolean} <kw>true</kw>, if object is empty
	 */
	isEmpty: function(object_instance) {
		// it's much faster than using Object.keys
		//noinspection LoopStatementThatDoesntLoopJS
		for (var name in object_instance) {
			return false;
		}
		return true;
	},

	/**
	 * Deep clone of given object
	 * @param {Object} object
	 * @returns {Object}
	 */
	clone: function(object) {
		var result = {},
			key;

		for (key in object) {

			result[key] = Firestorm.clone(object[key]);

		}

		return result;
	},

	/**
	 * Shallow copy of an object (not a clone)
	 * @param {Object} object
	 * @returns {Object}
	 */
	copy: function(object) {

		var result = {};
		Firestorm.extend(result, object);
		return result;

	}

};
/**
 * Methods to manipulate Dates
 */
Firestorm.Date = {

	/**
	 * Numbers of days in months for non-leap year
	 */
	DAYS_IN_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

	/**
	 * Get number of days in month, with respect to leap years
	 * @param {number} year
	 * @param {number} month
	 * @returns {number}
	 */
	getDaysInMonth: function(year, month) {
		return (month == 1 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0))
			? 29 // february in leap year
			: this.DAYS_IN_MONTH[month];
	}

};

Firestorm.init();

if (typeof module != 'undefined' && module.exports) {

	module.exports = Firestorm;

} else {

	var _previous_instance;

	if (_global != null) {
		_previous_instance = _global.Firestorm;
	}

	Firestorm.noConflict = function () {
		_global.Firestorm = _previous_instance;
		return Firestorm;
	};

	_global.Firestorm = Firestorm;

}

}(this));