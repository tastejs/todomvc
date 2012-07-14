// Collection to keep the todos
Todos = new Meteor.Collection('todos');

// Session var to keep current filter type ("all", "active", "completed")
Session.set('filter', null);

// Session var to keep todo which is currently in editing mode, if any
Session.set('editing_todo', null);

// JS code for the client (browser)
if (Meteor.is_client) {

	/////////////////////////////////////////////////////////////////////////
	// The following two functions are taken from the official Meteor 
	// "Todos" example
	// The original code can be viewed at: https://github.com/meteor/meteor
	/////////////////////////////////////////////////////////////////////////

	// Returns an event_map key for attaching "ok/cancel" events to
	// a text input (given by selector)
	var okcancel_events = function (selector) {
		return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
	};
	
	// Creates an event handler for interpreting "escape", "return", and "blur"
	// on a text field and calling "ok" or "cancel" callbacks.
	var make_okcancel_handler = function (options) {
		var ok = options.ok || function () {};
		var cancel = options.cancel || function () {};
		
		return function (evt) {
			if (evt.type === 'keydown' && evt.which === 27) {
				// escape = cancel
				cancel.call(this, evt);
	
			} else if (evt.type === 'keyup' && evt.which === 13 || 
				evt.type === 'focusout') {
				// blur/return/enter = ok/submit if non-empty
				var value = String(evt.target.value || '');
				if (value)
					ok.call(this, value, evt);
				else
					cancel.call(this, evt);
			}
		};
	};

	// Some global helpers

	// Get the number of todos not completed
	Handlebars.registerHelper('todos_not_completed', function() {
		return Todos.find({completed: false}).count();
	});
	
	// Get the number of todos completed
	Handlebars.registerHelper('todos_completed', function() {
		return Todos.find({completed: true}).count();
	});
	
	// True if the requested filter type is currently selected,
	// false otherwise
	Handlebars.registerHelper('filter_selected', function(type) {
		if (type === 'all')
			return Session.equals('filter', null);			
		return Session.equals('filter', type);
	});
	
	Handlebars.registerHelper('filter', function() {
		return {all: 'all', active: 'active', completed: 'completed'};
	});

	////
	// Logic for the 'todoapp' partial which represents the whole app
	////

	// Helper to get the number of todos
	Template.todoapp.todos = function() {
		return Todos.find().count();
	};
	
	Template.todoapp.events = {};
	
	// Register key events for adding new todo
	Template.todoapp.events[okcancel_events('#new-todo')] =
		make_okcancel_handler({
			ok: function (title, evt) {
				Todos.insert({title: title, completed: false, 
					created_at: new Date().getTime()});
				evt.target.value = '';
			}
		});
	
	////
	// Logic for the 'main' partial which wraps the actual todo list
	////
	
	// Get the todos considering the current filter type
	Template.main.todos = function() {
		var filter = {};
		switch (Session.get('filter')) {
			case 'active':
				filter.completed = false;
				break;
			case 'completed':
				filter.completed = true;
				break;
		}
		return Todos.find(filter, {sort: {created_at: 1}});
	};
	
	// Register click event for toggling complete/not complete button
	Template.main.events = {
		'click input#toggle-all': function(evt) {
			var completed = true;
			if (!Todos.find({completed: false}).count()) completed = false;
			Todos.find({}).forEach(function(todo) {
				Todos.update({'_id': todo._id}, {$set: {completed: completed}});
			});
		}
	};
	
	////
	// Logic for the 'todo' partial representing a todo
	////
	
	// True of current todo is completed, false otherwise
	Template.todo.todo_completed = function() {
		return this.completed;
	};
	
	// Get the current todo which is in editing mode, if any
	Template.todo.todo_editing = function() {
		return Session.equals('editing_todo', this._id);
	};
	
	// Register events for toggling todo's state, editing mode and destroying a todo
	Template.todo.events = {
		'click input.toggle': function() {
			Todos.update(this._id, {$set: {completed: !this.completed}});
		},
		'dblclick .view label': function() {
			Session.set('editing_todo', this._id);
		},
		'click button.destroy': function() {
			Todos.remove(this._id);
		}
	};
	
	// Register key events for updating title of an existing todo
	Template.todo.events[okcancel_events('li.editing input.edit')] =
		make_okcancel_handler({
			ok: function (value) {
				Todos.update(this._id, {$set: {title: value}});
				Session.set('editing_todo', null);
			},
			cancel: function () {
				Session.set('editing_todo', null);
			}
		});
	
	////
	// Logic for the 'footer' partial
	////
		
	// True if exactly one todo is not completed, false otherwise
	// Used for handling pluralization of "item"/"items" word
	Template.footer.todos_one_not_completed = function() {
		return Todos.find({completed: false}).count() == 1;
	};
				
	// Register click events for selecting filter type and
	// clearing completed todos
	Template.footer.events = {
		'click button#clear-completed': function() {
			Todos.remove({completed: true});
		},
		'click #filters span.all': function() {
			Session.set('filter', null);
		},
		'click #filters span.active': function() {
			Session.set('filter', 'active');
		},
		'click #filters span.completed': function() {
			Session.set('filter', 'completed');
		}
	};
};