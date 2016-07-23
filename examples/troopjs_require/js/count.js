define([
	'./component',
	'poly/array'
], function (Component) {
	'use strict';

	/**
	 * Component for the `.todo-count` span
	 */

	return Component.extend({
		/**
		 * HUB `todos/change` handler (memorized).
		 * Called whenever the task list is updated
		 * @param {Array} tasks Updated task array
		 */
		'hub/todos/change(true)': function (tasks) {
			// Filter and count tasks that are not completed
			var count = tasks
				.filter(function (task) {
					return !task.completed;
				})
				.length;

			// Update HTML with `count` taking pluralization into account
			this.$element.html('<strong>' + count + '</strong> ' + (count === 1 ? 'item' : 'items') + ' left');
		}
	});
});
