$ ->
	# Add custom handlers to Knockout.js - adapted from Knockout.js Todos app: https://github.com/ashish01/knockoutjs-todos
	ko.bindingHandlers.dblclick =
		init: (element, value_accessor) -> $(element).dblclick(ko.utils.unwrapObservable(value_accessor()))
	ko.bindingHandlers.block =
		update: (element, value_accessor) -> element.style.display = if ko.utils.unwrapObservable(value_accessor()) then 'block' else 'none'
	ko.bindingHandlers.selectAndFocus =
		init: (element, value_accessor, all_bindings_accessor) ->
			ko.bindingHandlers.hasfocus.init(element, value_accessor, all_bindings_accessor)
			ko.utils.registerEventHandler(element, 'focus', -> element.focus())
		update: (element, value_accessor) ->
			ko.utils.unwrapObservable(value_accessor()) # create dependency
			_.defer(=>ko.bindingHandlers.hasfocus.update(element, value_accessor))

	# Create and bind the app viewmodels
	window.app = {viewmodels: {}}
	app.viewmodels.settings = new SettingsViewModel()
	todos = new TodoCollection()
	app.viewmodels.header = new HeaderViewModel(todos)
	app.viewmodels.todos = new TodosViewModel(todos)
	app.viewmodels.footer = new FooterViewModel(todos)
	ko.applyBindings(app.viewmodels, $('#todoapp')[0])

	# Start the app routing
	new AppRouter()
	Backbone.history.start()

	# Load the todos
	todos.fetch()

	# kb.vmRelease(app.viewmodels)		# Destroy when finished with the view model
