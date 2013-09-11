/*global define */
/*jshint newcap:false */
define([
	'can/util/library',
	'can/observe',
	'models/localstorage'
], function (can, Observe, LocalStorage) {
	'use strict';

	// Basic Todo entry model
	// { text: 'todo', complete: false }
	var Todo = LocalStorage({
		storageName: 'todos-canjs-requirejs'
	}, {
		// Returns if this instance matches a given filter
		// (currently `active` and `complete`)
		matches: function (state) {
			return !state || (state === 'active' && !this.attr('complete')) ||
				(state === 'completed' && this.attr('complete'));
		}
	});

	// Extend the existing Todo.List to add some helper methods
	Todo.List = Todo.List({
		completed: function () {
			var completed = 0;

			this.each(function (todo) {
				completed += todo.attr('complete') ? 1 : 0;
			});

			return completed;
		},

		remaining: function () {
			return this.attr('length') - this.completed();
		},

		allComplete: function () {
			return this.attr('length') === this.completed();
		},

		// Returns a new can.Observe.List that contains only the Todos
		// matching the current filter
		byFilter: function (filter) {
			var filtered = new Observe.List();
			can.each(this, function (todo) {
				if (todo.matches(filter)) {
					filtered.push(todo);
				}
			});
			return filtered;
		},

		// Returns the list to display based on the currently set `filter`
		displayList: function () {
			return this.byFilter(this.attr('filter'));
		}
	});

	return Todo;
});
