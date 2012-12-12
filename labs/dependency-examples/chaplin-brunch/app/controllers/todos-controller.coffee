Controller = require 'controllers/base/controller'
TodosView = require 'views/todos-view'
mediator = require 'mediator'

module.exports = class TodosController extends Controller
  initialize: ->
    super
    @view = new TodosView collection: mediator.todos
