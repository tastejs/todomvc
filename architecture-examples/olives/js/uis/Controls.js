(function( window ) {
	'use strict';
	
	define( "Todo/Controls", ["Olives/OObject", "Olives/Event-plugin", "Olives/Model-plugin", "Store"],

	// The Controls UI
	function Controls( OObject, EventPlugin, ModelPlugin, Store ) {
		
		return function ControlsInit( view, model ) {
			
			// The OObject (the controller) inits with a default model which is a simple store
			// But it can be init'ed with any other store, like the LocalStore
			var controls = new OObject(model),
			
			// A function to get the completed tasks
			getCompleted = function () {
				var completed = [];
				model.loop(function (value, id) {
					if ( value.completed) {
						completed.push(id);
					}
				});
				return completed;
			},
			
			// A simple observable store to save the stats
			stats = new Store({
				nbItems: 0,
				nbLeft: 0,
				nbCompleted: 0,
				plural: "items"
			}),
			
			// Update all stats
			updateStats = function () {
				var nbCompleted = getCompleted().length;
				
				stats.set("nbItems", model.getNbItems());
				stats.set("nbLeft", stats.get("nbItems") - nbCompleted);
				stats.set("nbCompleted", nbCompleted);
				stats.set("plural", stats.get("nbLeft") == 1 ? "item" : "items");
			};
			
			// Add plugins to the UI.
			controls.plugins.addAll({
				"event": new EventPlugin(controls),
				"stats": new ModelPlugin(stats)
			});
			
			// The controls' view
			controls.alive(view);
			
			// Delete all tasks
			controls.delAll = function () {
				model.delAll(getCompleted());
			};
			
			// Update stats when the tasks list is modified
			model.watch("added", updateStats);
			model.watch("deleted", updateStats);
			model.watch("updated", updateStats);
			
			// Here, I could either calculate the data first, or save it using a localStorage
			// I'm recalculating, it only happens once and saves a store in localStorage
			updateStats();
			
			// Hide/show the clear completed button
			stats.watchValue("nbCompleted", function (value) {
				view.querySelector("button").style.display = value ? "block" : "none";
			});
			
			// Hide/show the controls bar according to the number of items
			stats.watchValue("nbItems", function (value) {
				view.style.display = value ? "block" : "none";
			});
			
			return stats;
			
		};
		
	});

})( window );