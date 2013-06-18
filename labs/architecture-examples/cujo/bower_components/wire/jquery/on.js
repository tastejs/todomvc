/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/dojo/on plugin
 * wire plugin that provides an "on" facet that uses dojo/on (dojo 1.7
 * and later) to connect to dom events, and includes support for delegation
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function (define) {
define(['../lib/plugin-base/on', 'jquery'], function(createOnPlugin, jquery) {

	/**
	 * Listens for dom events at the given node.  If a selector is provided,
	 * events are filtered to only nodes matching the selector.  Note, however,
	 * that children of the matching nodes can also fire events that bubble.
	 * To determine the matching node, use the event object's selectorTarget
	 * property instead of it's target property.
	 * @param node {HTMLElement} element at which to listen
	 * @param event {String} event name ('click', 'mouseenter')
	 * @param handler {Function} handler function with the following signature: function (e) {}
	 * @param [selector] {String} optional css query string to use to
	 */
	function on (node, event, handler /*, selector */) {
		var selector;

		selector = arguments[3];
		handler = makeEventHandler(handler, selector);

		if (selector) {
			jquery(node).on(event, selector, handler);
			return function () {
				jquery(node).off(event, selector, handler);
			}
		}
		else {
			jquery(node).on(event, handler);
			return function () {
				jquery(node).off(event, handler);
			}
		}
	}

	on.wire$plugin = createOnPlugin({
		on: on
	});

	return on;

	function makeEventHandler (handler, selector) {
		return function (e, o) {
			if (selector) e.selectorTarget = this;
			handler(e, o);
		}
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (deps, factory) { module.exports = factory.apply(this, deps.map(require)); }
));
