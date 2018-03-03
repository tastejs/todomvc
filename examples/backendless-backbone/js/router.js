/*global Backbone */

/**
 * @class TodoRouter
 * @extend Backbone.Router
 *
 * @collection Todos
 **/
var TodoRouter = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
	},

	initialize: function (options) {
		//save link on our todos collection
		this.collection = options.collection;
	},

	setFilter: function (param) {
		//on change route we change current collection filter
		this.collection.setFilter(param);
	}
});


