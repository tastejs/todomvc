/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * delay.js
 *
 * Helper that returns a promise that resolves after a delay.
 *
 * @author Brian Cavalier
 * @author John Hann
 */

(function(define) {
define(function(require) {
	/*global vertx,setTimeout*/
	var when, setTimer;

	when = require('./when');

	setTimer = typeof vertx === 'object'
		? function (f, ms) { return vertx.setTimer(ms, f); }
		: setTimeout;

    /**
     * Creates a new promise that will resolve after a msec delay.  If promise
     * is supplied, the delay will start *after* the supplied promise is resolved.
     *
	 * @param {number} msec delay in milliseconds
     * @param {*} [value] any promise or value after which the delay will start
	 * @returns {Promise}
     */
    return function delay(msec, value) {
		// Support reversed, deprecated argument ordering
		if(typeof value === 'number') {
			var tmp = value;
			value = msec;
			msec = tmp;
		}

		return when.promise(function(resolve, reject, notify) {
			when(value, function(val) {
				setTimer(function() {
					resolve(val);
				}, msec);
			},
			reject, notify);
		});
    };

});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
);
