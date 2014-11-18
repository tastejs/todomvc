'use strict';
define(['Stapes'], function(Stapes) {
	return Stapes.create().extend({
		'init': function() {
			if (!'localStorage' in window) return;

			this.emit('ready');
		},

		'load': function() {
			var result = window.localStorage['todos-stapes'];

			if (result) {
				return JSON.parse(result);
			}
		},

		'save': function(data) {
			localStorage['todos-stapes'] = JSON.stringify( data );
		}
	});
});
