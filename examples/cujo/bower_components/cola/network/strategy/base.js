(function (define) {
define(function () {

	/**
	 * Creates a base strategy function.  If no earlier strategy cancels
	 * the event, this strategy will apply it to the destination adapter.
	 * @param options {Object} not currently used
	 * @return {Function} a network strategy function
	 */
	return function (options) {

		return function baseStrategy (source, dest, data, type, api) {
			if (api.isPropagating() && type in dest) {
				if (api.isHandled()) return;
				if (typeof dest[type] != 'function') {
					throw new Error('baseStrategy: ' + type + ' is not a function.');
				}
				return dest[type](data);
			}
		};

	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));