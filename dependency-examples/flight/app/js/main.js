'use strict';

require.config({
	baseUrl: './',
	paths: {
		jquery: 'bower_components/jquery/jquery',
		es5shim: 'bower_components/es5-shim/es5-shim',
		es5sham: 'bower_components/es5-shim/es5-sham',
		text: 'bower_components/requirejs-text/text',
		flight: 'bower_components/flight',
		depot: 'bower_components/depot/depot'
	},
	shim: {
		'app/js/app': {
			deps: ['jquery', 'es5shim', 'es5sham']
		}
	}
});

require(['app/js/app'], function (App) {
	App.initialize();
});
