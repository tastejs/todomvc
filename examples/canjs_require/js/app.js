/*global require */
require.config({
	paths: {
		jquery: '../bower_components/jquery/jquery',
		can: '../bower_components/canjs/amd/can',
		localstorage: '../bower_components/canjs-localstorage/can.localstorage'
	}
});

require([
	'jquery',
	'can/view',
	'can/route',
	'./components/todo-app'
], function ($, can, route) {
	'use strict';

	$(function () {
		// Set up a route that maps to the `filter` attribute
		route(':filter');

		// Render #app-template
		$('#todoapp').html(can.view('app-template', {}));

		// Start the router
		route.ready();
	});
});
