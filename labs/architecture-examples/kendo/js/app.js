/*global $ kendo*/
var app = app || {};

(function ($, kendo) {
	'use strict';

	var filterBase = {
		field: 'completed',
		operator: 'eq'
	};

	// Route object to manage filtering the todo item list
	var routes = {
		'/': function () {
			app.todoData.filter({});
			app.todoViewModel.set('filter', '');
		},
		'/active': function () {
			filterBase.value = false;
			app.todoData.filter(filterBase);
			app.todoViewModel.set('filter', 'active');
		},
		'/completed': function () {
			filterBase.value = true;
			app.todoData.filter(filterBase);
			app.todoViewModel.set('filter', 'completed');
		}
	};

	// Todo Model Object
	app.Todo = kendo.data.Model.define({
		id: 'id',
		fields: {
			id: { editable: false, nullable: true },
			title: { type: 'string' },
			completed: { type: 'boolean', nullable: false, defaultValue: false },
			edit: { type: 'boolean', nullable: false, defaultValue: false }
		}
	});

	// The Todo DataSource. This is a custom DataSource that extends the
	// Kendo UI DataSource and adds custom transports for saving data to
	// localStorage.
	// Implementation in js/lib/kendo.data.localstoragedatasource.ds
	app.todoData = new kendo.data.extensions.LocalStorageDataSource({
		itemBase: 'todos-kendo',
		schema: {
			model: app.Todo
		}
	});

	// The core ViewModel for our todo app
	app.todoViewModel = kendo.observable({
		todos: app.todoData,
		filter: null,

		// Handle route changes and direct to the appropriate handler in our
		// local routes object.
		routeChanged: function (url) {
			routes[url || '/'].call(this);
		},

		// Main element visibility handler
		isVisible: function () {
			return this.get('todos').data().length;
		},
		
		// Core CRUD Methods
		saveTodo: function () {
			var todos = this.get('todos');
			var newTodo = $('#new-todo');

			var todo = new app.Todo({
				title: newTodo.val().trim(),
				completed: false,
				edit: false
			});

			todos.add(todo);
			todos.sync();
			newTodo.val('');
		},
		toggleAll: function () {
			var completed = this.completedTodos().length === this.get('todos').data().length;

			$.grep(this.get('todos').data(), function (el) {
				el.set('completed', !completed);
			});
		},
		startEdit: function (e) {
			e.data.set('edit', true);
			$('li[data-uid=' + e.data.uid + ']').find('input').focus();
		},
		endEdit: function (e) {
			var editData = e;

			if (e.data) {
				editData = e.data;

				// If the todo has a title, set it's edit property
				// to false. Otherwise, delete it.
				if (editData.title.trim()) {
					editData.set('edit', false);
				} else {
					this.destroy(e);
				}
			}

			editData.set('edit', false);
			this.todos.sync();
		},
		sync: function () {
			this.todos.sync();
		},
		destroy: function (e) {
			this.todos.remove(e.data);
			this.todos.sync();
		},
		destroyCompleted: function () {
			$.each(this.completedTodos(), function (index, value) {
				this.todos.remove(value);
			}.bind(this));
			this.todos.sync();
		},

		// Methods for retrieving filtered todos and count values
		activeTodos: function () {
			return $.grep(this.get('todos').data(), function (el) {
				return !el.get('completed');
			});
		},
		activeCount: function () {
			return this.activeTodos().length;
		},
		completedTodos: function () {
			return $.grep(this.get('todos').data(), function (el) {
				return el.get('completed');
			});
		},
		completedCount: function () {
			return this.completedTodos().length;
		},
		allCompleted: function () {
			return this.completedTodos().length === this.get('todos').data().length;
		},
		
		// Text value bound methods
		activeCountText: function () {
			return this.activeCount() === 1 ? 'item' : 'items';
		},
		clearCompletedText: function () {
			return 'Clear completed (' + this.completedCount() + ')';
		},

		// Class attribute bound methods
		todoItemClass: function (item) {
			if (item.get('edit')) {
				return 'editing';
			}

			return (item.get('completed') ? 'completed' : 'active');
		},
		allFilterClass: function () {
			return this.get('filter') ? '' : 'selected';
		},
		activeFilterClass: function () {
			return this.get('filter') === 'active' ? 'selected' : '';
		},
		completedFilterClass: function () {
			return this.get('filter') === 'completed' ? 'selected' : '';
		}

	});

	// Kendo History object for capturing hash changes and triggering
	// our route-changed handler
	kendo.history.start({
		ready: function (e) {
			app.todoViewModel.routeChanged(e.url);
		},
		change: function (e) {
			app.todoViewModel.routeChanged(e.url);
		}
	});

	// Bind the ViewModel to the todoapp DOM element
	kendo.bind($('#todoapp'), app.todoViewModel);

}($, kendo));
