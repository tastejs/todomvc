(function( window ) {
	'use strict';
	
	// These are the UIs that compose the Todo application
	require( ["Todo/Input", "Todo/List", "Todo/Controls", "Olives/LocalStore"],

	// The application
	function Todos( Input, List, Controls, Store ) {
		
		// The tasks Store is told to init on an array 
		// so tasks are indexed by a number
		var tasks = new Store([]),
		
		// Also create a stats store
		stats = new Store({
			nbItems: 0,
			nbLeft: 0,
			nbCompleted: 0,
			plural: "items"
		});
		
		// Synchronize the store on "todos-olives" localStorage
		tasks.sync("todos-olives");
		
		// Initialize Input UI by giving it a view and a model.
		Input(document.querySelector("#header input"), tasks);
		
		// Init the List UI the same way, pass it the controls' API too
		List(document.querySelector("#main"), tasks, stats);
		
		// The Controls UI returns a small Store with the statistics
		Controls(document.querySelector("#footer"), tasks, stats);
		
	});

})( window );