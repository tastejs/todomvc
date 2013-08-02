class window.Todos extends Spine.Controller
	ENTER_KEY = 13
	TPL = Handlebars.compile $('#todo-template').html()

	elements:
		'.edit': 'editElem'

	events:
		'click    .destroy': 'remove'
		'click    .toggle':  'toggleStatus'
		'dblclick label':    'edit'
		'keyup    .edit':    'finishEditOnEnter'
		'blur     .edit':    'finishEdit'

	constructor: ->
		super
		@todo.bind 'update', @render
		@todo.bind 'destroy', @release

	render: =>
		@replace TPL( @todo )
		@

	remove: ->
		@todo.destroy()

	toggleStatus: ->
		@todo.updateAttribute 'completed', !@todo.completed

	edit: ->
		@el.addClass 'editing'
		@editElem.val(@editElem.val()).focus()

	finishEdit: ->
		@el.removeClass 'editing'
		val = $.trim @editElem.val()
		if val then @todo.updateAttribute( 'title', val ) else @remove()

	finishEditOnEnter: (e) ->
		@finishEdit() if e.which is ENTER_KEY
