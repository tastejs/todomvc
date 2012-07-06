define(function (require, exports, module) {

	// implements subtract(), but delegates multiply() and add()
	var loop1 = require('./hybrid-loop1');
	var loop2 = require('./hybrid-loop2');
	exports.multiply = function (a, b) {
		return loop1.multiply(a, b);
	};
	exports.add = function (a, b) {
		return loop2.add(a, b);
	};
	exports.subtract = function (a, b) {
		return a - b;
	};

});