(function (rivets) {
	'use strict';

	rivets.binders.focus = function(el, value) {
		if (value) el.focus();
	};
})(rivets);
