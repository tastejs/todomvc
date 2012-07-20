(function(buster, when, delay) {

var assert = buster.assert;

function now() {
	return (new Date()).getTime();
}

buster.testCase('when/delay', {
	'should resolve after delay': function(done) {
		delay(0).then(
			function() {
				assert(true);
				done();
			},
			function() {
				buster.fail();
				done();
			}
		);
	},

	'should resolve with provided value after delay': function(done) {
		delay(1, 0).then(
			function(val) {
				assert.equals(val, 1);
				done();
			},
			function() {
				buster.fail();
				done();
			}
		);
	},

	'should delay by the provided value': function(done) {
		var start = now();

		delay(100).then(
			function() {
				assert((now() - start) > 50);
				done();
			},
			function() {
				buster.fail();
				done();
			}
		);
	},

	'should not delay if rejected': function(done) {
		var d = when.defer();
		d.reject(1);

		delay(d.promise, 0).then(
			function() {
				buster.fail();
				done();
			},
			function(val) {
				assert.equals(val, 1);
				done();
			}
		);
	}
});
})(
	this.buster || require('buster'),
	this.when || require('..'),
	this.when_delay || require('../delay')
);
