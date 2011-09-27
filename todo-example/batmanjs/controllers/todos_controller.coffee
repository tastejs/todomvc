class Batmanjs.TodosController extends Batman.Controller

  emptyTodo: null

  index: ->
    @set 'emptyTodo', new Todo

    # add some example todos to show off.
    Todo.load (error, todos) ->
      # you always want to make sure you handle errors (more elegantly than this) when writing connection code
      throw error if error
      unless todos and todos.length
        callback = (error) -> throw error if error
        new Todo(body: 'joker escaped arkham again', isDone: true).save(callback)
        new Todo(body: 'riddler sent riemann hypothesis').save(callback)
        new Todo(body: 'bane wants to meet, not worried').save(callback)

    # prevent the implicit render of views/todos/index.html
    @render false

  create: =>
    @emptyTodo.save (error, record) =>
      throw error if error

      # we use set so that our form will automatically update with the new Todo instance
      @set 'emptyTodo', new Todo

    # since this isn't actually a route action, nothing will be rendered here.

