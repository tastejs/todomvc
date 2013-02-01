$(function() {
  'use strict';

  function enterKey(element) {
    var KEYCODE_ENTER = 13
    return element.asEventStream('keyup').filter(function(e) { return e.keyCode == KEYCODE_ENTER })
  }

  function nonEmpty(xs) { return !empty(xs) }
  function empty(xs) { return xs.length == 0 }

  function TodoView(todo) {
    var todoTemplate = Handlebars.compile($('#todo-template').html())
    var todoElement = $(todoTemplate(todo))
    var $label = todoElement.find('label')
    var $editor = todoElement.find('.edit')
    var title = Bacon.UI.textFieldValue($editor, todo.title).map('.trim')
    var completed = Bacon.UI.checkBoxValue(todoElement.find('.toggle'), todo.completed)
    var startEdit = $label.asEventStream('dblclick')
    var finishEdit = enterKey($editor).merge($editor.asEventStream('blur')).merge($editor.asEventStream('dblclick'))

    startEdit.onValue(function() {
      todoElement.addClass('editing')
      $editor.select()
    })
    finishEdit.onValue(todoElement, 'removeClass', 'editing')
    title.assign($label, 'text')
    completed.assign(todoElement, 'toggleClass', 'completed')

    var todoProperty = Bacon.combineTemplate({
      id: todo.id,
      title: title,
      completed: completed
    })

    var destroy = todoElement.find('.destroy').asEventStream('click').doAction('.preventDefault')
                             .merge(finishEdit.filter(title.map(empty)))

    return {
      changes: todoProperty.changes(),
      destroy: destroy.map(todoProperty),
      element: todoElement
    }
  }

  function TodoListView(listElement, model, hash) {
    var selectedTodos = hash.decode({
      '#/': model.allTodos,
      '#/active': model.activeTodos,
      '#/completed': model.completedTodos
    })
    var repaint = model.clearCompleted.merge(hash.changes()).merge(model.toggleAll).merge(model.todoDeleted)
    repaint.merge(Bacon.once()).map(selectedTodos).onValue(render)

    model.todoAdded.onValue(function(todo) {
      addTodo(todo)
    })

    function render(todos) {
      listElement.children().remove()
      _.each(todos, addTodo)
    }

    function addTodo(todo) {
      var view = TodoView(todo)
      listElement.append(view.element)
      model.todoModified.plug(view.changes.takeUntil(repaint))
      model.todoDeleted.plug(view.destroy.takeUntil(repaint))
    }
  }

  function NewTodoView(element, model) {
    var newTodoId = enterKey(element).map(function() { return new Date().getTime() })
    var todoAdded = Bacon.combineTemplate({ 
      id: newTodoId,
      title: Bacon.UI.textFieldValue(element).map('.trim'),
      completed: false
    }).sampledBy(newTodoId).filter('.title')
    todoAdded.onValue(function() { element.val('') })
    model.todoAdded.plug(todoAdded)
  }

  function ClearCompletedView(element, model) {
    model.completedTodos.map(nonEmpty).assign(element, 'toggle')
    model.completedTodos.map('.length').assign(element.find('.count'), 'text')
    model.clearCompleted.plug(element.asEventStream('click'))
  }

  function ToggleAllView(element, model) {
    function checked() { return !!element.attr('checked')}
    var checkboxChanges = element.asEventStream('change').map(checked)
    model.toggleAll.plug(checkboxChanges)

    var uncheck = model.clearCompleted.merge(model.completedTodos.changes().filter(empty)).map(false)
    var check = model.completedTodos.map(nonEmpty).and(model.activeTodos.map(empty)).changes().filter(_.identity)

    check.merge(uncheck).assign(element, 'attr', 'checked')
  }

  function FilterView(element, hash) {
    hash.onValue(function(hash) {
      element.find('a').each(function() {
        var link = $(this)
        link.toggleClass('selected', link.attr('href') == hash)
      })
    })
  }

  function TodoCountView(element, model) {
     model.activeTodos.map('.length').map(function(count) {
       return '<strong>' + count + '</strong>' + ((count == 1) ? ' item left' : ' items left')
     }).assign(element, 'html')
  }

  function LocalStorage() {
    return {
      readTodos: function() {
        var stored = localStorage.getItem('todos-baconjs')
        return stored != null ? JSON.parse(stored) : []
      },
      writeTodos: function(todos) {
        localStorage.setItem('todos-baconjs', JSON.stringify(todos))
      }
    }
  }

  function TodoListModel() {
    function mapTodos(f) { return function(todos) { return _.map(todos, f) }}
    function filterTodos(f) { return function(todos) { return _.filter(todos, f) }}

    function toggleAll(toggle) { return mapTodos(function(todo) { return _.extend(_.clone(todo), { completed: toggle })}) }
    function modifyTodo(updatedTodo) { return mapTodos(function(todo) { return todo.id === updatedTodo.id ? updatedTodo : todo })}
    function removeTodo(deletedTodo) { return filterTodos(function(todo) { return todo.id !== deletedTodo.id}) }
    function addTodo(newTodo) { return function(todos) { return todos.concat([newTodo]) }}
    function clearCompleted() { return function(todos) { return _.where(todos, {completed : false})}} 

    var storage = LocalStorage()

    this.todoAdded = new Bacon.Bus()
    this.todoModified = new Bacon.Bus()
    this.todoDeleted = new Bacon.Bus()
    this.clearCompleted = new Bacon.Bus()
    this.toggleAll = new Bacon.Bus()

    var todoChanges = this.todoAdded.map(addTodo)
                    .merge(this.todoDeleted.map(removeTodo))
                    .merge(this.clearCompleted.map(clearCompleted))
                    .merge(this.todoModified.map(modifyTodo))
                    .merge(this.toggleAll.map(toggleAll))

    this.allTodos = todoChanges.scan(storage.readTodos(), function(todos, f) { return f(todos) })
    this.activeTodos = this.allTodos.map(function(todos) { return _.where(todos, { completed: false})})
    this.completedTodos = this.allTodos.map(function(todos) { return _.where(todos, { completed: true})})

    this.allTodos.changes().onValue(storage.writeTodos)
  }

  function TodoApp() {
    var model = new TodoListModel()
    var hash = Bacon.UI.hash('#/')
    FilterView($('#filters'), hash)
    TodoListView($('#todo-list'), model, hash)
    NewTodoView($('#new-todo'), model)
    ClearCompletedView($('#clear-completed'), model)
    TodoCountView($('#todo-count'), model)
    ToggleAllView($('#toggle-all'), model)
    model.allTodos.map(nonEmpty).assign($('#main,#footer'), 'toggle')
  }

  TodoApp()
})
