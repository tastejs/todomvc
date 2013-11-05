CollectionView = require './base/collection-view'
TodoView = require './todo-view'
utils = require 'lib/utils'

module.exports = class TodosView extends CollectionView
  container: '#main'
  events:
    'click #toggle-all': 'toggleCompleted'
  itemView: TodoView
  listSelector: '#todo-list'
  listen:
    'all collection': 'renderCheckbox'
    'todos:clear mediator': 'clear'
  template: require './templates/todos'

  render: ->
    super
    @renderCheckbox()

  renderCheckbox: ->
    @find('#toggle-all').setAttribute 'checked', @collection.allAreCompleted()
    utils.toggle @el, @collection.length isnt 0

  toggleCompleted: (event) ->
    isChecked = event.delegateTarget.checked
    @collection.each (todo) -> todo.save completed: isChecked

  clear: ->
    @collection.getCompleted().forEach (model) ->
      model.destroy()
