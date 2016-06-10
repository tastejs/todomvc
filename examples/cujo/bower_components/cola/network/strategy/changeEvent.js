(function (define) {
define(function () {
	"use strict";

	var beforeEvents, afterEvents;

	beforeEvents = {
		sync: 1
	};
	afterEvents = {
		add: 1,
		update: 1,
		remove: 1
	};

	/**
	 * Trigger a change event as a result of other events.
	 * @return {Function} a network strategy function.
	 */
	return function configure () {

		return function queueChange (source, dest, data, type, api) {
			if (api.isBefore() && beforeEvents[type]
				|| api.isAfter() && afterEvents[type]) {
				api.queueEvent(source, data, 'change');
			}
		};

	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));