define( [ "troopjs-core/component/widget" ], function CreateModule(Widget) {
	var RE = /^\s+|\s+$/;
	var ENTER = 13;
	var EMPTY = "";

	return Widget.extend({
		"dom/keyup" : function onKeyUp(topic, $event) {
			var self = this;
			var $element = self.$element;
			var value;

			switch($event.keyCode) {
			case ENTER:
				value = $element.val().replace(RE, EMPTY);

				if (value !== EMPTY) {
					self.publish("todos/add", value);

					$element.val(EMPTY);
				}
			}
		}
	});
});