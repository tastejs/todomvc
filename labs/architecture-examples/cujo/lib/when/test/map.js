(function(buster, when) {

var assert, fail;

assert = buster.assert;
fail = buster.assertions.fail;

function mapper(val) {
	return val * 2;
}

function deferredMapper(val) {
	var d = when.defer();

	setTimeout(function() {
		d.resolve(mapper(val));
	}, Math.random() * 10);

	return d.promise;
}

function resolved(val) {
	var d = when.defer();
	d.resolve(val);
	return d.promise;
}

buster.testCase('when.map', {

	'should map input values array': function(done) {
		var input = [1, 2, 3];
		when.map(input, mapper).then(
			function(results) {
				assert.equals(results, [2,4,6]);
			},
			fail
		).then(done, done);
	},

	'should map input promises array': function(done) {
		var input = [resolved(1), resolved(2), resolved(3)];
		when.map(input, mapper).then(
			function(results) {
				assert.equals(results, [2,4,6]);
			},
			fail
		).then(done, done);
	},

	'should map mixed input array': function(done) {
		var input = [1, resolved(2), 3];
		when.map(input, mapper).then(
			function(results) {
				assert.equals(results, [2,4,6]);
			},
			fail
		).then(done, done);
	},

	'should map input when mapper returns a promise': function(done) {
		var input = [1,2,3];
		when.map(input, deferredMapper).then(
			function(results) {
				assert.equals(results, [2,4,6]);
			},
			fail
		).then(done, done);
	},

	'should accept a promise for an array': function(done) {
		when.map(resolved([1, resolved(2), 3]), mapper).then(
			function(result) {
				assert.equals(result, [2,4,6]);
			},
			fail
		).then(done, done);
	},

	'should resolve to empty array when input promise does not resolve to an array': function(done) {
		when.map(resolved(123), mapper).then(
			function(result) {
				assert.equals(result, []);
			},
			fail
		).then(done, done);
	},

	'should map input promises when mapper returns a promise': function(done) {
		var input = [resolved(1),resolved(2),resolved(3)];
		when.map(input, deferredMapper).then(
			function(results) {
				assert.equals(results, [2,4,6]);
			},
			fail
		).then(done, done);
	}

});
})(
	this.buster || require('buster'),
	this.when   || require('..')
);
