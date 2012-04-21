define( [ "troopjs-core/component/widget", "jquery" ], function ClearModule(Widget, $) {

	function filter(item, index) {
		return item === null || !item.completed;
	}

	return Widget.extend({
		"hub/todos/change" : function onChange(topic, items) {
			var count = $.grep(items, filter, true).length;
			var $element = this.$element;

			if (count > 0) {
				$element
					.text("Clear " + count + (count > 1 ? " completed items" : " completed item"))
					.show();
			}
			else {
				$element
					.text("Clear no completed items")
					.hide();
			}
		},

		"dom/click" : function onClear(topic, $event) {
			this.publish("todos/clear");
		}
	});
});