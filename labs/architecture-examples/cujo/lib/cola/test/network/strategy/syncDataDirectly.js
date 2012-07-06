(function (buster, require) {

var assert, refute, undef;

assert = buster.assert;
refute = buster.refute;

var syncDataDirectly = require('../../../network/strategy/syncDataDirectly');

function FakeApi (phase) {
	return {
		phase: phase,
		isBefore: function () {
			return this.phase == 'before';
		}
	};
}

function FakeAdapter () {
	return {
		add: function () {},
		forEach: function () {}
	};
}

buster.testCase('cola/network/strategy/syncDataDirectly', {

	'should return a function': function () {
		assert.isFunction(syncDataDirectly());
	},
	'should always cancel a "sync"': function () {
		var strategy = syncDataDirectly(),
			api = new FakeApi('before');
		api.cancel = this.spy();
		strategy(new FakeAdapter(), new FakeAdapter(), {}, 'sync', api);
		assert.called(api.cancel);
	},
	'// should have more tests': function () {
		assert(false);
	}

});
})( require('buster'), require );
