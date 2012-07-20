(function(buster, createFormValidationHandler) {
"use strict";

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function createFakeNode() {
	return {
		className: ''
	};
}

function createForm() {
	return {
		elements: {},
		className: ''
	};
}

var validationObjectWithErrors;

validationObjectWithErrors = {
	valid: false,
	errors: [
		{ property: 'test', code: 'test', message: 'test' },
		{ property: 'test2', code: 'test2', className: 'class', message: 'test2' }
	]
};

buster.testCase('validation/form/formValidationHandler', {

	'should add invalid class to form': function() {
		var formValidationHandler, form;

		form = createForm();
		formValidationHandler = createFormValidationHandler(form);

		formValidationHandler({ valid: false });

		assert.match(form.className, /\binvalid\b/);
	},

	'should add default and custom classes to associated node': function() {
		var formValidationHandler, form, node, node2;

		form = createForm();
		node = createFakeNode();
		node2 = createFakeNode();
		formValidationHandler = createFormValidationHandler(
			form, { findNode: function(f, name) { return name == 'test' ? node : node2; } });

		formValidationHandler(validationObjectWithErrors);

		assert.match(node.className, /\binvalid\b/);
		assert.match(node2.className, /\binvalid\b/);
		assert.match(node.className, /\btest\b/);
		assert.match(node2.className, /\bclass\b/);
	},

	'should remove classes from form when it becomes valid': function() {
		var formValidationHandler, form, node;

		form = createForm();
		node = createFakeNode();
		formValidationHandler = createFormValidationHandler(
			form, { findNode: function() { return node; } });

		formValidationHandler(validationObjectWithErrors);

		assert.match(form.className, /\binvalid\b/);

		formValidationHandler({ valid: true });

		refute.match(form.className, /\binvalid\b/);
	},

	'should remove classes from associated node when it becomes valid': function() {
		var formValidationHandler, form, node, node2;

		form = createForm();
		node = createFakeNode();
		node2 = createFakeNode();
		formValidationHandler = createFormValidationHandler(
			form, { findNode: function(f, name) { return name == 'test' ? node : node2; } });

		formValidationHandler(validationObjectWithErrors);

		assert.match(node.className, /\binvalid\b/);
		assert.match(node.className, /\btest\b/);
		assert.match(node2.className, /\bclass\b/);

		formValidationHandler({ valid: true });

		refute.match(node.className, /\binvalid\b/);
		refute.match(node.className, /\btest\b/);
		refute.match(node2.className, /\bclass\b/);
	}

});
})(
	require('buster'),
	require('../../../validation/form/formValidationHandler')
);
