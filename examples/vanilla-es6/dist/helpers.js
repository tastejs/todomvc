// Allow for looping on nodes by chaining:
// qsa('.foo').forEach(function () {})
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.qs = qs;
exports.qsa = qsa;
exports.$on = $on;
exports.$delegate = $delegate;
exports.$parent = $parent;
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
		var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

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

function $parent(_x, _x2) {
	var _again = true;

	_function: while (_again) {
		var element = _x,
		    tagName = _x2;
		_again = false;

		if (!element.parentNode) return;

		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}

		_x = element.parentNode;
		_x2 = tagName;
		_again = true;
		continue _function;
	}
}