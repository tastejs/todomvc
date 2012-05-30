require({
	"baseUrl" : "js",
	"paths" : {
		"jquery" : "lib/jquery",
		"troopjs-bundle" : "lib/troopjs-bundle"
	},
	"priority": [ "jquery", "config", "troopjs-bundle" ]
}, [ "jquery", "widget/application" ], function App(jQuery, Application) {
	jQuery(document).ready(function ready($) {
		Application($(this.body), "app/todos").start();
	});
});
