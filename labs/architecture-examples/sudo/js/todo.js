'use strict';
sudo.namespace('todo');
// keep a const ref for return
todo.ENTER_KEY = 13;
// Top-level Observable model, implements the 
// sudo.ext observable object
todo.model = new todo.Model({key: 'todo-sudo'});

// Start up a sudo.Navigator to handle the filter-based `navigation`
// the Navigator will look for a passed in `root` path as well as the name
// of an `Observable` instance to send data to
// --------------------------------------------------------------------
todo.navigator = new sudo.Navigator({
	root: '/', 
	observable: todo.model,
	useHashChange: true
});
todo.navigator.start();

// The list itself, a View Class Instance
// Passing the object literal as a second arg creates
// a sudo.Model instance at construction located at list.model
// ---------------------------------
todo.list = new todo.List('#todoapp', {
	completed: [],
	statsTemplate: sudo.template($('#stats-template').html())
});

// The model will fetch any persisted todo's, setting them thus triggering
// any pending change observers
todo.model.getPersisted();

// the user may have pasted in a URL with state info in it
todo.list.filter();
