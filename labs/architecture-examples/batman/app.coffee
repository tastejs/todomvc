class Alfred extends Batman.App
	@root 'todos#all'
	@route '/completed', 'todos#completed'
	@route '/active', 'todos#active'

class Alfred.TodosController extends Batman.Controller
	constructor: ->
		super
		@set('newTodo', new Alfred.Todo(completed: false))

	routingKey: 'todos'
	currentTodoSet: 'all'

	@accessor 'currentTodos', -> Alfred.Todo.get(@get('currentTodoSet'))

	all: ->
		@set('currentTodoSet', 'all')

	completed: ->
		@set 'currentTodoSet', 'completed'
		@render(source: 'todos/all')

	active: ->
		@set 'currentTodoSet', 'active'
		@render(source: 'todos/all')

	createTodo: ->
		@get('newTodo').save (err, todo) =>
			if err
				throw err unless err instanceof Batman.ErrorsSet
			else
				@set 'newTodo', new Alfred.Todo(completed: false, title: "")

	todoDoneChanged: (node, event, context) ->
		todo = context.get('todo')
		todo.save (err) ->
			throw err if err && !err instanceof Batman.ErrorsSet

	destroyTodo: (node, event, context) ->
		todo = context.get('todo')
		todo.destroy (err) -> throw err if err

	toggleAll: (node, context) ->
		Alfred.Todo.get('all').forEach (todo) ->
			todo.set('completed', !!node.checked)
			todo.save (err) ->
				throw err if err && !err instanceof Batman.ErrorsSet

	clearCompleted: ->
		Alfred.Todo.get('completed').forEach (todo) ->
			todo.destroy (err) -> throw err if err

	toggleEditing: (node, event, context) ->
		todo = context.get('todo')
		editing = todo.set('editing', !todo.get('editing'))
		if editing
			input = document.getElementById("todo-input-#{todo.get('id')}")
			input.focus()
		else
			if todo.get('title')?.length > 0
				todo.save (err, todo) ->
					throw err if err && !err instanceof Batman.ErrorsSet
			else
				todo.destroy (err, todo) ->
					throw err if err

	disableEditingUponSubmit: (node, event, context) ->
		node.blur() if Batman.DOM.events.isEnter(event)

class Alfred.Todo extends Batman.Model
	@encode 'title', 'completed'
	@persist Batman.LocalStorage
	@validate 'title', presence: true
	@storageKey: 'todos-batman'

	@classAccessor 'active', ->
		@get('all').filter (todo) -> !todo.get('completed')

	@classAccessor 'completed', ->
		@get('all').filter (todo) -> todo.get('completed')

	@wrapAccessor 'title', (core) ->
		set: (key, value) -> core.set.call(@, key, value?.trim())

window.Alfred = Alfred
Alfred.run()
