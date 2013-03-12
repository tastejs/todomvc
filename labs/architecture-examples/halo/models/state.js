/*global define*/
'use strict';
define(['Sauron', 'CrudModel'], function (Sauron, crudModel) {
	var params = {
		'name': 'state',
		'mixin': ['memory'],
		'load': function () {
			// DEV: It is preferred to use URLSON for more complex states
			// Get our state
			var state = this.memory.get('state'),
					hash = window.location.hash;

			// If there is no state, look at the hash
			if (!state) {
				state = {filter: 'all'};
				if (hash === '#/active') {
					state = {filter: 'active'};
				} else if (hash === '#/completed') {
					state = {filter: 'completed'};
				}

				// Update the hash
				this.save(state);
			}

			// Return our state
			return state;
		},
		'save': function (state) {
			// Update the hash to our state
			var filter = state.filter,
					hash = filter === 'all' ? '#/' : '#/' + filter;
			window.location.hash = hash;
			return this.memory.set('state', state);
		},
		'retrieve': function (cb) {
			var state = this.load();
			cb(null, state);
		},
		'update': function (changes, cb) {
			// Load in the state and copy changes
			var state = this.load(),
					keys = Object.getOwnPropertyNames(changes);
			keys.forEach(function (key) {
				state[key] = changes[key];
			});

			// Save and  fire an update event
			this.save(state);
			Sauron.model('state').updateEvent(state);

			// If there is a callback, use it
			if (cb) { cb(null); }
		}
	};
	return crudModel(params);
});