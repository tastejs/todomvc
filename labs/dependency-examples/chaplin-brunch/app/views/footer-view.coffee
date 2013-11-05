View = require './base/view'
utils = require 'lib/utils'

module.exports = class FooterView extends View
  autoRender: true
  el: '#footer'
  events:
    'click #clear-completed': 'clearCompleted'
  listen:
    'todos:filter mediator': 'updateFilterer'
    'all collection': 'renderCounter'
  template: require './templates/footer'

  render: ->
    super
    @renderCounter()

  updateFilterer: (filterer) ->
    filterer = '' if filterer is 'all'
    selector = "[href='#/#{filterer}']"
    cls = 'selected'
    @findAll('#filters a').forEach (link) =>
      link.classList.remove cls
      link.classList.add cls if Backbone.utils.matchesSelector link, selector

  renderCounter: ->
    total = @collection.length
    active = @collection.getActive().length
    completed = @collection.getCompleted().length

    @find('#todo-count > strong').textContent = active
    countDescription = (if active is 1 then 'item' else 'items')
    @find('.todo-count-title').textContent = countDescription

    @find('#completed-count').textContent = "(#{completed})"
    utils.toggle @find('#clear-completed'), completed > 0
    utils.toggle @el, total > 0

  clearCompleted: ->
    @publishEvent 'todos:clear'
