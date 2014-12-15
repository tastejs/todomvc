define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/unload",
	"dojo/keys",
	"dojo/string",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"todo/CssToggleWidget",
	"dojo/text!./app18.html",
	// Below modules are referred in template.
	// dijit/_WidgetsInTemplateMixin requires all modules referred in template to have been loaded before it's instantiated.
	"dijit/form/CheckBox",
	"dijit/form/TextBox",
	"dojox/mvc/at",
	"todo/TodoList",
	"todo/ctrl/RouteController",
	"todo/ctrl/TodoListRefController",
	"todo/ctrl/TodoRefController",
	"todo/form/InlineEditBox",
	"todo/misc/HashSelectedConverter",
	"todo/misc/LessThanOrEqualToConverter",
	"todo/model/SimpleTodoModel",
	"todo/store/LocalStorage"
], function(declare, lang, unload, keys, string, _TemplatedMixin, _WidgetsInTemplateMixin, CssToggleWidget, template){
	return declare([CssToggleWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
		// summary:
		//		A widgets-in-template widget that composes the application UI of TodoMVC (Dojo 1.8 version).
		//		Also, this class inherits todo/CssToggleWidget so that it can react to change in "present"/"complete" attributes and add/remove CSS class to the root DOM node of this widget.

		// templateString: String
		//		The HTML of widget template.
		templateString: template,

		// _setPresentAttr: Object
		//		A object used by todo/CssToggleWidget to reflect true/false state of "present" attribute to existence of "todos_present" CSS class in this widget's root DOM.
		_setPresentAttr: {type: "classExists", className: "todos_present"},

		// _setCompleteAttr: Object
		//		A object used by todo/CssToggleWidget to reflect true/false state of "complete" attribute to existence of "todos_selected" CSS class in this widget's root DOM.
		_setCompleteAttr: {type: "classExists", className: "todos_selected"},

		startup: function(){
			// summary:
			//		A function called after the DOM fragment declaring this controller is added to the document.
			//		See documentation for dijit/_WidgetBase.startup() for more details.

			var _self = this;
			this.inherited(arguments);
			unload.addOnUnload(function(){
				_self.destroy(); // When this page is being unloaded, call destroy callbacks of inner-widgets to let them clean up
			});
		},

		onKeyPressNewItem: function(/*DOMEvent*/ event){
			// summary:
			//		Handle key press events for the input field for new todo.
			// description:
			//		If user has pressed enter, add current text value as new todo item in the model.

			if(event.keyCode !== keys.ENTER || !string.trim(event.target.value).length){
				return; // If the key is not Enter, or the input field is empty, bail
			}

			lang.getObject(this.id + "_listCtrl").addItem(event.target.value); // Add a todo item with the given text
			event.target.value = ""; // Clear the input field
			event.preventDefault();
			event.stopPropagation();
		}
	});
});
