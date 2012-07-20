(function(buster, createContext) {
"use strict";

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

buster.testCase('context', {

	'initializers': {
		'should execute when context is created': function(done) {
			var executed = false;
			createContext({}, null, {
				require: require,
				init: function() { executed = true; }
			}).then(
				function() {
					assert(executed);
				}
			).then(done, done);
		}
	},

	'destroyers': {
		'should execute when context is destroyed': function(done) {
			var executed = false;
			createContext({}, null, {
				require: require,
				destroy: function() { executed = true; }
			}).then(
				function(context) {
					refute(executed);

					context.destroy().then(
						function() {
							assert(executed);
						}
					);
				}
			).then(done, done);
		}
	},

	'initializers and destroyers': {
		'should execute in correct order': function(done) {
		var init, destroy;
			createContext({}, null, {
				require: require,
				init: function() {
					refute(init);
					refute(destroy);
					init = true;
				},
				destroy: function() {
					assert(init);
					refute(destroy);
					destroy = true;
				}
			}).then(
				function(context) {
					// Should not have executed yet
					refute(destroy);

					return context.destroy().then(
						function() {
							assert(destroy);
						}
					);
				}
			).then(done, done);
		}
	}
});

})(
	require('buster'),
	require('../../lib/context')
);