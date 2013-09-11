/** @license MIT License (c) copyright 2010-2013 original author or authors */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author: Brian Cavalier
 * @author: John Hann
 */

(function(define) { 'use strict';
define(function(require) {

	var when;

	when = require('when');

	// Very simple advice functions for internal wire use only.
	// This is NOT a replacement for meld.  These advices stack
	// differently and will not be as efficient.
	return {
		after: after,
		beforeAsync: beforeAsync,
		afterAsync: afterAsync
	};

	/**
	 * Execute advice after f, passing f's return value to advice
	 * @param {function} f function to advise
	 * @param {function} advice function to execute after f
	 * @returns {function} advised function
	 */
	function after(f, advice) {
		return function() {
			return advice.call(this, f.apply(this, arguments));
		}
	}

	/**
	 * Execute f after a promise returned by advice fulfills. The same args
	 * will be passed to both advice and f.
	 * @param {function} f function to advise
	 * @param {function} advice function to execute before f
	 * @returns {function} advised function which always returns a promise
	 */
	function beforeAsync(f, advice) {
		return function() {
			var self, args;

			self = this;
			args = arguments;

			return when(args, function() {
				return advice.apply(self, args);
			}).then(function() {
				return f.apply(self, args);
			});
		}
	}

	/**
	 * Execute advice after a promise returned by f fulfills. The same args
	 * will be passed to both advice and f.
	 * @param {function} f function to advise
	 * @param {function} advice function to execute after f
	 * @returns {function} advised function which always returns a promise
	 */
	function afterAsync(f, advice) {
		return function() {
			var self = this;

			return when(arguments, function(args) {
				return f.apply(self, args);
			}).then(function(result) {
				return advice.call(self, result);
			});
		}
	}


});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
