define( [ "troopjs-core/component/widget" ], function CreateModule(Widget) {
	var RE = /^\s+|\s+$/;
	var ENTER_KEY = 13;
	var EMPTY = "";

	return Widget.extend({
		"dom/keyup" : function onKeyUp(topic, $event) {
			var self = this;
			var $element = self.$element;
			var value;

			switch($event.keyCode) {
			case ENTER_KEY:
				value = $element.val().replace(RE, EMPTY);

				if (value !== EMPTY) {
					self.publish("todos/add", value);

					$element.val(EMPTY);
				}
			}
		}
	});
});
