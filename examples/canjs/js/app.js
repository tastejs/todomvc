/* global $, can */
(function () {
	'use strict';

	$(function () {
		// Set up a route that maps to the `filter` attribute
		can.route(':filter');

		// Render .app-template
		$('.todoapp').html(can.view('app-template', {}));

		// Start the router
		can.route.ready();
	});
})();
