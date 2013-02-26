/*global Backbone*/
(function () {
	'use strict';

	// Todo Router
	// ----------

	window.app.TodoRouter = new (Backbone.Router.extend({
		routes: {
			'': 'setFilter',
			':filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			window.app.TodoFilter = param ? param.trim().replace(/^\//, '') : '';
			// Thorax listens for a `filter` event which will
			// force the collection to re-filter
			window.app.Todos.trigger('filter');
		}
	}));

}());
