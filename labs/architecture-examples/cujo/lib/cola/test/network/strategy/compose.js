(function (buster, require) {

var assert, refute, compose, mockApi, undef;

assert = buster.assert;
refute = buster.refute;

compose = require('../../../network/strategy/compose');

mockApi = {
	isCanceled: function () { return this.canceled; },
	cancel: function () { this.canceled = true; },
	isHandled: function () { return this.handled; },
	handle: function () { this.handled = true; }
};

buster.testCase('cola/network/strategy/compose', {

	'should return function': function () {
		assert.isFunction(compose([]));
	},
	'should call each of the strategies': function () {
		var strategies;

		strategies = [
			this.spy(),
			this.spy(),
			this.spy()
		];

		compose(strategies)({}, {}, {}, '', Object.create(mockApi));

		assert.called(strategies[0]);
		assert.called(strategies[1]);
		assert.called(strategies[2]);
	},
	'should call the strategies in order': function () {
		var strategies;

		strategies = [
			this.spy(),
			this.spy(),
			this.spy()
		];

		compose(strategies)({}, {}, {}, '', Object.create(mockApi));

		assert.callOrder(strategies[0], strategies[1], strategies[2]);
	},
	'should not proceed past strategy that cancels': function () {
		var strategies;

		strategies = [
			this.spy(),
			function (src, dst, data, type, api) { api.cancel(); },
			this.spy()
		];

		compose(strategies)({}, {}, {}, '', Object.create(mockApi));

		assert.called(strategies[0]);
		refute.called(strategies[2]);
	}

});
})( require('buster'), require );
