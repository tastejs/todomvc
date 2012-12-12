View = require 'views/base/view'
template = require 'views/templates/todo'

module.exports = class TodoView extends View
  template: template
  tagName: 'li'

  initialize: ->
    super
    @modelBind 'change', @render
    @delegate 'click', '.destroy', @destroy
    @delegate 'dblclick', 'label', @edit
    @delegate 'keypress', '.edit', @save
    @delegate 'click', '.toggle', @toggle
    @delegate 'blur', '.edit', @save

  render: =>
    super
    # Reset classes, re-add the appropriate ones.
    @$el.removeClass 'active completed'
    className = if @model.get('completed') then 'completed' else 'active'
    @$el.addClass className

  destroy: =>
    @model.destroy()

  toggle: =>
    @model.toggle().save()

  edit: =>
    @$el.addClass 'editing'
    @$('.edit').focus()

  save: (event) =>
    ENTER_KEY = 13
    title = $(event.currentTarget).val().trim()
    return @model.destroy() unless title
    return if event.type is 'keypress' and event.keyCode isnt ENTER_KEY
    @model.save {title}
    @$el.removeClass 'editing'
