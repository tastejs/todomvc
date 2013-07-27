HeaderView = require 'views/header-view'
FooterView = require 'views/footer-view'
TodosView = require 'views/todos-view'
mediator = require 'mediator'

module.exports = class Controller extends Chaplin.Controller
  beforeAction: ->
    @compose 'footer', ->
      params = collection: mediator.todos
      @header = new HeaderView params
      @footer = new FooterView params
      @todos = new TodosView params
