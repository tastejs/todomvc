/*jshint newcap:false */
/*global include, mask, Compo, ruta */

'use strict';

/**
 * Application Entry Point
 *
 * - load immediate dependecies
 * - define and initialize Application Component
 *
 */

include

	// Global route namespaces, to simplify resource dependency loading
	.routes({
		model: 'model/{0}.js',
		cntrl: 'cntrl/{0}.js',
		compo: 'compo/{0}/{1}.js'
	})

	.cfg({
		// Load `/foo.bar` from current _directory_ path, and not from domain's root
		lockToFolder: true
	})

	.js({
		model: 'Todos',
		cntrl: 'input',
		compo: ['todoList', 'filter']
	})

	.load('./app.mask::Template')

	.ready(function (resp) {

		mask.registerHandler(':app', Compo({
			template: resp.load.Template,
			model: resp.Todos.fetch(),
			scope: {
				action: ''
			},
			slots: {
				newTask: function (event, title) {
					if (title) {
						this.model.create(title);
					}
				},
				removeAllCompleted: function () {
					this.model.del(function (x) {
						return x.completed === true;
					});
				}
			},
			onRenderStart: function () {
				// (RutaJS) Default router is the History API,
				// but for this app spec enable hashes
				ruta
					.setRouterType('hash')
					.add('/?:action', this.applyFilter.bind(this))
					.notifyCurrent()
					;
			},
			applyFilter: function (route, params) {
				this.scope.action = params.action || '';
			}
		}));

		Compo.initialize(':app', document.body);
	});