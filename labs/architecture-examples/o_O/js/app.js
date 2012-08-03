/*global $, o_O, todoapp */
(function( window ) {
	'use strict';

	// represents a single todo item
	var Todo = o_O.model.extend({
			title: '',
			completed: false
		},
		{
			initialize: function() {
				this.editing = o_O( false );
			},

			startEditing: function() {
				this.editing( true );
				var self = this;
				setTimeout(function() {
					$( self.el ).parent().find('input.edit').focus();
				}, 0);
			},

			stopEditing: function() {
				var text = $.trim( this.title() );

				if ( text ) {
					this.title( text );
				} else {
					this.remove();
				}

				this.editing( false );
			},

			remove: function() {
				todoapp.todos.remove( this );
			},

			visible: function() {
				var filter = todoapp.filter(),
					completed = this.completed();

				return filter === '' ||
					 ( filter === 'completed' && completed ) ||
					 ( filter === 'active' && !completed );
			},

			klass: function() {
				if ( this.editing() ) {
					return 'editing';
				}
				if ( this.completed() ) {
					return 'completed';
				} else {
					return '';
				}
			}
		}
	);

	// main application
	var TodoApp = o_O.model.extend({
			current: '',
			completedCount: 0,
			filter: ''
		}, {
		initialize: function() {
			var self = this;

			self.todos = o_O.array( this.todos() );

			this.todos.on( 'set:completed set:title add remove', function() {
				var completed = self.todos.filter(function( todo ) {
					return todo.completed();
				});

				self.completedCount( completed.length );
				self.persist();
			});

			this.remainingCount = o_O(function() {
				return self.todos.count() - self.completedCount();
			});

			// writeable computed observable
			// handles marking all complete/incomplete
			// or retrieving if this is true
			this.allCompleted = o_O(function( v ) {
				if ( !arguments.length ) {
					return !self.remainingCount();
				}

				self.todos.each(function( todo ) {
					todo.completed( v );
				});

				return v;
			});
		},

		add: function() {
			var text = $.trim( this.current() );

			if ( text ) {
				this.todos.unshift(Todo({
					title: text
				}));
				this.current('');
			}
		},

		removeCompleted: function() {
			this.todos.remove(function( todo ) {
				return todo.completed();
			});
			return false;
		},

		persist: function() {
			localStorage['todos-o_O'] = JSON.stringify( this.todos.toJSON() );
		},

		pluralize: function( word, count ) {
			return word + ( count === 1 ? '' : 's' );
		}
	});

	function main() {
		// load todos
		var i, l,
			todos = [];

		try {
			todos = JSON.parse( localStorage['todos-o_O'] );
		} catch( e ) {}

		// create models
		for( i = 0, l = todos.length; i < l; i++ ) {
			todos[ i ] = Todo.create( todos[ i ] );
		}

		// create app
		window.todoapp = TodoApp({
			todos: todos
		});

		// bind to DOM element
		todoapp.bind('#todoapp');

		// setup Routing
		o_O.router()
			.add('*filter', function( filter ) {
				todoapp.filter( filter );

				$('#filters a')
					.removeClass('selected')
					.filter( '[href="#/' + filter + '"]' )
					.addClass('selected');
			})
			.start();
	}

	// a custom binding to handle the enter key
	o_O.bindings.enterKey = function( func, $el ) {
		var ENTER_KEY = 13,
			context = this;

		$el.keyup(function( e ) {
			if ( e.which === ENTER_KEY ) {
				func.call( context );
			}
		});
	};

	o_O.bindingTypes.enterKey = 'outbound';

	// kick it off
	main();

})( window );
