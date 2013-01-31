###*
* A persistent collection of To-Do models.
###
Ext.define( "TodoDeftJS.store.TodoStore"
	extend: "Ext.data.Store"
	requires: [ "TodoDeftJS.model.Todo" ]

	model: "TodoDeftJS.model.Todo"
	autoLoad: true
	autoSync: true
	proxy:
		type: "localstorage"
		id: "todos-deftjs"


	completedCount: ->
		numberComplete = 0
		@each( ( todo ) ->
			numberComplete++ if todo.get( "completed" )
		)
		return numberComplete


	incompleteCount: ->
		numberInomplete = 0
		@each( ( todo ) ->
			numberInomplete++ if not todo.get( "completed" )
		)
		return numberInomplete


	findEditingTodo: ->
		editingTodo = null
		@each( ( todo ) ->
			if todo.get( "editing" )
				editingTodo = todo
				return false
		)
		return editingTodo


	toggleAllCompleted: ( isCompleted ) ->
		@each( ( todo ) ->
			todo.set( "completed", isCompleted )
		)
		return


	deleteCompleted: ->
		removedTodos = []
		@each( ( todo ) ->
			removedTodos.push( todo ) if todo.get( "completed" )
		)
		@remove( removedTodos ) if removedTodos.length
		return


)