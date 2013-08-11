/*global window, Ractive */
/*jslint white: true */

var todoList = (function( window, Ractive ) {
	
	'use strict';

	// create our app view
	var todoList = new Ractive({
		el: 'todoapp',
		template: '#main',

		data: {
			filter: function ( item, currentFilter ) {
				var filter = this.get( currentFilter );

				if ( !filter ) {
					return true;
				}

				return filter( item );
			},

			// define our filters
			completed: function ( item ) { return  item.completed; },
			active:    function ( item ) { return !item.completed; },

			currentFilter: 'all'
		},

		// We can define 'transitions', which are applied to elements on render
		// and teardown
		transitions: {
			// When the edit <input> renders, select its contents
			select: function ( node, complete ) {
				setTimeout( function () {
					node.select();
					complete();
				}, 0 );
			}
		}
	});

	// Event handlers
	todoList.on({
		remove: function ( event, index ) {
			this.get( 'items' ).splice( index, 1 );
		},
		new_todo: function ( event ) {
			var description = event.node.value.trim();

			if ( !description ) {
				return;
			}

			this.get( 'items' ).push({
				description: description,
				completed: false
			});

			event.node.value = '';
		},
		edit: function ( event ) {
			this.set( event.keypath + '.editing', true );
			this.nodes.edit.value = event.context.description;
		},
		submit: function ( event ) {
			var description = event.node.value.trim();

			if ( !description ) {
				this.get( 'items' ).splice( event.index.i, 1 );
				return;
			}

			this.set( event.keypath + '.description', description );
			this.set( event.keypath + '.editing', false );
		},
		cancel: function ( event ) {
			this.set( event.keypath + '.editing', false );
		},
		clear_completed: function () {
			var items = this.get( 'items' ), i = items.length;

			while ( i-- ) {
				if ( items[i].completed ) {
					items.splice( i, 1 );
				}
			}
		},
		toggle_all: function ( event ) {
			var i = this.get( 'items' ).length, completed = event.node.checked, changeHash = {};

			while ( i-- ) {
				changeHash[ 'items[' + i + '].completed' ] = completed;
			}

			this.set( changeHash );
		}
	});

	return todoList;

})( window, Ractive );