/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/dom plugin
 * wire plugin that provides a resource resolver for dom nodes, by id, in the
 * current page.  This allows easy wiring of page-specific dom references into
 * generic components that may be page-independent, i.e. makes it easier to write
 * components that can be used on multiple pages, but still require a reference
 * to one or more nodes on the page.
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

define(['./lib/plugin-base/dom', './lib/dom/base'], function(createDomPlugin, base) {

	return createDomPlugin({
		addClass: base.addClass,
		removeClass: base.removeClass
	});

});