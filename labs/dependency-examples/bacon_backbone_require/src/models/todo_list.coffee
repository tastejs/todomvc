define ['bacon', 'backbone', 'underscore', 'models/todo', 'localstorage'], (Bacon, Backbone, _, Todo) ->

	class TodoList extends Backbone.Collection
		model: Todo
		localStorage: new Backbone.LocalStorage('todos-baconjs-backbone')

		toggleAll: (completed) -> @each (todo) -> todo.save completed: completed

		initialize: ->
			@changed       = @asEventStream("add remove reset change").map(this).toProperty()
			@someCompleted = @changed.map => @some   (t) -> t.get 'completed'
			@allCompleted  = @changed.map => @every  (t) -> t.get 'completed'
			@notEmpty      = @changed.map => @length > 0
			@all           = @changed.map => @models
			@active        = @changed.map => @reject (t) -> t.get 'completed'
			@completed     = @changed.map => @filter (t) -> t.get 'completed'
