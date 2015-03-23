define([
	'./component',
	'troopjs-hub/emitter'
], function (Component, hub) {
	'use strict';

	var ENTER_KEY = 13;

	return Component.extend({
		'dom/keyup': function ($event) {
			var $element = this.$element;
			var value;

			if ($event.keyCode === ENTER_KEY) {
				value = $element
					.val()
					.trim();

				if (value !== '') {
					hub
						.emit('todos/add', value)
						.then(function () {
							$element.val('');
						});
				}
			}
		}
	});
});
