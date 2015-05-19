(function (exports) {
	'use strict';

	exports.TodoStore = {
		// All todos.
		all: JSON.parse(localStorage['todos-rivets'] || '[]'),

		// Currently applied filter.
		statusFilter: '',

		// Returns the filtered todo list.
		filtered: function () {
			var status = this.statusFilter;

			return this.all.filter(function (todo) {
				switch (status) {
					case 'active':
						return !todo.completed;
					case 'completed':
						return todo.completed;
					default:
						return true;
				}
			});
		},

		// Returns all active todos.
		active: function () {
			return this.all.filter(function (todo) {
				return !todo.completed;
			});
		},

		completed: function () {
			return this.all.filter(function (todo) {
				return todo.completed;
			});
		},

		// Adds a new todo by title and saves.
		add: function (todo) {
			this.all.push(todo);
			this.save();
		},

		// Removes a todo and saves.
		remove: function (todo) {
			this.all.splice(this.all.indexOf(todo), 1);
			this.save();
		},

		// Toggles the todo as complete / active and saves.
		toggle: function (todo) {
			todo.completed = !todo.completed;
			this.save({ notifyChanges: true });
		},

		// Removes all completed todos and saves.
		clearCompleted: function () {
			this.all = this.active();
			this.save();
		},

		// Marks all as complete / active and saves.
		markAll: function (completed) {
			this.all.forEach(function (todo) {
				todo.completed = completed;
			});

			this.save({ notifyChanges: true });
		},

		// Returns true if all todos are marked as completed.
		isAllCompleted: function () {
			return this.all.every(function (todo) {
				return todo.completed;
			});
		},

		// Saves a snapshot of all todos in local storage.
		save: function (opts) {
			if (opts && opts.notifyChanges) {
				this.all.splice(0, 0);
			}

			localStorage['todos-rivets'] = JSON.stringify(this.all);
		}
	};
})(window);
