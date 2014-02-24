/*global NodeList */
(function (window) {
	'use strict';

	// Get element(s) by CSS selector:
	window.$$ = function (selector, scope) {
		return (scope || document).querySelector(selector);
	};
	window.$ = function (selector, scope) {
		return (scope || document).querySelectorAll(selector);
	};

	// Register events on elements that may or may not exist yet:
	// $live('div a', 'click', function (event) {});
	window.$live = (function () {
		var eventRegistry = {};

		function dispatchEvent(event) {
			var targetElement = event.target;

			eventRegistry[event.type].forEach(function (entry) {
				var potentialElements = window.$(entry.selector);
				var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

				if (hasMatch) {
					entry.handler.call(entry.handlerScope || targetElement, event);
				}
			});
		}

		return function (selector, event, handler, handlerScope) {
			if (!eventRegistry[event]) {
				eventRegistry[event] = [];
				document.documentElement.addEventListener(event, dispatchEvent, true);
			}

			eventRegistry[event].push({
				selector: selector,
				handler: handler,
				handlerScope: handlerScope
			});
		};
	}());

	// Find the element's parent with the given tag name:
	// $parent($$('a'), 'div');
	window.$parent = function (element, tagName) {
		if (!element.parentNode) {
			return;
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}
		return window.$parent(element.parentNode, tagName);
	};

	// Allow for looping on nodes by chaining:
	// $('.foo').forEach(function () {})
	NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
