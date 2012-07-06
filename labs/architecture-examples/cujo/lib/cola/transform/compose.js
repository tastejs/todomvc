/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function () {
"use strict";

	var concat, slice, undef;

	concat = Array.prototype.concat;
	slice  = Array.prototype.slice;

	function identity(it) {
		return it;
	}

	identity.inverse = identity;
	identity.inverse.inverse = identity;

	/**
	 * Creates a transform function by composing the supplied transform
	 * functions.  If all the supplied transform functions have an inverse,
	 * the returned function will also have an inverse created by composing
	 * the inverses.
	 *
	 * @param transforms... {Array|Function} Array of functions, or varargs
	 * list of functions.
	 *
	 * @returns {Function} composed function, with composed inverse if
	 * all supplied transforms also have an inverse
	 */
	return function(transforms) {
		var composed, txList, inverses;

		if(arguments.length == 0) return identity;

		// Flatten arguments list to a single dimensional array
		txList = concat.apply([], slice.call(arguments));

		composed = function() {
			var args = slice.call(arguments);

			for(var i = 0, len = txList.length; i < len; i++) {
				args[0] = txList[i].apply(undef, args);
			}

			return args[0];
		};

		// If all transforms have inverses, we can also compose
		// an inverse transform
		inverses = collectInverses(txList);

		if(inverses.length) {
			composed.inverse = function() {
				var args = slice.call(arguments);

				for(var i = inverses.length - 1; i >= 0; --i) {
					args[0] = inverses[i].apply(undef, args);
				}

				return args[0];
			};

			composed.inverse.inverse = composed;
		}

		return composed;
	};

	/**
	 * Collects all .inverses of the supplied transforms.
	 * @param transforms {Array} array of transforms, either *all* or *none* of
	 * which must have .inverse functions.
	 */
	function collectInverses(transforms) {
		var inverse, inverses;

		inverses = [];

		for(var i = 0, len = transforms.length; i < len; i++) {
			inverse = transforms[i].inverse;
			if(typeof inverse == 'function') inverses.push(inverse);
		}

		if(inverses.length > 0 && inverses.length !== transforms.length) {
			throw new Error("Either all or none of the supplied transforms must provide an inverse");
		}

		return inverses;
	}

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(); }
));
