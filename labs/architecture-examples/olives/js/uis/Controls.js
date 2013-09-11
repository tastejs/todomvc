/*global define*/
(function () {
	'use strict';

	define('Todos/Controls', [
		'bower_components/olives/src/OObject',
		'bower_components/olives/src/Event.plugin',
		'bower_components/olives/src/Bind.plugin',
		'LocalStore',
		'Todos/Tools'
	],

	// The Controls UI
	function Controls(OObject, EventPlugin, ModelPlugin, Store, Tools) {
		return function ControlsInit(view, model, stats) {
			// The OObject (the controller) inits with a default model which is a simple store
			// But it can be init'ed with any other store, like the LocalStore
			var controls = new OObject(model);

			// A function to get the completed tasks
			var getCompleted = function () {
				var completed = [];
				model.loop(function (value, id) {
					if (value.completed) {
						completed.push(id);
					}
				});
				return completed;
			};

			// Update all stats
			var updateStats = function () {
				var nbCompleted = getCompleted().length;

				stats.set('nbItems', model.getNbItems());
				stats.set('nbLeft', stats.get('nbItems') - nbCompleted);
				stats.set('nbCompleted', nbCompleted);
				stats.set('plural', stats.get('nbLeft') === 1 ? 'item' : 'items');
			};

			// Add plugins to the UI.
			controls.plugins.addAll({
				'event': new EventPlugin(controls),
				'stats': new ModelPlugin(stats, {
					'toggleClass': Tools.toggleClass
				})
			});

			// Alive applies the plugins to the HTML view
			controls.alive(view);

			// Delete all tasks
			controls.delAll = function () {
				model.delAll(getCompleted());
			};

			// Update stats when the tasks list is modified
			model.watch('added', updateStats);
			model.watch('deleted', updateStats);
			model.watch('updated', updateStats);

			// I could either update stats at init or save them in a localStore
			updateStats();
		};
	});
})();
