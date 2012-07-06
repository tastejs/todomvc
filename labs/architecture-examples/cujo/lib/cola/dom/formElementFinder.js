(function (define) {
define(function () {
"use strict";

	var formNodeRx = /^form$/i;

	/**
	 * Simple function to find a form element.
	 * @param rootNode {HTMLElement} form node to search under
	 * @param nodeName {String} form element to find
	 * @return {HTMLElement}
	 */
	return function formElementFinder (rootNode, nodeName) {
		// use form.elements if this is a form
		if (rootNode.elements && rootNode.elements.length) {
			return rootNode.elements[nodeName];
		}
	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));