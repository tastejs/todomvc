/*global define */

define(function (require) {
	'use strict';

	var Controller = require('lavaca/mvc/Controller');
	var TodosView = require('app/ui/views/TodosView');
	var todosCollection = require('app/models/TodosCollection');

	/**
	 * @class app.net.TodosController
	 * @super Lavaca.mvc.Controller
	 * Todos controller
	 */
	var TodosController = Controller.extend({
		home: function (params) {
			// Set the `filter` parameter on the collection based on the values
			// defined with the routes in app.js
			todosCollection.set('filter', params.filter);

			// Create an instance of TodosView with `collection` as its model and then
			// set a history state which will update the URL
			return this
				.view(null, TodosView, todosCollection)
				.then(this.history({}, document.title, params.url));
		}
	});

	return TodosController;
});
