/*global DEBUG */
'use strict';

require.config({
	baseUrl: './',
	paths: {
		jquery: 'bower_components/jquery/dist/jquery',
		es5shim: 'bower_components/es5-shim/es5-shim',
		es5sham: 'bower_components/es5-shim/es5-sham',
		text: 'bower_components/requirejs-text/text',
		flight: 'bower_components/flight',
		depot: 'bower_components/depot/depot',
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
