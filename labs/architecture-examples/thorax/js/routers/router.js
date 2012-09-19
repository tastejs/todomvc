var app = app || {};

(function() {
	'use strict';

	// Todo Router
	// ----------

	app.TodoRouter = new (Thorax.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function( param ) {
			// Set the current filter to be used
			window.app.TodoFilter = param.trim() || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of Todo view items
			window.app.Todos.trigger('filter');
		}
	}));

}());
