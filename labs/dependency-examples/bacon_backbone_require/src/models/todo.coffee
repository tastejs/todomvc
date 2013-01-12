define ['backbone'], (Backbone) ->

	class Todo extends Backbone.Model
		defaults: completed: false
