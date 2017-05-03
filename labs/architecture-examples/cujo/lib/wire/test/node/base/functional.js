(function(buster, wire) {
"use strict";

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function plusOne(x) {
	return x+1;
}

function Thing(x) {
	this.x = x;
}

Thing.prototype = {
	f: function(x) {
		return this.x + x;
	}
};

buster.testCase('base:functional', {
	
	'compose': {
		'should compose array of functions': function(done) {
			wire({
				f1: plusOne,
				f2: plusOne,
				composed: {
					compose: [
						{ $ref: 'f1' },
						{ $ref: 'f2' }
					]
				}
			}).then(
				function(c) {
					assert.equals(c.composed(1), 3);
				}
			).then(done, done);
		},
		
		'should compose a string specification': function(done) {
			wire({
				f1: plusOne,
				f2: plusOne,
				composed: {
					compose: 'f1 | f2'
				}
			}).then(
				function(c) {
					assert.equals(c.composed(1), 3);
				}
			).then(done, done);
		},

		'should compose a string specification with single function': function(done) {
			wire({
				f1: plusOne,
				composed: {
					compose: 'f1'
				}
			}).then(
				function(c) {
					assert.equals(c.composed(1), 2);
				}
			).then(done, done);
		},

		'should compose a string specification with contexts': function(done) {
			wire({
				f1: plusOne,
				t1: { literal: new Thing(1) },
				t2: { literal: new Thing(1) },
				composed: {
					compose: 't1.f | f1 | t2.f'
				}
			}).then(
				function(c) {
					assert.equals(c.composed(1), 4);
				}
			).then(done, done);
		}

	}
});
})(
	require('buster'),
	require('../../../wire')
);