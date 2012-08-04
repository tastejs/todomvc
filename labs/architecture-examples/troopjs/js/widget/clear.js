define( [ "troopjs-core/component/widget", "jquery" ], function ClearModule(Widget, $) {

	function filter(item, index) {
		return item === null || !item.completed;
	}

	return Widget.extend({
		"hub:memory/todos/change" : function onChange(topic, items) {
			var count = $.grep(items, filter, true).length;

			this.$element.text("Clear completed (" + count + ")")[count > 0 ? "show" : "hide"]();
		},

		"dom/click" : function onClear(topic, $event) {
			this.publish("todos/clear");
		}
	});
});
