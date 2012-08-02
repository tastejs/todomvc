derby = require 'derby'
{get, view, ready} = derby.createApp module

derby.use(require '../../ui')

# Define a rendering function to handle both /:groupName and
# /:groupName/filterName.
renderGroup = (page, model, {groupName, filterName}) ->
	groupTodosQuery = model.query('todos').forGroup(groupName)
	model.subscribe "groups.#{groupName}", groupTodosQuery, (err, group, groupTodos) ->
		model.ref '_group', group
		model.setNull('_group._id', groupName)

		todoIds = group.at 'todoIds' or []

		# The refList supports array methods, but it stores the todo values on an
		# object by id. The todos are stored on the object
		# 'groups.groupName.todos', and their order is stored in an array of ids at
		# '_group.todoIds'
		model.refList '_todoList', "groups.#{groupName}.todos", todoIds

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

		filterName = filterName or 'all'
		page.render 'todo',
			filterName: filterName
			groupName: groupName


## ROUTES ##
get '/', (page) ->
	page.redirect '/' + parseInt(Math.random() * 1e9).toString(36)

get '/:groupName', renderGroup
get '/:groupName/:filterName', renderGroup

ready (model) ->

	list = model.at '_todoList'
	group = model.at '_group'

	group.on 'set', 'select_all', (select_all, previous_value, isLocal, e) ->
		# We only want to react to select_all being set if it's in response
		# to a UI event (as opposed to our checkAllCompleted below checking
		# individual items).
		return unless e
		# Is there a way to do this with one call rather than iterating?
		todos = model.at('_group.todos')
		for item in list.get()
			todos.set("#{item.id}.completed", select_all)

	newTodo = model.at '_newTodo'
	exports.add = ->
		# Don't add a blank todo
		text = view.escapeHtml newTodo.get().trim()
		newTodo.set ''
		return unless text
		# Insert the new todo before the first completed item in the list
		# or append to the end if none are completed
		items = list.get()
		i = 0
		if items
			for todo, i in list.get()
				break if todo.completed
		list.insert i, {text:text, completed: false, group: model.get '_group.id'}
		group.set('select_all', false)

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
