View = require 'views/base/view'
template = require 'views/templates/todo'

module.exports = class TodoView extends View
  events:
    'click .toggle': 'toggle'
    'dblclick label': 'edit'
    'keypress .edit': 'save'
    'blur .edit': 'save'
    'click .destroy': 'destroy'

  listen:
    'change model': 'render'

  template: template
  tagName: 'li'

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
