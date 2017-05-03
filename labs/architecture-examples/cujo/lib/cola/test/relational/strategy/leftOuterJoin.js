(function(buster, createLeftOuterJoin, hashJoin) {
"use strict";

var assert, refute, origLeftOuterJoin;

assert = buster.assert;
refute = buster.refute;

function noop() {}

function fakeIterable() {
	return {
		forEach: noop
	};
}

buster.testCase('relational/strategy/leftOuterJoin', {

	setUp: function() {
		origLeftOuterJoin = hashJoin.leftOuterJoin;
		hashJoin.leftOuterJoin = this.spy();
	},

	tearDown: function() {
		hashJoin.leftOuterJoin = origLeftOuterJoin;
	},

	'should throw if options not provided': function() {
		assert.exception(function() {
			createLeftOuterJoin();
		});
	},

	'should throw if options.leftKey not provided': function() {
		assert.exception(function() {
			createLeftOuterJoin({});
		});
	},

	'should return a function if options.leftKey is provided': function() {
		assert.isFunction(createLeftOuterJoin({ leftKey: 'id' }));
	},

	'should return a function that forwards parameters to join engine': function() {
		var join, left, right;

		join = createLeftOuterJoin({ leftKey: noop, rightKey: noop, projection: noop, multiValue: true });
		left = this.stub(fakeIterable());
		right = this.stub(fakeIterable());

		join(left, right);

		assert.calledOnceWith(hashJoin.leftOuterJoin, left, noop, right, noop, noop, true);
	}
});

})(
	require('buster'),
	require('../../../relational/strategy/leftOuterJoin'),
	require('../../../relational/hashJoin')
);