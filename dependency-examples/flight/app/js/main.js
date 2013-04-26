'use strict';

require.config({
	baseUrl: './',
	paths: {
		jquery: 'bower_components/jquery/jquery',
		es5shim: 'bower_components/es5-shim/es5-shim',
		es5sham: 'bower_components/es5-shim/es5-sham',
		text: 'bower_components/requirejs/plugins/text'
	},
	map: {
		'*': {
			'flight/component': 'bower_components/flight/lib/component',
			'depot': 'bower_components/depot/depot'
		}
	},
	shim: {
		'bower_components/flight/lib/index': {
			deps: ['jquery', 'es5shim', 'es5sham']
		},
		'app/js/app': {
			deps: ['bower_components/flight/lib/index']
		}
	}
});

require(['app/js/app'], function (App) {
	App.initialize();
});
