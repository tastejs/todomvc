/*global define:false */
define([ 'troopjs-browser/component/widget' ], function CreateModule(Widget) {
	'use strict';

	var ENTER_KEY = 13;

	return Widget.extend({
		'dom/keyup': function onKeyUp($event) {
			var me = this;
			var $element = me.$element;
			var value;

			if ($event.keyCode === ENTER_KEY) {
				value = $element.val().trim();

				if (value !== '') {
					me.publish('todos/add', value)
						.then(function () {
							$element.val('');
						});
				}
			}
		}
	});
});
