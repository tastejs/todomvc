View = require './base/view'

module.exports = class TodoView extends View
  events:
    'click .toggle': 'toggle'
    'dblclick label': 'edit'
    'keyup .edit': 'save'
    'focusout .edit': 'save'
    'click .destroy': 'clear'

  listen:
    'change model': 'render'

  template: require './templates/todo'
  tagName: 'li'

  clear: ->
    @model.destroy()

  toggle: ->
    @model.toggle().save()

  edit: ->
    @el.classList.add 'editing'
    @find('.edit').focus()

  save: (event) ->
    ENTER_KEY = 13
    title = event.delegateTarget.value.trim()
    return @model.destroy() unless title
    return if event.type is 'keyup' and event.keyCode isnt ENTER_KEY
    @model.save {title}
    @el.classList.remove 'editing'
