define([
	'./component',
	'troopjs-hub/emitter',
	'poly/array'
], function (Component, hub) {
	'use strict';

	return Component.extend({
		'hub/todos/change(true)': function (tasks) {
			this.$element.prop('checked', tasks.every(function (task) {
				return task.completed;
			}, true));
		},

		'dom/change': function () {
			hub.emit('todos/complete', this.$element.prop('checked'));
		}
	});
});
