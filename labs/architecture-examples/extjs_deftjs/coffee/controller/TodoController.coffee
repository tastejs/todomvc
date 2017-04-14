###*
* Controls the main (root) UI container for the application.
###
Ext.define( "TodoDeftJS.controller.TodoController",
	extend: "Deft.mvc.ViewController"
	inject: [ "todoStore" ]


	config:
		todoStore: null
		currentTodo: null


	control:
		view:
			beforecontainerkeydown: "onNewTodoKeyDown"
			beforecontainerclick: "onTodoToolsClick"
			beforeitemclick: "onTodoClick"
			beforeitemdblclick: "onTodoEditClick"
			beforeitemkeydown: "onEditTodoKeyDown"


	init: ->
		@callParent( arguments )
		return @


	addTodo: ( title ) ->
		newTodo = Ext.create( "TodoDeftJS.model.Todo",
			title: Ext.util.Format.htmlEncode( title )
			completed: false
		)
		@getTodoStore().add( newTodo )
		return


	toggleCompleted: ( todo ) ->
		todo.set( "completed", not todo.get( "completed" ) )
		return


	deleteTodo: ( todo ) ->
		@getTodoStore().remove( todo )
		return


	updateTodo: ( todo, title ) ->
		@setCurrentTodo( null )
		return if not todo?

		todo.set( "editing", false )

		if( title?.length )
			todo.set( "title", Ext.util.Format.htmlEncode( title ) )
		else
			@deleteTodo( todo )
		return


	completedCount: ->
		return @getTodoStore().completedCount()


	incompleteCount: ->
		return @getTodoStore().incompleteCount()


	areAllComplete: ->
		return @getTodoStore().completedCount() is @getTodoStore().count()


	# Event Handlers

	onNewTodoKeyDown: ( view, event ) ->
		if( event.target.id is "new-todo" and event.keyCode is Ext.EventObject.ENTER )
			title = event.target.value.trim()
			@addTodo( title )
			event.target.value = null
			return false

		return true


	onTodoEditClick: ( view, todo, item, idx, event ) ->
		@setCurrentTodo( todo )
		todo.set( "editing", true )
		editField = Ext.dom.Query.selectNode( "#todo-list li.editing .edit" )
		editField.focus()
		editField.value = editField.value
		Ext.fly( editField ).on( "blur", @onTodoBlur, @ )
		return false


	onTodoBlur: ( event, target ) ->
		Ext.fly( event.target ).un( "blur", @onTodoBlur, @ )
		@updateTodo( @getCurrentTodo(), target.value.trim() ) if target?.value


	onEditTodoKeyDown: ( view, todo, item, idx, event ) ->
		if( event.keyCode is Ext.EventObject.ENTER )

			if( event.target.id is "new-todo" )
				@onNewTodoKeyDown( view, event )
				return false

			title = event.target.value.trim()
			Ext.fly( event.target ).un( "blur", @onTodoBlur, @ )
			@updateTodo( todo, title )
			return false

		return true


	onTodoClick: ( view, todo, item, idx, event ) ->
		if( Ext.fly( event.target ).hasCls( "toggle" ) )
			@toggleCompleted( todo )

		else if( Ext.fly( event.target ).hasCls( "destroy" ) )
			@deleteTodo( todo )

		return true


	onTodoToolsClick: ( view, event ) ->
		if( Ext.fly( event.target ).hasCls( "toggleall" ) )
			@getTodoStore().toggleAllCompleted( event.target.checked )

		else if( Ext.fly( event.target ).hasCls( "clearcompleted" ) )
			@getTodoStore().deleteCompleted()

		return true

)