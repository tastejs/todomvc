/*global rivets, TodoStore */
(function (rivets, TodoStore) {
	'use strict';

	// Todos component constructor.
	var Todos = function () {
		this.addTodo = this.addTodo.bind(this);
		this.todos = TodoStore;
		this.newTodo = '';
	};

	// Adds a new todo item.
	Todos.prototype.addTodo = function (ev) {
		ev.preventDefault();

		if (this.newTodo.trim().length) {
			TodoStore.add({
				title: this.newTodo.trim(),
				completed: false
			});
		}

		this.newTodo = '';
	};

	// Toggles all todo items as complete / active.
	Todos.prototype.toggleAllCompleted = function () {
		TodoStore.markAll(!TodoStore.isAllCompleted());
	};

	// Register <todos> component.
	rivets.components.todos = {
		template: function () {
			return document.querySelector('#todos').innerHTML;
		},

		initialize: function () {
			return new Todos();
		}
	};
})(rivets, TodoStore);
