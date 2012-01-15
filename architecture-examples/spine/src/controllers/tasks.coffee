class window.Tasks extends Spine.Controller
  ENTER_KEY  = 13
  ESCAPE_KEY = 27

  elements:
    'form.edit': 'form'

  events:
    'click a.destroy':            'remove'
    'click input[type=checkbox]': 'toggleStatus'
    'dblclick .view':             'edit'
    'keypress input[type=text]':  'finishEditOnEnter'
    'blur input[type=text]':      'finishEdit'

  constructor: ->
    super
    @task.bind 'update', @render
    @task.bind 'destroy', @release

  render: =>
    @replace $('#task-template').tmpl(@task)
    this

  remove: ->
    @task.destroy()

  toggleStatus: ->
    @task.updateAttribute 'done', !@task.done

  edit: ->
    @el.addClass('editing')
    @$('input[name=name]').focus()

  finishEdit: ->
    @el.removeClass('editing')
    @task.fromForm(@form).save()

  finishEditOnEnter: (e) ->
    if e.keyCode in [ENTER_KEY, ESCAPE_KEY] then @finishEdit()
