/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * Generalized promise concurrency guard
 * Adapted from original concept by Sakari Jokinen (Rocket Pack, Ltd.)
 *
 * @author Brian Cavalier
 * @author John Hann
 * @contributor Sakari Jokinen
 */
(function(define) {
define(function(require) {

	var when = require('./when');

	guard.n = n;

	return guard;

	/**
	 * Creates a guarded version of f that can only be entered when the supplied
	 * condition allows.
	 * @param {function} condition represents a critical section that may only
	 *  be entered when allowed by the condition
	 * @param {function} f function to guard
	 * @returns {function} guarded version of f
	 */
	function guard(condition, f) {
		return function() {
			var self, args;

			self = this;
			args = arguments;

			return when(condition(), function(exit) {
				return when(f.apply(self, args)).ensure(exit);
			});
		};
	}

	/**
	 * Creates a condition that allows only n simultaneous executions
	 * of a guarded function
	 * @param {number} allowed number of allowed simultaneous executions
	 * @returns {function} condition function which returns a promise that
	 *  fulfills when the critical section may be entered.  The fulfillment
	 *  value is a function ("notifyExit") that must be called when the critical
	 *  section has been exited.
	 */
	function n(allowed) {
		var count, waiting;

		count = 0;
		waiting = [];

		return function enter() {
			return when.promise(function(resolve) {
				if(count < allowed) {
					resolve(exit);
				} else {
					waiting.push(resolve);
				}
				count += 1;

				function exit() {
					count = Math.max(count - 1, 0);
					if(waiting.length) {
						waiting.shift()(exit);
					}
				}
			});
		};
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
