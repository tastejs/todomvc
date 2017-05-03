define(function (require, exports, module) {

	// implements multiply(), but delegates add() and subtract()
	var loop2 = require('./hybrid-loop2');
	var loop3 = require('./hybrid-loop3');
	exports.multiply = function (a, b) {
		return a * b;
	};
	exports.add = function (a, b) {
		return loop2.add(a, b);
	};
	exports.subtract = function (a, b) {
		return loop3.subtract(a, b);
	};

});