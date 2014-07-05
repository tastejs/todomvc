/*global Backbone */
'use strict';

// TodoMVC is global for developing in the console
// and functional testing.
window.TodoMVC = new Backbone.Marionette.Application();

TodoMVC.addRegions({
	header: '#header',
	main: '#main',
	footer: '#footer'
});

TodoMVC.on('initialize:after', function () {
	Backbone.history.start();
});
