/*global define */

define([
	'marionette',
	'collections/TodoList',
	'views/Header',
	'views/TodoListCompositeView',
	'views/Footer'
], function (Marionette, TodoList, Header, TodoListCompositeView, Footer) {
	'use strict';

	var app = new Marionette.Application();
	var todoList = new TodoList();

	var viewOptions = {
		collection: todoList
	};

	var header = new Header(viewOptions);
	var main = new TodoListCompositeView(viewOptions);
	var footer = new Footer(viewOptions);

	app.addRegions({
		header: '#header',
		main: '#main',
		footer: '#footer'
	});

	app.addInitializer(function () {
		app.header.show(header);
		app.main.show(main);
		app.footer.show(footer);

		todoList.fetch();
	});

	app.listenTo(todoList, 'all', function () {
		app.main.$el.toggle(todoList.length > 0);
		app.footer.$el.toggle(todoList.length > 0);
	});

	app.vent.on('todoList:filter', function (filter) {
		footer.updateFilterSelection(filter);

		document.getElementById('todoapp').className = 'filter-' + (filter === '' ? 'all' : filter);
	});

	app.vent.on('todoList:clear:completed', function () {
		todoList.getCompleted().forEach(function (todo) {
			todo.destroy();
		});
	});

	return window.app = app;
});
