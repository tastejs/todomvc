/*global require */
require.config({
	paths: {
		jquery: '../bower_components/jquery/jquery',
		can: '../bower_components/CanJS/amd/can'
	}
});

require([
	'can/util/library',
	'can/route',
	'controls/todos',
	'models/todo',
	'can/view/ejs',
	'can/view/mustache'
], function (can, route, Todos, Model) {
	'use strict';

	// Set up a route that maps to the `filter` attribute
	route(':filter');
	// Delay routing until we initialized everything
	route.ready(false);

	// View helper for pluralizing strings
	can.Mustache.registerHelper('todoPlural', function (str, attr) {
		return str + (attr.call(this.todos) !== 1 ? 's' : '');
	});

	// Find all Todos
	Model.findAll({}, function (todos) {
		// Wire it up. Instantiate a new Todos control
		new Todos('#todoapp', {
			// The (Todo) model that the control should use
			Model: Model,
			// The list of Todos retrieved from the model
			todos: todos,
			// The control state for filtering the view (in our case the router)
			state: can.route,
			// The view to render
			view: 'views/todos.mustache'
		});
	});

	// Now we can start routing
	route.ready(true);
});
