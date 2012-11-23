require.config({
	paths : {
		jquery : 'lib/jquery.min'
	}
});

require(['can/route', 'app/todos', 'app/models/todo', 'can/view/ejs', 'can/view/mustache'],
	function (route, Todos, Model, EJS, Mustache) {
		// Set up a route that maps to the `filter` attribute
		route(':filter');
		// Delay routing until we initialized everything
		route.ready(false);

		// View helper for pluralizing strings
		Mustache.registerHelper('plural', function (str, count) {
			return str + (count !== 1 ? 's' : '');
		});

		// Find all Todos
		Model.findAll({}, function (todos) {
			// Wire it up. Instantiate a new Todo control
			new Todos('#todoapp', {
				// The (Todo) model that the control should use
				Model : Model,
				// The list of Todos retrieved from the model
				todos : todos,
				// The control state for filtering the view (in our case the router)
				state : can.route,
				// The view to render
				view : 'views/todos.mustache'
			});
		});

		// Now we can start routing
		route.ready(true);
	});