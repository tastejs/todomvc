class TaskApp extends Spine.Controller
  elements:
    '.items':    'tasks'
    '.countVal': 'counter'
    'a.clear':   'clearCompleted'

  events:
    'submit form#new-task':   'new'
    'click a.clear': 'clearCompleted'

  constructor: ->
    super
    Task.bind 'create', @renderNew
    Task.bind 'refresh', @renderAll
    Task.bind 'refresh change', @renderCounter
    Task.bind 'refresh change', @toggleClearCompleted
    Task.fetch()

  new: (e) ->
    e.preventDefault()
    Task.fromForm('form#new-task').save()

  renderNew: (task) =>
    view = new Tasks(task: task)
    @tasks.append view.render().el

  renderAll: =>
    Task.each @renderNew

  renderCounter: =>
    @counter.text Task.active().length

  toggleClearCompleted: =>
    if Task.done().length
      @clearCompleted.show()
    else
      @clearCompleted.hide()

  clearCompleted: ->
    Task.destroyDone()


$ ->
  new TaskApp(el: $('#tasks'))
