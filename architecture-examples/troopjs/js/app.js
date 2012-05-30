require({
	"baseUrl" : "js",
	"paths" : {
		"jquery" : "../../../assets/jquery.min",
		"troopjs-bundle" : "lib/troopjs-bundle"
	},
	"priority": [ "jquery", "config", "troopjs-bundle" ]
}, [ "jquery", "widget/application" ], function App(jQuery, Application) {
	jQuery(document).ready(function ready($) {
		Application($(this.body), "app/todos").start();
	});
});
