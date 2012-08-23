define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojox/mvc/EditStoreRefController"
], function(array, declare, EditStoreRefController){
	return declare(EditStoreRefController, {
		// summary:
		//		Our custom controller that does:
		//
		//			- Load and save data using a Dojo Object Store
		//			- Provide references to the data model, whose data comes from above Dojo Object Store

		// defaultId: String
		//		The default ID to fetch data as this controller starts up.
		defaultId: "",

		// store: dojo/store
		//		Our custom Dojo Object Store, backed by localStorage.
		//		This will be used to read the initial items, if available, and persist the current items when the application finishes.
		store: null,

		// modelClass: todo/model/SimpleTodoModel
		//		The class of our data model, based on dojo/Stateful and dojox/mvc/StatefulArray.
		//		This will be used to automatically keep various Todo properties (e.g. number of complete/incomplete items) consistent, and to auto-generate properties (e.g. default unique IDs).
		modelClass: null,

		getStatefulOptions: {
			// summary:
			//		An object that specifies how plain object from Dojo Object Store should be converted to a data model based on dojo/Stateful and dojox/mvc/StatefulArray.

			getType: function(/*Object*/ v){
				return "specifiedModel"; // We are converting given object at once using modelClass here, instead of using per-data-item based data conversion callbacks
			},

			getStatefulSpecifiedModel: function(/*Object*/ o){
				return new (this.parent.modelClass)(o); // Create an instance of modelClass given the plain object from Dojo Object Store
			}
		},

		getPlainValueOptions: {
			// summary:
			//		An object that specifies how a data model based on dojo/Stateful and dojox/mvc/StatefulArray should be converted to a plain object, to be saved to Dojo Object Store.

			getType: function(/*todo/model/SimpleTodoModel*/ o){
				return "specifiedModel"; // We are converting given data model at once, instead of using per-data-item based data conversion callbacks
			},

			getPlainSpecifiedModel: function(/*todo/model/SimpleTodoModel*/ o){
				return { // Pick up only meaningful data here
					id: o.id,
					todos: array.map(o.todos, function(item){ return {title: item.title, completed: item.completed }; }),
					incomplete: o.incomplete,
					complete: o.complete
				};
			}
		},

		postscript: function(/*Object?*/ params, /*DOMNode?*/ srcNodeRef){
			// summary:
			//		Kicks off instantiation of this controller, in a similar manner as dijit/_WidgetBase.postscript().
			// params: Object?
			//		The optional parameters for this controller.
			// srcNodeRef: DOMNode?
			//		The DOM node declaring this controller. Set if this controller is created via Dojo parser.

			this.getStatefulOptions.parent = this; // For getStatefulOptions object to have a reference to this object
			this.inherited(arguments);
			srcNodeRef && srcNodeRef.setAttribute("widgetId", this.id); // If this is created via Dojo parser, set widgetId attribute so that destroyDescendants() of parent widget works
		},

		startup: function(){
			// summary:
			//		A function called after the DOM fragment declaring this controller is added to the document, in a similar manner as dijit/_WidgetBase.startup().

			this.inherited(arguments);
			this.getStore(this.defaultId); // Obtain data from Dojo Object Store as soon as this starts up
		},

		set: function(/*String*/ name, /*Anything*/ value){
			// summary:
			//		A function called when a property value is set to this controller.

			if(name == this._refSourceModelProp && this[this._refSourceModelProp] != value && (this[this._refSourceModelProp] || {}).destroy){
				this[this._refSourceModelProp].destroy(); // If we have a data model and it's being replaced, make sure it's cleaned up
			}
			this.inherited(arguments);
		},

		destroy: function(){
			// summary:
			//		A function called when this controller is being destroyed, in a similar manner as dijit/_WidgetBase.destroy().

			this.commit(); // Save the data to Dojo Object Store when this is destroyed
			if((this[this._refSourceModelProp] || {}).destroy){
				this[this._refSourceModelProp].destroy(); // If we have a data model, make sure it's cleaned up
			}
			this.inherited(arguments);
		}
	});
});
