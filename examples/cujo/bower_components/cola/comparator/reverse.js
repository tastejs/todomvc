/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){
define(function() {
"use strict";

	/**
	 * Creates a comparator function that compares items in the reverse
	 * order of the supplied comparator.
	 *
	 * @param comparator {Function} original comparator function to reverse
	 */
	return function reverse(comparator) {
		if(typeof comparator != 'function') throw new Error('comparator/reverse: input comparator must be provided');

		return function(a, b) {
			return comparator(b, a);
		};
	};

});
})(
	typeof define == 'function'
		? define
		: function(factory) { module.exports = factory(); }
);
