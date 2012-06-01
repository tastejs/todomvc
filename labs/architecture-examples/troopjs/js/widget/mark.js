define( [ "troopjs-core/component/widget" ], function MarkModule(Widget) {

	return Widget.extend({
		"hub:memory/todos/change" : function onChange(topic, items) {
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
					.prop("indeterminate", false)
					.prop("checked", false);
			}
			else if (count === total) {
				$element
					.prop("indeterminate", false)
					.prop("checked", true);
			}
			else {
				$element
					.prop("indeterminate", true)
					.prop("checked", false);
			}
		},

		"dom/change" : function onMark(topic, $event) {
			this.publish("todos/mark", $($event.target).prop("checked"));
		}
	});
});
