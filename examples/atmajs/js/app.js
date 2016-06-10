/*jshint newcap:false */
/*global include, mask, Compo, ruta */

'use strict';

/**
 * Controller for the App Component
 *
 * - load model dependecies
 */

include
	.js('Store/Todos.js')
	.done(function (resp) {

		include.exports = {
			model: resp.Todos.fetch(),
			scope: {
				action: ''
			},
			slots: {
				submit: function (event, title) {
					if (title) {
						this.model.create(title);
					}
				},
				removeAllCompleted: function () {
					this.model.removeCompleted();
				}
			},
			onRenderStart: function () {
				// (RutaJS) Default router is the History API,
				// but for this app-spec we enable hashes
				ruta
					.setRouterType('hash')
					.add('/?:action', this.applyFilter.bind(this))
					.notifyCurrent()
					;
			},
			applyFilter: function (route, params) {
				this.scope.action = params.action || '';
			}
		};
	});
