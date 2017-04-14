/* global jtmpl:false */
(function () {
	'use strict';

	// Enter pressed?
	function enterKey(e) {
		return 13 === (e.keyCode ? e.keyCode : e.which);
	}

	// This POJO will be bound to section#todoapp.innerHTML (the template)
	var model = {

		//// Fields

		// What needs to be done?
		todo: '',

		// All todo items
		todos: [],

		// Filter list
		filters: [
			{
				selected: false,
				href: '#/',
				title: 'All',
				filter: function () { return true; }
			},
			{
				selected: false,
				href: '#/active',
				title: 'Active',
				filter: function (el) { return !el.completed; }
			},
			{
				selected: false,
				href: '#/completed',
				title: 'Completed',
				filter: function (el) { return el.completed; }
			}
		],

		// Toggle all
		toggleAll: false,


		//// Event handlers

		// New item
		add: function (e) {
			// Enter pressed on non-empty field?
			if (enterKey(e) && this.todo) {
				this.todos.push({
					title: this.todo,
					completed: false,
					editing: false
				});
				model.persist();
				model.update();
				this.todo = '';
			}
		},

		// Item double-clicked
		edit: function () {
			this.editing = true;
		},

		// Done editing
		save: function (e) {
			if (enterKey(e)) {
				this.editing = false;
				model.persist();
			}
		},

		// Delete item
		destroy: function () {
			model.todos.splice(model.todos.indexOf(this), 1);
			model.persist();
			model.update();
		},

		// #toggle-all changed
		toggleAllChange: function () {
			var i;
			for (i = 0; i < model.todos.length; i++) {
				model.todos[i].completed = model.toggleAll;
			}
			model.persist();
			model.update();
		},

		// Clear completed
		clear: function () {
			var i;
			for (i = model.todos.length - 1; i >= 0; i--) {
				if (model.todos[i].completed) {
					model.todos.splice(i, 1);
				}
			}
			model.persist();
			model.update();
		},

		// Called in the context of a model.filters item
		applyFilter: function () {
			var i;
			for (i = 0; i < model.filters.length; i++) {
				model.filters[i].selected = false;
			}
			this.selected = true;
			model.todoFilter = this.filter;
			model.update();
		},


		//// Persistence

		// Load from localStorage
		retrieve: function () {
			model.todos = JSON.parse(localStorage.getItem('todomvc-jtmpl') || '[]')
				.map(
					function (el) {
						return {
							title: el.title,
							completed: el.completed,
							editing: false
						};
					}
				);
		},

		// Save to localStorage
		persist: function () {
			localStorage.setItem(
				'todomvc-jtmpl',
				JSON.stringify(
					model.todos.map(
						function (el, i) {
							return {
								id: i + 1,
								title: el.title,
								completed: el.completed
							};
						}
					)
				)
			);
		},


		//// Model state

		// Update state variables
		// When jtmpl implements computed properties, this function will be obsolete
		// Meanwhile, this is the central place to update all computed properties,
		// optimized for code simplicity rather than efficiency 
		update: function () {
			model.filtered = model.todos.filter(model.todoFilter);
			model.itemsLength = model.todos.length;
			model.completedItemsLength =
				// Count completed todos
				model.todos.reduce(
					function (prev, curr) {
						return prev + (curr.completed && 1 || 0);
					},
					0
				);
			model.toggleAll =
				model.filtered.length &&
				// "And" all todos[i].completed
				model.todos.reduce(
					function (prev, curr) {
						return prev && curr.completed;
					},
					true
				);
			model.todosLeft = model.itemsLength - model.completedItemsLength;
			model.itemText = (model.todosLeft === 1) ? 'item' : 'items';
		}
	};

	// Initial state
	var filter = model.filters.filter(function (el) { return el.href === window.location.hash; });
	model.applyFilter.call(filter.length ? filter[0] : model.filters[0]);
	model.retrieve();
	model.update();

	// Bind, #todoapp is now live
	jtmpl('#todoapp', '#todoapp', model);

})();