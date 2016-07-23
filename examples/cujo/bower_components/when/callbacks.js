/** @license MIT License (c) copyright 2013 original author or authors */

/**
 * callbacks.js
 *
 * Collection of helper functions for interacting with 'traditional',
 * callback-taking functions using a promise interface.
 *
 * @author Renato Zannon <renato.riccieri@gmail.com>
 * @contributor Brian Cavalier
 */

(function(define) {
define(function(require) {

	var when, promise, slice;

	when = require('./when');
	promise = when.promise;
	slice = [].slice;

	return {
		apply: apply,
		call: call,
		lift: lift,
		bind: lift, // DEPRECATED alias for lift
		promisify: promisify
	};

	/**
	 * Takes a `traditional` callback-taking function and returns a promise for its
	 * result, accepting an optional array of arguments (that might be values or
	 * promises). It assumes that the function takes its callback and errback as
	 * the last two arguments. The resolution of the promise depends on whether the
	 * function will call its callback or its errback.
	 *
	 * @example
	 *    var domIsLoaded = callbacks.apply($);
	 *    domIsLoaded.then(function() {
	 *		doMyDomStuff();
	 *	});
	 *
	 * @example
	 *    function existingAjaxyFunction(url, callback, errback) {
	 *		// Complex logic you'd rather not change
	 *	}
	 *
	 *    var promise = callbacks.apply(existingAjaxyFunction, ["/movies.json"]);
	 *
	 *    promise.then(function(movies) {
	 *		// Work with movies
	 *	}, function(reason) {
	 *		// Handle error
	 *	});
	 *
	 * @param {function} asyncFunction function to be called
	 * @param {Array} [extraAsyncArgs] array of arguments to asyncFunction
	 * @returns {Promise} promise for the callback value of asyncFunction
	 */
	function apply(asyncFunction, extraAsyncArgs) {
		return when.all(extraAsyncArgs || []).then(function(args) {
			return promise(function(resolve, reject) {
				var asyncArgs = args.concat(
					alwaysUnary(resolve),
					alwaysUnary(reject)
				);

				asyncFunction.apply(null, asyncArgs);
			});
		});
	}

	/**
	 * Works as `callbacks.apply` does, with the difference that the arguments to
	 * the function are passed individually, instead of as an array.
	 *
	 * @example
	 *    function sumInFiveSeconds(a, b, callback) {
	 *		setTimeout(function() {
	 *			callback(a + b);
	 *		}, 5000);
	 *	}
	 *
	 *    var sumPromise = callbacks.call(sumInFiveSeconds, 5, 10);
	 *
	 *    // Logs '15' 5 seconds later
	 *    sumPromise.then(console.log);
	 *
	 * @param {function} asyncFunction function to be called
	 * @param {...*} args arguments that will be forwarded to the function
	 * @returns {Promise} promise for the callback value of asyncFunction
	 */
	function call(asyncFunction/*, arg1, arg2...*/) {
		var extraAsyncArgs = slice.call(arguments, 1);
		return apply(asyncFunction, extraAsyncArgs);
	}

	/**
	 * Takes a 'traditional' callback/errback-taking function and returns a function
	 * that returns a promise instead. The resolution/rejection of the promise
	 * depends on whether the original function will call its callback or its
	 * errback.
	 *
	 * If additional arguments are passed to the `bind` call, they will be prepended
	 * on the calls to the original function, much like `Function.prototype.bind`.
	 *
	 * The resulting function is also "promise-aware", in the sense that, if given
	 * promises as arguments, it will wait for their resolution before executing.
	 *
	 * @example
	 *    function traditionalAjax(method, url, callback, errback) {
	 *		var xhr = new XMLHttpRequest();
	 *		xhr.open(method, url);
	 *
	 *		xhr.onload = callback;
	 *		xhr.onerror = errback;
	 *
	 *		xhr.send();
	 *	}
	 *
	 *    var promiseAjax = callbacks.bind(traditionalAjax);
	 *    promiseAjax("GET", "/movies.json").then(console.log, console.error);
	 *
	 *    var promiseAjaxGet = callbacks.bind(traditionalAjax, "GET");
	 *    promiseAjaxGet("/movies.json").then(console.log, console.error);
	 *
	 * @param {Function} asyncFunction traditional function to be decorated
	 * @param {...*} [args] arguments to be prepended for the new function
	 * @returns {Function} a promise-returning function
	 */
	function lift(asyncFunction/*, args...*/) {
		var leadingArgs = slice.call(arguments, 1);

		return function() {
			var trailingArgs = slice.call(arguments, 0);
			return apply(asyncFunction, leadingArgs.concat(trailingArgs));
		};
	}

	/**
	 * `promisify` is a version of `bind` that allows fine-grained control over the
	 * arguments that passed to the underlying function. It is intended to handle
	 * functions that don't follow the common callback and errback positions.
	 *
	 * The control is done by passing an object whose 'callback' and/or 'errback'
	 * keys, whose values are the corresponding 0-based indexes of the arguments on
	 * the function. Negative values are interpreted as being relative to the end
	 * of the arguments array.
	 *
	 * If arguments are given on the call to the 'promisified' function, they are
	 * intermingled with the callback and errback. If a promise is given among them,
	 * the execution of the function will only occur after its resolution.
	 *
	 * @example
	 *    var delay = callbacks.promisify(setTimeout, {
	 *		callback: 0
	 *	});
	 *
	 *    delay(100).then(function() {
	 *		console.log("This happens 100ms afterwards");
	 *	});
	 *
	 * @example
	 *    function callbackAsLast(errback, followsStandards, callback) {
	 *		if(followsStandards) {
	 *			callback("well done!");
	 *		} else {
	 *			errback("some programmers just want to watch the world burn");
	 *		}
	 *	}
	 *
	 *    var promisified = callbacks.promisify(callbackAsLast, {
	 *		callback: -1,
	 *		errback:   0,
	 *	});
	 *
	 *    promisified(true).then(console.log, console.error);
	 *    promisified(false).then(console.log, console.error);
	 *
	 * @param {Function} asyncFunction traditional function to be decorated
	 * @param {object} positions
	 * @param {number} [positions.callback] index at which asyncFunction expects to
	 *  receive a success callback
	 * @param {number} [positions.errback] index at which asyncFunction expects to
	 *  receive an error callback
	 *  @returns {function} promisified function that accepts
	 */
	function promisify(asyncFunction, positions) {

		return function() {
			return when.all(arguments).then(function(args) {
				return promise(applyPromisified);

				function applyPromisified(resolve, reject) {
					var callbackPos, errbackPos;

					if('callback' in positions) {
						callbackPos = normalizePosition(args, positions.callback);
					}

					if('errback' in positions) {
						errbackPos = normalizePosition(args, positions.errback);
					}

					if(errbackPos < callbackPos) {
						insertCallback(args, errbackPos, reject);
						insertCallback(args, callbackPos, resolve);
					} else {
						insertCallback(args, callbackPos, resolve);
						insertCallback(args, errbackPos, reject);
					}

					asyncFunction.apply(null, args);
				}

			});
		};
	}

	function normalizePosition(args, pos) {
		return pos < 0 ? (args.length + pos + 2) : pos;
	}

	function insertCallback(args, pos, callback) {
		if(pos != null) {
			callback = alwaysUnary(callback);
			if(pos < 0) {
				pos = args.length + pos + 2;
			}
			args.splice(pos, 0, callback);
		}

	}

	function alwaysUnary(fn) {
		return function() {
			if(arguments.length <= 1) {
				fn.apply(null, arguments);
			} else {
				fn.call(null, slice.call(arguments, 0));
			}
		};
	}
});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);
