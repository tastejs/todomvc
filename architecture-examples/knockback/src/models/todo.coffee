class window.Todo extends Backbone.Model
	completed: (completed) ->
		return !!@get('completed') if arguments.length == 0
		@save({completed: if completed then new Date() else null})
