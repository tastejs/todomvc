define( [ "troopjs-core/component/widget" ], function CreateModule(Widget) {
	return Widget.extend({
		"dom/keyup" : function onKeyUp(topic, $event) {
			var self = this;
			var $element = self.$element;

			switch($event.keyCode) {
			case 13:
				self.publish("todos/add", $element.val());

				$element.val("");
			}
		}
	});
});