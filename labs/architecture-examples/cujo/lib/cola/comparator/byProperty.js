/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function (require) {
	"use strict";

	var naturalOrder = require('./naturalOrder');

	return function(propName, comparator) {
		if(!comparator) comparator = naturalOrder;

		return function(a, b) {
			return comparator(a[propName], b[propName]);
		};
	};

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); }
));