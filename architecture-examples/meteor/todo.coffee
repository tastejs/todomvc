Tasks = new Meteor.Collection("tasks")

if Meteor.is_client
	Template.todo.tasks = ->
		Tasks.find {}, {sort: {completed: 1}}

	Template.todo.hasTodo = ->
		Tasks.find({}).count() > 0

	Template.todo.incompleted = ->
		Tasks.find({completed: false}).count()

	Template.todo.completed = ->
		Tasks.find({completed: true}).count()

	Template.todo.events =
		'keyup #new-todo' : (evt) ->
			if evt.type == "keyup" && evt.which == 13
				textbox = $("#new-todo")
				Tasks.insert {title: textbox.val(), completed: false}
				textbox.val("")
				textbox.focus()
			return false

		'click #clear-completed': ->
			Tasks.remove {completed: true} 
			return false

		'click #mark-all-checked': (evt) ->
			Tasks.update {}, {$set: {completed: true}}, {multi: true}
			$(evt.target).removeAttr("checked")
  
	Template.item.events =
		'click .toggle': (evt) ->
			task = Tasks.findOne this._id
			task.completed = $(evt.target).attr("checked") == "checked"
			Tasks.update {_id: this._id}, task

		'click .destroy': (evt) ->
			Tasks.remove {_id: this._id}

		'dblclick label': (evt) ->
			selector = "#i-#{this._id} input.edit"
			task = Tasks.findOne this._id
			task.editing = true
			Tasks.update {_id: this._id}, task, (err) ->
				$(selector).focus().select() unless err

		'blur input.edit': (evt) ->
			task = Tasks.findOne this._id
			task.editing = false
			Tasks.update {_id: this._id}, task 

		'keyup input.edit': (evt) ->
			if evt.type == "keyup" && evt.which == 13
				task = Tasks.findOne this._id
				task.editing = false
				task.updated = new Date()
				task.title = $(evt.target).val()

				Tasks.update {_id: this._id}, task, (err) =>
				alert("Sorry, an error prevent the changes to be saved") if err
			return false
