/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * Simple memoization aspect
 *
 * @author Brian Cavalier
 * @author John Hann
 */
(function(define) {
define(function(require) {

	var createCacheAspect = require('./cache');

	function SimpleCache() {
		this._cache = {};
	}

	SimpleCache.prototype = {
		has: function(key) { return key in this._cache; },
		get: function(key) { return this._cache[key]; },
		set: function(key, value) { this._cache[key] = value; }
	};

	/**
	 * Creates a simple memoizing aspect that can be used to memoize
	 * a function or method.
	 * @param {function} [keyGenerator] creates a hash key given an array. Used to generate
	 *  memo cache keys from function invocation arguments
	 * @return {object} memoizing aspect that can be added with meld.add
	 */
	return function(keyGenerator) {
		return createCacheAspect(new SimpleCache(), keyGenerator);
	};

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
