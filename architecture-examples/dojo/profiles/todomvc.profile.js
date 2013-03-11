// This is a build profile for Dojo version of TodoMVC.
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
