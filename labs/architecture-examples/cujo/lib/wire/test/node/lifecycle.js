(function(buster, wire, plugin) {
"use strict";

var assert, refute, fail, steps;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

steps = ['create', 'configure', 'initialize', 'connect', 'ready', 'destroy'];

buster.testCase('lifecycle', {
	setUp: function() {
		// Setup a plugin that will record lifecycle steps
		plugin.wire$plugin = function() {
			var instance, order;

			instance = {};
			order = 0;

			steps.forEach(function(step) {
				instance[step] = function(resolver, proxy) {
					if(!proxy.target.lifecycle) proxy.target.lifecycle = [];
					proxy.target.lifecycle.push(step);
					resolver.resolve();
				}
			});

			return instance;
		};
	},

	tearDown: function() {
		// Remove the plugin
		// Since this is a cached plugin
		delete plugin.wire$plugin;
	},

	'should process components in lifecycle step order': function(done) {
		wire({
			component: { module: './test/node/fixtures/object' }
		}).then(
			function(context) {
				var component = context.component;

				// Ensure that create thru ready happen in order, and that
				// destroy does not happen
				assert.equals(component.lifecycle, steps.slice(0, steps.length-1));

				// Ensure that destroy happens and is always last
				context.destroy().then(
					function() {
						assert.equals(component.lifecycle, steps);
					},
					fail
				).then(done, done);
			},
			fail
		);
	}
})

})(
	require('buster'),
	require('../..'),
	require('./fixtures/object')
);