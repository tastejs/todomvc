
YUI().use('event-focus', 'json', 'model', 'model-list', 'view', function (Y) {

var TodoAppView, TodoList, TodoModel, TodoView, localStorageName = 'todos-yuilibrary';

// -- Model --------------------------------------------------------------------

// The TodoModel class extends Y.Model and customizes it to use a localStorage
// sync provider (the source for that is further below) and to provide
// attributes and methods useful for todo items.

TodoModel = Y.TodoModel = Y.Base.create('todoModel', Y.Model, [], {
	// This tells the Model to use a localStorage sync provider (which we'll
	// create below) to save and load information about a todo item.
	sync: LocalStorageSync(localStorageName),

	// This method will toggle the `done` attribute from `true` to `false`, or
	// vice versa.
	toggleDone: function () {
		this.set('done', !this.get('done')).save();
	}
}, {
	ATTRS: {
		// Indicates whether or not this todo item has been completed.
		done: {value: false},

		// Contains the text of the todo item.
		text: {value: ''}
	}
});

// -- ModelList ----------------------------------------------------------------

// The TodoList class extends Y.ModelList and customizes it to hold a list of
// TodoModel instances, and to provide some convenience methods for getting
// information about the todo items in the list.

TodoList = Y.TodoList = Y.Base.create('todoList', Y.ModelList, [], {
	// This tells the list that it will hold instances of the TodoModel class.
	model: TodoModel,

	// This tells the list to use a localStorage sync provider (which we'll
	// create below) to load the list of todo items.
	sync : LocalStorageSync(localStorageName),

	// Returns an array of all models in this list with the `done` attribute
	// set to `true`.
	done: function () {
		return Y.Array.filter(this.toArray(), function (model) {
			return model.get('done');
		});
	},

	// Returns an array of all models in this list with the `done` attribute
	// set to `false`.
	remaining: function () {
		return Y.Array.filter(this.toArray(), function (model) {
			return !model.get('done');
		});
	}
});

// -- Todo App View ------------------------------------------------------------

// The TodoAppView class extends Y.View and customizes it to represent the
// main shell of the application, including the new item input field and the
// list of todo items.
//
// This class also takes care of initializing a TodoList instance and creating
// and rendering a TodoView instance for each todo item when the list is
// initially loaded or reset.

TodoAppView = Y.TodoAppView = Y.Base.create('todoAppView', Y.View, [], {
	// The container node is the wrapper for this view.  All the view's events
	// will be delegated from the container. In this case, the #todo-app
	// node already exists on the page, so we don't need to create it.
	container: Y.one('#todo-app'),

	// This is a custom property that we'll use to hold a reference to the
	// "new todo" input field.
	inputNode: Y.one('#new-todo'),

	// The `template` property is a convenience property for holding a template
	// for this view. In this case, we'll use it to store the contents of the
	// #todo-stats-template element, which will serve as the template for the
	// statistics displayed at the bottom of the list.
	template: Y.one('#todo-stats-template').getContent(),

	// This is where we attach DOM events for the view. The `events` object is a
	// mapping of selectors to an object containing one or more events to attach
	// to the node(s) matching each selector.
	events: {
		// Handle <enter> keypresses on the "new todo" input field.
		'#new-todo': {keypress: 'createTodo'},

		// Clear all completed items from the list when the "Clear" link is
		// clicked.
		'.todo-clear': {click: 'clearDone'},

		// Add and remove hover states on todo items.
		'.todo-item': {
			mouseover: 'hoverOn',
			mouseout : 'hoverOff'
		}
	},

	// The initializer runs when a TodoAppView instance is created, and gives
	// us an opportunity to set up the view.
	initializer: function () {
		// Create a new TodoList instance to hold the todo items.
		var list = this.todoList = new TodoList();

		// Update the display when a new item is added to the list, or when the
		// entire list is reset.
		list.after('add', this.add, this);
		list.after('reset', this.reset, this);

		// Re-render the stats in the footer whenever an item is added, removed
		// or changed, or when the entire list is reset.
		list.after(['add', 'reset', 'remove', 'todoModel:doneChange'],
				this.render, this);

		// Load saved items from localStorage, if available.
		list.load();
	},

	// The render function is called whenever a todo item is added, removed, or
	// changed, thanks to the list event handler we attached in the initializer
	// above.
	render: function () {
		var todoList = this.todoList,
			stats    = this.container.one('#todo-stats'),
			numRemaining, numDone;

		// If there are no todo items, then clear the stats.
		if (todoList.isEmpty()) {
			stats.empty();
			return this;
		}

		// Figure out how many todo items are completed and how many remain.
		numDone      = todoList.done().length;
		numRemaining = todoList.remaining().length;

		// Update the statistics.
		stats.setContent(Y.Lang.sub(this.template, {
			numDone       : numDone,
			numRemaining  : numRemaining,
			doneLabel     : numDone === 1 ? 'task' : 'tasks',
			remainingLabel: numRemaining === 1 ? 'task' : 'tasks'
		}));

		// If there are no completed todo items, don't show the "Clear
		// completed items" link.
		if (!numDone) {
			stats.one('.todo-clear').remove();
		}

		return this;
	},

	// -- Event Handlers -------------------------------------------------------

	// Creates a new TodoView instance and renders it into the list whenever a
	// todo item is added to the list.
	add: function (e) {
		var view = new TodoView({model: e.model});
		this.container.one('#todo-list').append(view.render().container);
	},

	// Removes all finished todo items from the list.
	clearDone: function (e) {
		var done = this.todoList.done();

		e.preventDefault();

		// Remove all finished items from the list, but do it silently so as not
		// to re-render the app view after each item is removed.
		this.todoList.remove(done, {silent: true});

		// Destroy each removed TodoModel instance.
		Y.Array.each(done, function (todo) {
			// Passing {'delete': true} to the todo model's `destroy()` method
			// tells it to delete itself from localStorage as well.
			todo.destroy({'delete': true});
		});

		// Finally, re-render the app view.
		this.render();
	},

	// Creates a new todo item when the enter key is pressed in the new todo
	// input field.
	createTodo: function (e) {
		var value;

		if (e.keyCode === 13) { // enter key
			value = Y.Lang.trim(this.inputNode.get('value'));

			if (!value) { return; }

			// This tells the list to create a new TodoModel instance with the
			// specified text and automatically save it to localStorage in a
			// single step.
			this.todoList.create({text: value});

			this.inputNode.set('value', '');
		}
	},

	// Turns off the hover state on a todo item.
	hoverOff: function (e) {
		e.currentTarget.removeClass('todo-hover');
	},

	// Turns on the hover state on a todo item.
	hoverOn: function (e) {
		e.currentTarget.addClass('todo-hover');
	},

	// Creates and renders views for every todo item in the list when the entire
	// list is reset.
	reset: function (e) {
		var fragment = Y.one(Y.config.doc.createDocumentFragment());

		Y.Array.each(e.models, function (model) {
			var view = new TodoView({model: model});
			fragment.append(view.render().container);
		});

		this.container.one('#todo-list').setContent(fragment);
	}
});

// -- Todo item view -----------------------------------------------------------

// The TodoView class extends Y.View and customizes it to represent the content
// of a single todo item in the list. It also handles DOM events on the item to
// allow it to be edited and removed from the list.

TodoView = Y.TodoView = Y.Base.create('todoView', Y.View, [], {
	// Specifying an HTML string as this view's container element causes that
	// HTML to be automatically converted into an unattached Y.Node instance.
	// The TodoAppView (above) will take care of appending it to the list.
	container: '<li class="todo-item"/>',

	// The template property holds the contents of the #todo-item-template
	// element, which will be used as the HTML template for each todo item.
	template: Y.one('#todo-item-template').getContent(),

	// Delegated DOM events to handle this view's interactions.
	events: {
		// Toggle the "done" state of this todo item when the checkbox is
		// clicked.
		'.todo-checkbox': {click: 'toggleDone'},

		// When the text of this todo item is clicked or focused, switch to edit
		// mode to allow editing.
		'.todo-content': {
			click: 'edit',
			focus: 'edit'
		},

		// On the edit field, when enter is pressed or the field loses focus,
		// save the current value and switch out of edit mode.
		'.todo-input'   : {
			blur    : 'save',
			keypress: 'enter'
		},

		// When the remove icon is clicked, delete this todo item.
		'.todo-remove': {click: 'remove'}
	},

	initializer: function () {
		// The model property is set to a TodoModel instance by TodoAppView when
		// it instantiates this TodoView.
		var model = this.model;

		// Re-render this view when the model changes, and destroy this view
		// when the model is destroyed.
		model.after('change', this.render, this);
		model.after('destroy', this.destroy, this);
	},

	render: function () {
		var container = this.container,
			model     = this.model,
			done      = model.get('done');

		container.setContent(Y.Lang.sub(this.template, {
			checked: done ? 'checked' : '',
			text   : model.getAsHTML('text')
		}));

		container[done ? 'addClass' : 'removeClass']('todo-done');
		this.inputNode = container.one('.todo-input');

		return this;
	},

	// -- Event Handlers -------------------------------------------------------

	// Toggles this item into edit mode.
	edit: function () {
		this.container.addClass('editing');
		this.inputNode.focus();
	},

	// When the enter key is pressed, focus the new todo input field. This
	// causes a blur event on the current edit field, which calls the save()
	// handler below.
	enter: function (e) {
		if (e.keyCode === 13) { // enter key
			Y.one('#new-todo').focus();
		}
	},

	// Removes this item from the list.
	remove: function (e) {
		e.preventDefault();

		this.constructor.superclass.remove.call(this);
		this.model.destroy({'delete': true});
	},

	// Toggles this item out of edit mode and saves it.
	save: function () {
		this.container.removeClass('editing');
		this.model.set('text', this.inputNode.get('value')).save();
	},

	// Toggles the `done` state on this item's model.
	toggleDone: function () {
		this.model.toggleDone();
	}
});

// -- localStorage Sync Implementation -----------------------------------------

// This is a simple factory function that returns a `sync()` function that can
// be used as a sync layer for either a Model or a ModelList instance. The
// TodoModel and TodoList instances above use it to save and load items.

function LocalStorageSync(key) {
	var localStorage;

	if (!key) {
		Y.error('No storage key specified.');
	}

	if (Y.config.win.localStorage) {
		localStorage = Y.config.win.localStorage;
	}

	// Try to retrieve existing data from localStorage, if there is any.
	// Otherwise, initialize `data` to an empty object.
	var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');

	// Delete a model with the specified id.
	function destroy(id) {
		var modelHash;

		if ((modelHash = data[id])) {
			delete data[id];
			save();
		}

		return modelHash;
	}

	// Generate a unique id to assign to a newly-created model.
	function generateId() {
		var id = '',
			i  = 4;

		while (i--) {
			id += (((1 + Math.random()) * 0x10000) | 0)
					.toString(16).substring(1);
		}

		return id;
	}

	// Loads a model with the specified id. This method is a little tricky,
	// since it handles loading for both individual models and for an entire
	// model list.
	//
	// If an id is specified, then it loads a single model. If no id is
	// specified then it loads an array of all models. This allows the same sync
	// layer to be used for both the TodoModel and TodoList classes.
	function get(id) {
		return id ? data[id] : Y.Object.values(data);
	}

	// Saves the entire `data` object to localStorage.
	function save() {
		localStorage && localStorage.setItem(key, Y.JSON.stringify(data));
	}

	// Sets the id attribute of the specified model (generating a new id if
	// necessary), then saves it to localStorage.
	function set(model) {
		var hash        = model.toJSON(),
			idAttribute = model.idAttribute;

		if (!Y.Lang.isValue(hash[idAttribute])) {
			hash[idAttribute] = generateId();
		}

		data[hash[idAttribute]] = hash;
		save();

		return hash;
	}

	// Returns a `sync()` function that can be used with either a Model or a
	// ModelList instance.
	return function (action, options, callback) {
		// `this` refers to the Model or ModelList instance to which this sync
		// method is attached.
		var isModel = Y.Model && this instanceof Y.Model;

		switch (action) {
		case 'create': // intentional fallthru
		case 'update':
			callback(null, set(this));
			return;

		case 'read':
			callback(null, get(isModel && this.get('id')));
			return;

		case 'delete':
			callback(null, destroy(isModel && this.get('id')));
			return;
		}
	};
}

// -- Start your engines! ------------------------------------------------------

// Finally, all we have to do is instantiate a new TodoAppView to set everything
// in motion and bring our todo list into existence.
new TodoAppView();

});
