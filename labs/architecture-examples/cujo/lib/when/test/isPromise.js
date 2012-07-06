(function(buster, when) {

var fakePromise, undef;

fakePromise = {
	then:function () {}
};

function assertIsPromise(it) {
	buster.assert(when.isPromise(it));
}

function assertIsNotPromise(it) {
	buster.refute(when.isPromise(it));
}

buster.testCase('when.isPromise', {

	'should return true for promise': function() {
		assertIsPromise(fakePromise);
	},

	'should return false for non-promise': function() {
		var inputs = [
			1,
			0,
			'not a promise',
			true,
			false,
			undef,
			null,
			'',
			/foo/,
			{},
			new Object(),
			new RegExp('foo'),
			new Date(),
			new Boolean(),
			[],
			new Array()
		];

		for(var i = inputs.length - 1; i >= 0; --i) {
			assertIsNotPromise(inputs[i]);
		}
	},

	'should return true for delegated promise': function() {
		function T() {}

		T.prototype = fakePromise;
		assertIsPromise(new T());
	}
});

})(
	this.buster || require('buster'),
	this.when   || require('..')
);
