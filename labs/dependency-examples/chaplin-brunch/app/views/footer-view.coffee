View = require './base/view'
template = require './templates/footer'

module.exports = class FooterView extends View
  autoRender: true
  el: '#footer'
  events:
    'click #clear-completed': 'clearCompleted'
  listen:
    'todos:filter mediator': 'updateFilterer'
    'all collection': 'renderCounter'
  template: template

  render: ->
    super
    @renderCounter()

  updateFilterer: (filterer) ->
    filterer = '' if filterer is 'all'
    @$('#filters a')
      .removeClass('selected')
      .filter("[href='#/#{filterer}']")
      .addClass('selected')

  renderCounter: ->
    total = @collection.length
    active = @collection.getActive().length
    completed = @collection.getCompleted().length

    @$('#todo-count > strong').html active
    countDescription = (if active is 1 then 'item' else 'items')
    @$('.todo-count-title').text countDescription

    @$('#completed-count').html "(#{completed})"
    @$('#clear-completed').toggle(completed > 0)
    @$el.toggle(total > 0)

  clearCompleted: ->
    @publishEvent 'todos:clear'
