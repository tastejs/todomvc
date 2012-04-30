###
	knockback-todos.js
	(c) 2011 Kevin Malakoff.
	Knockback-Todos is freely distributable under the MIT license.
	See the following for full license details:
		https:#github.com/kmalakoff/knockback-todos/blob/master/LICENSE
###

$ ->
	# Add custom handlers to Knockout.js - adapted from Knockout.js Todos app: https://github.com/ashish01/knockoutjs-todos
	ko.bindingHandlers.dblclick =
		init: (element, value_accessor) -> $(element).dblclick(ko.utils.unwrapObservable(value_accessor()))
	ko.bindingHandlers.block =
		update: (element, value_accessor) -> element.style.display = if ko.utils.unwrapObservable(value_accessor()) then 'block' else 'none'
	ko.bindingHandlers.selectAndFocus =
		init: (element, value_accessor, all_bindings_accessor) ->
			ko.bindingHandlers.hasfocus.init(element, value_accessor, all_bindings_accessor)
			ko.utils.registerEventHandler(element, 'focus', -> element.select())
		update: (element, value_accessor) ->
			ko.utils.unwrapObservable(value_accessor()) # create dependency
			_.defer(=>ko.bindingHandlers.hasfocus.update(element, value_accessor))

	# Create app settings view model
	window.app_settings_view_model = new AppSettingsViewModel()

	# Create and bind the app view model
	todos = new TodosCollection()
	window.app_view_model = new AppViewModel(todos)
	ko.applyBindings(app_view_model, $('#todoapp')[0])

	# Start the app routing
	new AppRouter()
	Backbone.history.start()

	# Load the todos
	todos.fetch()

	# kb.vmRelease(app_view_model)		# Destroy when finished with the view model
