(function( window ) {
	'use strict';
	
	define( "Todo/List", ["Olives/OObject", "Olives/Event-plugin", "Olives/Model-plugin"],

	// The List UI
	function List( OObject, EventPlugin, ModelPlugin ) {
		
		return function ListInit( view, model, controls ) {
			
			// The OObject (the controller) inits with a default model which is a simple store
			// But it can be init'ed with any other store, like the LocalStore
			var list = new OObject(model),
			
			ENTER_KEYCODE = 13;
			
			// The plugins
			list.plugins.addAll({
				"event": new EventPlugin(list),
				"model": new ModelPlugin(model, {
					"toggleClass": function ( value, className ) {
						value ? this.classList.add(className) : this.classList.remove(className);
					}
				}),
				"stats": new ModelPlugin(controls, {
					"toggleClass": function ( value, className ) {
						value ? this.classList.add(className) : this.classList.remove(className);
					},
					"toggleCheck": function ( value ) {
						this.checked = model.getNbItems() == value ? "on" : "";
					}
				})
			});
			
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
			
			// Enter edit mode
			list.startEdit = function ( event, node ) {
				var taskId = node.getAttribute("data-model_id");
				
				// Switch the task to edit mode
				model.update(taskId, "editing", true);
				// Select the field's content
				view.querySelector("input.edit[data-model_id='" + taskId + "']").select();
			};
			
			// Quit to edit mode
			list.stopEdit = function ( event, node ) {
				var taskId = node.getAttribute("data-model_id"),
					value;
				
				// If  we hit enter
				if ( event.keyCode == ENTER_KEYCODE ) {
					// Trim the value
					value = node.value.trim();
					
					// If it's not empty
					if ( value ) {
						// Update its value
						model.update(taskId, "title", value);
					} else {
						// Else, delete it
						model.del(taskId);
					}
					
					// And switch edit mode
					model.update(taskId, "editing", false);
					
				// If the field has lost focus
				} else if ( event.type == "blur" ) {
					
					// Simply switch the edit mode
					model.update(taskId, "editing", false);
				}
			};
			
			// Alive applies the plugins on the HTML view
			list.alive(view);

			
		};
		
	});

})( window );