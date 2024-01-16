/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function() {

	var hasOwn;

	hasOwn = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

	return {
		hasOwn: hasOwn,
		isObject: isObject,
		inherit: inherit,
		mixin: mixin
	};

	function isObject(it) {
		// In IE7 tos.call(null) is '[object Object]'
		// so we need to check to see if 'it' is
		// even set
		return it && Object.prototype.toString.call(it) == '[object Object]';
	}

	function inherit(parent) {
		return parent ? Object.create(parent) : {};
	}

	/**
	 * Brute force copy own properties from -> to. Effectively an
	 * ES6 Object.assign polyfill, usable with Array.prototype.reduce.
	 * @param {object} to
	 * @param {object} from
	 * @returns {object} to
	 */
	function mixin(to, from) {
		if(!from) {
			return to;
		}

		return Object.keys(from).reduce(function(to, key) {
			to[key] = from[key];
			return to;
		}, to);
	}

});
})(typeof define == 'function'
	// AMD
	? define
	// CommonJS
	: function(factory) { module.exports = factory(); }
);