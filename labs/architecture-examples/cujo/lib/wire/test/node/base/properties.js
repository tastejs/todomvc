(function(buster, wire) {
"use strict";

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

buster.testCase('base:properties', {

	'should set object properties': function(done) {
		wire({
			c: {
				literal: {},
				properties: {
					success: true
				}
			}
		}).then(
			function(context) {
				assert(context.c.success);
			},
			fail
		).then(done, done);
	}
});

})(
	require('buster'),
	require('../../../wire')
);