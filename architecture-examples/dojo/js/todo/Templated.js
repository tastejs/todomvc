define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojox/mvc/at"
], function(declare, lang, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, at){
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		// summary:
		//		A templated widget, mostly the same as dijit/_Templated, but without deprecated features in it.

		// bindings: Object
		//		The data binding declaration for child widgets.
		bindings: null,

		startup: function(){
			// Code to support childBindings property in dojox/mvc/WidgetList, etc.
			// This implementation makes sure childBindings is set before this widget starts up, as dijit/_WidgetsInTemplatedMixin starts up child widgets before it starts itself up.
			for(var s in this.bindings){
				var w = this[s], props = this.bindings[s];
				if(w){
					for(var prop in props){
						w.set(prop, props[prop]);
					}
				}
			}
			this.inherited(arguments);
		}
	});
});
