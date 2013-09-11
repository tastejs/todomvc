/*global YUI*/
YUI.add('todo-app', function (Y) {
	'use strict';

	// Dependencies from MVC namespace.
	var TodoApp;
	var TodoList = Y.TodoMVC.TodoList;
	var TodoView = Y.TodoMVC.TodoView;

	// -- Main Application --------------
	TodoApp = Y.Base.create('todoApp', Y.App, [], {
		// Set container to bind to the existing '#todoapp' element
		containerTemplate: '#todoapp',

		// Compile statistics template with Handlebars.
		template: Y.Handlebars.compile(Y.one('#stats-template').getHTML()),

		// DOM events for creating new Todos and clearing out old ones.
		events: {
			'#new-todo': {
				keypress: 'enterCreate'
			},
			'#clear-completed': {
				click: 'clearCompleted'
			},
			'#toggle-all': {
				click: 'completeAll'
			}
		},

		// Initialize our TodoList, and bind any events that occur
		// when new Todos are added, changed, or removed within it.
		// Also, fetch any Todos that are found within localStorage.
		initializer: function () {
			this.set('todoList', new TodoList());

			var list = this.get('todoList');

			Y.Handlebars.registerHelper('pluralize', function (context, word) {
				return (context === 1) ? word : word + 's';
			});

			list.after(['add', 'remove', 'reset', 'todo:completedChange'],
				this.render, this);

			list.load();

			// Keep our filters on refresh by immediately dispatching route.
			this.once('ready', function () {
				if (this.hasRoute(this.getPath())) {
					this.dispatch();
				}
			});
		},

		// Render our application with the statistics from our TodoList,
		// and various other stylistic elements.
		render: function () {
			var todoList = this.get('todoList');
			var completed = todoList.completed().size();
			var remaining = todoList.remaining().size();
			var main = this.get('main');
			var footer = this.get('footer');

			// If we have Todos in our TodoList, show them with statistics.
			if (todoList.size()) {
				main.show();
				footer.show();
				footer.setHTML(this.template({
					completed: completed,
					remaining: remaining
				}));

				// Highlights for filters at the bottom of our Todo application.

				footer.one('#filters li a').removeClass('selected');

				footer.all('#filters li a')
						.filter('[href="#/' + (this.get('filter') || '') + '"]')
						.addClass('selected');
			} else {
				main.hide();
				footer.hide();
			}

			// Set the checkbox only if all Todos have been completed.
			this.get('allCheckbox').set('checked', !remaining);
			this.addViews();
		},

		// Add Todo views to the DOM simultaneously, triggered when
		// the application initially loads, or we switch filters.
		addViews: function () {
			var models;
			var fragment = Y.one(Y.config.doc.createDocumentFragment());
			var todoList = this.get('todoList');

			// An Array of models is passed through when the 'reset'
			// event is triggered through syncing through load().
			switch (this.get('filter')) {
			case 'active':
				models = todoList.remaining();
				break;
			case 'completed':
				models = todoList.completed();
				break;
			default:
				models = todoList;
				break;
			}

			// Iterate through the (filtered) ModelList.
			models.each(function (model) {
				var view = new TodoView({model: model});
				fragment.append(view.render().get('container'));
			});

			this.get('container').one('#todo-list').setContent(fragment);
		},

		// Create and save a new Todo from the inputted value when the
		// Enter key is pressed down.
		enterCreate: function (e) {
			var ENTER_KEY = 13;
			var todoList = this.get('todoList');
			var inputNode = this.get('inputNode');
			var value = inputNode.get('value');

			if (e.keyCode !== ENTER_KEY || !value) {
				return;
			}

			todoList.create({
				title: value
			});

			inputNode.set('value', '');
		},

		// Clear all completed Todos from the TodoList. This removes the models
		// from the list, as well as deletes them from localStorage.
		clearCompleted: function () {
			var todoList  = this.get('todoList');
			var completed = todoList.completed();

			todoList.remove(completed);

			completed.each(function (todo) {
				todo.clear();
			});
		},

		// Complete all non-complete Todos, or reset them all if they are
		// all already complete.
		completeAll: function () {
			var todoList = this.get('todoList');
			var allCheckbox = this.get('allCheckbox');
			var completed = allCheckbox.get('checked');

			todoList.each(function (todo) {
				todo.save({completed: completed});
			});
		},

		// Set the filter for our application from the route that is passed
		// in (see below).
		handleFilter: function (req) {
			this.set('filter', req.params.filter);
			this.get('todoList').load();
		}
	}, {
		ATTRS: {
			// Significant DOM elements that relate to our application that
			// we would like to keep as attributes.
			container: {
				valueFn: function () {
					return Y.one('#todoapp');
				}
			},
			inputNode: {
				valueFn: function () {
					return Y.one('#new-todo');
				}
			},
			allCheckbox: {
				valueFn: function () {
					return Y.one('#toggle-all');
				}
			},
			main: {
				valueFn: function () {
					return Y.one('#main');
				}
			},
			footer: {
				valueFn: function () {
					return Y.one('#footer');
				}
			},

			// This can be set to fall back on server-side routing when
			// HTML5 pushState is not available. For this application,
			// we are only using hash-based URLs though.
			serverRouting: {
				value: false
			},

			// Our initial filter for the application.
			filter: {
				value: null
			},

			// Routing for the application, to determine the filter.
			// The callback takes a request object, Express-style.
			routes: {
				value: [
					{
						path: '/:filter',
						callback: 'handleFilter'
					}
				]
			}
		}
	});

	// Namespace this application under our custom Y.MVC namespace.
	Y.namespace('TodoMVC').TodoApp = TodoApp;
}, '@VERSION@', {
	requires: [
		'app',
		'todo-list',
		'todo-view',
		'node'
	]
});
