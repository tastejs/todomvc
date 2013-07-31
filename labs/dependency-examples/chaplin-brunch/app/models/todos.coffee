Todo = require 'models/todo'

module.exports = class Todos extends Chaplin.Collection
  model: Todo
  localStorage: new Store 'todos-chaplin'

  allAreCompleted: ->
    @getCompleted().length is @length

  getCompleted: ->
    @where completed: yes

  getActive: ->
    @where completed: no

  comparator: (todo) ->
    todo.get('created')
