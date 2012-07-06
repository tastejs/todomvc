/** MIT License (c) copyright B Cavalier & J Hann */


// TODO:
// 1. Incrementally recompute the join for items added to or removed from the
//    primary adapter.  This requires precomputing and hanging onto the joinMap
// 2. Recompute the join when items are added to or removed from the supplimental

(function(define) {
define(function (require) {

"use strict";

	var when, methodsToReplace;

	when = require('when');

	methodsToReplace = {
		add: 1,
		update: 1,
		remove: 1,
		clear: 1
	};

	/**
	 * Decorates the supplied primary adapter so that it will provide
	 * data that is joined from a secondary source specified in options.joinWith
	 * using the join strategy specified in options.strategy
	 *
	 * @param primary {Object} primary adapter
	 * @param options.joinWith {Object} secondary adapter
	 * @param options.strategy {Function} join strategy to use in joining
	 *  data from the primary and secondary adapters
	 */
	return function makeJoined(primary, options) {

		if(!(options && options.joinWith && options.strategy)) {
			throw new Error('options.joinWith and options.strategy are required');
		}

		var forEachOrig, joined, methodName, secondary, joinStrategy, primaryProxy;

		secondary = options.joinWith;
		joinStrategy = options.strategy;

		function replaceMethod(adapter, methodName) {
			var orig = adapter[methodName];

			adapter[methodName] = function() {
				// Force the join to be recomputed when data changes
				// This is way too aggressive, but also very safe.
				// We can optimize to incrementally recompute if it
				// becomes a problem.
				joined = null;
				return orig.apply(adapter, arguments);
			}
		}

		// Replace the primary adapters cola event methods
		for(methodName in methodsToReplace) {
			replaceMethod(primary, methodName);
		}

		// Create a proxy adapter that has a forEach that provides
		// access to the primary adapter's *original* data.  We must
		// send this to the join strategy since we're *replacing* the
		// primary adapter's forEach with one that calls the joinStrategy.
		// That would lead to an infinite call cycle.
		forEachOrig = primary.forEach;
		primaryProxy = {
			forEach: function() {
				return forEachOrig.apply(primary, arguments);
			}
		};

		primary.forEach = function(lambda) {
			if(!joined) {
				joined = joinStrategy(primaryProxy, secondary);
			}

			return when(joined, function(joined) {
				for(var i = 0, len = joined.length; i < len; i++) {
					lambda(joined[i]);
				}
			});
		};

		return primary;
	};

});
})(
	typeof define == 'function'
		? define
		: function(factory) { module.exports = factory(require); }
);
