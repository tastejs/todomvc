/*global $ Todos Models Mustache can*/
(function () {
	'use strict';
	$(function () {
		// Set up a route that maps to the `filter` attribute
		can.route(':filter');
		// Delay routing until we initialized everything
		can.route.ready(false);

		// View helper for pluralizing strings
		Mustache.registerHelper('plural', function (str, count) {
			return str + (count !== 1 ? 's' : '');
		});

		// Initialize the app
		Models.Todo.findAll({}, function (todos) {
			new Todos('#todoapp', {
				todos: todos,
				state: can.route,
				view : 'views/todos.mustache'
			});
		});

		// Now we can start routing
		can.route.ready(true);
	});
})();
