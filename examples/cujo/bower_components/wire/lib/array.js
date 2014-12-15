/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
define(function() {


	var slice = [].slice;

	return {
		delegate: delegateArray,
		fromArguments: fromArguments,
		union: union
	};

	/**
	 * Creates a new {Array} with the same contents as array
	 * @param array {Array}
	 * @return {Array} a new {Array} with the same contents as array. If array is falsey,
	 *  returns a new empty {Array}
	 */
	function delegateArray(array) {
		return array ? [].concat(array) : [];
	}

	function fromArguments(args, index) {
		return slice.call(args, index||0);
	}

	/**
	 * Returns a new set that is the union of the two supplied sets
	 * @param {Array} a1 set
	 * @param {Array} a2 set
	 * @returns {Array} union of a1 and a2
	 */
	function union(a1, a2) {
		// If either is empty, return the other
		if(!a1.length) {
			return a2.slice();
		} else if(!a2.length) {
			return a1.slice();
		}

		return a2.reduce(function(union, a2item) {
			if(union.indexOf(a2item) === -1) {
				union.push(a2item);
			}
			return union;
		}, a1.slice());
	}

});
})(typeof define == 'function'
	// AMD
	? define
	// CommonJS
	: function(factory) { module.exports = factory(); }
);