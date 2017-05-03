(function(buster, when) {

var assert, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

var defer, isFrozen, undef;

defer = when.defer;

function f() {}

// In case of testing in an environment without Object.isFrozen
isFrozen = Object.isFrozen || function() { return true; };

buster.testCase('promise', {

	'should be frozen': function() {
		assert(Object.isFrozen(defer().promise));
	},

	'should return a promise': function() {
		assert.isFunction(defer().promise.then().then);
	},

	'should allow a single callback function': function() {
		assert.isFunction(defer().promise.then(f).then);
	},

	'should allow a callback and errback function': function() {
		assert.isFunction(defer().promise.then(f, f).then);
	},

	'should allow a callback, errback, and progback function': function() {
		assert.isFunction(defer().promise.then(f, f, f).then);
	},

	'should allow null and undefined': function() {
		assert.isFunction(defer().promise.then().then);

		assert.isFunction(defer().promise.then(null).then);
		assert.isFunction(defer().promise.then(null, null).then);
		assert.isFunction(defer().promise.then(null, null, null).then);

		assert.isFunction(defer().promise.then(undef).then);
		assert.isFunction(defer().promise.then(undef, undef).then);
		assert.isFunction(defer().promise.then(undef, undef, undef).then);
	},

	'should allow functions and null or undefined to be mixed': function() {
		assert.isFunction(defer().promise.then(f, null).then);
		assert.isFunction(defer().promise.then(f, null, null).then);
		assert.isFunction(defer().promise.then(null, f).then);
		assert.isFunction(defer().promise.then(null, f, null).then);
		assert.isFunction(defer().promise.then(null, null, f).then);
	},

	'should forward result when callback is null': function(done) {
		var d = when.defer();

		d.promise.then(
			null,
			fail
		).then(
			function(val) {
				assert.equals(val, 1);
			},
			fail
		).then(done, done);

		d.resolve(1);
	},

	'should forward callback result to next callback': function(done) {
		var d = when.defer();

		d.promise.then(
			function(val) {
				return val + 1;
			},
			fail
		).then(
			function(val) {
				assert.equals(val, 2);
			},
			fail
		).then(done, done);

		d.resolve(1);
	},

	'should forward undefined': function(done) {
		var d = when.defer();

		d.promise.then(
			function() {
				// intentionally return undefined
			},
			fail
		).then(
			function(val) {
				refute.defined(val);
			},
			fail
		).then(done, done);

		d.resolve(1);
	},

	'should forward undefined rejection value': function(done) {
		var d = when.defer();

		d.promise.then(
			fail,
			function() {
				// presence of rejection handler is enough to switch back
				// to resolve mode, even though it returns undefined.
				// The ONLY way to propagate a rejection is to re-throw or
				// return a rejected promise;
			}
		).then(
			function(val) {
				refute.defined(val);
			},
			fail
		).then(done, done);

		d.reject(1);
	},

	'should forward promised callback result value to next callback': function(done) {
		var d = when.defer();

		d.promise.then(
			function(val) {
				var d = when.defer();
				d.resolve(val + 1);
				return d.promise;
			},
			fail
		).then(
			function(val) {
				assert.equals(val, 2);
			},
			fail
		).then(done, done);

		d.resolve(1);
	},

	'should switch from callbacks to errbacks when callback returns a rejection': function(done) {
		var d = when.defer();

		d.promise.then(
			function(val) {
				var d = when.defer();
				d.reject(val + 1);
				return d.promise;
			},
			fail
		).then(
			fail,
			function(val) {
				assert.equals(val, 2);
			}
		).then(done, done);

		d.resolve(1);
	},

	'should switch from callbacks to errbacks when callback throws': function(done) {
		var d = when.defer();

		d.promise.then(
			function(val) {
				throw val + 1;
			},
			fail
		).then(
			fail,
			function(val) {
				assert.equals(val, 2);
			}
		).then(done, done);

		d.resolve(1);
	},

	'should switch from errbacks to callbacks when errback does not explicitly propagate': function(done) {
		var d = when.defer();

		d.promise.then(
			fail,
			function(val) {
				return val + 1;
			}
		).then(
			function(val) {
				assert.equals(val, 2);
			},
			fail
		).then(done, done);

		d.reject(1);
	},

	'should switch from errbacks to callbacks when errback returns a resolution': function(done) {
		var d = when.defer();

		d.promise.then(
			fail,
			function(val) {
				var d = when.defer();
				d.resolve(val + 1);
				return d.promise;
			}
		).then(
			function(val) {
				assert.equals(val, 2);
			},
			fail
		).then(done, done);

		d.reject(1);
	},

	'should propagate rejections when errback throws': function(done) {
		var d = when.defer();

		d.promise.then(
			fail,
			function(val) {
				throw val + 1;
			}
		).then(
			fail,
			function(val) {
				assert.equals(val, 2);
			}
		).then(done, done);

		d.reject(1);
	},

	'should propagate rejections when errback returns a rejection': function(done) {
		var d = when.defer();

		d.promise.then(
			fail,
			function(val) {
				var d = when.defer();
				d.reject(val + 1);
				return d.promise;
			}
		).then(
			fail,
			function(val) {
				assert.equals(val, 2);
			}
		).then(done, done);

		d.reject(1);
	},

	'should call progback': function(done) {
		var expected, d;

		expected = {};
		d = when.defer();

		d.promise.then(null, null, function (status) {
			assert.same(status, expected);
			done();
		});

		d.progress(expected);
	},

	'always': {
		'should return a promise': function() {
			assert.isFunction(defer().promise.always().then);
		},

		'should register callback': function(done) {
			var d = when.defer();

			d.promise.always(
				function(val) {
					assert.equals(val, 1);
					done();
				}
			);

			d.resolve(1);
		},

		'should register errback': function(done) {
			var d = when.defer();

			d.promise.always(
				function(val) {
					assert.equals(val, 1);
					done();
				}
			);

			d.reject(1);
		},

		'should register progback': function(done) {
			var d = when.defer();

			d.promise.always(null, function (status) {
				assert.equals(status, 1);
				done();
			});

			d.progress(1);
		}

	},

	'otherwise': {
		'should return a promise': function() {
			assert.isFunction(defer().promise.otherwise().then);
		},

		'should register errback': function(done) {
			var d = when.defer();

			d.promise.otherwise(
				function(val) {
					assert.equals(val, 1);
					done();
				}
			);

			d.reject(1);
		}
	}

});
})(
	this.buster || require('buster'),
	this.when   || require('..')
);
