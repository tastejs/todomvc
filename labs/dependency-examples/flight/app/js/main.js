'use strict';

require.config({
	baseUrl: './',
	paths: {
		jquery: 'components/jquery/jquery',
		es5shim: 'components/es5-shim/es5-shim',
		es5sham: 'components/es5-shim/es5-sham',
		text: 'components/requirejs/plugins/text'
	},
	map: {
		'*': {
			'flight/component': 'components/flight/lib/component',
			'depot': 'components/depot/depot'
		}
	},
	shim: {
		'components/flight/lib/index': {
			deps: ['jquery', 'es5shim', 'es5sham']
		},
		'app/js/app': {
			deps: ['components/flight/lib/index']
		}
	}
});

require(['app/js/app'], function (App) {
	App.initialize();
});
