(function(buster, assign) {
"use strict";

var assert, refute;

assert = buster.assert;
refute = buster.refute;

buster.testCase('projection/assign', {
	'should assign to specified property': function() {
		var a = assign('test');

		assert.equals(a({}, 1), { test: 1 });
	},

	'should return input 1': function() {
		var a, input;

		a = assign('test');
		input = {};

		assert.same(a(input, 1), input);
	},

	'should return unmodified input 1 if input 1 is falsey': function() {
		var a, input;

		a = assign('test');

		assert.equals(a(input, 1), input);
	}
});

})(
	require('buster'),
	require('../../projection/assign')
);