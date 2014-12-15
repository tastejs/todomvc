define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/Stateful",
	"dojox/mvc/ModelRefController"
], function(array, declare, Stateful, ModelRefController){
	return declare(ModelRefController, {
		// summary:
		//		Our custom controller that does:
		//
		//			- Handle actions like adding/removing/marking
		//			- Provide references to the todo list in data model, whose data comes from above Dojo Object Store
		//
		// description:
		//		The todo list in the data model, which is based on dojox/mvc/StatefulArray, can be referred via this[this._refModelProp].
		//		Actions are implemented in the manner of manipulating array.
		//		The change will automatically be reflected to the UI via the notification system of dojox/mvc/StatefulArray.

		addItem: function(/*String*/ title){
			// summary:
			//		Adds a todo item with the given title.
			// title: String
			//		The title of todo item.

			this[this._refModelProp].push(new Stateful({title: title, completed: false}));
		},

		removeItem: function(/*String*/ uniqueId){
			// summary:
			//		Removes a todo item having the given unique ID.
			// uniqueId: String
			//		The unique ID of the todo item to be removed.

			var model = this[this._refModelProp],
			 indices = array.filter(array.map(model, function(item, idx){ return item.uniqueId == uniqueId ? idx : -1; }), function(idx){ return idx >= 0; }); // The array index of the todo item to bd removed
			if(indices.length > 0){
				model.splice(indices[0], 1);
			}
		},

		removeCompletedItems: function(){
			// summary:
			//		Removes todo items that have been marked as complete.

			var model = this[this._refModelProp];
			for(var i = model.length - 1; i >= 0; --i){
				if(model[i].get("completed")){
					model.splice(i, 1);
				}
			}
		},

		markAll: function(/*Boolean*/ markComplete){
			// summary:
			//		Mark all todo items as complete or incomplete.
			// markComplete: Boolean
			//		True to mark all todo items as complete. Otherwise to mark all todo items as incomplete.

			array.forEach(this[this._refModelProp], function(item){
				item.set("completed", markComplete);
			});
		}
	});
});
