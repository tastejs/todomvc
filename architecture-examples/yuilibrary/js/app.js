YUI.add('mvc-app-view', function (Y) {
    "use strict";

    // Dependencies from MVC namespace.
    var TodoList = Y.MVC.TodoList,
        TodoView = Y.MVC.TodoView,
        TodoApp;
   
    // -- Main Application --------------
    TodoApp = Y.Base.create('todoApp', Y.App, [], {
        // Set container to bind to the existing '#todoapp' element
        containerTemplate: '#todoapp',
        
        // Compile statistics template with Handlebars.
        template: Y.Handlebars.compile(Y.one('#stats-template').getHTML()),

        // DOM events for creating new Todos and clearing out old ones.
        events: {
            '#new-todo': {
                keypress: 'enterCreate'
            },
            '#clear-completed': {
                click: 'clearCompleted'
            },
            '#toggle-all': {
                click: 'completeAll'
            }
        },

        // Initialize our TodoList, and bind any events that occur
        // when new Todos are added, changed, or removed within it.
        // Also, fetch any Todos that are found within localStorage.
        initializer: function () {
            var list = this.todoList = new TodoList();

            list.after('add', this.addOne, this);
            list.after('reset', this.addAll, this);

            list.after(['add', 'remove', 'reset', 'todo:completedChange'],
                this.render, this);

            list.load();
=======
/*global YUI */
YUI().use( 'event-focus', 'json', 'model', 'model-list', 'view', function( Y ) {

var TodoAppView, TodoList, TodoModel, TodoView, localStorageName = 'todos-yui',
	ENTER_KEY = 13;

// -- Model --------------------------------------------------------------------

// The TodoModel class extends Y.Model and customizes it to use a localStorage
// sync provider (the source for that is further below) and to provide
// attributes and methods useful for todo items.

TodoModel = Y.TodoModel = Y.Base.create( 'todoModel', Y.Model, [], {
	// This tells the Model to use a localStorage sync provider (which we'll
	// create below) to save and load information about a todo item.
	sync: localStorageSync(localStorageName),

	// This method will toggle the `completed` attribute from `true` to `false`, or
	// vice versa.
	toggle: function() {
		this.set( 'completed', !this.get('completed') ).save();
	}
}, {
	ATTRS: {
		// Indicates whether or not this todo item has been completed.
		completed: {
			value: false
		},

		// Contains the text of the todo item.
		title: {
			value: ''
		}
	}
});

// -- ModelList ----------------------------------------------------------------

// The TodoList class extends Y.ModelList and customizes it to hold a list of
// TodoModel instances, and to provide some convenience methods for getting
// information about the todo items in the list.

TodoList = Y.TodoList = Y.Base.create( 'todoList', Y.ModelList, [], {
	// This tells the list that it will hold instances of the TodoModel class.
	model: TodoModel,

	// This tells the list to use a localStorage sync provider (which we'll
	// create below) to load the list of todo items.
	sync : localStorageSync( localStorageName ),

	// Returns an array of all models in this list with the `completed` attribute
	// set to `true`.
	completed: function() {
		return Y.Array.filter( this.toArray(), function( model) {
			return model.get('completed');
		});
	},

	// Returns an array of all models in this list with the `completed` attribute
	// set to `false`.
	remaining: function() {
		return Y.Array.filter( this.toArray(), function( model ) {
			return !model.get('completed');
		});
	},

	toggleAll: function( toggle ) {
		Y.Array.each( this.toArray(), function( model ) {
			model.set( 'completed', toggle );
		});
	},

	clearCompleted: function() {
		Y.Array.each( this.completed(), function( model ) {
			model.destroy({
				'delete': true
			});
		});
	},
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
	// will be delegated from the container. In this case, the #todoapp
	// node already exists on the page, so we don't need to create it.
	container: Y.one('#todoapp'),

	// This is a custom property that we'll use to hold a reference to the
	// "new todo" input field.
	inputNode: Y.one('#new-todo'),

	// The `template` property is a convenience property for holding a template
	// for this view. In this case, we'll use it to store the contents of the
	// #footer-template element, which will serve as the template for the
	// statistics displayed at the bottom of the list.
	template: Y.one('#footer-template').getContent(),

	// This is where we attach DOM events for the view. The `events` object is a
	// mapping of selectors to an object containing one or more events to attach
	// to the node(s) matching each selector.
	events: {
		// Handle <enter> keypresses on the "new todo" input field.
		'#new-todo': {
			keypress: 'createTodo'
		},

		'#toggle-all': {
			change: 'toggleAll'
		},

		// Clear all completed items from the list when the "Clear" link is
		// clicked.
		'#clear-completed': {
			click: 'clearCompleted'
		}
	},

	// The initializer runs when a TodoAppView instance is created, and gives
	// us an opportunity to set up the view.
	initializer: function() {
		// Create a new TodoList instance to hold the todo items.
		var list = this.todoList = new TodoList();

		// Update the display when a new item is added to the list, or when the
		// entire list is reset.
		list.after( 'add', this.add, this );
		list.after( 'reset', this.reset, this );

		// Re-render the stats in the footer whenever an item is added, removed
		// or changed, or when the entire list is reset.
		list.after([
			'add',
			'reset',
			'remove',
			'todoModel:completedChange'
		], this.render, this );

		// Load saved items from localStorage, if available.
		list.load();
	},

	// The render function is called whenever a todo item is added, removed, or
	// changed, thanks to the list event handler we attached in the initializer
	// above.
	render: function() {
		var numRemaining, numCompleted,
			todoList = this.todoList,
			main = this.container.one('#main'),
			footer = this.container.one('#footer');

		// Check the toggleAll checkbox when all todos are checked
		this.container.one('#toggle-all').set( 'checked', !todoList.remaining().length );

		// If there are no todo items, then clear the stats.
		// Ugly, but for some reason `main.hide()` doesn't work
		if ( todoList.isEmpty() ) {
			main._node.style.display = 'none';
			footer._node.style.display = 'none';
			return this;
		} else {
			main._node.style.display = 'block';
			footer._node.style.display = 'block';
		}

		// Figure out how many todo items are completed and how many remain.
		numCompleted = todoList.completed().length;
		numRemaining = todoList.remaining().length;

		// Update the statistics.
		footer.setContent(Y.Lang.sub( this.template, {
			numCompleted: numCompleted,
			numRemaining: numRemaining,
			remainingLabel: numRemaining === 1 ? 'item' : 'items'
		}));

		// If there are no completed todo items, don't show the "Clear
		// completed items" link.
		if ( !numCompleted ) {
			footer.one('#clear-completed').remove();
		}

		return this;
	},

	// -- Event Handlers -------------------------------------------------------

	// Creates a new TodoView instance and renders it into the list whenever a
	// todo item is added to the list.
	add: function ( e ) {
		var view = new TodoView({
			model: e.model
		});
		this.container.one('#todo-list').append( view.render().container );
	},

	// Creates and renders views for every todo item in the list when the entire
	// list is reset.
	reset: function( e ) {
		var fragment = Y.one( Y.config.doc.createDocumentFragment() );

		Y.Array.each( e.models, function ( model ) {
			var view = new TodoView({
				model: model
			});
			fragment.append( view.render().container );
		});

		this.container.one('#todo-list').setContent( fragment );
	},

	// Creates a new todo item when the enter key is pressed in the new todo
	// input field.
	createTodo: function( e ) {
		var value;

		if ( e.keyCode === ENTER_KEY ) {
			value = Y.Lang.trim( this.inputNode.get('value') );

			if ( !value ) {
				return;
			}

			// This tells the list to create a new TodoModel instance with the
			// specified text and automatically save it to localStorage in a
			// single step.
			this.todoList.create({
				title: value
			});

			this.inputNode.set( 'value', '' );
		}
	},

	toggleAll: function( e ) {
		this.todoList.toggleAll( e.target._node.checked );
	},

	// Removes all finished todo items from the list.
	clearCompleted: function( e ) {
		this.todoList.clearCompleted();
	}
});
>>>>>>> b37261da48a89d9d2e76fb22703f423506f000c5

            Y.Handlebars.registerHelper('pluralize', function (context, word) {
                return (context === 1) ? word : word + 's';
            });

            // Keep our filters on refresh by immediately dispatching route.
            this.once('ready', function (e) {
                if (this.hasRoute(this.getPath())) {
                    this.dispatch();
                }
            });
        },

<<<<<<< HEAD

        // Render our application with the statistics from our TodoList,
        // and various other stylistic elements.
        render: function () {
            var todoList  = this.todoList,
                completed = todoList.completed().length,
                remaining = todoList.remaining().length,
                container = this.get('container'),
                main      = this.get('main'),
                footer    = this.get('footer');

            // If we have Todos in our TodoList, show them with statistics.
            if (todoList.size()) {
                main.show();
                footer.show();
                footer.setHTML(this.template({
                    completed: completed,
                    remaining: remaining
                }));
                
                // Highlights for filters at the bottom of our Todo application.
            
                container.one('#filters li a').removeClass('selected');
                
                container.all('#filters li a')
                        .filter('[href="#/' + (this.get('filter') || '') + '"]')
                        .addClass('selected');
            } else {
                main.hide();
                footer.hide();
            }
            
            // Set the checkbox only if all Todos have been completed.
            this.get('allCheckbox').set('checked', !remaining);
        },

        // Add a single Todo view to the DOM, triggered when a Todo is
        // added to the TodoList.
        addOne: function (e) {
            var view = new TodoView({model: e.model});

            this.get('container').one('#todo-list').append(
                view.render().get('container')
            );
        },

        // Add multiple Todo views to the DOM simultaneously, triggered when
        // the application initially loads, or we switch filters.
        addAll: function (e) {
            var fragment = Y.one(Y.config.doc.createDocumentFragment()),
                models;

            // An Array of models is passed through when the 'reset'
            // event is triggered through syncing through load().
            switch (this.get('filter')) {
            case 'active':
                models = this.todoList.remaining();
                break;
            case 'completed':
                models = this.todoList.completed();
                break;
            default:
                models = e.models;
                break;
            }

            // Iterate through the (filtered) Array of models.
            Y.Array.each(models, function (model) {
                var view = new TodoView({model: model});
                fragment.append(view.render().get('container'));
            });

            this.get('container').one('#todo-list').setContent(fragment);
        },

        // Create and save a new Todo from the inputted value when the
        // Enter key is pressed down.
        enterCreate: function (e) {
            var inputNode = this.get('inputNode'),
                value     = Y.Escape.html(Y.Lang.trim(inputNode.get('value')));

            if (e.keyCode !== 13 || !value) {
                return;
            }
=======
TodoView = Y.TodoView = Y.Base.create( 'todoView', Y.View, [], {
	// Specifying an HTML string as this view's container element causes that
	// HTML to be automatically converted into an unattached Y.Node instance.
	// The TodoAppView (above) will take care of appending it to the list.
	container: '<li>',

	// The template property holds the contents of the #todo-template
	// element, which will be used as the HTML template for each todo item.
	template: Y.one('#todo-template').getContent(),

	// Delegated DOM events to handle this view's interactions.
	events: {
		// Toggle the "completed" state of this todo item when the checkbox is
		// clicked.
		'.toggle': {
			click: 'toggle'
		},

		// When the text of this todo item is clicked or focused, switch to edit
		// mode to allow editing.
		'.view': {
			dblclick: 'edit'
		},

		// On the edit field, when enter is pressed or the field loses focus,
		// save the current value and switch out of edit mode.
		'.edit': {
			blur: 'save',
			keypress: 'enter'
		},

		// When the remove icon is clicked, delete this todo item.
		'.destroy': {
			click: 'remove'
		}
	},

	initializer: function() {
		// The model property is set to a TodoModel instance by TodoAppView when
		// it instantiates this TodoView.
		var model = this.model;

		// Re-render this view when the model changes, and destroy this view
		// when the model is destroyed.
		model.after( 'change', this.render, this );
		model.after( 'destroy', this.destroy, this );
	},

	render: function () {
		var container = this.container,
			model = this.model,
			completed = model.get('completed');

		container.setContent( Y.Lang.sub( this.template, {
			completed: completed ? 'checked' : '',
			title: model.get('title')
		}));

		container[ completed ? 'addClass' : 'removeClass' ]('completed');
		this.inputNode = container.one('.edit');

		return this;
	},

	// -- Event Handlers -------------------------------------------------------

	// Toggles this item into edit mode.
	edit: function() {
		this.container.addClass('editing');
		this.inputNode.select();
	},

	// When the enter key is pressed, focus the new todo input field. This
	// causes a blur event on the current edit field, which calls the save()
	// handler below.
	enter: function( e ) {
		if ( e.keyCode === ENTER_KEY ) {
			Y.one('#new-todo').focus();
		}
	},

	// Removes this item from the list.
	remove: function( e ) {
		this.constructor.superclass.remove.call( this );
		this.model.destroy({
			'delete': true
		});
	},

	// Toggles this item out of edit mode and saves it.
	save: function() {
		var val = Y.Lang.trim( this.inputNode.get('value') );

		this.container.removeClass('editing');

		if ( val ) {
			this.model.set( 'title', val ).save();
		} else {
			this.model.destroy({
				'delete': true
			});
		}
	},

	// Toggles the `completed` state on this item's model.
	toggle: function() {
		this.model.toggle();
	}
});
>>>>>>> b37261da48a89d9d2e76fb22703f423506f000c5

            this.todoList.create({
                title: value
            });

<<<<<<< HEAD
            inputNode.set('value', '');
        },

        // Clear all completed Todos from the TodoList. This removes the models
        // from the list, as well as deletes them from localStorage.
        clearCompleted: function (e) {
            var completed = this.todoList.completed();

            this.todoList.remove(completed);

            Y.Array.each(completed, function (todo) {
                todo.clear();
            });
        },

        // Complete all non-complete Todos, or reset them all if they are
        // all already complete.
        completeAll: function () {
            var allCheckbox = this.get('allCheckbox'),
                completed   = allCheckbox.get('checked');

            Y.Array.each(this.todoList.toArray(), function (todo) {
                todo.save({completed: completed});
            });
        },

        // Set the filter for our application from the route that is passed
        // in (see below).
        handleFilter: function (req) {
            this.set('filter', req.params.filter);
            this.todoList.load();
        }
    }, {
        ATTRS: {
            // Significant DOM elements that relate to our application that
            // we would like to keep as attributes.
            container: {
                valueFn: function () {
                    return Y.one('#todoapp');
                }
            },
            inputNode: {
                valueFn: function () {
                    return Y.one('#new-todo');
                }
            },
            allCheckbox: {
                valueFn: function () {
                    return Y.one('#toggle-all');
                }
            },
            main: {
                valueFn: function () {
                    return Y.one('#main');
                }
            },
            footer: {
                valueFn: function () {
                    return Y.one('#footer');
                }
            },

            // This can be set to fall back on server-side routing when
            // HTML5 pushState is not available. For this application,
            // we are only using hash-based URLs though.
            serverRouting: {
                value: false
            },

            // Our initial filter for the application.
            filter: {
                value: null
            },

            // Routing for the application, to determine the filter.
            // The callback takes a request object, Express-style.
            routes: {
                value: [
                    {path: '/:filter', callback: 'handleFilter'}
                ]
            }
        }
    });

    // Namespace this application under our custom Y.MVC namespace.
    Y.namespace('MVC').TodoApp = TodoApp;
}, '@VERSION@', {
    requires: [
        'app',
        'mvc-todos',
        'mvc-todo-view',
        'node',
        'event-focus'
    ]
});
