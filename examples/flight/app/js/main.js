/*global DEBUG */
'use strict';

require.config({
	baseUrl: './',
	paths: {
		jquery: 'node_modules/jquery/dist/jquery',
		es5shim: 'node_modules/es5-shim/es5-shim',
		es5sham: 'node_modules/es5-shim/es5-sham',
		text: 'node_modules/requirejs-text/text',
		flight: 'node_modules/flight',
		depot: 'node_modules/depot/depot',
		app: 'app/js',
		templates: 'app/templates',
		ui: 'app/js/ui',
		data: 'app/js/data',
	},
	shim: {
		'app/page/app': {
			deps: ['jquery', 'es5shim', 'es5sham']
		}
	}
});

require(['flight/lib/debug'], function (debug) {
	debug.enable(true);
	DEBUG.events.logAll();
	require(['app/page/app'],function(App){
		App.initialize();
	});
});
