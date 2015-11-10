define([
	'./component'
], function (Component) {
	'use strict';

	/**
	 * Component for handling visibility depending on tasks count
	 */

	return Component.extend({
		/**
		 * HUB `todos/change` handler (memorized).
		 * Called whenever the task list is updated
		 * @param {Array} tasks Updated task array
		 */
		'hub/todos/change(true)': function (tasks) {
			// Toggle visibility (visible if `task.length !== 0`, hidden otherwise)
			this.$element.toggle(tasks.length !== 0);
		}
	});
});
