Tasks = new Meteor.Collection("tasks")

if Meteor.is_client
  # Export Tasks model to client
  window.Tasks = Tasks

  Template.todo.tasks = ->
    Tasks.find {}, {sort: {completed: 1, updated: -1, created: -1}}

  Template.todo.remainingTodos = ->
    Tasks.find({completed: false}).count()

  Template.todo.hasCompleted = ->
    Tasks.find({completed: true}).count() > 0

  Template.todo.events =
    'keyup #new-todo' : (evt) ->
      if evt.type == "keyup" && evt.which == 13
        textbox = $("#new-todo")

        Tasks.insert {text: textbox.val(), created: new Date(), updated: new Date(), completed: false}
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
    'click #done': (evt) ->
      task = Tasks.findOne this._id
      task.completed = $(evt.target).attr("checked") == "checked"
      Tasks.update {_id: this._id}, task

    'dblclick .text': (evt) ->
      task = Tasks.findOne this._id
      task.editing = true
      selector = "#i-#{this._id} input.edit"
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
        task.text = $(evt.target).val()
        Tasks.update {_id: this._id}, task, (err) =>
          alert("Sorry, an error prevent the changes to be saved") if err

      return false

if Meteor.is_server
  Meteor.startup ->
    console.log "server startup"    
