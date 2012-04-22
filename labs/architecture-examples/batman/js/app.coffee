class Alfred extends Batman.App
  @root 'todos#all'
  for action in ['all', 'completed', 'active']
    @route "/#{action}", "todos##{action}"

class Alfred.TodosController extends Batman.Controller
  constructor: ->
    super
    @set 'newTodo', new Alfred.Todo(done: false)

  all: ->
    @set 'currentTodos', Alfred.Todo.get('all')

  completed: ->
    @set 'currentTodos', Alfred.Todo.get('done')
    @render source: 'todos/all'

  active: ->
    @set 'currentTodos', Alfred.Todo.get('active')
    @render source: 'todos/all'

  createTodo: ->
    @get('newTodo').save (err, todo) =>
      if err
        throw err unless err instanceof Batman.ErrorsSet
      else
        @set 'newTodo', new Alfred.Todo(done: false, name: "")

  destroyTodo: (node, event, context) ->
    todo = context.get('todo')
    todo.destroy (err) -> throw err if err

  completeAll: ->
    Alfred.Todo.get('all').forEach (todo) ->
      todo.set('done', true)
      todo.save (err) ->
        if err
          throw err unless err instanceof Batman.ErrorsSet

  clearCompleted: ->
    Alfred.Todo.get('done').forEach (todo) ->
      todo.destroy (err) -> throw err if err

  toggleEditing: (node, event, context) ->
    todo = context.get('todo')
    editing = todo.set('editing', !todo.get('editing'))
    if editing
      document.getElementById("todo-input-#{todo.get('id')}").focus()
    if todo.get('name').trim().length > 0
      todo.save (err) -> throw err if err
    else
      todo.destroy (err) -> throw err if err

  disableEditingUponSubmit: (node, event, context) ->
    if Batman.DOM.events.isEnter(event)
      context.get('todo').set('editing', false)

class Alfred.Todo extends Batman.Model
  @encode 'name', 'done'
  @persist Batman.LocalStorage
  @validate 'name', presence: true

  @classAccessor 'active', ->
    @get('all').filter (todo) -> !todo.get('done')

  @classAccessor 'done', ->
    @get('all').filter (todo) -> todo.get('done')

window.Alfred = Alfred
Alfred.run()
