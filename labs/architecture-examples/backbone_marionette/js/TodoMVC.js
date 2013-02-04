/*global Backbone */
'use strict';

var TodoMVC = new Backbone.Marionette.Application();

TodoMVC.addRegions({
	header: '#header',
	main: '#main',
	footer: '#footer'
});

TodoMVC.on('initialize:after', function () {
	Backbone.history.start();
});
