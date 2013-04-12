/*global define*/
define([
	'troopjs-core/component/widget',
	'jquery'
], function CountModule(Widget, $) {
	'use strict';

	function filter(item) {
		return item === null || item.completed;
	}

	return Widget.extend({
		'hub:memory/todos/change': function onChange(topic, items) {
			var count = $.grep(items, filter, true).length;

			this.$element.html('<strong>' + count + '</strong> ' + (count === 1 ? 'item' : 'items') + ' left');
		}
	});
});
