// https://github.com/tastejs/todomvc/blob/master/codestyle.md
(function (window) {
	'use strict';

	window.require.config({
		baseUrl: 'js',

		paths: {
			jquery: '../bower_components/jquery/dist/jquery',
			backbone: '../bower_components/backbone/backbone',
			underscore: '../bower_components/underscore/underscore',
			Factory: '../bower_components/factoryjs/dist/Factory',
			BackboneFactory: '../bower_components/factoryjs/dist/BackboneFactory',
		},

		shim: {
			d3: { exports: 'd3' },
			jquery: { exports: 'jQuery' },
			underscore: { exports: '_' },
			backbone: {
				deps: ['underscore', 'jquery'],
				exports: 'Backbone'
			}
		},

		// Oraculum is a library  of behaviors, hence it is treated as a package.
		packages: [{
			name: 'oraculum',
			location: '../bower_components/oraculum/dist'
		}],
		callback: function () {
			window.require(['index']);
		}
	});

})( window );
