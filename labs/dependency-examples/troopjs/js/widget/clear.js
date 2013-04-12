/*global define*/
define([
	'troopjs-core/component/widget',
	'jquery'
], function ClearModule(Widget, $) {
	'use strict';

	function filter(item) {
		return item === null || !item.completed;
	}

	return Widget.extend({
		'hub:memory/todos/change': function onChange(topic, items) {
			var count = $.grep(items, filter, true).length;

			this.$element.text('Clear completed (' + count + ')').toggle(count > 0);
		},

		'dom/click': function onClear() {
			this.publish('todos/clear');
		}
	});
});
