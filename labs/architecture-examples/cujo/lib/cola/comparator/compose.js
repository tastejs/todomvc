/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){
define(function() {
"use strict";

	return function compose(comparators/*...*/) {
		if(!arguments.length) throw new Error('comparator/compose: No comparators provided');

		comparators = arguments;

		return function(a, b) {
			var result, len, i;

			i = 0;
			len = comparators.length;

			do {
				result = comparators[i](a, b);
			} while(result === 0 && ++i < len);

			return result;
		};
	};

});
})(
	typeof define == 'function'
		? define
		: function(factory) { module.exports = factory(); }
);
