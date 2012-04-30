window.HeaderViewModel = (todos) ->
	@title = ko.observable('')

	@onAddTodo = (view_model, event) =>
		return true if not $.trim(@title()) or (event.keyCode != 13)

		# Create task and reset UI
		todos.create({title: $.trim(@title())})
		@title('')
	@