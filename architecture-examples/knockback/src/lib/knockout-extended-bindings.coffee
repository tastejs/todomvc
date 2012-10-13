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
		_.defer(->ko.bindingHandlers.hasfocus.update(element, value_accessor))