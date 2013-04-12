/*global define*/
define([
	'troopjs-core/component/widget',
	'jquery'
], function DisplayModule(Widget, $) {
	'use strict';

	function filter(item) {
		return item === null;
	}

	return Widget.extend({
		'hub:memory/todos/change': function onChange(topic, items) {
			var count = $.grep(items, filter, true).length;

			this.$element.toggle(count > 0);
		}
	});
});
