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
		flight: 'bower_components/flight',
		depot: 'bower_components/depot/depot',
		text: 'bower_components/requirejs-text/text'
	},

	// ask Require.js to load these files (all our tests)
	deps: tests,

	// start test run, once Require.js is done
	callback: window.__karma__.start
});

jasmine.getFixtures().fixturesPath = '/base/test/fixture';
