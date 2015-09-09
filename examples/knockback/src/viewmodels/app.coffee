ENTER_KEY = 13

class window.AppViewModel
	constructor: ->
		@list_filter_mode = ko.observable('')
		filter_fn = ko.computed(=>
			switch @list_filter_mode()
				when 'active' then return ((model) -> return !model.get('completed'))
				when 'completed' then return ((model) -> return model.get('completed'))
				else return (-> return true)
		)
		@todos = kb.collectionObservable(new TodoCollection(), TodoViewModel, {filters: filter_fn})
		@todos.collection().fetch()

		# Note: collectionObservables only track additions and removals so model attribute changes need to be manually triggered
		@_todos_changed = kb.triggeredObservable(@todos.collection(), 'change add remove')
		@tasks_exist = ko.computed(=> @_todos_changed(); return !!@todos.collection().models.length)

		@title = ko.observable('')

		@completed_count = ko.computed(=> @_todos_changed(); return @todos.collection().filter((model) -> return model.get('completed')).length)
		@remaining_count = ko.computed(=> @_todos_changed(); return @todos.collection().length - @completed_count())
		@all_completed = ko.computed({
			read: => return not @remaining_count()
			write: (completed) => @todos.collection().each((model) -> model.save({completed}))
		})

		@loc =
			remaining_message: ko.computed(=> return "<strong>#{@remaining_count()}</strong> #{if @remaining_count() == 1 then 'item' else 'items'} left")
			clear_message: ko.computed(=> return if @completed_count() then 'Clear completed' else '')

		router = new Backbone.Router
		for route in ['', 'active', 'completed'] then do (route) =>
			router.route(route, null, => @list_filter_mode(route))
		Backbone.history.start()

	onAddTodo: (vm, event) =>
		return if not $.trim(@title()) or (event.keyCode isnt ENTER_KEY)

		@todos.collection().create({title: $.trim(@title())})
		@title('')

	onClearCompleted: => model.destroy() for model in @todos.collection().filter((model) -> return model.get('completed'))
