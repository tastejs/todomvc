Utils = require './utils.coffee'

# Note: its usually better to use immutable data structures since theyre
# easier to reason about and React works very well with them. Thats why we
# use map() and filter() everywhere instead of mutating the array or todo
# items themselves.
class TodoModel
  constructor: (key) ->
    @key=key
    @todos = Utils.store key
    @onChanges = []

  subscribe: (onChange) ->
    @onChanges.push(onChange)
    return

  inform: ->
    Utils.store(@key, @todos)
    for onChange in @onChanges
      onChange()
    return

  addTodo: (title) ->
    #console.log "add #{title}"
    @todos = @todos.concat { id: Utils.uuid(), title: title, completed: false}
    @inform()
    return

  toggleAll: (checked) ->
    #console.log "toggleAll #{checked}"
    @todos = for todo in @todos
      Utils.extend {}, todo, {completed: checked}
    @inform()
    return

  toggle: (todoToToggle) ->
    #console.log "toggle #{todoToToggle.title}"
    @todos = for todo in @todos
      if todo isnt todoToToggle
        todo
      else
        Utils.extend {}, todo, {completed: !todo.completed}
    @inform()
    return

  destroy: (todoToDestroy) ->
    #console.log "destroy #{todoToDestroy.title}"
    @todos = for todo in @todos when todo isnt todoToDestroy
      todo
    @inform()
    return

  save: (todoToSave, text) ->
    #console.log "save #{todoToSave.title}, #{text}"
    @todos = for todo in @todos
      if todo isnt todoToSave
        todo
      else
        Utils.extend {}, todo, {title: text}
    @inform()
    return

  clearCompleted: ->
    #console.log "clearCompleted"
    @todos = for todo in @todos when not todo.completed
      todo
    @inform()
    return

module.exports = TodoModel