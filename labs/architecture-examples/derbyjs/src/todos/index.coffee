derby = require 'derby'
{get, view, ready} = derby.createApp module

derby.use(require '../../ui')

## ROUTES ##

# Redirect the visitor to a random todo list
get '/', (page) ->
	page.redirect '/' + parseInt(Math.random() * 1e9).toString(36)

# Sets up the model, the reactive function for stats and renders the todo list
get '/:groupName', (page, model, {groupName}) ->
	groupTodosQuery = model.query('todos').forGroup(groupName)
	model.subscribe "groups.#{groupName}", groupTodosQuery, (err, group, groupTodos) ->
		model.ref '_group', group
		group.setNull 'id', groupName

		todoIds = group.at 'todoIds' or []

		# The refList supports array methods, but it stores the todo values
		# on an object by id. The todos are stored on the object 'todos',
		# and their order is stored in an array of ids at '_group.todoIds'
		model.refList '_todoList', 'todos', todoIds

		# Create a reactive function that automatically keeps '_stats'
		# updated with the number of remaining and completed todos.
		model.fn '_stats', '_todoList', (list) ->
			remaining = 0
			completed = 0
			if list
				for todo in list
					if todo?.completed
						completed++
					else
						remaining++
			return {
				completed: completed,
				remaining: remaining,
				oneOnly: remaining == 1,
			}

		# Do not filter the list by default
		model.del '_filter'

		page.render 'todo'

# Transitional route for enabling a filter
get {from: '/:groupName', to: '/:groupName/:filterName'},
	forward: (model, {filterName}, next) ->
		# enable the filter
		model.set '_filter', filterName
	back: (model, params, next) ->
		# disable the filter
		model.del '_filter'

ready (model) ->

	list = model.at '_todoList'
	group = model.at '_group'

	group.on 'set', 'select_all', (select_all, previous_value, isLocal, e) ->
		# We only want to react to select_all being set if it's in response
		# to a UI event (as opposed to our checkAllCompleted below checking
		# individual items).
		return unless e
		# Is there a way to do this with one call rather than iterating?
		for {id} in list.get()
			model.set "todos.#{id}.completed", select_all

	newTodo = model.at '_newTodo'
	exports.add = ->
		# Don't add a blank todo
		text = view.escapeHtml newTodo.get().trim()
		newTodo.set ''
		return unless text

		list.push text: text, completed: false, group: group.get('id')
		group.set 'select_all', false

	exports.del = (e) ->
		# Derby extends model.at to support creation from DOM nodes
		model.at(e.target).remove()

	exports.clearCompleted = ->
		completed_indexes = (i for item, i in list.get() when item.completed)
		list.remove(i) for i in completed_indexes.reverse()
		group.set('select_all', false)

	exports.checkAllCompleted = ->
		allCompleted = true
		allCompleted &&= item.completed for item in list.get()
		group.set('select_all', allCompleted)

	exports.endEdit = (e) ->
		target = e.target
		if target.nodeName == "FORM"
			target.firstChild.blur()
			return
		item = model.at(target)
		item.set('_editing', false)
		text = item.get('text').trim()
		if not text
			item.remove()

	exports.startEdit = (e) ->
		item = model.at(e.target)
		item.set('_editing', true)
