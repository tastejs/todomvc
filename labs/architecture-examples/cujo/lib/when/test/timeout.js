(function(buster, when, timeout) {

var assert = buster.assert;

function FakePromise() {
	this.then = function() {
		return this;
	}
}

buster.testCase('when/timeout', {
	'should reject after timeout': function(done) {
		timeout(new FakePromise(), 0).then(
			function() {
				buster.fail();
				done();
			},
			function(e) {
				assert(e instanceof Error);
				done();
			}
		);
	},

	'should not timeout when rejected before timeout': function(done) {
		var d = when.defer();
		d.reject(1);

		timeout(d, 0).then(
			function() {
				buster.fail();
				done();
			},
			function(val) {
				assert.equals(val, 1);
				done();
			}
		)
	},

	'should not timeout when forcibly resolved before timeout': function(done) {
		var d = when.defer();
		d.resolve(1);

		timeout(d, 0).then(
			function(val) {
				assert.equals(val, 1);
				done();
			},
			function() {
				buster.fail();
				done();
			}
		)
	}

});
})(
	this.buster || require('buster'),
	this.when || require('..'),
	this.when_timeout || require('../timeout')
);
