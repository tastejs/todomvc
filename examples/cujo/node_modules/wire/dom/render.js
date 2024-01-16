/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/dom/render plugin
 * wire plugin that provides a factory for dom nodes via a simple html
 * template.
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

define(['./../lib/dom/base', 'when'], function (base, when) {

	var parentTypes, parseTemplateRx, getFirstTagNameRx, isPlainTagNameRx,
		pluginInstance, undef;

	// elements that could be used as root nodes and their natural parent type
	parentTypes = {
		'li': 'ul',
		'td': 'tr',
		'tr': 'tbody',
		'tbody': 'table',
		'thead': 'table',
		'tfoot': 'table',
		'caption': 'table',
		'col': 'table',
		'colgroup': 'table',
		'option': 'select'
	};

	parseTemplateRx = /\$\{([^}]*)\}/g;
	getFirstTagNameRx = /<\s*(\w+)/;
	isPlainTagNameRx = /^[A-Za-z]\w*$/;

	/**
	 * Constructs a DOM node and child nodes from a template string.
	 * Information contained in a hashmap is merged into the template
	 * via tokens (${name}) before rendering into DOM nodes.
	 * Nothing is done with the css parameter at this time.
	 * @param template {String} html template
	 * @param hashmap {Object} string replacements hash
	 * @param optRefNode {HTMLElement} node to replace with root node of rendered template
	 * @returns {HTMLElement}
	 */
	function render (template, hashmap, optRefNode /*, optCss */) {
		var node;

		// replace tokens (before attempting to find top tag name)
		template = replaceTokens('' + template, hashmap);

		if (isPlainTagNameRx.test(template)) {
			// just 'div' or 'a' or 'tr', for example
			node = document.createElement(template);
		}
		else {
			// create node from template
			node = createElementFromTemplate(template);
		}

		if (optRefNode) {
			node = safeReplaceElement(node, optRefNode);
		}

		return node;
	}

	pluginInstance = {
		factories: {
			render: domRenderFactory
		},
		proxies: [
			base.proxyNode
		]
	};

	render.wire$plugin = function (/* options */) {
		return pluginInstance;
	};

	/**
	 * Finds the first html element in a string, extracts its tag name,
	 * and looks up the natural parent element tag name for this element.
	 * @private
	 * @param template {String}
	 * @returns {String} the parent tag name, or 'div' if none was found.
	 */
	function getParentTagName (template) {
		var matches;

		// TODO: throw if no element was ever found?
		matches = template.match(getFirstTagNameRx);

		return parentTypes[matches && matches[1]] || 'div';
	}

	/**
	 * Creates an element from a text template.  This function does not
	 * support multiple elements in a template.  Leading and trailing
	 * text and/or comments are also ignored.
	 * @private
	 * @param template {String}
	 * @returns {HTMLElement} the element created from the template
	 */
	function createElementFromTemplate (template) {
		var parentTagName, parent, first, tooMany, node;

		parentTagName = getParentTagName(template);
		parent = document.createElement(parentTagName);
		parent.innerHTML = template;

		// we just want to return first element (nodelists and fragments
		// are tricky), so we ensure we only have one.
		// TODO: try using DocumentFragments to allow multiple root elements

		// try html5-ish API
		if ('firstElementChild' in parent) {
			first = parent.firstElementChild;
			tooMany = first != parent.lastElementChild;
		}
		else {
			// loop through nodes looking for elements
			node = parent.firstChild;
			while (node && !tooMany) {
				if (node.nodeType == 1 /* 1 == element */) {
					if (!first) first = node;
					else tooMany = true;
				}
				node = node.nextSibling;
			}
		}

		if (!first) {
			throw new Error('render: no element found in template.');
		}
		else if (tooMany) {
			throw new Error('render: only one root element per template is supported.');
		}

		return first;
	}

	/**
	 * Creates rendered dom trees for the "render" factory.
	 * @param resolver
	 * @param componentDef
	 * @param wire
	 */
	function domRenderFactory (resolver, componentDef, wire) {
		when(wire(componentDef.options), function (options) {
			var template;
			template = options.template || options;
			return render(template, options.replace, options.at, options.css);
		}).then(resolver.resolve, resolver.reject);
	}

	/**
	 * Replaces a dom node, while preserving important attributes
	 * of the original.
	 * @private
	 * @param oldNode {HTMLElement}
	 * @param newNode {HTMLElement}
	 * @returns {HTMLElement} newNode
	 */
	function safeReplaceElement (newNode, oldNode) {
		var i, attr, parent;

		for (i = 0; i < oldNode.attributes.length; i++) {
			attr = oldNode.attributes[i];
			if ('class' == attr.name) {
				// merge css classes
				// TODO: if we want to be smart about not duplicating classes, implement spliceClassNames from cola/dom/render
				newNode.className = (oldNode.className ? oldNode.className + ' ' : '')
					+ newNode.className;
			}
			// Note: IE6&7 don't support node.hasAttribute() so we're using node.attributes
			else if (!newNode.attributes[attr.name]) {
				newNode.setAttribute(attr.name, oldNode.getAttribute(attr.name));
			}
		}
		parent = oldNode.parentNode;
		if (parent) {
			parent.replaceChild(newNode, oldNode);
		}
		return newNode;
	}

	/**
	 * Replaces simple tokens in a string.  Tokens are in the format ${key}.
	 * Tokens are replaced by values looked up in an associated hashmap.
	 * If a token's key is not found in the hashmap, an empty string is
	 * inserted instead.
	 * @private
	 * @param template
	 * @param hashmap {Object} the names of the properties of this object
	 * are used as keys. The values replace the token in the string.
	 * @param [missing] {Function} callback that deals with missing properties
	 * @returns {String}
	 */
	function replaceTokens (template, hashmap, missing) {
		if (!hashmap) {
			return template;
		}

		if (!missing) {
			missing = blankIfMissing;
		}

		return template.replace(parseTemplateRx, function (m, token) {
			return missing(findProperty(hashmap, token));
		});
	}

	function findProperty (obj, propPath) {
		var props, prop;
		props = propPath.split('.');
		while (obj && (prop = props.shift())) {
			obj = obj[prop];
		}
		return obj;
	}

	function blankIfMissing (val) { return val == undef ? '' : val; }

	return render;

});
