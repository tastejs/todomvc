CollectionView = require 'views/base/collection-view'
template = require 'views/templates/todos'
TodoView = require 'views/todo-view'

module.exports = class TodosView extends CollectionView
  el: '#main'
  itemView: TodoView
  listSelector: '#todo-list'
  template: template

  initialize: ->
    super
    @subscribeEvent 'todos:clear', @clear
    @modelBind 'all', @renderCheckbox
    @delegate 'click', '#toggle-all', @toggleCompleted

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
