/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author Brian Cavalier
 * @author John Hann
 */
(function(define) { 'use strict';
define(function(require) {
	var when, promise, keys, eachKey, owns;

	when = require('./when');
	promise = when.promise;

	// Public API

	keys = {
		all: all,
		map: map
	};

	// Safe ownProp
	owns = {}.hasOwnProperty;

	// Use Object.keys if available, otherwise for..in
	eachKey = Object.keys
		? function(object, lambda) {
			Object.keys(object).forEach(function(key) {
				lambda(object[key], key);
			});
		}
		: function(object, lambda) {
			for(var key in object) {
				if(owns.call(object, key)) {
					lambda(object[key], key);
				}
			}
		};

	return keys;

	/**
	 * Resolve all the key-value pairs in the supplied object or promise
	 * for an object.
	 * @param {Promise|object} object or promise for object whose key-value pairs
	 *  will be resolved
	 * @returns {Promise} promise for an object with the fully resolved key-value pairs
	 */
	function all(object) {
		return map(object, identity);
	}

	/**
	 * Map values in the supplied object's keys
	 * @param {Promise|object} object or promise for object whose key-value pairs
	 *  will be reduced
	 * @param {function} mapFunc mapping function mapFunc(value) which may
	 *  return either a promise or a value
	 * @returns {Promise} promise for an object with the mapped and fully
	 *  resolved key-value pairs
	 */
	function map(object, mapFunc) {
		return when(object, function(object) {
			return promise(resolveMap);

			function resolveMap(resolve, reject, notify) {
				var results, toResolve;

				results = {};
				toResolve = 0;

				eachKey(object, function(value, key) {
					++toResolve;
					when(value, mapFunc).then(function(mapped) {
						results[key] = mapped;

						if(!--toResolve) {
							resolve(results);
						}
					}, reject, notify);
				});

				// If there are no keys, resolve immediately
				if(!toResolve) {
					resolve(results);
				}
			}
		});
	}

	function identity(x) { return x; }

});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);
