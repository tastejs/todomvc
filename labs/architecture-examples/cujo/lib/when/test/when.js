(function(buster, when) {

var assert = buster.assert;
var refute = buster.refute;

function identity(val) { return val; }
function constant(val) { return function() { return val; }; }

var fakePromise = new FakePromise();

// Untrusted, non-Promises/A-compliant promise
function FakePromise(val) {
	this.then = function (cb) {
		if (cb) cb(val);
		return this;
	};
}

buster.testCase('when', {
	'should return a promise for a value': function() {
		var result = when(1);
		assert(typeof result.then == 'function');
	},

	'should return a promise for a promise': function() {
		var result = when(fakePromise);
		assert(typeof result.then == 'function');
	},

	'should not return the input promise': function() {
		var result = when(fakePromise, identity);
		assert(typeof result.then == 'function');
		refute.same(result, fakePromise);
	},

	'should return a promise that forwards for a value': function(done) {
		var result = when(1, constant(2));

		assert(typeof result.then == 'function');

		result.then(
			function(val) {
				assert.equals(val, 2);
				done();
			},
			function(e) {
				buster.fail(e);
			}
		);
	},

	'should support deep nesting in promise chains': function(done) {
		var d, result;

		d = when.defer();
		d.resolve(false);

		result = when(when(d.then(function(val) {
			var d = when.defer();
			d.resolve(val);
			return when(d.then(identity), identity).then(
				function(val) {
					return !val;
				}
			);
		})));

		result.then(
			function(val) {
				assert(val);
				done();
			},
			function(e) {
				buster.fail(e);
			}
		);


	},

	'should return a resolved promise for a resolved input promise': function(done) {
		var d, result;

		d = when.defer();
		d.resolve(true);

		result = when(d);

		result.then(
			function(val) {
				assert(val);
				done();
			},
			function(e) {
				buster.fail(e);
			}
		);
	},

	'should assimilate untrusted promises':function () {
		var untrusted, result;

		// unstrusted promise should never be returned by when()
		untrusted = new FakePromise();
		result = when(untrusted);

		refute.equals(result, untrusted);
		refute(result instanceof FakePromise);
	},

	'should assimilate intermediate promises returned by callbacks':function (done) {
		var result;

		// untrusted promise returned by an intermediate
		// handler should be assimilated
		result = when(1,
			function (val) {
				return new FakePromise(val + 1);
			}
		).then(
			function (val) {
				assert.equals(val, 2);
				done();
			},
			function (err) {
				buster.fail(err);
				done();
			}
		);

		refute(result instanceof FakePromise);
	},

	'should assimilate intermediate promises and forwards results':function (done) {
		var untrusted, result;

		untrusted = new FakePromise(1);

		result = when(untrusted, function (val) {
			return new FakePromise(val + 1);
		});

		refute.equals(result, untrusted);
		refute(result instanceof FakePromise);

		when(result,
			function (val) {
				assert.equals(val, 2);
				return new FakePromise(val + 1);
			}
		).then(
			function (val) {
				assert.equals(val, 3);
				done();
			},
			function (err) {
				buster.fail(err);
				done();
			}
		);
	}

});
})(
	this.buster || require('buster'),
	this.when   || require('..')
);
