define ['backbone'], (Backbone) ->

	class TodoRouter extends Backbone.Router
		routes:
			'*filter': 'filter'
