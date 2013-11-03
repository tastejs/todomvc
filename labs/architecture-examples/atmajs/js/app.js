/*jshint newcap:false */
/*global include, Compo */

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

	.ready(function (resp) {

		/* Initialize and load the model from the Store */
		var todos = resp.Todos.fetch();

		var Application = Compo({
			template: '#layout',
			slots: {

				newTask: function (event, title) {

					if (title) {
						this.model.create(title);
					}
				},

				removeAllCompleted: function () {

					this
						.model
						.del(function (x) {
							return x.completed === true;
						});
				}
			}
		});

		Compo.initialize(Application, todos, document.body);
	});
