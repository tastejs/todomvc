(function (rivets) {
	'use strict';

	rivets.formatters.length = function (value) {
		return value.length;
	};

	rivets.formatters.eq = function (value, eqValue) {
		return value == eqValue;
	};

	rivets.formatters.append = function (value, appValue) {
		return value + appValue;
	};

	rivets.formatters.switch = function (value, tValue, fValue) {
		return value ? tValue : fValue;
	};
})(rivets);
