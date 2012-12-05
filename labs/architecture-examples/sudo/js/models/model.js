'use strict';
sudo.namespace('todo');

// Todo Model, App level Model instance for 
// handliing persistance and observation of URL changes
// maintained by the Navigator class. 
// --------------------------------------

todo.Model = function Model(data) {
	this.construct(data);
	// implements observable
	$.extend(this, _.ext.observable);
};

todo.Model.prototype = Object.create(sudo.Model.prototype);

// load any persisted todos and set them - notifying any observers
todo.Model.prototype.getPersisted = function() {
	// retreive the JSON string and set it, allowing the ViewController
	// to instantiate the children via the changeRecord
	// if LS is empty set the empty array
	this.set('persistedTodos', localStorage.getItem(this.get('key')) || '[]');
};

// simplify and stringify the child collection (passed from the todo.list)
// and set it with the correct key
todo.Model.prototype.persist = function(children) {
	// so all i really want is title and completed
	var ary = children.map(function(child) {
		return {
			title: child.model.get('title'),
			completed: child.model.get('completed')
		};
	});
	localStorage.setItem(this.get('key'), JSON.stringify(ary));
};

// NOTE -- The list and item view classes model's are located at 
// list.model and item.model respectively. Those models contain no 
// custom methods so no class definitions are required (and they are 
// created automagically when passed an object literal as a second
// argument to their constructors)
