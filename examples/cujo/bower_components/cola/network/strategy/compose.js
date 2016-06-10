(function (define) {
define(function (require) {
"use strict";

	var when = require('when');

	/**
	 * Returns a network strategy that is a composition of two or more
	 * other strategies.  The strategies are executed in the order
	 * in which they're provided.  If any strategy cancels, the remaining
	 * strategies are never executed and the cancel is sent back to the Hub.
	 *
	 * @param strategies {Array} collection of network strategies.
	 * @return {Function} a composite network strategy function
	 */
	return function composeStrategies (strategies) {
		return function (source, dest, data, type, api) {

			return when.reduce(strategies,
				function(result, strategy) {
					var strategyResult = strategy(source, dest, data, type, api);
					return api.isCanceled()
						? when.reject(strategyResult)
						: strategyResult;
				},
				data
			).then(propagateSuccess, propagateSuccess);

		}

	};

	function propagateSuccess(x) {
		return x;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));