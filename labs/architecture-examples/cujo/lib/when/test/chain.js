(function(buster, when) {

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

buster.testCase('when.chain', {
	'should return a promise for an input value': function() {
		var d, result;

		d = when.defer();

		result = when.chain(1, d.resolver);

		assert(typeof result.then == 'function');
		refute.equals(result, d);
		refute.equals(result, d.promise);
	},

	'should return a promise for an input promise': function() {
		var d1, d2, result;

		d1 = when.defer();
		d2 = when.defer();

		result = when.chain(d1.promise, d2.resolver);

		assert(typeof result.then == 'function');
		refute.equals(result, d1);
		refute.equals(result, d1.promise);
		refute.equals(result, d2);
		refute.equals(result, d2.promise);
	},

	'should resolve resolver with input value': function(done) {
		var d = when.defer();

		d.promise.then(
			function(val) { assert.equals(val, 1); },
			function() { fail('promise should not have rejected'); }
		).then(done, done);

		when.chain(1, d.resolver);
	},

	'should resolve resolver with input promise value': function(done) {
		var d, input;

		d = when.defer();

		d.promise.then(
			function(val) { assert.equals(val, 1); },
			function() { fail('promise should not have rejected'); }
		).then(done, done);

		input = when.defer();
		input.resolve(1);

		when.chain(input.promise, d.resolver);
	},

	'should resolve resolver with provided value when input is a value': function(done) {
		var d = when.defer();

		d.promise.then(
			function(val) { assert.equals(val, 2); },
			function() { fail('promise should not have rejected'); }
		).then(done, done);

		when.chain(1, d.resolver, 2);
	},

	'should resolve resolver with provided value when input is a promise': function(done) {
		var d, input;

		d = when.defer();

		d.promise.then(
			function(val) { assert.equals(val, 2); },
			function() { fail('promise should not have rejected'); }
		).then(done, done);

		input = when.defer();
		input.resolve(1);

		when.chain(input.promise, d.resolver, 2);
	},

	'should reject resolver with input promise rejection reason': function(done) {
		var d, input;

		d = when.defer();

		d.promise.then(
			function() { fail('promise should not have resolved'); },
			function (val) { assert.equals(val, 1); }
		).then(done, done);

		input = when.defer();
		input.reject(1);

		when.chain(input.promise, d.resolver);
	},

	'should reject resolver with input promise rejection reason when optional value provided': function(done) {
		var d, input;

		d = when.defer();

		d.promise.then(
			function() { fail('promise should not have resolved'); },
			function (val) { assert.equals(val, 1); }
		).then(done, done);

		input = when.defer();
		input.reject(1);

		when.chain(input.promise, d.resolver, 2);
	},

	'should return a preomise that resolves with the input promise resolution value': function(done) {
		var d, input;

		input = when.defer();
		d = when.defer();

		input.resolve(1);

		when.chain(input, d).then(
			function(val) { assert.equals(val, 1); },
			function() { fail('promise should not have rejected'); }
		).then(done, done);
	},

	'should return a preomise that resolves with the optional resolution value': function(done) {
		var d, input;

		input = when.defer();
		d = when.defer();

		input.resolve(1);

		when.chain(input, d, 2).then(
			function(val) { assert.equals(val, 2); },
			function() { fail('promise should not have rejected'); }
		).then(done, done);
	},

	'should return a promise that rejects with the input promise rejection value': function(done) {
		var d, input;

		input = when.defer();
		d = when.defer();

		input.reject(1);

		when.chain(input, d).then(
			function() { fail('promise should not have resolved'); },
			function(val) { assert.equals(val, 1); }
		).then(done, done);
	}

})

})(
	this.buster || require('buster'),
	this.when   || require('..')
);
