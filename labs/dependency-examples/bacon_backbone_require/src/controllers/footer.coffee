define ['backbone', 'bacon', 'underscore'], (Backbone, Bacon, _) ->

	class FooterController extends Backbone.View

		initialize: ->
			todoList       = @collection
			clearCompleted = @$('#clear-completed').asEventStream('click')

			clearCompleted
				.map(todoList.completed)
				.onValue((ts) -> _.invoke ts, 'destroy')

			todoList.active
				.map((ts) -> "<strong>#{ts.length}</strong> " + if ts.length == 1 then "item left" else "items left")
				.onValue(@$('#todo-count'), 'html')

			todoList.someCompleted
				.onValue(@$('#clear-completed'), 'toggle')

			todoList.completed
				.onValue((completedTodos) => @$('#clear-completed').text "Clear completed (#{completedTodos.length})")
