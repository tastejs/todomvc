// Allow for looping on nodes by chaining:
// qsa('.foo').forEach(function () {})
NodeList.prototype.forEach = Array.prototype.forEach;

// Get element(s) by CSS selector:
export function qs(selector, scope) {
	return (scope || document).querySelector(selector);
}

export function qsa(selector, scope) {
	return (scope || document).querySelectorAll(selector);
}

// addEventListener wrapper:
export function $on(target, type, callback, useCapture) {
	target.addEventListener(type, callback, !!useCapture);
}

// Attach a handler to event for all elements that match the selector,
// now or in the future, based on a root element
export function $delegate(target, selector, type, handler) {
	const dispatchEvent = event => {
		const targetElement = event.target;
		const potentialElements = qsa(selector, target);
		const hasMatch = Array.from(potentialElements).includes(targetElement);

		if (hasMatch) {
			handler.call(targetElement, event);
		}
	};

	// https://developer.mozilla.org/en-US/docs/Web/Events/blur
	const useCapture = type === 'blur' || type === 'focus';

	$on(target, type, dispatchEvent, useCapture);
}

// Find the element's parent with the given tag name:
// $parent(qs('a'), 'div')
export function $parent(element, tagName) {
	if (!element.parentNode) {
		return;
	}

	if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
		return element.parentNode;
	}

	return $parent(element.parentNode, tagName);
}
