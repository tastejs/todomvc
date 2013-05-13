/*global define*/
(function () {
	'use strict';

	// It's going to be called Input
	define('Todos/Input', [
		// It uses the Olives' OObject and the Event Plugin to listen to dom events and connect them to methods
		'bower_components/olives/src/OObject',
		'bower_components/olives/src/Event.plugin'
	],

	// The Input UI
	function Input(OObject, EventPlugin) {
		// It returns an init function
		return function InputInit(view, model) {
			// The OObject (the controller) inits with a default model which is a simple store
			// But it can be init'ed with any other store, like the LocalStore
			var input = new OObject(model);
			var ENTER_KEY = 13;

			// The event plugin that is added to the OObject
			// We have to tell it where to find the methods
			input.plugins.add('event', new EventPlugin(input));

			// The method to add a new taks
			input.addTask = function addTask(event, node) {
				if (event.keyCode === ENTER_KEY && node.value.trim()) {
					model.alter('push', {
						title: node.value.trim(),
						completed: false
					});
					node.value = '';
				}
			};

			// Alive applies the plugins to the HTML view
			input.alive(view);
		};
	});
})();
