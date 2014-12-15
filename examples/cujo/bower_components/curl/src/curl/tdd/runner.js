/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

/**
 * curl createContext module
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */

define(['curl', 'curl/_privileged', './undefine'], function (curl, priv, undefine) {
"use strict";

	var Promise, runQueue, undef;

	Promise = priv['Promise'];

	/**
	 * Creates an objet with a "run" function and an "undefine" function.
	 * The run function accepts a "testing" function that can be
	 * used to test asynchronous modules.  (Note: curl.js doesn't
	 * supply or advocate any particular testing framework.) If provided,
	 * the "setup" and "teardown" functions will execute immediately before
	 * and after the testing function.
	 *
	 * The setup function is provided a `require` function as its first
	 * parameter.  The setup function may be used to
	 * `define` or `require` any mock or stub modules that the developer
	 * deems necessary to isolate the functionality of the module being
	 * tested. Mocks or stubs may also be created in the testing function.
	 * However, sync `require` behavior (R-value require) is not supported
	 * inside the testing function.  (Note: async require *is* supported
	 * inside the module being tested!)
	 *
	 * If the setup function needs to perform async operations, it must
	 * supply a second `done` parameter and call it when it is done
	 * performaing async tasks.  This callback also has a promise-like
	 * interface for developers who prefer to work with promises.  If this
	 * parameter is not supplied by the developer, the setup function is
	 * assumed to be synchronous.
	 *
	 * Note: if any modules (or plugin-based resources) are fetched using
	 * the `require` supplied to the setup, testing, or teardown functions,
	 * the functions will wait for the required modules/resources to
	 * resolve before proceeding.  In summary: the developer does *not*
	 * need to provide the `done` parameter if using the provided `require`.
	 *
	 * There can be several testing functions.  Each one should be passed
	 * individually to the run function.
	 *
	 * The teardown function can be used to clean up any resources used
	 * in the setup or testing functions. Any modules/resources created
	 * by the supplied `require` or the standard `define` are cleaned up
	 * automatically.  So, in general, you should only need to supply a
	 * teardown function if your code creates non-AMD resources.
	 *
	 * The testing functions and the teardown function take the same
	 * parameters as the setup function.  Be sure to supply and call the
	 * second `done` parameter if these functions perform async tasks.
	 *
	 * All functions may run async. Your testing must be able to handle
	 * async tests or it wil likely fail.
	 *
	 * Each of the testing functions is run in isolation from the others
	 * (and in isolation from any other testing functions created by other
	 * invocations of the runner function). Actually, the functions are
	 * sequenced temporally so they don't execute at the same time.  In
	 * addition, at the end of each function's execution, it will restore
	 * curl.js's cache back to the state it was before execution, so each
	 * function can be assured it has a clean environment.
	 *
	 * The undefine function can be used to explicitly undefine a
	 * module or resource inside a testing function (or anywhere else).
	 *
	 * Promises returned by curl.js or this runner module are *not*
	 * compliant to the CommonJS Promises/A standard.  Use a library
	 * such as when.js (http://github.com/cujojs/when) to create compliant
	 * promises.  See example 2.
	 *
	 * @param [require] {Function}
	 * @param [setup] {isolatedFunction} if defined, this
	 *   function will be run immediately before the returned function.
	 * @param [teardown] {isolatedFunction} if defined, this
	 *   function will be run immediately after the returned function.
	 * @returns {Object}
	 * @returns {Object.run} function run (testFunc, callback) {}
	 * @returns {Object.undefine} function run (idOrArray) {}
	 *
	 * @example 1
	 *
	 * 	define(['curl/tdd/runner', 'require'], function (runner, require) {
	 * 		var r1;
	 *
	 * 		// no need for `done` callback if using supplied `require`.
	 * 		function setup (require) {
	 * 			var xhrResult = [{ foo: 'bar' }];
	 * 			// load and configure some mocks
	 * 			require(['mocks/xhr', 'mocks/rpc'], function (xhr, rpc) {
	 * 				define('my/xhr', xhr.config(xhrResult));
	 * 				define('my/rpc', rpc.config(xhr));
	 * 			});
	 * 			// define any other resources
	 * 			define('my/transform', function () {
	 * 				return function (val) { return val; };
	 * 			});
	 * 		}
	 *
	 * 		// configure runner.
	 * 		// (no need for teardown since mocks were created using supplied
	 * 		// `require` and standard `define`)
	 * 		r1 = runner(require, setup);
	 *
	 * 		// queue a testing function to be run.
	 * 		// setup will be run beforehand and all modules will be
	 * 		// cleaned up automatically.
	 * 		r1.run(function (require) {
	 *			require(['my/module1-to-test'], function (m1) {
	 *				// perform assertions here
	 *			});
	 * 		});
	 *
	 * 		// queue another testing function to be run.
	 * 		// setup will be run beforehand and all modules will be
	 * 		// cleaned up automatically.
	 * 		r1.run(function (require) {
	 * 			define('my/other-data-to-test-with', { name: 'Fred' });
	 *			require(['my/module2-to-test'], function (m2) {
	 *				// perform assertions here
	 *			});
	 * 		});
	 * 	});
	 *
	 * @example 2
	 *
	 * 	define(['curl/tdd/runner', 'require', 'when'], function (runner, require, when) {
	 * 		// convert a returned promise to a Promises/A promise using when.js
	 * 		var cjsPromise = when(r1.run(null, function () {
	 * 			// do tests here
	 * 		});
	 * 	});
	 *
	 */
	return function runner (require, setup, teardown) {
		var promise;

		if (!require) require = curl;

		function run (testFunc) {
			var cacheSnapshot, callback;

			callback = arguments[1];

			// enqueue cache snapshot
			enqueue(function _copyCache () {
				cacheSnapshot = copyCache(priv['cache']);
			});

			// enqueue setup
			if (setup) enqueue(waitForAsyncTasks(setup, require));

			// enqueue testFunc
			enqueue(waitForAsyncTasks(testFunc, require));

			// enqueue teardown
			if (teardown) enqueue(waitForAsyncTasks(teardown, require));

			promise = new Promise();

			// enqueue cache restore and a hook for outside code
			enqueue(function _restoreCache () {
				restoreCache(priv['cache'], cacheSnapshot);
				if (callback) callback();
				promise.resolve();
			});

			return promise;

		}

		return {
			run: run,
			undefine: undefine
		};

	};

	/**
	 * The signature of the functions supplied to runner.
	 * @param require {Function} standard AMD `require`
	 * @param [done] {Function|Promise} if included in the function
	 *   parameters, this callback must be called when all async tasks
	 *   are completed.  This function has a promise-like interface,
	 *   including `done.resolve(val)` and  `done.reject(ex)` for
	 *   those who would rather use promises.
	 */
	function isolatedFunction (require) {}

	/**
	 * Enqueues a function that provides a promise.
	 * @private
	 * @param promiseProvider {Function} must return a promise if it
	 *   has async tasks.
	 */
	function enqueue (promiseProvider) {
		var next;

		function dequeue () {
			when(promiseProvider(), next.resolve, next.reject);
		}

		next = new Promise();
		when(runQueue, dequeue, runQueue && runQueue.reject);
		runQueue = next;
	}

	/**
	 * Waits for async require calls and/or done.
	 * @private
	 * @param func {Function}
	 *   standard signature is `function (require, [done]) {}`
	 */
	function waitForAsyncTasks (func, require) {
		var promise, otherAsyncDone, requiresDone, trackedRequire;

		promise = new Promise();
		otherAsyncDone = new Promise();
		requiresDone = new Promise();
		trackedRequire = createTrackedRequire(require, requiresDone.resolve);

		// last param is `done`
		if (func.length > 1) {
			// turn otherAsyncDone into a dual callback/promise thingy
			otherAsyncDone = (function (promise) {
				var dual = promise.resolve;
				dual.resolve = promise.resolve;
				dual.reject = promise.reject;
				dual.then = promise.then;
				return dual;
			}(otherAsyncDone));
		}
		else {
			// pre-resolve
			otherAsyncDone.resolve();
		}

		// wait for promises
		requiresDone.then(function _otherAsyncDone () {
			otherAsyncDone.then(promise.resolve, promise.reject);
		});

		// return a queueable function
		return function _waitForAsyncTasks () {

			// call function
			func(trackedRequire, otherAsyncDone);

			// check if there were no async `require` calls
			if (trackedRequire.notAsync()) {
				requiresDone.resolve();
			}

			// return promise
			return promise;
		};
	}

	function createTrackedRequire (require, modulesAllFetched) {
		var callCount = 0;

		function trackedRequire (idOrArray, callback) {
			var cb;

			callCount++;

			cb = function () {
				callback.apply(this, arguments);
				// if this is the last require
				if (--callCount == 0) modulesAllFetched();
			};

			return require(idOrArray, cb);
		}

		// preserve AMD API
		trackedRequire.toUrl = require.toUrl;
		// helpful
		trackedRequire.notAsync = function () { return callCount == 0; };

		return trackedRequire;
	}

	function copyCache (cache) {
		var copy = {};
		for (var p in cache) {
			copy[p] = cache[p];
		}
		return copy;
	}

	function restoreCache (cache, copy) {
		for (var p in cache) {
			if (!(p in copy)) {
				undefine(p);
			}
		}
	}

	function when (promiseOrValue, callback, errback, progback) {
		// we can't just sniff for then(). if we do, resources that have a
		// then() method will make dependencies wait!
		if (promiseOrValue && typeof promiseOrValue.then == 'function') {
			return promiseOrValue.then(callback, errback, progback);
		}
		else {
			return callback(promiseOrValue);
		}
	}

});
