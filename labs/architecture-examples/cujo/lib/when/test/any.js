(function(buster, when) {

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function contains(array, item) {
	for(var i=array.length - 1; i >= 0; --i) {
		if(array[i] === item) {
			return true;
		}
	}

	return false;
}

function resolved(val) {
	var d = when.defer();
	d.resolve(val);
	return d.promise;
}

function rejected(val) {
	var d = when.defer();
	d.reject(val);
	return d.promise;
}

buster.testCase('when.any', {

	'should resolve to undefined with empty input array': function(done) {
		when.any([],
			function(result) {
				refute.defined(result);
			},
			fail
		).then(done, done);
	},

	'should resolve with an input value': function(done) {
		var input = [1, 2, 3];
		when.any(input,
			function(result) {
				assert(contains(input, result));
			},
			fail
		).then(done, done);
	},

	'should resolve with a promised input value': function(done) {
		var input = [resolved(1), resolved(2), resolved(3)];
		when.any(input,
			function(result) {
				assert(contains([1, 2, 3], result));
			},
			fail
		).then(done, done);
	},

	'should reject with a rejected input value': function(done) {
		var input = [rejected(1), resolved(2), resolved(3)];
		when.any(input,
			fail,
			function(result) {
				assert.equals(result, 1);
			}
		).then(done, done);
	},

	'should resolve when first input promise resolves': function(done) {
		var input = [resolved(1), rejected(2), rejected(3)];
		when.any(input,
			function(result) {
				assert.equals(result, 1);
			},
			fail
		).then(done, done);
	},

	'should throw if called with something other than a valid input plus callbacks': function() {
		assert.exception(function() {
			when.any(1, 2, 3);
		});
	},

	'should accept a promise for an array': function(done) {
		var expected, input;

		expected = [1, 2, 3];
		input = resolved(expected);

		when.any(input,
			function(result) {
				assert.equals(result, 1);
			},
			fail
		).then(done, done);
	},

	'should allow zero handlers': function(done) {
		var input = [1, 2, 3];
		when.any(input).then(
			function(result) {
				assert(contains(input, result));
			},
			fail
		).then(done, done);
	},

	'should resolve to undefined when input promise does not resolve to array': function(done) {
		when.any(resolved(1),
			function(result) {
				refute.defined(result);
			},
			fail
		).then(done, done);
	}

});

})(
	this.buster || require('buster'),
	this.when   || require('..')
);
