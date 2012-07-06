/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Abstract the platform's loader
 * @type {Function}
 * @param require {Function} platform-specific require
 * @return {Function}
 */
if(typeof define == 'function' && define.amd) {
	// AMD
	define(['when'], function(when) {

		return function createModuleLoader(require) {
			return function(moduleId) {
				var deferred = when.defer();
				require([moduleId], deferred.resolve, deferred.reject);
				return deferred.promise;
			};
		};

	});

} else {
	// CommonJS
	module.exports = function createModuleLoader(require) {
		return require;
	};

}
