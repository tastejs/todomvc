/*global Backbone, TodoMVC:true, $ */

var TodoMVC = TodoMVC || {};

$(function () {
	'use strict';

	// After we initialize the app, we want to kick off the router
	// and controller, which will handle initializing our Views
	TodoMVC.App.on('start', function () {
		var controller = new TodoMVC.Controller();
		controller.router = new TodoMVC.Router({
			controller: controller
		});

		controller.start();
		Backbone.history.start();
	});

	// start the TodoMVC app (defined in js/TodoMVC.js)
	TodoMVC.App.start();
});
