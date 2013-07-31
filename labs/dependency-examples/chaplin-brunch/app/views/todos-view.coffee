CollectionView = require './base/collection-view'
template = require './templates/todos'
TodoView = require './todo-view'

module.exports = class TodosView extends CollectionView
  container: '#main'
  events:
    'click #toggle-all': 'toggleCompleted'
  itemView: TodoView
  listSelector: '#todo-list'
  listen:
    'all collection': 'renderCheckbox'
    'todos:clear mediator': 'clear'
  template: template

  render: =>
    super
    @renderCheckbox()

  renderCheckbox: =>
    @$('#toggle-all').prop 'checked', @collection.allAreCompleted()
    @$el.toggle(@collection.length isnt 0)

  toggleCompleted: (event) =>
    isChecked = event.currentTarget.checked
    @collection.each (todo) -> todo.save completed: isChecked

  clear: ->
    @collection.getCompleted().forEach (model) ->
      model.destroy()
