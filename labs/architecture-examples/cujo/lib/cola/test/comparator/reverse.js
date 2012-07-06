(function(buster, require) {

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

var reverse = require('../../comparator/reverse');

function compare(a, b) {
	return a - b;
}

buster.testCase('comparator/reverse', {

	'should return equality for equal items': function() {
		assert.equals(reverse(compare)(1, 1), 0);
	},

	'should return -1 for nested less': function() {
		assert.equals(reverse(compare)(1, 0), -1);
	},

	'should return 1 for nested less': function() {
		assert.equals(reverse(compare)(0, 1), 1);
	},

	'should throw if no comparators provided': function() {
		assert.exception(reverse);
	}

});

})(require('buster'), require);
