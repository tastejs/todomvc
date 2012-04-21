define( [ "troopjs-core/component/widget" ], function MarkModule(Widget) {
	var INDETERMINATE = "indeterminate";
	var CHECKED = "checked";

	return Widget.extend({
		"hub/todos/change" : function onChange(topic, items) {
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

			if (count === 0) {
				$element
					.prop(INDETERMINATE, false)
					.prop(CHECKED, false);
			}
			else if (count === total) {
				$element
					.prop(INDETERMINATE, false)
					.prop(CHECKED, true);
			}
			else {
				$element
					.prop(INDETERMINATE, true)
					.prop(CHECKED, false);
			}
		},

		"dom/change" : function onMark(topic, $event) {
			this.publish("todos/mark", $($event.target).prop("checked"));
		}
	});
});