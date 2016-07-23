/*global define */
define(function () {
	'use strict';

	/**
	 * Validate a todo
	 */
	return function validateTodo(todo) {
		// Must be a valid object, and have a text property that is non-empty
		var valid = todo && 'text' in todo && todo.text.trim();
		var result = { valid: !!valid };

		if (!valid) {
			result.errors = [{ property: 'text', message: 'missing' }];
		}

		return result;
	};
});
