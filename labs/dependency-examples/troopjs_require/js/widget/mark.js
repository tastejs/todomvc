/*global define:false */
define([
	'troopjs-browser/component/widget',
	'jquery',
	'poly/array'
], function MarkModule(Widget, $) {
	'use strict';

	return Widget.extend({
		'hub:memory/todos/change': function onChange(items) {
			var total = 0;
			var completed = 0;
			var $element = this.$element;

			items.forEach(function (item) {
				if (item === null) {
					return;
				}

				if (item.completed) {
					completed++;
				}

				total++;
			});

			if (completed === 0) {
				$element
					.prop('indeterminate', false)
					.prop('checked', false);
			} else if (completed === total) {
				$element
					.prop('indeterminate', false)
					.prop('checked', true);
			} else {
				$element
					.prop('indeterminate', true)
					.prop('checked', false);
			}
		},

		'dom/change': function onMark($event) {
			this.publish('todos/mark', $($event.target).prop('checked'));
		}
	});
});
