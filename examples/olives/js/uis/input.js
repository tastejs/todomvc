'use strict';
var OObject = require('olives').OObject;
var EventPlugin = require('olives')['Event.plugin'];

// It returns an init function
module.exports = function inputInit(view, model) {
	// The OObject (the controller) inits with a default model which is a simple store
	// But it can be init'ed with any other store, like the LocalStore
	var input = new OObject(model);
	var ENTER_KEY = 13;

	// The event plugin that is added to the OObject
	// We have to tell it where to find the methods
	input.seam.add('event', new EventPlugin(input));

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
