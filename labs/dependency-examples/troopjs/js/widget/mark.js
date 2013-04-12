/*global define*/
define([
	'jquery',
	'troopjs-core/component/widget'
], function MarkModule($, Widget) {
	'use strict';

	return Widget.extend({
		'hub:memory/todos/change': function onChange(topic, items) {
			var total = 0;
			var count = 0;
			var $element = this.$element;

			$.each(items, function iterator(i, item) {
				if (item === null) {
					return;
				}

				if (item.completed) {
					count++;
				}

				total++;
			});

			$element
				.prop('indeterminate', count !== 0 && count !== total)
				.prop('checked', count === total);
		},

		'dom/change': function onMark(topic, $event) {
			this.publish('todos/mark', $($event.target).prop('checked'));
		}
	});
});
