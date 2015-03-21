(function (rivets, TodoStore) {
	'use strict';

	// Controller for the filter bar.
	var FilterBarController = function(todos) {
		this.todos = todos;

		this.filters = [
			{id: '', title: 'All'},
			{id: 'active', title: 'Active'},
			{id: 'completed', title: 'Completed'}
		];
	};

	// Clears all completed todo items.
	FilterBarController.prototype.clearCompleted = function() {
		TodoStore.clearCompleted();
	};

	// Register <filter-bar> component.
	rivets.components['filter-bar'] = {
		template: function() {
			return document.querySelector('#filter-bar').innerHTML;
		},

		initialize: function(el, data) {
			return new FilterBarController(data.todos);
		}
	};
})(rivets, TodoStore);
