window.AppViewModel = (todos) ->
	@header = new HeaderViewModel(todos)
	@todos = new TodosViewModel(todos)
	@footer = new FooterViewModel(todos)
	@