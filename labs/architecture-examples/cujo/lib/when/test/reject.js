(function(buster, when) {

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

buster.testCase('when.reject', {

	'should reject an immediate value': function(done) {
		var expected = 123;

		when.reject(expected).then(
			fail,
			function(value) {
				assert.equals(value, expected);
			}
		).then(done, done);
	},

	'should reject a resolved promise': function(done) {
		var expected, d;

		expected = 123;
		d = when.defer();
		d.resolve(expected);

		when.reject(d.promise).then(
			fail,
			function(value) {
				assert.equals(value, expected);
			}
		).then(done, done);
	},

	'should reject a rejected promise': function(done) {
		var expected, d;

		expected = 123;
		d = when.defer();
		d.reject(expected);

		when.reject(d.promise).then(
			fail,
			function(value) {
				assert.equals(value, expected);
			}
		).then(done, done);
	}



});

})(
	this.buster || require('buster'),
	this.when || require('../when')
);
