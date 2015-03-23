define([
	'./component',
	'poly/array'
], function (Component) {
	'use strict';

	return Component.extend({
		'hub/todos/change(true)': function (tasks) {
			var count = tasks
				.filter(function (task) {
					return !task.completed;
				})
				.length;

			this.$element.html('<strong>' + count + '</strong> ' + (count === 1 ? 'item' : 'items') + ' left');
		}
	});
});
