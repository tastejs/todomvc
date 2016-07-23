define([
	'./component',
	'troopjs-hub/emitter',
	'poly/array'
], function (Component, hub) {
	'use strict';

	/**
	 * Component for `toggle-all` checkbox
	 */

	return Component.extend({
		/**
		 * HUB `todos/change` handler (memorized).
		 * Called whenever the task list is updated
		 * @param {Array} tasks Updated task array
		 */
		'hub/todos/change(true)': function (tasks) {
			// Set `this.$element` `checked` property based on all `tasks` `.completed` state
			this.$element.prop('checked', tasks.every(function (task) {
				return task.completed;
			}, true));
		},

		/**
		 * DOM `change` handler
		 */
		'dom/change': function () {
			// Emit `todos/complete` on `hub` with `this.$element` `checked` property
			hub.emit('todos/complete', this.$element.prop('checked'));
		}
	});
});
