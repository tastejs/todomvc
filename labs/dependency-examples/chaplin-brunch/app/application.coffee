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
    # Create a user property
    mediator.user = null
    # Add additional application-specific properties and methods
    mediator.todos = new Todos()
    # If todos are fetched from server, we will need to wait
    # for them.
    mediator.todos.fetch()
    # Seal the mediator
    super
