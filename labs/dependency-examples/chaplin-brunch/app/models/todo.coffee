Model = require 'models/base/model'

module.exports = class Todo extends Model
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
