(function(buster, when, cancelable) {

var assert = buster.assert;

buster.testCase('when/cancelable', {
	'should decorate deferred with a cancel() method': function() {
		var c = cancelable(when.defer(), function() {});
		assert(typeof c.cancel == 'function');
	},

	'should propagate a rejection when a cancelable deferred is canceled': function(done) {
		var c = cancelable(when.defer(), function() { return 1; });
		c.cancel();

		c.then(
			function() {
				buster.fail();
				done();
			},
			function(v) {
				assert.equals(v, 1);
				done();
			}
		);
	},

	'should not invoke canceler when rejected normally': function(done) {
		var c = cancelable(when.defer(), function() { return 1; });
		c.reject(2);

		c.then(
			function() {
				buster.fail();
				done();
			},
			function(v) {
				assert.equals(v, 2);
				done();
			}
		);
	},

	'should propagate the unaltered resolution value': function(done) {
		var c = cancelable(when.defer(), function() { return false; });
		c.resolve(true);

		c.then(
			function(val) {
				assert(val);
				done();
			},
			function() {
				buster.fail();
				done();
			}
		);
	},

	'should call progback for cancelable deferred': function(done) {
		var expected, c;

		expected = {};
		c = cancelable(when.defer());

		c.then(null, null, function (status) {
			assert.same(status, expected);
			done();
		});

		c.progress(expected);
	}

});

})(
	this.buster || require('buster'),
	this.when || require('..'),
	this.when_cancelable || require('../cancelable')
);
