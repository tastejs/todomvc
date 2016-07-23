/*global requirejs:false */
(function (requirejs) {

	'use strict';

	requirejs.config({
		baseUrl: './js',
		paths: {
			// libs
			soma: '../node_modules/soma.js/build/soma',
			template: '../node_modules/soma-template/build/soma-template',
			director: '../node_modules/director/build/director',
			// app paths
			views: './views',
			models: './models'
		},
		shim: {
			'template': {
				deps: ['soma']
			},
			'director': {
				exports: 'Router'
			}

		}
	});

	requirejs([
		'soma',
		'template',
		'models/todos',
		'models/router',
		'views/header',
		'views/main',
		'views/footer'
	], function (soma, template, TodoModel, RouterModel, HeaderView, MainView, FooterView) {

		var TodoApp = soma.Application.extend({
			init: function () {
				// mapping rules so the model and router can be injected
				this.injector.mapClass('model', TodoModel, true);
				this.injector.mapClass('router', RouterModel, true);
				// create templates for DOM Elements (optional soma-template plugin)
				this.createTemplate(HeaderView, document.getElementById('header'));
				this.createTemplate(MainView, document.getElementById('main'));
				this.createTemplate(FooterView, document.getElementById('footer'));
			},
			start: function () {
				// dispatch a custom event to render the templates
				this.dispatcher.dispatch('render');
			}
		});

		// create the application
		new TodoApp();

	});


})(requirejs);
