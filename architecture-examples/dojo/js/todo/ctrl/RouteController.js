define([
	"dojo/_base/declare",
	"dojo/router",
	"dijit/Destroyable",
	"dojox/mvc/_Controller"
], function(declare, router, Destroyable, _Controller){
	return declare([_Controller, Destroyable], {
		// summary:
		//		A controller that maintains hash attribute in sync with location.hash.
		// example:
		//		In this example, the text box is in sync with the URL hash.
		//		(The change in URL hash is reflected to the text box, and the edit in text box will be reflected to the URL hash)
		// |		<html>
		// |			<head>
		// |				<script src="/path/to/dojo-toolkit/dojo/dojo.js" type="text/javascript"
		// |				 data-dojo-config="parseOnLoad: 1,
		// |				                   packages: [{name: 'todo', location: '/path/to/todo-package'}],
		// |				                   deps: ['dojo/parser', 'dojo/domReady!']"></script>
		// |			</head>
		// |			<body>
		// |				<script type="dojo/require">at: "dojox/mvc/at"</script>
		// |				<span id="routeCtrl" data-dojo-type="todo/ctrl/RouteController"></span>
		// |				<input data-dojo-type="dijit/form/TextBox"
		// |				 data-dojo-props="value: at('widget:routeCtrl', 'hash')">
		// |			</body>
		// |		</html>

		postscript: function(/*Object?*/ params, /*DOMNode?*/ srcNodeRef){
			// summary:
			//		Kicks off instantiation of this controller, in a similar manner as dijit/_WidgetBase.postscript().
			// params: Object?
			//		The optional parameters for this controller.
			// srcNodeRef: DOMNode?
			//		The DOM node declaring this controller. Set if this controller is created via Dojo parser.

			this.inherited(arguments);
			srcNodeRef && srcNodeRef.setAttribute("widgetId", this.id); // If this is created via Dojo parser, set widgetId attribute so that destroyDescendants() of parent widget works
		},

		startup: function(){
			// summary:
			//		A function called after the DOM fragment declaring this controller is added to the document, in a similar manner as dijit/_WidgetBase.startup().

			var _self = this;
			this.own(router.register(/.*/, function(e){ // Register a route handling callback for any route, make sure it's cleaned up upon this controller being destroyed
				_self._set("hash", e.newPath); // Update hash property
			}));
			router.startup(); // Activate dojo/router
			this.set("hash", router._currentPath); // Set the inital value of hash property
		},

		_setHashAttr: function(value){
			// summary:
			//		Handler for calls to set("hash", val).
			// description:
			//		If the new value is different from location.hash, updates location.hash.

			if(this.hash != value){
				router.go(value); // If the new value is different from location.hash, updates location.hash
			}
			this._set("hash", value); // Assign the new value to the property
		}
	});
})
