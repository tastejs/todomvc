/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * cancelable.js
 *
 * Decorator that makes a deferred "cancelable".  It adds a cancel() method that
 * will call a special cancel handler function and then reject the deferred.  The
 * cancel handler can be used to do resource cleanup, or anything else that should
 * be done before any other rejection handlers are executed.
 *
 * Usage:
 *
 * var cancelableDeferred = cancelable(when.defer(), myCancelHandler);
 *
 * @author brian@hovercraftstudios.com
 */

(function(define) {
define(function(require) {

	var when = require('./when');

    /**
     * Makes deferred cancelable, adding a cancel() method.
     *
     * @param deferred {Deferred} the {@link Deferred} to make cancelable
     * @param canceler {Function} cancel handler function to execute when this deferred
	 * is canceled.  This is guaranteed to run before all other rejection handlers.
	 * The canceler will NOT be executed if the deferred is rejected in the standard
	 * way, i.e. deferred.reject().  It ONLY executes if the deferred is canceled,
	 * i.e. deferred.cancel()
     *
     * @returns deferred, with an added cancel() method.
     */
    return function(deferred, canceler) {

        var delegate = when.defer();

        // Add a cancel method to the deferred to reject the delegate
        // with the special canceled indicator.
        deferred.cancel = function() {
            return deferred.reject(canceler(deferred));
        };

        // Ensure that the original resolve, reject, and progress all forward
        // to the delegate
        deferred.promise.then(delegate.resolve, delegate.reject, delegate.notify);

        // Replace deferred's promise with the delegate promise
        deferred.promise = delegate.promise;

        // Also replace deferred.then to allow it to be called safely and
        // observe the cancellation
		// TODO: Remove once deferred.then is removed
        deferred.then = delegate.promise.then;

        return deferred;
    };

});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);


