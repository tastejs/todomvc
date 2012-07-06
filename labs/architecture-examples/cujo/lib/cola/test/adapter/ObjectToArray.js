(function(buster, when, delay, WidenAdapter) {

var assert, refute;

assert = buster.assert;
refute = buster.refute;

buster.testCase('adapter/ObjectToArray', {

	'should throw if transform not supplied': function() {
		assert.exception(function() {
			new WidenAdapter({});
		})
	},

	'forEach': {
		'should iterate over all items': function() {
			var a, spy;

			a = new WidenAdapter(
				{ array: [{ id: 1 }, { id: 2 }] },
				{ transform: function(o) { return o.array; } }
			);

			spy = this.spy();

			a.forEach(spy);

			assert.calledTwice(spy);
			assert.calledWith(spy, { id: 1 });
			assert.calledWith(spy, { id: 2 });
		}
	}
});
})(
	require('buster'),
	require('when'),
	require('when/delay'),
	require('../../adapter/ObjectToArray')
);