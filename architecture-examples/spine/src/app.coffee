class TodoApp extends Spine.Controller
	ENTER_KEY = 13

	elements:
		'#new-todo':        'newTodoInput'
		'#toggle-all':      'toggleAllElem'
		'#main':			'main'
		'#todo-list':       'todos'
		'#footer':          'footer'
		'#todo-count':      'count'
		'#filters a':       'filters'
		'#clear-completed': 'clearCompleted'

	events:
		'keyup #new-todo':        'new'
		'click #toggle-all':      'toggleAll'
		'click #clear-completed': 'clearCompleted'

	constructor: ->
		super
		Todo.bind 'create', @addNew
		Todo.bind 'refresh change', @addAll
		Todo.bind 'refresh change', @toggleElems
		Todo.bind 'refresh change', @renderFooter
		Todo.fetch()
		@routes
			'/:filter': (param) ->
				@filter = param.filter
				###
				TODO: Need to figure out why the route doesn't trigger `change` event
				###
				Todo.trigger('refresh')
				@filters.removeClass('selected')
					.filter("[href='#/#{ @filter }']").addClass('selected');

	new: (e) ->
		val = $.trim @newTodoInput.val()
		if e.which is ENTER_KEY and val
			Todo.create title: val
			@newTodoInput.val ''

	getByFilter: ->
		switch @filter
			when 'active'
				Todo.active()
			when 'completed'
				Todo.completed()
			else
				Todo.all()

	addNew: (todo) =>
		view = new Todos todo: todo
		@todos.append view.render().el

	addAll: =>
		@todos.empty()
		@addNew todo for todo in @getByFilter()

	toggleAll: (e) ->
		Todo.each (todo) ->
			###
			TODO: Model updateAttribute sometimes won't stick:
				https://github.com/maccman/spine/issues/219
			###
			todo.updateAttribute 'completed', e.target.checked
			todo.trigger 'update', todo

	clearCompleted: ->
		Todo.destroyCompleted()

	toggleElems: =>
		isTodos = !!Todo.count()
		@main.toggle isTodos
		@footer.toggle isTodos
		@clearCompleted.toggle !!Todo.completed().length
		@toggleAllElem.removeAttr 'checked' if !Todo.completed().length

	renderFooter: =>
		text = (count) -> if count is 1 then 'item' else 'items'
		active = Todo.active().length
		completed = Todo.completed().length
		@count.html "<strong>#{ active }</strong> #{ text active } left"
		@clearCompleted.text "Clear completed (#{ completed })"


$ ->
	new TodoApp el: $('#todoapp')
	Spine.Route.setup()
