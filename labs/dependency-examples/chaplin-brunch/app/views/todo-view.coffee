View = require './base/view'
template = require './templates/todo'

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
