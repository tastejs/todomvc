define(function (require, exports, module) {

	// implements add(), but delegates multiply() and subtract()
	var loop1 = require('./hybrid-loop1');
	var loop3 = require('./hybrid-loop3');
	exports.add = function (a, b) {
		return a + b;
	};
	exports.multiply = function (a, b) {
		return loop1.multiply(a, b);
	}
	exports.subtract = function (a, b) {
		return loop3.subtract(a, b);
	}

});