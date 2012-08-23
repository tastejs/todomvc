// This is a build profile for Dojo version of TodoMVC.
// To use this, place todomvc directory at the directory containing dojo/dijit/dojox/util (and follow the procedure of building Dojo).
// Refer to todomvc/architecture-examples/dojo/js/lib/dojo-1.8 and todomvc/architecture-examples/dojo/js/lib/dijit-1.8 to see what built files need to be copied. 
dependencies = {
	stripConsole: "normal",

	selectorEngine:"acme",

	layers: [
		{
			name: "dojo.js",
			dependencies: [
				"dojo.domReady",
				"dojo.parser",
				"todo.app18"
			]
		}
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
		[ "doh", "../util/doh" ],
		[ "todo", "../todomvc/architecture-examples/dojo/js/todo" ]
	]
}
