/* global nx */

(function () {
	'use strict';

	function setup(elem, state, next) {
		elem.$attribute('todo', (todo) => {
			elem.value = todo.title;
			if (todo.editing) {
				elem.focus();
			}
		});
		return next();
	}

	nx.component({element: 'input'})
		.use(setup)
		.register('todo-input');
})();
