class Alfred extends Batman.App
	@root 'todos#index', as: "all"
	@route '/completed', 'todos#completed'
	@route '/active', 'todos#active'

class Alfred.TodosController extends Batman.Controller
	constructor: ->
		super
		@set('newTodo', new Alfred.Todo(completed: false))

	routingKey: 'todos'

	index: ->
		@set('currentTodoSet', 'all')

	completed: ->
		@set 'currentTodoSet', 'completed'
		@render(source: 'todos/index') # uses the same template

	active: ->
		@set 'currentTodoSet', 'active'
		@render(source: 'todos/index')

class Alfred.TodosIndexView extends Batman.View
	createTodo: (node, event, context) ->
		event.preventDefault()
		title = node[0].value
		if title
			newTodo = new Alfred.Todo(title: title, completed: false)
			newTodo.save (err) ->
				if not err
					node[0].value = null

	destroyTodo: (node, event, context) ->
		todo = context.get('todo')
		todo.destroy (err) -> throw err if err

	toggleAll: (node, context) ->
		Alfred.Todo.get('all').forEach (todo) ->
			todo.set('completed', !!node.checked)

	clearCompleted: ->
		Alfred.Todo.get('completed').forEach (todo) ->
			todo.destroy (err) -> throw err if err

	toggleEditing: (node, event, context) ->
		todo = context.get('todo')
		editing = todo.set('editing', !todo.get('editing'))
		if editing
			input = document.getElementById("todo-input-#{todo.get('id')}")
			input.focus()

	disableEditingOnEnter: (node, event, context) ->
		node.blur() if Batman.DOM.events.isEnter(event)

# These views get instantiated by name. Extend TodosIndex so they have the same methods.
class Alfred.TodosActiveView extends Alfred.TodosIndexView
class Alfred.TodosCompletedView extends Alfred.TodosIndexView


class Alfred.Todo extends Batman.Model
	@persist Batman.LocalStorage
	@storageKey: 'todos-batman'

	constructor: ->
		super # instantiate the record
		# set up some observers on the record's attributes:
		@observe 'completed', (newValue, oldValue) ->
			@save()
		@observe 'editing', (newValue, oldValue) ->
			if newValue == false
				if @get('title').length > 0
					@set('title', @get('title').trim())
					@save()
				else
					@destroy()
		@

	@encode 'title', 'completed'
	@validate 'title', presence: true

	@classAccessor 'active', ->
		@get('all').filter (todo) -> !todo.get('completed')

	@classAccessor 'completed', ->
		@get('all').filter (todo) -> todo.get('completed')

@Alfred = Alfred
