# It is a very good idea to have base Model / Collection
# e.g. Model = require 'models/base/model'
# But in this particular app since we only have one
# model type, we will inherit directly from Chaplin Model.
module.exports = class Todo extends Chaplin.Model
  defaults:
    title: ''
    completed: no

  initialize: ->
    super
    @set 'created', Date.now() if @isNew()

  toggle: ->
    @set completed: not @get('completed')

  isVisible: ->
    isCompleted = @get('completed')
