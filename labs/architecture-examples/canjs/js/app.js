(function() {
	$(function() {
		can.route( ':filter' );

		// View helper for pluralizing strings
		Mustache.registerHelper('plural', function(str, count) {
			return str + (count !== 1 ? 's' : '');
		});

		// Initialize the app
		Models.Todo.findAll({}, function(todos) {
			new Todos('#todoapp', {
				todos: todos,
				state : can.route,
				view : 'views/todos.mustache'
			});
		});
	})
})();
