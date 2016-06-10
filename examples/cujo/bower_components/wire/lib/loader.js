/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Loading and merging modules
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author: brian@hovercraftstudios.com
 */
(function(define) { 'use strict';
define(function(require) {

	var when, mixin, wrapPlatformLoader;

	when = require('when');
	mixin = require('./object').mixin;

	// Get the platform's loader
	wrapPlatformLoader = typeof exports == 'object'
		? function(require) {
			return function(moduleId) {
				try {
					return when.resolve(require(moduleId));
				} catch(e) {
					return when.reject(e);
				}
			};
		}
		: function (require) {
			return function(moduleId) {
				var deferred = when.defer();
				require([moduleId], deferred.resolve, deferred.reject);
				return deferred.promise;
			};
		};

	return getModuleLoader;

	/**
	 * Create a module loader
	 * @param {function} [platformLoader] platform require function with which
	 *  to configure the module loader
	 * @param {function} [parentLoader] existing module loader from which
	 *  the new module loader will inherit, if provided.
	 * @return {Object} module loader with load() and merge() methods
	 */
	function getModuleLoader(platformLoader, parentLoader) {
		var loadModule = typeof platformLoader == 'function'
			? wrapPlatformLoader(platformLoader)
			: parentLoader || wrapPlatformLoader(require);

		return {
			load: loadModule,
			merge: function(specs) {
				return when(specs, function(specs) {
					return when.resolve(Array.isArray(specs)
						? mergeAll(specs, loadModule)
						: (typeof specs === 'string' ? loadModule(specs) : specs));
				});
			}
		};
	}

	function mergeAll(specs, loadModule) {
		return when.reduce(specs, function(merged, module) {
			return typeof module == 'string'
				? when(loadModule(module), function(spec) { return mixin(merged, spec); })
				: mixin(merged, module);
		}, {});
	}

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
