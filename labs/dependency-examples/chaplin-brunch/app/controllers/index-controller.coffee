Controller = require './base/controller'

module.exports = class IndexController extends Controller
  list: (params) ->
    @publishEvent 'todos:filter', params.filterer?.trim() ? 'all'
