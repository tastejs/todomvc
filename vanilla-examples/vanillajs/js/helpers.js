/*global NodeList */
(function (window) {
	'use strict';

	// A wrapper for the native DOM querying methods:
	var methods = {
		'#': 'getElementById',
		'*': 'querySelector',
		'$': 'querySelectorAll',
		'.': 'getElementsByClassName',
		'=': 'getElementsByTagName'
	};
	window.$ = function (selector, scope) {
		return (scope || document)[methods[selector[0]]](selector.slice(1));
	};

	// addEventListener wrapper:
	window.$on = function (target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	};

	// Register events on elements that may or may not exist yet:
	// $live($('.edit', todoList), 'click', function (event) {});
	window.$live = (function () {
		var eventRegistry = {};

		function dispatchEvent(event) {
			var targetElement = event.target;

			eventRegistry[event.type].forEach(function (entry) {
				var hasMatch = Array.prototype.indexOf.call(entry.liveNodes, targetElement) >= 0;

				if (hasMatch) {
					entry.handler.call(targetElement, event);
				}
			});
		}

		return function (liveNodes, event, handler) {
			if (!eventRegistry[event]) {
				eventRegistry[event] = [];
				window.$on(document.documentElement, event, dispatchEvent, true);
			}

			eventRegistry[event].push({
				liveNodes: liveNodes,
				handler: handler
			});
		};
	}());

	// Find the element's parent with the given tag name:
	// $parent($('=a'), 'div');
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
