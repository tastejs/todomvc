Tasks = new Meteor.Collection('tasks')
ENTER_KEY = 13

if Meteor.is_client
	Template.todo.tasks = ->
		Tasks.find({})

	Template.todo.hasTodo = ->
		Tasks.find({}).count() > 0

	Template.todo.incompleted = ->
		Tasks.find(completed: false).count()

	Template.todo.incompleted_text = ->
		count = Tasks.find(completed: false).count()
		if count == 1
			' item left'
		else
			' items left'

	Template.todo.completed = ->
		Tasks.find(completed: true).count()

	Template.todo.events =
		'click #toggle-all': (evt) ->
			all_completed = _.all($(".view .toggle"), (e) -> $(e).prop("checked"))
			toggle_all = !all_completed

			modifiers = $set: completed: toggle_all
			options   = multi: true
			Tasks.update {}, modifiers, options, ->
				$("#toggle-all").prop('checked', toggle_all)

		'keyup #new-todo' : (evt) ->
			if evt.type == 'keyup' && evt.which == ENTER_KEY
				textbox = $('#new-todo')
				text = textbox.val().trim()
				if text
					Tasks.insert
						title: textbox.val()
						completed: false
					textbox.val('')
					textbox.focus()
					return false

		'click #clear-completed': ->
			Tasks.remove completed: true
			return false

	Template.item.events =
		'click .toggle': (evt) ->
			task = Tasks.findOne this._id
			task.completed = $(evt.target).prop('checked')
			Tasks.update _id: this._id, task, ->
				all_completed = _.all($(".view .toggle"), (e) -> $(e).prop("checked"))
				$("#toggle-all").prop('checked', all_completed)

		'click .destroy': (evt) ->
			Tasks.remove _id: this._id

		'dblclick .view': (evt) ->
			task = Tasks.findOne this._id
			task.editing = true
			Tasks.update _id: this._id, task, (err) ->
				unless err
					$(".edit").focus().select()

		'blur input.edit': (evt) ->
			task = Tasks.findOne this._id
			task.editing = false
			Tasks.update _id: this._id, task 

		'keyup input.edit': (evt) ->
			if evt.type == 'keyup' && evt.which == ENTER_KEY
				text = $(evt.target).val().trim()

				if text
					task = Tasks.findOne this._id
					task.editing = false
					task.updated = new Date()
					task.title = $(evt.target).val()
					Tasks.update _id: this._id, task, (err) =>
					    alert('Sorry, an error prevent the changes to be saved') if err
				else
					Tasks.remove _id: this._id
          
			return false
