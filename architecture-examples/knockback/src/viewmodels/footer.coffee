window.FooterViewModel = (todos) ->
	@todos = kb.collectionObservable(todos)
	@todos.collection().bind('change', => @todos.valueHasMutated())   # get notified of changes to any models

	@remaining_text = ko.computed(=> return "<strong>#{@todos.collection().remainingCount()}</strong> #{if @todos.collection().remainingCount() == 1 then 'item' else 'items'} left")

	@clear_text = ko.computed(=>
		count = @todos.collection().completedCount()
		return if count then "Clear completed (#{count})" else ''
	)

	@onDestroyCompleted = => todos.destroyCompleted()
	@
