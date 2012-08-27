define([
	"dojo/_base/declare",
	"dojox/mvc/at",
	"todo/_CssToggleMixin",
	"todo/Templated"
], function(declare, at, _CssToggleMixin, Templated){
	var ACTIVE = "/active",
	 COMPLETED = "/completed";

	function getHiddenState(/*Object*/ props){
		// summary:
		//		Returns the new hidden state of todo item, given the URL hash and the completed state of todo item.
		// props: Object
		//		An object containing the URL hash and the completed state of todo item.

		return props.hash == ACTIVE ? props.completed :
		 props.hash == COMPLETED ? !props.completed :
		 false;
	}

	return declare([Templated, _CssToggleMixin], {
		// summary:
		//		The widgets-in-template for todo item.
		// description:
		//		Defines data bindings for uniqueId/completed, and the mapping between several widget attributes to CSS classes (using todo/_CssToggleMixin).
		//		Also, looks at URL hash and completed state of todo item, and updates the hidden state. A todo item should be hidden if:
		//
		//			- URL hash is "/active" and the todo item is complete -OR-
		//			- URL hash is "/copleted" and the todo item is incomplete

		// _setStrikeAttr: Object
		//		A object used by todo/_CssToggleMixin to reflect true/false state of "strike" attribute to existence of "completed" CSS class in this widget's root DOM.
		_setStrikeAttr: {type: "classExists", className: "completed"},

		// _setHiddenAttr: Object
		//		A object used by todo/_CssToggleMixin to reflect true/false state of "hidden" attribute to existence of "hidden" CSS class in this widget's root DOM.
		_setHiddenAttr: {type: "classExists", className: "hidden"},

		_setHashAttr: function(/*String*/ value){
			// summary:
			//		Handler for calls to set("hash", val), to update hidden state given the new value and the completed state.

			this.set("hidden", getHiddenState({hash: value, completed: this.completed})); // Update hidden state given the new value and the completed state
			this._set("hash", value); // Assign the new value to the attribute
		},

		_setCompletedAttr: function(/*Boolean*/ value){
			// summary:
			//		Handler for calls to set("completed", val), to update hidden state given the new value and the hash.

			this.set("hidden", getHiddenState({hash: this.hash, completed: value})); // Update hidden state given the new value and the hash
			this.set("strike", value); // Update completed strike-through
			this._set("completed", value); // Assign the new value to the attribute
		},

		startup: function(){
			// summary:
			//		A function called after the DOM fragment declaring this controller is added to the document, in a similar manner as dijit/_WidgetBase.startup().
			// description:
			//		Defines data binding for uniqueId/completed.

			this.set("uniqueId", at(this.target, "uniqueId")); // Bind its uniqueId attribute to the data model for the todo item, so that the action handler for removing a todo item can specify which todo item should be removed
			this.set("completed", at(this.target, "completed")); // Bind its completed attribute to the data model for the todo item, so that todo/ctrl/_HashCompletedMixin code can determine the shown/hidden state with the URL hash
			this.inherited(arguments);
		},

		removeItem: function(){
			// summary:
			//		Implements an action to remove a todo item.

			this.listCtrl.removeItem(this.uniqueId);
		}
	});
});
