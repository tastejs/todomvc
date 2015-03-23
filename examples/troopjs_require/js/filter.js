define([
	'./component',
	'troopjs-hub/emitter'
], function (Component, hub) {
	'use strict';

	return Component.extend({
		'hub/route/change(true)': function (route) {
			return hub
				.emit('todos/filter', route)
				.yield(void 0);
		},

		'hub/todos/filter': function (filter) {
			this.$element
				.find('a[href^="#"]')
				.removeClass('selected')
				.filter('[href="#' + (filter || '/') + '"]')
				.addClass('selected');
		}
	});
});
