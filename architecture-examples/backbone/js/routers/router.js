(function() {
	'use strict';

	// Todo Router
	// ----------

	var Workspace = Backbone.Router.extend({
		
		routes:{
			"*filter": "setFilter"
		},

		setFilter: function(param){

			// Set the current filter to be used
			window.app.TodoFilter = param.trim() || "";

			// Trigger a collection reset/addAll
			window.app.Todos.trigger('reset');
		}

	});

	window.app.TodoRouter = new Workspace;
	Backbone.history.start();

})();