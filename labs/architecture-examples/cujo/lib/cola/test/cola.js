(function(buster, when, cola) {
"use strict";

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function resolver(resolve, reject) {
	return {
		resolve: resolve,
		reject: reject
	}
}

buster.testCase('cola', {

	'wire plugin': {
		'should return a valid plugin': function() {
			var plugin = cola.wire$plugin(null, null, {});
			assert.isFunction(plugin.facets.bind.ready);
		},

		'should fail if "to" not provided': function() {
			var plugin, bind, wire, rejected;

			plugin = cola.wire$plugin(null, null, {});
			bind = plugin.facets.bind.ready;

			wire = this.stub().returns({});

			rejected = this.spy();

			bind(resolver(null, rejected), { target: {} }, wire);

			assert.calledOnce(rejected);
		},

		'should wire options': function() {
			var plugin, bind, wire, resolved;

			plugin = cola.wire$plugin(null, null, {});
			bind = plugin.facets.bind.ready;

			wire = this.stub().returns({
				to: { addSource: this.spy() }
			});

			resolved = this.spy();

			bind(resolver(resolved), { target: {} }, wire);

			assert.calledOnce(wire);
			assert.calledOnce(resolved);
		},

		'should add source': function() {
			var plugin, bind, wire, addSource, target;

			plugin = cola.wire$plugin(null, null, {});
			bind = plugin.facets.bind.ready;

			addSource = this.spy();
			wire = this.stub().returns({
				to: { addSource: addSource }
			});

			target = {};
			bind(resolver(this.spy()), { target: target }, wire);

			assert.calledOnceWith(addSource, target);
		},

		'should include default comparator if not provided': function() {
			var plugin, bind, wire, resolved, wired;

			plugin = cola.wire$plugin(null, null, {});
			bind = plugin.facets.bind.ready;

			wire = function(s) { wired = s; };

			resolved = this.spy();

			bind(resolver(resolved), { target: {} }, wire);

			assert.isFunction(wired.comparator);
		}
	}

});
})(
	require('buster'),
	require('when'),
	require('../cola')
);
