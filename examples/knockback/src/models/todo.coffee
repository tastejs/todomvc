class window.Todo extends Backbone.Model
	completed: (completed) ->
		return !!@get('completed') if arguments.length is 0 # getter

		@save({completed: if completed then new Date() else null}) # setter