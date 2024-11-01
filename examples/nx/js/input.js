/* global nx */

(function () {
	'use strict';

	// this is a middleware function, which is used to add functionality to components
	function setup(elem) {
		// define a custom attribute named 'todo' that runs the passed function on value change
		elem.$attribute('todo', (todo) => {
			elem.value = todo.title;
			if (todo.editing) {
				elem.focus();
			}
		});
	}

	// define a type extension with the above middleware to the native 'input' element
	nx.component({element: 'input'})
		.use(setup)
		.register('todo-input');
})();
