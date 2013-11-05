CollectionView = require './base/collection-view'

module.exports = class TodosView extends CollectionView
  container: '#main'
  events:
    'click #toggle-all': 'toggleCompleted'
  itemView: require './todo-view'
  listSelector: '#todo-list'
  listen:
    'all collection': 'renderCheckbox'
    'todos:clear mediator': 'clear'
  template: require './templates/todos'

  render: ->
    super
    @renderCheckbox()

  renderCheckbox: ->
    @$('#toggle-all').prop 'checked', @collection.allAreCompleted()
    @$el.toggle(@collection.length isnt 0)

  toggleCompleted: (event) ->
    isChecked = event.currentTarget.checked
    @collection.each (todo) -> todo.save completed: isChecked

  clear: ->
    @collection.getCompleted().forEach (model) ->
      model.destroy()
