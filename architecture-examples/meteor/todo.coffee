Tasks = new Meteor.Collection('tasks')
ENTER_KEY = 13

if Meteor.is_client
	Template.todo.tasks = ->
		Tasks.find {}, {sort: {completed: 1}}

	Template.todo.hasTodo = ->
		Tasks.find({}).count() > 0

	Template.todo.incompleted = ->
		Tasks.find({completed: false}).count()

	Template.todo.incompleted_text = ->
		count = Tasks.find({completed: false}).count()
		if count == 1
			' item left'
		else
			' items left'

	Template.todo.completed = ->
		Tasks.find({completed: true}).count()

	Template.todo.events =
		'keyup #new-todo' : (evt) ->
			if evt.type == 'keyup' && evt.which == ENTER_KEY
				textbox = $('#new-todo')
				Tasks.insert {title: textbox.val(), completed: false}
				textbox.val('')
				textbox.focus()
			return false

		'click #clear-completed': ->
			Tasks.remove {completed: true} 
			return false

		'click #mark-all-checked': (evt) ->
			Tasks.update {}, {$set: {completed: true}}, {multi: true}
			$(evt.target).removeAttr('checked')
  
	Template.item.events =
		'click .toggle': (evt) ->
			task = Tasks.findOne this._id
			task.completed = $(evt.target).attr('checked') == 'checked'
			Tasks.update {_id: this._id}, task

		'click .destroy': (evt) ->
			Tasks.remove {_id: this._id}

		'dblclick label': (evt) ->
			task = Tasks.findOne this._id
			task.editing = true
			edit = $(evt.target).parent().parent().find('.edit')
			Tasks.update {_id: this._id}, task, (err) ->
				edit.focus().select() unless err

		'blur input.edit': (evt) ->
			task = Tasks.findOne this._id
			task.editing = false
			Tasks.update {_id: this._id}, task 

		'keyup input.edit': (evt) ->
			if evt.type == 'keyup' && evt.which == ENTER_KEY
				task = Tasks.findOne this._id
				task.editing = false
				task.updated = new Date()
				task.title = $(evt.target).val()

				Tasks.update {_id: this._id}, task, (err) =>
				alert('Sorry, an error prevent the changes to be saved') if err
			return false
