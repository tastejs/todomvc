'use strict';
var OObject = require('olives').OObject;
var EventPlugin = require('olives')['Event.plugin'];
var BindPlugin = require('olives')['Bind.plugin'];
var tools = require('../lib/tools');
var router = require('../lib/router');
var RouterPlugin = require('../lib/RouterPlugin');

module.exports = function controlsInit(view, model, stats) {
	// The OObject (the controller) inits with a default model which is a simple store
	// But it can be init'ed with any other store, like the LocalStore
	var controls = new OObject(model);

	// A function to get the completed tasks
	function getCompleted() {
		var completed = [];
		model.loop(function (value, id) {
			if (value.completed) {
				completed.push(id);
			}
		});
		return completed;
	}

	// Update all stats
	function updateStats() {
		var nbCompleted = getCompleted().length;

		stats.set('nbItems', model.count());
		stats.set('nbLeft', stats.get('nbItems') - nbCompleted);
		stats.set('nbCompleted', nbCompleted);
		stats.set('plural', stats.get('nbLeft') === 1 ? 'item' : 'items');
	}

	// Add plugins to the UI.
	controls.seam.addAll({
		event: new EventPlugin(controls),
		router: new RouterPlugin(router),
		stats: new BindPlugin(stats, {
			toggleClass: tools.toggleClass
		})
	});

	// Alive applies the plugins to the HTML view
	controls.alive(view);

	// Delete all tasks
	controls.delAll = function delAll() {
		model.delAll(getCompleted());
	};

	// Update stats when the tasks list is modified
	model.watch('added', updateStats);
	model.watch('deleted', updateStats);
	model.watch('updated', updateStats);

	// I could either update stats at init or save them in a localStore
	updateStats();
};
