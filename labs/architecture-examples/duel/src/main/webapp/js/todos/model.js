var todos = todos || {};

(function( todos, localStorage, KEY ) {

	/*-- private members -------------------------------*/

	var tasks;

	// model uses localStorage as the underlying data store
	// this creates a poor man's localStorage polyfill
	localStorage = localStorage || (function() {
		var storage = {};
		return {
			getItem: function( key ) {
				return storage[ key ];
			},
			setItem: function( key, value ) {
				storage[ key ] = value;
			}
		};
	})();

	function create( title, completed ) {
		return {
			// fast, compact, non-repeating, unique ID: e.g., 'c2wwu0vz.pz4zpvi'
			id: (new Date().getTime() + Math.random()).toString( 36 ),
			title: title,
			completed: !!completed
		};
	}

	function save() {
		// if doesn't support JSON then will be directly stored in polyfill
		var value = typeof JSON !== 'undefined' ? JSON.stringify( tasks ) : tasks;
		localStorage.setItem( KEY, value );
	}

	// initialize storage
	var value = localStorage.getItem( KEY );
	if ( value ) {
		// if doesn't support JSON then will be directly stored in polyfill
		tasks = typeof JSON !== 'undefined' ? JSON.parse( value ) : value;

	} else {
		tasks = [];
	}

	/*-- export public interface -------------------------------*/

	todos.model = {

		tasks: function() {
			return tasks;
		},

		stats: function() {
			var stats = {
				total: tasks.length,
				active: tasks.length,
				completed: 0
			};

			var i = tasks.length;
			while ( i-- ) {
				if ( tasks[i].completed ) {
					stats.completed++;
				}
			}
			stats.active -= stats.completed;

			return stats;
		},

		add: function( title ) {
			var task = create( title, false );

			tasks.push( task );
			save();

			return task;
		},

		edit: function( id, title ) {
			var i = tasks.length;
			while ( i-- ) {
				if ( tasks[i].id === id ) {
					tasks[i].title = title;
					save();
					return;
				}
			}
		},

		// toggle completion of task
		toggle: function( id, completed ) {
			var i = tasks.length;
			while ( i-- ) {
				if ( tasks[i].id === id ) {
					tasks[i].completed = completed;
					save();
					return;
				}
			}
		},

		// toggle completion of all tasks
		toggleAll: function( completed ) {
			var i = tasks.length;
			while ( i-- ) {
				tasks[i].completed = completed;
			}
			save();
		},

		remove: function( id ) {
			var i = tasks.length;
			while ( i-- ) {
				if ( tasks[i].id === id ) {
					tasks.splice( i, 1 );
					save();
					return;
				}
			}
		},

		expunge: function() {
			var i = tasks.length;
			while ( i-- ) {
				if ( tasks[i].completed ) {
					tasks.splice( i, 1 );
				}
			}
			save();
		}
	};

})( todos, window.localStorage, 'todos-duel' );
