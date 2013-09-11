HeaderView = require 'views/header-view'
FooterView = require 'views/footer-view'
TodosView = require 'views/todos-view'
mediator = require 'mediator'

module.exports = class IndexController extends Chaplin.Controller
  # The method is executed before any controller actions.
  # We compose structure in order for it to be rendered only once.
  beforeAction: ->
    @compose 'structure', ->
      params = collection: mediator.todos
      @header = new HeaderView params
      @footer = new FooterView params

  # On each new load, old @view will be disposed and
  # new @view will be created. This is idiomatic Chaplin memory management:
  # one controller per screen.
  list: (params) ->
    filterer = params.filterer?.trim() ? 'all'
    @publishEvent 'todos:filter', filterer
    @view = new TodosView collection: mediator.todos, filterer: (model) ->
      switch filterer
        when 'completed' then model.get('completed')
        when 'active' then not model.get('completed')
        else true
