/*global rivets */
(function (rivets) {
	'use strict';

	var ESCAPE_KEY = 27;
	var EVENT = 'keydown';

	rivets.binders.escape = {
		function: true,

		unbind: function (el) {
			if (this.handler) {
				el.removeEventListener(EVENT, this.handler);
			}
		},

		routine: function (el, value) {
			if (this.handler) {
				el.removeEventListener(EVENT, this.handler);
			}

			this.handler = this.eventHandler(function (ev) {
				if (ev.keyCode === ESCAPE_KEY) {
					value.apply(this, arguments);
				}
			});

			el.addEventListener(EVENT, this.handler);
		}
	};
})(rivets);
