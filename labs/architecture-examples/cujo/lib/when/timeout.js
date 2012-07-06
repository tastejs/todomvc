/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * timeout.js
 *
 * Helper that returns a promise that rejects after a specified timeout,
 * if not explicitly resolved or rejected before that.
 *
 * @author brian@hovercraftstudios.com
 */

(function(define) {
define(['./when'], function(when) {

    var undef;

    /**
     * Returns a new promise that will automatically reject after msec if
     * the supplied promise doesn't resolve or reject before that.
     *
     * Usage:
     *
     * var d = when.defer();
     * // Setup d however you need
     *
     * // return a new promise that will timeout if we don't resolve/reject first
     * return timeout(d, 1000);
     *
     * @param promise anything - any promise or value that should trigger
     *  the returned promise to resolve or reject before the msec timeout
     * @param msec {Number} timeout in milliseconds
     *
     * @returns {Promise}
     */
    return function timeout(promise, msec) {
        var deferred, timeout;

        deferred = when.defer();

        timeout = setTimeout(function onTimeout() {
            timeout && deferred.reject(new Error('timed out'));
        }, msec);

        function cancelTimeout() {
            clearTimeout(timeout);
            timeout = undef;
        }

        when(promise, deferred.resolve, deferred.reject);

        return deferred.then(
			function(value) {
				cancelTimeout();
				return value;
			},
			function(reason) {
				cancelTimeout();
				throw reason;
			}
		);
    };

});
})(typeof define == 'function'
    ? define
    : function (deps, factory) { typeof module != 'undefined'
        ? (module.exports = factory(require('./when')))
        : (this.when_timeout = factory(this.when));
    }
    // Boilerplate for AMD, Node, and browser global
);


