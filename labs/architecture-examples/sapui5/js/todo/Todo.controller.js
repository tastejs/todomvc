/*global jQuery, sap, todo */
/*jshint unused:false */

/*
 * Performs no UI logic and has therefore has no references to UI controls.
 * Accesses and modifies model and relies on data binding to inform UI about changes.
 */
(function () {
	'use strict';

	jQuery.sap.require('todo.TodoPersistency');

	sap.ui.controller('todo.Todo', {

		// Stores todos permanently via HTML5 localStorage
		store: new todo.TodoPersistency('todos'),

		// Stores todos for the duration of the session
		model: null,

		// Retrieve todos from store and initialize model
		onInit: function () {
			var data = null;
			if (this.store.isEmpty()) {
				data = this.store.set({
					todos: []
				}).get();
			} else {
				data = this.store.get();
			}
			this.model = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(this.model);
		},

		// Create a new todo
		createTodo: function (todo) {
			todo = todo.trim();
			if (todo.length === 0) {
				return;
			}

			this.model.setProperty('/todos/', this.model.getProperty('/todos/')
				.push({
					id: jQuery.sap.uid(),
					done: false,
					text: todo
				}));

			this.store.set(this.model.getData());

			this.model.updateBindings(true);
		},

		// Clear todo
		clearTodo: function (todo) {
			var todos = this.model.getProperty('/todos/');
			for (var i = todos.length - 1; i >= 0; i--) {
				if (todos[i].id === todo.getProperty('id')) {
					todos.splice(i, 1);
				}
			}
			this.model.setProperty('/todos/', todos);

			this.store.set(this.model.getData());

			this.model.updateBindings(true);
		},

		// Clear all completed todos
		clearCompletedTodos: function () {
			var todos = this.model.getProperty('/todos/');
			for (var i = todos.length - 1; i >= 0; i--) {
				if (todos[i].done === true) {
					todos.splice(i, 1);
				}
			}
			this.model.setProperty('/todos/', todos);

			this.store.set(this.model.getData());

			this.model.updateBindings(true);
		},

		// Complete / reopen all todos
		toggleAll: function () {
			var todos = this.model.getProperty('/todos/');
			var hasOpenTodos = todos.some(function (element, index, array) {
				return element.done === false;
			});

			todos.forEach(function (todo) {
				todo.done = hasOpenTodos;
			});

			this.store.set(this.model.getData());

			this.model.updateBindings(true);
		},

		// Complete / reopen a todo
		todoToggled: function (todo) {
			this.store.set(this.model.getData());

			this.model.updateBindings(true);
		},

		// Rename a todo
		todoRenamed: function (todo) {
			var text = todo.getProperty('text').trim();
			if (text.length === 0) {
				this.clearTodo(todo);
			} else {
				todo.getModel().setProperty(todo.getPath() + '/text', text);

				this.store.set(this.model.getData());

				this.model.updateBindings(true);
			}
		},

		// Change model filter based on selection
		todosSelected: function (selectionMode) {
			if (selectionMode === 'AllTodos') {
				this.getView().changeSelection([]);
			} else if (selectionMode === 'ActiveTodos') {
				this.getView().changeSelection(
					[new sap.ui.model.Filter('done',
						sap.ui.model.FilterOperator.EQ, false)]);
			} else if (selectionMode === 'CompletedTodos') {
				this.getView().changeSelection(
					[new sap.ui.model.Filter('done',
						sap.ui.model.FilterOperator.EQ, true)]);
			}
		}

	});
})();
