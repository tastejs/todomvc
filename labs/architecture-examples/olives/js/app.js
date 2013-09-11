/*global require*/
(function () {
	'use strict';

	// These are the UIs that compose the Todo application
	require([
		'Todos/Input',
		'Todos/List',
		'Todos/Controls',
		'bower_components/olives/src/LocalStore',
		'Store'
	],

	// The application
	function Todos(Input, List, Controls, LocalStore, Store) {
		// The tasks Store is told to init on an array
		// so tasks are indexed by a number
		// This store is shared among several UIs of this application
		// that's why it's created here
		var tasks = new LocalStore([]);

		// Also create a shared stats store
		var stats = new Store({
			nbItems: 0,
			nbLeft: 0,
			nbCompleted: 0,
			plural: 'items'
		});

		// Synchronize the store on 'todos-olives' localStorage
		tasks.sync('todos-olives');

		// Initialize Input UI by giving it a view and a model.
		Input(document.querySelector('#header input'), tasks);

		// Init the List UI the same way, pass it the stats store too
		List(document.querySelector('#main'), tasks, stats);

		// Same goes for the control UI
		Controls(document.querySelector('#footer'), tasks, stats);
	});
})();
