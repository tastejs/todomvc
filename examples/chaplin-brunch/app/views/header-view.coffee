View = require './base/view'

module.exports = class HeaderView extends View
  autoRender: true
  el: '#header'
  events:
    'keypress #new-todo': 'createOnEnter'
  template: require './templates/header'

  createOnEnter: (event) ->
    ENTER_KEY = 13
    title = event.delegateTarget.value.trim()
    return if event.keyCode isnt ENTER_KEY or not title
    @collection.create {title}
    @find('#new-todo').value = ''
