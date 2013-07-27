# Layout is the top-level application ‘view’.
module.exports = class Layout extends Chaplin.Layout
  listen:
    'todos:filter mediator': 'changeFilterer'

  changeFilterer: (filterer = 'all') ->
    $('#todoapp').attr 'class', "filter-#{filterer}"
