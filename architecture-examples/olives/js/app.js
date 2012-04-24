(function( window ) {
	'use strict';
	
	// These are the UIs that compose the Todo application
	require( ["Todo/Input", "Todo/List", "Todo/Controls", "Olives/LocalStore"],

	// The application
	function Todos( Input, List, Controls, Store ) {
		
		// The tasks Store is told to init on an array 
		// so tasks are indexed by a number
		var tasks = new Store([]),
		
		// The Controls UI returns a small API for things like stats
		controls = Controls(document.querySelector("#footer"), tasks);
		
		// Synchronize the store on "todos-olives" local store
		tasks.sync("todos-olives");
		
		// Initialize Input UI by giving it a view and a model.
		Input(document.querySelector("#header input"), tasks);
		
		// Init the List UI the same way, pass it the controls' API too
		List(document.querySelector("#main"), tasks, controls);
		
	});

})( window );