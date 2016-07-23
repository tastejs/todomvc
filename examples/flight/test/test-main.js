/*jshint camelcase:false*/
/*global jasmine*/
'use strict';

var tests = Object.keys(window.__karma__.files).filter(function (file) {
	return (/_spec\.js$/.test(file));
});

window.mocks = {};

requirejs.config({
	// Karma serves files from '/base'
	baseUrl: '/base',

	paths: {
		flight: 'node_modules/flight',
		depot: 'node_modules/depot/depot',
		text: 'node_modules/requirejs-text/text',
		ui: 'app/js/ui',
		data: 'app/js/data',
		app: 'app/js',
		templates: 'app/templates'
	},

	// ask Require.js to load these files (all our tests)
	deps: tests,

	// start test run, once Require.js is done
	callback: window.__karma__.start
});

jasmine.getFixtures().fixturesPath = '/base/test/fixture';
