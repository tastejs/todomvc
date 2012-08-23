/** MIT License (c) copyright B Cavalier & J Hann */

/**
 * curl async! plugin
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */
/*
	async plugin takes another module as it's resource and defers callback
	until that module is complete.  the module must return a promise-like
	object (i.e. has a then method). usage:

	// module that depends upon a deferred (async) resource:
	define(['async!deferredResource'], function (deferredResource) {
		// use deferredResource
	});

	// deferredResource:
	define(function () {
		var resolved, queue, undef;
		queue = [];
		function fetchResource () {
			// go get the resource and call loaded when done
		}
		function loaded (resource) {
			var callback;
			resolved = resource;
			while ((callback = queue.pop()) callback(resolved);
		}
		return {
			then: function (callback, errback) {
				if (resolved != undef) callback(resolved); else queue.push(callback);
			}
		};
	});

*/
define(/*=='async',==*/ function () {

	return {

		'load': function (resourceId, require, callback, config) {

			function resolved (resource) {
				// return the resource to the callback
				if (typeof callback.resolve == 'function') {
					// promise-like callback
					callback.resolve(resource);
				}
				else {
					// just a function
					callback(resource);
				}
			}

			function rejected (error) {
				// report that an error happened
				if (typeof callback.reject == 'function') {
					// promise-like callback
					callback.reject(error);
				}
				// no way to report errors if the callback is not a promise
			}

			// go get the module in the standard way
			require([resourceId], function (module) {

				if (typeof module.then == 'function') {
					// promise-like module
					module.then(
						function (resource) {
							if (arguments.length == 0) resource = module;
							resolved(resource);
						},
						rejected
					);
				}
				else {
					// just a callback
					resolved(module);
				}
			});
		},

		// for cram's analyze phase
		'analyze': function (resourceId, api, addDep) {
			addDep(resourceId);
		}

	}

});
