var todos = todos || {};

(function( todos, document ) {

	/*-- private members -------------------------------*/

	var ENTER_KEY = 13,
		STATS_ID = 'footer',
		TODOAPP_ID = 'todoapp',
		TASKS_ID = 'main',
		LIST_ID = 'todo-list',
		EDITING_CSS = 'editing';

	function getById( id ) {
		return document.getElementById( id );
	}

	function refreshStats( stats ) {
		// get the data
		var data = stats || todos.model.stats();

		// build the view
		var view = todos.views.Stats( data ).toDOM();

		// replace old stats
		var old = getById( STATS_ID );
		if ( old ) {
			old.parentNode.replaceChild( view, old );
		} else {
			getById( TODOAPP_ID ).appendChild( view );
		}
	}

	function refreshAll() {
		// get the data
		var data = {
			tasks: todos.model.tasks(),
			stats: todos.model.stats()
		};

		// build the view
		var view = todos.views.Tasks( data ).toDOM();

		// replace old task list
		var old = getById( TASKS_ID );
		if ( old ) {
			old.parentNode.replaceChild( view, old );
		} else {
			getById( TODOAPP_ID ).appendChild( view );
		}

		refreshStats( data.stats );
	}

	function add( input ) {
		var title = (input.value || '').trim();
		input.value = '';

		if ( !title ) {
			return;
		}

		var task = todos.model.add( title );

		var list = getById( LIST_ID );
		if ( list ) {
			// add new at the top
			list.appendChild( todos.views.Task( task ).toDOM() );
			refreshStats();
		} else {
			refreshAll();
		}
	}

	function edit( input, id ) {
		var title = (input.value || '').trim();
		input.value = title;

		if ( title ) {
			todos.model.edit( id, title );
		} else {
			todos.model.remove( id );
		}
		refreshAll();
	}

	/*-- export public interface -------------------------------*/

	// event handlers
	todos.actions = {
		add_blur: function( e ) {
			add( this );
		},

		add_keypress: function( e ) {
			if ( e.keyCode === ENTER_KEY ) {
				add( this );
			}
		},

		edit_blur: function( id ) {
			// create a closure around the ID
			return function( e ) {
				edit( this, id );
			};
		},

		edit_keypress: function( id ) {
			// create a closure around the ID
			return function(e) {
				if ( e.keyCode === ENTER_KEY ) {
					// just blur so doesn't get triggered twice
					this.blur();
				}
			};
		},

		remove_click: function( id ) {
			// create a closure around the ID
			return function( e ) {
				todos.model.remove( id );
				refreshAll();
			};
		},

		clear_click: function() {
			todos.model.expunge();
			refreshAll();
		},

		content_dblclick: function( id ) {
			// create a closure around the ID
			return function( e ) {
				var li = this;
				li.className = EDITING_CSS;
				li.getElementsByTagName( 'input' )[1].focus();
			};
		},

		completed_change: function( id ) {
			// create a closure around the ID
			return function( e ) {
				var checkbox = this;
				todos.model.toggle( id, checkbox.checked );
				refreshAll();
			};
		},

		toggle_change: function( e ) {
			var checkbox = this;
			todos.model.toggleAll( checkbox.checked );
			refreshAll();
		}
	};

	/*-- init task list -------------------------------*/

	(function( body ) {
		// build out task list
		var view = todos.views.TodoApp({
				tasks: todos.model.tasks(),
				stats: todos.model.stats()
			}).toDOM();

		// insert at top
		body.insertBefore( view, body.firstChild );
	})( document.body );

})( todos, document );
