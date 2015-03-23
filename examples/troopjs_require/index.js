require({
	baseUrl: 'bower_components',

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
		localRequire([
			'troopjs-widget/application',
			'troopjs-route-hash/component'
		], function (Application, Route) {
			jQuery(function ($) {
				Application($('html'), 'bootstrap', Route($(window))).start();
			});
		});
	}
});
