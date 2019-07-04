/** @license MIT License (c) copyright 2012-2013 original author or authors */

/**
 * poll.js
 *
 * Helper that polls until cancelled or for a condition to become true.
 *
 * @author Scott Andrews
 */

(function (define) {
'use strict';
define(function(require) {

	var when, cancelable, delay, fn, undef;

	when = require('./when');
	cancelable = require('./cancelable');
	delay = require('./delay');
	fn = require('./function');

	/**
	 * Periodically execute the work function on the msec delay. The result of
	 * the work may be verified by watching for a condition to become true. The
	 * returned deferred is cancellable if the polling needs to be cancelled
	 * externally before reaching a resolved state.
	 *
	 * The next vote is scheduled after the results of the current vote are
	 * verified and rejected.
	 *
	 * Polling may be terminated by the verifier returning a truthy value,
	 * invoking cancel() on the returned promise, or the work function returning
	 * a rejected promise.
	 *
	 * Usage:
	 *
	 * var count = 0;
	 * function doSomething() { return count++ }
	 *
	 * // poll until cancelled
	 * var p = poll(doSomething, 1000);
	 * ...
	 * p.cancel();
	 *
	 * // poll until condition is met
	 * poll(doSomething, 1000, function(result) { return result > 10 })
	 *     .then(function(result) { assert result == 10 });
	 *
	 * // delay first vote
	 * poll(doSomething, 1000, anyFunc, true);
	 *
	 * @param work {Function} function that is executed after every timeout
	 * @param interval {number|Function} timeout in milliseconds
	 * @param [verifier] {Function} function to evaluate the result of the vote.
	 *     May return a {Promise} or a {Boolean}. Rejecting the promise or a
	 *     falsey value will schedule the next vote.
	 * @param [delayInitialWork] {boolean} if truthy, the first vote is scheduled
	 *     instead of immediate
	 *
	 * @returns {Promise}
	 */
	return function poll(work, interval, verifier, delayInitialWork) {
		var deferred, canceled, reject;

		canceled = false;
		deferred = cancelable(when.defer(), function () { canceled = true; });
		reject = deferred.reject;

		verifier = verifier || function () { return false; };

		if (typeof interval !== 'function') {
			interval = (function (interval) {
				return function () { return delay(interval); };
			})(interval);
		}

		function certify(result) {
			deferred.resolve(result);
		}

		function schedule(result) {
			fn.apply(interval).then(vote, reject);
			if (result !== undef) {
				deferred.notify(result);
			}
		}

		function vote() {
			if (canceled) { return; }
			when(work(),
				function (result) {
					when(verifier(result),
						function (verification) {
							return verification ? certify(result) : schedule(result);
						},
						function () { schedule(result); }
					);
				},
				reject
			);
		}

		if (delayInitialWork) {
			schedule();
		}
		else {
			// if work() is blocking, vote will also block
			vote();
		}

		// make the promise cancelable
		deferred.promise = beget(deferred.promise);
		deferred.promise.cancel = deferred.cancel;

		return deferred.promise;
	};

	function F() {}

	function beget(p) {
		F.prototype = p;
		var newPromise = new F();
		F.prototype = null;
		return newPromise;
	}

});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);
