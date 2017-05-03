(function(buster, delay, wire, pluginModule) {
"use strict";

var assert, refute, plugin, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

plugin = {
	ready: function(resolver, proxy) {
		proxy.target.success = true;
		resolver.resolve();
	}
};

buster.testCase('plugin', {
	tearDown: function() {
		// Remove the plugin
		// Since this is a cached plugin
		delete pluginModule.wire$plugin;
	},

	'sync-init': {
		setUp: function() {
			// Setup a plugin that will record lifecycle steps
			pluginModule.wire$plugin = function() {
				return plugin;
			};
		},

		'should initialize': function(done) {
			wire({
				plugin: { module: './test/node/fixtures/object' }
			}).then(
				function(context) {
					assert(context.plugin.success);
				},
				fail
			).then(done, done);
		}

	},

	'async-init': {
		setUp: function() {
			// Setup a plugin that will record lifecycle steps
			pluginModule.wire$plugin = function() {
				return delay(plugin, 0);
			};
		},

		'should initialize': function(done) {
			wire({
				plugin: { module: './test/node/fixtures/object' }
			}).then(
				function(context) {
					assert(context.plugin.success);
				},
				fail
			).then(done, done);
		}
	}
});
})(
	require('buster'),
	require('when/delay'),
	require('../..'),
	require('./fixtures/object')
);