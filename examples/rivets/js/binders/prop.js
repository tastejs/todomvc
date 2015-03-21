(function (rivets) {
	'use strict';

	rivets.binders['prop-*'] = function(el, value) {
		el[this.args[0]] = value
	};
})(rivets);
