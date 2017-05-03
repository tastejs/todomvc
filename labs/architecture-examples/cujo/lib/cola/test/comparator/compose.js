(function(buster, require) {

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

var compose = require('../../comparator/compose');

function lt() { return -1; }
function gt() { return 1; }
function eq() { return 0; }

buster.testCase('comparator/compose', {

	'should return equality for equal items': function() {
		assert.equals(compose(eq, eq)(), 0);
	},

	'should return -1 for nested less': function() {
		assert.equals(compose(eq, lt)(), -1);
	},

	'should return 1 for nested less': function() {
		assert.equals(compose(eq, gt)(), 1);
	},

	'should throw if no comparators provided': function() {
		assert.exception(compose);
	}

});

})(require('buster'), require);
