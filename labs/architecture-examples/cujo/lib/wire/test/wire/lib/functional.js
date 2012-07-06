(function(buster, functional) {

var assert, refute, fail;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

buster.testCase('lib/functional', {

	'partial': {
		'should return a function': function() {
			assert.isFunction(functional.partial(function() {}));
			assert.isFunction(functional.partial(function() {}, 1));
		},

		'should bind arguments': function() {
			function f(a, b) {
				assert.equals(a, 1);
				assert.equals(b, 2);
			}

			functional.partial(f, 1)(2);
		}
	},

	'weave': {
		'should return a function': function() {
			assert.isFunction(functional.weave(function() {}, {}));
		},

		'should weave arguments defined with sparse arrays': function() {
			function f(a, b) {
				assert.equals(a, 1);
				assert.equals(b, 2);
			}

			functional.weave(f, [1])(2);
			functional.weave(f, [,2])(1);
			functional.weave(f, [])(1, 2);
			functional.weave(f, [1, 2])();
		},

		'should weave arguments defined with array-like objects': function() {
			function f(a, b) {
				assert.equals(a, 1);
				assert.equals(b, 2);
			}

			functional.weave(f, { 0: 1 })(2);
			functional.weave(f, { 1: 2 })(1);
			functional.weave(f, {})(1, 2);
			functional.weave(f, { 0: 1, 1: 2 })();
		}
	},

	'compose': {
		'should return a function': function() {
			assert.isFunction(functional.compose([function() {}]));
			assert.isFunction(functional.compose([function() {}, function() {}]));
			assert.isFunction(functional.compose([function() {}], {}));
			assert.isFunction(functional.compose([function() {}, function() {}], {}));
		},

		'should invoke originals left to right': function() {
			function f(x) { return x + 'f'; }
			function g(x) { return x + 'g'; }

			assert.equals(functional.compose([f, g])('a'), 'afg');
		},

		'should not change context': function() {
			function f(x) { return this; }

			assert.equals(functional.compose([f]).bind('a')(), 'a');

		}
	}

});

})(
	require('buster'),
	require('../../../lib/functional.js')
);