/*global rivets, TodoStore */
(function (rivets, TodoStore) {
	'use strict';

	// FilterBar component constructor.
	var FilterBar = function (todos) {
		this.todos = todos;

		this.filters = [
			{id: '', title: 'All'},
			{id: 'active', title: 'Active'},
			{id: 'completed', title: 'Completed'}
		];
	};

	// Clears all completed todo items.
	FilterBar.prototype.clearCompleted = function () {
		TodoStore.clearCompleted();
	};

	// Register <filter-bar> component.
	rivets.components['filter-bar'] = {
		template: function () {
			return document.querySelector('#filter-bar').innerHTML;
		},

		initialize: function (el, data) {
			return new FilterBar(data.todos);
		}
	};
})(rivets, TodoStore);
