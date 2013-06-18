/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

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
define(/*=='curl/plugin/async',==*/ function () {

	return {

		'load': function (resourceId, require, callback, config) {

			function rejected (error) {
				// report that an error happened
				if (typeof callback.error == 'function') {
					// promise-like callback
					callback.error(error);
				}
				// no way to report errors if the callback doesn't have error()
			}

			// go get the module in the standard way
			require([resourceId], function (module) {

				if (typeof module.then == 'function') {
					// promise-like module
					module.then(
						function (resource) {
							if (arguments.length == 0) resource = module;
							callback(resource);
						},
						rejected
					);
				}
				else {
					// just a normal module
					callback(module);
				}
			}, callback['error'] || function (ex) { throw ex; });
		},

		// for cram's analyze phase
		'analyze': function (resourceId, api, addDep) {
			addDep(resourceId);
		}

	}

});
