###
  knockback-todos.js
  (c) 2011 Kevin Malakoff.
  Knockback-Todos is freely distributable under the MIT license.
  See the following for full license details:
    https:#github.com/kmalakoff/knockback-todos/blob/master/LICENSE
###

$(document).ready(->

  ###################################
  # Knockback-powered enhancements - BEGIN
  ###################################

  ###################################
  # Configure
  # set the language
  kb.locale_manager.setLocale('en')
  kb.locale_change_observable = kb.triggeredObservable(kb.locale_manager, 'change') # use to register a localization dependency

  # add a doubleclick and placeholder handlers to KO
  ko.bindingHandlers.dblclick =
    init: (element, value_accessor, all_bindings_accessor, view_model) ->
      $(element).dblclick(ko.utils.unwrapObservable(value_accessor()))
  ko.bindingHandlers.placeholder =
    update: (element, value_accessor, all_bindings_accessor, view_model) ->
      $(element).attr('placeholder', ko.utils.unwrapObservable(value_accessor()))

  # ko1.2.1 compatibility with 1.3
  if _.isUndefined(ko.templateSources)
    _ko_native_apply_bindings = ko.applyBindings
    ko.applyBindings = (view_model, element) ->
      view_model['$data'] = view_model
      _ko_native_apply_bindings(view_model, element)

  ###################################
  # Model: http://en.wikipedia.org/wiki/Model_view_controller
  # ORM: http://en.wikipedia.org/wiki/Object-relational_mapping
  ###################################

  # Settings
  class PrioritySetting extends Backbone.Model

  class PrioritiesSettingList extends Backbone.Collection
    model: PrioritySetting
    localStorage: new Store("kb_priorities") # Save all of the todo items under the `"kb_priorities"` namespace.
  priorities = new PrioritiesSettingList()

  ###################################
  # MVVM: http://en.wikipedia.org/wiki/Model_View_ViewModel
  ###################################

  # Localization
  LanguageOptionViewModel = (locale) ->
    @id = locale
    @label = kb.locale_manager.localeToLabel(locale)
    @option_group = 'lang'
    return this

  # Settings
  PrioritySettingsViewModel = (model) ->
    @priority = model.get('id')
    @priority_text = kb.observable(kb.locale_manager, {key: @priority})
    @priority_color = kb.observable(model, {key: 'color'})
    return this

  SettingsViewModel = (priority_settings) ->
    @priority_settings = ko.observableArray(_.map(priority_settings, (model)-> return new PrioritySettingsViewModel(model)))
    @getColorByPriority = (priority) ->
      @createColorsDependency()
      (return view_model.priority_color() if view_model.priority == priority) for view_model in @priority_settings()
      return ''
    @createColorsDependency = => view_model.priority_color() for view_model in @priority_settings()
    @default_priority = ko.observable('medium')
    @default_priority_color = ko.dependentObservable(=> return @getColorByPriority(@default_priority()))
    @priorityToRank = (priority) ->
      switch priority
        when 'high' then return 0
        when 'medium' then return 1
        when 'low' then return 2
    return this

  # Content
  SortingOptionViewModel = (string_id) ->
    @id = string_id
    @label = kb.observable(kb.locale_manager, {key: string_id})
    @option_group = 'list_sort'
    return this

  ###################################
  # Knockback-powered enhancements - END
  ###################################

  ###################################
  # Model: http://en.wikipedia.org/wiki/Model_view_controller
  # ORM: http://en.wikipedia.org/wiki/Object-relational_mapping
  ###################################

  # Todos
  class Todo extends Backbone.Model
    defaults: -> return {created_at: new Date()}
    set: (attrs) ->
      # note: this is to convert between Dates as JSON strings and Date objects. To automate this, take a look at Backbone.Articulation: https://github.com/kmalakoff/backbone-articulation
      attrs['done_at'] = new Date(attrs['done_at']) if attrs and attrs.hasOwnProperty('done_at') and _.isString(attrs['done_at'])
      attrs['created_at'] = new Date(attrs['created_at']) if attrs and attrs.hasOwnProperty('created_at') and _.isString(attrs['created_at'])
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
      todos.create({text: text, priority: window.settings_view_model.default_priority()})
      @create.input_text('')

    @priority_color = ko.dependentObservable(-> return window.settings_view_model.default_priority_color())
    @tooltip_visible = ko.observable(false)
    tooltip_visible = @tooltip_visible # closured for onSelectPriority
    @onSelectPriority = (event) ->
      event.stopPropagation()
      tooltip_visible(false)
      window.settings_view_model.default_priority(ko.utils.unwrapObservable(@priority))
    @onToggleTooltip = => @tooltip_visible(!@tooltip_visible())
    return this

  # Content
  TodoViewModel = (model) ->
    @text = kb.observable(model, {key: 'text', write: ((text) -> model.save({text: text}))}, this)
    @edit_mode = ko.observable(false)
    @toggleEditMode = (event) => @edit_mode(!@edit_mode()) if not @done()
    @onEnterEndEdit = (event) => @edit_mode(false) if (event.keyCode == 13)

    @created_at = model.get('created_at')
    @done = kb.observable(model, {key: 'done_at', read: (-> return model.done()), write: ((done) -> model.done(done)) }, this)

    @done_at = kb.observable(model, {key: 'done_at', localizer: LongDateLocalizer})
    @done_text = ko.dependentObservable(=>
      done_at = @done_at() # ensure there is a dependency
      return if !!done_at then return "#{kb.locale_manager.get('label_completed')}: #{done_at}" else ''
    )

    @priority_color = kb.observable(model, {key: 'priority', read: -> return window.settings_view_model.getColorByPriority(model.get('priority'))})
    @tooltip_visible = ko.observable(false)
    tooltip_visible = @tooltip_visible # closured for onSelectPriority
    @onSelectPriority = (event) ->
      event.stopPropagation()
      tooltip_visible(false)
      model.save({priority: ko.utils.unwrapObservable(@priority)})
    @onToggleTooltip = => @tooltip_visible(!@tooltip_visible())

    @destroyTodo = => model.destroy()
    return this

  TodoListViewModel = (todos) ->
    @todos = ko.observableArray([])
    @sort_mode = ko.observable('label_text')  # used to create a dependency
    @sorting_options = [new SortingOptionViewModel('label_text'), new SortingOptionViewModel('label_created'), new SortingOptionViewModel('label_priority')]
    @selected_value = ko.dependentObservable(
      read: => return @sort_mode()
      write: (new_mode) =>
        @sort_mode(new_mode)
        # update the collection observable's sorting function
        switch new_mode
          when 'label_text' then @collection_observable.sortAttribute('text')
          when 'label_created' then @collection_observable.sortedIndex((models, model)-> return _.sortedIndex(models, model, (test) -> test.get('created_at').valueOf()))
          when 'label_priority' then @collection_observable.sortedIndex((models, model)-> return _.sortedIndex(models, model, (test) -> window.settings_view_model.priorityToRank(test.get('priority'))))
      owner: this
    )
    @collection_observable = kb.collectionObservable(todos, @todos, {view_model: TodoViewModel, sort_attribute: 'text'})
    @sort_visible = ko.dependentObservable(=> @collection_observable().length)
    return this

  FooterViewModel = (locales) ->
    @instructions_text = kb.observable(kb.locale_manager, {key: 'instructions'})
    @current_language = ko.observable(kb.locale_manager.getLocale()) # used to create a dependency
    @language_options = ko.observableArray(_.map(locales, (locale) -> return new LanguageOptionViewModel(locale)))
    @selected_value = ko.dependentObservable(
      read: => return @current_language()
      write: (new_locale) => kb.locale_manager.setLocale(new_locale); @current_language(new_locale)
      owner: this
    )
    return this

  ###################################
  # Knockback-powered enhancements - BEGIN
  ###################################

  # Stats Footer
  StatsViewModel = (todos) ->
    @collection_observable = kb.collectionObservable(todos)
    @remaining_text = ko.dependentObservable(=>
      kb.locale_change_observable() # use to register a localization dependency
      count = @collection_observable.collection().remainingCount(); return '' if not count
      return kb.locale_manager.get((if count == 1 then 'remaining_template_s' else 'remaining_template_pl'), count)
    )
    @clear_text = ko.dependentObservable(=>
      kb.locale_change_observable() # use to register a localization dependency
      count = @collection_observable.collection().doneCount(); return '' if not count
      return kb.locale_manager.get((if count == 1 then 'clear_template_s' else 'clear_template_pl'), count)
    )
    @onDestroyDone = => model.destroy() for model in todos.allDone()
    return this

  # set up and bind the application view model
  window.settings_view_model = new SettingsViewModel([
    new Backbone.ModelRef(priorities, 'high'),
    new Backbone.ModelRef(priorities, 'medium'),
    new Backbone.ModelRef(priorities, 'low')
  ])
  app_view_model =
    header: new HeaderViewModel()
    create: new CreateTodoViewModel()
    todo_list: new TodoListViewModel(todos)
    footer: new FooterViewModel(kb.locale_manager.getLocales())
    stats: new StatsViewModel(todos)
  ko.applyBindings(app_view_model, $('#todoapp')[0])

  # Destroy when finished with the view models
  # kb.vmRelease(window.settings_view_model)
  # kb.vmRelease(app_view_model)

  ###################################
  # Load the prioties late to show the dynamic nature of Knockback with Backbone.ModelRef
  _.delay((->
    priorities.fetch(
      success: (collection) ->
        collection.create({id:'high', color:'#bf30ff'}) if not collection.get('high')
        collection.create({id:'medium', color:'#98acff'}) if not collection.get('medium')
        collection.create({id:'low', color:'#38ff6a'}) if not collection.get('low')
    )

    # set up color pickers
    $('.colorpicker').mColorPicker({imageFolder: 'css/images/'})
    $('.colorpicker').bind('colorpicked', ->
      model = priorities.get($(this).attr('id'))
      model.save({color: $(this).val()}) if model
    )
  ), 1000)

  ###################################
  # Knockback-powered enhancements - END
  ###################################
)