/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function () {
	"use strict";

	/**
	 * Creates a projection function that will assign obj2 to a property
	 * of obj1.  For example, if propName is "foo", then this returns a
	 * projection function that will behave like
	 *
	 * function(obj1, obj2) { obj1['foo'] = obj2; }
	 *
	 * @param propName {String} name of obj1 property to which to assign obj2
	 * @return obj1
	 */
	return function(propName) {
		return function(obj1, obj2) {
			if(obj1) {
				obj1[propName] = obj2;
			}

			return obj1;
		};
	};

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(); }
));