Controller = require 'controllers/base/controller'
HeaderView = require 'views/header-view'
mediator = require 'mediator'

module.exports = class HeaderController extends Controller
  initialize: ->
    super
    @view = new HeaderView collection: mediator.todos
