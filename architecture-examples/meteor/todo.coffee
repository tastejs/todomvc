Tasks = new Meteor.Collection('tasks')
ENTER_KEY = 13

if Meteor.is_client
	Template.todo.allItemsChecked = ->
		_.all($('.view .toggle'), (e) -> $(e).prop('checked'))

	Template.todo.tasks = ->
		Tasks.find({}, sort: created_at: -1)

	Template.todo.hasAny = ->
		Tasks.find({}).count() > 0

	Template.todo.allCompleted = ->
		Tasks.find(completed: false).count() == 0

	Template.todo.events =
		'click #toggle-all': (evt) ->
			isChecked  = $("#toggle-all").prop 'checked'
			modifiers  = $set: completed: isChecked
			options    = multi: true
			Tasks.update {}, modifiers, options

		'keyup #new-todo' : (evt) ->
			if evt.type == 'keyup' && evt.which == ENTER_KEY
				textbox = $('#new-todo')
				text = textbox.val().trim()
				if text
					Tasks.insert
						title: textbox.val()
						completed: false
						created_at: new Date()
					textbox.val('')

		'click #clear-completed': ->
			Tasks.remove completed: true

	Template.footer.incompleted = ->
		Tasks.find(completed: false).count()

	Template.footer.incompletedText = ->
		count = Tasks.find(completed: false).count()
		if count == 1
			' item left'
		else
			' items left'

	Template.footer.completed = ->
		Tasks.find(completed: true).count()

	Template.item.editing = ->
		Session.equals 'editing_id', this._id

	Template.item.events =
		'click .toggle': (evt) ->
			task = Tasks.findOne this._id
			task.completed = $(evt.target).prop('checked')
			Tasks.update _id: this._id, task
			evt.preventDefault()

		'click .destroy': (evt) ->
			Template.item.updateTask this._id, null

		'dblclick .view': (evt) ->
			return if $(evt.target).hasClass('toggle') # do not response to double click on checkbox

			Session.set 'editing_id', this._id

			Meteor.flush() # force update UI so that we can select it
			$('.edit').select()

		'blur input.edit': (evt) ->
			text = $(evt.target).val().trim()
			Template.item.updateTask this._id, text

		'keyup input.edit': (evt) ->
			if evt.type == 'keyup' && evt.which == ENTER_KEY
				text = $(evt.target).val().trim()
				Template.item.updateTask this._id, text
			return false

	Template.item.updateTask = (id, value) ->
		if value
			task = Tasks.findOne id
			task.title = value
			Tasks.update _id: id, task, ->
				alert('Sorry, an error prevent the changes to be saved') if err
			Session.set 'editing_id', null
		else
			Tasks.remove _id: id

	refreshToggleAll = ->
		$("#toggle-all").prop 'checked', Template.todo.allCompleted()

	Tasks.find({}).observe
		added: refreshToggleAll
		changed: refreshToggleAll
		removed: refreshToggleAll
