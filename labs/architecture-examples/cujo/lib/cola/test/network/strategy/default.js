(function (buster, require) {

var assert, refute, undef;

assert = buster.assert;
refute = buster.refute;

var def = require('../../../network/strategy/default');

buster.testCase('cola/network/strategy/default', {

	'should return function': function () {
		assert.isFunction(def([]));
	},
	'// should have more tests': function () {
		assert(false);
	}

});
})( require('buster'), require );
