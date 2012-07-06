/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function () {
	"use strict";

	/**
	 * Returns an identifier function that uses the supplied
	 * propName as the item's identifier.
	 */
	return function(propName) {

		return function(item) {
			return item && item[propName];
		}

	};

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(); }
));