define([
	'./component'
], function (Component) {
	'use strict';

	return Component.extend({
		'hub/todos/change(true)': function (tasks) {
			this.$element.toggle(tasks.length !== 0);
		}
	});
});
