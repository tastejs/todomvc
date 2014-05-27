TodoFooter = require './footer.coffee'
TodoItem = require './todoItem.coffee'
TodoModel = require './todoModel.coffee'
Director = require 'director'

React = require 'react'
{section,input,ul,div,header,h1} = React.DOM

ENTER_KEY = 13

TodoApp = React.createClass
  getInitialState: ->
    {
      nowShowing: 'all'
      editing: null
    }

  componentDidMount: ->
    setState = @setState
    router = Director.Router({
      '/': setState.bind(this,{nowShowing: 'all'})
      '/active': setState.bind(this,{nowShowing: 'active'})
      '/completed': setState.bind(this,{nowShowing: 'completed'})
      })
    router.init('/')
    return

  handleNewTodoKeyDown: (event) ->
    if (event.which is ENTER_KEY)
      val = @refs.newField.getDOMNode().value.trim()
      if val?.length
        @props.model.addTodo val
        @refs.newField.getDOMNode().value = ''
      return false
    else
      return

  toggleAll: (event) ->
    checked = event.target.checked
    @props.model.toggleAll checked
    return

  toggle: (todoToToggle) ->
    @props.model.toggle todoToToggle
    return
  
  destroy: (todoToDestroy) ->
    @props.model.destroy todoToDestroy
    return

  # refer to todoItem.js handleEdit for the reasoning behind the
  # callback
  edit: (todo, callback) ->
    @setState {editing: todo.id}, (->callback())
    return

  save: (todoToSave, text) ->
    @props.model.save todoToSave, text
    @setState {editing: null}
    return

  cancel: ()->
    @setState {editing: null}
    return

  clearCompleted: () ->
    @props.model.clearCompleted()
    return

  render: ()->
    todos = @props.model.todos
    shownTodos = (
      todo for todo in todos when (
        switch @state.nowShowing
          when 'active' then (not todo.completed)
          when 'completed' then (todo.completed)
          else true
        )
      )
    activeTodoCount = (todo for todo in todos when not todo.completed).length
    completedCount = todos.length - activeTodoCount
    todoItems =
      for todo in shownTodos
        TodoItem
          key:todo.id
          todo:todo
          onToggle:@toggle.bind(this, todo)
          onDestroy:@destroy.bind(this, todo)
          onEdit:@edit.bind(this, todo)
          editing:@state.editing is todo.id
          onSave:@save.bind(this, todo)
          onCancel:@cancel
    footer =
      if activeTodoCount > 0 or completedCount > 0
        TodoFooter
          count:activeTodoCount
          completedCount:completedCount
          nowShowing:@state.nowShowing
          onClearCompleted:@clearCompleted
      else
        null
    main =
      if todos.length >0
        section {id:'main'},
          input
            id:'toggle-all'
            type:'checkbox'
            onChange:@toggleAll
            checked:activeTodoCount is 0
          ul {id:'todo-list'},
            todoItems
      else
        null
    div {},
      header {id:'header'},
        h1 {}, 'todos'
        input
          ref:'newField'
          id:'new-todo'
          placeholder:'What needs to be done?'
          onKeyDown:@handleNewTodoKeyDown
          autoFocus:true
      main
      footer

model = new TodoModel('react-todos')

render = () ->
  React.renderComponent(
    TodoApp({model:model}),
    document.getElementById('todoapp')
  )

model.subscribe(render)

render()
