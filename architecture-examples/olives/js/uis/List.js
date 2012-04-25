define( "Todo/List", ["Olives/OObject", "Olives/Event-plugin", "Olives/Model-plugin"],

// The List UI
function List( OObject, EventPlugin, ModelPlugin ) {
	
	return function ListInit( view, model, stats ) {
		
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
			"stats": new ModelPlugin(stats, {
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

			model.update(taskId, "editing", true);
			view.querySelector("input.edit[data-model_id='" + taskId + "']").select();
		};
		
		// Leave edit mode
		list.stopEdit = function ( event, node ) {
			var taskId = node.getAttribute("data-model_id"),
				value;
			
			if ( event.keyCode == ENTER_KEYCODE ) {
				value = node.value.trim();
				
				if ( value ) {
					model.update(taskId, "title", value);
				} else {
					model.del(taskId);
				}
				model.update(taskId, "editing", false);

			} else if ( event.type == "blur" ) {
				model.update(taskId, "editing", false);
			}
		};
		
		// Alive applies the plugins on the HTML view
		list.alive(view);

		
	};
	
});