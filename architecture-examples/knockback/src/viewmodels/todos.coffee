TodoViewModel = (model) ->
	# Task UI state
	@editing = ko.observable(false)
	@completed = kb.observable(model, {key: 'completed', write: ((completed) -> model.save(completed: completed)) }, @)
	@visible = ko.computed(=>
		switch app.viewmodels.settings.list_filter_mode()
			when 'active' then return not @completed()
			when 'completed' then return @completed()
			else return true
	)

	@title = kb.observable(model, {
		key: 'title'
		write: ((title) =>
			if $.trim(title) then model.save(title: $.trim(title)) else model.destroy()
			@editing(false)
		)
	}, @)

	@onDestroyTodo = => model.destroy()

	@onCheckEditBegin = => (@editing(true); $('.todo-input').focus()) if not @editing() and not @completed()
	@onCheckEditEnd = (view_model, event) => ($('.todo-input').blur(); @editing(false)) if (event.keyCode == 13) or (event.type == 'blur')
	@

window.TodosViewModel = (todos) ->
	@todos = ko.observableArray([])
	@collection_observable = kb.collectionObservable(todos, @todos, view_model: TodoViewModel)

	@tasks_exist = ko.computed(=> @collection_observable().length)

	@all_completed = ko.computed(
		read: => return not @collection_observable.collection().remainingCount()
		write: (completed) => @collection_observable.collection().completeAll(completed)
	)
	@