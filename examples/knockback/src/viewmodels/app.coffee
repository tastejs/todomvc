ENTER_KEY = 13

window.AppViewModel = ->
	#############################
	# Shared
	#############################
	# collections
	@collections =
		todos: new TodoCollection()
	@collections.todos.fetch()

	# shared observables
	@list_filter_mode = ko.observable('')
	filter_fn = ko.computed(=>
		switch @list_filter_mode()
			when 'active' then return (model) -> return model.completed()
			when 'completed' then return (model) -> return not model.completed()
			else return -> return false
	)
	@todos = kb.collectionObservable(@collections.todos, {view_model: TodoViewModel, filters: filter_fn})
	@todos_changed = kb.triggeredObservable(@collections.todos, 'change add remove')
	@tasks_exist = ko.computed(=> @todos_changed(); return !!@collections.todos.length)

	#############################
	# Header Section
	#############################
	@title = ko.observable('')
	@onAddTodo = (view_model, event) =>
		return true if not $.trim(@title()) or (event.keyCode != ENTER_KEY)

		# Create task and reset UI
		@collections.todos.create({title: $.trim(@title())})
		@title('')

	#############################
	# Main Section
	#############################
	@remaining_count = ko.computed(=> @todos_changed(); return @collections.todos.remainingCount())
	@completed_count = ko.computed(=> @todos_changed(); return @collections.todos.completedCount())
	@all_completed = ko.computed(
		read: => return not @remaining_count()
		write: (completed) => @collections.todos.completeAll(completed)
	)

	#############################
	# Footer Section
	#############################
	@onDestroyCompleted = =>
		@collections.todos.destroyCompleted()

	#############################
	# Localization
	#############################
	@loc =
		remaining_message: ko.computed(=> return "<strong>#{@remaining_count()}</strong> #{if @remaining_count() == 1 then 'item' else 'items'} left")
		clear_message: ko.computed(=> return if (count = @completed_count()) then "Clear completed (#{count})" else '')

	#############################
	# Routing
	#############################
	router = new Backbone.Router
	router.route('', null, => @list_filter_mode(''))
	router.route('active', null, => @list_filter_mode('active'))
	router.route('completed', null, => @list_filter_mode('completed'))
	Backbone.history.start()

	return