define( [ "troopjs-core/component/widget" ], function CreateModule(Widget) {
	var ENTER_KEY = 13;

	return Widget.extend({
		"dom/keyup" : function onKeyUp(topic, $event) {
			var self = this;
			var $element = self.$element;
			var value;

			switch($event.keyCode) {
			case ENTER_KEY:
				value = $element.val().trim();

				if (value !== "") {
					self.publish("todos/add", value);

					$element.val("");
				}
			}
		}
	});
});
