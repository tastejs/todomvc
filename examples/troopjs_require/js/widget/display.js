/*global define:false */
define([
	'troopjs-browser/component/widget',
	'poly/array'
], function DisplayModule(Widget) {
	'use strict';

	function filter(item) {
		return item !== null;
	}

	return Widget.extend({
		'hub:memory/todos/change': function onChange(items) {
			this.$element.toggle(items.some(filter));
		}
	});
});
