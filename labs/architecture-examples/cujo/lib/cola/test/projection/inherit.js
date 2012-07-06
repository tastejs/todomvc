(function(buster, inherit) {
"use strict";

var assert, refute;

assert = buster.assert;
refute = buster.refute;

var input1, input2;

input1 = {
	a: 1
};

input2 = {
	b: 2
};

buster.testCase('projection/inherit', {
	'should not modify input objects': function() {
		inherit(input1, input2);

		assert.equals(input1, { a: 1 });
		assert(input1.hasOwnProperty('a'));
		assert.equals(input2, { b: 2 });
		assert(input2.hasOwnProperty('b'));
	},

	'should return a new object': function() {
		var result = inherit(input1, input2);

		refute.same(result, input1);
		refute.same(result, input2);
	},

	'should inherit properties from input1': function() {
		var result = inherit(input1, input2);

		assert.equals(result.a, input1.a);
		refute(result.hasOwnProperty('a'));
	},

	'should have own properties from input2': function() {
		var result = inherit(input1, input2);

		assert.equals(result.b, input2.b);
		assert(result.hasOwnProperty('b'));
	}
});

})(
	require('buster'),
	require('../../projection/inherit')
);