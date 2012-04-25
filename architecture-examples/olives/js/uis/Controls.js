(function( window ) {
	'use strict';
	
	define( "Todo/Controls", ["Olives/OObject", "Olives/Event-plugin", "Olives/Model-plugin", "Olives/LocalStore"],

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
			
			stats.sync("todos-olives-stats");
			
			// Add plugins to the UI.
			controls.plugins.addAll({
				"event": new EventPlugin(controls),
				"stats": new ModelPlugin(stats, {
					"toggleClass": function ( value, className ) {
						value ? this.classList.add(className) : this.classList.remove(className);
					}
				})
			});
			
			// Alive applies the plugins on the HTML view
			controls.alive(view);
			
			// Delete all tasks
			controls.delAll = function () {
				model.delAll(getCompleted());
			};
			
			// Update stats when the tasks list is modified
			model.watch("added", updateStats);
			model.watch("deleted", updateStats);
			model.watch("updated", updateStats);
			
			return stats;
			
		};
		
	});

})( window );