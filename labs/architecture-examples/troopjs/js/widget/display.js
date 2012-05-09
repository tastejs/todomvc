define( [ "troopjs-core/component/widget", "jquery" ], function DisplayModule(Widget, $) {

	function filter(item, index) {
		return item === null;
	}

	return Widget.extend({
		"hub/todos/change": function onChange(topic, items) {
			this.$element[$.grep(items, filter, true).length > 0 ? "show" : "hide"]("fast");
		}
	});
});