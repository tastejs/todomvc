/*global include, mask, Compo, ruta */

/*
 *	Filter Presentation:
 *		- HASH-change listener
 *		- navigation(filter) buttons
 *
 */

include
	.load('filter.mask::Template')
	.done(function (resp) {
		'use strict';

		// `Compo` function creates components constructor,
		// but it doesnt have ClassJS features, like inhertince and
		// others. With `Compo.createClass`(_if ClassJS is used_) we
		// can use those features in components constructor

		mask.registerHandler(':filter', Compo.createClass({
			template: resp.load.Template,

			onRenderStart: function () {
				ruta
					// (RutaJS) Default router is the History API,
					// but for this APP use hashes
					.setRouterType('hash')

					// Note: we do not bind to `this` compo instance,
					// as applyFilter is already bound to it.
					.add('/?:action', this.applyFilter)
					;

				// Define filters model
				this.model = [{
					title: 'All',
					action: ''
				}, {
					title: 'Active',
					action: 'active'
				}, {
					title: 'Completed',
					action: 'completed'
				}];

				this.applyFilter(ruta.current());
			},

			Self: {
				applyFilter: function (route) {

					this.action = _setSelectedFilter(route.current, this.model);

					// Emit a signal 'action' in a 'filter' pipe
					Compo.pipe('filter').emit('action', this.action);
				}
			}
		}));


		function _setSelectedFilter(route, filters) {
			var action = route.params.action || '';

			// Update View via Binding
			filters.forEach(function (filter) {
				filter.selected = action === filter.action ? 'selected' : '';
			});

			return action;
		}

	});
