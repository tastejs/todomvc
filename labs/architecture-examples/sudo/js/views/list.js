'use strict';
_.namespace('todo');

// The List itself, a sudo.View instance
// ----------------------------------------------
todo.List = function(el, data) {
	// call to the constructor of the sudo.View class
	this.construct(el, data);
	// references to some key ui elements
	this.$input = this.$('#new-todo');
	this.allCheckbox = this.$('#toggle-all')[0];
	this.$footer = this.$('#footer');
	this.$main = this.$('#main');
};

// List inherits from sudo.ViewController -- we prefer explicitness
todo.List.prototype = Object.create(_.View.prototype);

// Override the base addChild method to accept an object literal
// containing title and completed state (since we are only adding todos).
todo.List.prototype.addChild = function(info) {
	var child = new todo.Item(null, {
		title: info.title,
		completed: info.completed,
		renderTarget: this.$('#todo-list')
	});
	// call to `super`
	this.base('addChild', child);
	// was this a completed child?
	if(info.completed) this.addCompleted(child);
	else this.persist().render();
};
// A `sendTarget` method for child objects.
// All sudo.Control types send themselves as an arg to a `sendTarget` method
todo.List.prototype.addCompleted = function(child) {
	this.model.get('completed').push(child);
	// save and refresh stats
	this.persist().render();
};

// Clear all completed todo items, removing them.
todo.List.prototype.clearCompleted = function() {
	this.model.get('completed').forEach(function(child) {
		this.removeChild(child, true);
	}.bind(this));
	// no need to piecemeal modify the `completed` list here
	this.model.set('completed', []);
	// save state and refresh stats
	this.persist().render();
};

// If you hit return in the main input field, add an Item child
todo.List.prototype.createOnEnter = function(e) {
	var title = this.$input.val().trim();
	if (e.which !== todo.ENTER_KEY || !title) return;
	// only title and completed are needed
	this.addChild({title: title, completed: false});
	// clear the input `title` field
	this.$input.val('');
	// enforce current filter
	this.filter();
};

// Enforce the current filter state after actions that can create
// disjoints occur.
// Achieved by setting the navigator's most recent parsed 
// `url fragment` into the todo model triggering change observers
todo.List.prototype.filter = function() {
	todo.model.set(todo.navigator.getFragment());
};

// Observing the app model
todo.List.prototype.handleChange = function(change) {
	if(change.name === 'persistedTodos') {
		this.parsePersisted(change.object[change.name]);
		// all other changes are filter related
	} else this.render();
};

// At initialization we register as an `observer` of the Observable model
// and bind some event listeners...
todo.List.prototype.init = function() {
	todo.model.observe(this.handleChange.bind(this));
	// listening for the clear-completed button click, delegated to this.$el
	this.$el.on('click', '#clear-completed', this.clearCompleted.bind(this));
	// listening for the making of new todos
	this.$('#new-todo').on('keypress', this.createOnEnter.bind(this));
	// listening to the `mark-all-as-complete` checkbox
	this.$('#toggle-all').on('click', this.toggleAllComplete.bind(this));
};

// add children from the persisted JSON string
todo.List.prototype.parsePersisted = function(ary) {
	JSON.parse(ary).forEach(function(saved) {
		this.addChild(saved);
	}.bind(this));

	// check active filter state
	this.filter();
};

// To persis the todo list, I will hand my current children collection to
// the model to be saved into localstorage
todo.List.prototype.persist = function() {
	todo.model.persist(this.children);
	return this;
};

// A `sendTarget` method for child objects.
// All sudo.Control types send themselves as an arg to a `sendTarget` method
todo.List.prototype.removeCompleted = function(child) {
	var comp = this.model.get('completed'),
		index = comp.indexOf(child);
	comp.splice(index, 1);
	// refresh stats
	this.persist().render();
};

// Override the base removeChild to remove the DOM and call
// render so the stats are refreshed.
// Also, this method will be called from a child todo whose `x`
// button has been clicked - ignore the `event` argument in that case
// optional hold only sent from clearCompleted method
todo.List.prototype.removeChild = function(child, hold) {
	// could have been called from the child's destroy action
	// we are not interested in the event object in this case
	hold = typeof hold === 'boolean' ? hold : void 0;
	// call to method on `super`
	this.base('removeChild', child);
	// by default, sudo containers do not modify their children's $el
	child.$el.remove();
	// save state and refresh, unless told not to
	if(!hold) {
		if(child.model.get('completed')) this.removeCompleted(child);
		else this.persist().render();
	}
};

// Re-rendering the List just means refreshing the statistics
todo.List.prototype.render =  function() {
	var completed = this.model.get('completed').length,
		remaining = this.children.length - completed,
		frag = todo.navigator.getFragment();

	if (this.children.length > 0) {
		this.$main.show();
		this.$footer.show();
		this.$footer.html(this.model.get('statsTemplate')({
			completed: completed,
			remaining: remaining
		}));

		// highlight the correct active filter
		this.$('#filters li a').removeClass('selected').filter(
			'[href="#/' + frag + '"]').addClass('selected');

	} else {
		this.$main.hide();
		this.$footer.hide();
	}
	this.allCheckbox.checked = !remaining;
	return this;
};

// the child todos know how to set their visual `complete` state
todo.List.prototype.toggleAllComplete = function() {
	var completed = this.allCheckbox.checked;
	this.children.forEach(function(child) {
		// Dataview child will auto update,
		// but only if the state differs from that selected
		if(child.model.get('completed') !== completed) child.toggleCompleted(completed);
	}.bind(this));
	// enforce the active filter state
	this.filter();
};
