class window.Todo extends Spine.Model
	@configure 'Todo', 'title', 'completed'
	@extend Spine.Model.Local

	@active: ->
		@select (todo) -> !todo.completed

	@completed: ->
		@select (todo) -> !!todo.completed

	@destroyCompleted: ->
		todo.destroy() for todo in @completed()
