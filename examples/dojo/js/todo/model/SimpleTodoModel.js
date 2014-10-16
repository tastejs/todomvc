define([
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojox/mvc/getStateful"
], function(array, lang, getStateful){
	var defaultData = {
		// summary:
		//		Data used when there is no saved data.
		//		The same structure is used to save data to localStrage (when the page is unloaded).

		// id: String
		//		The ID of saved data, used in Dojo Object Store as well as in localStorage that the Dojo Object Store uses.
		id: "todos-dojo",

		// todos: Object[]
		//		The todo items.
		todos : [],

		// incomplete: Number
		//		The count of incomplete todo items.
		incomplete: 0,

		// complete: Number
		//		The count of complete todo items.
		complete: 0
	};

	var seq = 0; // The sequence number to generate unique IDs of todo items

	return function(/*Object*/ data){
		// summary:
		//		The data model for TodoMVC.
		// description:
		//		This data model does:
		//
		//			- Keep complete/incomplete properties up to date
		//			- Add unique ID to new todo items
		//
		// data: Object
		//		The plain data, coming from Dojo Object Store.

		function assignPropertiesToNewItem(/*dojo/Stateful*/ item){
			// summary:
			//		Add additional properties to a todo item.
			// description:
			//		This function does:
			//
			//			- Add unique ID to the given todo item
			//			- Add setter function for completed property to the given todo item
			// item: dojo/Stateful
			//		The todo item.

			lang.mixin(item, {
				_completedSetter: function(/*Boolean*/ value){
					// summary
					//		The setter function for completed property, which keeps complete/incomplete properties of the data model up to date.
					// value: Boolean
					//		True means this todo item is completed. Otherwise means this todo item is incomplete.

					if(this.completed ^ value){ // Update is done only if there is a flip in value
						// If the todo item is turned to completed state, increase the count of completed items.
						// If the todo item is turned to incomplete state, decrease the count of completed items.
						statefulData.set("complete", statefulData.get("complete") + (value ? 1 : -1));
					}
					this.completed = value; // Assign the new value
				},

				// uniqueId: String
				//		The unique ID of the todo item.
				uniqueId: "TODO-" + seq++
			});
		}

		var statefulData = getStateful(data || defaultData); // Convert a plain object to dojo/Stateful, hierarchically. Use the default data if (lastly saved) data is not there
		array.forEach(statefulData.todos, assignPropertiesToNewItem); // Add additional properties to todo items

		return lang.mixin(statefulData, {
			_elementWatchHandle: statefulData.todos.watchElements(function(/*Number*/ idx, /*dojo/Stateful[]*/ removals, /*dojo/Stateful[]*/adds){
				// summary:
				//		The dojox/mvc/StatefulArray watch callback for adds/removals of todo items.
				// description:
				//		This callback does:
				//
				//			- Keep complete/incomplete properties up to date, upon adds/removals of todo items
				//			- Add unique ID to new todo items
				//			- Add setter function for completed property to new todo items
				//
				// idx: Number
				//		The array index where adds/removals happened at.
				// removals: dojo/Stateful[]
				//		The removed todo items.
				// adds: dojo/Stateful[]
				//		The added todo items.

				var complete = statefulData.get("complete");
				array.forEach(removals, function(item){ complete -= !!item.completed; }); // If completed items are removed, decrease the count of completed items
				array.forEach(adds, function(item){ complete += !!item.completed; }); // If completed items are added, increase the count of completed items
				statefulData.set("complete", complete);
				statefulData.set("incomplete", statefulData.todos.get("length") - complete);
				array.forEach(adds, assignPropertiesToNewItem); // Add additional properties to newly added todo items
			}),

			_incompleteSetter: function(/*Number*/ value){
				// summary:
				//		dojo/Stateful setter function for incomplete property.
				// description:
				//		This setter function keeps complete property up to date.
				// value: Number
				//		The new count of incomplete todo items.

				var changed = this.incomplete != value;
				this.incomplete = value; // Assign the new value
				if(changed){ // Update is done only if there is a change in value
					this.set("complete", this.todos.get("length") - value); // Make the count of complete items reflect the new count of incomplete items
				}
			},

			_completeSetter: function(/*Number*/ value){
				// summary:
				//		dojo/Stateful setter function for complete property.
				// description:
				//		This setter function keeps incomplete property up to date.
				// value: Number
				//		The new count of complete todo items.

				var changed = this.complete != value;
				this.complete = value; // Assign the new value
				if(changed){ // Update is done only if there is a change in value
					this.set("incomplete", this.todos.get("length") - value); // Make the count of incomplete items reflect the new count of complete items
				}
			},

			destroy: function(){
				this._elementWatchHandle.remove(); // Stop watching for adds/removals of todo items
			}
		});
	};
});
