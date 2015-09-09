ENTER_KEY = 13
ESCAPE_KEY = 27

class window.TodoViewModel extends kb.ViewModel
	constructor: (model, options) ->
		super(model, {requires: ['title', 'completed']}, options)

		@completed.subscribe((completed) => @model().save({completed}))
		@edit_title = ko.observable()
		@editing = ko.observable(false)

	onDestroy: => @model().destroy()

	onCheckEditBegin: =>
		return if @editing()

		@edit_title(@title())
		@editing(true)
		$('.todo-input').focus()

	onCheckEditEnd: (vm, event) =>
		return unless @editing()

		if (event.keyCode is ESCAPE_KEY)
			@editing(false)

		if (event.keyCode is ENTER_KEY) or (event.type is 'blur')
			$('.todo-input').blur()
			title = @edit_title()
			if $.trim(title) then @model().set({title}).save({title: $.trim(title)}) else _.defer(=>@model().destroy())
			@editing(false)
