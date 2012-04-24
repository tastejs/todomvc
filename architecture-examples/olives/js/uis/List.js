(function( window ) {
	'use strict';
	
	define( "Todo/List", ["Olives/OObject", "Olives/Event-plugin", "Olives/Model-plugin"],

	// The List UI
	function List( OObject, EventPlugin, ModelPlugin ) {
		
		return function ListInit( view, model, controls ) {
			
			// The OObject (the controller) inits with a default model which is a simple store
			// But it can be init'ed with any other store, like the LocalStore
			var list = new OObject(model);
			
			// Remove the completed task
			list.remove = function remove( event, node ) {
				model.del(node.getAttribute("data-model_id"));
			};
			
			// Un/check all tasks
			list.toggleAll = function toggleAll( event, node ) {
				var checked = !!node.checked;
				model.loop(function ( value, idx ) {
					this.update(idx, "completed", checked);
				}, model);
			};
			
			// Switch to edit mode
			list.edit = function ( event, node ) {
		
			};
			
			// list's view
			list.alive(view);
			
			// Show/Hide the list
			controls.watchValue("nbItems", function (value) {
				view.style.display = value ? "block" : "none";
			});
			
			// Check/Uncheck all tasks if nb completed tasks is the same as the nb of items
			controls.watchValue("nbCompleted", function (value) {
				view.querySelector("#toggle-all").checked = model.getNbItems() == value ? "on" : "";
			});

			
		};
		
	});

})( window );