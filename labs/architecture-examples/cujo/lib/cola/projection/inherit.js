/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function () {
	"use strict";

	function F() {}

	/**
	 * A projection function that returns a new object that inherits
	 * obj1's properties and has obj2's properties as it's own.  That is,
	 * it's prototype is obj1.
	 * @param obj1 {Object} Object from which to inherit, this will become the prototype
	 * @param obj2 {Object} Object whose properties will be own properties of the
	 * resulting projection
	 * @return {Object} new object with obj1 as prototype and obj2's properties mixed in
	 */
	return function(obj1, obj2) {
		F.prototype = obj1;
		obj1 = new F();

		for(var p in obj2) {
			obj1[p] = obj2[p];
		}

		F.prototype = null;

		return obj1;
	};

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(); }
));