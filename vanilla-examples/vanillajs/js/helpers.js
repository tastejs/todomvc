/*global NodeList */
(function (window) {
	'use strict';

	// Cache the querySelector/All for easier and faster reuse
	window.$ = document.querySelectorAll.bind(document);
	window.$$ = document.querySelector.bind(document);

	// Register events on elements that may or may not exist yet:
	// $live('div a', 'click', function (event) {});
	window.$live = (function () {
		var eventRegistry = {};

		function dispatchEvent(event) {
			var targetElement = event.target;

			eventRegistry[event.type].forEach(function (entry) {
				var potentialElements = document.querySelectorAll(entry.selector);
				var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

				if (hasMatch) {
					entry.handler(event);
				}
			});
		}

		return function (selector, event, handler) {
			if (!eventRegistry[event]) {
				eventRegistry[event] = [];
				document.documentElement.addEventListener(event, dispatchEvent, true);
			}

			eventRegistry[event].push({
				selector: selector,
				handler: handler
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
