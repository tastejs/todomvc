define(function() {

	/**
	 * Validate a todo
	 */
	return function validateTodo(todo) {
		var valid, result;

		// Must be a valid object, and have a text property that is non-empty
		valid = todo && 'text' in todo && todo.text.trim();
		result = { valid: !!valid };

		if(!valid) result.errors = [{ property: 'text', message: 'missing' }];

		return result;
	}

});
