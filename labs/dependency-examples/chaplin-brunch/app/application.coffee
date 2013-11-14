mediator = require 'mediator'
Todos = require 'models/todos'

# The application object
module.exports = class Application extends Chaplin.Application
  # Set your application name here so the document title is set to
  # “Controller title – Site title” (see Layout#adjustTitle)
  title: 'Chaplin • TodoMVC'

  # Create additional mediator properties
  # -------------------------------------
  initMediator: ->
    # Add additional application-specific properties and methods
    mediator.todos = new Todos()
    # Seal the mediator
    super

  start: ->
    # If todos are fetched from server, we will need to wait for them.
    mediator.todos.fetch()
    super
