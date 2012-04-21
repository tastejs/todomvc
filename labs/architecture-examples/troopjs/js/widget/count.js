define( [ "troopjs-core/component/widget", "jquery" ], function CountModule(Widget, $) {

	function filter(item, index) {
		return item === null || item.completed;
	}

	return Widget.extend({
		"hub/todos/change" : function onChange(topic, items) {
			var count = $.grep(items, filter, true).length;
			var $element = this.$element;

			if (count > 0) {
				$element.text(count + (count > 1 ? " items left" : " item left"));
			}
			else {
				$element.text("No items left");
			}
		}
	});
});