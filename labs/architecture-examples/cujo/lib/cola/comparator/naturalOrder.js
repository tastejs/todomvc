/** MIT License (c) copyright B Cavalier & J Hann */

(function (define) {
define(function () {
	"use strict";

	return function(a, b) {
		return a == b ? 0
			: a < b ? -1
			: 1;
	};

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(); }
));