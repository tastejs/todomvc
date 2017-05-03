(function(buster, wire) {
"use strict";

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

buster.testCase('base:module', {
	'should use module exports value as component': function(done) {
		wire({
			test: {
				module: 'test/node/fixtures/module'
			}
		}).then(
			function(context) {
				assert(context.test.success);
			},
			fail
		).then(done, done);
	}
});

})(
	require('buster'),
	require('../../../wire')
);