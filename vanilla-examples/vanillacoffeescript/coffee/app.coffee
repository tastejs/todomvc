###
Sets up a brand new Todo list.
@param {string} name The name of your new to do list.
###
class Todo
    constructor: (@name) ->
        @storage = new app.Store @name
        @model = new app.Model @storage
        @template = new app.Template
        @view = new app.View @template
        @controller = new app.Controller @model, @view

todo = new Todo "todos-coffeescript"

window.addEventListener "load", () ->
    todo.controller.setView document.location.hash

window.addEventListener "hashchange", () ->
    todo.controller.setView document.location.hash
