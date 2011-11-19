###
  knockback-todos.js
  (c) 2011 Kevin Malakoff.
  Knockback-Todos is freely distributable under the MIT license.
  See the following for full license details:
    https:#github.com/kmalakoff/knockback-todos/blob/master/LICENSE
###

$(document).ready(->

  # set the language
  kb.locale_manager.setLocale('en')

  # add a doubleclick and placeholder handlers to KO
  ko.bindingHandlers.dblclick =
    init: (element, value_accessor, all_bindings_accessor, view_model) ->
      $(element).dblclick(ko.utils.unwrapObservable(value_accessor()))
  ko.bindingHandlers.placeholder =
    update: (element, value_accessor, all_bindings_accessor, view_model) ->
      $(element).attr('placeholder', ko.utils.unwrapObservable(value_accessor()))

  ###################################
  # Model: http://en.wikipedia.org/wiki/Model_view_controller
  # ORM: http://en.wikipedia.org/wiki/Object-relational_mapping
  ###################################

  # Todos
  class Todo extends Backbone.Model
    defaults: -> return {created_at: new Date()}
    set: (attrs) ->
      attrs['done_at'] = new Date(attrs['done_at']) if attrs and attrs.hasOwnProperty('done_at') and _.isString(attrs['done_at'])
      super
    done: (done) ->
      return !!@get('done_at') if arguments.length == 0
      @save({done_at: if done then new Date() else null})

  class TodoList extends Backbone.Collection
    model: Todo
    localStorage: new Store("kb_todos") # Save all of the todo items under the `"kb_todos"` namespace.
    doneCount: -> @models.reduce(((prev,cur)-> return prev + if !!cur.get('done_at') then 1 else 0), 0)
    remainingCount: -> @models.length - @doneCount()
    allDone: -> return @filter((todo) -> return !!todo.get('done_at'))
  todos = new TodoList()
  todos.fetch()

  ###################################
  # MVVM: http://en.wikipedia.org/wiki/Model_View_ViewModel
  ###################################

  # Header
  HeaderViewModel = ->
    @title = "Todos"
    return this

  CreateTodoViewModel = ->
    @input_text = ko.observable('')
    @input_placeholder_text = kb.observable(kb.locale_manager, {key: 'placeholder_create'})
    @input_tooltip_text = kb.observable(kb.locale_manager, {key: 'tooltip_create'})
    @addTodo = (event) ->
      text = @create.input_text()
      return true if (!text || event.keyCode != 13)
      todos.create({text: text})
      @create.input_text('')
    return true

  TodoViewModel = (model) ->
    @text = kb.observable(model, {key: 'text', write: ((text) -> model.save({text: text}))}, this)
    @edit_mode = ko.observable(false)
    @toggleEditMode = (event) => @edit_mode(!@edit_mode()) if not @done()
    @onEnterEndEdit = (event) => @edit_mode(false) if (event.keyCode == 13)

    @created_at = model.get('created_at')
    @done = kb.observable(model, {key: 'done_at', read: (-> return model.done()), write: ((done) -> model.done(done)) }, this)
    @destroyTodo = => model.destroy()
    return this

  TodoListViewModel = (todos) ->
    @todos = ko.observableArray([])
    @collection_observable = kb.collectionObservable(todos, @todos, { view_model: TodoViewModel })
    return true

  # Stats Footer
  StatsViewModel = (todos) ->
    @collection_observable = kb.collectionObservable(todos)
    @remaining_text = ko.dependentObservable(=>
      count = @collection_observable.collection().remainingCount(); return '' if not count
      return kb.locale_manager.get((if count == 1 then 'remaining_template_s' else 'remaining_template_pl'), count)
    )
    @clear_text = ko.dependentObservable(=>
      count = @collection_observable.collection().doneCount(); return '' if not count
      return kb.locale_manager.get((if count == 1 then 'clear_template_s' else 'clear_template_pl'), count)
    )
    @onDestroyDone = => model.destroy() for model in todos.allDone()
    return this

  FooterViewModel = ->
    @instructions_text = kb.locale_manager.get('instructions')
    return this

  app_view_model =
    header: new HeaderViewModel()
    create: new CreateTodoViewModel()
    todo_list: new TodoListViewModel(todos)
    footer: new FooterViewModel(kb.locale_manager.getLocales())
    stats: new StatsViewModel(todos)
  ko.applyBindings(app_view_model, $('#todoapp')[0])

  # Destroy when finished with the view model
  # kb.vmRelease(app_view_model)
)