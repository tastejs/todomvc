(function(buster, when, hashJoin) {
"use strict";

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function identity(x) {
	return x;
}

function projectPair(left, right, key) {
	return { left: left, right: right, key: key };
}

buster.testCase('relational/hashJoin', {

	'leftOuterJoin': {
		'should produce empty result for empty left input': function(done) {
			var left, right;

			left = [];
			right = [1, 2, 3];

			when(hashJoin.leftOuterJoin(left, identity, right, identity, identity),
				function(joined) {
					assert.equals(joined, []);
				},
				fail
			).then(done, done);
		},

		'should contain all left items': function(done) {
			var left, right;

			left = [1, 2, 3];
			right = [2, 4, 6];

			when(hashJoin.leftOuterJoin(left, identity, right, identity, identity),
				function(joined) {
					assert.equals(joined, left);
				},
				fail
			).then(done, done);
		},

		'should produce left input for empty right input': function(done) {
			var left, right;

			left = [1, 2, 3];
			right = [];

			when(hashJoin.leftOuterJoin(left, identity, right, identity, identity),
				function(joined) {
					assert.equals(joined, left);
				},
				fail
			).then(done, done);
		},

		'should project all items': function(done) {
			var left, right;

			left = [1, 2, 3];
			right = [1, 2, 3, 4, 5, 6];

			when(hashJoin.leftOuterJoin(left, identity, right, identity, projectPair),
				function(joined) {
					assert.equals(joined.length, left.length);

					for(var i = 0, len = joined.length; i < len; i++) {
						assert.equals(joined[i], { left: left[i], right: right[i], key: left[i] });
					}
				},
				fail
			).then(done, done);

		}

	}
});

})(
	require('buster'),
	require('when'),
	require('../../relational/hashJoin')
);