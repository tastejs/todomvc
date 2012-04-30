window.FooterViewModel = (todos) ->
	@collection_observable = kb.collectionObservable(todos)

	@remaining_count = ko.computed(=> return @collection_observable.collection().remainingCount())
	@remaining_text = ko.computed(=> return "#{if @collection_observable.collection().remainingCount() == 1 then 'item' else 'items'} left")

	@clear_text = ko.computed(=>
		count = @collection_observable.collection().completedCount()
		return if count then "Clear #{count} completed #{if count == 1 then 'item' else 'items'}" else ''
	)

	@onDestroyCompleted = => todos.destroyCompleted()
	@