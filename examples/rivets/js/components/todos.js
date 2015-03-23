/*global rivets, TodoStore */
(function (rivets, TodoStore) {
	'use strict';

	// Controller for the todos app.
	var TodosController = function () {
		this.addTodo = this.addTodo.bind(this);
		this.todos = TodoStore;
		this.newTodo = '';
	};

	// Adds a new todo item.
	TodosController.prototype.addTodo = function (ev) {
		ev.preventDefault();

		if (this.newTodo && this.newTodo.trim()) {
			TodoStore.add({
				title: this.newTodo.trim(),
				completed: false
			});
		}

		this.newTodo = '';
	};

	// Toggles all todo items as complete / active.
	TodosController.prototype.toggleAllCompleted = function () {
		TodoStore.markAll(!TodoStore.isAllCompleted());
	};

	// Register <todos> component.
	rivets.components.todos = {
		template: function () {
			return document.querySelector('#todos').innerHTML;
		},

		initialize: function () {
			return new TodosController();
		}
	};
})(rivets, TodoStore);
