define( [ 'troopjs-core/component/widget' ], function CreateModule(Widget) {
	var ENTER_KEY = 13;

	return Widget.extend({
		'dom/keyup': function onKeyUp(topic, $event) {
			var $element = this.$element;
			var value;

			if ($event.keyCode === ENTER_KEY) {
				value = $element.val().trim();

				if (value !== '') {
					this.publish('todos/add', value);

					$element.val('');
				}
			}
		}
	});
});
