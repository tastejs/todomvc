/*global window, todoList */
(function (window, todoList) {
	'use strict';

	// In Ractive, 'models' are usually just POJOs - plain old JavaScript objects.
	// Our todo list is simply an array of objects, which is handy for fetching
	// and persisting from/to localStorage

	var items, localStorage, removeEditingState;

	// Firefox throws a SecurityError if you try to access localStorage while
	// cookies are disabled
	try {
		localStorage = window.localStorage;
	} catch (err) {
		todoList.set('items', []);
		return;
	}

	if (localStorage) {
		items = JSON.parse(localStorage.getItem('todos-ractive')) || [];

		// Editing state should not be persisted, so we remove it
		// (https://github.com/tastejs/todomvc/blob/master/app-spec.md#persistence)
		removeEditingState = function (item) {
			return {
				description: item.description,
				completed: item.completed
			};
		};

		// Whenever the model changes (including child properties like
		// `items[1].completed`)...
		todoList.observe('items', function (items) {

			// ...we persist it to localStorage
			localStorage.setItem('todos-ractive', JSON.stringify(items.map(removeEditingState)));
		});
	} else {
		items = [];
	}

	todoList.set('items', items);

})(window, todoList);
