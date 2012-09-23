define([
	'jquery',
	'backbone',
	'thorax',
	'collections/todos',
	'common'
], function( $, Backbone, Thorax, Todos, Common ) {

	return Thorax.Router.extend({
		routes: {
			"": "setFilter",
			":filter": "setFilter"
		},

		setFilter: function( param ) {
			// Set the current filter to be used
			Common.TodoFilter = param ? param.trim().replace(/^\//, '') : '';
			// Thorax listens for a `filter` event which will
			// force the collection to re-filter
			Todos.trigger('filter');
		}
	});

});
