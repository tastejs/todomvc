(function() {
	'use strict';

	// Todo Router
	// ----------

	var Router = Backbone.Router.extend({
		routes:{
			"/:filter": "setFilter",
			"/:*": "setFilter"
		},

		setFilter: function(param){

			// Set the current filter to be used
			window.app.TodoFilter = param || "";

			// Trigger a collection reset/addAll
			window.app.Todos.trigger('reset');
		}

	});

	window.app.TodoRouter = new Router;
	Backbone.history.start();

})();