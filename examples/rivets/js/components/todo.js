/*global rivets, TodoStore */
(function (rivets, TodoStore) {
	'use strict';

	// Controller for todo items.
	var TodoController = function (todo) {
		this.edit = this.edit.bind(this);
		this.save = this.save.bind(this);
		this.toggle = this.toggle.bind(this);
		this.revert = this.revert.bind(this);
		this.remove = this.remove.bind(this);

		this.todo = todo;
	};

	// Starts edit mode for the todo item.
	TodoController.prototype.edit = function () {
		this.newTitle = this.todo.title;
		TodoStore.editing = this.todo;
	};

	// Saves the todo item's new title. If the new title is empty, then the todo
	// item will be removed instead.
	TodoController.prototype.save = function (ev) {
		ev.preventDefault();

		if (this.newTitle.trim()) {
			this.todo.title = this.newTitle.trim();
			TodoStore.save();
		} else {
			this.remove();
		}

		this.revert();
	};

	// Toggles the item as complete / active.
	TodoController.prototype.toggle = function () {
		TodoStore.toggle(this.todo);
	};

	// Reverts changes made for the new title and leaves edit mode.
	TodoController.prototype.revert = function () {
		this.newTitle = this.todo.title;
		TodoStore.editing = null;
	};

	// Removes the todo item.
	TodoController.prototype.remove = function () {
		TodoStore.remove(this.todo);
	};

	// Register <todo> component.
	rivets.components.todo = {
		template: function () {
			return document.querySelector('#todo').innerHTML;
		},

		initialize: function (el, data) {
			return new TodoController(data.todo);
		}
	};
})(rivets, TodoStore);
