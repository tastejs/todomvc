/*global soma:false */
(function (todo, soma) {

	'use strict';

	todo.TodoApp = soma.Application.extend({
		init: function () {
			// mapping rules so the model and router can be injected
			this.injector.mapClass('model', todo.Model, true);
			this.injector.mapClass('router', todo.Router, true);
			// create templates for DOM Elements (optional soma-template plugin)
			this.createTemplate(todo.HeaderView, document.getElementById('header'));
			this.createTemplate(todo.MainView, document.getElementById('main'));
			this.createTemplate(todo.FooterView, document.getElementById('footer'));
		},
		start: function () {
			// dispatch a custom event to render the templates
			this.dispatcher.dispatch('render');
		}
	});

	// create the application
	new todo.TodoApp();

})(window.todo = window.todo || {}, soma);
