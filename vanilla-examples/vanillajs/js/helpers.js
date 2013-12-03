(function (window) {
	'use strict';

	// Cache the querySelector/All for easier and faster reuse
	window.$ = document.querySelectorAll.bind(document);
	window.$$ = document.querySelector.bind(document);

	window.$live = (function () {
		var eventRegistry = {};

		var globalEventDispatcher = function (e) {
			var targetElement = e.target;

			if (eventRegistry[e.type]) {
				eventRegistry[e.type].forEach(function (entry) {
					var potentialElements = document.querySelectorAll(entry.selector),
						hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

					if (hasMatch) {
						entry.handler(e);
					}
				});
			}
		};

		return function (selector, event, handler) {
			if (!eventRegistry[event]) {
				document.documentElement.addEventListener(event, globalEventDispatcher, true);

				eventRegistry[event] = [];
			}

			eventRegistry[event].push({
				selector: selector,
				handler: handler
			});
		};
	}());

	window.$parent = function (element, tagName) {
		if (!element.parentNode) {
			return;
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}
		return window.$parent(element.parentNode, tagName);
	};

	// Allow for looping on Objects by chaining:
	// $('.foo').each(function () {})
	Object.prototype.each = function (callback) {
		for (var x in this) {
			if (this.hasOwnProperty(x)) {
				callback.call(this, this[x]);
			}
		}
	};
})(window);
