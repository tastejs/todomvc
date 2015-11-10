define([
	'./component',
	'troopjs-hub/emitter'
], function (Component, hub) {
	'use strict';

	/**
	 * Component for the `.filters` list
	 */

	return Component.extend({
		/**
		 * HUB `route/change` handler (memorized).
		 * Called whenever the route (`window.location.hash`) is updated.
		 * @param {String} route New route
		 */
		'hub/route/change(true)': function (route) {
			return hub
				// Emit `todos/filter` with the new `route` on `hub`, yield `void 0` to not mutate arguments for next handler
				.emit('todos/filter', route)
				.yield();
		},

		/**
		 * HUB `todos/filter` handler.
		 * Called whenever the task list filter is updated
		 * @param {String} filter New filter
		 */
		'hub/todos/filter': function (filter) {
			this.$element
				// Find all `a` elements with a `href` attribute staring with `#`
				.find('a[href^="#"]')
				// Remove the `selected` class from matched elements
				.removeClass('selected')
				// Filter matched elements with a `href` attribute matching (`filter` || `/`)
				.filter('[href="#' + (filter || '/') + '"]')
				// Add the `selected` to matching elements
				.addClass('selected');
		}
	});
});
