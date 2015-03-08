/*global TodoMVC */
'use strict';

TodoMVC.module('TodoList', function (TodoList, App, Backbone, Marionette) {
	// TodoList Router
	// ---------------
	//
	// Handle routes to show the active vs complete todo items
	TodoList.Router = Marionette.AppRouter.extend({
		appRoutes: {
			'*filter': 'filterItems'
		}
	});

	// TodoList Controller (Mediator)
	// ------------------------------
	//
	// Control the workflow and logic that exists at the application
	// level, above the implementation detail of views and models
    TodoList.Controller = Marionette.Controller.extend({
        initialize: function () {
            this.todoList = new App.Todos.TodoList();
        },
		// Start the app by showing the appropriate views
		// and fetching the list of todo items, if there are any
		start: function () {
			this.showHeader(this.todoList);
			this.showFooter(this.todoList);
			this.showTodoList(this.todoList);
			this.todoList.fetch();
		},

		showHeader: function (todoList) {
			var header = new App.Layout.Header({
				collection: todoList
			});
			App.root.showChildView('header', header);
		},

		showFooter: function (todoList) {
			var footer = new App.Layout.Footer({
				collection: todoList
			});
			App.root.showChildView('footer', footer);
		},

		showTodoList: function (todoList) {
			App.root.showChildView('main', new TodoList.Views.ListView({
				collection: todoList
			}));
		},

		// Set the filter to show complete or all items
		filterItems: function (filter) {
			var newFilter = filter && filter.trim() || 'all';
			App.request('filterState').set('filter', newFilter);
		}
	});

	// On App start
	// --------------------
	//
	// Get the TodoList up and running by initializing the mediator
	// when the the application is started, pulling in all of the
	// existing Todo items and displaying them.
	App.on('start', function () {
		var controller = new TodoList.Controller();
		controller.router = new TodoList.Router({
			controller: controller
		});

		controller.start();
	});
});
