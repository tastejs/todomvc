(function (buster, require) {

var assert, refute, undef;

assert = buster.assert;
refute = buster.refute;

var targetFirstItem = require('../../../network/strategy/targetFirstItem');

buster.testCase('targetFirstItem', {

	'should return function': function () {
		assert.isFunction(targetFirstItem([]));
	},
	'should call queueEvent once': function () {
		var qspy, src, data, api, strategy;

		qspy = this.spy();
		src = {};
		data = {};
		api = {
			isBefore: function () { return true; },
			queueEvent: qspy
		};

		// call twice:
		strategy = targetFirstItem();
		strategy(src, null, data, 'add', api);
		strategy(src, null, data, 'add', api);

		assert.calledOnceWith(qspy, src, data, 'target');

		// call twice again after sync
		qspy = api.queueEvent = this.spy();
		strategy(src, null, data, 'sync', api);
		strategy(src, null, data, 'add', api);
		strategy(src, null, data, 'add', api);

		assert.calledOnceWith(qspy, src, data, 'target');
	}

});
})( require('buster'), require );
