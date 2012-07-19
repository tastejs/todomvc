/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function (require) {
	"use strict";

	var classList, defaultInvalidClass;

	classList = require('../../dom/classList');

	defaultInvalidClass = 'invalid';

	return function createFormValidationHandler(form, options) {
		var findNode, invalidClass, invalidFieldToNode;

		if(!options) options = {};

		findNode = options.findNode || defaultFindNode;
		invalidClass = 'invalidClass' in options ? options.invalidClass : defaultInvalidClass;

		invalidFieldToNode = {};

		return function formValidationHandler(validationResults) {

			// Simple approach:
			// for each field name, find an associated node on which
			// to apply a validation class name.

			var i, error;

			// Clear previously invalidated nodes first
			removeClasses(form, [invalidClass]);
			for(i in invalidFieldToNode) {
				removeClasses(invalidFieldToNode[i].node, invalidFieldToNode[i].classes);
			}

			// Invalidate the form if results are invalid
			if(validationResults.valid === false) {
				addClasses(form, [invalidClass]);
			}

			if(!validationResults.errors) return;

			// Then, add invalid class to each field that is
			// now invalid
			i = 0;
			invalidFieldToNode = {};

			// TODO: change this to support more than one error per node
			while((error = validationResults.errors[i++])) {
				// Since this only applies a single invalid class
				// we can skip multiple errors on the same field
				if(!(error.property in invalidFieldToNode)) {
					var node = findNode(form, error.property),
						classes = [error.className || error.code];
					if (invalidClass) classes.push(invalidClass);
					if(node) {
						addClasses(node, classes);
						invalidFieldToNode[error.property] = {
							node: node,
							classes: classes
						};
					}
				}
			}

			return validationResults;
		}
	};

	function addClasses(node, cls) {
		classList.setClassList(node, cls);
	}

	function removeClasses(node, cls) {
		classList.setClassList(node, { add: [], remove: cls });
	}

	function defaultFindNode(form, fieldName) {

		var node = form.elements[fieldName];
		if(!node) {
			fieldName = fieldName.split('.');
			fieldName = fieldName[fieldName.length - 1];
			node = form.elements[fieldName];
		}

		// TODO: just return node as the default behavior
		return (node && node.parentNode) || node;
	}

});
}(
typeof define == 'function'
	? define
	: function (factory) { module.exports = factory(require); }
));

