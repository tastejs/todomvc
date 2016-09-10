/*global TodoMVC:true, Backbone, $ */

var TodoMVC = TodoMVC || {};

(function () {
	'use strict';

	var filterChannel = Backbone.Radio.channel('filter');

	// TodoList Router
	// ---------------
	//
	// Handles a single dynamic route to show
	// the active vs complete todo items
	TodoMVC.Router = Mn.AppRouter.extend({
		appRoutes: {
			'*filter': 'filterItems'
		}
	});

	// TodoList Controller (Mediator)
	// ------------------------------
	//
	// Control the workflow and logic that exists at the application
	// level, above the implementation detail of views and models
	TodoMVC.Controller = Mn.Object.extend({

		initialize: function () {
			this.todoList = new TodoMVC.TodoList();
		},

		// Start the app by showing the appropriate views
		// and fetching the list of todo items, if there are any
		start: function () {
			this.showHeader(this.todoList);
			this.showFooter(this.todoList);
			this.showTodoList(this.todoList);
			this.todoList.on('all', this.updateHiddenElements, this);
			this.todoList.fetch();
		},

		updateHiddenElements: function () {
			$('#main, #footer').toggle(!!this.todoList.length);
		},

		showHeader: function (todoList) {
			var header = new TodoMVC.HeaderLayout({
				collection: todoList
			});
			TodoMVC.App.root.showChildView('header', header);
		},

		showFooter: function (todoList) {
			var footer = new TodoMVC.FooterLayout({
				collection: todoList
			});
			TodoMVC.App.root.showChildView('footer', footer);
		},

		showTodoList: function (todoList) {
			TodoMVC.App.root.showChildView('main', new TodoMVC.ListView({
				collection: todoList
			}));
		},

		// Set the filter to show complete or all items
		filterItems: function (filter) {
			var newFilter = filter && filter.trim() || 'all';
			filterChannel.request('filterState').set('filter', newFilter);
		}
	});
})();
