/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * delay.js
 *
 * Helper that returns a promise that resolves after a delay.
 *
 * @author brian@hovercraftstudios.com
 */

(function(define) {
define(['./when'], function(when) {

    var undef;

    /**
     * Creates a new promise that will resolve after a msec delay.  If promise
     * is supplied, the delay will start *after* the supplied promise is resolved.
     *
     * Usage:
     * // Do something after 1 second, similar to using setTimeout
     * delay(1000).then(doSomething);
     * // or
     * when(delay(1000), doSomething);
     *
     * // Do something 1 second after triggeringPromise resolves
     * delay(triggeringPromise, 1000).then(doSomething, handleRejection);
     * // or
     * when(delay(triggeringPromise, 1000), doSomething, handleRejection);
     *
     * @param [promise] anything - any promise or value after which the delay will start
     * @param msec {Number} delay in milliseconds
     */
    return function delay(promise, msec) {
        if(arguments.length < 2) {
            msec = promise >>> 0;
            promise = undef;
        }

        return when(promise, function(val) {
            var deferred = when.defer();
            setTimeout(function() {
                deferred.resolve(val);
            }, msec);
            return deferred.promise;
        });
    };

});
})(typeof define == 'function'
    ? define
    : function (deps, factory) { typeof module != 'undefined'
        ? (module.exports = factory(require('./when')))
        : (this.when_delay = factory(this.when));
    }
    // Boilerplate for AMD, Node, and browser global
);


