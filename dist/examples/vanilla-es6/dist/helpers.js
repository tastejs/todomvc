'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.qs = qs;
exports.qsa = qsa;
exports.$on = $on;
exports.$delegate = $delegate;
exports.$parent = $parent;
// Allow for looping on nodes by chaining:
// qsa('.foo').forEach(function () {})
NodeList.prototype.forEach = Array.prototype.forEach;

// Get element(s) by CSS selector:
function qs(selector, scope) {
	return (scope || document).querySelector(selector);
}

function qsa(selector, scope) {
	return (scope || document).querySelectorAll(selector);
}

// addEventListener wrapper:
function $on(target, type, callback, useCapture) {
	target.addEventListener(type, callback, !!useCapture);
}

// Attach a handler to event for all elements that match the selector,
// now or in the future, based on a root element
function $delegate(target, selector, type, handler) {
	var dispatchEvent = function dispatchEvent(event) {
		var targetElement = event.target;
		var potentialElements = qsa(selector, target);
		var hasMatch = Array.from(potentialElements).includes(targetElement);

		if (hasMatch) {
			handler.call(targetElement, event);
		}
	};

	// https://developer.mozilla.org/en-US/docs/Web/Events/blur
	var useCapture = type === 'blur' || type === 'focus';

	$on(target, type, dispatchEvent, useCapture);
}

// Find the element's parent with the given tag name:
// $parent(qs('a'), 'div')
function $parent(element, tagName) {
	if (!element.parentNode) {
		return;
	}

	if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
		return element.parentNode;
	}

	return $parent(element.parentNode, tagName);
}