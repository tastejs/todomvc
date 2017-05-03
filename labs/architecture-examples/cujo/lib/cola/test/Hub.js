(function (buster, require) {

var assert, refute, undef;

assert = buster.assert;
refute = buster.refute;

var Hub = require('../Hub');
var ArrayAdapter = require('../adapter/Array');

buster.testCase('cola/Hub', {

	'should not fail if not given any constructor params': function () {
		refute.exception(function () {
			new Hub();
		});
	},
	'should add methods for eventNames': function () {
		var h = new Hub();
		// this isn't a complete list, but proves the mechanism basically works
		assert.isObject(h);
		assert.isFunction(h.add);
		assert.isFunction(h.beforeAdd);
		assert.isFunction(h.onAdd);
		assert.isFunction(h.update);
		assert.isFunction(h.beforeUpdate);
		assert.isFunction(h.onUpdate);
		assert.isFunction(h.remove);
		assert.isFunction(h.beforeRemove);
		assert.isFunction(h.onRemove);
	},
	'should return an adapter when calling addSource with a non-adapter': function () {
		var h = new Hub();
		var a = h.addSource([]);
		// sniff for an adapter
		assert.isObject(a);
		assert.isFunction(a.add);
	},
	'should pass through an adapter when calling addSource with an adapter': function () {
		var h = new Hub();
		var adapter = new ArrayAdapter([], {});
		var a = h.addSource(adapter);
		// sniff for an adapter
		assert.same(a, adapter);
	},
	'should override adapter default provide via options': function() {
		var h = new Hub();
		var defaultProvide = true;
		var a = h.addSource([], { provide: false });
		// sniff for an adapter
		refute.equals(a.provide, defaultProvide);
	},
	'should find and add new event types from adapter': function () {
		var e = {}, h = new Hub({
			events: e
		});
		var adapter = new ArrayAdapter([]);
		adapter.crazyNewEvent = function () {};
		var a = h.addSource(adapter, {
			eventNames: function (name) { return /^crazy/.test(name); }
		});
		// check for method on hub api
		assert.isFunction(h.onCrazyNewEvent);
	},
	'should call findItem on each adapter': function () {
		var e = {}, h = new Hub({
			events: e
		});
		var adapter = new ArrayAdapter([]);
		adapter.findItem = this.spy();
		var a = h.addSource(adapter, {});
		h.findItem();
		// check that findItem was called
		assert.calledOnce(adapter.findItem);
	},
	'should call findNode on each adapter': function () {
		var e = {}, h = new Hub({
			events: e
		});
		var adapter = new ArrayAdapter([]);
		adapter.findNode = this.spy();
		var a = h.addSource(adapter, {});
		h.findNode();
		// check that findItem was called
		assert.calledOnce(adapter.findNode);
	},

	'should call strategy to join adapter': function () {
		var strategy = this.spy();
		var h = new Hub({
			strategy: strategy
		});

		h.onJoin = this.spy();

		h.addSource([]);

		// strategy should be called to join primary into network
		assert.calledOnce(h.onJoin);
	},
	'should not call events if strategy cancels event': function (done) {
		var h = new Hub({
			strategy: strategy
		});
		var primary = h.addSource([]);
		var isAfterCanceled;

		h.beforeAdd = this.spy();
		h.onAdd = function() {
			assert.calledOnce(h.beforeAdd);
			done();
		};

		primary.name = 'primary'; // debug
		primary.add({ id: 1 });

		assert(isAfterCanceled, 'last event should be canceled');

		function strategy (source, dest, data, type, api) {
			isAfterCanceled = api.isAfterCanceled();
			api.cancel();
		}
	},
	'should run queued event in next turn': function (done) {
		var h = new Hub({ strategy: strategy });
		var primary = h.addSource([]);
		var removeDetected;

		primary.add({ id: 1 });

		// ensure remove hasn't executed yet
		refute.defined(removeDetected);

		setTimeout(function () {
			assert.defined(removeDetected);
			done();
		}, 100);

		function strategy (source, dest, data, type, api) {
			if ('add' == type) {
				api.queueEvent(source, data, 'remove');
			}
			else if ('remove' == type) {
				removeDetected = true;
			}
		}
	},
	'// should add property transforms to adapter': function () {}

});
})( require('buster'), require );
