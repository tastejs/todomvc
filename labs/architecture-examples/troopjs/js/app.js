require({
	"baseUrl" : "js",
	"paths" : {
		"jquery" : "lib/jquery",
		"troopjs-bundle" : "lib/troopjs-bundle"
	},
	"priority": [ "jquery", "config", "troopjs-bundle" ]
}, [ "jquery" ], function App(jQuery) {
	jQuery(document).ready(function ready($) {
		$(this.body).find("[data-weave]").weave();
	});
});
