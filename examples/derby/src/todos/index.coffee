derby = require 'derby'
{get, view, ready} = derby.createApp module

derby.use(require '../../ui')

view.fn 'noItems',
	get: (list) -> !list.length unless list is undefined
	set: ->

view.fn 'oneItem',
	get: (list) -> list.length == 1 unless list is undefined

# Redirect the visitor to a random todo list
get '/', (page) ->
	page.redirect '/' + parseInt(Math.random() * 1e9).toString(36)

# Sets up the model, the reactive function for stats and renders the todo list
get '/:groupName', (page, model, {groupName}) ->
	model.query('todos').forGroup(groupName).subscribe ->
		model.set '_groupName', groupName

		model.ref '_list.all', model.filter('todos')
			.where('group').equals(groupName)

		model.ref '_list.completed', model.filter('todos')
			.where('group').equals(groupName)
			.where('completed').equals(true)

		model.ref '_list.active', model.filter('todos')
			.where('group').equals(groupName)
			.where('completed').notEquals(true)

		model.set '_list.filterName', 'all'

		# model.set '_filter', 'all'
		# model.ref '_list.shown', '_list', '_filter'
        # XXX 2012-12-04 Calling .get on keyed ref returns getter fn.
        # We used to use the above keyed ref on _list, but when
        # using derby master, it results in
        # https://github.com/codeparty/derby/issues/179
		model.ref '_list.shown', '_list.all'

		page.render()

# Transitional route for enabling a filter
get from: '/:groupName', to: '/:groupName/:filterName',
	forward: (model, {filterName}) ->
		model.set '_list.filterName', filterName
		model.ref '_list.shown', "_list.#{filterName}"
	back: (model, params) ->
		model.set '_list.filterName', filterName
		model.ref '_list.shown', "_list.all"

get from: '/:groupName/:filterName', to: '/:groupName/:filterName',
	forward: (model, {filterName}) ->
		model.set '_list.filterName', filterName
		model.ref '_list.shown', "_list.#{filterName}"

ready (model) ->
	todos = model.at 'todos'
	newTodo = model.at '_newTodo'

	exports.add = ->
		# Don't add a blank todo
		text = newTodo.get().trim()
		newTodo.set ''
		return unless text
		todos.add text: text, group: model.get('_groupName')

	exports.del = (e, el) ->
		# Derby extends model.at to support creation from DOM nodes
		todos.del model.at(el).get('id')

	exports.clearCompleted = ->
		for {id} in model.get('_list.completed')
			todos.del id

	exports.clickToggleAll = ->
		value = !!model.get('_list.active.length')
		for {id} in model.get('_list.all')
			todos.set id + '.completed', value

	exports.submitEdit = (e, el) ->
		el.firstChild.blur()

	exports.startEdit = (e, el) ->
		item = model.at(el)
		item.set '_editing', true

		input =	el.parentElement.parentElement.lastChild.firstChild
		input.value = item.get('text')
		input.focus()

	exports.endEdit = (e, el) ->
		item = model.at(el)
		item.set '_editing', false
		if item.get('text').trim() == ''
			todos.del item.get('id')
