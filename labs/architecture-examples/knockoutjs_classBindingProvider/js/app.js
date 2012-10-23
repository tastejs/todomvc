/*global ko, crossroads */
(function() {
	'use strict';

	var ENTER_KEY = 13;

	// a custom binding to handle the enter key (could go in a separate library)
	ko.bindingHandlers.enterKey = {
		init: function( element, valueAccessor, allBindingsAccessor, data ) {
			var wrappedHandler, newValueAccessor;

			// wrap the handler with a check for the enter key
			wrappedHandler = function( data, event ) {
				if ( event.keyCode === ENTER_KEY ) {
					valueAccessor().call( this, data, event );
				}
			};

			// create a valueAccessor with the options that we would want to pass to the event binding
			newValueAccessor = function() {
				return {
					keyup: wrappedHandler
				};
			};

			// call the real event binding's init function
			ko.bindingHandlers.event.init( element, newValueAccessor, allBindingsAccessor, data );
		}
	};

	// wrapper to hasfocus that also selects text and applies focus async
	ko.bindingHandlers.selectAndFocus = {
		init: function( element, valueAccessor, allBindingsAccessor ) {
			ko.bindingHandlers.hasfocus.init( element, valueAccessor, allBindingsAccessor );
			ko.utils.registerEventHandler( element, 'focus', function() {
				element.focus();
			});
		},
		update: function( element, valueAccessor ) {
			ko.utils.unwrapObservable( valueAccessor() ); // for dependency
			// ensure that element is visible before trying to focus
			setTimeout(function() {
				ko.bindingHandlers.hasfocus.update( element, valueAccessor );
			}, 0);
		}
	};

	// represent a single todo item
	var Todo = function( title, completed ) {
		this.title = ko.observable( title );
		this.completed = ko.observable( completed );
		this.editing = ko.observable( false );
	};

	// our main view model
	var ViewModel = function( todos ) {
		var self = this;

		// map array of passed in todos to an observableArray of Todo objects
		self.todos = ko.observableArray(ko.utils.arrayMap( todos, function( todo ) {
			return new Todo( todo.title, todo.completed );
		}));

		// store the new todo value being entered
		self.current = ko.observable();

		self.showMode = ko.observable('all');

		self.filteredTodos = ko.computed(function() {
			switch( self.showMode() ) {
				case 'active':
					return self.todos().filter(function( todo ) {
						return !todo.completed();
					});
				case 'completed':
					return self.todos().filter(function( todo ) {
						return todo.completed();
					});
				default:
					return self.todos();
			}
		});

		// add a new todo, when enter key is pressed
		self.add = function() {
			var current = self.current().trim();
			if ( current ) {
				self.todos.push( new Todo( current ) );
				self.current('');
			}
		};

		// remove a single todo
		self.remove = function( todo ) {
			self.todos.remove( todo );
		};

		// remove all completed todos
		self.removeCompleted = function() {
			self.todos.remove(function( todo ) {
				return todo.completed();
			});
		};

		// edit an item
		self.editItem = function( item ) {
			item.editing( true );
		};

		// stop editing an item.  Remove the item, if it is now empty
		self.stopEditing = function( item ) {
			item.editing( false );

			if ( !item.title().trim() ) {
				self.remove( item );
			}
		};

		// count of all completed todos
		self.completedCount = ko.computed(function() {
			return ko.utils.arrayFilter( self.todos(), function( todo ) {
				return todo.completed();
			}).length;
		});

		// count of todos that are not complete
		self.remainingCount = ko.computed(function() {
			return self.todos().length - self.completedCount();
		});

		// writeable computed observable to handle marking all complete/incomplete
		self.allCompleted = ko.computed({
			//always return true/false based on the done flag of all todos
			read: function() {
				return !self.remainingCount();
			},
			// set all todos to the written value (true/false)
			write: function(newValue) {
				ko.utils.arrayForEach( self.todos(), function( todo ) {
					// set even if value is the same, as subscribers are not notified in that case
					todo.completed( newValue );
				});
			}
		});

		// helper function to keep expressions out of markup
		self.getLabel = function( count ) {
			return ko.utils.unwrapObservable( count ) === 1 ? 'item' : 'items';
		};

		// internal computed observable that fires whenever anything changes in our todos
		ko.computed(function() {
			// store a clean copy to local storage, which also creates a dependency on the observableArray and all observables in each item
			localStorage.setItem('todos-knockout', ko.toJSON( self.todos ) );
		}).extend({
			throttle: 500
		}); // save at most twice per second
	};

	// check local storage for todos
	var todos = ko.utils.parseJson( localStorage.getItem('todos-knockout') );

	// setup bindings and classBindingProvider
	var bindings = {
		todos: {
			'new': function() {
				return {
					value: this.current, 
					valueUpdate: 'afterkeydown', 
					enterKey: this.add
				};
			},
			'listVisible': function() {
				return {
					visible: this.todos().length
				};
			},
			'allCompleted': function() {
				return {
					checked: this.allCompleted
				};
			},
			'foreach': function() {
				return {
					foreach: this.filteredTodos
				};
			},
			todo: {
				'item': function() {
					return {
						css: { 
							completed: this.completed, 
							editing: this.editing 
						}
					};
				},
				'completed': function () {
					return {
						checked: this.completed
					};
				},
				'readOnlyValue': function(context) {
					return {
						text: this.title, 
						'event': { 
							dblclick: context.$root.editItem 
						}
					}
				},
				'editingValue': function(context) {
					return {
						value: this.title, 
						valueUpdate: 'afterkeydown', 
						enterKey: context.$root.stopEditing, 
						selectAndFocus: this.editing, 
						event: { 
							blur: context.$root.stopEditing 
						}
					};
				},
				'destroy': function (context) {
					return {
						click: context.$root.remove
					};
				}
			}
		},
		footer: {
			'isVisible': function () {
				return {
					visible: this.completedCount() || this.remainingCount()
				};
			},
			'remainingCount': function () {
				return {
					text: this.remainingCount
				};
			},
			'remainingCountText': function() {
				return {
					text: this.getLabel( this.remainingCount )
				};
			},
			filters: {
				'all': function() {
					return {
						css: { selected: this.showMode() === 'all' }
					};
				},
				'active': function() {
					return {
						css: { selected: this.showMode() === 'active' }
					};
				},
				'completed': function() {
					return {
						css: { selected: this.showMode() === 'completed' }
					};
				}
			},
			'clearCompleted': function() {
				return {
					visible: this.completedCount, 
					click: this.removeCompleted
				};
			},
			'completedCount': function() {
				return {
					text: this.completedCount()
				};
			}
		}
	};

	ko.bindingProvider.instance = new ko.classBindingProvider(bindings);

	// bind a new instance of our view model to the page
	var viewModel = new ViewModel( todos || [] );
	ko.applyBindings( viewModel );

	// set up filter routing
	Router({ '/:filter': viewModel.showMode }).init();
}());
