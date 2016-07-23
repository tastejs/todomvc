require({
	baseUrl: 'node_modules',

	packages: [{
		name: 'todos-troopjs',
		location: '../js'
	}],

	paths: {
		jquery: 'jquery/dist/jquery'
	},

	deps: [
	'require',
	'jquery',
	'troopjs/main',
	'troopjs-widget/main',
	'troopjs-route-hash/main'
	],

	callback: function (localRequire, jQuery) {
		// Require "application" and "route" components
		localRequire([
		'troopjs-widget/application',
		'troopjs-route-hash/component'
    ], function (Application, Route) {
	// Wait for `document.ready`
	jQuery(function ($) {
		// Create `Application` attached to `$('html')`, add `Route` child component and `.start`
		Application($('html'), 'bootstrap', Route($(window))).start();
	});
    });
	}
});
