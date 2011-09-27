class Batmanjs.Todo extends Batman.Model

  # This model could be persisted locally with
  #
  @persist Batman.LocalStorage
  #
  # or over a REST endpoint with
  #
  # @persist Batman.RestStorage

  # Make this model available in the global scope with
  @global true

  @encode 'body', 'isDone'


  body: ''
  isDone: false


  # Add a computed property to this model with
  #
  # @accessor 'someKey',
  #   get: -> ...
  #   set: -> ...
  #
  # and whenever any of the properties accessed in the getter/setters change,
  # someKey will be recomputed and cached.

  # Observe a property or an event on this model with
  #
  # @observe 'someKey', (newValue, oldValue) ->
  #
  # and be notified of any changes to someKey on this model, or use
  #
  # @observeAll 'someKey', (newValue, oldValue) ->
  #
  # to be notified of any changes to someKey on any instance of the model.

  # Add an event to instances of this model with
  #
  # someEvent: @event -> ... # return value of event, passed to observers
  #
  # and fire it with
  #
  # modelInstance.someEvent()
