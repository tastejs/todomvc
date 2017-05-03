/**
 * async plugin for AMD loaders
 *
 * (c) copyright 2011-2012 Brian Cavalier and John Hann
 *
 * poly is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */

define(function () {


	return {
		load: function (def, require, onload, config) {

			function success (module) {
				// check for curl.js's promise
				onload.resolve ? onload.resolve(module) : onload(module);
			}

			function fail (ex) {
				// check for curl.js's promise
				if (onload.reject) {
					onload.reject(ex)
				}
				else {
					throw ex;
				}
			}

			// load module. wait for it if it returned a promise
			require([def], function (module) {
				if (module && typeof module.then == 'function') {
					module.then(success, fail);
				}
				else {
					success(module);
				}

			});

		}
	};

});
