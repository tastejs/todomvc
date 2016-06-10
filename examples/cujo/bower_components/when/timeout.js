/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * timeout.js
 *
 * Helper that returns a promise that rejects after a specified timeout,
 * if not explicitly resolved or rejected before that.
 *
 * @author Brian Cavalier
 * @author John Hann
 */

(function(define) {
define(function(require) {
	/*global vertx,setTimeout,clearTimeout*/
    var when, setTimer, cancelTimer;

	when = require('./when');

	if(typeof vertx === 'object') {
		setTimer = function (f, ms) { return vertx.setTimer(ms, f); };
		cancelTimer = vertx.cancelTimer;
	} else {
		setTimer = setTimeout;
		cancelTimer = clearTimeout;
	}

    /**
     * Returns a new promise that will automatically reject after msec if
     * the supplied promise doesn't resolve or reject before that.
     *
	 * @param {number} msec timeout in milliseconds
     * @param {*} trigger - any promise or value that should trigger the
	 * returned promise to resolve or reject before the msec timeout
     * @returns {Promise}
     */
    return function timeout(msec, trigger) {
        var timeoutRef, rejectTimeout;

		// Support reversed, deprecated argument ordering
		if(typeof trigger === 'number') {
			var tmp = trigger;
			trigger = msec;
			msec = tmp;
		}

		timeoutRef = setTimer(function onTimeout() {
            rejectTimeout(new Error('timed out after ' + msec + 'ms'));
        }, msec);

		return when.promise(function(resolve, reject, notify) {
			rejectTimeout = reject; // capture, tricky

			when(trigger,
				function onFulfill(value) {
					cancelTimer(timeoutRef);
					resolve(value);
				},
				function onReject(reason) {
					cancelTimer(timeoutRef);
					reject(reason);
				},
				notify
			);
		});
    };
});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);
