/*global window, todoList */
/*jslint white: true */

(function ( window, todoList ) {

	'use strict';

	var items;

	// Firefox throws a SecurityError if you try to access localStorage while
	// cookies are disabled
	try {
		window.localStorage;
	} catch ( err ) {
		todoList.set( 'items', [] );
		return;
	}

	if ( window.localStorage ) {
		items = JSON.parse( window.localStorage.getItem( 'todos-ractive' ) ) || [];

		// when the model changes...
		todoList.observe( 'items', function ( items ) {
			// ...persist it to localStorage
			if ( window.localStorage ) {
				localStorage.setItem( 'todos-ractive', JSON.stringify( items ) );
			}
		});
	}

	else {
		items = [];
	}

	todoList.set( 'items', items );

}( window, todoList ));