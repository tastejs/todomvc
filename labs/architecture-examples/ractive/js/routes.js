/*global window, todoList */
/*jslint white: true */

(function ( window, Router, todoList ) {

	'use strict';

	var router = new Router({
		'/active': function () {
			todoList.set( 'currentFilter', 'active' );
		},
		'/completed': function () {
			todoList.set( 'currentFilter', 'completed' );
		}
	});

	router.configure({
		notfound: function () {
			window.location.hash = '';
			todoList.set( 'currentFilter', 'all' );
		}
	});

	router.init();

}( window, Router, todoList ));