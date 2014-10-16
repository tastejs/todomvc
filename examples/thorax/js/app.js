/*global Thorax, Backbone*/
/*jshint unused:false*/
var ENTER_KEY = 13;

(function () {
	'use strict';
	// Kick things off by creating the **App**.
	var view = new Thorax.Views.app({
		collection: window.app.Todos
	});
	view.appendTo('body');
	Backbone.history.start();
}());
