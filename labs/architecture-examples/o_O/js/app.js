//a custom binding to handle the enter key
o_O.bindings.enterKey = function( func, $el ) {
	var ENTER_KEY = 13;
	var context = this;
	$el.keyup(function(e) {
		if( e.keyCode === ENTER_KEY )
			func.call(context);
	})
}
o_O.bindingTypes.enterKey = 'outbound'


// represents a single todo item
var Todo = o_O.model.extend({
		title: '',
		completed: false
	},
	{
		initialize: function() {
			this.editing = o_O(false)
		},

		startEditing: function() {
			this.editing( true )
			var self = this
			setTimeout(function() {
				$(self.el).parent().find('input.edit').focus().select()
			}, 0)
		},

		stopEditing: function() {
			var text = $.trim( this.title() )

			text
				? this.title( text )
				: this.remove()

			this.editing( false )
		},

		remove: function() {
			todoapp.todos.remove( this )
		},

		visible: function() {
			var filter = todoapp.filter(),
					completed = this.completed()
			return filter == '' || (filter == 'completed' && completed) || (filter == 'active' && !completed)
		},

		klass: function() {
			if(this.editing())
				return 'editing'
			if(this.completed())
				return 'completed'
			else
				return ''
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
			var self = this
			self.todos = o_O.array( this.todos() )

			this.todos.on('set:completed set:title add remove', function() {
				var completed = self.todos.filter(function(todo) {
					return todo.completed()
				})
				self.completedCount( completed.length )
				self.persist()
			})

			this.remainingCount = o_O(function() {
				return self.todos.count() - self.completedCount()
			})

			// writeable computed observable
			// handles marking all complete/incomplete
			// or retrieving if this is true
			this.allCompleted = o_O(function(v) {
				if(arguments.length == 0) {
					return self.remainingCount() == 0
				}

				self.todos.each(function(todo) {
					todo.completed( v )
				})

				return v
			})

		},

		add: function() {
			var text = $.trim( this.current() );
			if( text ) {
				this.todos.unshift( Todo({title: text}) );
				this.current( "" )
			}
		},

		removeCompleted: function () {
			this.todos.remove( function(todo) {
				return todo.completed()
			})
			return false
		},

		persist: function() {
			localStorage[ 'todos-o_O' ] = JSON.stringify( this.todos.toJSON() )
		},

		// adds an `s` where necessary
		pluralize: function( word, count ) {
			return word + (count === 1 ? "" : "s");
		}
	}
);

function main() {
	// load todos
	var todos = []
	try {
		todos = JSON.parse( localStorage['todos-o_O'] );
	}
	catch(e) { }

	// create models
	for( var i=0; i < todos.length; i++ )
		todos[ i ] = Todo.create( todos[i] )

	// create app
	window.todoapp = TodoApp( {todos: todos} )

	// bind to DOM element
	todoapp.bind('#todoapp')


	// setup Routing
	o_O.router()
		.add('*filter', function(filt) {
			todoapp.filter(filt)

			$( '#filters a' )
				.removeClass( 'selected' )
				.filter( "[href='#/" + filt + "']" )
				.addClass( 'selected' )
		})
		.start()
}

// kick it off
main();